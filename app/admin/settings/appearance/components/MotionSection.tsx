"use client";

import { useFormContext } from "react-hook-form";
import { MousePointer2 } from "lucide-react";
import { Accordion } from "./Accordion";
import { ThemeConfig } from "@/components/ThemeProvider";

export function MotionSection() {
    const { register, watch, setValue } = useFormContext<ThemeConfig>();
    const config = watch();

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
            <div>
                <h2 className="text-xl font-extrabold text-neutral-900">Alive Engine</h2>
                <p className="text-neutral-500">Configure physics-based motion and interactivity.</p>
            </div>

            <Accordion title="Motion & Interaction" icon={MousePointer2} defaultOpen={true}>
                <div className="space-y-6">
                    {config?.motion && (
                        <>
                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="text-sm font-bold text-neutral-800">Enable "Alive" Motion</label>
                                    <p className="text-xs text-neutral-500">Global toggle for all physics-based animations.</p>
                                </div>
                                <input
                                    type="checkbox"
                                    {...register("motion.enabled")}
                                    className="w-10 h-6 rounded-full appearance-none bg-neutral-200 checked:bg-black transition-all cursor-pointer relative after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:w-4 after:h-4 after:rounded-full after:transition-all checked:after:left-5"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-neutral-700 mb-2">Hover Effect</label>
                                    <select
                                        {...register("motion.hoverMode")}
                                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-100 rounded-lg text-sm font-medium capitalize"
                                    >
                                        <option value="none">None</option>
                                        <option value="fade">Fade</option>
                                        <option value="lift">Lift</option>
                                        <option value="glow">Glow</option>
                                        <option value="zoom">Scale</option>
                                        <option value="underline">Underline</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-neutral-700 mb-2">Scroll Reveal</label>
                                    <select
                                        {...register("motion.scrollReveal")}
                                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-100 rounded-lg text-sm font-medium capitalize"
                                    >
                                        <option value="none">None</option>
                                        <option value="fade">Fade</option>
                                        <option value="slide">Slide</option>
                                        <option value="zoom">Scale</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-neutral-700 mb-2">Speed</label>
                                    <select
                                        {...register("motion.speed")}
                                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-100 rounded-lg text-sm font-medium capitalize"
                                    >
                                        {["fast", "normal", "relaxed"].map((o) => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </Accordion>
        </div>
    );
}
