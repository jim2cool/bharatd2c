
import { getActiveStoreIdClient } from './getActiveStore.client'

/**
 * Returns the full public URL for the current active store.
 * Handles localhost vs production domains and ensures HTTPS.
 */
export async function getStoreBaseUrl(supabase: any): Promise<string> {
    const storeId = getActiveStoreIdClient()
    if (!storeId) return '/'

    const { data: store } = await supabase
        .from('stores')
        .select('slug, domain')
        .eq('id', storeId)
        .single()

    if (!store) return '/'

    // 1. If custom domain exists, use it with https
    if (store.domain) {
        return `https://${store.domain}`
    }

    // 2. Handle Localhost
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        return `http://${store.slug}.localhost:3000`
    }

    // 3. Fallback to platform subdomain (v2 production)
    // Adjust this to your actual production domain
    return `https://${store.slug}.bharatd2c.com`
}
