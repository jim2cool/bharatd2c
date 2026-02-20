import { ShieldCheck, RefreshCw, Truck, Lock, BadgeCheck, Zap, Heart, Star, Award, CreditCard, RotateCcw, Package } from "lucide-react"
import React from "react"

export const TRUST_ICONS = {
    BadgeCheck,
    ShieldCheck,
    Zap,
    Truck,
    RefreshCw,
    Heart,
    Star,
    Award,
    Lock,
    CreditCard,
    RotateCcw,
    Package
}

interface TrustStripProps {
    indicators?: { icon: string; text: string }[] | null
}

export function TrustStrip({ indicators }: TrustStripProps) {
    // 1. If explicit empty array is provided, it means "Hide" (user cleared it in Admin)
    if (indicators && indicators.length === 0) return null

    // 2. Default indicators if none provided (indicators is null or undefined)
    const displayIndicators = (indicators && indicators.length > 0 ? indicators : [
        { icon: 'Truck', text: 'Free Shipping' },
        { icon: 'RefreshCw', text: '7-Day Returns' },
        { icon: 'ShieldCheck', text: '100% Genuine' }
    ]).slice(0, 4)

    return (
        <div className="space-y-4">
            {/* Main Trust Row */}
            <div className="flex items-center justify-between gap-2 p-6 bg-card border-[var(--border-width)] border-border rounded-[var(--radius-card)] shadow-[var(--shadow-elevation)] opacity-[var(--social-proof-opacity)]">
                {displayIndicators.map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-3 text-center group flex-1">
                        <div className="w-12 h-12 rounded-[var(--radius-md)] bg-white border border-border flex items-center justify-center text-primary shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:border-primary/20 group-hover:shadow-md">
                            {React.createElement((TRUST_ICONS as any)[item.icon] || BadgeCheck, { className: "w-5 h-5 stroke-[2.5px]" })}
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-foreground leading-tight px-1">
                            {item.text}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

