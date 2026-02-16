"use client"

import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface Swatch {
    id: string;
    label: string;
    value: string; // Hex color or image URL
    type: 'color' | 'image';
}

interface SwatchVariantsProps {
    swatches: Swatch[];
    selectedId?: string;
    onSelect?: (id: string) => void;
    className?: string;
}

export function SwatchVariants({
    swatches,
    selectedId,
    onSelect,
    className
}: SwatchVariantsProps) {
    const [selected, setSelected] = useState(selectedId || swatches[0]?.id);

    const handleSelect = (id: string) => {
        setSelected(id);
        onSelect?.(id);
    };

    return (
        <div className={cn("space-y-3", className)}>
            <div className="flex items-baseline justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">
                    Select {swatches[0]?.type === 'color' ? 'Color' : 'Finish'}
                </span>
                <span className="text-[10px] font-black uppercase text-[var(--text-primary)]">
                    {swatches.find(s => s.id === selected)?.label}
                </span>
            </div>

            <TooltipProvider>
                <div className="flex flex-wrap gap-2.5">
                    {swatches.map((swatch) => (
                        <Tooltip key={swatch.id}>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={() => handleSelect(swatch.id)}
                                    className={cn(
                                        "relative transition-all duration-300 p-[2px]",
                                        "rounded-[var(--radius-button)]",
                                        selected === swatch.id
                                            ? "ring-2 ring-[var(--primary)] ring-offset-2 ring-offset-white scale-110 shadow-sm"
                                            : "ring-1 ring-[var(--border)] hover:scale-105"
                                    )}
                                    style={{
                                        borderRadius: 'var(--radius-button)'
                                    }}
                                >
                                    <div
                                        className="w-8 h-8 md:w-10 md:h-10 rounded-[var(--radius-button)] overflow-hidden border border-black/5 flex items-center justify-center transform group"
                                        style={{
                                            backgroundColor: swatch.type === 'color' ? swatch.value : 'transparent',
                                            backgroundImage: swatch.type === 'image' ? `url(${swatch.value})` : 'none',
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            borderRadius: 'var(--radius-button)'
                                        }}
                                    >
                                        {selected === swatch.id && (
                                            <div className="w-full h-full bg-foreground/10 flex items-center justify-center">
                                                <Check className={cn(
                                                    "w-4 h-4 shadow-sm",
                                                    swatch.type === 'color' && swatch.value.toLowerCase() === '#ffffff' ? "text-foreground" : "text-primary-foreground"
                                                )} />
                                            </div>
                                        )}
                                    </div>
                                </button>
                            </TooltipTrigger>
                            <TooltipContent
                                side="bottom"
                                className="bg-[var(--text-primary)] text-primary-foreground text-[10px] uppercase font-black px-3 py-1 border-none rounded-none"
                            >
                                {swatch.label}
                            </TooltipContent>
                        </Tooltip>
                    ))}
                </div>
            </TooltipProvider>
        </div>
    );
}
