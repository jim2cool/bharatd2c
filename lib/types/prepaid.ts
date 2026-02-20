export type PrepaidScope = 'store' | 'collection' | 'product';
export type DiscountType = 'flat' | 'percentage';
export type StackingLogic = 'highest_only' | 'stack';

export interface PrepaidConfig {
    id: string;
    store_id: string;
    scope: PrepaidScope;
    scope_id?: string | null;
    type: DiscountType;
    value: number;
    min_order_value?: number;
    is_active: boolean;
    priority?: number;
    created_at?: string;
}

export interface StorePrepaidSettings {
    prepaid_stacking_logic: StackingLogic;
}
