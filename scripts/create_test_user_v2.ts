import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
)

async function createTestUser() {
    const email = `test_dashboard_${Date.now()}@example.com`
    const password = 'Password123!'

    console.log(`Attempting to create user: ${email}`)

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.error('Missing Service Role Key')
        return
    }

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
