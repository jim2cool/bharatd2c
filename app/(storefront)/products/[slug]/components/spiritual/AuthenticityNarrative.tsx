"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { Globe, MapPin, Award, Heart } from 'lucide-react';
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
                    <div className="inline-flex items-center gap-3 px-6 py-2 bg-neutral-100 rounded-full border border-neutral-200">
                        <Award className="w-4 h-4 text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-800">Verified Origin & Heritage</span>
                    </div>

                    <h2 className="text-5xl lg:text-7xl font-black italic tracking-tighter text-neutral-900 leading-[0.9]">
                        Crafted at the <br />
                        <span className="text-stone-400">Source of Being.</span>
                    </h2>

                    <p className="text-xl lg:text-2xl text-neutral-600 font-medium leading-relaxed max-w-2xl">
                        {story}
                    </p>
                </div>

                <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                    <div className="aspect-[4/5] bg-stone-100 rounded-[3rem] p-8 flex flex-col justify-between overflow-hidden relative">
                        <MapPin className="w-8 h-8 text-stone-300 mb-8" />
                        <div>
                            <span className="block text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">Geographic Origin</span>
                            <span className="text-lg font-black text-stone-900">{origin}</span>
                        </div>
                        {/* Abstract map texture would go here */}
                    </div>
                    <div className="aspect-[4/5] bg-neutral-900 rounded-[3rem] p-8 flex flex-col justify-between text-white">
                        <Award className="w-8 h-8 text-neutral-700 mb-8" />
                        <div>
                            <span className="block text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Master Artisan</span>
                            <span className="text-lg font-black">{artisan}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-16 border-t border-neutral-100 grid grid-cols-2 md:grid-cols-4 gap-8">
                {materials.map((m, i) => (
                    <div key={i} className="space-y-3">
                        <div className="w-12 h-px bg-primary" />
                        <div>
                            <span className="block text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Material 0{i + 1}</span>
                            <span className="text-xs font-black text-neutral-900">{m}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="relative h-[400px] lg:h-[600px] rounded-[4rem] overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&q=80&w=2000"
                    alt="Artisan Workspace"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-12 lg:p-20">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center">
                            <Heart className="w-8 h-8 text-white fill-white" />
                        </div>
                        <div className="text-white">
                            <span className="block text-sm font-black italic tracking-widest uppercase mb-1">Social Impact</span>
                            <p className="text-2xl font-black leading-tight max-w-sm">Every purchase supports 12 weaving families in the holy city.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
