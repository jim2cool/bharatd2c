
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const fashionPreset = {
    theme_config: {
        colors: {
            primary: "#111111",
            accent: "#E26A00",
        },
        typography: {
            fontFamily: "Inter",
            headingSize: "medium",
        },
        header: {
            style: 'modern',
            sticky: true,
        },
        footer: {
            showSocials: true,
        },
        announcementBar: {
            enabled: true,
            text: "New Season Arrivals | Free Shipping on Orders Above ₹1499",
            style: 'marquee',
        },
        corners: {
            button: "4px",
            card: "8px",
            image: "12px",
        },
        cro_strategy: {
            pdp_order: ['highlights', 'bundles', 'reviews', 'shipping'],
            trust_elements: ['secure_pay', 'easy_returns'],
        }
    }
};

async function updateAuraFashion() {
    const { data, error } = await supabase
        .from('stores')
        .update({ theme_config: fashionPreset.theme_config })
        .eq('slug', 'aura-fashion');

    if (error) {
        console.error('Error updating store:', error);
        process.exit(1);
    }

    console.log('Successfully updated aura-fashion with Fashion vertical presets.');
}

updateAuraFashion();
