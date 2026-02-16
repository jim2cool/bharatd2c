import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
    try {
        const { phone, type = 'order_verify' } = await req.json();

        if (!phone) {
            return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
        }

        // Validate phone format (Indian: 10 digits, or with +91 prefix)
        const cleanPhone = phone.replace(/[\s\-\(\)]/g, '')
        if (!/^(\+91)?[6-9]\d{9}$/.test(cleanPhone)) {
            return NextResponse.json({ error: "Invalid phone number format" }, { status: 400 });
        }

        // Rate limit by IP (global protection)
        const ip = req.headers.get('x-forwarded-for') || 'unknown';
        const ipLimit = rateLimit(`otp-send-ip:${ip}`, { maxRequests: 20, windowSeconds: 600 });

        if (!ipLimit.allowed) {
            return NextResponse.json(
                { error: "Too many requests. Please try again later." },
                { status: 429 }
            );
        }

        // Rate limit by phone number (prevent OTP spam)
        const phoneLimit = rateLimit(`otp-send-phone:${phone}`, { maxRequests: 5, windowSeconds: 600 });

        if (!phoneLimit.allowed) {
            return NextResponse.json(
                { error: "Too many OTP requests for this phone number. Please try again later." },
                { status: 429 }
            );
        }

        // Generate a 4-digit OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        const expires_at = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes expiration

        // Store in Supabase
        const { error } = await supabaseAdmin
            .from('verification_codes')
            .insert({
                identifier: phone,
                code: otp,
                type: type,
                expires_at: expires_at
            });

        if (error) throw error;

        // TODO: Integrate SMS API (e.g., MSG91, Twilio) for production delivery
        if (process.env.NODE_ENV === 'development') {
            console.log(`[OTP-DEV] Code for ${phone}: ${otp}`);
        }

        return NextResponse.json({
            success: true,
            message: "OTP sent successfully",
        });
    } catch (error) {
        console.error("OTP Send Error:", error);
        return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
    }
}
