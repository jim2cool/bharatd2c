"use client"

import React from 'react';
import { useBehavioral } from '../../context/BehavioralContext';
import { cn } from '@/lib/utils';

interface TrustDensityManagerProps {
    children: React.ReactNode;
    className?: string;
}

export function TrustDensityManager({ children, className }: TrustDensityManagerProps) {
    const { seller } = useBehavioral();

    return (
        <div className={cn(
            "transition-all duration-500",
            seller.trustDensity === 'light' && "opacity-60 scale-95 origin-left",
            seller.trustDensity === 'heavy' && "p-6 bg-muted rounded-[2rem] border border-border",
            className
        )}>
            {children}
            {seller.trustDensity === 'heavy' && (
                <p className="mt-4 text-[9px] font-bold text-muted-foreground uppercase tracking-widest text-center border-t border-border pt-4">
                    Verified Secure Merchant & Quality Guaranteed
                </p>
            )}
        </div>
    );
}
