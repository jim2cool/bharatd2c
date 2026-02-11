import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function verifyIsolation() {
    const email = 'test_dashboard_1770809832171@example.com' // Use user from previous step
    const password = 'Password123!'

    console.log('1. Signing in...')
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
    })

    if (authError) {
        console.error('Login failed:', authError.message)
        return
    }

    console.log('Logged in as:', authData.user.id)

    // 2. Create a store for this user via Admin (to simulate ownership)
    // Actually, let's try to create it via the CLIENT (RLS permitting)
    // But wait, stores table might have RLS "insert authenticated".
    console.log('2. Creating a store...')
    const { data: store, error: createError } = await supabase
        .from('stores')
        .insert({
            name: 'Isolation Test Store',
            slug: `iso-test-${Date.now()}`,
            owner_id: authData.user.id,
            is_active: true
        })
        .select()
        .single()

    if (createError) {
        console.error('Store creation failed (RLS might clearly block or allow):', createError)
        // If client creation fails, use admin to create it, then test READ isolation
        // Importing admin client here would require mixing contexts, better to rely on what we have.
        // Let's assume we can create it.
    } else {
        console.log('Store created:', store.id)
    }

    // 3. Query Stores as this user
    console.log('3. Querying stores table as user...')
    const { data: stores, error: queryError } = await supabase
        .from('stores')
        .select('*')
    //.eq('owner_id', authData.user.id) // IMPORTANT: We are NOT adding the filter here to test RLS!
    // If strict RLS is on, this should return ONLY my store. 
    // If RLS is weak, this might return ALL stores.
    // BUT wait, my "fix" was in the Frontend Code (admin/stores/page.tsx).
    // So this script tests the *Database* layer. 
    // The user asked "Critical that we get store ownership right".
    // If I didn't add RLS, this script will show ALL stores. 

    if (queryError) {
        console.error('Query failed:', queryError)
    } else {
        console.log(`Found ${stores.length} stores.`)
        stores.forEach(s => console.log(`- ${s.name} (Owner: ${s.owner_id})`))

        const othersStores = stores.filter(s => s.owner_id !== authData.user.id)
        if (othersStores.length > 0) {
            console.error('❌ SECURITY FAIL: User can see other people\'s stores!')
        } else {
            console.log('✅ SUCCESS: User only sees their own stores (or none if RLS blocks completely without filter).')
        }
    }
}

verifyIsolation()
