import { supabaseAdmin } from '../lib/supabase-admin'

async function createTestUser() {
    const email = `test_dashboard_${Date.now()}@example.com`
    const password = 'Password123!'

    console.log(`Attempting to create user: ${email}`)

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
            first_name: 'Test',
            last_name: 'User'
        }
    })

    if (error) {
        console.error('Failed to create user:', error)
        return
    }

    console.log('User created successfully:', data.user.id)
    console.log('Email:', email)
    console.log('Password:', password)
}

createTestUser()
