import { NextResponse } from 'next/server'
import { createOrder } from '@/lib/order-service'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Use the central order service
    const order = await createOrder({
      ...body,
      payment_method: body.payment_method || 'cod'
    })

    return NextResponse.json(
      {
        success: true,
        order_id: order.id,
        order_number: order.order_number,
      },
      { status: 200 }
    )
  } catch (err: any) {
    console.error('Order creation error:', err)

    // Handle specific errors like rate limits
    if (err.message === 'COD_RATE_LIMIT') {
      return NextResponse.json(
        {
          success: false,
          error: 'RATE_LIMIT_EXCEEDED',
          message: 'You have multiple pending COD orders. Please complete those or pay online for new orders.'
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: err?.message || 'Server error',
      },
      { status: 500 }
    )
  }
}
