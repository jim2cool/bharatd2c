import { supabase } from "@/lib/supabase-public";

export async function getStoreNavigation(storeId: string) {
    // 1. Fetch Active Collections
    const { data: collections } = await supabase
        .from('collections')
        .select('id, name, slug')
        .eq('store_id', storeId)
        .order('created_at', { ascending: true });

    // 2. Fetch Active Policy Pages
    const { data: policies } = await supabase
        .from('pg_store_pages')
        .select('id, title, slug, page_type')
        .eq('store_id', storeId)
        .or('page_type.eq.policy,type.eq.policy')   // support both old and new schema
        .eq('is_active', true)
        .order('created_at', { ascending: true });

    // 3. Fetch Static Pages
    const { data: static_pages } = await supabase
        .from('pg_store_pages')
        .select('id, title, slug, page_type')
        .eq('store_id', storeId)
        .or('page_type.eq.static,type.eq.static')
        .eq('is_active', true);

    return {
        collections: collections || [],
        policies: policies || [],
        static_pages: static_pages || []
    };
}
