export const RTO_WEIGHTS = {
    // Pass 1: Hard Rules
    EXCLUSION_LIST_MATCH: 100, // Insta-high-risk

    // Pass 2: Base Weights
    EMERGING_HIGH_RISK_MATCH: 60,
    HIGH_RISK_STATE_MATCH: 40,

    // Past Behavior
    PREVIOUS_RTO_PUNISHMENT: 50, // Per RTO

    // Heuristics
    GIBBERISH_NAME_ADDRESS: 30,
    INCOMPLETE_ADDRESS: 20,
    SEQUENTIAL_PHONE: 50,

    // IndiaPost
    INDIAPOST_INVALID_PINCODE: 100,
    INDIAPOST_NO_DELIVERY: 40,

    // Multipliers
    COD_MULTIPLIER: 1.5,
    PREPAID_MULTIPLIER: 0.1, // Drastically reduce risk if prepaid

    // Order-Level Signals
    TIME_1AM_4AM_IST: 15,
    COD_VALUE_500_1499: 20,
    COD_VALUE_ABOVE_2000: 25,
    VALUE_3X_PINCODE_MEDIAN: 20,
    SAME_ADDRESS_3_COD_30_DAYS: 30,
    SAME_PHONE_CROSS_STORE: 15,

    // Session Behavior Signals
    SESSION_DEEP_SCROLL_REVIEWS: -15,
    SESSION_TIME_ON_PAGE_3M: -10,
    SESSION_FAST_CHECKOUT_45S: 20,
    SESSION_RAGE_CLICKS: 15,
    SESSION_NO_REVIEWS: 10,
    SESSION_RETURNING_VISITOR: -20,
    SESSION_VPN_PROXY: 35,
    SESSION_SAME_DEVICE_DIFF_PHONE: 40,
}

export const CATEGORY_RISK_MULTIPLIERS: Record<string, number> = {
    'fashion': 1.3,
    'dropshipping': 1.4,
    'beauty': 1.1,
    'electronics': 1.2,
    'health': 0.9,
    'food': 0.8,
    'spiritual': 1.0,
    'default': 1.0
}

export const HIGH_RISK_PINCODE_PREFIXES = [
    '18', '19', // Jammu & Kashmir
    '744', // Andaman & Nicobar
    '78', // Assam
    '79', // Covers Arunachal (790-792), Meghalaya (793-794), Manipur (795), Mizoram (796), Nagaland (797-798), Tripura (799)
]

export function isHighRiskStatePincode(pincode: string | number): boolean {
    const code = String(pincode).trim()
    if (!code) return false
    return HIGH_RISK_PINCODE_PREFIXES.some(prefix => code.startsWith(prefix))
}
