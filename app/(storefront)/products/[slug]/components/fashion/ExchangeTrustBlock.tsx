"use client"

import React from 'react';
import { RefreshCw, Truck, ArrowLeftRight, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExchangeTrustBlockProps {
    className?: string;
}

export function ExchangeTrustBlock({
    className
}: ExchangeTrustBlockProps) {
    return (
        <div className={cn(
            "p-6 border bg-[var(--callout-bg)] border-[var(--callout-border)] rounded-[var(--radius-card)]",
            className
        )}>
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[var(--badge-bg)] text-[var(--badge-text)] flex items-center justify-center border border-[var(--callout-border)]">
                    <ArrowLeftRight className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-[var(--text-primary)]">
                        Hassle-Free Post Purchase
                    </h3>
                    <p className="text-[10px] text-[var(--text-secondary)] font-medium uppercase tracking-tight">
                        Our Fashion Protection Guarantee
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-[var(--bg-primary)]/40 border border-[var(--border)] rounded-[var(--radius-card)]">
                    <RefreshCw className="w-4 h-4 text-[var(--primary)] mt-0.5" />
                    <div>
                        <span className="block text-[10px] font-black uppercase tracking-widest text-[var(--text-primary)] mb-1">7-Day Exchange</span>
                        <span className="block text-[10px] text-[var(--text-secondary)] leading-relaxed font-medium">Wrong size? Exchange it for the perfect fit with one-click.</span>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-[var(--bg-primary)]/40 border border-[var(--border)] rounded-[var(--radius-card)]">
                    <Truck className="w-4 h-4 text-[var(--primary)] mt-0.5" />
                    <div>
                        <span className="block text-[10px] font-black uppercase tracking-widest text-[var(--text-primary)] mb-1">Free Pickup</span>
                        <span className="block text-[10px] text-[var(--text-secondary)] leading-relaxed font-medium">We'll pick up the return from your doorstep at no extra cost.</span>
                    </div>
                </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 border-t border-[var(--callout-border)] pt-4">
                <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)]">
                    100% Quality Inspected by Bharat D2C
                </span>
            </div>
        </div>
    );
}
