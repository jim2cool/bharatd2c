import { NextResponse } from "next/server";

// Mock database or cache for OTPs
export const otpStorage = new Map<string, { otp: string; expires: number }>();

export async function POST(req: Request) {
    try {
        const { phone } = await req.json();

        if (!phone) {
            return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
        }

        // Generate a 4-digit OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        const expires = Date.now() + 5 * 60 * 1000; // 5 minutes expiration

        otpStorage.set(phone, { otp, expires });

        // In a real app, you would call an SMS API here (e.g., Twilio, Msg91)
        console.log(`[OTP] Sending ${otp} to ${phone}`);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        return NextResponse.json({ success: true, message: "OTP sent successfully (Simulated)" });
    } catch (error) {
        console.error("OTP Send Error:", error);
        return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
    }
}
