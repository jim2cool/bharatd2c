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
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-neutral-100 p-4 z-50 md:hidden animate-in slide-in-from-bottom duration-500 shadow-[0_-8px_30px_rgb(0,0,0,0.06)] transform-gpu safe-area-pb">
            <div className="flex gap-4 items-center max-w-lg mx-auto">
                <div className="flex flex-col min-w-[70px]">
                    <span className="text-base font-black tracking-tight text-neutral-900">₹{sellingPrice.toLocaleString()}</span>
                    <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Total Price</span>
                </div>

                <div className="flex-1 flex gap-2">
                    {/* 1. Add to Cart (if enabled) */}
                    {cartEnabled && (
                        <Button
                            className="flex-1 h-12 text-[10px] font-black uppercase tracking-widest rounded-2xl border-2 border-neutral-100 hover:bg-neutral-50 active:scale-95 transition-all duration-200"
                            onClick={onAddToCart}
                            variant="secondary"
                        >
                            <ShoppingCart className="mr-2 h-4 w-4 stroke-[2.5px]" />
                            Cart
                        </Button>
                    )}

                    {/* 2. Buy Now (Prepaid) - taking priority or space */}
                    {prepaidEnabled && (
                        <Button
                            className="flex-1 h-12 text-[11px] font-black uppercase tracking-widest rounded-2xl bg-primary text-primary-foreground shadow-[0_4px_14px_rgba(var(--primary-rgb),0.3)] active:scale-95 transition-all duration-200"
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
