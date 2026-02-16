"use client"

import React from 'react'
import { Zap } from 'lucide-react'

export const FabricDetailsModule = ({ fabric, care }: { fabric?: string, care?: string }) => {
    if (!fabric && !care) return null;
    return (
        <div className="p-6 bg-[var(--bg-primary)] border border-[var(--border)] rounded-[var(--radius-card)] shadow-[var(--shadow-card)]">
            <div className="flex items-center gap-4">
                <div className="p-4 bg-[var(--callout-bg)] border border-[var(--callout-border)] rounded-[var(--radius-button)]">
                    <Zap className="w-6 h-6 text-[var(--badge-text)]" />
                </div>
                <div>
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-primary)]">Fabric & Care</h3>
                    <p className="text-[11px] text-[var(--text-secondary)] mt-1 font-medium italic">
                        {fabric || 'Premium Quality'}
                        {care && <span className="block mt-1 text-[var(--text-secondary)] not-italic">Care: {care}</span>}
                    </p>
                </div>
            </div>
        </div>
    );
};
