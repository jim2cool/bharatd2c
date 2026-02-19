/**
 * THE RESOLUTION ENGINE
 * ---------------------
 * Centralizes the hierarchy logic: Platform (Global Gate) > Store (Default) > Product (Override)
 * This ensures consistency across PDP, Cart, Checkout, and Admin.
 */

export interface ResolutionContext {
    platform: Record<string, any>;
    store: Record<string, any>;
    product: Record<string, any>;
    useStoreDefaults?: boolean;
}

export const ResolutionEngine = {
    /**
     * Resolves a boolean feature flag (e.g., cod_enabled).
     * Logic: 
     * 1. If Platform disables it, it's OFF regardless of others.
     * 2. If Product has use_store_defaults=true, use Store value.
     * 3. Otherwise use Product value.
     */
    resolveBoolean: (
        key: string,
        ctx: ResolutionContext
    ): boolean => {
        const globalGate = ctx.platform?.[key] ?? true;
        if (globalGate === false) return false;

        const storeVal = ctx.store?.[key] ?? true;
        const productVal = ctx.product?.[key] ?? true;

        // Resolve local preference
        const resolvedLocal = ctx.useStoreDefaults !== false ? storeVal : productVal;

        return resolvedLocal;
    },

    resolveString: (
        key: string,
        ctx: ResolutionContext,
        defaultValue: string = ""
    ): string => {
        const globalVal = ctx.platform?.[key] as string | undefined;
        const storeVal = ctx.store?.[key] as string | undefined;
        const productVal = ctx.product?.[key] as string | undefined;

        const resolvedLocal = ctx.useStoreDefaults !== false ? storeVal : productVal;

        return resolvedLocal ?? globalVal ?? defaultValue;
    },

    /**
     * Future-proof: Resolves numeric policies (e.g., min_order_value, tax_rate).
     * Hierarchy: Product Override > Store Default > Platform Floor/Ceiling.
     */
    resolveNumeric: (
        key: string,
        ctx: ResolutionContext,
        options?: { floor?: number; ceiling?: number }
    ): number => {
        const storeVal = Number(ctx.store?.[key] || 0);
        const productVal = Number(ctx.product?.[key] || storeVal);

        let resolved = ctx.useStoreDefaults !== false ? storeVal : productVal;

        if (options?.floor !== undefined) resolved = Math.max(resolved, options.floor);
        if (options?.ceiling !== undefined) resolved = Math.min(resolved, options.ceiling);

        return resolved;
    }
};
