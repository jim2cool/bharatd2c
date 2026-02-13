
import { supabaseAdmin } from '../lib/supabase-admin';

async function listStores() {
    const { data, error } = await supabaseAdmin
        .from('stores')
        .select('id, name, slug, custom_domain');

    if (error) {
        console.error('Error fetching stores:', error);
        return;
    }

    console.log('Stores:', data);
}

listStores();
