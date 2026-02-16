"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Award, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AuthenticityNarrativeProps {
    origin?: string;
    artisan?: string;
    story?: string;
    materials?: string[];
    className?: string;
}

export function AuthenticityNarrative({
    origin = "Varanasi, India",
    artisan = "Kashyap Weaver's Guild",
    story = "Every weave carries within it the echo of a thousand-year-old tradition. Hand-loomed under the lunar cycle, this piece is not merely textile but a fragment of history, blessed by the Ganges.",
    materials = ["Hand-spun Mulberry Silk", "Pure Silver Zari", "Natural Indigo Dye"],
    className
}: AuthenticityNarrativeProps) {
    return (
        <div className={cn("group w-full space-y-16", className)}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
                <div className="lg:col-span-7 space-y-8">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-3 px-6 py-2 border"
                        style={{ background: 'var(--badge-bg)', borderColor: 'var(--border)', borderRadius: 'var(--radius-badge)' }}>
                        <Award className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                        <span className="text-[10px] font-semibold uppercase tracking-[0.2em]"
                            style={{ color: 'var(--badge-text)' }}>Verified Origin &amp; Heritage</span>
                    </div>

                    <h2 className="text-5xl lg:text-7xl font-semibold italic tracking-tighter leading-[0.9]"
                        style={{ fontFamily: 'var(--heading-font)', color: 'var(--text-primary)' }}>
                        Crafted at the <br />
                        <span style={{ color: 'var(--text-secondary)' }}>Source of Being.</span>
                    </h2>

                    <p className="text-xl lg:text-2xl font-medium leading-relaxed max-w-2xl"
                        style={{ color: 'var(--text-secondary)' }}>
                        {story}
                    </p>
                </div>

                <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                    {/* Origin card — callout-bg */}
                    <div className="aspect-[4/5] p-8 flex flex-col justify-between overflow-hidden relative border"
                        style={{ background: 'var(--callout-bg)', borderColor: 'var(--callout-border)', borderRadius: 'var(--radius-card)' }}>
                        <MapPin className="w-8 h-8 mb-8" style={{ color: 'var(--text-secondary)' }} />
                        <div>
                            <span className="block text-[10px] font-semibold uppercase tracking-widest mb-1"
                                style={{ color: 'var(--text-secondary)' }}>Geographic Origin</span>
                            <span className="text-lg font-semibold"
                                style={{ color: 'var(--text-primary)' }}>{origin}</span>
                        </div>
                    </div>
                    {/* Artisan card — primary (dark) */}
                    <div className="aspect-[4/5] p-8 flex flex-col justify-between"
                        style={{ background: 'var(--primary)', color: 'var(--primary-foreground)', borderRadius: 'var(--radius-card)' }}>
                        <Award className="w-8 h-8 mb-8 opacity-40" />
                        <div>
                            <span className="block text-[10px] font-semibold uppercase tracking-widest opacity-40 mb-1">Master Artisan</span>
                            <span className="text-lg font-semibold">{artisan}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Materials grid */}
            <div className="pt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
                style={{ borderTop: '1px solid var(--border)' }}>
                {materials.map((m, i) => (
                    <div key={i} className="space-y-3">
                        <div className="w-12 h-px" style={{ background: 'var(--primary)' }} />
                        <div>
                            <span className="block text-[10px] font-semibold uppercase tracking-widest mb-1"
                                style={{ color: 'var(--text-secondary)' }}>Material 0{i + 1}</span>
                            <span className="text-xs font-semibold"
                                style={{ color: 'var(--text-primary)' }}>{m}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Hero image */}
            <div className="relative h-[400px] lg:h-[600px] overflow-hidden"
                style={{ borderRadius: 'var(--radius-card)' }}>
                <img
                    src="https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&q=80&w=2000"
                    alt="Artisan Workspace"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-12 lg:p-20">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 backdrop-blur-xl border border-white/20 flex items-center justify-center"
                            style={{ borderRadius: 'var(--radius-badge)', background: 'rgba(255,255,255,0.1)' }}>
                            <Heart className="w-8 h-8 text-primary-foreground fill-white" />
                        </div>
                        <div className="text-primary-foreground">
                            <span className="block text-sm font-semibold italic tracking-widest uppercase mb-1">Social Impact</span>
                            <p className="text-2xl font-semibold leading-tight max-w-sm">Every purchase supports 12 weaving families in the holy city.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
