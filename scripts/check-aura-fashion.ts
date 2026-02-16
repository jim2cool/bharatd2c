
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkAuraFashion() {
    const { data, error } = await supabase
        .from('products')
        .select('id, title, slug')
        .eq('store_id', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11');

    if (error) {
        console.error('Error fetching products:', error);
        process.exit(1);
    }

    console.log(JSON.stringify(data, null, 2));
}

checkAuraFashion();
