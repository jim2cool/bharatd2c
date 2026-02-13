'use server'

import { supabaseAdmin } from '@/lib/supabase-admin'

export async function signUpDirect(email: string, password: string) {
    try {
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true
        })

        if (error) throw error
        return { success: true, user: data.user }
    } catch (error: any) {
        console.error('Sign up direct failed:', error)
        return { success: false, error: error.message }
    }
}

export async function autoConfirmUser(userId: string) {
    try {
        const { error } = await supabaseAdmin.auth.admin.updateUserById(
            userId,
            { email_confirm: true }
        )

        if (error) throw error
        return { success: true }
    } catch (error: any) {
        console.error('Auto-confirm failed:', error)
        return { success: false, error: error.message }
    }
}
