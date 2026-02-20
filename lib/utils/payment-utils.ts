export type PartialCODConfig = {
    enabled: boolean;
    method: 'percentage' | 'shipping_rate';
    percentage_value: number;
    shipping_rates: {
        '0_500': number;
        '501_1000': number;
        '1001_1500': number;
        '1501_plus': number;
    };
};

export function calculatePartialAmount(
    totalAmount: number,
    totalWeight: number,
    config: PartialCODConfig
): number {
    if (!config.enabled) return 0;

    if (config.method === 'percentage') {
        return Math.round(totalAmount * (config.percentage_value / 100));
    } else {
        // Weight-based brackets
        const rates = config.shipping_rates || {};
        if (totalWeight <= 500) return rates['0_500'] || 60;
        if (totalWeight <= 1000) return rates['501_1000'] || 90;
        if (totalWeight <= 1500) return rates['1001_1500'] || 120;
        return rates['1501_plus'] || 180;
    }
}
