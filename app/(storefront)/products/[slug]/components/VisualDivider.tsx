"use client"

import React from 'react';
import { usePDP } from '../context/PDPContext';

export function VisualDivider() {
    const { storeConfig } = usePDP();
    const moodCard = storeConfig?.mood_card_selected?.toLowerCase() || '';

    if (['sleek', 'industrial'].includes(moodCard)) {
        return (
            <div className="w-full flex items-center gap-2 opacity-20 py-4">
                <div className="h-px flex-1 bg-[var(--border)]" />
                <div className="flex gap-1">
                    <div className="w-1 h-1 rounded-full bg-[var(--text-primary)]" />
                    <div className="w-4 h-1 rounded-full bg-[var(--text-primary)]" />
                    <div className="w-1 h-1 rounded-full bg-[var(--text-primary)]" />
                </div>
                <div className="h-px flex-1 bg-[var(--border)]" />
            </div>
        );
    }

    if (['luxury', 'quiet luxury'].includes(moodCard)) {
        return (
            <div className="w-full flex flex-col gap-[2px] py-6">
                <div className="h-[0.5px] w-full bg-[var(--primary)] opacity-30" />
            </div>
        );
    }

    if (moodCard === 'spiritual') {
        return (
            <div className="w-full flex flex-col gap-[2px] py-6">
                <div className="h-[0.5px] w-full bg-[var(--primary)] opacity-20" />
            </div>
        );
    }

    if (['heritage', 'earth'].includes(moodCard)) {
        return (
            <div className="w-full mt-2 py-8 flex flex-col gap-4">
                <div className="h-px w-full bg-[var(--border)]" />
                <div className="opacity-10 overflow-hidden">
                    <svg width="100%" height="20" viewBox="0 0 1200 20" preserveAspectRatio="none">
                        <path
                            d="M0,10 C150,20 350,0 500,10 C650,20 850,0 1000,10 C1150,20 1350,0 1500,10"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                            strokeDasharray="5,5"
                        />
                    </svg>
                </div>
            </div>
        );
    }

    if (['bold', 'gourmet', 'fresh', 'vibrant', 'playful'].includes(moodCard)) {
        return null; // High-energy cards often rely on color-blocked sections rather than dividers
    }

    // Default clean/clinical/botanical divider
    return <div className="w-full h-px bg-[var(--border)] my-4" />;
}
