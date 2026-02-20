export type PrepaidScope = 'store' | 'collection' | 'product';
export type DiscountType = 'flat' | 'percentage';
export type StackingLogic = 'highest_only' | 'stack';

export interface PrepaidRule {
    id: string;
    scope: PrepaidScope;
    scope_id?: string | null; // Product ID or Collection ID
    type: DiscountType;
    value: number;
    min_order_value?: number;
    priority?: number;
}

export interface CartItemForDiscount {
    product_id: string;
    collection_ids?: string[]; // Needed for collection-scoped rules
    price: number;
    qty: number;
}

/**
 * Calculates the total prepaid discount for a cart or single item.
 * @param items List of items (product_id, price, qty, collection_ids)
 * @param rules Active prepaid rules for the store
 * @param stackingLogic Store's stacking preference ('highest_only' | 'stack_all')
 */
export function calculatePrepaidDiscount(
    items: CartItemForDiscount[],
    rules: PrepaidRule[],
    stackingLogic: StackingLogic = 'highest_only'
): number {
    let totalDiscount = 0;

    for (const item of items) {
        // 1. Find matching rules for this item
        const matchingRules = rules.filter(rule => {
            if (rule.min_order_value && (item.price * item.qty) < rule.min_order_value) return false;

            if (rule.scope === 'store') return true;
            if (rule.scope === 'product' && rule.scope_id === item.product_id) return true;
            if (rule.scope === 'collection' && item.collection_ids?.includes(rule.scope_id || '')) return true;

            return false;
        });

        if (matchingRules.length === 0) continue;

        // 2. Calculate savings for each rule
        const potentialSavings = matchingRules.map(rule => {
            let savingsPerUnit = 0;
            if (rule.type === 'percentage') {
                savingsPerUnit = (item.price * rule.value) / 100;
            } else {
                savingsPerUnit = rule.value;
            }
            // Cap at item price (can't discount more than 100%)
            savingsPerUnit = Math.min(savingsPerUnit, item.price);

            return {
                ruleId: rule.id,
                amount: savingsPerUnit * item.qty, // Total savings for this line item
                priority: rule.priority || 0
            };
        });

        // 3. Apply Stacking Logic
        if (stackingLogic === 'stack') {
            // Sum all valid rules
            const itemTotal = potentialSavings.reduce((sum, s) => sum + s.amount, 0);
            // Cap at total line item price
            totalDiscount += Math.min(itemTotal, item.price * item.qty);
        } else {
            // Highest Only (Default)
            // Sort by amount desc, then priority desc
            potentialSavings.sort((a, b) => b.amount - a.amount || b.priority - a.priority);
            const bestRule = potentialSavings[0];
            totalDiscount += bestRule.amount;
        }
    }

    return Math.round(totalDiscount); // Round to nearest integer standard
}
