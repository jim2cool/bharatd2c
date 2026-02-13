
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing Supabase environment variables')
    process.exit(1)
}

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function createTestUsers() {
    console.log('Creating test users...')

    // 1. Create Super Admin
    const adminEmail = 'admin@test.com'
    const adminPassword = 'password123'

    console.log(`Creating Super Admin: ${adminEmail}`)
    let { data: adminUser, error: adminError } = await supabase.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true
    })

    if (adminError) {
        console.log(`Admin user might already exist: ${adminError.message}`)
        // Try to fetch existing user
        const { data } = await supabase.from('profiles').select('id').eq('email', adminEmail).single()
        if (data) adminUser = { user: { id: data.id } } as any
    }

    if (adminUser?.user) {
        // Upsert profile
        const { error: profileError } = await supabase.from('profiles').upsert({
            id: adminUser.user.id,
            email: adminEmail,
            role: 'super_admin'
        })
        if (profileError) console.error('Error creating admin profile:', profileError)
        else console.log('Super Admin profile created/updated.')
    }

    // 2. Create Seller
    const sellerEmail = 'seller@test.com'
    const sellerPassword = 'password123'
    const storeName = 'Test Store'
    const storeSlug = 'test-store'

    console.log(`Creating Seller: ${sellerEmail}`)
    let { data: sellerUser, error: sellerError } = await supabase.auth.admin.createUser({
        email: sellerEmail,
        password: sellerPassword,
        email_confirm: true
    })

    if (sellerError) {
        console.log(`Seller user might already exist: ${sellerError.message}`)
        // Try to fetch existing user
        const { data } = await supabase.from('profiles').select('id').eq('email', sellerEmail).single()
        if (data) sellerUser = { user: { id: data.id } } as any
    }

    if (sellerUser?.user) {
        // Upsert profile
        const { error: profileError } = await supabase.from('profiles').upsert({
            id: sellerUser.user.id,
            email: sellerEmail,
            role: 'store_owner'
        })

        if (profileError) {
            console.error('Error creating seller profile:', profileError)
        } else {
            // Create Store
            const { data: store, error: storeError } = await supabase.from('stores').upsert({
                name: storeName,
                slug: storeSlug,
                owner_id: sellerUser.user.id, // Use owner_id to match unique constraint if it exists? No, slug is likely unique.
                subscription_plan: 'free',
                is_active: true,
                theme_config: {}
            }, { onConflict: 'slug' }).select().single()

            if (storeError) console.error('Error creating store:', storeError)
            else {
                console.log(`Store created: ${store.name} (${store.slug})`)
                // Link store to profile
                await supabase.from('profiles').update({ store_id: store.id }).eq('id', sellerUser.user.id)
            }
        }
    }
}

createTestUsers()
