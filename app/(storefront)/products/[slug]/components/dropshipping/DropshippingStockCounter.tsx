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
        <div className={cn("p-6 bg-red-50 border border-red-100 rounded-[2rem] shadow-sm overflow-hidden relative", className)}>
            {/* Pulsing Background Pulse */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-200/30 blur-3xl animate-pulse" />

            <div className="relative z-10 space-y-4">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-red-600">
                    <span className="flex items-center gap-2">
                        <Zap className="w-3 h-3 fill-current" />
                        Extreme Scarcity
                    </span>
                    <span className="flex items-center gap-2">
                        <ShieldAlert className="w-3 h-3" />
                        {reserved} People Have This In Cart
                    </span>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-end">
                        <h4 className="text-sm font-black text-neutral-900 uppercase italic">Stock Pulse.</h4>
                        <span className="text-xl font-black text-red-600 tabular-nums">0{stock}</span>
                    </div>

                    <div className="h-3 w-full bg-red-200/50 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: "100%" }}
                            animate={{ width: "15%" }}
                            transition={{ duration: 2, ease: "easeOut" }}
                            className="h-full bg-red-600 rounded-full"
                        />
                    </div>
                </div>

                <p className="text-[10px] font-bold text-red-500 uppercase tracking-tight leading-relaxed">
                    Once sold out, this item will be removed from our catalog indefinitely. Price guaranteed for the next 15 minutes.
                </p>
            </div>
        </div>
    );
}
