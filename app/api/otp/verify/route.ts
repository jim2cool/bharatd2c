import { NextResponse } from "next/server";

// This would normally be a Redis cache or a DB table
// Note: In Next.js App Router, global variables in route files might reset in dev, 
// so this is strictly for demonstration of the flow.
import { otpStorage } from "../send/route"; // This won't work in production due to isolation, but fine for local demo structure

// Better: shared utility or mock verification
export async function POST(req: Request) {
    try {
        const { phone, otp } = await req.json();

        if (!phone || !otp) {
            return NextResponse.json({ error: "Phone and OTP are required" }, { status: 400 });
        }

        // For the demo/hackaton, we accept '1234' as universal success or match the console log
        if (otp === '1234') {
            return NextResponse.json({ success: true });
        }

        // Normally you'd check otpStorage here
        return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ error: "Verification failed" }, { status: 500 });
    }
}
