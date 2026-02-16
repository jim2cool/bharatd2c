"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Timer, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UrgencyControllerProps {
    stock?: number;
    totalStock?: number;
    endTime?: Date;
    urgencyLevel?: 'low' | 'medium' | 'high';
    className?: string;
}

export function UrgencyController({
    stock = 12,
    totalStock = 100,
    endTime,
    urgencyLevel = 'high',
    className
}: UrgencyControllerProps) {
    const [timeLeft, setTimeLeft] = useState<{ hours: number, mins: number, secs: number } | null>(null);

    const targetDate = useMemo(() => endTime || new Date(Date.now() + 4 * 60 * 60 * 1000), [endTime]);

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate.getTime() - now;

            if (distance < 0) {
                clearInterval(timer);
                setTimeLeft(null);
                return;
            }

            setTimeLeft({
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                mins: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                secs: Math.floor((distance % (1000 * 60)) / 1000),
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    const stockPercentage = Math.max(5, (stock / totalStock) * 100);
    const isLowStock = stock <= 15;

    return (
        <div className={cn("space-y-4", className)}>
            {/* Stock Scarcity Bar — uses urgency token family */}
            <div className="p-5 bg-[var(--callout-bg)] border border-[var(--callout-border)] rounded-[var(--radius-card)] overflow-hidden relative group transition-all duration-500 hover:shadow-[var(--shadow-hover)]">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full animate-ping bg-[var(--urgency-text)]" />
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--urgency-text)]">
                            {isLowStock ? "LOW STOCK" : "LIMITED INVENTORY"}
                        </span>
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-secondary)]">
                        Only <span className="text-[var(--text-primary)]">{stock} Units</span> Left
                    </span>
                </div>

                <div className="relative h-2 w-full bg-[var(--border)] rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${stockPercentage}%` }}
                        transition={{ duration: 1.5, ease: "circOut" }}
                        className="absolute top-0 left-0 h-full rounded-full bg-[var(--urgency-text)]"
                    />
                </div>

                <p className="mt-3 text-[9px] text-[var(--text-secondary)] font-medium uppercase tracking-tighter leading-none">
                    *85% of reserved stock for this cycle has been fulfilled.
                </p>

                <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:rotate-12 transition-transform duration-700">
                    <Flame className="w-16 h-16 text-[var(--urgency-text)]" />
                </div>
            </div>

            {/* Countdown Timer — uses urgency tokens */}
            {timeLeft && (
                <div className="p-5 bg-[var(--urgency-bg)] border border-[var(--callout-border)] rounded-[var(--radius-card)] flex items-center justify-between relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)]/5 via-transparent to-[var(--primary)]/5 animate-pulse" />

                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-10 h-10 rounded-[var(--radius-card)] bg-[var(--callout-bg)] border border-[var(--callout-border)] flex items-center justify-center">
                            <Timer className="w-5 h-5 text-[var(--urgency-text)]" />
                        </div>
                        <div>
                            <span className="block text-[9px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">Offer Ends In</span>
                            <div className="flex items-center gap-1.5">
                                {[
                                    { val: timeLeft.hours, label: 'h' },
                                    { val: timeLeft.mins, label: 'm' },
                                    { val: timeLeft.secs, label: 's' }
                                ].map((t, idx) => (
                                    <React.Fragment key={idx}>
                                        <span className="text-lg font-bold tracking-tighter tabular-nums text-[var(--urgency-text)]">{t.val.toString().padStart(2, '0')}{t.label}</span>
                                        {idx < 2 && <span className="opacity-20 text-xs text-[var(--urgency-text)]">:</span>}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-end relative z-10">
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--urgency-text)] mb-1">Flash Deal</span>
                        <div className="px-3 py-1 bg-[var(--callout-bg)] rounded-[var(--radius-badge)] border border-[var(--callout-border)] flex items-center gap-1.5">
                            <span className="text-[9px] font-semibold uppercase tracking-widest text-[var(--urgency-text)]">Active</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
