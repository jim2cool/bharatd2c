"use client"

import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
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
        <div
            ref={containerRef}
            className={cn(
                "relative w-full aspect-[4/3] rounded-[2.5rem] overflow-hidden select-none cursor-ew-resize border border-neutral-100 shadow-sm",
                className
            )}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
        >
            {/* After Image (Background) */}
            <div
                className="absolute inset-0 w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${afterImage})` }}
            />

            {/* Before Image (Foreground with Clip Path) */}
            <div
                className="absolute inset-0 w-full h-full bg-cover bg-center"
                style={{
                    backgroundImage: `url(${beforeImage})`,
                    clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`
                }}
            />

            {/* Divider Line */}
            <div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-lg pointer-events-none z-10"
                style={{ left: `${sliderPosition}%` }}
            >
                {/* Handle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-white">
                    <div className="flex items-center gap-0.5 text-neutral-400">
                        <ChevronLeft className="w-4 h-4" />
                        <ChevronRight className="w-4 h-4" />
                    </div>
                </div>
            </div>

            {/* Labels */}
            <div className="absolute bottom-6 left-6 z-20 transition-opacity duration-300" style={{ opacity: sliderPosition > 10 ? 1 : 0 }}>
                <span className="px-4 py-2 bg-black/40 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-full border border-white/20">
                    {beforeLabel}
                </span>
            </div>
            <div className="absolute bottom-6 right-6 z-20 transition-opacity duration-300" style={{ opacity: sliderPosition < 90 ? 1 : 0 }}>
                <span className="px-4 py-2 bg-black/40 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-full border border-white/20">
                    {afterLabel}
                </span>
            </div>

            {/* Instruction Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-xl border border-neutral-100 flex items-center gap-3 animate-bounce shadow-orange-500/10">
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-900">Drag to Compare Results</span>
                </div>
            </div>
        </div>
    );
}
