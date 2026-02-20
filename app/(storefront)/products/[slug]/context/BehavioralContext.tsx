"use client"

import React, { createContext, useContext } from 'react';
import { SellerModifier } from '@/types/architecture';

interface BehavioralContextType {
    seller: SellerModifier;
}

const BehavioralContext = createContext<BehavioralContextType | null>(null);

export function BehavioralProvider({ seller, children }: { seller: SellerModifier; children: React.ReactNode }) {
    return (
        <BehavioralContext.Provider value={{ seller }}>
            <div
                style={{
                    // Broadcast behavioral settings as CSS variables for deep styling
                    '--cta-scale': seller.ctaProminence === 'dominant' ? '1.05' : '1',
                    '--trust-opacity': seller.trustDensity === 'light' ? '0.6' : '1',
                    '--density-gap': seller.densityScale === 'airy' ? '2.5rem' : seller.densityScale === 'compact' ? '1rem' : '1.5rem'
                } as React.CSSProperties}
            >
                {children}
            </div>
        </BehavioralContext.Provider>
    );
}

export function useBehavioral() {
    const context = useContext(BehavioralContext);
    if (!context) throw new Error('useBehavioral must be used within BehavioralProvider');
    return context;
}
