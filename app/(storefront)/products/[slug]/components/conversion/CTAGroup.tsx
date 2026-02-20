"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart, CreditCard, Banknote } from "lucide-react"
import { ScaleTap, Magnetic } from "@/components/ui/motion-primitives"
import { motion } from "framer-motion"

interface CTAGroupProps {
    sellingPrice: number
    savingsAmount: number
    prepaidSavings: number
    onCodClick: () => void
    onPrepaidClick: () => void
    onAddToCart?: () => void
    codEnabled?: boolean
    prepaidEnabled?: boolean
    cartEnabled?: boolean
    prepaidOfferText?: string
}

export function CTAGroup({
    sellingPrice,
    savingsAmount,
    prepaidSavings,
    onCodClick,
    onPrepaidClick,
    onAddToCart,
    codEnabled = true,
    prepaidEnabled = true,
    cartEnabled = true,
    prepaidOfferText
}: CTAGroupProps) {
    return (
        <div className="flex flex-col gap-3 mt-2">

            {/* 1. Primary: Prepaid (Pay Online) - Saffron Accent */}
            {prepaidEnabled && (
                <Magnetic>
                    <ScaleTap className="w-full">
                        <Button
                            size="lg"
                            className="w-full h-14 text-base font-bold uppercase tracking-widest rounded-[var(--radius-button)] shadow-[var(--shadow-elevation)] hover:shadow-lg transition-all relative overflow-hidden group bg-primary text-primary-foreground border-transparent active:scale-[0.98]"
                            onClick={onPrepaidClick}
                            data-cta="prepaid"
                        >
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]"
                                initial={{ x: "-150%" }}
                                animate={{ x: "150%" }}
                                transition={{
                                    repeat: Infinity,
                                    repeatDelay: 3,
                                    duration: 1.5,
                                    ease: "easeInOut"
                                }}
                            />
                            <CreditCard className="mr-2 h-5 w-5" />
                            {prepaidOfferText || `Buy Now - Pay Online${prepaidSavings > 0 ? ` & Save ₹${prepaidSavings}` : ''}`}
                        </Button>
                    </ScaleTap>
                </Magnetic>
            )}

            {/* 2. Secondary: Cash On Delivery - Outline (Conditional) */}
            {codEnabled && (
                <ScaleTap className="w-full">
                    <Button
                        variant="outline"
                        size="lg"
                        className="w-full h-14 text-sm font-bold uppercase tracking-widest rounded-[var(--radius-button)] border-[var(--border-width)] border-border hover:border-foreground/30 hover:bg-surface-hover transition-colors text-foreground"
                        onClick={onCodClick}
                        data-cta="cod"
                    >
                        <Banknote className="mr-2 h-4 w-4 opacity-60" />
                        Order Now - Cash on Delivery
                    </Button>
                </ScaleTap>
            )}

            {/* 3. Tertiary: Add to Cart - Visible Button (Same Size) */}
            {cartEnabled && (
                <ScaleTap className="w-full">
                    <Button
                        variant="secondary"
                        size="lg"
                        className="w-full h-14 text-sm font-bold uppercase tracking-widest rounded-[var(--radius-button)] bg-card hover:bg-muted text-foreground transition-colors border border-border/50"
                        onClick={onAddToCart}
                        data-cta="cart"
                    >
                        <ShoppingCart className="mr-2 h-4 w-4 opacity-60" />
                        Add to Cart
                    </Button>
                </ScaleTap>
            )}
        </div>
    )
}
