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
        <div className="flex flex-col" style={{ gap: 'calc(var(--component-gap) * 0.75)' }}>

            {/* 1. Primary: Prepaid (Pay Online) - Saffron Accent */}
            {prepaidEnabled && (
                <Magnetic>
                    <ScaleTap className="w-full">
                        <Button
                            size="lg"
                            className="w-full h-14 text-base font-bold uppercase tracking-widest rounded-[var(--radius-button)] shadow-sm hover:shadow-lg transition-all relative overflow-hidden group bg-[var(--primary)] text-[var(--primary-foreground)] border-transparent active:scale-[0.98]"
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
                        className="w-full h-14 text-sm font-bold uppercase tracking-widest rounded-[var(--radius-button)] border-[var(--border)] hover:border-[var(--text-primary)]/30 hover:bg-[var(--bg-secondary)] transition-colors text-[var(--text-primary)]"
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
                        className="w-full h-14 text-sm font-bold uppercase tracking-widest rounded-[var(--radius-button)] bg-[var(--bg-secondary)] hover:bg-[var(--border)] text-[var(--text-primary)] transition-colors border border-[var(--border)]/50"
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
