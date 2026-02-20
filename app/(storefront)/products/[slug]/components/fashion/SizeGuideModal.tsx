"use client"

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Ruler, Info } from 'lucide-react';

interface SizeGuideModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
    const [unit, setUnit] = useState<'cm' | 'inch'>('cm');

    const sizeData = [
        { size: 'S', chest: { cm: '92-96', inch: '36-38' }, waist: { cm: '78-82', inch: '31-32' }, length: { cm: '68', inch: '27' } },
        { size: 'M', chest: { cm: '98-102', inch: '38-40' }, waist: { cm: '84-88', inch: '33-35' }, length: { cm: '70', inch: '28' } },
        { size: 'L', chest: { cm: '104-108', inch: '41-43' }, waist: { cm: '90-94', inch: '35-37' }, length: { cm: '72', inch: '29' } },
        { size: 'XL', chest: { cm: '110-114', inch: '43-45' }, waist: { cm: '96-100', inch: '38-39' }, length: { cm: '74', inch: '30' } },
    ];

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-end lg:items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 50 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 50 }}
                    className="relative w-full max-w-2xl bg-white rounded-[2.5rem] lg:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                    <div className="p-8 pb-4 border-b border-neutral-100 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-neutral-50 rounded-2xl">
                                <Ruler className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black uppercase tracking-tight italic">Find Your Fit</h3>
                                <p className="text-[11px] text-neutral-400 font-bold uppercase tracking-widest">Global Sizing Standard</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-3 rounded-full hover:bg-neutral-50 transition-colors"
                        >
                            <X className="w-6 h-6 text-neutral-400" />
                        </button>
                    </div>

                    <div className="p-8 overflow-y-auto">
                        {/* Unit Toggle */}
                        <div className="flex justify-center mb-10">
                            <div className="flex p-1.5 bg-neutral-100 rounded-2xl w-full max-w-[240px]">
                                <button
                                    onClick={() => setUnit('cm')}
                                    className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${unit === 'cm' ? 'bg-white shadow-sm scale-[1.02] text-primary' : 'text-neutral-400'}`}
                                >
                                    Centimeters (cm)
                                </button>
                                <button
                                    onClick={() => setUnit('inch')}
                                    className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${unit === 'inch' ? 'bg-white shadow-sm scale-[1.02] text-primary' : 'text-neutral-400'}`}
                                >
                                    Inches (in)
                                </button>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto rounded-3xl border border-neutral-100 bg-neutral-50/50">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-neutral-100">
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-neutral-400">Size</th>
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-neutral-400">Chest</th>
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-neutral-400">Waist</th>
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-neutral-400">Length</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sizeData.map((row) => (
                                        <tr key={row.size} className="border-b border-neutral-50 last:border-0 hover:bg-white transition-colors">
                                            <td className="px-6 py-5 text-sm font-black italic">{row.size}</td>
                                            <td className="px-6 py-5 text-sm font-medium text-neutral-600">{unit === 'cm' ? row.chest.cm : row.chest.inch}</td>
                                            <td className="px-6 py-5 text-sm font-medium text-neutral-600">{unit === 'cm' ? row.waist.cm : row.waist.inch}</td>
                                            <td className="px-6 py-5 text-sm font-medium text-neutral-600">{unit === 'cm' ? row.length.cm : row.length.inch}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Measurement Instruction Visual (Simplified) */}
                        <div className="mt-12 p-6 bg-primary/5 rounded-[2rem] flex flex-col lg:flex-row gap-8 items-center">
                            <div className="w-full lg:w-1/3 aspect-square bg-white rounded-2xl flex items-center justify-center p-8">
                                <div className="w-full h-full border-2 border-dashed border-primary/20 relative flex items-center justify-center rounded-lg">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary/30">Measurement Schematic</span>
                                    <div className="absolute top-1/4 left-0 right-0 border-b border-primary h-px flex items-center justify-center">
                                        <span className="bg-primary text-white text-[8px] px-1 rounded -mt-0.5">CHEST</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="p-1.5 bg-primary text-white rounded-lg"><Info className="w-3.5 h-3.5" /></div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-black uppercase tracking-tight">How to measure</span>
                                        <p className="text-[11px] text-neutral-500 leading-normal">Measure around the fullest part of your chest, keeping the tape horizontal.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-1.5 bg-primary text-white rounded-lg"><Info className="w-3.5 h-3.5" /></div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-black uppercase tracking-tight">Classic Fit</span>
                                        <p className="text-[11px] text-neutral-500 leading-normal">If you are between sizes, we recommend sizing up for a relaxed editorial look.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
