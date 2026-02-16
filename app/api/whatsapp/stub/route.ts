import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { orderId, customerPhone, messageType, storeId } = body;

        if (!orderId || !customerPhone || !storeId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        console.log(`[WHATSAPP STUB] Sending ${messageType || 'confirmation'} to ${customerPhone} for order ${orderId} (Store: ${storeId})`);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Note: In Phase 27, this will be replaced with actual WhatsApp Business API or standard provider (e.g., Wati, Interakt) integration.
        return NextResponse.json({
            success: true,
            message: 'Stub message sent successfully',
            messageId: `stub_msg_${Date.now()}`
        });
    } catch (error: any) {
        console.error('[WHATSAPP STUB] Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
