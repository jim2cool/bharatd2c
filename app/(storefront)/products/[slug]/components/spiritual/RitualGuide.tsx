"use client"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    ritual, // New prop
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
        // Reset when steps change
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
        <div className={cn("bg-stone-50 border border-stone-200 rounded-[3rem] p-10 md:p-14 shadow-sm relative overflow-hidden", className)}>
            {/* Background Texture/Pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-stone-100 rounded-full blur-[100px] -mr-32 -mt-32 opacity-50" />

            <div className="flex flex-col lg:flex-row gap-12 relative z-10">
                <div className="flex-1 space-y-8">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <Sparkles className="w-5 h-5 text-stone-400" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">Sacred Instructions</span>
                        </div>
                        <h2 className="text-3xl font-black italic tracking-tighter text-stone-900 mb-2">{title}</h2>
                        <p className="text-sm font-bold text-stone-500 uppercase tracking-widest leading-relaxed max-w-md">{subtitle}</p>
                    </div>

                    <div className="space-y-4">
                        {parsedSteps.map((step, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleStepChange(idx)}
                                className={cn(
                                    "w-full text-left p-6 rounded-[2rem] border transition-all duration-700 flex items-start gap-4 group",
                                    activeStep === idx
                                        ? "bg-white border-stone-300 shadow-xl shadow-stone-200/50 scale-[1.02]"
                                        : "bg-transparent border-transparent opacity-40 hover:opacity-70"
                                )}
                            >
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 transition-colors duration-500",
                                    activeStep === idx ? "bg-stone-900 text-white" : "bg-stone-200 text-stone-500"
                                )}>
                                    0{idx + 1}
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-stone-900">{step.title}</h3>
                                    {activeStep === idx && (
                                        <motion.p
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-stone-600 text-sm leading-relaxed"
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
                        {/* Circular Progress (Simplified) */}
                        <div className="w-56 h-56 rounded-full border-2 border-stone-200 flex flex-col items-center justify-center text-center p-8 bg-white/50 backdrop-blur-md shadow-inner">
                            {timeLeft !== null ? (
                                <>
                                    <Timer className="w-5 h-5 text-stone-300 mb-3" />
                                    <div className="text-5xl font-black tabular-nums tracking-tighter text-stone-900">{formatTime(timeLeft)}</div>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-stone-400 mt-2">Active Protocol</span>
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-8 h-8 text-emerald-400 mb-3" />
                                    <div className="text-xs font-black uppercase tracking-widest text-stone-900 leading-tight">Ready to Proceed</div>
                                </>
                            )}
                        </div>

                        {timeLeft !== null && (
                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                                <button
                                    onClick={() => setIsActive(!isActive)}
                                    className="p-4 bg-stone-900 text-white rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all"
                                >
                                    {isActive ? <Pause className="w-5 h-4 fill-white" /> : <Play className="w-5 h-4 fill-white ml-0.5" />}
                                </button>
                                <button
                                    onClick={() => { setIsActive(false); setTimeLeft(parsedSteps[activeStep].duration || 0); }}
                                    className="p-4 bg-white border border-stone-200 text-stone-400 rounded-full shadow-md hover:text-stone-900 transition-all"
                                >
                                    <RotateCcw className="w-5 h-4" />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4">
                        <div className="flex flex-col items-center gap-2">
                            <Moon className="w-4 h-4 text-stone-300" />
                            <span className="text-[8px] font-black uppercase tracking-widest text-stone-400">Night Ritual</span>
                        </div>
                        <div className="w-px h-8 bg-stone-200" />
                        <div className="flex flex-col items-center gap-2">
                            <Sun className="w-4 h-4 text-stone-300" />
                            <span className="text-[8px] font-black uppercase tracking-widest text-stone-400">Solar Cleansing</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
