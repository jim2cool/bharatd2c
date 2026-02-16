"use client"

import { useEffect } from 'react';
import { useSignals } from '../../context/SignalContext';
import { useAdaptiveTracking } from '@/lib/adaptive-engine';

/**
 * BehavioralTracker (Headless)
 * Bridges the gap between SignalContext (tracking) and persistence (sessionStorage).
 * Ensures a snapshot is taken before checkout or session termination.
 */
export function BehavioralTracker() {
    const { capture } = useSignals();

    // Mount the Adaptive Engine Session Signal tracker globally
    useAdaptiveTracking();

    useEffect(() => {
        // 1. Capture on unmount (page transition within SPA)
        return () => {
            capture();
        };
    }, [capture]);

    useEffect(() => {
        // 2. Capture on beforeunload (browser close/refresh)
        const handleBeforeUnload = () => {
            capture();
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [capture]);

    // This component renders nothing
    return null;
}
