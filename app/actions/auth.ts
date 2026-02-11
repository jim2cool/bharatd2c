'use server'

import { supabaseAdmin } from '@/lib/supabase-admin'

export async function confirmUser(email: string) {
    // 1. Get user by email to find ID
    const { data: { users }, error: findError } = await supabaseAdmin.auth.admin.listUsers()

    // Note: listUsers isn't efficient for lookup by email but it's what we have in admin API usually 
    // or we can just try to sign in? No. 
    // Actually, listUsers might be paginated. Use start/end? 
    // Better: supabaseAdmin.rpc? No.
    // Wait, we can't get user by email directly in admin api easily without listUsers?
    // Let's check if we can get it from the client side `signUp` response? 
    // client `signUp` returns `user` object even if session is null? 
    // YES. `data.user` is present in `signUp` response even if `session` is null.

    // So we should pass userId to this action, not email.
    return { error: 'Pass userId instead' }
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
