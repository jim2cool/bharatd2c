"use client"

import React, { useState } from 'react';
import { ChevronDown, Cpu, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SpecItem {
    label: string;
    value: string;
}

interface SpecCategory {
    title: string;
    icon: any;
    items: SpecItem[];
}

interface SpecsTableProps {
    specs?: string | SpecCategory[];
    className?: string;
}

const DEFAULT_SPECS: SpecCategory[] = [
    {
        title: "Processor & Performance",
        icon: Cpu,
        items: [
            { label: "Chipset", value: "Snapdragon 8 Gen 3" },
            { label: "CPU", value: "Octa-core" },
            { label: "RAM", value: "12GB LPDDR5X" }
        ]
    }
];

export function SpecsTable({ specs, className }: SpecsTableProps) {
    const [expandedCategory, setExpandedCategory] = useState<number | null>(0);

    const parsedSpecs: SpecCategory[] = React.useMemo(() => {
        if (!specs) return DEFAULT_SPECS;
        if (Array.isArray(specs)) return specs;

        const items = specs.split(',').map(s => {
            const [label, value] = s.split(':').map(str => str.trim());
            if (!label || !value) return null;
            return { label, value };
        }).filter(Boolean) as SpecItem[];

        if (items.length === 0) return DEFAULT_SPECS;

        return [{ title: "Technical Specifications", icon: Cpu, items }];
    }, [specs]);

    return (
        <div className={cn("bg-[var(--callout-bg)] border border-[var(--callout-border)] rounded-[var(--radius-card)] overflow-hidden shadow-[var(--shadow-card)]", className)}>
            <div className="p-6 border-b border-[var(--callout-border)] bg-[var(--bg-secondary)]/50">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 text-[var(--text-primary)]" style={{ fontFamily: 'var(--heading-font)' }}>Detailed Specifications</h3>
                <p className="text-[9px] text-[var(--text-secondary)] font-medium uppercase tracking-widest">Performance • Quality • Reliability</p>
            </div>

            <div className="divide-y divide-[var(--callout-border)]">
                {parsedSpecs.map((category, idx) => {
                    const isExpanded = expandedCategory === idx;
                    const Icon = category.icon;

                    return (
                        <div key={idx} className="group">
                            <button
                                onClick={() => setExpandedCategory(isExpanded ? null : idx)}
                                className="w-full px-6 py-5 flex items-center justify-between hover:bg-[var(--bg-secondary)] transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-8 h-8 rounded-[var(--radius-button)] flex items-center justify-center transition-all duration-300",
                                        isExpanded
                                            ? "bg-[var(--primary)] text-primary-foreground shadow-md scale-105"
                                            : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border)]"
                                    )}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-primary)]">{category.title}</span>
                                </div>
                                <ChevronDown className={cn(
                                    "w-4 h-4 text-[var(--text-secondary)] transition-transform duration-300",
                                    isExpanded && "rotate-180 text-[var(--primary)]"
                                )} />
                            </button>

                            <div className={cn(
                                "overflow-hidden transition-all duration-500 ease-in-out",
                                isExpanded ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
                            )}>
                                <div className="px-6 pb-6 pt-2 space-y-1">
                                    {category.items.map((item, i) => (
                                        <div key={i} className="flex justify-between items-center py-2 border-b border-[var(--callout-border)] border-dashed last:border-b-0">
                                            <span className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.1em]">{item.label}</span>
                                            <span className="text-xs font-bold text-[var(--text-primary)] font-mono">{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Warranty footer */}
            <div className="p-6 bg-[var(--bg-primary)]/40 border-t border-[var(--callout-border)] flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[var(--badge-bg)] rounded-full flex items-center justify-center text-[var(--badge-text)]">
                        <Shield className="w-4 h-4" />
                    </div>
                    <div>
                        <span className="block text-[8px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">Quality Promise</span>
                        <p className="text-[10px] font-black text-[var(--text-primary)] uppercase">1 Year Direct Brand Replacement</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
