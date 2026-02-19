
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDiscounts() {
    const storeSlug = 'mvp-round-1';
    console.log(`Checking store: ${storeSlug}`);

    // 1. Get Store ID
    const { data: store, error: storeError } = await supabase
        .from('stores')
        .select('id, name')
        .eq('slug', storeSlug)
        .single();

    if (storeError || !store) {
        console.error('Store not found:', storeError?.message);
        return;
    }

    console.log(`Store Found: ${store.name} (${store.id})`);

    // 2. Get Discounts
    const { data: discounts, error: discountError } = await supabase
        .from('discounts')
        .select('*')
        .eq('store_id', store.id);

    if (discountError) {
        console.error('Error fetching discounts:', discountError.message);
        return;
    }

    console.log(`Found ${discounts.length} discounts:`);
    console.table(discounts);

    // 3. Get Prepaid Rules
    const { data: rules, error: rulesError } = await supabase
        .from('prepaid_configs')
        .select('*')
        .eq('store_id', store.id);

    if (rulesError) {
        console.error('Error fetching prepaid rules:', rulesError.message);
    } else {
        console.log(`Found ${rules.length} prepaid rules:`);
        console.table(rules);
    }
}

checkDiscounts();
