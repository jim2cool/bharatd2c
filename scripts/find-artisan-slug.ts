
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function findArtisanSlug() {
    const { data, error } = await supabase
        .from('stores')
        .select('id, name, slug, theme_config')
        .eq('slug', 'artisan-hamper');

    if (error) {
        console.error('Error fetching stores:', error);
        process.exit(1);
    }

    console.log(JSON.stringify(data, null, 2));
}

findArtisanSlug();
