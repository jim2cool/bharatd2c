"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Info, Zap, Heart, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

// Macros are passed as simple data objects — colours removed from data model
interface Macro {
    label: string;
    value: string;
    sublabel: string;
}

interface NutritionalTransparencyProps {
    macros?: Macro[];
    calories?: string;
    servingSize?: string;
    className?: string;
}

const DEFAULT_MACROS: Macro[] = [
    { label: "Protein", value: "24g", sublabel: "Plant-Based" },
    { label: "Fiber", value: "8g", sublabel: "Prebiotic" },
    { label: "Sugar", value: "0g", sublabel: "No Added" },
    { label: "Vitamins", value: "21", sublabel: "Essential" }
];

function CheckCircle2(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    )
}

export function NutritionalTransparency({
    macros = DEFAULT_MACROS,
    calories = "120kcal",
    servingSize = "30g Scoop",
    className
}: NutritionalTransparencyProps) {
    return (
        <div className={cn("bg-[var(--bg-primary)] border border-[var(--border)] rounded-[var(--radius-card)] p-10 md:p-14 shadow-[var(--shadow-card)] relative overflow-hidden", className)}>
            {/* Ambient glow */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[var(--primary)]/5 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row gap-16">
                <div className="lg:col-span-1 space-y-10">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[var(--badge-bg)] rounded-[var(--radius-badge)] border border-[var(--callout-border)]">
                            <Leaf className="w-3.5 h-3.5 text-[var(--badge-text)]" />
                            <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--badge-text)]">Clean Label Verified</span>
                        </div>
                        <h2 className="text-4xl font-bold tracking-tighter text-[var(--text-primary)] leading-[0.9]">
                            Nourishment <br />
                            <span className="text-[var(--text-secondary)] font-normal italic">Fact Sheet.</span>
                        </h2>
                        <p className="text-sm font-medium text-[var(--text-secondary)] leading-relaxed max-w-sm">
                            Complete transparency into every calorie. We prioritize bio-available nutrients over synthetic fillers.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {macros.map((macro, idx) => (
                            <div key={idx} className="p-6 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--bg-secondary)] transition-all hover:shadow-[var(--shadow-hover)] group">
                                <span className="block text-[10px] font-semibold uppercase tracking-widest text-[var(--text-secondary)] mb-1">{macro.label}</span>
                                <div className="flex items-end gap-1 mb-2">
                                    <span className="text-3xl font-bold tracking-tighter text-[var(--primary)]">{macro.value}</span>
                                </div>
                                <div className="flex items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                                    <CheckCircle2 className="w-3 h-3 text-[var(--text-secondary)]" />
                                    <span className="text-[9px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">{macro.sublabel}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:w-[450px] shrink-0">
                    <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[var(--radius-card)] p-8 md:p-10 space-y-8">
                        <div className="flex items-center justify-between border-b border-[var(--border)] pb-6">
                            <div>
                                <span className="block text-[10px] font-semibold uppercase tracking-widest text-[var(--text-secondary)] mb-1">Serving Size</span>
                                <span className="text-xl font-bold text-[var(--text-primary)] uppercase tracking-tighter">{servingSize}</span>
                            </div>
                            <div className="text-right">
                                <span className="block text-[10px] font-semibold uppercase tracking-widest text-[var(--text-secondary)] mb-1">Per Serving</span>
                                <span className="text-3xl font-bold text-[var(--text-primary)] tracking-tighter">{calories}</span>
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
                                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--border)] group-hover:bg-[var(--primary)] transition-colors" />
                                        <span className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-tight">{row.label}</span>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span className="text-xs font-semibold text-[var(--text-primary)]">{row.val}</span>
                                        <span className="text-[10px] font-semibold text-[var(--text-secondary)] w-8 text-right group-hover:text-[var(--primary)] transition-colors">{row.pct}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-8 border-t border-[var(--border)] flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <Heart className="w-4 h-4 text-[var(--primary)] opacity-60" />
                                <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-primary)]">Diabetic Friendly</span>
                            </div>
                            <div className="w-1 h-1 rounded-full bg-[var(--border)]" />
                            <div className="flex items-center gap-2">
                                <Zap className="w-4 h-4 text-[var(--accent)] opacity-60" />
                                <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-primary)]">Slow Release Energy</span>
                            </div>
                        </div>
                    </div>

                    {/* Clean-label callout */}
                    <div className="mt-6 flex items-center gap-4 bg-[var(--callout-bg)] border border-[var(--callout-border)] rounded-[var(--radius-card)] p-6 relative overflow-hidden">
                        <div className="absolute right-0 top-0 p-4 opacity-10">
                            <ShieldCheck className="w-20 h-20 text-[var(--primary)]" />
                        </div>
                        <div className="w-10 h-10 rounded-[var(--radius-button)] bg-[var(--badge-bg)] border border-[var(--callout-border)] flex items-center justify-center shrink-0">
                            <Info className="w-5 h-5 text-[var(--badge-text)]" />
                        </div>
                        <p className="text-[10px] font-medium uppercase tracking-tight leading-relaxed text-[var(--text-secondary)]">
                            No artificial sweeteners, synthetic dyes, or soy-derived bulking agents. Pure sustenance only.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
