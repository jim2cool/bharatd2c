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
        .select('slug, domain, custom_domain')
        .eq('id', storeId)
        .single()

    if (!store) return '/'

    // The unique identifier for the store (some legacy stores use domain column for slug)
    const storeIdentifier = store.slug || store.domain;

    // 1. Handle Localhost (Takes precedence in dev environment)
    if (typeof window !== 'undefined' && window.location.hostname.includes('localhost')) {
        const port = window.location.port || '3000';
        return `http://${storeIdentifier}.localhost:${port}`;
    }

    // 2. If a true custom domain exists
    const trueCustomDomain = store.custom_domain || (store.domain && store.domain.includes('.') ? store.domain : null);
    if (trueCustomDomain) {
        return `https://${trueCustomDomain}`;
    }

    // 3. Fallback to platform subdomain (v2 production)
    return `https://${storeIdentifier}.easy-d2c.com`
}
