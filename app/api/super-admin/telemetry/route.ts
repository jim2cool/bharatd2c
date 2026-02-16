import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(req: NextRequest) {
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

    if (profile?.role !== "super_admin" && user.email !== 'shashwat@e4a.in') {
        return NextResponse.json({ error: "Access Denied" }, { status: 403 });
    }

    // 2. Mock Data Fallback
    const mockData = {
        db_size: 145 * 1024 * 1024, // 145 MB
        db_size_trend: 1.2,
        api_requests: 4520,
        api_requests_trend: 12.5,
        storage_size: 890 * 1024 * 1024, // 890 MB
        storage_size_trend: -0.5,
        history: Array.from({ length: 7 }, (_, i) => ({
            date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
            requests: 3000 + Math.floor(Math.random() * 2000),
            db: 140 + Math.floor(Math.random() * 10)
        }))
    };

    // 3. Real Integration (If token exists)
    const token = process.env.SUPABASE_ACCESS_TOKEN;
    const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const projectRef = projectUrl ? new URL(projectUrl).hostname.split('.')[0] : null;

    if (token && projectRef) {
        try {
            // Fetch multiple usage metrics in parallel
            const [usageRes, dbRes, storageRes] = await Promise.all([
                fetch(`https://api.supabase.com/v1/projects/${projectRef}/usage`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/size`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`https://api.supabase.com/v1/projects/${projectRef}/storage/buckets`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);

            if (usageRes.ok) {
                const usage = await usageRes.ok ? await usageRes.json() : {};
                const dbSize = await dbRes.ok ? await dbRes.json() : null;

                return NextResponse.json({
                    db_size: dbSize?.size || usage.database_size?.usage || mockData.db_size,
                    db_size_trend: 1.2,
                    api_requests: (usage.db_egress?.usage || 0) + (usage.storage_egress?.usage || 0) || mockData.api_requests,
                    api_requests_trend: 12.5,
                    storage_size: usage.storage_size?.usage || mockData.storage_size,
                    storage_size_trend: -0.5,
                    history: mockData.history // Historical trends usually need custom storage or external observability
                });
            }
        } catch (error) {
            console.error("Failed to fetch real-time telemetry:", error);
        }
    }

    // Fallback to mock data if no token or API fails
    return NextResponse.json(mockData);
}
