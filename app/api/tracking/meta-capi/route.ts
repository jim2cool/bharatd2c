import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // Needs service role to bypass RLS for encrypted tokens
);

// Hash function required by Meta CAPI
const hashData = (data: string) => {
    return crypto.createHash("sha256").update(data.trim().toLowerCase()).digest("hex");
};

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { storeId, eventName, eventData, userData, eventId } = body;

        if (!storeId || !eventName) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 1. Fetch the Meta CAPI Token and Pixel ID for this store
        const { data: config, error } = await supabase
            .from("sales_channels_config")
            .select("meta_is_active, meta_pixel_id, meta_capi_token")
            .eq("store_id", storeId)
            .single();

        if (error || !config?.meta_is_active || !config?.meta_capi_token || !config?.meta_pixel_id) {
            return NextResponse.json({ message: "Meta CAPI not configured or inactive" }, { status: 200 }); // Return 200 so we don't break checkout flows
        }

        // 2. Format User Data according to Meta specs (hashed)
        const formattedUserData: any = {
            client_ip_address: req.headers.get("x-forwarded-for") || req.ip,
            client_user_agent: req.headers.get("user-agent"),
        };

        if (userData?.email) formattedUserData.em = hashData(userData.email);
        if (userData?.phone) formattedUserData.ph = hashData(userData.phone);
        if (userData?.firstName) formattedUserData.fn = hashData(userData.firstName);
        if (userData?.lastName) formattedUserData.ln = hashData(userData.lastName);
        if (userData?.city) formattedUserData.ct = hashData(userData.city);
        if (userData?.state) formattedUserData.st = hashData(userData.state);
        if (userData?.country) formattedUserData.country = hashData(userData.country);

        // 3. Construct the Payload
        const payload = {
            data: [
                {
                    event_name: eventName,
                    event_time: Math.floor(Date.now() / 1000),
                    action_source: "website",
                    event_id: eventId, // Crucial for Deduplication with the Browser Pixel
                    user_data: formattedUserData,
                    custom_data: {
                        currency: eventData?.currency || "INR",
                        value: eventData?.value || 0,
                        content_name: eventData?.content_name,
                        content_ids: eventData?.content_ids,
                        content_type: eventData?.content_type || "product",
                        num_items: eventData?.num_items,
                    },
                },
            ],
        };

        // 4. Send to Meta Graph API
        const API_VERSION = "v19.0";
        const graphUrl = `https://graph.facebook.com/${API_VERSION}/${config.meta_pixel_id}/events?access_token=${config.meta_capi_token}`;

        const response = await fetch(graphUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!response.ok) {
            console.error("Meta CAPI Error:", result);
            return NextResponse.json({ error: "Failed to send to Meta", details: result }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: "Event pushed to CAPI" }, { status: 200 });

    } catch (error: any) {
        console.error("CAPI Server Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
