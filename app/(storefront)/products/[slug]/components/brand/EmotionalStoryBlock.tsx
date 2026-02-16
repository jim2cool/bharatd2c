"use client"

import React from 'react';
import { cn } from '@/lib/utils';

interface EmotionalStoryBlockProps {
    title?: string;
    subtitle?: string;
    content?: string;
    image?: string;
    className?: string;
}

export function EmotionalStoryBlock({
    title = "The Hand that Crafts.",
    subtitle = "Our Philosophy",
    content = "Born from the silence of the mountains, we believe that true value isn't manufactured, it's discovered. Every item reflects a journey of intention and time.",
    image = "https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&auto=format&fit=crop",
    className
}: EmotionalStoryBlockProps) {
    return (
        <div className={cn("py-20 md:py-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center px-6", className)}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-card)]" style={{ boxShadow: 'var(--shadow-hover)' }}>
                <img
                    src={image}
                    alt="Story visual"
                    className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-1000 scale-105 hover:scale-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)]/40 to-transparent" />
            </div>

            <div className="space-y-8 lg:max-w-xl">
                <div className="space-y-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--primary)]">
                        {subtitle}
                    </span>
                    <h2
                        className="text-5xl md:text-7xl font-normal leading-[0.85] tracking-tighter text-[var(--text-primary)]"
                        style={{ fontFamily: 'var(--heading-font)' }}
                    >
                        {title}
                    </h2>
                </div>

                <div className="h-px w-24 bg-[var(--accent-gold)] opacity-40" />

                <p
                    className="text-lg md:text-xl leading-relaxed text-[var(--text-secondary)] font-normal"
                    style={{ fontFamily: 'var(--body-font)' }}
                >
                    {content}
                </p>

                <div className="pt-8">
                    <button className={cn(
                        "text-[10px] font-black uppercase tracking-[0.3em] pb-2 border-b-2 border-[var(--primary)] transition-all hover:pr-8 inline-block",
                        "text-[var(--primary)]"
                    )}>
                        Our Full Narrative
                    </button>
                </div>
            </div>
        </div>
    );
}
