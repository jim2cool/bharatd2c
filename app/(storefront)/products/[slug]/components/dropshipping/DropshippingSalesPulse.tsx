"use client"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Star, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DropshippingSalesPulseProps {
    className?: string;
}

const RECENT_SALES = [
    { name: 'Amit from Delhi', time: '4 minutes ago', product: 'Premium Essentials' },
    { name: 'Sanjana from Bangalore', time: '12 minutes ago', product: 'Limited Edition' },
    { name: 'Rahul from Mumbai', time: '2 minutes ago', product: 'Direct Core Kit' },
    { name: 'Priya from Chennai', time: '8 minutes ago', product: 'Standard Grade' }
];

export function DropshippingSalesPulse({ className }: DropshippingSalesPulseProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % RECENT_SALES.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const sale = RECENT_SALES[currentIndex];

    return (
        <div className={cn("relative h-20 overflow-hidden", className)}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className="absolute inset-0 p-4 bg-[var(--callout-bg)] border border-[var(--callout-border)] rounded-[var(--radius-card)] shadow-[var(--shadow-card)] flex items-center gap-4"
                >
                    <div className="w-10 h-10 bg-[var(--badge-bg)] rounded-[var(--radius-image)] flex items-center justify-center relative overflow-hidden">
                        <ShoppingBag className="w-5 h-5 text-[var(--badge-text)]" />
                        <div className="absolute inset-0 bg-[var(--primary)]/10 blur-xl animate-pulse" />
                    </div>

                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-widest">{sale.name}</span>
                            <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <Star key={i} className="w-2 h-2" style={{ fill: 'var(--star-colour)', color: 'var(--star-colour)' }} />
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[11px] font-semibold uppercase tracking-tight text-[var(--text-primary)]">Just purchased {sale.product}!</span>
                            <span className="text-[9px] font-medium text-[var(--text-secondary)]">{sale.time}</span>
                        </div>
                    </div>

                    <div className="ml-auto">
                        <CheckCircle2 className="w-4 h-4 text-[var(--primary)]" />
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
