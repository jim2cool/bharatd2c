"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ProductData } from "../../types/pdp"
import { PriceBlock } from "./PriceBlock"
import { toast } from "sonner"
import { BundleSelector } from "./BundleSelector"
import { CTAGroup } from "./CTAGroup"
import { TrustStrip } from "./TrustStrip"
import { MobileStickyCTA } from "./MobileStickyCTA"
import { UrgencyBar } from "./UrgencyBar"
import { QuantitySelector } from "./QuantitySelector"
import { EstimatedDelivery } from "./EstimatedDelivery"
import { QuantityBreaks } from "./QuantityBreaks"
import { VariantSelector } from "./VariantSelector"
import { addToCart, setDirectCheckoutItem } from "@/lib/cart"

interface ConversionProps {
    product: ProductData
}

export function Conversion({ product }: ConversionProps) {
    const router = useRouter()

    // State management
    const [selectedBundleId, setSelectedBundleId] = useState<string>(product.bundles[0]?.id || "")
    const [selectedVariant, setSelectedVariant] = useState<ProductData['variants'] extends (infer T)[] ? T : any>(null)
    const [qty, setQty] = useState(1)

    // Derived from props
    const hasVariants = product.has_variants && product.variants && product.variants.length > 0
    const hasTiers = product.bundle_settings?.enabled && product.bundle_settings?.tiers && product.bundle_settings.tiers.length > 0
    // Bundles are a specialized case of variants-like behavior, only show if more than one option exists and no tiers
    const hasBundles = !hasVariants && !hasTiers && product.bundles && product.bundles.length > 1

    // 1. Determine local Base Price (either variant price or base product price)
    let basePrice = product.pricing.sellingPrice
    let baseMrp = product.pricing.mrp

    if (hasVariants && selectedVariant) {
        basePrice = selectedVariant.price
        baseMrp = selectedVariant.mrp || selectedVariant.price
    }

    // 2. Pricing Logic (Apply Tiers/Bundles on top of Base Price)
    let currentPrice = basePrice
    let currentMrp = baseMrp
    let currentQty = qty

    if (hasTiers) {
        // Quantity Break Logic (Dynamic lookup from tiers)
        const tier = product.bundle_settings?.tiers?.find(t => t.qty === qty)
        const qtyDiscount = tier ? tier.discount : 0
        currentPrice = Math.round(basePrice * (1 - qtyDiscount / 100))
        currentMrp = baseMrp
        currentQty = qty
    } else if (hasBundles) {
        const selectedBundle = product.bundles.find(b => b.id === selectedBundleId) || product.bundles[0]
        currentPrice = selectedBundle.sellingPrice
        currentMrp = selectedBundle.mrp || selectedBundle.sellingPrice
        currentQty = selectedBundle.unitCount
    } else {
        // Regular product pricing (no bulk discount)
        currentPrice = basePrice
        currentMrp = baseMrp
        currentQty = qty
    }

    // Calculate dynamic prepaid savings
    const prepaidSavings = product.pricing.prepaid?.calculatedSavings || 0

    // Calculate Stock for Scarcity
    // If variants exist, use selected variant stock.
    // If no variants (and we assume single product has no inventory in this schema yet?), undefined.
    const currentStock = (hasVariants && selectedVariant) ? selectedVariant.inventory : undefined

    // Update local handlers
    const handleCod = () => {
        if (hasVariants && !selectedVariant) {
            toast.error("Please select an option first")
            return
        }
        setDirectCheckoutItem({
            product_id: product.id,
            variant_id: selectedVariant?.id,
            title: `${product.title}${selectedVariant ? ` - ${selectedVariant.title}` : ""}`,
            image: product.media[0]?.src || "",
            price: basePrice, // Pass BASE price, checkout will handle bundle savings
            qty: currentQty
        })
        router.push("/checkout")
    }

    const handlePrepaid = () => {
        if (hasVariants && !selectedVariant) {
            toast.error("Please select an option first")
            return
        }
        setDirectCheckoutItem({
            product_id: product.id,
            variant_id: selectedVariant?.id,
            title: `${product.title}${selectedVariant ? ` - ${selectedVariant.title}` : ""}`,
            image: product.media[0]?.src || "",
            price: basePrice, // Pass BASE price
            qty: currentQty,
            prepaid_discount: prepaidSavings
        })
        router.push("/checkout")
    }

    const handleAddToCart = () => {
        if (hasVariants && !selectedVariant) {
            toast.error("Please select an option first")
            return
        }
        addToCart({
            product_id: product.id,
            variant_id: selectedVariant?.id,
            title: `${product.title}${selectedVariant ? ` - ${selectedVariant.title}` : ""}`,
            image: product.media[0]?.src || "",
            price: basePrice, // Pass BASE price
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
            {/* Price */}
            <PriceBlock
                mrp={currentMrp}
                sellingPrice={currentPrice}
                savingsAmount={currentMrp - currentPrice}
                prepaidSavings={prepaidSavings}
                stock={currentStock}
            />

            {/* Urgency Bar (Dynamic) */}
            <UrgencyBar settings={product.urgency_settings} />

            {/* Selector Logic */}
            <div className="space-y-4">
                {/* Step 1: Variant Selection (Mutually exclusive with nothing, always shows if variants exist) */}
                {hasVariants && (
                    <VariantSelector
                        options={product.variant_options || []}
                        variants={product.variants || []}
                        onVariantSelect={setSelectedVariant}
                    />
                )}

                {/* Step 2: Quantity Selection (Quantity Breaks OR Standard Selector) */}
                {hasTiers ? (
                    <QuantityBreaks
                        currentQty={qty}
                        price={basePrice}
                        onQtySelect={setQty}
                        tiers={product.bundle_settings!.tiers!}
                        mostPopularIndex={product.bundle_settings!.most_popular_index}
                    />
                ) : hasBundles ? (
                    <BundleSelector
                        bundles={product.bundles}
                        selectedBundleId={selectedBundleId}
                        onSelect={setSelectedBundleId}
                    />
                ) : (
                    /* Only show regular selector if no special logic like Tiers/Bundles */
                    <QuantitySelector
                        qty={qty}
                        onQtyChange={setQty}
                    />
                )}
            </div>

            {/* Delivery Estimator */}
            {product.show_estimated_delivery && (
                <EstimatedDelivery settings={product.shipping_settings} />
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
                prepaidEnabled={product.prepaid_enabled}
                cartEnabled={product.cart_button_enabled}
                prepaidOfferText={product.pricing.prepaid?.offerText}
            />

            {/* Secondary Trust Strip (Image) */}
            {product.trust_strip_image_url && (
                <div className="flex justify-center py-2 animate-in fade-in slide-in-from-bottom-2 duration-700">
                    <img
                        src={product.trust_strip_image_url}
                        alt="Security Guarantee"
                        className="max-w-[280px] w-full h-auto object-contain transition-all duration-300 hover:opacity-90 hover:scale-[1.02]"
                    />
                </div>
            )}

            {/* Trust Strip */}
            <TrustStrip indicators={product.trust_indicators} />



            {/* Mobile Sticky CTA */}
            <MobileStickyCTA
                sellingPrice={currentPrice}
                savingsAmount={currentMrp - currentPrice}
                onCodClick={handleCod}
                onPrepaidClick={handlePrepaid}
                onAddToCart={handleAddToCart}
                codEnabled={product.cod_enabled}
                prepaidEnabled={product.prepaid_enabled}
                cartEnabled={product.cart_button_enabled}
                targetId="conversion-section"
            />
        </section>
    )
}
