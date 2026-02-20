"use client";

import { useFormContext } from "react-hook-form";
import { ThemeConfig } from "@/components/ThemeProvider";

export function ThemePreview() {
    const { watch } = useFormContext<ThemeConfig>();
    const config = watch();

    if (!config?.colors || !config?.shape || !config?.typography || !config?.density) return null;

    // Helper to get font family style
    const getFont = (fontCtx: 'heading' | 'body') => {
        const font = fontCtx === 'heading' ? config.typography.headingFont : config.typography.bodyFont;
        return `"${font}", system-ui, sans-serif`;
    };

    return (
        <div className="sticky top-6 animate-in fade-in slide-in-from-right-8 duration-700">
            <h2 className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-4 ml-1">Live Storefront Preview</h2>
            <div
                className="border border-neutral-200 shadow-2xl rounded-[2.5rem] overflow-hidden bg-white p-3 ring-8 ring-neutral-100 transition-colors duration-500"
                style={{ backgroundColor: config.colors.background }}
            >
                <div className="rounded-[2rem] overflow-hidden border border-neutral-100 h-[700px] flex flex-col relative transition-all duration-500 bg-white"
                    style={{
                        borderRadius: config.shape.radiusScale === 'sharp' ? '0' : config.shape.radiusScale === 'round' ? '1.5rem' : config.shape.radiusScale === 'pill' ? '2rem' : '0.75rem',
                        backgroundColor: config.colors.background
                    }}
                >
                    {/* Navbar Mock */}
                    <div className="h-16 flex items-center justify-between px-6 border-b shrink-0" style={{ borderColor: config.colors.border, backgroundColor: config.colors.surface }}>
                        <span className="font-bold text-lg" style={{ fontFamily: getFont('heading'), color: config.colors.textPrimary }}>LUMINA</span>
                        <div className="flex gap-2">
                            <div className="w-8 h-8 rounded-full bg-neutral-100"></div>
                            <div className="w-8 h-8 rounded-full bg-neutral-100"></div>
                        </div>
                    </div>

                    {/* Hero Section */}
                    <div className="px-6 py-12 flex flex-col items-center text-center shrink-0" style={{ gap: config.density.densityScale === 'airy' ? '2rem' : '1rem' }}>
                        <div className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                            style={{
                                backgroundColor: config.colors.secondary,
                                color: config.colors.secondaryForeground,
                                borderRadius: config.conversion.badgeStyle === 'pill' ? '9999px' : config.shape.radiusScale === 'sharp' ? '0' : '0.5rem'
                            }}>
                            New Collection
                        </div>
                        <h1 className="text-4xl font-extrabold leading-tight" style={{ fontFamily: getFont('heading'), color: config.colors.textPrimary, textTransform: config.typography.headingCase as any }}>
                            Redefine Your Style
                        </h1>
                        <p className="text-sm max-w-xs opacity-80" style={{ fontFamily: getFont('body'), color: config.colors.textSecondary }}>
                            Premium essentials designed for the modern creator.
                        </p>

                        <button
                            className="px-8 py-3 text-sm font-bold transition-all hover:opacity-90 active:scale-95 mt-4 shadow-lg text-white"
                            style={{
                                backgroundColor: config.colors.primary,
                                color: config.colors.primaryForeground,
                                borderRadius: config.shape.radiusScale === 'pill' ? '9999px' : config.shape.radiusScale === 'sharp' ? '0' : '0.5rem',
                                fontFamily: getFont('body')
                            }}
                        >
                            Shop Now
                        </button>
                    </div>

                    {/* Product Grid Mock */}
                    <div className="px-6 pb-6 grid grid-cols-2 gap-4 overflow-y-auto">
                        {[1, 2].map((i) => (
                            <div key={i} className="space-y-3">
                                <div className="aspect-[4/5] bg-neutral-100 w-full relative group overflow-hidden"
                                    style={{ borderRadius: config.shape.radiusScale === 'pill' ? '1.5rem' : config.shape.radiusScale === 'sharp' ? '0' : '0.75rem' }}
                                >
                                    <div className="absolute inset-0 bg-neutral-200 animate-pulse" />
                                    {config.seller.urgencyLevel === 'high' && i === 1 && (
                                        <div className="absolute top-2 left-2 px-2 py-1 text-[10px] font-bold bg-white/90 backdrop-blur" style={{ color: config.colors.error, borderRadius: '4px' }}>
                                            Only 2 left!
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <div className="h-4 w-3/4 bg-neutral-100 rounded mb-1" />
                                    <div className="h-3 w-1/4 bg-neutral-100 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
