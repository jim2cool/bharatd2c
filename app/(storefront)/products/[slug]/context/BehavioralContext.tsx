"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';
import { SellerModifier } from '@/types/architecture';

interface BehavioralContextType {
    seller: SellerModifier;
}

const BehavioralContext = createContext<BehavioralContextType | null>(null);

export function BehavioralProvider({ seller: initialSeller, children }: { seller: SellerModifier; children: React.ReactNode }) {
    const [seller, setSeller] = useState<SellerModifier>(initialSeller);

    useEffect(() => {
        const handleAdaptivePulse = () => {
            const signalsString = localStorage.getItem('easy_d2c_session_signals');
            if (signalsString) {
                try {
                    const signals = JSON.parse(signalsString);
                    let newSeller = { ...initialSeller };

                    // Adaptive Rule 1: Impulse Buyer (Fast Checkout / Skips Reviews)
                    // Strategy: High Urgency, Dominant CTA, Low Friction Document
                    if ((signals.checkout_time_seconds > 0 && signals.checkout_time_seconds < 45) || signals.no_reviews) {
                        newSeller.urgencyLevel = 'high';
                        newSeller.ctaProminence = 'dominant';
                        newSeller.trustDensity = 'light';
                    }

                    // Adaptive Rule 2: Engaged Shopper (High Time on Page + Reads Reviews)
                    // Strategy: High Trust, Deep Social Proof, Remove False Urgency
                    if (signals.time_on_page_seconds >= 180 && signals.deep_scroll_reviews) {
                        newSeller.urgencyLevel = 'none'; // Back off on urgency
                        newSeller.trustDensity = 'heavy';
                        newSeller.socialProofWeight = 'heavy';
                    }

                    // Adaptive Rule 3: Frustrated Shopper (Rage Clicks)
                    // Strategy: Increase spacing to reduce cognitive load
                    if (signals.rage_clicks) {
                        newSeller.densityScale = 'airy';
                    }

                    setSeller(newSeller);
                } catch (e) { }
            }
        };

        handleAdaptivePulse(); // Initial check
        window.addEventListener('storage', handleAdaptivePulse);

        return () => window.removeEventListener('storage', handleAdaptivePulse);
    }, [initialSeller]);

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
