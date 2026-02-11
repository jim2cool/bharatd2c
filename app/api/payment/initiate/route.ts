import { NextRequest, NextResponse } from 'next/server'
import { generatePayUHash, generateTransactionId } from '@/lib/payu/hash'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { amount, productinfo, firstname, email, phone } = body

        // Validate required fields
        if (!amount || !productinfo || !firstname || !email || !phone) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Get PayU credentials from environment
        const merchantKey = process.env.PAYU_MERCHANT_KEY
        const merchantSalt = process.env.PAYU_MERCHANT_SALT
        const baseUrl = process.env.PAYU_BASE_URL || 'https://test.payu.in'

        if (!merchantKey || !merchantSalt) {
            return NextResponse.json(
                { error: 'PayU credentials not configured' },
                { status: 500 }
            )
        }

        // Generate unique transaction ID
        const txnid = generateTransactionId()

        // Get base URL for callbacks
        const protocol = request.headers.get('x-forwarded-proto') || 'http'
        const host = request.headers.get('host') || 'localhost:3000'
        const callbackBaseUrl = `${protocol}://${host}`

        // Format amount with 2 decimals (Standard currency format)
        const formattedAmount = parseFloat(amount).toFixed(2)
        const cleanProductInfo = productinfo.trim()
        const cleanFirstName = firstname.trim()
        const cleanEmail = email.trim()

        // Generate hash - PayU API v19 formula
        const hash = generatePayUHash({
            key: merchantKey,
            txnid,
            amount: formattedAmount,
            productinfo: cleanProductInfo,
            firstname: cleanFirstName,
            email: cleanEmail,
            phone: phone,
            salt: merchantSalt,
        })

        // Debug logging
        console.log('ProductInfo:', productinfo)
        console.log('FirstName:', firstname)
        console.log('Email:', email)
        console.log('Hash String String:', `${merchantKey}|${txnid}|${formattedAmount}|${cleanProductInfo}|${cleanFirstName}|${cleanEmail}||||||||||||||||${phone}|${merchantSalt}`)
        console.log('=========================')

        // Return payment form data
        return NextResponse.json({
            key: merchantKey,
            txnid,
            amount: formattedAmount,
            productinfo: cleanProductInfo,
            firstname: cleanFirstName,
            email: cleanEmail,
            phone,
            surl: `${callbackBaseUrl}/api/payment/callback`,
            furl: `${callbackBaseUrl}/api/payment/callback`,
            hash,
            api_version: '19',
            paymentUrl: `${baseUrl}/_payment`,
        })
    } catch (error) {
        console.error('Payment initiation error:', error)
        return NextResponse.json(
            { error: 'Failed to initiate payment' },
            { status: 500 }
        )
    }
}
