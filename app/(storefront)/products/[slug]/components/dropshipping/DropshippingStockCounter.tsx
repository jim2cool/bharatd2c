"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DropshippingStockCounterProps {
    className?: string;
}

export function DropshippingStockCounter({ className }: DropshippingStockCounterProps) {
    const stock = 7;
    const reserved = 4;

    return (
        <div className={cn("p-6 bg-[var(--urgency-bg)] border border-[var(--callout-border)] rounded-[var(--radius-card)] overflow-hidden relative", className)}>
            {/* Ambient glow */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[var(--urgency-text)]/10 blur-3xl animate-pulse" />

            <div className="relative z-10 space-y-4">
                <div className="flex justify-between items-center text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--urgency-text)]">
                    <span className="flex items-center gap-2">
                        <Zap className="w-3 h-3 fill-current" />
                        Limited Stock
                    </span>
                    <span className="flex items-center gap-2">
                        <ShieldAlert className="w-3 h-3" />
                        {reserved} in carts now
                    </span>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-end">
                        <h4 className="text-sm font-semibold text-[var(--text-primary)] uppercase">Stock Pulse</h4>
                        <span className="text-xl font-bold text-[var(--urgency-text)] tabular-nums">0{stock}</span>
                    </div>

                    <div className="h-3 w-full bg-[var(--callout-border)] rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: "100%" }}
                            animate={{ width: "15%" }}
                            transition={{ duration: 2, ease: "easeOut" }}
                            className="h-full bg-[var(--urgency-text)] rounded-full"
                        />
                    </div>
                </div>

                <p className="text-[10px] font-medium text-[var(--urgency-text)] uppercase tracking-tight leading-relaxed">
                    Once sold out, this item will be removed from our catalog indefinitely. Price guaranteed for the next 15 minutes.
                </p>
            </div>
        </div>
    );
}
