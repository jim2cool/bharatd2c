import exclusionListData from './rto-data/exclusion-list.json'
import emergingRiskData from './rto-data/emerging-risk.json'
import { RTO_WEIGHTS, CATEGORY_RISK_MULTIPLIERS, isHighRiskStatePincode } from './rto-config'
import { supabaseAdmin as supabase } from './supabase-admin'

// Use Sets for O(1) lookup performance
const exclusionList = new Set<string>(exclusionListData as string[])
const emergingRiskList = new Set<string>(emergingRiskData as string[])

export type RiskAssessmentParams = {
    pincode: string | number
    category: string // e.g. 'fashion', 'electronics', 'dropshipping'
    payment_mode: 'cod' | 'online'
    total_amount?: number
    previous_rtos?: number
    name?: string
    address?: string
    phone?: string
    order_timestamp?: string // ISO string to check time of day
    same_address_30d_count?: number
    same_phone_cross_store?: boolean
    session_signals?: {
        deep_scroll_reviews?: boolean
        time_on_page_seconds?: number
        checkout_time_seconds?: number
        rage_clicks?: boolean
        no_reviews?: boolean
        returning_visitor?: boolean
        vpn_proxy?: boolean
        diff_phone_same_device?: boolean
    }
    store?: any // Store object with gateway_status and whatsapp_status
}

export type CapabilityState = 'STATE_A' | 'STATE_B' | 'STATE_C' | 'STATE_D'

export type RiskResult = {
    score: number
    level: 'low' | 'medium' | 'high'
    drivers: string[] // Technical reasons
    summary: string // Plain-language summary (e.g. "Medium Risk — Confirmation Recommended")
    recommendation: string // Explanation/Action (e.g. "Order was flagged because...")
    action_type: 'whatsapp_confirm' | 'partial_prepaid' | 'prepaid_only' | 'auto_cancel' | 'hold_for_review' | 'none'
    state: CapabilityState
    target_action?: string // What would have happened in STATE A
}

