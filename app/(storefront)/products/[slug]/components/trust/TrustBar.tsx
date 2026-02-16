"use client"

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrustBarProps {
    className?: string;
}

export function TrustBar({
    className
}: TrustBarProps) {
    return (
        <div className={cn(
            "flex items-center justify-between py-4 border-y text-[10px] font-semibold uppercase tracking-widest",
            "text-[var(--text-secondary)] border-[var(--border)]",
            className
        )}>
            <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-[var(--primary)]" /> SECURE CHECKOUT
            </span>
            <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-[var(--primary)]" /> QUALITY GUARANTEED
            </span>
            <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-[var(--primary)]" /> FAST SHIPPING
            </span>
        </div>
    );
}
