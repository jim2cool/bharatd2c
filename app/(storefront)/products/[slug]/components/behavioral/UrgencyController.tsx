"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Timer, Flame, AlertCircle } from 'lucide-react';
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

    // Default end time to 4 hours from now if not provided
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
            {/* Stock Scarcity Bar */}
            <div className="p-5 bg-white border border-neutral-100 rounded-[2rem] shadow-sm overflow-hidden relative group transition-all duration-500 hover:shadow-xl hover:shadow-neutral-200/50">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <div className={cn(
                            "w-2 h-2 rounded-full animate-ping",
                            isLowStock ? "bg-rose-500" : "bg-orange-500"
                        )} />
                        <span className={cn(
                            "text-[10px] font-black uppercase tracking-widest",
                            isLowStock ? "text-rose-600" : "text-orange-600"
                        )}>
                            {isLowStock ? "CRITICAL STOCK ALERT" : "LIMITED INVENTORY"}
                        </span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
                        Only <span className="text-neutral-900">{stock} Units</span> Left
                    </span>
                </div>

                <div className="relative h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${stockPercentage}%` }}
                        transition={{ duration: 1.5, ease: "circOut" }}
                        className={cn(
                            "absolute top-0 left-0 h-full rounded-full",
                            isLowStock
                                ? "bg-gradient-to-r from-rose-400 to-rose-600"
                                : "bg-gradient-to-r from-orange-400 to-primary"
                        )}
                    />
                </div>

                <p className="mt-3 text-[9px] text-neutral-400 font-bold uppercase tracking-tighter leading-none">
                    *85% of reserved stock for this cycle has been fulfilled.
                </p>

                {/* Decorative background element */}
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:rotate-12 transition-transform duration-700">
                    <Flame className="w-16 h-16 text-neutral-900" />
                </div>
            </div>

            {/* Flash Countdown */}
            {timeLeft && (
                <div className="p-5 bg-neutral-900 rounded-[2rem] flex items-center justify-between text-white shadow-2xl relative overflow-hidden group">
                    {/* Animated Pulsing Background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 animate-pulse" />

                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center">
                            <Timer className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <span className="block text-[9px] font-black uppercase tracking-widest opacity-40">Offer Ends In</span>
                            <div className="flex items-center gap-1.5">
                                {[
                                    { val: timeLeft.hours, label: 'h' },
                                    { val: timeLeft.mins, label: 'm' },
                                    { val: timeLeft.secs, label: 's' }
                                ].map((t, idx) => (
                                    <React.Fragment key={idx}>
                                        <span className="text-lg font-black tracking-tighter tabular-nums">{t.val.toString().padStart(2, '0')}{t.label}</span>
                                        {idx < 2 && <span className="opacity-20 text-xs">:</span>}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-end relative z-10">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Flash Deal</span>
                        <div className="px-3 py-1 bg-white/10 rounded-full border border-white/10 flex items-center gap-1.5">
                            <Zap className="w-3 h-3 text-primary fill-primary" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Active</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
