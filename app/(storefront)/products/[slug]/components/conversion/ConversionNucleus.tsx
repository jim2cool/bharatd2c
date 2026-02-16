"use client"

import React from 'react';
import { usePDP } from '../../context/PDPContext';
import { usePDPHandlers } from '../hooks/usePDPHandlers';
import { ProductInfo } from '../ProductInfo';
import { PriceBlock } from './PriceBlock';
import { CTAGroup } from './CTAGroup';
import { VariantSelector } from './VariantSelector';
import { QuantitySelector } from './QuantitySelector';

export function ConversionNucleus() {
    const {
        product,
        qty,
        setQty,
        setSelectedVariant,
        currentPrice,
        currentMrp,
        prepaidSavings,
        currentStock
    } = usePDP();

    const { handleCod, handlePrepaid, handleAddToCart } = usePDPHandlers();

    return (
        <div
            className="flex flex-col w-full pb-[72px] md:pb-0"
            style={{ gap: 'var(--component-gap)' }}
            id="conversion-nucleus"
        >
            {/* 1. Title & Reviews (Standard Sequence) - Spacing handled within ProductInfo */}
            <ProductInfo product={product} />

            {/* 2. Price Display */}
            <PriceBlock
                mrp={currentMrp}
                sellingPrice={currentPrice}
                savingsAmount={currentMrp - currentPrice}
                prepaidSavings={prepaidSavings}
                stock={currentStock}
            />

            {/* 3. Variants & Quantity (Optional) */}
            {(product.has_variants || product.show_quantity_selector) && (
                <div className="flex flex-col" style={{ gap: 'var(--component-gap)' }}>
                    {product.has_variants && (
                        <VariantSelector
                            options={product.variant_options || []}
                            variants={product.variants || []}
                            onVariantSelect={setSelectedVariant}
                        />
                    )}
                    {product.show_quantity_selector && (
                        <QuantitySelector
                            qty={qty}
                            onQtyChange={setQty}
                        />
                    )}
                </div>
            )}

            {/* 4. Action Buttons (CTA) - 0.75x gap requirement */}
            <div className="pt-1">
                <CTAGroup
                    sellingPrice={currentPrice}
                    savingsAmount={currentMrp - currentPrice}
                    prepaidSavings={prepaidSavings}
                    onCodClick={handleCod}
                    onPrepaidClick={handlePrepaid}
                    onAddToCart={handleAddToCart}
                    codEnabled={product.cod_enabled}
                    prepaidEnabled={product.prepaid_enabled}
                    cartEnabled={product.cart_button_enabled}
                    prepaidOfferText={product.pricing.prepaid?.offerText}
                />
            </div>
        </div>
    );
}
