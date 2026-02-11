
import { NextRequest, NextResponse } from "next/server";

const CLIENT_ID = process.env.GODADDY_CLIENT_ID;
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/admin/domains/callback`;

export async function GET(req: NextRequest) {
    if (!CLIENT_ID) {
        return NextResponse.json({ error: "GoDaddy Client ID not configured" }, { status: 500 });
    }

    const { searchParams } = new URL(req.url);
    const domain = searchParams.get("domain");

    if (!domain) {
        return NextResponse.json({ error: "Domain is required" }, { status: 400 });
    }

    // GoDaddy OAuth URL
    // Scope: "browse_domains" to read, maybe "modify_domains" isn't strictly OAuth scope but implicit? 
    // GoDaddy documentation varies, usually basic read access. 
    // Wait, typical GoDaddy OAuth is for Account access. 
    // For DNS modification on behalf of user, we need strict permissions.
    // Let's assume standard OAuth flow URL structure.

    // NOTE: This usually requires a specialized "Reseller" or "Partner" integration for full DNS control via OAuth for 3rd parties.
    // Standard keys are often for "Self" management.
    // If "Login Only" is the requirement, we try standard OAuth.

    const authUrl = `https://sso.godaddy.com/oauth/authorize?client_id=${CLIENT_ID}&response_type=code&scope=full&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=${domain}`;

    return NextResponse.redirect(authUrl);
}
