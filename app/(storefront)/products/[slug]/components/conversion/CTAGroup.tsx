"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart, CreditCard, Banknote } from "lucide-react"

interface CTAGroupProps {
    sellingPrice: number
    savingsAmount: number
    prepaidSavings: number
    onCodClick: () => void
    onPrepaidClick: () => void
    onAddToCart?: () => void
    codEnabled?: boolean
}

export function CTAGroup({ sellingPrice, savingsAmount, prepaidSavings, onCodClick, onPrepaidClick, onAddToCart, codEnabled = true }: CTAGroupProps) {
    return (
        <div className="flex flex-col gap-3 mt-2">

            {/* 1. Primary: Prepaid (Pay Online) - Saffron Accent */}
            <Button
                size="lg"
                className="w-full h-14 text-base font-bold uppercase tracking-widest rounded-none shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
                onClick={onPrepaidClick}
                data-cta="prepaid"
                style={{
                    backgroundColor: 'var(--saffron-500, #e26a00)',
                    color: '#ffffff',
                    border: 'none'
                }}
            >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-in-out" />
                <CreditCard className="mr-2 h-5 w-5" />
                {prepaidSavings > 0 ? `Pay Online & Save ₹${prepaidSavings}` : "Pay Online & Save Extra"}
            </Button>

            {/* 2. Secondary: Cash On Delivery - Outline (Conditional) */}
            {codEnabled && (
                <Button
                    variant="outline"
                    size="lg"
                    className="w-full h-14 text-sm font-bold uppercase tracking-widest rounded-none border-2 border-foreground/10 hover:border-foreground/30 hover:bg-muted/30 transition-colors"
                    onClick={onCodClick}
                    data-cta="cod"
                >
                    <Banknote className="mr-2 h-4 w-4 opacity-60" />
                    Cash On Delivery
                </Button>
            )}

            {/* 3. Tertiary: Add to Cart - Visible Button (Same Size) */}
            <Button
                variant="secondary"
                size="lg"
                className="w-full h-14 text-sm font-bold uppercase tracking-widest rounded-none bg-muted hover:bg-muted/80 text-foreground transition-colors"
                onClick={onAddToCart}
                data-cta="cart"
            >
                <ShoppingCart className="mr-2 h-4 w-4 opacity-60" />
                Add to Cart
            </Button>
        </div>
    )
}
