"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { Hammer, Clock, Star, AlertCircle, CheckCircle2, FileText, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GuideStep {
    title: string;
    desc: string;
}

interface InstallationGuideProps {
    steps?: GuideStep[];
    tools?: string[];
    difficulty?: 'Easy' | 'Moderate' | 'Pro';
    time?: string;
    className?: string;
}

const DEFAULT_STEPS: GuideStep[] = [
    { title: "Clear Path", desc: "Ensure a minimum clearance of 20cm around all cabinet edges for optimal airflow." },
    { title: "Level Check", desc: "Use a spirit level to ensure the base is perfectly horizontal before securing." },
    { title: "Fixed Anchor", desc: "Apply the provided anti-tip bracket to the rear support beam." },
    { title: "Final Seal", desc: "Apply silicone sealant to the joint interface for a water-tight finish." }
];

export function InstallationGuide({
    steps = DEFAULT_STEPS,
    guide, // New prop
    tools = ["Cordless Drill", "Spirit Level", "6mm Masonry Bit", "Sealant Gun"],
    difficulty = 'Moderate',
    time = '45 mins',
    className
}: InstallationGuideProps & { guide?: string }) {

    const parsedSteps = React.useMemo(() => {
        if (!guide) return steps;

        // Parse newline separated "Title: Description"
        return guide.split('\n').map(line => {
            const [title, desc] = line.split(':').map(s => s.trim());
            if (title && desc) return { title, desc };
            if (title) return { title: 'Step', desc: title };
            return null;
        }).filter(Boolean) as GuideStep[];
    }, [guide, steps]);
    return (
        <div className={cn("bg-neutral-50 border border-neutral-100 rounded-[3rem] p-10 md:p-14 shadow-sm", className)}>
            <div className="flex flex-col lg:flex-row gap-16">
                <div className="lg:w-80 shrink-0 space-y-10">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Hammer className="w-5 h-5 text-neutral-400" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Setup Protocol</span>
                        </div>
                        <h2 className="text-3xl font-black italic tracking-tighter text-neutral-900 mb-2">Build Guide.</h2>
                        <p className="text-sm font-bold text-neutral-500 uppercase tracking-widest leading-relaxed">Systematic instructions for permanent installation.</p>
                    </div>

                    <div className="space-y-4">
                        <div className="p-6 bg-white rounded-3xl border border-neutral-100 flex items-center justify-between">
                            <div>
                                <span className="block text-[9px] font-black uppercase tracking-widest text-neutral-400 mb-1">Complexity</span>
                                <div className="flex items-center gap-1.5">
                                    <Star className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
                                    <span className="text-xs font-black uppercase">{difficulty}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="block text-[9px] font-black uppercase tracking-widest text-neutral-400 mb-1">Est. Time</span>
                                <span className="text-xs font-black uppercase">{time}</span>
                            </div>
                        </div>

                        <div className="p-8 bg-neutral-900 rounded-[2.5rem] text-white">
                            <span className="block text-[9px] font-black uppercase tracking-widest opacity-40 mb-6">Tools Required</span>
                            <div className="space-y-4">
                                {tools.map((tool, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/80">{tool}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button className="w-full py-5 bg-primary text-white rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20">
                        <FileText className="w-4 h-4" />
                        <span className="text-[11px] font-black uppercase tracking-widest">Download PDF Manual</span>
                    </button>
                </div>

                <div className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {parsedSteps.map((step, idx) => (
                            <div key={idx} className="group relative pt-10">
                                <div className="absolute top-0 left-0 text-7xl font-black text-neutral-100 transition-colors group-hover:text-neutral-200 select-none">
                                    0{idx + 1}
                                </div>
                                <div className="relative z-10 space-y-3">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-neutral-900 flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                        {step.title}
                                    </h3>
                                    <p className="text-sm font-medium text-neutral-500 leading-relaxed pr-8">
                                        {step.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 relative aspect-video rounded-[3rem] overflow-hidden bg-white border border-neutral-100 shadow-2xl group/video">
                        <img
                            src="https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=1000"
                            alt="Watch Installation"
                            className="w-full h-full object-cover grayscale group-hover/video:grayscale-0 group-hover/video:scale-105 transition-all duration-1000"
                        />
                        <div className="absolute inset-0 bg-neutral-900/40 flex items-center justify-center group-hover/video:bg-neutral-900/20 transition-all">
                            <button className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-90 transition-all">
                                <Play className="w-8 h-8 fill-neutral-900 text-neutral-900 ml-1" />
                            </button>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-8 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-white">Video Walkthrough (3:45)</span>
                            </div>
                            <span className="text-[9px] font-bold text-white/60 uppercase tracking-widest">v1.2 REV-B</span>
                        </div>
                    </div>

                    <div className="mt-8 flex items-center gap-3 text-rose-500 bg-rose-50 p-4 rounded-2xl border border-rose-100">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span className="text-[10px] font-black uppercase tracking-tight">Warning: High voltage components. Professional electrical install recommended.</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
