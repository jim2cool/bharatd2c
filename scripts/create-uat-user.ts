
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function createTestUser() {
    const email = `uat_seller_${Date.now()}@example.com`;
    const password = 'Password123!';

    console.log(`Creating test user: ${email}`);

    const { data, error } = await supabase.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true,
        user_metadata: { role: 'store_owner' }
    });

    if (error) {
        console.error('Error creating user:', error);
        return;
    }

    console.log('User created successfully:', data.user.id);

    // Create profile
    const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
            id: data.user.id,
            email: email,
            role: 'store_owner'
        });

    if (profileError) {
        console.error('Error creating profile:', profileError);
    } else {
        console.log('Profile created successfully');
        console.log('\n--- CREDENTIALS ---');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log('-------------------\n');
    }
}

createTestUser();
