
import { NextRequest, NextResponse } from "next/server";

const CLIENT_ID = process.env.GODADDY_CLIENT_ID;
const CLIENT_SECRET = process.env.GODADDY_CLIENT_SECRET;
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/admin/domains/callback`;

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const domain = searchParams.get("state"); // We passed domain as state
    const error = searchParams.get("error");

    if (error) {
        return NextResponse.json({ error: `GoDaddy Error: ${error}` }, { status: 400 });
    }

    if (!code || !domain) {
        return NextResponse.json({ error: "Missing code or domain" }, { status: 400 });
    }

    try {
        // 1. Exchange Code for Token
        const tokenRes = await fetch("https://sso.godaddy.com/oauth/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                grant_type: "authorization_code",
                code,
                redirect_uri: REDIRECT_URI
            })
        });

        const tokenData = await tokenRes.json();
        if (!tokenRes.ok) throw new Error(tokenData.message || "Failed to get token");

        const { access_token } = tokenData;

        // 2. Update DNS (Point to our IP)
        // We'll add an A Record @ -> 46.225.117.86
        // And CNAME www -> @

        const OUR_IP = "46.225.117.86";

        const dnsRes = await fetch(`https://api.godaddy.com/v1/domains/${domain}/records`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${access_token}`, // Bearer for OAuth, sso-key for Key/Secret
                // Wait, GoDaddy OAuth usually uses "sso-key" format for API Keys, but "Bearer" for proper OAuth tokens?
                // Documentation says "Authorization: sso-key [key]:[secret]" typically for self-management.
                // For 3rd party OAuth, "Bearer" is standard. failing that we check docs.
                "Content-Type": "application/json"
            },
            body: JSON.stringify([
                { type: "A", name: "@", data: OUR_IP, ttl: 600 },
                { type: "CNAME", name: "www", data: "@", ttl: 600 }
            ])
        });

        if (!dnsRes.ok) {
            const err = await dnsRes.text();
            throw new Error(`DNS Update Failed: ${err}`);
        }

        // 3. Success -> Redirect back to Admin
        // In real app, we save the domain to DB for the store first.

        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/admin/settings/domains?success=true&domain=${domain}`);

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
