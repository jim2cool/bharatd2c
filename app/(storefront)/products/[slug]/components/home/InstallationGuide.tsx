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
    guide,
    tools = ["Cordless Drill", "Spirit Level", "6mm Masonry Bit", "Sealant Gun"],
    difficulty = 'Moderate',
    time = '45 mins',
    className
}: InstallationGuideProps & { guide?: string }) {

    const parsedSteps = React.useMemo(() => {
        if (!guide) return steps;

        return guide.split('\n').map(line => {
            const [title, desc] = line.split(':').map(s => s.trim());
            if (title && desc) return { title, desc };
            if (title) return { title: 'Step', desc: title };
            return null;
        }).filter(Boolean) as GuideStep[];
    }, [guide, steps]);

    return (
        <div className={cn("bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[var(--radius-card)] p-10 md:p-14 shadow-[var(--shadow-card)]", className)}>
            <div className="flex flex-col lg:flex-row gap-16">
                <div className="lg:w-80 shrink-0 space-y-10">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Hammer className="w-5 h-5 text-[var(--text-secondary)]" />
                            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--text-secondary)]">Setup Protocol</span>
                        </div>
                        <h2 className="text-3xl font-bold italic tracking-tighter text-[var(--text-primary)] mb-2">Build Guide.</h2>
                        <p className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-widest leading-relaxed">Systematic instructions for permanent installation.</p>
                    </div>

                    <div className="space-y-4">
                        {/* Complexity / time card */}
                        <div className="p-6 bg-[var(--bg-primary)] rounded-[var(--radius-card)] border border-[var(--border)] flex items-center justify-between">
                            <div>
                                <span className="block text-[9px] font-semibold uppercase tracking-widest text-[var(--text-secondary)] mb-1">Complexity</span>
                                <div className="flex items-center gap-1.5">
                                    <Star className="w-3.5 h-3.5 text-[var(--star-colour)]" style={{ fill: 'var(--star-colour)' }} />
                                    <span className="text-xs font-semibold uppercase text-[var(--text-primary)]">{difficulty}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="block text-[9px] font-semibold uppercase tracking-widest text-[var(--text-secondary)] mb-1">Est. Time</span>
                                <span className="text-xs font-semibold uppercase text-[var(--text-primary)]">{time}</span>
                            </div>
                        </div>

                        {/* Tools required — uses callout tokens */}
                        <div className="p-8 bg-[var(--callout-bg)] border border-[var(--callout-border)] rounded-[var(--radius-card)]">
                            <span className="block text-[9px] font-semibold uppercase tracking-widest text-[var(--text-secondary)] mb-6">Tools Required</span>
                            <div className="space-y-4">
                                {tools.map((tool, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--border)]" />
                                        <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">{tool}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button className="w-full py-5 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-[var(--radius-button)] flex items-center justify-center gap-3 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[var(--shadow-cta)]">
                        <FileText className="w-4 h-4" />
                        <span className="text-[11px] font-semibold uppercase tracking-widest">Download PDF Manual</span>
                    </button>
                </div>

                <div className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {parsedSteps.map((step, idx) => (
                            <div key={idx} className="group relative pt-10">
                                <div className="absolute top-0 left-0 text-7xl font-bold text-[var(--border)] transition-colors group-hover:text-[var(--callout-border)] select-none">
                                    0{idx + 1}
                                </div>
                                <div className="relative z-10 space-y-3">
                                    <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-primary)] flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-[var(--badge-text)]" />
                                        {step.title}
                                    </h3>
                                    <p className="text-sm font-medium text-[var(--text-secondary)] leading-relaxed pr-8">
                                        {step.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Video thumbnail */}
                    <div className="mt-16 relative aspect-video rounded-[var(--radius-card)] overflow-hidden bg-[var(--bg-primary)] border border-[var(--border)] shadow-[var(--shadow-hover)] group/video">
                        <img
                            src="https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=1000"
                            alt="Watch Installation"
                            className="w-full h-full object-cover grayscale group-hover/video:grayscale-0 group-hover/video:scale-105 transition-all duration-1000"
                        />
                        <div className="absolute inset-0 bg-[var(--text-primary)]/40 flex items-center justify-center group-hover/video:bg-[var(--text-primary)]/20 transition-all">
                            <button className="w-24 h-24 rounded-full bg-[var(--bg-primary)] flex items-center justify-center shadow-[var(--shadow-hover)] hover:scale-110 active:scale-90 transition-all">
                                <Play className="w-8 h-8 fill-[var(--text-primary)] text-[var(--text-primary)] ml-1" />
                            </button>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-8 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-[var(--badge-text)] animate-pulse" />
                                <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--bg-primary)]">Video Walkthrough (3:45)</span>
                            </div>
                            <span className="text-[9px] font-medium text-[var(--bg-primary)]/60 uppercase tracking-widest">v1.2 REV-B</span>
                        </div>
                    </div>

                    {/* Warning banner — uses urgency tokens */}
                    <div className="mt-8 flex items-center gap-3 text-[var(--urgency-text)] bg-[var(--urgency-bg)] p-4 rounded-[var(--radius-button)] border border-[var(--callout-border)]">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span className="text-[10px] font-semibold uppercase tracking-tight">Warning: High voltage components. Professional electrical install recommended.</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
