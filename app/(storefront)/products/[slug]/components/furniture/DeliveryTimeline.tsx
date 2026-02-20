"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Package, Hammer, Calendar, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeliveryTimelineProps {
    className?: string;
}

const MILESTONES = [
    { title: 'Processing', desc: 'Sourced from Premium Workshop', icon: Package, days: '2-3 Days', active: true },
    { title: 'Quality Check', desc: 'Finished & Structural Audit', icon: CheckCircle2, days: 'Day 4', active: false },
    { title: 'Transit', desc: 'Secure Large-Format Cargo', icon: Truck, days: '5-7 Days', active: false },
    { title: 'In-Room Setup', desc: 'Placement & Unboxing', icon: Hammer, days: 'On Delivery', active: false }
];

export function DeliveryTimeline({ className }: DeliveryTimelineProps) {
    return (
        <div className={cn("p-8 bg-white border border-neutral-100 rounded-[3rem] shadow-sm", className)}>
            <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                    <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        Logistics Flow
                    </h3>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-tight">White-Glove Service Guarantee</p>
                </div>
            </div>

            <div className="relative">
                {/* Connector Line */}
                <div className="absolute left-[23px] top-6 bottom-6 w-[2px] bg-neutral-100" />

                <div className="space-y-8">
                    {MILESTONES.map((step, idx) => (
                        <div key={step.title} className="relative flex gap-6">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center relative z-10 transition-colors duration-500",
                                    step.active ? "bg-primary text-white shadow-xl shadow-primary/20" : "bg-neutral-50 text-neutral-300 border border-neutral-100"
                                )}
                            >
                                <step.icon className="w-5 h-5" />
                            </motion.div>

                            <div className="flex flex-col justify-center">
                                <div className="flex items-center gap-3">
                                    <span className={cn("text-xs font-black uppercase tracking-wider", step.active ? "text-neutral-900" : "text-neutral-400")}>
                                        {step.title}
                                    </span>
                                    <span className="text-[9px] font-black bg-neutral-100 px-2 py-0.5 rounded text-neutral-400 uppercase tracking-tighter">
                                        {step.days}
                                    </span>
                                </div>
                                <p className="text-[11px] text-neutral-400 font-medium leading-relaxed mt-0.5">
                                    {step.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-8 pt-8 border-t border-neutral-50 flex items-center gap-4">
                <div className="p-3 bg-green-50 rounded-xl">
                    <Truck className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-[10px] font-bold text-neutral-500 leading-normal uppercase">
                    Professional installation included. Our team will handle unboxing and placement in your room of choice.
                </p>
            </div>
        </div>
    );
}
