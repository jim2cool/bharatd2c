"use client"

import React from 'react';
import { Calendar, Clock, AlertTriangle, UserCheck, Flame, Infinity } from 'lucide-react';
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
    usage, // New prop
    warnings = [
        "Consult health provider if pregnant or nursing.",
        "Store in a cool, dry place away from direct sunlight.",
        "Keep out of reach of children."
    ],
    className
}: UsageProtocolProps & { usage?: string }) {

    const parsed = React.useMemo(() => {
        if (!usage) return { dosage, frequency, timing };

        // Parse "Dosage: X, Frequency: Y, Timing: Z"
        const d = usage.match(/Dosage:\s*([^,]+)/i)?.[1]?.trim() || dosage;
        const f = usage.match(/Frequency:\s*([^,]+)/i)?.[1]?.trim() || frequency;
        const t = usage.match(/Timing:\s*([^,]+)/i)?.[1]?.trim() || timing;

        // If simple string without keys, use as general instruction (maybe override dosage temporarily)
        if (!usage.includes(':')) {
            return { dosage: "See Label", frequency: "Per Prescription", timing: usage };
        }

        return { dosage: d, frequency: f, timing: t };
    }, [usage, dosage, frequency, timing]);
    return (
        <div className={cn("bg-white border border-neutral-100 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden", className)}>
            <div className="flex flex-col lg:flex-row gap-12">
                <div className="flex-1 space-y-10">
                    <div>
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            Official Usage Protocol
                        </h3>
                        <p className="text-3xl font-black italic tracking-tighter text-neutral-900 leading-tight">
                            Precision for <br />
                            <span className="text-neutral-400">Peak Bioavailability.</span>
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {[
                            { label: "Dosage", value: parsed.dosage, icon: Flame, color: "text-orange-500", bg: "bg-orange-50" },
                            { label: "Frequency", value: parsed.frequency, icon: Calendar, color: "text-blue-500", bg: "bg-blue-50" },
                            { label: "Best Timing", value: parsed.timing, icon: Clock, color: "text-purple-500", bg: "bg-purple-50" }
                        ].map((item, idx) => {
                            const Icon = item.icon;
                            return (
                                <div key={idx} className="p-6 rounded-3xl bg-neutral-50/50 border border-neutral-100 text-center space-y-3">
                                    <div className={cn("mx-auto w-12 h-12 rounded-2xl flex items-center justify-center", item.bg)}>
                                        <Icon className={cn("w-6 h-6", item.color)} />
                                    </div>
                                    <div>
                                        <span className="block text-[9px] font-black uppercase tracking-widest text-neutral-400 mb-1">{item.label}</span>
                                        <span className="text-sm font-black text-neutral-900">{item.value}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="p-6 rounded-3xl bg-neutral-900 text-white flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/10 rounded-2xl">
                                <UserCheck className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <span className="block text-[9px] font-black uppercase tracking-widest opacity-40">Optimal Results</span>
                                <p className="text-xs font-bold leading-tight">Visible transformation within 21 days of consistent use.</p>
                            </div>
                        </div>
                        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                            <Infinity className="w-3 h-3 text-primary animate-pulse" />
                            <span className="text-[8px] font-black uppercase tracking-widest">Ongoing Protection</span>
                        </div>
                    </div>
                </div>

                <div className="lg:w-72 space-y-6">
                    <div className="p-8 bg-rose-50 border border-rose-100 rounded-[2.5rem] space-y-6 h-full">
                        <div className="flex items-center gap-2 text-rose-600">
                            <AlertTriangle className="w-5 h-5 fill-rose-600/10" />
                            <h4 className="text-[10px] font-black uppercase tracking-widest">Safety Guidelines</h4>
                        </div>

                        <ul className="space-y-4">
                            {warnings.map((w, idx) => (
                                <li key={idx} className="flex gap-3">
                                    <span className="w-1 h-1 rounded-full bg-rose-300 mt-2 shrink-0" />
                                    <p className="text-[11px] leading-relaxed text-rose-900/60 font-bold uppercase tracking-tight">{w}</p>
                                </li>
                            ))}
                        </ul>

                        <div className="pt-4 mt-auto">
                            <div className="px-4 py-2 bg-rose-600 rounded-2xl text-center">
                                <span className="text-[9px] font-black uppercase tracking-widest text-white">Batch Tested Safe</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
