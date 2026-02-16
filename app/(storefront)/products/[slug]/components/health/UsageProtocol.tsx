"use client"

import React from 'react';
import { Calendar, Clock, AlertTriangle, UserCheck, Flame, Infinity, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UsageProtocolProps {
    dosage?: string;
    frequency?: string;
    timing?: string;
    warnings?: string[];
    className?: string;
}

export function UsageProtocol({
    dosage = "02 Capsules",
    frequency = "Daily Routine",
    timing = "30 mins Before Meal",
    usage,
    warnings = [
        "Consult health provider if pregnant or nursing.",
        "Store in a cool, dry place away from direct sunlight.",
        "Keep out of reach of children."
    ],
    className
}: UsageProtocolProps & { usage?: string }) {

    const parsed = React.useMemo(() => {
        if (!usage) return { dosage, frequency, timing };

        const d = usage.match(/Dosage:\s*([^,]+)/i)?.[1]?.trim() || dosage;
        const f = usage.match(/Frequency:\s*([^,]+)/i)?.[1]?.trim() || frequency;
        const t = usage.match(/Timing:\s*([^,]+)/i)?.[1]?.trim() || timing;

        if (!usage.includes(':')) {
            return { dosage: "See Label", frequency: "Per Prescription", timing: usage };
        }

        return { dosage: d, frequency: f, timing: t };
    }, [usage, dosage, frequency, timing]);

    return (
        <div className={cn("bg-[var(--callout-bg)] border border-[var(--callout-border)] rounded-none p-8 md:p-12 shadow-[var(--shadow-card)] relative overflow-hidden", className)}>
            <div className="flex flex-col lg:flex-row gap-12 relative z-10">
                <div className="flex-1 space-y-10">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--badge-bg)] border border-[var(--callout-border)] rounded-[var(--radius-badge)]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse" />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--badge-text)]">Certified Laboratory Protocol</span>
                        </div>
                        <h3 className="text-4xl font-normal leading-[0.85] tracking-tighter text-[var(--text-primary)]" style={{ fontFamily: 'var(--heading-font)' }}>
                            Usage & <br /><span className="italic" style={{ color: 'var(--primary)' }}>Bio-Optimization.</span>
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            { label: "Dosage", value: parsed.dosage, icon: Flame },
                            { label: "Frequency", value: parsed.frequency, icon: Calendar },
                            { label: "Best Timing", value: parsed.timing, icon: Clock }
                        ].map((item, idx) => {
                            const Icon = item.icon;
                            return (
                                <div key={idx} className="p-6 rounded-none bg-[var(--bg-primary)]/40 border border-[var(--callout-border)] text-center space-y-3 hover:bg-[var(--bg-primary)]/60 transition-colors">
                                    <div className="mx-auto w-10 h-10 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center">
                                        <Icon className="w-5 h-5 text-[var(--primary)]" />
                                    </div>
                                    <div>
                                        <span className="block text-[8px] font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-1">{item.label}</span>
                                        <span className="text-xs font-black text-[var(--text-primary)] uppercase tracking-tight">{item.value}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Results banner — uses callout tokens and premium styling */}
                    <div className="p-6 rounded-none bg-[var(--bg-primary)]/60 border border-[var(--callout-border)] flex flex-col md:flex-row items-center justify-between gap-6 border-l-4 border-l-[var(--primary)]">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-[var(--badge-bg)] flex items-center justify-center border border-[var(--callout-border)] shadow-sm">
                                <UserCheck className="w-6 h-6 text-[var(--badge-text)]" />
                            </div>
                            <div>
                                <span className="block text-[8px] font-black uppercase tracking-widest text-[var(--primary)]">Clinical Efficacy</span>
                                <p className="text-[10px] font-medium text-[var(--text-primary)] leading-relaxed uppercase tracking-tight">Maximum nutrient absorption achieved through consistent protocol adherence.</p>
                            </div>
                        </div>
                        <div className="shrink-0 px-4 py-2 bg-[var(--badge-bg)] rounded-full border border-[var(--callout-border)] flex items-center gap-2">
                            <Infinity className="w-3.5 h-3.5 text-[var(--badge-text)]" />
                            <span className="text-[8px] font-black uppercase tracking-widest text-[var(--badge-text)]">24H Metabolic Shield</span>
                        </div>
                    </div>
                </div>

                {/* Safety Guidelines — uses urgency tokens and sharp aesthetics */}
                <div className="lg:w-80 shrink-0">
                    <div className="p-8 bg-[var(--urgency-bg)] border border-[var(--callout-border)] rounded-none space-y-8 h-full relative overflow-hidden">
                        <div className="flex items-center gap-3 text-[var(--urgency-text)] relative z-10">
                            <AlertTriangle className="w-5 h-5" />
                            <h4 className="text-[10px] font-black uppercase tracking-widest">Medical Precautions</h4>
                        </div>

                        <ul className="space-y-5 relative z-10">
                            {warnings.map((w, idx) => (
                                <li key={idx} className="flex gap-4">
                                    <span className="w-3 h-[1px] bg-[var(--urgency-text)] mt-2 shrink-0" />
                                    <p className="text-[10px] leading-relaxed text-[var(--urgency-text)] font-bold uppercase tracking-tight opacity-90">{w}</p>
                                </li>
                            ))}
                        </ul>

                        <div className="pt-6 border-t border-[var(--urgency-text)]/10 mt-auto relative z-10">
                            <div className="px-4 py-2 bg-[var(--badge-bg)] border border-[var(--urgency-text)]/20 text-center">
                                <span className="text-[9px] font-black uppercase tracking-widest text-[var(--badge-text)]">Pharmacist Approved</span>
                            </div>
                        </div>

                        {/* Background subtle watermark */}
                        <div className="absolute -bottom-10 -right-10 opacity-[0.05] pointer-events-none">
                            <ShieldAlert className="w-40 h-40 text-[var(--urgency-text)] rotate-12" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Structural Axiom Decoration */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--primary)]/20 to-transparent" />
        </div>
    );
}
