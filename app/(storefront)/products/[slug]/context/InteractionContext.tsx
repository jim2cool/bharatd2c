"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';
import { MotionConfig } from 'framer-motion';

interface InteractionContextType {
    reducedMotion: boolean;
    setReducedMotion: (value: boolean) => void;
}

const InteractionContext = createContext<InteractionContextType | undefined>(undefined);

export function InteractionProvider({ children }: { children: React.ReactNode }) {
    const [reducedMotion, setReducedMotion] = useState(false);

    // Auto-detect system preference and Behavioral Signals
    useEffect(() => {
        // 1. System Preference
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        let baseReducedMotion = mediaQuery.matches;

        // 2. Adaptive Engine Signal Overrides
        const handleAdaptivePulse = () => {
            const signals = localStorage.getItem('easy_d2c_session_signals');
            if (signals) {
                try {
                    const parsed = JSON.parse(signals);
                    // Mute animations immediately if user is exhibiting high-friction behavior
                    if (parsed.rage_clicks) {
                        baseReducedMotion = true;
                    }
                } catch (e) { }
            }
            setReducedMotion(baseReducedMotion);
        };

        handleAdaptivePulse(); // Initial check

        // We could poll or listen for storage events, but simple re-eval on mount/changes is the safest starting point for Phase 1.
        window.addEventListener('storage', handleAdaptivePulse);

        const handleChange = (e: MediaQueryListEvent) => {
            baseReducedMotion = e.matches;
            handleAdaptivePulse(); // Re-apply overrides on top of system change
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => {
            mediaQuery.removeEventListener('change', handleChange);
            window.removeEventListener('storage', handleAdaptivePulse);
        };
    }, []);

    return (
        <InteractionContext.Provider value={{ reducedMotion, setReducedMotion }}>
            {/* Global Motion Config - can be tweaked per preset later */}
            <MotionConfig reducedMotion="user">
                {children}
            </MotionConfig>
        </InteractionContext.Provider>
    );
}

export function useInteraction() {
    const context = useContext(InteractionContext);
    if (!context) {
        throw new Error('useInteraction must be used within an InteractionProvider');
    }
    return context;
}
