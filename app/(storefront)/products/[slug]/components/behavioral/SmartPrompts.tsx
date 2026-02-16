"use client"

import React, { useEffect, useState } from 'react';
import { useSignals } from '../../context/SignalContext';
import { AnimatePresence, motion } from 'framer-motion';
import { Zap, Truck, Tag } from 'lucide-react';
import { toast } from 'sonner';

export function SmartPrompts() {
    const { subscribe } = useSignals();
    const [showIdleNudge, setShowIdleNudge] = useState(false);

    useEffect(() => {
        // 1. Idle Signal -> Free Shipping Nudge
        const unsubIdle = subscribe('idle', (isIdle: boolean) => {
            if (isIdle) {
                // Only show if we haven't shown it recently (simple session cap)
                const hasShown = sessionStorage.getItem('nudge-shown-idle');
                if (!hasShown) {
                    setShowIdleNudge(true);
                    sessionStorage.setItem('nudge-shown-idle', 'true');

                    // Auto-hide after 5s
                    setTimeout(() => setShowIdleNudge(false), 5000);
                }
            }
        });

        // 2. High Velocity + Stop -> Urgency Pulse
        // (This logic handles "stopping" after fast movement)
        const unsubVelocity = subscribe('velocity', (v: number) => {
            if (v > 2.5) { // Fast movement
                // If they stop suddenly, they found something interesting
                // usage: We can emit a custom event or update a local state to trigger pulse elsewhere
                // For now, let's just log or trigger a toast if it's extreme
            }
        });

        // 3. Rage Click -> Support Nudge
        const unsubRage = subscribe('rage-click', (count: number) => {
            if (count === 1) { // On first rage-click trigger
                toast.custom((t) => (
                    <div className="bg-card p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-border">
                        <div className="p-2 bg-blue-50 text-primary rounded-full"><Zap className="w-4 h-4" /></div>
                        <div className="text-xs font-medium">
                            Need help? <button className="underline font-bold" onClick={() => toast.dismiss(t)}>Chat with us</button>
                        </div>
                    </div>
                ), { duration: 4000 });
            }
        });

        return () => {
            unsubIdle();
            unsubVelocity();
            unsubRage();
        };
    }, [subscribe]);

    return (
        <AnimatePresence>
            {showIdleNudge && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="fixed bottom-24 right-4 md:right-8 z-50 max-w-xs"
                >
                    <div className="bg-neutral-900 text-primary-foreground p-4 rounded-2xl shadow-2xl flex items-center gap-4">
                        <div className="p-2 bg-card/10 rounded-full animate-pulse">
                            <Tag className="w-5 h-5 text-yellow-400" />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Limited Offer</p>
                            <p className="text-sm font-bold">Free Shipping active for 10m!</p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
