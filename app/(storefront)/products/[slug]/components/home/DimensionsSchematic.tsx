"use client"

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ruler, Maximize2, Info, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DimensionLine {
    id: string;
    label: string;
    value: string;
    x: string;
    y: string;
    type: 'width' | 'height' | 'depth';
}

interface DimensionsSchematicProps {
    imageUrl?: string;
    dimensions?: DimensionLine[];
    className?: string;
}

const DEFAULT_DIMENSIONS: DimensionLine[] = [
    { id: 'w', label: "Width", value: "450mm", x: "50%", y: "92%", type: 'width' },
    { id: 'h', label: "Height", value: "850mm", x: "8%", y: "50%", type: 'height' },
    { id: 'd', label: "Depth", value: "600mm", x: "85%", y: "45%", type: 'depth' }
];

export function DimensionsSchematic({
    imageUrl = "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1000",
    dimensions = DEFAULT_DIMENSIONS,
    className
}: DimensionsSchematicProps) {
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    return (
        <div className={cn("bg-neutral-900 rounded-[3rem] p-10 md:p-14 overflow-hidden relative group border border-neutral-800", className)}>
            {/* Blueprint Grid Overlay */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

            <div className="flex flex-col lg:flex-row gap-12 relative z-10">
                <div className="flex-1 space-y-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-1 bg-white/5 rounded-full border border-white/10">
                            <Ruler className="w-3.5 h-3.5 text-blue-400" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Technical Schematic</span>
                        </div>
                        <h2 className="text-4xl font-black tracking-tighter text-white leading-none">
                            Precision <br />
                            <span className="text-neutral-500 italic font-medium">Dimensions.</span>
                        </h2>
                        <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest leading-relaxed max-w-xs">
                            Measured to 0.1mm tolerance for perfect structural integration.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {dimensions.map((dim) => (
                            <div
                                key={dim.id}
                                onMouseEnter={() => setHoveredId(dim.id)}
                                onMouseLeave={() => setHoveredId(null)}
                                className={cn(
                                    "p-6 rounded-3xl border transition-all duration-500 cursor-help",
                                    hoveredId === dim.id
                                        ? "bg-blue-500 border-blue-400 text-white shadow-xl shadow-blue-500/20"
                                        : "bg-white/5 border-white/5 text-neutral-400"
                                )}
                            >
                                <span className="block text-[10px] font-black uppercase tracking-[0.2em] mb-1 opacity-60">{dim.label}</span>
                                <span className="text-2xl font-black tracking-tighter">{dim.value}</span>
                            </div>
                        ))}
                    </div>

                    <div className="p-6 bg-white shadow-2xl rounded-[2.5rem] flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-neutral-900 flex items-center justify-center">
                                <Maximize2 className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <span className="block text-[9px] font-black uppercase tracking-widest text-neutral-400">Smart Check</span>
                                <p className="text-xs font-black text-neutral-900 uppercase">Fits standard 60cm counters</p>
                            </div>
                        </div>
                        <HelpCircle className="w-5 h-5 text-neutral-200" />
                    </div>
                </div>

                <div className="flex-1 relative aspect-[4/5] lg:aspect-auto">
                    <div className="w-full h-full rounded-[3.5rem] overflow-hidden border-8 border-neutral-800 shadow-2xl relative">
                        <img
                            src={imageUrl}
                            alt="Product Schematic"
                            className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
                        />
                        <div className="absolute inset-0 bg-neutral-900/40 mix-blend-multiply pointer-events-none group-hover:opacity-0 transition-opacity" />

                        {/* Interactive Dimension Callouts */}
                        {dimensions.map((dim) => (
                            <div
                                key={dim.id}
                                className="absolute pointer-events-none"
                                style={{ top: dim.y, left: dim.x }}
                            >
                                <div className="relative">
                                    <motion.div
                                        animate={{
                                            scale: hoveredId === dim.id ? 1.4 : 1,
                                            backgroundColor: hoveredId === dim.id ? "#3b82f6" : "#fff"
                                        }}
                                        className="w-4 h-4 rounded-full border-4 border-neutral-900 shadow-lg relative z-20"
                                    />
                                    <AnimatePresence>
                                        {hoveredId === dim.id && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8, x: -20 }}
                                                animate={{ opacity: 1, scale: 1, x: 10 }}
                                                exit={{ opacity: 0, scale: 0.8, x: -20 }}
                                                className="absolute top-1/2 left-full -translate-y-1/2 ml-4 px-4 py-2 bg-blue-500 text-white rounded-xl shadow-2xl z-30 flex items-center gap-2 whitespace-nowrap"
                                            >
                                                <span className="text-[10px] font-black uppercase tracking-widest">{dim.label}:</span>
                                                <span className="text-sm font-black tabular-nums">{dim.value}</span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* SVG Blueprint Overlays (Abstract lines) */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 400 500">
                        <line x1="20" y1="20" x2="380" y2="20" stroke="white" strokeWidth="0.5" strokeDasharray="4 4" />
                        <line x1="20" y1="20" x2="20" y2="480" stroke="white" strokeWidth="0.5" strokeDasharray="4 4" />
                        <circle cx="20" cy="20" r="2" fill="white" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
