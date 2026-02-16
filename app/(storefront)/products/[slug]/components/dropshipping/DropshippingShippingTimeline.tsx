"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Plane, Package, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DropshippingShippingTimelineProps {
    className?: string;
}

const DROPSHIPPING_STEPS = [
    { title: 'Global Sourcing', desc: 'Direct from Factory', icon: Globe, time: '24-48 Hours' },
    { title: 'Air Express', desc: 'Priority Cargo Lane', icon: Plane, time: '3-5 Days' },
    { title: 'Local Courier', desc: 'Final Mile Delivery', icon: Package, time: '2-3 Days' }
];

export function DropshippingShippingTimeline({ className }: DropshippingShippingTimelineProps) {
    return (
        <div className={cn("p-7 bg-blue-50/50 border border-blue-100 rounded-[2.5rem]", className)}>
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-card rounded-2xl flex items-center justify-center shadow-sm">
                    <Zap className="w-5 h-5 text-primary fill-current" />
                </div>
                <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-foreground">Velocity Tracking</h3>
                    <p className="text-[9px] font-bold text-blue-400 uppercase tracking-tighter">Optimized Supply Chain</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 relative">
                {/* Horizontal Line for Desktop */}
                <div className="hidden md:block absolute top-5 left-8 right-8 h-px bg-blue-100" />

                {DROPSHIPPING_STEPS.map((step, idx) => (
                    <div key={step.title} className="flex-1 relative z-10 flex flex-row md:flex-col items-center gap-4 text-left md:text-center">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="w-10 h-10 bg-card rounded-xl border border-blue-100 flex items-center justify-center shadow-sm text-primary"
                        >
                            <step.icon className="w-5 h-5" />
                        </motion.div>

                        <div className="space-y-1">
                            <h4 className="text-[10px] font-black uppercase tracking-wider text-foreground">{step.title}</h4>
                            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-tight">{step.desc}</p>
                            <span className="block text-[8px] font-black text-primary bg-blue-100/50 px-2 py-0.5 rounded-full mt-2 w-fit md:mx-auto">
                                {step.time}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
