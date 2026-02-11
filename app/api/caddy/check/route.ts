
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase admin client for server-side verification
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const domain = searchParams.get("domain");

    if (!domain) {
        return new NextResponse("Domain missing", { status: 400 });
    }

    // Allow Root Domain (Platform)
    if (domain === process.env.NEXT_PUBLIC_ROOT_DOMAIN || domain === "easy-d2c.com") {
        console.log(`[Caddy] Authorized Root Domain: ${domain}`);
        return new NextResponse("OK", { status: 200 });
    }

    // Check if the domain is registered in our stores table
    // custom_domain should be indexed in production
    const { data, error } = await supabaseAdmin
        .from("stores")
        .select("id")
        .eq("custom_domain", domain)
        .eq("custom_domain_status", "active")
        .single();

    if (error || !data) {
        console.log(`[Caddy] Unauthorized domain check: ${domain}`);
        return new NextResponse("Unauthorized", { status: 403 });
    }

    console.log(`[Caddy] Authorized domain check: ${domain}`);
    return new NextResponse("OK", { status: 200 });
}
