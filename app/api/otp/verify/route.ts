import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
    try {
        const { phone, otp } = await req.json();

        if (!phone || !otp) {
            return NextResponse.json({ error: "Phone and OTP are required" }, { status: 400 });
        }

        // Validate phone format (Indian: 10 digits, or with +91 prefix)
        const cleanPhone = phone.replace(/[\s\-\(\)]/g, '')
        if (!/^(\+91)?[6-9]\d{9}$/.test(cleanPhone)) {
            return NextResponse.json({ error: "Invalid phone number format" }, { status: 400 });
        }

        // Validate OTP format (4 digits only)
        if (!/^\d{4}$/.test(otp)) {
            return NextResponse.json({ error: "Invalid OTP format" }, { status: 400 });
        }

        // Rate limit verification attempts (prevent brute force)
        const verifyLimit = rateLimit(`otp-verify-phone:${phone}`, { maxRequests: 10, windowSeconds: 600 });

        if (!verifyLimit.allowed) {
            return NextResponse.json(
                { error: "Too many verification attempts. Please try again later." },
                { status: 429 }
            );
        }

        // Find the latest active code for this identifier
        const { data, error } = await supabaseAdmin
            .from('verification_codes')
            .select('*')
            .eq('identifier', phone)
            .eq('code', otp)
            .is('verified_at', null)
            .gt('expires_at', new Date().toISOString())
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (error || !data) {
            return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
        }

        // Mark as verified
        await supabaseAdmin
            .from('verification_codes')
            .update({ verified_at: new Date().toISOString() })
            .eq('id', data.id);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("OTP Verification Error:", error);
        return NextResponse.json({ error: "Verification failed" }, { status: 500 });
    }
}
