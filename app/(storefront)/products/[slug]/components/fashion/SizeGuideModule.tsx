"use client"

import React from 'react'

export const SizeGuideModule = ({ onOpen }: { onOpen?: () => void }) => (
    <div className="p-7 bg-[var(--bg-primary)] border border-[var(--border)] rounded-[var(--radius-card)] shadow-[var(--shadow-card)] group hover:shadow-[var(--shadow-hover)] transition-all duration-500">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] flex items-center gap-2 text-[var(--text-primary)]">
                <span className="w-2 h-2 rounded-full bg-[var(--primary)]" />
                Size & Fit Guide
            </h3>
            <button
                onClick={onOpen}
                className="text-[10px] font-semibold uppercase tracking-widest text-[var(--primary)] underline underline-offset-4 cursor-pointer hover:text-[var(--text-primary)] transition-colors"
            >
                View Full Table
            </button>
        </div>
        <div className="grid grid-cols-5 gap-3">
            {['XS', 'S', 'M', 'L', 'XL'].map(s => (
                <div key={s} className="px-2 py-4 border border-[var(--border)] rounded-[var(--radius-button)] text-center text-xs font-semibold text-[var(--text-primary)] bg-[var(--bg-secondary)] group-hover:bg-[var(--bg-primary)] transition-colors">{s}</div>
            ))}
        </div>
        <div className="mt-6 flex items-center justify-between">
            <p className="text-[10px] text-[var(--text-secondary)] font-medium uppercase tracking-tight">Standard Asian Fit</p>
            <span className="text-[10px] font-medium italic text-[var(--text-secondary)]">Scale: 1:1 Accurate</span>
        </div>
    </div>
);
