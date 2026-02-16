"use client"

import React, { createContext, useContext, useEffect, useRef } from 'react';

// --- Types ---
type SignalType = 'velocity' | 'scroll-depth' | 'idle' | 'rage-click' | 'copy-title' | 'time-on-page' | 'review-dwell';

interface SignalState {
    mouseVelocity: number;
    scrollDepth: number;
    isIdle: boolean;
    rageClickCount: number;
    timeOnPage: number; // in seconds
    reviewDwellTime: number; // in seconds
}

interface SignalContextType {
    subscribe: (signal: SignalType, callback: (value: any) => void) => () => void;
    getSnapshot: () => SignalState;
    capture: () => void;
}

const SignalContext = createContext<SignalContextType | undefined>(undefined);

// --- Constants ---
const IDLE_THRESHOLD = 5000; // 5 seconds
const VELOCITY_CHECK_INTERVAL = 100;
const RAGE_CLICK_THRESHOLD = 3; // 3 clicks in...
const RAGE_CLICK_TIME = 800; // ...800ms
const PERSISTENCE_KEY = 'easy_d2c_behavioral_profile';

export function SignalProvider({ children }: { children: React.ReactNode }) {
    // 1. Mutable State (Refs to avoid re-renders)
    const state = useRef<SignalState>({
        mouseVelocity: 0,
        scrollDepth: 0,
        isIdle: false,
        rageClickCount: 0,
        timeOnPage: 0,
        reviewDwellTime: 0
    });

    const listeners = useRef<Map<SignalType, Set<(val: any) => void>>>(new Map());
    const lastMousePos = useRef({ x: 0, y: 0, time: 0 });
    const idleTimer = useRef<NodeJS.Timeout | null>(null);
    const clickHistory = useRef<number[]>([]);
    const startTime = useRef<number>(Date.now());

    // --- Pub/Sub System ---
    const subscribe = (signal: SignalType, callback: (val: any) => void) => {
        if (!listeners.current.has(signal)) {
            listeners.current.set(signal, new Set());
        }
        listeners.current.get(signal)?.add(callback);
        return () => listeners.current.get(signal)?.delete(callback);
    };

    const emit = (signal: SignalType, value: any) => {
        listeners.current.get(signal)?.forEach(cb => cb(value));
    };

    // --- Persistence & Capture ---
    const capture = () => {
        if (typeof window === 'undefined') return;
        const profile = {
            ...state.current,
            capturedAt: new Date().toISOString(),
            userAgent: navigator.userAgent
        };
        sessionStorage.setItem(PERSISTENCE_KEY, JSON.stringify(profile));
    };

    // --- Tracking Logic ---

    // 1. Mouse Velocity & Idle
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const now = Date.now();
            const dt = now - lastMousePos.current.time;

            // Reset Idle
            if (state.current.isIdle) {
                state.current.isIdle = false;
                emit('idle', false);
            }
            if (idleTimer.current) clearTimeout(idleTimer.current);
            idleTimer.current = setTimeout(() => {
                state.current.isIdle = true;
                emit('idle', true);
            }, IDLE_THRESHOLD);

            // Calculate Velocity (pixels/ms)
            if (dt > VELOCITY_CHECK_INTERVAL) {
                const dx = e.clientX - lastMousePos.current.x;
                const dy = e.clientY - lastMousePos.current.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const velocity = distance / dt;

                state.current.mouseVelocity = velocity;
                emit('velocity', velocity);

                lastMousePos.current = { x: e.clientX, y: e.clientY, time: now };
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (idleTimer.current) clearTimeout(idleTimer.current);
        };
    }, []);

    // 2. Scroll Depth & Review Dwell
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const depth = scrollTop / docHeight;
            state.current.scrollDepth = depth;
            emit('scroll-depth', depth);

            // Special: Review Dwell (heuristic: if scrolled near reviews zone)
            // Assuming reviews are in the bottom 30% of the page
            if (depth > 0.7) {
                // This will be incremented by the interval timer if user stays here
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 3. Rage Clicks & Copy Title
    useEffect(() => {
        const handleClick = () => {
            const now = Date.now();
            clickHistory.current = clickHistory.current.filter(t => now - t < RAGE_CLICK_TIME);
            clickHistory.current.push(now);

            if (clickHistory.current.length >= RAGE_CLICK_THRESHOLD) {
                state.current.rageClickCount++;
                emit('rage-click', state.current.rageClickCount);
                clickHistory.current = [];
            }
        };

        const handleCopy = () => {
            const selection = window.getSelection()?.toString();
            if (selection && selection.length > 3) {
                emit('copy-title', selection);
            }
        }

        window.addEventListener('click', handleClick);
        window.addEventListener('copy', handleCopy);
        return () => {
            window.removeEventListener('click', handleClick);
            window.removeEventListener('copy', handleCopy);
        }
    }, []);

    // 4. Time Emittance & Dwell Accumulator
    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            const elapsed = Math.floor((now - startTime.current) / 1000);
            state.current.timeOnPage = elapsed;
            emit('time-on-page', elapsed);

            // If user is scrolled down significantly, accumulate review dwell
            if (state.current.scrollDepth > 0.7 && !state.current.isIdle) {
                state.current.reviewDwellTime += 1;
                emit('review-dwell', state.current.reviewDwellTime);
            }

            // Auto-capture every 5 seconds to ensure snapshot is fresh if session ends abruptly
            if (elapsed % 5 === 0) {
                capture();
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <SignalContext.Provider value={{ subscribe, getSnapshot: () => state.current, capture }}>
            {children}
        </SignalContext.Provider>
    );
}

export const useSignals = () => {
    const context = useContext(SignalContext);
    if (!context) throw new Error("useSignals must be used within SignalProvider");
    return context;
};
