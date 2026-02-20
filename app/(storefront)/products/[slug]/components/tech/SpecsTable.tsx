"use client"

import React, { useState } from 'react';
import { ChevronDown, Cpu, Smartphone, Battery, Camera, Shield, Globe } from 'lucide-react';
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

        // Parse "Label: Value, Label: Value" string
        const items = specs.split(',').map(s => {
            const [label, value] = s.split(':').map(str => str.trim());
            if (!label || !value) return null;
            return { label, value };
        }).filter(Boolean) as SpecItem[];

        if (items.length === 0) return DEFAULT_SPECS;

        return [{
            title: "Technical Specifications",
            icon: Cpu,
            items
        }];
    }, [specs]);

    return (
        <div className={cn("bg-white border border-neutral-100 rounded-[2.5rem] overflow-hidden shadow-sm", className)}>
            <div className="p-8 border-b border-neutral-50 bg-neutral-50/30">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-1">Detailed Specifications</h3>
                <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Everything you need to know about the tech inside</p>
            </div>

            <div className="divide-y divide-neutral-50">
                {parsedSpecs.map((category, idx) => {
                    const isExpanded = expandedCategory === idx;
                    const Icon = category.icon;

                    return (
                        <div key={idx} className="group">
                            <button
                                onClick={() => setExpandedCategory(isExpanded ? null : idx)}
                                className="w-full px-8 py-6 flex items-center justify-between hover:bg-neutral-50/50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "p-3 rounded-2xl transition-all duration-300",
                                        isExpanded ? "bg-primary text-white shadow-lg shadow-primary/20 scale-110" : "bg-neutral-100 text-neutral-500"
                                    )}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-widest text-neutral-900">{category.title}</span>
                                </div>
                                <ChevronDown className={cn(
                                    "w-5 h-5 text-neutral-300 transition-transform duration-300",
                                    isExpanded && "rotate-180 text-primary"
                                )} />
                            </button>

                            <div className={cn(
                                "overflow-hidden transition-all duration-500 ease-in-out",
                                isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                            )}>
                                <div className="px-8 pb-8 pt-2 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                                    {category.items.map((item, i) => (
                                        <div key={i} className="flex justify-between items-center py-3 border-b border-neutral-50 last:md:border-b-0">
                                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{item.label}</span>
                                            <span className="text-[11px] font-black text-neutral-900">{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="p-8 bg-neutral-900 text-white flex items-center justify-between">
                <div>
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Warranty Information</span>
                    <p className="text-xs font-bold">1 Year Brand Replacement Warranty</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/10">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Certified Hardware</span>
                </div>
            </div>
        </div>
    );
}
