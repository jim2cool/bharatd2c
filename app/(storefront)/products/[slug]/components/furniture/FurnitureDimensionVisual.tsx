"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { Ruler, Accessibility, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FurnitureDimensionVisualProps {
    width?: string;
    height?: string;
    depth?: string;
    imageUrl?: string;
    className?: string;
}

export function FurnitureDimensionVisual({
    width,
    height,
    depth,
    dimensions,
    image,
    imageUrl = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1000",
    className
}: FurnitureDimensionVisualProps & { dimensions?: string; image?: string }) {
    const parsed = React.useMemo(() => {
        if (!dimensions) return { w: width || "120cm", h: height || "85cm", d: depth || "60cm" };

        const parts = dimensions.split(/[,xX]/).map(s => s.trim());
        return {
            w: parts[0] || width || "120cm",
            h: parts[1] || height || "85cm",
            d: parts[2] || depth || "60cm"
        };
    }, [dimensions, width, height, depth]);

    const displayImage = image || imageUrl;

    return (
        <div className={cn("bg-[var(--bg-secondary)] rounded-[var(--radius-card)] p-8 border border-[var(--border)] overflow-hidden shadow-[var(--shadow-card)]", className)}>
            <div className="flex flex-col md:flex-row gap-10">
                <div className="flex-1 space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--callout-bg)] border border-[var(--callout-border)] rounded-[var(--radius-badge)]">
                        <Ruler className="w-3 h-3 text-[var(--badge-text)]" />
                        <span className="text-[9px] font-semibold uppercase tracking-widest text-[var(--badge-text)]">Spatial Guide</span>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] uppercase italic">Scale & Space.</h3>
                        <p className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-widest leading-relaxed">
                            Visualized against a standard human silhouette (175cm) for real-world context.
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { label: 'Width', value: parsed.w },
                            { label: 'Height', value: parsed.h },
                            { label: 'Depth', value: parsed.d }
                        ].map((dim) => (
                            <div key={dim.label} className="p-4 bg-[var(--bg-primary)] border border-[var(--border)] rounded-[var(--radius-button)] shadow-[var(--shadow-card)]">
                                <span className="block text-[8px] font-semibold uppercase tracking-widest text-[var(--text-secondary)] mb-1">{dim.label}</span>
                                <span className="text-sm font-bold text-[var(--text-primary)]">{dim.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex-1 relative aspect-square bg-[var(--bg-primary)] rounded-[var(--radius-card)] border border-[var(--border)] flex items-end justify-center p-6 overflow-hidden shadow-[var(--shadow-card)]">
                    {/* Measurement Lines */}
                    <div className="absolute inset-x-12 bottom-12 h-px bg-[var(--border)]">
                        <div className="absolute -left-1 -top-1 w-2 h-2 rounded-full bg-[var(--border)]" />
                        <div className="absolute -right-1 -top-1 w-2 h-2 rounded-full bg-[var(--border)]" />
                        <div className="absolute inset-x-0 -top-4 text-center text-[9px] font-semibold text-[var(--text-secondary)] uppercase tracking-tighter">{parsed.w}</div>
                    </div>

                    <div className="absolute right-12 bottom-12 top-12 w-px bg-[var(--border)]">
                        <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[var(--border)]" />
                        <div className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-[var(--border)]" />
                        <div className="absolute inset-y-0 -right-8 flex items-center text-[9px] font-semibold text-[var(--text-secondary)] uppercase tracking-tighter" style={{ writingMode: 'vertical-rl' }}>{parsed.h}</div>
                    </div>

                    {/* Human Silhouette for Scale */}
                    <div className="absolute left-12 bottom-12 opacity-10">
                        <Accessibility className="w-48 h-48 text-[var(--text-primary)]" />
                    </div>

                    {/* Product Image */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        className="relative z-10 w-3/4 aspect-video rounded-[var(--radius-card)] shadow-[var(--shadow-hover)] border-2 border-[var(--border)] overflow-hidden"
                    >
                        <img src={displayImage} alt="Scale Context" className="w-full h-full object-cover" />
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
