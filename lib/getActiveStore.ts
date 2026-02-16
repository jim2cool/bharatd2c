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
    // Lookup store ID by slug/domain with robust query
    const { data: store } = await supabaseAdmin
      .from('stores')
      .select('id')
      .or(`slug.eq.${storeSlug},domain.eq.${storeSlug},custom_domain.eq.${storeSlug}`)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (store) return store.id
  }

  // Fallback to cookie
  const cookieStore = await cookies()
  return cookieStore.get('easy_active_store_id')?.value || null
}

export async function getActiveStore() {
  const storeId = await getActiveStoreId();
  if (!storeId) return null;

  // Fetch from vw_store_config_resolved to get the full DRS v3 token set + resolved_active_components
  const { data: store, error } = await supabaseAdmin
    .from('vw_store_config_resolved')
    .select('*')
    .eq('store_id', storeId)
    .single();

  if (error) {
    console.error('Error fetching consolidated store config:', error);
    // Fallback to basic store object if view fails
    const { data: fallbackStore } = await supabaseAdmin
      .from('stores')
      .select('*')
      .eq('id', storeId)
      .single();
    return fallbackStore;
  }

  // Handle Recompute Logic — IMPORTANT: do NOT call compute_store_render_config() synchronously
  // here. Doing so blocks TTFB and runs a heavy PL/pgSQL function on every page render.
  // The needs_recompute flag is set by DB triggers — the recompute should run asynchronously
  // (via a background job, webhook, or a dedicated admin action), NOT in the render path.
  if (store.needs_recompute) {
    console.log(`Store ${storeId} needs recompute — will be handled asynchronously.`);
    // Return current (potentially stale) resolved config — still better than blocking render.
  }

  // Map store_id to id for internal code compatibility
  return {
    ...store,
    id: store.store_id,
    name: store.store_name
    // legacy_theme_config explicitly not mapped to `theme_config` to enforce V3 Architecture reads
  };
}
