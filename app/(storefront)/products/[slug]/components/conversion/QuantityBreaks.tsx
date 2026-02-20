"use client"

import { Tag } from 'lucide-react'
import { ScaleTap } from "@/components/ui/motion-primitives"
import { cn } from "@/lib/utils"

interface QuantityBreaksProps {
    currentQty: number
    price: number
    onQtySelect: (qty: number) => void
    tiers: { qty: number; label: string; discount: number }[]
    mostPopularIndex?: number
}

export function QuantityBreaks({ currentQty, price, onQtySelect, tiers, mostPopularIndex }: QuantityBreaksProps) {

    return (
        <div className="space-y-3 mt-4">
            <div className="flex items-center gap-2 px-1">
                <Tag className="w-3 h-3 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Limited Offer: Quantity Breaks</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
                {tiers.map((tier, idx) => {
                    const isSelected = tier.qty === 3 ? currentQty >= 3 : currentQty === tier.qty
                    const discountedPrice = Math.round(price * (1 - tier.discount / 100))
                    const isMostPopular = mostPopularIndex === idx

                    return (
                        <ScaleTap key={idx} className="h-full">
                            <button
                                onClick={() => onQtySelect(tier.qty)}
                                className={cn(
                                    "relative w-full flex flex-col items-center justify-center p-3 rounded-[var(--radius-md)] border-[var(--border-width)] transition-all h-full",
                                    isSelected
                                        ? 'border-primary bg-primary/5 ring-1 ring-primary text-foreground'
                                        : 'border-border bg-card text-muted-foreground hover:border-foreground/30 hover:bg-surface-hover'
                                )}
                            >
                                {(isMostPopular || tier.discount > 0) && (
                                    <span className={cn(
                                        "absolute -top-2 px-2 py-0.5 rounded-[var(--radius-sm)] text-[9px] font-black uppercase tracking-tighter shadow-sm",
                                        isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground border border-border'
                                    )}>
                                        {isMostPopular ? 'Most Popular' : `Save ${tier.discount}%`}
                                    </span>
                                )}
                                <span className="text-[10px] font-bold uppercase mb-0.5 mt-1">{tier.label}</span>
                                <div className="flex items-baseline gap-0.5">
                                    <span className={cn("text-lg font-black tracking-tight", isSelected ? "text-primary" : "text-foreground")}>
                                        ₹{discountedPrice}
                                    </span>
                                    <span className="text-[9px] opacity-60">/unit</span>
                                </div>
                            </button>
                        </ScaleTap>
                    )
                })}
            </div>
        </div>
    )
}
