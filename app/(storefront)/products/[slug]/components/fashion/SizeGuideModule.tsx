"use client"

import React from 'react'

export const SizeGuideModule = ({ onOpen }: { onOpen?: () => void }) => (
    <div className="p-7 bg-white border rounded-[2.5rem] shadow-sm group hover:shadow-xl transition-all duration-500">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Size & Fit Guide
            </h3>
            <button
                onClick={onOpen}
                className="text-[10px] font-black uppercase tracking-widest text-primary underline underline-offset-4 cursor-pointer hover:text-neutral-900 transition-colors"
            >
                View Full Table
            </button>
        </div>
        <div className="grid grid-cols-5 gap-3">
            {['XS', 'S', 'M', 'L', 'XL'].map(s => (
                <div key={s} className="px-2 py-4 border border-neutral-100 rounded-2xl text-center text-xs font-black bg-neutral-50/50 group-hover:bg-white transition-colors">{s}</div>
            ))}
        </div>
        <div className="mt-6 flex items-center justify-between">
            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-tight">Standard Asian Fit</p>
            <span className="text-[10px] font-black italic text-neutral-300">Scale: 1:1 Accurate</span>
        </div>
    </div>
);
