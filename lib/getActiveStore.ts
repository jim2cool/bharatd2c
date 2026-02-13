import { cookies, headers } from 'next/headers'
import { supabaseAdmin } from './supabase-admin'

export async function getActiveStoreId(): Promise<string | null> {
  const h = await headers()

  // If we are explicitly on the platform root (Landing Page), do NOT resolve a store
  if (h.get('x-is-platform-root') === 'true') {
    return null
  }

  const storeSlug = h.get('x-store-slug')

  if (storeSlug) {
    console.log('Resolving store for slug:', storeSlug) // Debug log

    // Lookup store ID by slug/domain with robust query
    const { data: store, error } = await supabaseAdmin
      .from('stores')
      .select('id')
      .or(`slug.eq.${storeSlug},domain.eq.${storeSlug},custom_domain.eq.${storeSlug}`)
      .single()

    if (error) {
      console.error('Error fetching store for slug:', storeSlug, error)
      return null
    }

    if (store) return store.id
  }

  // Fallback to cookie (mostly for local dev without middleware doing subdomain logic)
  const cookieStore = await cookies()
  return cookieStore.get('easy_active_store_id')?.value || null
}
