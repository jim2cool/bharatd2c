import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return req.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        req.cookies.set(name, value)
                    );
                },
            },
        }
    );

    // 1. Verify Requesting User is a Super-Admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "super_admin") {
        return NextResponse.json({ error: "Access Denied" }, { status: 403 });
    }

    const { userId, storeSlug } = await req.json();

    if (!userId || !storeSlug) {
        return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    // 2. Set Impersonation Cookie
    // In a production app, this would be a signed JWT containing the target userId
    // For this implementation, we use a secure cookie that the middleware will interpret
    const response = NextResponse.json({ success: true, redirect: `http://${storeSlug}.localhost:3000/admin` });

    response.cookies.set("impersonation_target_id", userId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60, // 1 hour
        path: "/",
    });

    return response;
}

export async function DELETE(req: NextRequest) {
    const response = NextResponse.json({ success: true });
    response.cookies.delete("impersonation_target_id");
    return response;
}
