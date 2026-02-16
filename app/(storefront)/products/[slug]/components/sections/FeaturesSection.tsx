"use client"

import React from 'react';
import { Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Highlight {
    text: string;
    tier?: 'clean' | 'lifestyle' | 'weak';
}

interface FeaturesSectionProps {
    highlights: Highlight[];
    className?: string;
}

export function FeaturesSection({
    highlights,
    className
}: FeaturesSectionProps) {
    if (!highlights || highlights.length === 0) return null;

    const hasWeakImages = highlights.some(h => h.tier === 'weak');

    return (
        <div
            className={cn(
                "grid",
                hasWeakImages ? "grid-cols-3" : "grid-cols-2", // Smaller slots for weak images
                className
            )}
            style={{ gap: 'var(--component-gap)' }}
        >
            {highlights.map((h, i) => (
                <div
                    key={i}
                    className={cn(
                        "p-6 border aspect-square flex flex-col justify-center items-center text-center gap-3 transition-all duration-300",
                        "bg-[var(--callout-bg)] border-[var(--callout-border)] rounded-[var(--radius-card)]",
                        "hover:shadow-[var(--shadow-hover)]"
                    )}
                >
                    <div
                        className="p-3 shadow-[var(--shadow-card)] flex items-center justify-center"
                        style={{
                            background: 'var(--bg-primary)',
                            borderRadius: 'var(--radius-badge)'
                        }}
                    >
                        <Zap className="w-6 h-6 text-[var(--primary)]" />
                    </div>
                    <span
                        className="text-xs font-semibold uppercase tracking-wider leading-tight text-[var(--text-primary)]"
                        style={{ fontFamily: 'var(--body-font)' }}
                    >
                        {h.text}
                    </span>
                </div>
            ))}
        </div>
    );
}
