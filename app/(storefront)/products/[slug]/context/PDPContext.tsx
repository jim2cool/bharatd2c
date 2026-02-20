"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ProductData } from '../types/pdp';
import { CategoryConfig, SellerModifier } from '@/types/architecture';
import { CATEGORY_MODULE_REGISTRY } from '@/lib/architecture/category-registry';

interface PDPContextType {
    product: ProductData;
    categoryConfig: CategoryConfig;
    activeModules: string[];
    selectedVariant: any;
    setSelectedVariant: (variant: any) => void;
    qty: number;
    setQty: (qty: number) => void;
    selectedBundleId: string;
    setSelectedBundleId: (id: string) => void;

    // Computed
    currentPrice: number;
    currentMrp: number;
    currentQty: number;
    prepaidSavings: number;
    currentStock: number | undefined;

    // UI State
    isSizeGuideOpen: boolean;
    setIsSizeGuideOpen: (open: boolean) => void;
}

const PDPContext = createContext<PDPContextType | undefined>(undefined);

export function PDPProvider({
    children,
    product,
    categoryConfig
}: {
    children: ReactNode;
    product: ProductData;
    categoryConfig: CategoryConfig;
}) {
    // Determine active modules based on category
    const categorySchema = CATEGORY_MODULE_REGISTRY[categoryConfig.category] || CATEGORY_MODULE_REGISTRY['multi'];
    const activeModules = [
        ...categorySchema.required,
        ...(categoryConfig.requiredModules || []),
        ...(categoryConfig.optionalModules || [])
    ];

    const [selectedVariant, setSelectedVariant] = useState<any>(
        product.variants?.find(v => v.id === product.bundles[0]?.id) || null
    );
    const [qty, setQty] = useState(1);
    const [selectedBundleId, setSelectedBundleId] = useState<string>(
        product.bundles[0]?.id || ""
    );
    const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

    // Pricing Logic (Moved from Conversion.tsx)
    const hasVariants = product.has_variants && product.variants && product.variants.length > 0;
    const hasTiers = product.bundle_settings?.enabled && product.bundle_settings?.tiers && product.bundle_settings.tiers.length > 0;
    const hasBundles = !hasVariants && !hasTiers && product.bundles && product.bundles.length > 1;

    let basePrice = product.pricing.sellingPrice;
    let baseMrp = product.pricing.mrp;

    if (hasVariants && selectedVariant) {
        basePrice = selectedVariant.price;
        baseMrp = selectedVariant.mrp || selectedVariant.price;
    }

    let currentPrice = basePrice;
    let currentMrp = baseMrp;
    let currentQty = qty;

    if (hasTiers) {
        const tier = product.bundle_settings?.tiers?.find(t => t.qty === qty);
        const qtyDiscount = tier ? tier.discount : 0;
        currentPrice = Math.round(basePrice * (1 - qtyDiscount / 100));
        currentMrp = baseMrp;
        currentQty = qty;
    } else if (hasBundles) {
        const selectedBundle = product.bundles.find(b => b.id === selectedBundleId) || product.bundles[0];
        currentPrice = selectedBundle.sellingPrice;
        currentMrp = selectedBundle.mrp || selectedBundle.sellingPrice;
        currentQty = selectedBundle.unitCount;
    }

    const prepaidSavings = product.pricing.prepaid?.calculatedSavings || 0;
    const currentStock = (hasVariants && selectedVariant) ? selectedVariant.inventory : undefined;

    return (
        <PDPContext.Provider value={{
            product,
            categoryConfig,
            activeModules,
            selectedVariant,
            setSelectedVariant,
            qty,
            setQty,
            selectedBundleId,
            setSelectedBundleId,
            currentPrice,
            currentMrp,
            currentQty,
            prepaidSavings,
            currentStock,
            isSizeGuideOpen,
            setIsSizeGuideOpen
        }}>
            {children}
        </PDPContext.Provider>
    );
}

export function usePDP() {
    const context = useContext(PDPContext);
    if (context === undefined) {
        throw new Error('usePDP must be used within a PDPProvider');
    }
    return context;
}
