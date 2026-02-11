import crypto from 'crypto'

/**
 * Generate SHA-512 hash for PayU payment request (API Version 19)
 * 
 * Formula: sha512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5|udf6|udf7|udf8|udf9|udf10|user_token|offer_key|offer_auto_apply|cart_details|extra_charges|phone|salt)
 * 
 * All unused fields should be empty strings but their pipe positions must be maintained.
 */
export function generatePayUHash(params: {
    key: string
    txnid: string
    amount: string
    productinfo: string
    firstname: string
    email: string
    phone?: string
    salt: string
    udf1?: string
    udf2?: string
    udf3?: string
    udf4?: string
    udf5?: string
    udf6?: string
    udf7?: string
    udf8?: string
    udf9?: string
    udf10?: string
    user_token?: string
    offer_key?: string
    offer_auto_apply?: string
    cart_details?: string
    extra_charges?: string
}): string {
    const {
        key,
        txnid,
        amount,
        productinfo,
        firstname,
        email,
        phone = '',
        salt,
        udf1 = '',
        udf2 = '',
        udf3 = '',
        udf4 = '',
        udf5 = '',
        udf6 = '',
        udf7 = '',
        udf8 = '',
        udf9 = '',
        udf10 = '',
        user_token = '',
        offer_key = '',
        offer_auto_apply = '',
        cart_details = '',
        extra_charges = '',
    } = params

    // PayU API v19 formula
    const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}|${udf6}|${udf7}|${udf8}|${udf9}|${udf10}|${user_token}|${offer_key}|${offer_auto_apply}|${cart_details}|${extra_charges}|${phone}|${salt}`

    return crypto.createHash('sha512').update(hashString).digest('hex')
}

/**
 * Verify PayU response hash (API Version 19)
 * Formula: sha512(salt|status|phone|extra_charges|cart_details|offer_auto_apply|offer_key|user_token|udf10|udf9|udf8|udf7|udf6|udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)
 */
export function verifyPayUHash(params: {
    key: string
    txnid: string
    amount: string
    productinfo: string
    firstname: string
    email: string
    phone?: string
    status: string
    salt: string
    hash: string
    additional_charges?: string
    udf1?: string
    udf2?: string
    udf3?: string
    udf4?: string
    udf5?: string
    udf6?: string
    udf7?: string
    udf8?: string
    udf9?: string
    udf10?: string
    user_token?: string
    offer_key?: string
    offer_auto_apply?: string
    cart_details?: string
    extra_charges?: string
}): boolean {
    const {
        key,
        txnid,
        amount,
        productinfo,
        firstname,
        email,
        phone = '',
        status,
        salt,
        hash,
        additional_charges = '',
        udf1 = '',
        udf2 = '',
        udf3 = '',
        udf4 = '',
        udf5 = '',
        udf6 = '',
        udf7 = '',
        udf8 = '',
        udf9 = '',
        udf10 = '',
        user_token = '',
        offer_key = '',
        offer_auto_apply = '',
        cart_details = '',
        extra_charges = '',
    } = params

    // 1. Try API v19 Reverse Hash (Standard)
    const hashStringV19 = additional_charges
        ? `${additional_charges}|${salt}|${status}|${phone}|${extra_charges}|${cart_details}|${offer_auto_apply}|${offer_key}|${user_token}|${udf10}|${udf9}|${udf8}|${udf7}|${udf6}|${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`
        : `${salt}|${status}|${phone}|${extra_charges}|${cart_details}|${offer_auto_apply}|${offer_key}|${user_token}|${udf10}|${udf9}|${udf8}|${udf7}|${udf6}|${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`

    const calcHashV19 = crypto.createHash('sha512').update(hashStringV19).digest('hex')

    if (calcHashV19 === hash) return true

    // 2. Try Classic Reverse Hash (Fallback for Sandbox/Legacy)
    // Formula: salt|status|||||||||||email|firstname|productinfo|amount|txnid|key
    // Note: It seems to use 10 empty UDF slots (11 pipes between status and email)
    const hashStringClassic = `${salt}|${status}|${udf10}|${udf9}|${udf8}|${udf7}|${udf6}|${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`
    const calcHashClassic = crypto.createHash('sha512').update(hashStringClassic).digest('hex')

    // DEBUG: Log to file
    try {
        const fs = require('fs');
        const path = require('path');
        const logPath = path.join(process.cwd(), 'payu_debug.log');
        const logMessage = `\n--- Response Hash Debug (${new Date().toISOString()}) ---\n` +
            `Received Hash: ${hash}\n` +
            `Calc V19:      ${calcHashV19}\n` +
            `Calc Classic:  ${calcHashClassic}\n` +
            `String V19:    ${hashStringV19}\n` +
            `String Classic:${hashStringClassic}\n` +
            `Params:        ${JSON.stringify({ status, phone, email, amount, txnid, key, firstname, productinfo, udf1 }, null, 2)}\n`;
        fs.appendFileSync(logPath, logMessage);
    } catch (e) { }

    return calcHashClassic === hash
}

/**
 * Generate unique transaction ID
 */
export function generateTransactionId(): string {
    return `TXN${Date.now()}${Math.random().toString(36).substring(2, 9).toUpperCase()}`
}
