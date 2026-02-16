"use client";

import { useFormContext } from "react-hook-form";
import { ThemeConfig } from "@/components/ThemeProvider";

export function ThemePreview() {
    const { watch } = useFormContext<ThemeConfig>();
    const config = watch();

    if (!config?.colors || !config?.shape || !config?.typography || !config?.density) return null;

    // --- DRS v3 Logic Mirror ---
    // This mirrors the logic in generateCss from ThemeProvider.tsx but for the live preview
    const primary = config.colors.primary;
    const bgPrimary = config.colors.background;
    const textPrimary = config.colors.textPrimary;
    const textSecondary = config.colors.textSecondary;
    const borderColour = config.colors.border;

    const radiusMap = {
        sharp: "0px",
        clean: "0.5rem",
        soft: "0.75rem",
        round: "1rem",
        pill: "9999px",
    };

    const radius = radiusMap[config.shape.radiusScale] || radiusMap.clean;
    const densityMultiplier = config.density.densityScale === 'compact' ? 0.8 : config.density.densityScale === 'airy' ? 1.2 : 1;

    // Section/Component Gaps matching ThemeProvider.tsx
    const sectionGap = `calc(4rem * ${config.density.sectionPadding || 1} * ${densityMultiplier})`;
    const componentGap = (() => {
        const base = `calc(1.5rem * ${config.density.componentGap || 1} * ${densityMultiplier})`;
        if (config.presetId === 'shaahi') return `max(24px, ${base})`;
        return base;
    })();

    return (
        <div className="sticky top-6 animate-in fade-in slide-in-from-right-8 duration-700">
            <h2 className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-4 ml-1">Live Storefront Preview</h2>
            <div
                className="border border-neutral-200 shadow-2xl rounded-[2.5rem] overflow-hidden bg-white p-3 ring-8 ring-neutral-100 transition-all duration-500"
                style={{ backgroundColor: bgPrimary }}
            >
                <div
                    className="rounded-[2rem] overflow-hidden border border-neutral-100 h-[700px] flex flex-col relative transition-all duration-500 overflow-y-auto"
                    style={{
                        backgroundColor: bgPrimary,
                        gap: sectionGap,
                        paddingBottom: sectionGap
                    }}
                >
                    {/* NOISE OVERLAY (Simulating Mood Card) */}
                    {['swasth_aur_sachcha', 'gyaan_aur_bharosa'].includes(config.presetId?.toLowerCase() || '') && (
                        <div
                            className="absolute inset-0 pointer-events-none opacity-[0.05] z-50"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                            }}
                        />
                    )}

                    {/* Navbar Mock */}
                    <div className="h-16 flex items-center justify-between px-6 border-b shrink-0 sticky top-0 bg-white z-10" style={{ borderColor: borderColour, backgroundColor: config.colors.surface }}>
                        <span className="font-bold text-lg" style={{ color: textPrimary }}>LUMINA</span>
                        <div className="flex gap-2">
                            <div className="w-8 h-8 rounded-full bg-neutral-100"></div>
                            <div className="w-8 h-8 rounded-full bg-neutral-100"></div>
                        </div>
                    </div>

                    {/* Above the Fold Grid Logic (Deterministic for DRS v3) */}
                    <div className="px-6 flex flex-col" style={{ gap: sectionGap }}>
                        {/* Hero Mock */}
                        <div className="flex flex-col items-center text-center" style={{ gap: componentGap }}>
                            <div className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                                style={{
                                    backgroundColor: config.colors.secondary,
                                    color: config.colors.secondaryForeground,
                                    borderRadius: config.conversion.badgeStyle === 'pill' ? '9999px' : radius
                                }}>
                                New Collection
                            </div>
                            <h1 className="text-3xl font-black leading-tight tracking-tighter" style={{ color: textPrimary, textTransform: config.typography.headingCase as any }}>
                                Redefine Your Visual Flow
                            </h1>
                            <p className="text-xs max-w-xs opacity-70" style={{ color: textSecondary }}>
                                Premium essentials designed for the modern creator. Built with DRS v3 standardization.
                            </p>

                            <button
                                className="px-10 py-4 text-xs font-black transition-all hover:opacity-90 active:scale-95 shadow-lg text-white uppercase tracking-widest"
                                style={{
                                    backgroundColor: primary,
                                    color: config.colors.primaryForeground,
                                    borderRadius: config.shape.radiusScale === 'pill' ? '9999px' : radius,
                                    transform: `scale(${config.conversion.ctaProminence === 'dominant' ? 1.05 : 1})`
                                }}
                            >
                                Shop Now
                            </button>
                        </div>

                        {/* Product Visual Mock */}
                        <div className="grid grid-cols-2 gap-4">
                            {[1, 2].map((i) => (
                                <div key={i} className="flex flex-col" style={{ gap: componentGap }}>
                                    <div className="aspect-[4/5] bg-neutral-100 w-full relative overflow-hidden"
                                        style={{ borderRadius: radius }}
                                    >
                                        <div className="absolute inset-0 bg-neutral-200 animate-pulse" />
                                        {config.seller.urgencyLevel === 'high' && i === 1 && (
                                            <div className="absolute top-2 left-2 px-2 py-1 text-[8px] font-black bg-white/90 backdrop-blur uppercase tracking-tighter" style={{ color: config.colors.error, borderRadius: '4px' }}>
                                                Only 2 left!
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <div className="h-3 w-3/4 bg-neutral-100 rounded" />
                                        <div className="h-2 w-1/4 bg-neutral-100 rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
