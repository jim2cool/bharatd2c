import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getActiveStoreId } from "@/lib/getActiveStore";

export async function POST(req: Request) {
    try {
        const { code, order_amount } = await req.json();
        const storeId = await getActiveStoreId();

        if (!storeId || !code) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const { data: discount, error } = await supabaseAdmin
            .from("discounts")
            .select("*")
            .eq("store_id", storeId)
            .eq("code", code.toUpperCase())
            .eq("is_active", true)
            .single();

        if (error || !discount) {
            return NextResponse.json({ error: "Invalid discount code" }, { status: 400 });
        }

        // Check expiration
        if (discount.expires_at && new Date(discount.expires_at) < new Date()) {
            return NextResponse.json({ error: "Discount code expired" }, { status: 400 });
        }

        // Check start date
        if (discount.starts_at && new Date(discount.starts_at) > new Date()) {
            return NextResponse.json({ error: "Discount code not yet active" }, { status: 400 });
        }

        // Check minimum order amount
        if (order_amount < (discount.min_order_amount || 0)) {
            return NextResponse.json({
                error: `Minimum order amount of ₹${discount.min_order_amount} required`
            }, { status: 400 });
        }

        // Check usage limit
        if (discount.usage_limit && (discount.used_count || 0) >= discount.usage_limit) {
            return NextResponse.json({ error: "Discount code usage limit reached" }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            discount: {
                code: discount.code,
                type: discount.type,
                value: Number(discount.value)
            }
        });
    } catch (error) {
        console.error("Discount Validation Error:", error);
        return NextResponse.json({ error: "Failed to validate discount" }, { status: 500 });
    }
}
