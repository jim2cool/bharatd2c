const { createClient } = require('@supabase/supabase-js');

// Initialize client
const supabase = createClient(
    'https://axtyxzpaoldblpiyfuep.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4dHl4enBhb2xkYmxwaXlmdWVwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODIwNzk5NCwiZXhwIjoyMDgzNzgzOTk0fQ.NYPumhAc6dCK9SJY6bjo37BSwdRpCD0vFOVN3wuDies'
);

async function testFetch() {
    const storeSlug = 'test-fashion';
    const { data: store, error } = await supabase
        .from('stores')
        .select('id')
        .or(`slug.eq.${storeSlug},domain.eq.${storeSlug},custom_domain.eq.${storeSlug}`)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    console.log("TEST ID RESULT:", store, error);

    if (store) {
        const { data: storeConfig, error: configError } = await supabase
            .from('vw_store_config_resolved')
            .select('*')
            .eq('store_id', store.id)
            .single();

        console.log("TEST CONFIG RESULT:", storeConfig ? "Found" : "Not Found", configError);
        if (configError) {
            const { data: fallbackStore, error: fsError } = await supabase
                .from('stores')
                .select('*')
                .eq('id', store.id)
                .single();
            console.log("FALLBACK RESULT:", fallbackStore ? "Found Fallback" : "No Fallback", fsError);
        }
    }
}

testFetch();
