'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function savePrepaidRule(data: any) {
    const supabase = await createClient()

    const { error } = await supabase.from('prepaid_configs').insert(data)

    if (error) {
        console.error("Server Action Insert Error:", error)
        return { error: error.message, details: error }
    }

    revalidatePath('/admin/discounts')
    return { success: true }
}

export async function deletePrepaidRule(id: string) {
    const supabase = await createClient()

    const { error } = await supabase.from('prepaid_configs').delete().eq('id', id)

    if (error) {
        console.error("Server Action Delete Error:", error)
        return { error: error.message }
    }

    revalidatePath('/admin/discounts')
    return { success: true }
}

export async function saveDiscount(data: any) {
    const supabase = await createClient()
    const { error } = await supabase.from('discounts').insert(data)

    if (error) {
        console.error("Server Action Discount Insert Error:", error)
        return { error: error.message }
    }

    revalidatePath('/admin/discounts')
    return { success: true }
}

export async function toggleDiscountStatus(id: string, isActive: boolean) {
    const supabase = await createClient()
    const { error } = await supabase.from('discounts').update({ is_active: isActive }).eq('id', id)

    if (error) {
        console.error("Server Action Discount Toggle Error:", error)
        return { error: error.message }
    }

    revalidatePath('/admin/discounts')
    return { success: true }
}

export async function deleteDiscountServer(id: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('discounts').delete().eq('id', id)

    if (error) {
        console.error("Server Action Discount Delete Error:", error)
        return { error: error.message }
    }

    revalidatePath('/admin/discounts')
    return { success: true }
}

export async function getDiscounts(storeId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('discounts')
        .select('*')
        .eq('store_id', storeId)
        .order('created_at', { ascending: false })

    if (error) {
        console.error("Server Action Get Discounts Error:", error)
        return { error: error.message, data: [] }
    }

    return { data, success: true }
}
