"use client"

import React, { useState, useMemo } from 'react';
import { CreditCard, Calendar, ShieldCheck, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EMICalculatorProps {
    price: number;
    className?: string;
}

const EMI_PLANS = [
    { months: 3, rate: 0, label: "No Cost EMI" },
    { months: 6, rate: 12, label: "Low Interest" },
    { months: 9, rate: 14, label: "Market Standard" },
    { months: 12, rate: 15, label: "Budget Friendly" }
];

export function EMICalculator({ price = 49999, className }: EMICalculatorProps) {
    const [selectedTenure, setSelectedTenure] = useState(EMI_PLANS[0]);

    const emiAmount = useMemo(() => {
        const principal = price;
        const annualRate = selectedTenure.rate;
        const months = selectedTenure.months;

        if (annualRate === 0) return Math.round(principal / months);

        const r = annualRate / 12 / 100;
        const numerator = principal * r * Math.pow(1 + r, months);
        const denominator = Math.pow(1 + r, months) - 1;
        return Math.round(numerator / denominator);
    }, [price, selectedTenure]);

    const totalInterest = useMemo(() => {
        return (emiAmount * selectedTenure.months) - price;
    }, [emiAmount, selectedTenure, price]);

    return (
        <div className={cn("bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[var(--radius-card)] p-8 shadow-[var(--shadow-card)]", className)}>
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-[var(--radius-button)] shadow-[var(--shadow-card)]">
                        <CreditCard className="w-5 h-5 text-[var(--primary)]" />
                    </div>
                    <div>
                        <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-primary)]">EMI Smart Calculator</h3>
                        <p className="text-[10px] text-[var(--text-secondary)] font-medium uppercase tracking-tight">Flexible Payment Breakdown</p>
                    </div>
                </div>
                {selectedTenure.rate === 0 && (
                    <div className="px-3 py-1.5 bg-[var(--urgency-bg)] border border-[var(--callout-border)] rounded-[var(--radius-badge)] flex items-center gap-2 animate-pulse">
                        <Zap className="w-3 h-3 text-[var(--urgency-text)]" />
                        <span className="text-[9px] font-semibold uppercase tracking-widest text-[var(--urgency-text)]">No Cost EMI Active</span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-3">
                        {EMI_PLANS.map((plan) => (
                            <button
                                key={plan.months}
                                onClick={() => setSelectedTenure(plan)}
                                className={cn(
                                    "p-4 rounded-[var(--radius-card)] border transition-all duration-300 text-left relative overflow-hidden group",
                                    selectedTenure.months === plan.months
                                        ? "bg-[var(--bg-primary)] border-[var(--primary)] shadow-[var(--shadow-hover)] ring-1 ring-[var(--primary)]"
                                        : "bg-[var(--bg-primary)] border-[var(--border)] hover:border-[var(--primary)]/40"
                                )}
                            >
                                <span className="block text-[10px] font-semibold uppercase tracking-widest text-[var(--text-secondary)] mb-1">{plan.months} MONTHS</span>
                                <span className="block text-sm font-bold text-[var(--text-primary)]">₹{Math.round(price / plan.months)}/mo*</span>
                                <span className={cn(
                                    "block text-[9px] font-medium uppercase tracking-tight mt-2",
                                    plan.rate === 0 ? "text-[var(--urgency-text)]" : "text-[var(--text-secondary)]"
                                )}>
                                    {plan.label}
                                </span>

                                {selectedTenure.months === plan.months && (
                                    <div className="absolute -right-2 -bottom-2 opacity-5">
                                        <Calendar className="w-12 h-12 text-[var(--primary)]" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>

                    <p className="text-[10px] text-[var(--text-secondary)] font-medium uppercase leading-relaxed tracking-tight">
                        *Calculated EMI is indicative. Actual amounts may vary based on bank policies and applicable taxes at the time of purchase.
                    </p>
                </div>

                {/* Summary card */}
                <div className="bg-[var(--bg-primary)] rounded-[var(--radius-card)] border border-[var(--border)] p-8 flex flex-col items-center text-center space-y-4 shadow-[var(--shadow-card)] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--primary)]/20 via-[var(--primary)] to-[var(--primary)]/20" />

                    <div className="space-y-1">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-secondary)]">Monthly Ownership Cost</span>
                        <div className="text-4xl font-bold tracking-tighter text-[var(--text-primary)]">₹{emiAmount.toLocaleString()}</div>
                    </div>

                    <div className="w-full h-px bg-[var(--border)] my-2" />

                    <div className="w-full flex justify-between px-4">
                        <div className="text-left">
                            <span className="block text-[9px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">Net Principal</span>
                            <span className="text-xs font-semibold text-[var(--text-primary)]">₹{price.toLocaleString()}</span>
                        </div>
                        <div className="text-right">
                            <span className="block text-[9px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">Total Interest</span>
                            <span className={cn(
                                "text-xs font-semibold",
                                totalInterest > 0 ? "text-[var(--text-primary)]" : "text-[var(--badge-text)]"
                            )}>
                                {totalInterest > 0 ? `₹${totalInterest.toLocaleString()}` : "FREE"}
                            </span>
                        </div>
                    </div>

                    <button className="w-full py-4 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-[var(--radius-button)] text-[10px] font-semibold uppercase tracking-[0.2em] hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[var(--shadow-cta)]">
                        Proceed with EMI
                    </button>

                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-[var(--badge-text)]" />
                        <span className="text-[9px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">Secure Bank Connectivity</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
