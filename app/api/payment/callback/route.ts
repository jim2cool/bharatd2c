import { NextRequest, NextResponse } from 'next/server'
import { verifyPayUHash } from '@/lib/payu/hash'
import { supabaseAdmin as supabaseServer } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
    try {
        // PayU sends data as form-urlencoded
        const formData = await request.formData()

        // Debug received data
        console.log('--- PayU Callback Received ---');
        const callbackData: any = {};
        for (const [key, value] of formData.entries()) {
            callbackData[key] = value;
            console.log(`${key}: ${value}`);
        }
        console.log('------------------------------');

        // Log to file for persistent debug
        try {
            const fs = require('fs');
            const path = require('path');
            const logPath = path.join(process.cwd(), 'payu_params.log');
            fs.appendFileSync(logPath, `\n--- ${new Date().toISOString()} ---\n${JSON.stringify(callbackData, null, 2)}\n`);
        } catch (e) { }

        const status = formData.get('status') as string
        const txnid = formData.get('txnid') as string
        const amount = formData.get('amount') as string
        const productinfo = formData.get('productinfo') as string
        const firstname = formData.get('firstname') as string
        const email = formData.get('email') as string
        const phone = formData.get('phone') as string || ''
        const hash = formData.get('hash') as string
        const mihpayid = formData.get('mihpayid') as string
        const key = formData.get('key') as string
        const additionalCharges = formData.get('additionalCharges') as string || ''
        const merchantSalt = process.env.PAYU_MERCHANT_SALT

        if (!merchantSalt) {
            console.error('PayU salt not configured')
            return NextResponse.redirect(new URL('/checkout?error=config', request.url))
        }


        // Verify hash
        const isValidHash = verifyPayUHash({
            key, txnid, amount, productinfo, firstname, email, phone, status,
            salt: merchantSalt, hash, additional_charges: additionalCharges,
            udf1: formData.get('udf1') as string || '',
            udf2: formData.get('udf2') as string || '',
            udf3: formData.get('udf3') as string || '',
            udf4: formData.get('udf4') as string || '',
            udf5: formData.get('udf5') as string || '',
        })

        if (!isValidHash) {
            console.error('Invalid hash received from PayU');

            // Print what we think the hash should be for debugging
            // Formula: sha512(salt|status|phone|extra_charges|cart_details|offer_auto_apply|offer_key|user_token|udf10|udf9|udf8|udf7|udf6|udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)
            const phone = formData.get('phone') as string || '';
            const udf1 = formData.get('udf1') as string || '';
            const udf2 = formData.get('udf2') as string || '';
            const udf3 = formData.get('udf3') as string || '';
            const udf4 = formData.get('udf4') as string || '';
            const udf5 = formData.get('udf5') as string || '';

            console.log('Debug Reverse Hash String Calculation:');
            console.log(`salt: ${merchantSalt}`);
            console.log(`status: ${status}`);
            console.log(`phone: ${phone}`);
            console.log(`udf1: ${udf1}`);

            return NextResponse.redirect(new URL('/checkout?error=invalid', request.url))
        }

        // Update order status or Create order if it doesn't exist (Bifurcated Flow)
        if (status === 'success') {
            const udf1 = formData.get('udf1') as string
            const udf2 = formData.get('udf2') as string

            if (udf2) {
                try {
                    const meta = JSON.parse(udf2)
                    const { createOrder } = require('@/lib/order-service')

                    const order = await createOrder({
                        ...meta.form,
                        cart: meta.cart,
                        payment_method: udf1 === 'partial_cod' ? 'partial_cod' : 'online',
                        transaction_id: txnid,
                        payment_id: mihpayid,
                        session_signals: meta.session_signals
                    })

                    console.log('Order created via payment callback:', order.order_number)
                } catch (e) {
                    console.error('Failed to create order from callback metadata:', e)
                    // If creation fails, we might need a fallback/retry log
                }
            }
        }

        // Redirect based on payment status
        if (status === 'success') {
            return NextResponse.redirect(
                new URL(`/order-success?txnid=${txnid}&amount=${amount}`, request.url)
            )
        } else {
            return NextResponse.redirect(
                new URL(`/checkout?error=payment_failed&txnid=${txnid}`, request.url)
            )
        }
    } catch (error) {
        console.error('Payment callback error:', error)
        return NextResponse.redirect(new URL('/checkout?error=callback', request.url))
    }
}
