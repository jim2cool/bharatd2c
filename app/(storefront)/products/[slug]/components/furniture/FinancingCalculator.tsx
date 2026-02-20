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
        <div className={cn("p-8 bg-neutral-900 text-white rounded-[3rem] shadow-2xl relative overflow-hidden group", className)}>
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] pointer-events-none" />

            <div className="relative z-10 flex flex-col gap-8">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-primary">
                            <Zap className="w-3.5 h-3.5 fill-current" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Flexi-Pay Intelligence</span>
                        </div>
                        <h3 className="text-3xl font-black tracking-tighter italic uppercase leading-none">
                            Dream Big. <br />
                            <span className="text-neutral-500">Pay Small.</span>
                        </h3>
                    </div>
                    <CreditCard className="w-8 h-8 text-neutral-800" />
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex gap-2">
                        {PLANS.map((plan) => (
                            <button
                                key={plan.label}
                                onClick={() => setSelectedPlan(plan)}
                                className={cn(
                                    "flex-1 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                                    selectedPlan.months === plan.months
                                        ? "bg-white text-neutral-900 shadow-xl"
                                        : "bg-white/5 text-neutral-500 border border-white/5 hover:bg-white/10"
                                )}
                            >
                                {plan.months}m
                            </button>
                        ))}
                    </div>

                    <div className="p-6 bg-white/5 border border-white/5 rounded-3xl flex items-center justify-between group-hover:bg-white/10 transition-colors hover:border-white/20">
                        <div>
                            <span className="block text-[9px] font-black uppercase tracking-widest text-neutral-500 mb-1">Monthly Installment</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-black">₹{monthlyEmi.toLocaleString()}</span>
                                <span className="text-[10px] font-medium text-neutral-500">/ month</span>
                            </div>
                        </div>
                        <div className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-[9px] font-black uppercase tracking-widest border border-green-500/20">
                            {selectedPlan.interest} EMI
                        </div>
                    </div>
                </div>

                <button className="w-full py-5 bg-white text-neutral-900 rounded-2xl text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-primary transition-all duration-300">
                    Apply Now for Instant Approval
                    <ChevronRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-center gap-6 opacity-40">
                    <div className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest">
                        <ShieldCheck className="w-3 h-3" /> Secure Processing
                    </div>
                    <div className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest">
                        <Zap className="w-3 h-3" /> No Credit Score Impact
                    </div>
                </div>
            </div>
        </div>
    );
}
