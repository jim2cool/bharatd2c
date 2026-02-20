import { createClient } from '@supabase/supabase-js'
import { calculateRiskScore, RiskResult } from '@/lib/rto-engine'
import { calculatePartialAmount } from '@/lib/utils/payment-utils'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export type OrderCreationParams = {
    name: string
    phone: string
    address: string
    pincode: string
    city: string
    state: string
    cart: any[]
    payment_method: 'cod' | 'online' | 'partial_cod'
    otp_verified?: boolean
    payment_id?: string
    transaction_id?: string
    session_signals?: any
    pincode_meta?: any
}

export async function createOrder(params: OrderCreationParams) {
    const {
        name, phone, address, pincode, city, state, cart,
        payment_method, otp_verified = false, payment_id, transaction_id,
        session_signals, pincode_meta
    } = params

    /* 1. Basic Validation */
    if (!Array.isArray(cart) || cart.length === 0) throw new Error('CART_EMPTY')
    if (!/^[6-9]\d{9}$/.test(phone)) throw new Error('INVALID_PHONE')

    /* 2. Store Lookup */
    const { data: store } = await supabase.from('stores').select('id, store_code, partial_cod_config, gateway_status, whatsapp_status').limit(1).single()
    if (!store) throw new Error('STORE_NOT_FOUND')

    /* 3. Customer Lookup */
    const { data: existingCustomer } = await supabase.from('customers').select('id').eq('phone', phone).single()
    let customerId = existingCustomer?.id
    if (!customerId) {
        const { data: newCustomer } = await supabase.from('customers').insert([{ phone }]).select().single()
        if (!newCustomer) throw new Error('CUSTOMER_CREATION_FAILED')
        customerId = newCustomer.id
    }

    /* 4. COD Rate Limit (Legacy Check) */
    if (payment_method === 'cod') {
        const { count: pendingCodOrders } = await supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .eq('customer_id', customerId)
            .eq('payment_mode', 'cod')
            .eq('status', 'new')
        if (pendingCodOrders && pendingCodOrders >= 5) throw new Error('COD_RATE_LIMIT')
    }

    /* 5. Total Calculation & Weight Extraction */
    const productIds = cart.map((i: any) => i.product_id)
    const { data: products } = await supabase
        .from('products')
        .select('id, price, weight_grams, partial_cod_enabled, use_store_partial_settings')
        .in('id', productIds)
    if (!products) throw new Error('PRODUCT_LOOKUP_FAILED')

    const priceMap = new Map(products.map(p => [p.id, p.price]))
    const weightMap = new Map(products.map(p => [p.id, p.weight_grams || 500]))

    let total_amount = 0
    let total_weight = 0
    const orderItems = cart.map((item: any) => {
        const price = priceMap.get(item.product_id) || item.price
        const weight = weightMap.get(item.product_id) || 500
        const qty = Math.max(1, Number(item.qty) || 1)

        total_amount += price * qty
        total_weight += weight * qty

        return { product_id: item.product_id, qty, price }
    })

    /* 6. Order Number Generation */
    const order_number = await generateOrderNumber(store.id, store.store_code)

    /* 7. RTO Risk Calculation */
    const { count: previousRtos } = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('customer_id', customerId).eq('status', 'rto')
    const { count: sameAddressCount } = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('customer_id', customerId).eq('payment_mode', 'cod').gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

    const riskResult = await calculateRiskScore({
        pincode,
        category: 'default',
        payment_mode: payment_method === 'online' ? 'online' : 'cod',
        total_amount,
        previous_rtos: previousRtos || 0,
        name, address, phone,
        order_timestamp: new Date().toISOString(),
        same_address_30d_count: sameAddressCount || 0,
        session_signals,
        store
    })

    /* 7a. Blocked Sale Handling (State C/D logic from CSR) */
    if (riskResult.action_type === 'none' && riskResult.score >= 70 && payment_method === 'cod') {
        throw new Error('COD_UNAVAILABLE_FOR_LOCATION') // High risk but no gateway to redirect
    }

    /* --- Standardized Partial COD Calculation (Phase 26) --- */
    let effective_partial_amount = 0
    let partial_gate_active = false

    // Check if store-wide partial COD is enabled
    const storeConfig = store.partial_cod_config || {}
    const storeEnabled = storeConfig.enabled === true

    // Check if any product in cart forces partial COD or if store forces all
    const hasProductForcingPartial = products.some(p => p.partial_cod_enabled && !p.use_store_partial_settings)

    if (payment_method === 'cod' || payment_method === 'partial_cod') {
        if (storeEnabled || hasProductForcingPartial || riskResult.action_type === 'partial_prepaid') {
            partial_gate_active = true

            // Priority: Intervention B from Layer 3 defaults to 200, 
            // but Store/Product Config overrides it.
            if (storeEnabled || hasProductForcingPartial) {
                effective_partial_amount = calculatePartialAmount(total_amount, total_weight, storeConfig)
            } else {
                // Baseline RTO Intervention amount
                effective_partial_amount = 200
            }
        }
    }

    /* 7b. Very High Risk Auto-Rejection (Layer 3.1) */
    if (riskResult.score >= 85 && payment_method === 'cod') {
        throw new Error('VERY_HIGH_RISK_COD_REJECTED')
    }

    /* 7c. Execute CSR Intervention Logging */
    const isPartial = payment_method === 'partial_cod'
    let orderStatus = isPartial ? 'confirmed' : 'new'
    if (riskResult.action_type === 'hold_for_review') {
        orderStatus = 'held'
    }

    /* 8. Create Order */
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([
            {
                store_id: store.id,
                customer_id: customerId,
                order_number,
                status: orderStatus,
                payment_mode: isPartial ? 'cod' : payment_method, // It is a COD order if partial
                total_amount,
                risk_level: riskResult.level,
                payment_id: payment_id || null,
                transaction_id: transaction_id || null,
                meta: {
                    name, phone, address, pincode, city, state,
                    pincode_meta,
                    otp_verified: otp_verified || isPartial,
                    risk_score: riskResult.score,
                    risk_drivers: riskResult.drivers,
                    partial_prepaid: isPartial || partial_gate_active,
                    paid_amount: isPartial ? effective_partial_amount : (payment_method === 'online' ? total_amount : 0),
                    total_weight
                }
            }
        ])
        .select()
        .single()

    if (orderError || !order) throw new Error('ORDER_INSERT_FAILED: ' + orderError?.message)

    /* 8b. Log RTO Intervention (CSR) */
    if (riskResult.action_type !== 'none' || riskResult.target_action !== 'none') {
        await supabase.from('order_interventions').insert([{
            order_id: order.id,
            score: riskResult.score,
            config_state: riskResult.state,
            action_taken: riskResult.action_type,
            target_action: riskResult.target_action,
            metadata: {
                summary: riskResult.summary,
                recommendation: riskResult.recommendation,
                drivers: riskResult.drivers
            }
        }])
    }

    /* 9. Order Items Injection */
    await supabase.from('order_items').insert(
        orderItems.map(item => ({
            order_id: order.id,
            product_id: item.product_id,
            qty: item.qty,
            price: item.price,
        }))
    )

    return order
}

async function generateOrderNumber(storeId: string, storeCode: string) {
    const now = new Date()
    const mmyy = `${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getFullYear()).slice(-2)}`
    const prefix = `${storeCode}-${mmyy}`

    const { data: lastOrder } = await supabase
        .from('orders')
        .select('order_number')
        .like('order_number', `${prefix}-%`)
        .order('order_number', { ascending: false })
        .limit(1)
        .single()

    const nextSeq = lastOrder?.order_number ? (Number(lastOrder.order_number.split('-').pop()) + 1) : 1
    return `${prefix}-${String(nextSeq).padStart(6, '0')}`
}
