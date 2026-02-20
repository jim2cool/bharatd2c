import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { storeId, eventName, eventData, clientId, sessionId } = body;

        if (!storeId || !eventName || !clientId) {
            return NextResponse.json({ error: "Missing required fields (storeId, eventName, clientId)" }, { status: 400 });
        }

        // 1. Fetch Google Config
        const { data: config, error } = await supabase
            .from("sales_channels_config")
            .select("google_is_active, ga4_measurement_id, meta_capi_token") // Re-using token field for GA4 API Secret conceptually in V1
            .eq("store_id", storeId)
            .single();

        if (error || !config?.google_is_active || !config?.ga4_measurement_id || !config?.meta_capi_token) {
            // We use the meta_capi_token column to store the GA4 API Secret in V1 to save DB space.
            return NextResponse.json({ message: "Google MP not configured or inactive" }, { status: 200 });
        }

        const API_SECRET = config.meta_capi_token; // The GA4 API Secret
        const MEASUREMENT_ID = config.ga4_measurement_id;

        // 2. Construct Payload
        const payload = {
            client_id: clientId, // From the _ga cookie on the frontend
            events: [
                {
                    name: eventName,
                    params: {
                        session_id: sessionId,
                        currency: eventData?.currency || "INR",
                        value: eventData?.value || 0,
                        items: eventData?.items || [],
                    }
                }
            ]
        };

        // 3. Send to Google Servers
        const mpUrl = `https://www.google-analytics.com/mp/collect?measurement_id=${MEASUREMENT_ID}&api_secret=${API_SECRET}`;

        const response = await fetch(mpUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            console.error("Google MP Error Status:", response.status);
            return NextResponse.json({ error: "Failed to send to Google", status: response.status }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: "Event pushed to GA4 MP" }, { status: 200 });

    } catch (error: any) {
        console.error("Google MP Server Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
