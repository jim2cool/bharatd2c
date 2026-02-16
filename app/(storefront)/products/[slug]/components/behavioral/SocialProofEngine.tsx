"use client"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Users, MapPin, CheckCircle2, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SocialProofEngineProps {
    className?: string;
}

const CITIES = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Surat", "Pune", "Jaipur", "Lucknow"];
const NAMES = ["Rahul", "Priya", "Amit", "Ananya", "Vikram", "Sneha", "Karan", "Ishita", "Arjun", "Tanu"];

export function SocialProofEngine({ className }: SocialProofEngineProps) {
    const [activeToast, setActiveToast] = useState<{ name: string, city: string, time: string } | null>(null);
    const [viewerCount, setViewerCount] = useState(14);

    useEffect(() => {
        const interval = setInterval(() => {
            if (activeToast) {
                setActiveToast(null);
            } else {
                const randomName = NAMES[Math.floor(Math.random() * NAMES.length)];
                const randomCity = CITIES[Math.floor(Math.random() * CITIES.length)];
                setActiveToast({ name: randomName, city: randomCity, time: "just now" });
            }
        }, activeToast ? 5000 : 12000);

        const viewerInterval = setInterval(() => {
            setViewerCount(prev => {
                const change = Math.floor(Math.random() * 5) - 2;
                return Math.max(8, Math.min(45, prev + change));
            });
        }, 8000);

        return () => {
            clearInterval(interval);
            clearInterval(viewerInterval);
        };
    }, [activeToast]);

    return (
        <div className={cn("space-y-4", className)}>
            {/* Viewer Count */}
            <div className="flex items-center gap-3 px-6 py-3 bg-[var(--callout-bg)] border border-[var(--callout-border)] rounded-[var(--radius-badge)] w-fit group hover:shadow-[var(--shadow-hover)] transition-all duration-500">
                <div className="relative">
                    <Users className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--primary)] transition-colors" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-[var(--primary)] rounded-full border border-[var(--bg-primary)] animate-pulse" />
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-primary)]">
                    <span className="tabular-nums">{viewerCount}</span> people viewing right now
                </span>
            </div>

            {/* Sales Pulse Toast */}
            <AnimatePresence mode='wait'>
                {activeToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-[var(--radius-card)] p-5 shadow-[var(--shadow-card)] flex items-center gap-4 max-w-sm pointer-events-none"
                    >
                        <div className="w-12 h-12 bg-[var(--badge-bg)] rounded-[var(--radius-image)] flex items-center justify-center shrink-0">
                            <ShoppingBag className="w-6 h-6 text-[var(--badge-text)]" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                                <MapPin className="w-3 h-3 text-[var(--text-secondary)]" />
                                <span className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[var(--text-secondary)]">{activeToast.city}, IN</span>
                            </div>
                            <p className="text-[11px] leading-tight font-semibold text-[var(--text-primary)] truncate">
                                {activeToast.name} <span className="text-[var(--text-secondary)] font-normal uppercase tracking-tight">ordered this {activeToast.time}</span>
                            </p>
                        </div>

                        <div className="shrink-0 flex items-center gap-1 px-2 py-1 bg-[var(--badge-bg)] rounded-[var(--radius-badge)] border border-[var(--callout-border)]">
                            <CheckCircle2 className="w-2.5 h-2.5 text-[var(--badge-text)]" />
                            <span className="text-[8px] font-semibold uppercase tracking-widest text-[var(--badge-text)]">Verified</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mini Trust Bar */}
            <div className="flex items-center gap-6 pt-2">
                {[
                    { label: "10k+ Orders", icon: ShoppingBag },
                    { label: "4.9 Rating", icon: Heart }
                ].map((item, id) => {
                    const Icon = item.icon;
                    return (
                        <div key={id} className="flex items-center gap-1.5">
                            <Icon className="w-3 h-3 text-[var(--primary)] opacity-60" />
                            <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--text-secondary)]">{item.label}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
