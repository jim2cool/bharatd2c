/**
 * Easy D2C: RTO Intelligence
 * Protects margins by identifying high-risk India pincodes and payment behaviors.
 */

export interface RTOScore {
    riskLevel: 'low' | 'medium' | 'high';
    score: number;
    warnings: string[];
    recommendation: 'allow_all' | 'prefer_prepaid' | 'restrict_cod';
}

// Map of high-risk regions/pincodes (simulated for demo)
const HIGH_RISK_PINCODES = [
    '800001', // Example major city zone with high historical RTO
    '110001', // Example high-traffic but high-fraud zone
    '700001',
]

const MEDIUM_RISK_PREFIXES = [
    '8', // Bihar/Jharkhand (High RTO corridors)
    '7', // West Bengal/NE
]

export function evaluateRTORisk(pincode: string, paymentMode: string): RTOScore {
    let score = 0;
    const warnings: string[] = [];

    // 1. Pincode Check
    if (HIGH_RISK_PINCODES.includes(pincode)) {
        score += 50;
        warnings.push('High-RTO history in this specific zone.');
    } else {
        const prefix = pincode.charAt(0);
        if (MEDIUM_RISK_PREFIXES.includes(prefix)) {
            score += 25;
            warnings.push('Moderate RTO risk for this state/region.');
        }
    }

    // 2. COD Penalty
    if (paymentMode === 'cod') {
        score += 30;
        warnings.push('COD orders have 3x higher RTO probability.');
    }

    // Final Assessment
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    let recommendation: 'allow_all' | 'prefer_prepaid' | 'restrict_cod' = 'allow_all';

    if (score >= 70) {
        riskLevel = 'high';
        recommendation = 'restrict_cod';
    } else if (score >= 30) {
        riskLevel = 'medium';
        recommendation = 'prefer_prepaid';
    }

    return { riskLevel, score, warnings, recommendation };
}
