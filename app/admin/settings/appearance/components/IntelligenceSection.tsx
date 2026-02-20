"use client";

import { useFormContext } from "react-hook-form";
import { Zap, AlertTriangle, Users } from "lucide-react";
import { Accordion } from "./Accordion";
import { ThemeConfig } from "@/components/ThemeProvider";

export function IntelligenceSection() {
    const { register, watch, setValue } = useFormContext<ThemeConfig>();
    const config = watch();

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            <div>
                <h2 className="text-xl font-extrabold text-neutral-900">Adaptive Intelligence</h2>
                <p className="text-neutral-500">Configure how the "Adaptive Engine" drives conversion.</p>
            </div>

            <Accordion title="Behavioral Triggers" icon={Zap} defaultOpen={true}>
                <div className="space-y-8">
                    {/* Urgency */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <label className="block text-sm font-bold text-neutral-700">Urgency Level</label>
                            <span className="text-xs font-mono bg-neutral-100 px-2 py-1 rounded text-neutral-500">
                                {config.seller.urgencyLevel}
                            </span>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            {['low', 'medium', 'high'].map((level) => (
                                <button
                                    key={level}
                                    type="button"
                                    onClick={() => setValue("seller.urgencyLevel", level as any, { shouldDirty: true })}
                                    className={`px-4 py-3 rounded-xl border-2 text-sm font-bold capitalize transition-all ${config.seller.urgencyLevel === level
                                        ? "border-black bg-neutral-900 text-white shadow-lg transform scale-[1.02]"
                                        : "border-neutral-100 bg-white text-neutral-500 hover:border-neutral-200"
                                        }`}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-neutral-400 mt-3">
                            High urgency triggers countdowns and stock warnings more aggressively.
                        </p>
                    </div>

                    {/* Social Proof */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <label className="block text-sm font-bold text-neutral-700">Social Proof Weight</label>
                            <span className="text-xs font-mono bg-neutral-100 px-2 py-1 rounded text-neutral-500">
                                {config.seller.socialProofWeight}
                            </span>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            {['light', 'medium', 'heavy'].map((weight) => (
                                <button
                                    key={weight}
                                    type="button"
                                    onClick={() => setValue("seller.socialProofWeight", weight as any, { shouldDirty: true })}
                                    className={`px-4 py-3 rounded-xl border-2 text-sm font-bold capitalize transition-all ${config.seller.socialProofWeight === weight
                                        ? "border-black bg-neutral-900 text-white shadow-lg transform scale-[1.02]"
                                        : "border-neutral-100 bg-white text-neutral-500 hover:border-neutral-200"
                                        }`}
                                >
                                    {weight}
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-neutral-400 mt-3">
                            Heavy weight injects "X people watching" and "Recent sales" toasts.
                        </p>
                    </div>

                    {/* CTA Prominence */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <label className="block text-sm font-bold text-neutral-700">CTA Prominence</label>
                            <span className="text-xs font-mono bg-neutral-100 px-2 py-1 rounded text-neutral-500">
                                {config.seller.ctaProminence}
                            </span>
                        </div>
                        <div className="flex gap-3">
                            {['balanced', 'dominant'].map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setValue("seller.ctaProminence", type as any, { shouldDirty: true })}
                                    className={`flex-1 px-4 py-3 rounded-xl border-2 text-sm font-bold capitalize transition-all ${config.seller.ctaProminence === type
                                        ? "border-black bg-neutral-900 text-white shadow-lg transform scale-[1.02]"
                                        : "border-neutral-100 bg-white text-neutral-500 hover:border-neutral-200"
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </Accordion>
        </div>
    );
}
