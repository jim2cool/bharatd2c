"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Info, Zap, LayoutList, Heart, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Macro {
    label: string;
    value: string;
    sublabel: string;
    color: string;
    bg: string;
}

interface NutritionalTransparencyProps {
    macros?: Macro[];
    calories?: string;
    servingSize?: string;
    className?: string;
}

const DEFAULT_MACROS: Macro[] = [
    { label: "Protein", value: "24g", sublabel: "Plant-Based", color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Fiber", value: "8g", sublabel: "Prebiotic", color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Sugar", value: "0g", sublabel: "No Added", color: "text-rose-500", bg: "bg-rose-50" },
    { label: "Vitamins", value: "21", sublabel: "Essential", color: "text-blue-500", bg: "bg-blue-50" }
];

export function NutritionalTransparency({
    macros = DEFAULT_MACROS,
    calories = "120kcal",
    servingSize = "30g Scoop",
    className
}: NutritionalTransparencyProps) {
    return (
        <div className={cn("bg-white border border-neutral-100 rounded-[3rem] p-10 md:p-14 shadow-sm relative overflow-hidden", className)}>
            {/* Soft Organic Gradients */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-50/50 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row gap-16">
                <div className="lg:col-span-1 space-y-10">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 rounded-full border border-emerald-200">
                            <Leaf className="w-3.5 h-3.5 text-emerald-700" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Clean Label Verified</span>
                        </div>
                        <h2 className="text-4xl font-black tracking-tighter text-neutral-900 leading-[0.9]">
                            Nourishment <br />
                            <span className="text-emerald-600 font-medium italic">Fact Sheet.</span>
                        </h2>
                        <p className="text-sm font-medium text-neutral-500 leading-relaxed max-w-sm">
                            Complete transparency into every calorie. We prioritize bio-available nutrients over synthetic fillers.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {macros.map((macro, idx) => (
                            <div key={idx} className={cn("p-6 rounded-[2.5rem] border border-neutral-50 transition-all hover:shadow-xl hover:shadow-neutral-900/5 group", macro.bg)}>
                                <span className="block text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">{macro.label}</span>
                                <div className="flex items-end gap-1 mb-2">
                                    <span className={cn("text-3xl font-black tracking-tighter", macro.color)}>{macro.value}</span>
                                </div>
                                <div className="flex items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span className="text-[9px] font-black uppercase tracking-widest">{macro.sublabel}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:w-[450px] shrink-0">
                    <div className="bg-neutral-50 border border-neutral-100 rounded-[3rem] p-8 md:p-10 space-y-8">
                        <div className="flex items-center justify-between border-b border-neutral-200 pb-6">
                            <div>
                                <span className="block text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Serving Size</span>
                                <span className="text-xl font-black text-neutral-900 uppercase tracking-tighter">{servingSize}</span>
                            </div>
                            <div className="text-right">
                                <span className="block text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Per Serving</span>
                                <span className="text-3xl font-black text-neutral-900 tracking-tighter">{calories}</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {[
                                { label: "Total Fat", val: "1.5g", pct: 2 },
                                { label: "Total Carbohydrates", val: "12g", pct: 4 },
                                { label: "Sodium", val: "45mg", pct: 2 },
                                { label: "Dietary Fiber", val: "8g", pct: 28 },
                                { label: "Added Sugars", val: "0g", pct: 0 },
                                { label: "Potassium", val: "320mg", pct: 15 }
                            ].map((row, idx) => (
                                <div key={idx} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-neutral-200 group-hover:bg-primary transition-colors" />
                                        <span className="text-xs font-bold text-neutral-600 uppercase tracking-tight">{row.label}</span>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span className="text-xs font-black text-neutral-900">{row.val}</span>
                                        <span className="text-[10px] font-black text-neutral-300 w-8 text-right group-hover:text-emerald-500 transition-colors">{row.pct}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-8 border-t border-neutral-200 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <Heart className="w-4 h-4 text-rose-500 fill-rose-500/10" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-900">Diabetic Friendly</span>
                            </div>
                            <div className="w-1 h-1 rounded-full bg-neutral-200" />
                            <div className="flex items-center gap-2">
                                <Zap className="w-4 h-4 text-amber-500 fill-amber-500/10" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-900">Slow Release Energy</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center gap-4 bg-emerald-900 rounded-[2rem] p-6 text-white overflow-hidden relative">
                        <div className="absolute right-0 top-0 p-4 opacity-10">
                            <ShieldCheck className="w-20 h-20" />
                        </div>
                        <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                            <Info className="w-5 h-5 text-emerald-400" />
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-tight leading-relaxed">
                            No artificial sweeteners, synthetic dyes, or soy-derived bulking agents. Pure sustenance only.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CheckCircle2(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    )
}
