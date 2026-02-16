"use client"

import React from 'react';
import { Sun, Moon, Sparkles, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoutineStep {
    id: string;
    phase: 'am' | 'pm' | 'any';
    stepNumber: number;
    title: string;
    productName: string;
    duration?: string;
    benefit?: string;
}

interface RoutineBuilderProps {
    steps?: RoutineStep[];
    className?: string;
}

const DEFAULT_STEPS: RoutineStep[] = [
    {
        id: '1',
        phase: 'am',
        stepNumber: 1,
        title: "Cleanse",
        productName: "Gentle Botanical Cleanser",
        duration: "2 mins",
        benefit: "Removes impurities without stripping moisture."
    },
    {
        id: '2',
        phase: 'am',
        stepNumber: 2,
        title: "Treat",
        productName: "Vitamin C Radiance Serum",
        duration: "1 min",
        benefit: "Brightens and protects against environmental stressors."
    },
    {
        id: '3',
        phase: 'pm',
        stepNumber: 1,
        title: "Renew",
        productName: "Night Repair Elixir",
        duration: "5 mins",
        benefit: "Deep hydration and cell regeneration while you sleep."
    }
];

export function RoutineBuilder({
    steps = DEFAULT_STEPS,
    className
}: RoutineBuilderProps) {
    return (
        <div className={cn("space-y-8", className)}>
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-6">
                <div>
                    <h3 className="text-xl font-bold tracking-tight text-[var(--text-primary)]" style={{ fontFamily: 'var(--heading-font)' }}>
                        Optimized Routine
                    </h3>
                    <p className="text-[10px] font-medium text-[var(--text-secondary)] uppercase tracking-[0.2em]">
                        Synergistic Application Guide
                    </p>
                </div>
                <div className="flex -space-x-2">
                    <div className="w-10 h-10 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center text-[var(--primary)] shadow-sm">
                        <Sun className="w-5 h-5" />
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[var(--primary)] border border-[var(--border)] flex items-center justify-center text-primary-foreground shadow-md">
                        <Moon className="w-5 h-5" />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {steps.map((step) => (
                    <div
                        key={step.id}
                        className={cn(
                            "group p-5 border transition-all duration-300",
                            "bg-[var(--callout-bg)] border-[var(--callout-border)] rounded-[var(--radius-card)]",
                            "hover:shadow-[var(--shadow-card)]"
                        )}
                    >
                        <div className="flex items-start gap-4">
                            <div className="flex flex-col items-center gap-1">
                                <div className="text-[10px] font-black text-[var(--primary)] opacity-40 uppercase">Step</div>
                                <div className="text-2xl font-black text-[var(--primary)] leading-none italic" style={{ fontFamily: 'var(--heading-font)' }}>
                                    {step.stepNumber}
                                </div>
                                <div className="mt-2 text-[var(--text-secondary)]">
                                    {step.phase === 'am' ? <Sun className="w-3 h-3" /> : step.phase === 'pm' ? <Moon className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                                </div>
                            </div>

                            <div className="flex-1 space-y-2">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-[var(--text-primary)]">
                                        {step.title}
                                    </h4>
                                    {step.duration && (
                                        <span className="text-[9px] font-bold text-[var(--text-secondary)] bg-card/50 px-2 py-0.5 rounded-full border border-[var(--border)]">
                                            {step.duration}
                                        </span >
                                    )}
                                </div>

                                <p className="text-sm font-bold text-[var(--primary)]" style={{ fontFamily: 'var(--body-font)' }}>
                                    {step.productName}
                                </p>

                                {step.benefit && (
                                    <div className="flex items-start gap-2 pt-1">
                                        <CheckCircle2 className="w-3 h-3 text-[var(--primary)] mt-0.5 shrink-0" />
                                        <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed font-medium">
                                            {step.benefit}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-[var(--bg-secondary)] p-4 rounded-[var(--radius-card)] border border-dashed border-[var(--border)] text-center">
                <p className="text-[10px] text-[var(--text-secondary)] italic font-medium">
                    Pro Tip: Wait 60 seconds between steps for maximum absorption.
                </p>
            </div>
        </div>
    );
}
