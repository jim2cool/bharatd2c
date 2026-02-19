'use server'

import { revalidatePath } from "next/cache"

export async function revalidateProduct(slug: string) {
    if (!slug) return

    // Revalidate the specific product page
    revalidatePath(`/products/${slug}`)

    // Revalidate the listing page (in case it appears there)
    revalidatePath('/products')

    // Revalidate home page (if featured)
    revalidatePath('/')

    // Revalidate admin page (to see updated data)
    revalidatePath(`/admin/products`)
}
