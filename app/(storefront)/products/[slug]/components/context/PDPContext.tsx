'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// PDP Context — provides shared state across all PDP components
interface PDPContextValue {
    product: any;
    qty: number;
    setQty: (qty: number) => void;
    selectedVariant: any;
    setSelectedVariant: (v: any) => void;
    currentPrice: number;
    currentMrp: number;
    currentStock: number;
    prepaidSavings: number;
}

const PDPContext = createContext<PDPContextValue | null>(null);

export function PDPProvider({ children, product }: { children: ReactNode; product: any }) {
    const [qty, setQty] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState<any>(null);

    const currentPrice = selectedVariant?.price ?? product?.price ?? 0;
    const currentMrp = selectedVariant?.mrp ?? product?.mrp ?? currentPrice;
    const currentStock = selectedVariant?.stock ?? product?.stock ?? 99;
    const prepaidSavings = Math.round(currentPrice * 0.02); // 2% default prepaid benefit

    return (
        <PDPContext.Provider value={{
            product,
            qty, setQty,
            selectedVariant, setSelectedVariant,
            currentPrice, currentMrp, currentStock, prepaidSavings,
        }}>
            {children}
        </PDPContext.Provider>
    );
}

export function usePDP() {
    const ctx = useContext(PDPContext);
    if (!ctx) throw new Error('usePDP must be used within a PDPProvider');
    return ctx;
}
