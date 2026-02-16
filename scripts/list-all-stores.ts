
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function listAllStores() {
    const { data, error } = await supabase
        .from('stores')
        .select('id, name, slug, created_at')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching stores:', error);
        process.exit(1);
    }

    console.log(JSON.stringify(data, null, 2));
}

listAllStores();
