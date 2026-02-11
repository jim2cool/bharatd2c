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
    targetId: string // ID of the main Conversion cluster to observe
}

export function MobileStickyCTA({ sellingPrice, onAddToCart, codEnabled = true, targetId }: MobileStickyCTAProps) {
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

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-3 z-50 md:hidden animate-in slide-in-from-bottom duration-300">
            <div className="flex gap-3">
                <div className="flex flex-col justify-center">
                    <span className="text-sm font-medium">₹{sellingPrice.toLocaleString()}</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Total</span>
                </div>
                <Button
                    className="flex-1 h-11 text-xs font-medium uppercase tracking-widest rounded-none"
                    onClick={onAddToCart}
                >
                    <ShoppingCart className="mr-2 h-3.5 w-3.5" />
                    Add to cart
                </Button>
            </div>
        </div>
    )
}
