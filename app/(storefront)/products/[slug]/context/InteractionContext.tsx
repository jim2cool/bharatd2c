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

    // Auto-detect system preference
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setReducedMotion(mediaQuery.matches);

        const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
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
