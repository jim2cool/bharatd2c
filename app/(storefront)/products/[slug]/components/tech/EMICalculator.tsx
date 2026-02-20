"use client"

import React, { useState, useMemo } from 'react';
import { CreditCard, Percent, Calendar, ShieldCheck, Zap } from 'lucide-react';
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
        <div className={cn("bg-neutral-50 border border-neutral-100 rounded-[2.5rem] p-8 shadow-sm", className)}>
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-white border border-neutral-100 rounded-2xl shadow-sm">
                        <CreditCard className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-xs font-black uppercase tracking-[0.2em]">EMI Smart Calculator</h3>
                        <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-tight">Flexible Payment Breakdown</p>
                    </div>
                </div>
                {selectedTenure.rate === 0 && (
                    <div className="px-3 py-1.5 bg-orange-100 border border-orange-200 rounded-full flex items-center gap-2 animate-pulse">
                        <Zap className="w-3 h-3 text-orange-600 fill-orange-600" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-orange-600">No Cost EMI Active</span>
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
                                    "p-4 rounded-3xl border transition-all duration-300 text-left relative overflow-hidden group",
                                    selectedTenure.months === plan.months
                                        ? "bg-white border-primary shadow-lg shadow-primary/5 ring-1 ring-primary"
                                        : "bg-white border-neutral-200 hover:border-neutral-300"
                                )}
                            >
                                <span className="block text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">{plan.months} MONTHS</span>
                                <span className="block text-sm font-black text-neutral-900">₹{Math.round(price / plan.months)}/mo*</span>
                                <span className={cn(
                                    "block text-[9px] font-bold uppercase tracking-tight mt-2",
                                    plan.rate === 0 ? "text-orange-500" : "text-neutral-500"
                                )}>
                                    {plan.label}
                                </span>

                                {selectedTenure.months === plan.months && (
                                    <div className="absolute -right-2 -bottom-2 opacity-5">
                                        <Calendar className="w-12 h-12 text-primary" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>

                    <p className="text-[10px] text-neutral-400 font-bold uppercase leading-relaxed tracking-tight">
                        *Calculated EMI is indicative. Actual amounts may vary based on bank policies and applicable taxes at the time of purchase.
                    </p>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-neutral-200 p-8 flex flex-col items-center text-center space-y-4 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />

                    <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Monthly Ownership Cost</span>
                        <div className="text-4xl font-black tracking-tighter text-neutral-900">₹{emiAmount.toLocaleString()}</div>
                    </div>

                    <div className="w-full h-px bg-neutral-100 my-2" />

                    <div className="w-full flex justify-between px-4">
                        <div className="text-left">
                            <span className="block text-[9px] font-black uppercase tracking-widest text-neutral-300">Net Principal</span>
                            <span className="text-xs font-black text-neutral-500">₹{price.toLocaleString()}</span>
                        </div>
                        <div className="text-right">
                            <span className="block text-[9px] font-black uppercase tracking-widest text-neutral-300">Total Interest</span>
                            <span className={cn(
                                "text-xs font-black",
                                totalInterest > 0 ? "text-neutral-500" : "text-emerald-500"
                            )}>
                                {totalInterest > 0 ? `₹${totalInterest.toLocaleString()}` : "FREE"}
                            </span>
                        </div>
                    </div>

                    <button className="w-full py-4 bg-neutral-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-neutral-200">
                        Proceed with EMI
                    </button>

                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Secure Bank Connectivity</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
