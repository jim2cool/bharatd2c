"use client"

import React, { useState } from 'react';
import { RefreshCw, Check, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SubscriptionOptionProps {
    oneTimePrice: number;
    subscriptionPrice: number;
    interval?: string;
    savingsPercent?: number;
    className?: string;
    onSelect?: (mode: 'one-time' | 'subscription') => void;
}

export function SubscriptionOption({
    oneTimePrice,
    subscriptionPrice,
    interval = "30 days",
    savingsPercent = 15,
    className,
    onSelect
}: SubscriptionOptionProps) {
    const [mode, setMode] = useState<'one-time' | 'subscription'>('subscription');

    const handleSelect = (newMode: 'one-time' | 'subscription') => {
        setMode(newMode);
        onSelect?.(newMode);
    };

    const currencyPrefix = "₹";

    return (
        <div className={cn("space-y-3", className)}>
            {/* One Time Purchase */}
            <div
                onClick={() => handleSelect('one-time')}
                className={cn(
                    "relative cursor-pointer transition-all duration-200 border p-4 flex items-center justify-between group",
                    "bg-[var(--callout-bg)] border-[var(--callout-border)]",
                    mode === 'one-time' ? "border-2 border-[var(--primary)]" : "opacity-80 hover:opacity-100",
                    "rounded-[var(--radius-card)]"
                )}
                style={{
                    borderRadius: mode === 'one-time' ? 'var(--radius-card)' : 'var(--radius-card)',
                    // Shaahi Axiom: rounded-none
                }}
            >
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "w-5 h-5 rounded-full border flex items-center justify-center transition-colors",
                        mode === 'one-time' ? "bg-[var(--primary)] border-[var(--primary)]" : "border-[var(--callout-border)] bg-card"
                    )}>
                        {mode === 'one-time' && <Check className="w-3 h-3 text-primary-foreground" />}
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-0.5">
                            One-time purchase
                        </p>
                        <p className="text-lg font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--body-font)' }}>
                            {currencyPrefix}{oneTimePrice}
                        </p>
                    </div>
                </div>
            </div>

            {/* Subscription */}
            <div
                onClick={() => handleSelect('subscription')}
                className={cn(
                    "relative cursor-pointer transition-all duration-200 border p-5 group",
                    "bg-[var(--callout-bg)] border-[var(--callout-border)] shadow-[var(--shadow-card)]",
                    mode === 'subscription' ? "border-2 border-[var(--primary)] ring-1 ring-[var(--primary)]/10" : "opacity-80 hover:opacity-100",
                    "rounded-[var(--radius-card)]"
                )}
            >
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                        <div className={cn(
                            "w-5 h-5 rounded-full border flex items-center justify-center mt-1 transition-colors",
                            mode === 'subscription' ? "bg-[var(--primary)] border-[var(--primary)]" : "border-[var(--callout-border)] bg-card"
                        )}>
                            {mode === 'subscription' && <Check className="w-3 h-3 text-primary-foreground" />}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <p className="text-xs font-bold uppercase tracking-widest text-[var(--primary)]">
                                    Subscribe & Save {savingsPercent}%
                                </p>
                                <div className="bg-[var(--badge-bg)] text-[var(--badge-text)] text-[9px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded-[var(--radius-badge)]">
                                    Popular
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-[var(--text-primary)] mb-1" style={{ fontFamily: 'var(--heading-font)' }}>
                                {currencyPrefix}{subscriptionPrice}
                                <span className="text-xs font-normal text-[var(--text-secondary)] ml-1">/ {interval}</span>
                            </p>
                            <div className="flex items-center gap-1 text-[10px] text-[var(--text-secondary)] font-medium">
                                <RefreshCw className="w-3 h-3 text-[var(--primary)]" />
                                <span>Cancel anytime • Priority shipping included</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Savings Callout - Axiom 3: no red in Swasth */}
                {mode === 'subscription' && (
                    <div className="mt-4 pt-4 border-t border-[var(--callout-border)] border-dashed flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-[var(--text-secondary)] uppercase">Estimated yearly savings</span>
                        <span className="text-xs font-bold text-[var(--primary)]">
                            {currencyPrefix}{(oneTimePrice - subscriptionPrice) * 12}
                        </span>
                    </div>
                )}
            </div>

            <p className="text-[10px] text-[var(--text-secondary)] text-center px-4 leading-relaxed font-medium">
                Subscriptions are billed and shipped every {interval}. You can pause or cancel your subscription at any time in your account.
            </p>
        </div>
    );
}
