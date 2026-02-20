import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase env variables.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
});

const PERMITTED_STORES = [
    'test-fashion',
    'test-beauty',
    'test-electronics',
    'test-home',
    'test-health',
    'test-spiritual',
    'test-furniture',
    'test-food',
    'test-dropshipping',
    'test-multi'
];

const PERMITTED_EMAIL = 'test@e4a.in';

async function cleanup() {
    console.log('🧹 Starting Database Cleanup...');
    console.log(`🔒 Protecting 10 test subdomains and user ${PERMITTED_EMAIL}`);

    // 1. DELETE NON-PERMITTED STORES
    // The cascading deletes set up in Supabase (ON DELETE CASCADE) on products, variants, 
    // categories, domains, orders, etc will automatically wipe all associated store data when the store is dropped.
    const { data: storesToDelete, error: fetchError } = await supabase
        .from('stores')
        .select('id, name, domain')
        // Using `not.in` to match against our protected list
        .not('domain', 'in', `(${PERMITTED_STORES.join(',')})`);

    if (fetchError) {
        console.error("Error fetching stores to delete:", fetchError);
        process.exit(1);
    }

    if (storesToDelete && storesToDelete.length > 0) {
        console.log(`Found ${storesToDelete.length} stores to delete. Proceeding...`);
        const storeIdsToDelete = storesToDelete.map(s => s.id);

        const { error: deleteStoresError } = await supabase
            .from('stores')
            .delete()
            .in('id', storeIdsToDelete);

        if (deleteStoresError) {
            console.error("❌ Failed to delete legacy stores:", deleteStoresError);
        } else {
            console.log(`✅ Successfully wiped ${storesToDelete.length} legacy stores and their cascading data.`);
        }
    } else {
        console.log('✅ No legacy stores found to delete. The 10 test stores are the only ones active.');
    }

    // 2. DELETE NON-PERMITTED USERS (Excluding the Super Admin and our Test User)
    const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();

    if (usersError) {
        console.error("Error fetching users:", usersError);
    } else {
        const usersToDelete = usersData.users.filter(u =>
            u.email !== PERMITTED_EMAIL &&
            u.email !== 'shashwat.s@e4a.in' && // Assuming this might be your live super admin
            // Also protect any system admin roles
            u.role !== 'service_role'
        );

        if (usersToDelete.length > 0) {
            console.log(`Found ${usersToDelete.length} legacy users. Proceeding to delete...`);
            let deletedCount = 0;
            for (const user of usersToDelete) {
                const { error: delUserErr } = await supabase.auth.admin.deleteUser(user.id);
                if (!delUserErr) deletedCount++;
            }
            console.log(`✅ Successfully wiped ${deletedCount} legacy users.`);
        } else {
            console.log('✅ No legacy users to delete.');
        }
    }

    console.log('🎉 Cleanup Complete. The matrix is pure.');
}

cleanup().catch(console.error);
