"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"

interface MobileStickyCTAProps {
    sellingPrice: number
    savingsAmount: number
    onCodClick: () => void
    onPrepaidClick: () => void
    onAddToCart?: () => void
    codEnabled?: boolean
    prepaidEnabled?: boolean
    cartEnabled?: boolean
    targetId: string // ID of the main Conversion cluster to observe
}

export function MobileStickyCTA({ sellingPrice, onAddToCart, onPrepaidClick, codEnabled = true, prepaidEnabled = true, cartEnabled = true, targetId }: MobileStickyCTAProps) {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                const rect = entry.boundingClientRect
                // Show if we've scrolled PAST the conversion section (top < 0)
                setIsVisible(!entry.isIntersecting && rect.top < 0)
            },
            { threshold: 0 }
        )

        const element = document.getElementById(targetId)
        if (element) {
            observer.observe(element)
        }

        return () => observer.disconnect()
    }, [targetId])

    if (!isVisible) return null

    // If NO primary action is enabled, don't show sticky bar
    if (!cartEnabled && !prepaidEnabled && !codEnabled) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-black/5 p-4 z-50 md:hidden animate-in slide-in-from-bottom duration-500 shadow-[0_-8px_30px_rgb(0,0,0,0.04)] transform-gpu safe-area-pb">
            <div className="flex gap-4 items-center max-w-lg mx-auto">
                <div className="flex flex-col min-w-[80px]">
                    <span className="text-xl font-display font-black tracking-tight text-foreground">₹{sellingPrice.toLocaleString()}</span>
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Total</span>
                </div>

                <div className="flex-1 flex gap-2">
                    {/* 1. Add to Cart (Ghost) */}
                    {cartEnabled && (
                        <Button
                            className="h-14 w-14 rounded-2xl border border-black/5 bg-white hover:bg-neutral-50 active:scale-95 transition-all duration-200 shadow-sm"
                            onClick={onAddToCart}
                            variant="ghost"
                            size="icon"
                        >
                            <ShoppingCart className="h-6 w-6 text-foreground opacity-80" />
                        </Button>
                    )}

                    {/* 2. Buy Now (Prepaid) - DOMINANT */}
                    {prepaidEnabled && (
                        <Button
                            className="flex-1 h-14 text-sm font-display font-black uppercase tracking-widest rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-[0_8px_20px_rgba(37,99,235,0.25)] active:scale-95 transition-all duration-300 shimmer-effect"
                            onClick={onPrepaidClick}
                            variant="default"
                        >
                            Buy Now
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
