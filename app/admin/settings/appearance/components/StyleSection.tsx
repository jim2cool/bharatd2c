"use client";

import { useFormContext } from "react-hook-form";
import { Palette, Type, Layers, Move, Sparkles, Check } from "lucide-react";
import { Accordion } from "./Accordion";
import { ThemeConfig } from "@/components/ThemeProvider";
import { FONT_OPTIONS, PRESETS } from "./constants";

export function StyleSection() {
    const { register, watch, setValue, reset } = useFormContext<ThemeConfig>();
    const config = watch();

    const applyPreset = (presetId: string) => {
        const preset = PRESETS.find((p) => p.id === presetId);
        if (preset) {
            // Merge current config with preset
            // We want to update only the style part or everything?
            // Usually presets are holistic.
            const newConfig = { ...config, ...preset, presetId };
            reset(newConfig);
            // Force presetId update just in case
            setValue("presetId", presetId, { shouldDirty: true });
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
            <div>
                <h2 className="text-xl font-extrabold text-neutral-900">Style System</h2>
                <p className="text-neutral-500">Define the visual language of your brand.</p>
            </div>

            {/* PRESET SELECTOR */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Sparkles className="w-24 h-24" />
                </div>
                <h3 className="text-sm font-black text-neutral-400 uppercase tracking-widest mb-4">Quick Start Presets</h3>
                <div className="grid grid-cols-2 gap-3">
                    {PRESETS.map((preset) => (
                        <button
                            key={preset.id}
                            type="button"
                            onClick={() => applyPreset(preset.id)}
                            className={`relative flex flex-col items-start gap-2 p-3 rounded-xl border-2 text-left transition-all hover:shadow-md ${config?.presetId === preset.id ? "border-black bg-neutral-50" : "border-neutral-100 hover:border-neutral-300 bg-white"}`}
                        >
                            {config?.presetId === preset.id && <div className="absolute top-2 right-2 bg-black text-white p-0.5 rounded-full"><Check className="w-3 h-3" /></div>}
                            <div className="flex -space-x-1">
                                <div className="w-4 h-4 rounded-full border border-white shadow-sm" style={{ backgroundColor: preset.colors.primary }} />
                                <div className="w-4 h-4 rounded-full border border-white shadow-sm" style={{ backgroundColor: preset.colors.accent }} />
                                <div className="w-4 h-4 rounded-full border border-white shadow-sm" style={{ backgroundColor: preset.colors.background }} />
                            </div>
                            <div>
                                <span className="text-xs font-extrabold text-neutral-900 block leading-tight">{preset.name}</span>
                                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">{preset.style.id}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* PILLAR 1: BRAND TOKENS */}
            <Accordion title="1. Brand Tokens & Identity" icon={Palette} defaultOpen={true}>
                <div className="space-y-6">
                    {config?.colors && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-wider mb-2">Canvas (Background)</label>
                                <div className="flex items-center gap-3 bg-neutral-50 p-2 rounded-lg border border-neutral-100">
                                    <input type="color" {...register("colors.background")} className="h-8 w-10 rounded cursor-pointer border-none bg-transparent" />
                                    <span className="text-xs font-mono font-bold">{config.colors.background}</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-wider mb-2">Primary CTA (Conversion)</label>
                                <div className="flex items-center gap-3 bg-neutral-50 p-2 rounded-lg border border-neutral-100">
                                    <input type="color" {...register("colors.primary")} className="h-8 w-10 rounded cursor-pointer border-none bg-transparent" />
                                    <span className="text-xs font-mono font-bold">{config.colors.primary}</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-wider mb-2">Surface (Cards)</label>
                                <div className="flex items-center gap-3 bg-neutral-50 p-2 rounded-lg border border-neutral-100">
                                    <input type="color" {...register("colors.surface")} className="h-8 w-10 rounded cursor-pointer border-none bg-transparent" />
                                    <span className="text-xs font-mono font-bold">{config.colors.surface}</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-wider mb-2">Urgency (Accent)</label>
                                <div className="flex items-center gap-3 bg-neutral-50 p-2 rounded-lg border border-neutral-100">
                                    <input type="color" {...register("colors.accent")} className="h-8 w-10 rounded cursor-pointer border-none bg-transparent" />
                                    <span className="text-xs font-mono font-bold">{config.colors.accent}</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-wider mb-2">Ink (Primary Text)</label>
                                <div className="flex items-center gap-3 bg-neutral-50 p-2 rounded-lg border border-neutral-100">
                                    <input type="color" {...register("colors.textPrimary")} className="h-8 w-10 rounded cursor-pointer border-none bg-transparent" />
                                    <span className="text-xs font-mono font-bold">{config.colors.textPrimary}</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-wider mb-2">Secondary Action</label>
                                <div className="flex items-center gap-3 bg-neutral-50 p-2 rounded-lg border border-neutral-100">
                                    <input type="color" {...register("colors.secondary")} className="h-8 w-10 rounded cursor-pointer border-none bg-transparent" />
                                    <span className="text-xs font-mono font-bold">{config.colors.secondary}</span>
                                </div>
                            </div>
                        </div>
                    )}
                    {config?.brand && (
                        <div>
                            <label className="block text-sm font-bold text-neutral-700 mb-2">Gradient Style</label>
                            <select
                                {...register("brand.gradientStyle")}
                                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-100 rounded-lg text-sm font-medium capitalize"
                            >
                                <option value="none">None (Flat)</option>
                                <option value="subtle">Subtle (Elegant)</option>
                                <option value="bold">Bold (High Energy)</option>
                            </select>
                        </div>
                    )}
                </div>
            </Accordion>

            {/* PILLAR 2: TYPOGRAPHY */}
            <Accordion title="2. Typography System" icon={Type}>
                <div className="space-y-6">
                    {config?.typography && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-neutral-700 mb-2">Heading Font</label>
                                    <select
                                        {...register("typography.headingFont")}
                                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-100 rounded-lg text-sm font-medium"
                                    >
                                        {FONT_OPTIONS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-neutral-700 mb-2">Body Font</label>
                                    <select
                                        {...register("typography.bodyFont")}
                                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-100 rounded-lg text-sm font-medium"
                                    >
                                        {FONT_OPTIONS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-neutral-700 mb-2">Heading Weight</label>
                                    <select
                                        {...register("typography.headingWeight")}
                                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-100 rounded-lg text-sm font-medium capitalize"
                                    >
                                        {["normal", "medium", "semibold", "bold", "extrabold"].map((o) => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-neutral-700 mb-2">Type Scale</label>
                                    <select
                                        {...register("typography.scale")}
                                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-100 rounded-lg text-sm font-medium capitalize"
                                    >
                                        {["classic", "modern", "expressive"].map((o) => (
                                            <option key={o} value={o}>
                                                {o === "classic" ? "Standard (Classic)" : o === "modern" ? "Bold (Modern)" : "Dramatic (Expressive)"}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </Accordion>

            {/* PILLAR 3: SHAPE & DEPTH */}
            <Accordion title="3. Shape & Depth" icon={Layers}>
                <div className="space-y-6">
                    {config?.shape && (
                        <>
                            <div>
                                <label className="block text-sm font-bold text-neutral-700 mb-2">Global Radius Scale</label>
                                <div className="flex gap-2 bg-neutral-50 p-1 rounded-xl">
                                    {[
                                        { val: "sharp", label: "Sharp" },
                                        { val: "clean", label: "Subtle" },
                                        { val: "soft", label: "Soft" },
                                        { val: "round", label: "Round" },
                                        { val: "pill", label: "Pill" }
                                    ].map((opt) => (
                                        <button
                                            key={opt.val}
                                            type="button"
                                            onClick={() => setValue("shape.radiusScale", opt.val as any, { shouldDirty: true })}
                                            className={`flex-1 py-1.5 text-xs rounded-lg font-bold capitalize transition-all ${config.shape.radiusScale === opt.val ? "bg-white text-black shadow-sm ring-1 ring-black/5" : "text-neutral-500 hover:text-neutral-900"}`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-neutral-700 mb-2">Elevation (Shadow)</label>
                                    <select
                                        {...register("shape.elevation")}
                                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-100 rounded-lg text-sm font-medium capitalize"
                                    >
                                        {["flat", "soft", "raised", "floating"].map((o) => (
                                            <option key={o} value={o}>
                                                {o === "raised" ? "Elevated" : o === "floating" ? "Floating (Deep)" : o.charAt(0).toUpperCase() + o.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-neutral-700 mb-2">Border Style</label>
                                    <select
                                        {...register("shape.borderStyle")}
                                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-100 rounded-lg text-sm font-medium capitalize"
                                    >
                                        {["none", "subtle", "hairline", "thick"].map((o) => (
                                            <option key={o} value={o}>
                                                {o === "thick" ? "Strong" : o.charAt(0).toUpperCase() + o.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </Accordion>

            {/* PILLAR 4: DENSITY */}
            <Accordion title="4. Density & Spacing" icon={Move}>
                <div className="space-y-6">
                    {config?.density && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-neutral-700 mb-2">Global UI Density</label>
                                <div className="flex gap-2 bg-neutral-50 p-1 rounded-xl">
                                    {[
                                        { val: "compact", label: "Compact" },
                                        { val: "balanced", label: "Balanced" },
                                        { val: "airy", label: "Airy" }
                                    ].map((opt) => (
                                        <button
                                            key={opt.val}
                                            type="button"
                                            onClick={() => setValue("density.densityScale", opt.val as any, { shouldDirty: true })}
                                            className={`flex-1 py-1.5 text-xs rounded-lg font-bold capitalize transition-all ${config.density.densityScale === opt.val ? "bg-white text-black shadow-sm ring-1 ring-black/5" : "text-neutral-500 hover:text-neutral-900"}`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-neutral-500 mb-1">Section Padding</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0.5"
                                        max="3.0"
                                        {...register("density.sectionPadding", { valueAsNumber: true })}
                                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-100 rounded-lg text-sm font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-neutral-500 mb-1">Component Gap</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0.5"
                                        max="3.0"
                                        {...register("density.componentGap", { valueAsNumber: true })}
                                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-100 rounded-lg text-sm font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-neutral-500 mb-1">Grid Tightness</label>
                                    <select
                                        {...register("density.gridTightness")}
                                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-100 rounded-lg text-sm font-medium capitalize"
                                    >
                                        <option value="tight">Tight</option>
                                        <option value="normal">Standard</option>
                                        <option value="relaxed">Relaxed</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Accordion>
        </div>
    );
}
