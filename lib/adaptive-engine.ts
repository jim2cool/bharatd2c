import { useState, useEffect } from 'react';

export type SessionSignals = {
    deep_scroll_reviews: boolean;
    time_on_page_seconds: number;
    checkout_time_seconds: number;
    rage_clicks: boolean;
    no_reviews: boolean;
    returning_visitor: boolean;
    vpn_proxy: boolean;
    diff_phone_same_device: boolean;
};

const STORAGE_KEY = 'easy_d2c_session_signals';

export function getSessionSignals(): SessionSignals {
    if (typeof window === 'undefined') {
        return {
            deep_scroll_reviews: false,
            time_on_page_seconds: 0,
            checkout_time_seconds: 0,
            rage_clicks: false,
            no_reviews: true,
            returning_visitor: false,
            vpn_proxy: false,
            diff_phone_same_device: false
        };
    }

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error('Failed to parse session signals');
        }
    }

    return {
        deep_scroll_reviews: false,
        time_on_page_seconds: 0,
        checkout_time_seconds: 0,
        rage_clicks: false,
        no_reviews: true,
        returning_visitor: false,
        vpn_proxy: false,
        diff_phone_same_device: false
    };
}

export function updateSessionSignal(signal: Partial<SessionSignals>) {
    const current = getSessionSignals();
    const updated = { ...current, ...signal };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

// Hook to track signals in real-time
export function useAdaptiveTracking() {
    useEffect(() => {
        if (typeof window === 'undefined') return;

        // 1. Returning Visitor Check
        const visitCount = parseInt(localStorage.getItem('visit_count') || '0');
        if (visitCount > 0) {
            updateSessionSignal({ returning_visitor: true });
        }
        localStorage.setItem('visit_count', (visitCount + 1).toString());

        // 2. Time on Page
        const startTime = Date.now();
        const timer = setInterval(() => {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            updateSessionSignal({ time_on_page_seconds: elapsed });
        }, 5000);

        // 3. Rage Clicks Detection
        let clicks: number[] = [];
        const handleRageClick = (e: MouseEvent) => {
            const now = Date.now();
            clicks = clicks.filter(t => now - t < 1000); // Last 1 second
            clicks.push(now);
            if (clicks.length > 5) {
                updateSessionSignal({ rage_clicks: true });
            }
        };

        window.addEventListener('click', handleRageClick);

        return () => {
            clearInterval(timer);
            window.removeEventListener('click', handleRageClick);
        };
    }, []);
}

/**
 * Computes the net RTO session modifier for the Supabase trigger.
 *
 * Applies Bible spec weights to the signals tracked by the Adaptive Engine
 * and returns a pre-aggregated integer. The trigger adds this directly to
 * the composite RTO score — no further computation needed on the DB side.
 *
 * Positive values → riskier session (impulse buyer patterns)
 * Negative values → safer session (engaged shopper patterns)
 */
export function getSessionRTOModifier(): number {
    const signals = getSessionSignals();
    let modifier = 0;

    // Risk signals (positive modifiers)
    if (signals.checkout_time_seconds > 0 && signals.checkout_time_seconds < 45) {
        modifier += 20; // Checkout in under 45 seconds
    }
    if (signals.no_reviews) {
        modifier += 10; // No review section interaction
    }
    if (signals.rage_clicks) {
        modifier += 15; // Rage clicks detected
    }

    // Trust signals (negative modifiers)
    if (signals.returning_visitor) {
        modifier -= 20; // Returning visitor (2+ sessions)
    }
    if (signals.time_on_page_seconds >= 180 && signals.deep_scroll_reviews) {
        modifier -= 15; // 3+ minutes on page with deep scroll
    }
    if (signals.deep_scroll_reviews) {
        modifier -= 10; // Review section dwell 30s+
    }

    return modifier;
}
