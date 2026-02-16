import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getActiveStoreId } from "@/lib/getActiveStore";

export async function GET() {
    const storeId = await getActiveStoreId();
    if (!storeId) return NextResponse.json({ error: "Store not found" }, { status: 404 });

    // Fetch products for this store
    const { data: products, error: pError } = await supabaseAdmin
        .from("products")
        .select("id, title, description, price, compare_at_price, image, slug")
        .eq("store_id", storeId)
        .eq("status", "active")
        .limit(50); // Limit for the well-known discovery

    // Fetch store info
    const { data: store, error: sError } = await supabaseAdmin
        .from("stores")
        .select("name, about, social_links")
        .eq("id", storeId)
        .single();

    if (pError || sError) {
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }

    // Universal Commerce Protocol Format (UCP)
    const ucpData = {
        version: "1.0",
        store: {
            name: store.name,
            description: store.about,
            url: `https://${storeId}.easy-d2c.com`, // Fallback or dynamic domain
            social: store.social_links
        },
        catalog: products.map(p => ({
            id: p.id,
            name: p.title,
            description: p.description,
            price: {
                amount: p.price,
                currency: "INR"
            },
            image_url: p.image,
            product_url: `https://${storeId}.easy-d2c.com/products/${p.slug}`,
            availability: "in_stock"
        }))
    };

    return NextResponse.json(ucpData, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "public, s-maxage=3600",
            "Content-Type": "application/json"
        }
    });
}
