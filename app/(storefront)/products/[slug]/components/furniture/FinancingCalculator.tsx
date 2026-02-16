"use client"

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Zap, ShieldCheck, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FinancingCalculatorProps {
    price?: number;
    className?: string;
}

const PLANS = [
    { months: 3, label: '3 Months', interest: '0%' },
    { months: 6, label: '6 Months', interest: '0%' },
    { months: 12, label: '12 Months', interest: 'No-Cost' }
];

export function FinancingCalculator({ price = 24999, className }: FinancingCalculatorProps) {
    const [selectedPlan, setSelectedPlan] = useState(PLANS[1]);
    const monthlyEmi = Math.round(price / selectedPlan.months);

    return (
        <div className={cn("p-8 bg-[var(--callout-bg)] border border-[var(--callout-border)] rounded-[var(--radius-card)] shadow-[var(--shadow-card)] relative overflow-hidden group", className)}>
            {/* Ambient glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)]/10 blur-[100px] pointer-events-none" />

            <div className="relative z-10 flex flex-col gap-8">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[var(--primary)]">
                            <Zap className="w-3.5 h-3.5 fill-current" />
                            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">Flexi-Pay Intelligence</span>
                        </div>
                        <h3 className="text-3xl font-bold tracking-tighter italic uppercase leading-none text-[var(--text-primary)]">
                            Dream Big. <br />
                            <span className="text-[var(--text-secondary)]">Pay Small.</span>
                        </h3>
                    </div>
                    <CreditCard className="w-8 h-8 text-[var(--text-secondary)] opacity-30" />
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex gap-2">
                        {PLANS.map((plan) => (
                            <button
                                key={plan.label}
                                onClick={() => setSelectedPlan(plan)}
                                className={cn(
                                    "flex-1 px-4 py-3 rounded-[var(--radius-button)] text-[10px] font-semibold uppercase tracking-widest transition-all duration-300",
                                    selectedPlan.months === plan.months
                                        ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-[var(--shadow-cta)]"
                                        : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--primary)]/40"
                                )}
                            >
                                {plan.months}m
                            </button>
                        ))}
                    </div>

                    <div className="p-6 bg-[var(--bg-primary)] border border-[var(--border)] rounded-[var(--radius-card)] flex items-center justify-between hover:border-[var(--primary)]/30 transition-colors">
                        <div>
                            <span className="block text-[9px] font-semibold uppercase tracking-widest text-[var(--text-secondary)] mb-1">Monthly Installment</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold text-[var(--text-primary)]">₹{monthlyEmi.toLocaleString()}</span>
                                <span className="text-[10px] font-medium text-[var(--text-secondary)]">/ month</span>
                            </div>
                        </div>
                        <div className="px-3 py-1 bg-[var(--badge-bg)] text-[var(--badge-text)] rounded-[var(--radius-badge)] text-[9px] font-semibold uppercase tracking-widest border border-[var(--callout-border)]">
                            {selectedPlan.interest} EMI
                        </div>
                    </div>
                </div>

                <button className="w-full py-5 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-[var(--radius-button)] flex items-center justify-center gap-2 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[var(--shadow-cta)]">
                    <FileTextIcon />
                    <span className="text-[11px] font-semibold uppercase tracking-widest">Apply Now for Instant Approval</span>
                    <ChevronRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-center gap-6 opacity-40 text-[var(--text-secondary)]">
                    <div className="flex items-center gap-1.5 text-[8px] font-semibold uppercase tracking-widest">
                        <ShieldCheck className="w-3 h-3" /> Secure Processing
                    </div>
                    <div className="flex items-center gap-1.5 text-[8px] font-semibold uppercase tracking-widest">
                        <Zap className="w-3 h-3" /> No Credit Score Impact
                    </div>
                </div>
            </div>
        </div>
    );
}

// Inline icon to avoid unused import
function FileTextIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
        </svg>
    );
}
