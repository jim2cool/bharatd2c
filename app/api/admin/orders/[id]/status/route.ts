import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * PATCH /api/admin/orders/[id]/status
 *
 * Updates an order's status. When status is 'rto' or 'bounced',
 * atomically increments the customer's bounce_count via RPC
 * to feed the RTO kill-pass signal (2+ bounces = kill score).
 *
 * Body: { status: string }
 */
export async function PATCH(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const params = await context.params
        const orderId = params.id
        const body = await req.json()
        const { status: newStatus } = body

        if (!newStatus || typeof newStatus !== 'string') {
            return NextResponse.json({ error: 'status is required' }, { status: 400 })
        }

        // 1. Update the order status
        const { data: updatedOrder, error: updateError } = await supabase
            .from('orders')
            .update({ status: newStatus })
            .eq('id', orderId)
            .select('id, customer_id, status')
            .single()

        if (updateError || !updatedOrder) {
            return NextResponse.json(
                { error: 'Order update failed', detail: updateError?.message },
                { status: 500 }
            )
        }

        // 2. Bounce count write-back (RTO feedback loop)
        // Fires whenever an order is marked rto or bounced.
        // Uses atomic RPC to avoid race conditions (never app-side +1).
        if (newStatus === 'rto' || newStatus === 'bounced') {
            const customerId = updatedOrder.customer_id

            if (customerId) {
                const { error: rpcError } = await supabase.rpc('increment_bounce_count', {
                    p_customer_id: customerId,
                })

                if (rpcError) {
                    // Log but don't fail the order update — status change must succeed
                    console.error('[RTO] increment_bounce_count RPC failed:', rpcError.message)
                }
            }
        }

        return NextResponse.json({
            success: true,
            order: { id: updatedOrder.id, status: updatedOrder.status },
        })
    } catch (err: any) {
        console.error('Order status update error:', err)
        return NextResponse.json(
            { error: err?.message || 'Server error' },
            { status: 500 }
        )
    }
}
