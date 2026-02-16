import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: Request) {
    try {
        const { event_name, event_data, user_data, store_id } = await req.json();

        if (!store_id || !event_name) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Fetch marketing config for this store
        const { data: config, error } = await supabaseAdmin
            .from("marketing_configs")
            .select("*")
            .eq("store_id", store_id)
            .eq("type", "meta")
            .single();

        if (error || !config || !config.is_active || !config.pixel_id || !config.access_token) {
            // Just log internally if CAPI not configured or inactive
            console.log(`[CAPI] Meta not configured for store ${store_id}. Falling back to internal logs.`);
            return NextResponse.json({ success: true, message: "External event skipped" });
        }

        // Send to Meta Conversions API
        const metaUrl = `https://graph.facebook.com/v17.0/${config.pixel_id}/events?access_token=${config.access_token}`;

        const metaPayload = {
            data: [
                {
                    event_name,
                    event_time: Math.floor(Date.now() / 1000),
                    action_source: "website",
                    user_data: {
                        ph: [user_data?.phone_hash], // SHA-256 hashed phone
                        em: [user_data?.email_hash], // SHA-256 hashed email
                        client_user_agent: req.headers.get("user-agent"),
                        client_ip_address: req.headers.get("x-forwarded-for") || "127.0.0.1"
                    },
                    custom_data: event_data
                }
            ],
            test_event_code: config.test_event_code // Optional for testing
        };

        // In a real prod environment, we wouldn't await this to avoid blocking the client
        // or we'd use a background worker. For now, fire and forget or quick fetch.
        const res = await fetch(metaUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(metaPayload)
        });

        const result = await res.json();
        console.log(`[CAPI] Meta Response for ${event_name}:`, result);

        return NextResponse.json({ success: true, result });
    } catch (error) {
        console.error("CAPI Error:", error);
        return NextResponse.json({ error: "CAPI failed" }, { status: 500 });
    }
}
