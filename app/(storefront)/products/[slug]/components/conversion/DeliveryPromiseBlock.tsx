"use client"

import React, { useState, useEffect } from 'react';
import { Timer, Zap, PackageOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeliveryPromiseBlockProps {
    className?: string;
    cutoffHour?: number; // 24hr format
}

export function DeliveryPromiseBlock({
    className,
    cutoffHour = 18 // 6 PM default
}: DeliveryPromiseBlockProps) {
    const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const target = new Date();
            target.setHours(cutoffHour, 0, 0, 0);

            if (now > target) {
                target.setDate(target.getDate() + 1);
            }

            const diff = target.getTime() - now.getTime();

            return {
                hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((diff / 1000 / 60) % 60),
                seconds: Math.floor((diff / 1000) % 60)
            };
        };

        setTimeLeft(calculateTimeLeft());
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [cutoffHour]);

    if (!timeLeft) return null;

    const isUrgent = timeLeft.hours < 2;

    return (
        <div className={cn(
            "p-4 border transition-all duration-300",
            "bg-[var(--urgency-bg)] border-[var(--callout-border)] rounded-[var(--radius-card)]",
            isUrgent ? "ring-2 ring-[var(--primary)]/20" : "",
            className
        )}>
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center",
                        "bg-[var(--primary)] text-primary-foreground shadow-sm"
                    )}>
                        <Zap className="w-4 h-4 fill-current" />
                    </div>
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--urgency-text)]">
                            Speed Express
                        </h4>
                        <p className="text-xs font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--body-font)' }}>
                            Same Day Dispatch
                        </p>
                    </div>
                </div>

                <div className="text-right flex flex-col items-end">
                    <div className="flex items-center gap-1.5 text-[var(--primary)] mb-0.5">
                        <Timer className="w-3.5 h-3.5" />
                        <span className="text-sm font-black font-mono tracking-tighter" style={{ fontFamily: 'var(--body-font)' }}>
                            {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m
                        </span>
                    </div>
                    <span className="text-[8px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">
                        Order before cutoff
                    </span>
                </div>
            </div>

            <div className="mt-3 pt-3 border-t border-[var(--callout-border)] border-dashed flex items-center gap-2">
                <PackageOpen className="w-3.5 h-3.5 text-[var(--primary)]" />
                <span className="text-[9px] font-medium text-[var(--text-secondary)] uppercase tracking-[0.1em]">
                    Ships from nearest fulfilment center for fastest delivery.
                </span>
            </div>
        </div>
    );
}
