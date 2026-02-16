"use client"

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Moon, Sun, Timer, CheckCircle, Play, Pause, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RitualStep {
    title: string;
    description: string;
    duration?: number; // in seconds
}

interface RitualGuideProps {
    steps?: RitualStep[];
    title?: string;
    subtitle?: string;
    className?: string;
}

const DEFAULT_STEPS: RitualStep[] = [
    { title: "Center Yourself", description: "Hold the piece in both hands. Close your eyes and take three deep breaths, focusing on your intention.", duration: 30 },
    { title: "Cleansing", description: "Slowly pass the item over a plume of incense or sage, visualizing any stagnant energy lifting away.", duration: 60 },
    { title: "Activation", description: "Chant the personal mantra included with your artisan card while visualizing a warm light surrounding the piece.", duration: 120 },
    { title: "Completion", description: "Place the item on your heart space for a moment of silence before wearing or placing it in your sanctuary." }
];

export function RitualGuide({
    steps = DEFAULT_STEPS,
    ritual,
    title = "The Sacred Ritual",
    subtitle = "Interacting with your artisan creation",
    className
}: RitualGuideProps & { ritual?: string }) {

    const parsedSteps = React.useMemo(() => {
        if (!ritual) return steps;

        return ritual.split('\n').map(line => {
            const [title, description] = line.split(':').map(s => s.trim());
            if (title && description) return { title, description, duration: 60 };
            if (title) return { title: 'Action', description: title, duration: 60 };
            return null;
        }).filter(Boolean) as RitualStep[];
    }, [ritual, steps]);

    const [activeStep, setActiveStep] = useState(0);
    const [timeLeft, setTimeLeft] = useState<number | null>(parsedSteps[0].duration || null);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        setActiveStep(0);
        setTimeLeft(parsedSteps[0].duration || null);
        setIsActive(false);
    }, [parsedSteps]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive && timeLeft !== null && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => (prev !== null ? prev - 1 : null));
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleStepChange = (idx: number) => {
        setActiveStep(idx);
        setTimeLeft(parsedSteps[idx].duration || null);
        setIsActive(false);
    };

    return (
        <div className={cn("border p-10 md:p-14 shadow-[var(--shadow-card)] relative overflow-hidden", className)}
            style={{ background: 'var(--callout-bg)', borderColor: 'var(--callout-border)', borderRadius: 'var(--radius-card)' }}>
            {/* Decorative blur — uses callout-bg at low opacity */}
            <div className="absolute top-0 right-0 w-64 h-64 -mr-32 -mt-32 opacity-20 blur-[100px]"
                style={{ background: 'var(--primary)' }} />

            <div className="flex flex-col lg:flex-row gap-12 relative z-10">
                <div className="flex-1 space-y-8">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <Sparkles className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                            <span className="text-[10px] font-semibold uppercase tracking-[0.3em]"
                                style={{ color: 'var(--text-secondary)' }}>Sacred Instructions</span>
                        </div>
                        <h2 className="text-3xl font-semibold italic tracking-tighter mb-2"
                            style={{ fontFamily: 'var(--heading-font)', color: 'var(--text-primary)' }}>{title}</h2>
                        <p className="text-sm font-medium uppercase tracking-widest leading-relaxed max-w-md"
                            style={{ color: 'var(--text-secondary)' }}>{subtitle}</p>
                    </div>

                    <div className="space-y-4">
                        {parsedSteps.map((step, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleStepChange(idx)}
                                className={cn(
                                    "w-full text-left p-6 border transition-all duration-700 flex items-start gap-4 group",
                                    activeStep === idx
                                        ? "scale-[1.02]"
                                        : "bg-transparent border-transparent opacity-40 hover:opacity-70"
                                )}
                                style={activeStep === idx ? {
                                    background: 'var(--bg-primary)',
                                    borderColor: 'var(--border)',
                                    borderRadius: 'var(--radius-card)',
                                    boxShadow: 'var(--shadow-hover)',
                                } : { borderRadius: 'var(--radius-card)' }}
                            >
                                <div className="w-8 h-8 flex items-center justify-center text-[10px] font-semibold shrink-0 transition-colors duration-500"
                                    style={{
                                        borderRadius: 'var(--radius-badge)',
                                        background: activeStep === idx ? 'var(--primary)' : 'var(--border)',
                                        color: activeStep === idx ? 'var(--primary-foreground)' : 'var(--text-secondary)',
                                    }}>
                                    0{idx + 1}
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xs font-semibold uppercase tracking-widest"
                                        style={{ color: 'var(--text-primary)' }}>{step.title}</h3>
                                    {activeStep === idx && (
                                        <motion.p
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-sm leading-relaxed"
                                            style={{ color: 'var(--text-secondary)' }}
                                        >
                                            {step.description}
                                        </motion.p>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="lg:w-80 flex flex-col items-center justify-center space-y-8">
                    <div className="relative">
                        <div className="w-56 h-56 border-2 flex flex-col items-center justify-center text-center p-8 bg-card/50 backdrop-blur-md shadow-inner"
                            style={{ borderRadius: '9999px', borderColor: 'var(--border)' }}>
                            {timeLeft !== null ? (
                                <>
                                    <Timer className="w-5 h-5 mb-3" style={{ color: 'var(--text-secondary)' }} />
                                    <div className="text-5xl font-semibold tabular-nums tracking-tighter"
                                        style={{ color: 'var(--text-primary)' }}>{formatTime(timeLeft)}</div>
                                    <span className="text-[9px] font-semibold uppercase tracking-widest mt-2"
                                        style={{ color: 'var(--text-secondary)' }}>Active Protocol</span>
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-8 h-8 mb-3" style={{ color: 'var(--primary)' }} />
                                    <div className="text-xs font-semibold uppercase tracking-widest leading-tight"
                                        style={{ color: 'var(--text-primary)' }}>Ready to Proceed</div>
                                </>
                            )}
                        </div>

                        {timeLeft !== null && (
                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                                <button
                                    onClick={() => setIsActive(!isActive)}
                                    className="p-4 shadow-[var(--shadow-hover)] hover:scale-110 active:scale-95 transition-all"
                                    style={{ background: 'var(--primary)', color: 'var(--primary-foreground)', borderRadius: 'var(--radius-badge)' }}
                                >
                                    {isActive ? <Pause className="w-5 h-4 fill-current" /> : <Play className="w-5 h-4 fill-current ml-0.5" />}
                                </button>
                                <button
                                    onClick={() => { setIsActive(false); setTimeLeft(parsedSteps[activeStep].duration || 0); }}
                                    className="p-4 border shadow-[var(--shadow-card)] hover:scale-105 transition-all"
                                    style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-secondary)', borderRadius: 'var(--radius-badge)' }}
                                >
                                    <RotateCcw className="w-5 h-4" />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4">
                        <div className="flex flex-col items-center gap-2">
                            <Moon className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                            <span className="text-[8px] font-semibold uppercase tracking-widest"
                                style={{ color: 'var(--text-secondary)' }}>Night Ritual</span>
                        </div>
                        <div className="w-px h-8" style={{ background: 'var(--border)' }} />
                        <div className="flex flex-col items-center gap-2">
                            <Sun className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                            <span className="text-[8px] font-semibold uppercase tracking-widest"
                                style={{ color: 'var(--text-secondary)' }}>Solar Cleansing</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
