"use client"

import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BeforeAfterSliderProps {
    beforeImage?: string;
    afterImage?: string;
    beforeLabel?: string;
    afterLabel?: string;
    className?: string;
}

export function BeforeAfterSlider({
    beforeImage = "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=1000",
    afterImage = "https://images.unsplash.com/photo-1556229162-5c63ed9c4ffb?auto=format&fit=crop&q=80&w=1000",
    beforeLabel = "Before",
    afterLabel = "After",
    className
}: BeforeAfterSliderProps) {
    const [sliderPosition, setSliderPosition] = useState(50);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMove = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
        const position = ((x - rect.left) / rect.width) * 100;

        setSliderPosition(Math.max(0, Math.min(100, position)));
    };

    const handleMouseDown = () => {
        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseUp = () => {
        window.removeEventListener('mousemove', handleMove);
        window.removeEventListener('mouseup', handleMouseUp);
    };

    const handleTouchStart = () => {
        window.addEventListener('touchmove', handleMove);
        window.addEventListener('touchend', handleTouchEnd);
    };

    const handleTouchEnd = () => {
        window.removeEventListener('touchmove', handleMove);
        window.removeEventListener('touchend', handleTouchEnd);
    };

    return (
        <div className={cn("bg-[var(--callout-bg)] border border-[var(--callout-border)] rounded-2xl p-6 md:p-10 shadow-[var(--shadow-card)] relative group transition-all duration-500 hover:shadow-[0_0_40px_rgba(var(--primary-rgb),0.1)]", className)}>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--badge-bg)] border border-[var(--callout-border)] rounded-full text-[var(--badge-text)]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Verified Documentation</span>
                        </div>
                        <h3 className="text-3xl font-normal leading-[0.85] tracking-tighter text-[var(--text-primary)]" style={{ fontFamily: 'var(--heading-font)' }}>
                            Clinical Results <br /><span className="italic" style={{ color: 'var(--primary)' }}>& Aftereffects.</span>
                        </h3>
                    </div>
                </div>

                <div
                    ref={containerRef}
                    className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden select-none cursor-ew-resize border border-[var(--callout-border)] shadow-inner"
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleTouchStart}
                >
                    {/* After Image (Background) */}
                    <div
                        className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                        style={{ backgroundImage: `url(${afterImage})` }}
                    />

                    {/* Before Image (Foreground with Clip Path) */}
                    <div
                        className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                        style={{
                            backgroundImage: `url(${beforeImage})`,
                            clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`
                        }}
                    />

                    {/* Divider Line */}
                    <div
                        className="absolute top-0 bottom-0 w-[2px] bg-card/40 backdrop-blur-sm shadow-[0_0_15px_rgba(0,0,0,0.3)] pointer-events-none z-10"
                        style={{ left: `${sliderPosition}%` }}
                    >
                        {/* Handle */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-card/90 backdrop-blur-md rounded-full shadow-2xl flex items-center justify-center border border-white/50 group-active:scale-95 transition-transform duration-200">
                            <div className="flex items-center gap-0.5 text-[var(--text-primary)]">
                                <ChevronLeft className="w-5 h-5" />
                                <ChevronRight className="w-5 h-5" />
                            </div>
                        </div>
                    </div>

                    {/* Before / After Labels */}
                    <div className="absolute bottom-6 left-6 z-20 transition-all duration-300" style={{ opacity: sliderPosition > 15 ? 1 : 0, transform: `translateY(${sliderPosition > 15 ? 0 : 10}px)` }}>
                        <span className="px-5 py-2.5 bg-foreground/60 backdrop-blur-md text-primary-foreground text-[9px] font-black uppercase tracking-[0.2em] rounded-full border border-white/20">
                            {beforeLabel}
                        </span>
                    </div>
                    <div className="absolute bottom-6 right-6 z-20 transition-all duration-300" style={{ opacity: sliderPosition < 85 ? 1 : 0, transform: `translateY(${sliderPosition < 85 ? 0 : 10}px)` }}>
                        <span className="px-5 py-2.5 bg-foreground/60 backdrop-blur-md text-primary-foreground text-[9px] font-black uppercase tracking-[0.2em] rounded-full border border-white/20">
                            {afterLabel}
                        </span>
                    </div>

                    {/* Floating Instruction */}
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
                        <div className="px-4 py-2 bg-card/20 backdrop-blur-md rounded-full border border-white/30 text-primary-foreground text-[8px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            Slide to reveal
                        </div>
                    </div>
                </div>
            </div>

            {/* Beauty Vertical Decoration */}
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-[var(--primary)] opacity-[0.02] rounded-full blur-3xl" />
        </div>
    );
}
