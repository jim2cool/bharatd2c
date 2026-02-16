"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ProductData } from "../../types/pdp"
import { PriceBlock } from "./PriceBlock"
import { BundleSelector } from "./BundleSelector"
import { CTAGroup } from "./CTAGroup"
import { TrustStrip } from "./TrustStrip"
import { MobileStickyCTA } from "./MobileStickyCTA"
import { UrgencyBar } from "./UrgencyBar"
import { QuantitySelector } from "./QuantitySelector"
import { DeliveryEstimator } from "./DeliveryEstimator"
import { QuantityBreaks } from "./QuantityBreaks"
import { addToCart, setDirectCheckoutItem } from "@/lib/cart"

interface ConversionProps {
    product: ProductData
}

export function Conversion({ product }: ConversionProps) {
    const router = useRouter()
    const [selectedBundleId, setSelectedBundleId] = useState<string>(product.bundles[0]?.id || "")

    const [qty, setQty] = useState(1)

    // Derived from props
    const bundlesEnabled = product.bundle_settings?.enabled ?? true

    const selectedBundle = product.bundles.find(b => b.id === selectedBundleId) || product.bundles[0]

    // If bundles enabled, qty is from bundle. If disabled, qty is local state.
    const baseQty = bundlesEnabled ? selectedBundle.unitCount : qty
    const basePrice = bundlesEnabled ? selectedBundle.sellingPrice : product.pricing.sellingPrice

    // Quantity Break Logic
    let qtyDiscount = 0
    if (!bundlesEnabled) {
        if (qty === 2) qtyDiscount = 10
        else if (qty >= 3) qtyDiscount = 15
    }

    const currentQty = baseQty
    const currentPrice = Math.round(basePrice * (1 - qtyDiscount / 100))
    const currentMrp = bundlesEnabled ? selectedBundle.mrp : product.pricing.mrp

    // Calculate dynamic prepaid savings
    const prepaidSavings = product.pricing.prepaid?.calculatedSavings || 0

    // Update local handlers
    const handleCod = () => {
        // Buy Now - Direct checkout (bypass cart)
        setDirectCheckoutItem({
            product_id: product.id,
            title: product.title,
            image: product.media[0]?.src || "",
            price: currentPrice,
            qty: currentQty
        })
        router.push("/checkout")
    }

    const handlePrepaid = () => {
        // Buy Now - Direct checkout (bypass cart)
        // Ensure discount is passed to checkout
        setDirectCheckoutItem({
            product_id: product.id,
            title: product.title,
            image: product.media[0]?.src || "",
            price: currentPrice,
            qty: currentQty,
            prepaid_discount: prepaidSavings
        })
        router.push("/checkout")
    }

    const handleAddToCart = () => {
        addToCart({
            product_id: product.id,
            title: product.title,
            image: product.media[0]?.src || "",
            price: currentPrice,
            qty: currentQty,
            prepaid_discount: prepaidSavings
        })
        router.push("/cart")
    }

    return (
        <section
            data-cluster="conversion"
            id="conversion-section"
            className="flex flex-col gap-4 px-4 md:px-0 py-2"
        >
            {/* Urgency Bar MOVED to ProductInfo as requested */}

            {/* Price */}
            <PriceBlock
                mrp={currentMrp}
                sellingPrice={currentPrice}
                savingsAmount={currentMrp - currentPrice}
                prepaidSavings={prepaidSavings}
            />

            {/* Urgency Bar (Dynamic) */}
            <UrgencyBar settings={product.urgency_settings} />

            {/* Bundle Selector OR Quantity Selector */}
            {bundlesEnabled ? (
                <BundleSelector
                    bundles={product.bundles}
                    selectedBundleId={selectedBundleId}
                    onSelect={setSelectedBundleId}
                />
            ) : (
                <>
                    <QuantityBreaks
                        currentQty={qty}
                        price={product.pricing.sellingPrice}
                        onQtySelect={setQty}
                    />
                    <QuantitySelector
                        qty={qty}
                        onQtyChange={setQty}
                    />
                </>
            )}

            {/* CTAs */}
            <CTAGroup
                sellingPrice={currentPrice}
                savingsAmount={currentMrp - currentPrice}
                prepaidSavings={prepaidSavings}
                onCodClick={handleCod}
                onPrepaidClick={handlePrepaid}
                onAddToCart={handleAddToCart}
                codEnabled={product.cod_enabled}
            />

            {/* Trust Strip */}
            <TrustStrip />

            {/* Delivery Estimator */}
            <DeliveryEstimator />

            {/* Mobile Sticky CTA */}
            <MobileStickyCTA
                sellingPrice={currentPrice}
                savingsAmount={currentMrp - currentPrice}
                onCodClick={handleCod}
                onPrepaidClick={handlePrepaid}
                onAddToCart={handleAddToCart}
                codEnabled={product.cod_enabled}
                targetId="conversion-section"
            />
        </section>
    )
}