export async function calculateRiskScore(params: RiskAssessmentParams): Promise<RiskResult> {
    const {
        pincode, category, payment_mode, total_amount = 0, previous_rtos = 0,
        name = '', address = '', phone = '', order_timestamp,
        same_address_30d_count = 0, same_phone_cross_store = false, session_signals
    } = params
    const pinStr = String(pincode).trim()

    let score = 0
    const drivers: string[] = []

    // 1. Check Exclusion List (Kill Pass) - Historical Blacklist
    if (exclusionList.has(pinStr)) {
        score += RTO_WEIGHTS.EXCLUSION_LIST_MATCH
        drivers.push(`Pincode (${pinStr}) matches historical deep exclusion list (+${RTO_WEIGHTS.EXCLUSION_LIST_MATCH}).`)
    }

    // 2. Check Emerging Risk Zones (Statistical Data)
    if (emergingRiskList.has(pinStr)) {
        score += RTO_WEIGHTS.EMERGING_HIGH_RISK_MATCH
        drivers.push(`Pincode (${pinStr}) identified in recent statistical high-RTO zones (+${RTO_WEIGHTS.EMERGING_HIGH_RISK_MATCH}).`)
    }

    // 3. Check State-level High Risk (JK, AN, NE)
    if (isHighRiskStatePincode(pinStr)) {
        score += RTO_WEIGHTS.HIGH_RISK_STATE_MATCH
        drivers.push(`Pincode (${pinStr}) belongs to a high-risk logistics region (NE, J&K, A&N) (+${RTO_WEIGHTS.HIGH_RISK_STATE_MATCH}).`)
    }

    // 4. Past Customer Behavior
    if (previous_rtos > 0) {
        const punishment = previous_rtos * RTO_WEIGHTS.PREVIOUS_RTO_PUNISHMENT
        score += punishment
        drivers.push(`Customer has ${previous_rtos} previous RTO order(s) (Penalty: +${punishment}).`)
    }

    // 5. Zero-Cost Heuristics Check

    // 5a. Sequential / Fake Phone
    const isFakePhone = /^(\d)\1{9}$/.test(phone) || phone === '1234567890' || phone === '0987654321'
    if (isFakePhone && phone) {
        score += RTO_WEIGHTS.SEQUENTIAL_PHONE
        drivers.push(`Phone number seems fake/sequential (+${RTO_WEIGHTS.SEQUENTIAL_PHONE}).`)
    }

    // 5b. Gibberish Name (No vowels, or very short)
    const cleanName = name.replace(/[^a-zA-Z]/g, '')
    if (cleanName && (!/[aeiouy]/i.test(cleanName) || cleanName.length < 3)) {
        score += RTO_WEIGHTS.GIBBERISH_NAME_ADDRESS
        drivers.push(`Customer name appears to be gibberish/invalid (+${RTO_WEIGHTS.GIBBERISH_NAME_ADDRESS}).`)
    }

    // 5c. Incomplete Address (No numbers/house designation)
    if (address && !/\d/.test(address) && address.length < 15) {
        score += RTO_WEIGHTS.INCOMPLETE_ADDRESS
        drivers.push(`Address looks incomplete, missing house/building numbers (+${RTO_WEIGHTS.INCOMPLETE_ADDRESS}).`)
    }

    // 6. IndiaPost API Reality Check
    try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${pinStr}`, {
            signal: AbortSignal.timeout(3000) // 3s timeout so we don't block order creation
        })
        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) {
            if (data[0].Status === 'Error') {
                score += RTO_WEIGHTS.INDIAPOST_INVALID_PINCODE
                drivers.push(`IndiaPost confirmed invalid pincode (+${RTO_WEIGHTS.INDIAPOST_INVALID_PINCODE}).`)
            } else if (data[0].PostOffice && Array.isArray(data[0].PostOffice)) {
                // Check if ALL post offices for this pin are non-delivery
                const allNonDelivery = data[0].PostOffice.every((po: any) => po.DeliveryStatus === 'Non-Delivery')
                if (allNonDelivery) {
                    score += RTO_WEIGHTS.INDIAPOST_NO_DELIVERY
                    drivers.push(`IndiaPost confirms pincode is a strict Non-Delivery zone (+${RTO_WEIGHTS.INDIAPOST_NO_DELIVERY}).`)
                }
            }
        }
    } catch (e) {
        console.warn('IndiaPost API check skipped/failed: Timeout or network error.')
    }

    // --- Layer 1.4: Real-time Pincode Intelligence (Living DB) ---
    try {
        const { data: dbRisk } = await supabase
            .from('pincode_intelligence')
            .select('*')
            .eq('pincode', pinStr)
            .or(`category.eq.${category},category.eq.default`)
            .order('category', { ascending: false }) // Prioritize specific category over default
            .limit(1)
            .single()

        if (dbRisk) {
            if (dbRisk.risk_score_modifier !== 0) {
                score += dbRisk.risk_score_modifier
                drivers.push(`Database Intelligence: Manual risk calibration for this zone (${dbRisk.risk_score_modifier > 0 ? '+' : ''}${dbRisk.risk_score_modifier}).`)
            }

            // Auto-calculate penalty if RTO rate is high (> 30%)
            if (dbRisk.total_orders >= 5) {
                const rtoRate = (dbRisk.rto_orders / dbRisk.total_orders) * 100
                if (rtoRate > 30) {
                    const rtoPenalty = Math.round((rtoRate - 30) * 1.5) // 1.5 points per % above 30
                    score += rtoPenalty
                    drivers.push(`Platform Data: High real-time RTO rate detected (${rtoRate.toFixed(1)}%) (+${rtoPenalty}).`)
                }
            }
        }
    } catch (e) {
        // Silent fallback if table doesn't exist yet
    }

    // --- Order-Level Signals ---

    // 1AM to 4AM IST check
    if (order_timestamp) {
        const orderDate = new Date(order_timestamp)
        // Convert to IST
        const istTime = new Date(orderDate.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
        const hour = istTime.getHours()
        if (hour >= 1 && hour < 4) {
            score += RTO_WEIGHTS.TIME_1AM_4AM_IST
            drivers.push(`Impulse Window: Order placed between 1AM-4AM IST (+${RTO_WEIGHTS.TIME_1AM_4AM_IST}).`)
        }
    }

    // COD Value bands
    if (payment_mode === 'cod') {
        if (total_amount >= 500 && total_amount <= 1499) {
            score += RTO_WEIGHTS.COD_VALUE_500_1499
            drivers.push(`COD order falls in highest RTO value band (₹500-₹1499) (+${RTO_WEIGHTS.COD_VALUE_500_1499}).`)
        } else if (total_amount > 2000) {
            score += RTO_WEIGHTS.COD_VALUE_ABOVE_2000
            drivers.push(`High COD transaction value (>₹2000) without upfront commitment (+${RTO_WEIGHTS.COD_VALUE_ABOVE_2000}).`)
        }
    }

    // High velocity to same address
    if (same_address_30d_count >= 3) {
        score += RTO_WEIGHTS.SAME_ADDRESS_3_COD_30_DAYS
        drivers.push(`Velocity Flag: 3+ COD orders to this exact address in last 30 days (+${RTO_WEIGHTS.SAME_ADDRESS_3_COD_30_DAYS}).`)
    }

    // Cross-store behavior
    if (same_phone_cross_store) {
        score += RTO_WEIGHTS.SAME_PHONE_CROSS_STORE
        drivers.push(`Platform Intelligence: Phone number linked to orders across multiple stores recently (+${RTO_WEIGHTS.SAME_PHONE_CROSS_STORE}).`)
    }

    // --- Session Behavior Signals (Adaptive Engine Feed) ---
    if (session_signals) {
        if (session_signals.deep_scroll_reviews) {
            score += RTO_WEIGHTS.SESSION_DEEP_SCROLL_REVIEWS
            drivers.push(`Behavioral Confidence: Deep scroll and lengthy review dwell time. Highly considered intent (${RTO_WEIGHTS.SESSION_DEEP_SCROLL_REVIEWS}).`)
        }
        if (session_signals.time_on_page_seconds && session_signals.time_on_page_seconds >= 180) {
            score += RTO_WEIGHTS.SESSION_TIME_ON_PAGE_3M
            drivers.push(`Behavioral Confidence: Real buyer pacing (> 3m time on page) (${RTO_WEIGHTS.SESSION_TIME_ON_PAGE_3M}).`)
        }
        if (session_signals.checkout_time_seconds && session_signals.checkout_time_seconds < 45) {
            score += RTO_WEIGHTS.SESSION_FAST_CHECKOUT_45S
            drivers.push(`Behavioral High Risk: Checkout completed abnormally fast (<45s from landing). Probable impulse/bot click (+${RTO_WEIGHTS.SESSION_FAST_CHECKOUT_45S}).`)
        }
        if (session_signals.rage_clicks) {
            score += RTO_WEIGHTS.SESSION_RAGE_CLICKS
            drivers.push(`Behavioral Warning: Rage clicks detected during session (+${RTO_WEIGHTS.SESSION_RAGE_CLICKS}).`)
        }
        if (session_signals.no_reviews) {
            score += RTO_WEIGHTS.SESSION_NO_REVIEWS
            drivers.push(`Behavioral Warning: Zero interaction with review sections before checkout (+${RTO_WEIGHTS.SESSION_NO_REVIEWS}).`)
        }
        if (session_signals.returning_visitor) {
            score += RTO_WEIGHTS.SESSION_RETURNING_VISITOR
            drivers.push(`Behavioral Confidence: Returning visitor before ordering. Considered purchase intent (${RTO_WEIGHTS.SESSION_RETURNING_VISITOR}).`)
        }
        if (session_signals.vpn_proxy) {
            score += RTO_WEIGHTS.SESSION_VPN_PROXY
            drivers.push(`Behavioral Danger: VPN or Data Center IP detected (+${RTO_WEIGHTS.SESSION_VPN_PROXY}).`)
        }
        if (session_signals.diff_phone_same_device) {
            score += RTO_WEIGHTS.SESSION_SAME_DEVICE_DIFF_PHONE
            drivers.push(`Behavioral Danger: Device fingerprint matched to a different phone number previously (+${RTO_WEIGHTS.SESSION_SAME_DEVICE_DIFF_PHONE}).`)
        }
    }

    // --- Category Multiplier ---
    const multiplier = CATEGORY_RISK_MULTIPLIERS[category.toLowerCase()] || CATEGORY_RISK_MULTIPLIERS['default']
    if (multiplier !== 1.0) {
        const origBase = score
        score = Math.round(score * multiplier)
        if (score !== origBase) {
            drivers.push(`Category Profile: Baseline score scaled by ${multiplier}x for '${category}' logistics profile.`)
        }
    }

    // --- Strict Payment Context Multiplier (Final Pass) ---
    if (payment_mode === 'cod') {
        const originalScore = score
        score = Math.round(score * RTO_WEIGHTS.COD_MULTIPLIER)

        // Multiplier only matters if it increases a non-zero score
        if (score > originalScore) {
            drivers.push(`Score multiplied by ${RTO_WEIGHTS.COD_MULTIPLIER}x due to Cash on Delivery (COD).`)
        }
    } else if (payment_mode === 'online') {
        const originalScore = score
        score = Math.round(score * RTO_WEIGHTS.PREPAID_MULTIPLIER)
        if (originalScore > 0) {
            drivers.push(`Score drastically reduced (x${RTO_WEIGHTS.PREPAID_MULTIPLIER}) due to Prepaid Online Payment.`)
        }
    }

    // Decide Level before capping to see true risk depth, but return capped score
    // We cap at 100 max, 0 min.
    score = Math.min(100, Math.max(0, score))

    // --- Configuration State Resolution ---
    const state = resolveCapabilityState(params.store)
    const intervention = getIntervention(score, state)

    // Overrides for specific heavy drivers
    if (previous_rtos >= 2 && intervention.action_type !== 'auto_cancel') {
        intervention.action_type = 'auto_cancel'
        intervention.summary = 'High Risk — Blocked History'
        intervention.recommendation = 'Customer has 2+ previous RTO orders. Auto-cancellation is the safest path to protect margins.'
    }

    if (score === 0) {
        drivers.push('No significant risk factors found.')
    }

    return {
        score,
        level: score >= 70 ? 'high' : (score >= 40 ? 'medium' : 'low'),
        drivers,
        summary: intervention.summary,
        recommendation: intervention.recommendation,
        action_type: intervention.action_type,
        state,
        target_action: intervention.target_action
    }
}

/**
 * --- Configuration State Resolver (CSR) Logic ---
 */

export function resolveCapabilityState(store: any): CapabilityState {
    const gateway = store?.gateway_status === 'verified'
    const whatsapp = store?.whatsapp_status === 'connected'

    if (gateway && whatsapp) return 'STATE_A'
    if (gateway && !whatsapp) return 'STATE_B'
    if (!gateway && whatsapp) return 'STATE_C'
    return 'STATE_D'
}

export function getIntervention(score: number, state: CapabilityState): {
    action_type: RiskResult['action_type'],
    target_action: string,
    summary: string,
    recommendation: string
} {
    // 1. Identify Target Action (State A Logic)
    let target: RiskResult['action_type'] = 'none'
    if (score >= 85) target = 'auto_cancel'
    else if (score >= 70) target = 'prepaid_only'
    else if (score >= 55) target = 'partial_prepaid'
    else if (score >= 40) target = 'whatsapp_confirm'

    // 2. Resolve based on Capability Map
    let action: RiskResult['action_type'] = 'none'
    let summary = 'Low Risk — Safe to Ship'
    let recommendation = 'No significant risk factors detected for this order.'

    switch (state) {
        case 'STATE_A':
            action = target
            break

        case 'STATE_B': // Payments Only, No WhatsApp
            if (target === 'whatsapp_confirm') {
                action = 'none' // Auto-fulfill
                summary = 'Medium Risk — Fulfilled (No Verification Loop)'
                recommendation = 'WhatsApp not connected. Order fulfilled without intent verification.'
            } else {
                action = target
            }
            break

        case 'STATE_C': // WhatsApp Only, No Gateway
            if (target === 'partial_prepaid' || target === 'prepaid_only') {
                if (target === 'partial_prepaid') {
                    action = 'whatsapp_confirm'
                    summary = 'Medium-High Risk — Confirmation Sent (Manual Review needed)'
                    recommendation = 'No gateway for partial payment. Confirmation loop triggered instead.'
                } else {
                    action = 'none' // Blocked? Spec says COD Suppressed.
                    // Actually, if COD is suppressed and no gateway, sale is blocked.
                    // We'll return 'none' here but the caller (order-service) should check if they should block.
                    // Wait, spec says: 70-84 band -> "COD suppressed. Buyer sees COD unavailable."
                    // Let's use 'none' and have order-service throw an error if this happens.
                    summary = 'High Risk — COD Blocked (Sale Lost)'
                    recommendation = 'No payment gateway to offer prepaid alternative. Order blocked.'
                }
            } else {
                action = target
            }
            break

        case 'STATE_D': // Minimal
            if (target === 'whatsapp_confirm' || target === 'partial_prepaid') {
                action = 'hold_for_review'
                summary = 'Medium Risk — Order Held for Review'
                recommendation = 'No automated verification tools available. Manual seller decision required.'
            } else if (target === 'prepaid_only') {
                action = 'none'
                summary = 'High Risk — COD Blocked (Sale Lost)'
                recommendation = 'No payment gateway. Sale blocked for high-risk zone.'
            } else {
                action = target
            }
            break
    }

    // Standard summaries for the action taken
    if (action === 'auto_cancel') {
        summary = 'High Risk — Auto-Cancellation Triggered'
        recommendation = `Score ${score} exceeds safety threshold. Auto-rejecting to protect margins.`
    } else if (action === 'prepaid_only') {
        summary = 'High Risk — Prepaid Only'
        recommendation = 'Redirected to prepaid only due to high regional or behavioral risk.'
    } else if (action === 'partial_prepaid') {
        summary = 'Medium-High Risk — Partial Prepaid Active'
        recommendation = 'Partial commitment required to secure order.'
    } else if (action === 'whatsapp_confirm') {
        summary = 'Medium Risk — Confirmation Triggered'
        recommendation = 'Verifying intent via WhatsApp confirmation loop.'
    }

    return {
        action_type: action,
        target_action: target,
        summary,
        recommendation
    }
}
