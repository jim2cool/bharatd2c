"use client"

import React from 'react';
import { Store, ShieldCheck, Star, MapPin, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SellerInfoProps {
    sellerName: string;
    description?: string;
    rating: number;
    reviewCount: number;
    location: string;
    isVerified?: boolean;
    className?: string;
}

export function SellerInfo({
    sellerName,
    description = "Elite Seller with 5+ years of excellence in the category.",
    rating,
    reviewCount,
    location,
    isVerified = true,
    className
}: SellerInfoProps) {
    return (
        <div className={cn(
            "p-5 border transition-all duration-300",
            "bg-[var(--bg-primary)] border-[var(--border)] rounded-[var(--radius-card)] shadow-[var(--shadow-card)]",
            "hover:shadow-[var(--shadow-hover)]",
            className
        )}>
            {/* Header: Name + Verification */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-[var(--radius-button)] bg-[var(--badge-bg)] text-[var(--badge-text)] flex items-center justify-center border border-[var(--callout-border)]">
                        <Store className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="text-sm font-bold tracking-tight text-[var(--text-primary)]" style={{ fontFamily: 'var(--heading-font)' }}>
                                {sellerName}
                            </h3>
                            {isVerified && (
                                <div className="inline-flex items-center gap-1 bg-[#16A34A]/10 text-[#16A34A] text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded-full">
                                    <ShieldCheck className="w-2.5 h-2.5" />
                                    Verified Seller
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                            <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 fill-[var(--star-colour)] text-[var(--star-colour)]" />
                                <span className="text-xs font-bold text-[var(--text-primary)]">{rating}</span>
                                <span className="text-[10px] text-[var(--text-secondary)]">({reviewCount})</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-[var(--text-secondary)]" />
                                <span className="text-[10px] text-[var(--text-secondary)] font-medium">{location}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <button className="p-2 rounded-full hover:bg-[var(--bg-secondary)] transition-colors border border-[var(--border)] group">
                    <MessageCircle className="w-4 h-4 text-[var(--primary)] group-hover:scale-110 transition-transform" />
                </button>
            </div>

            {/* Description */}
            <p className="text-xs leading-relaxed text-[var(--text-secondary)] font-medium mb-4">
                {description}
            </p>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-px bg-[var(--border)] overflow-hidden rounded-[var(--radius-badge)] border border-[var(--border)]">
                <div className="p-3 bg-[var(--callout-bg)] text-center">
                    <span className="block text-[8px] font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-1">Response Time</span>
                    <span className="text-xs font-black text-[var(--primary)] uppercase">Under 2 hrs</span>
                </div>
                <div className="p-3 bg-[var(--callout-bg)] text-center">
                    <span className="block text-[8px] font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-1">Success Rate</span>
                    <span className="text-xs font-black text-[var(--primary)] uppercase">99.2%</span>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[var(--border)] flex items-center justify-between">
                <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Product Provenance</span>
                <span className="text-[10px] font-black text-[var(--primary)] uppercase">100% Authentic Linkage</span>
            </div>
        </div>
    );
}
