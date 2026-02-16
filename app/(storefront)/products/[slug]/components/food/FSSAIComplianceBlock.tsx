"use client"

import React from 'react';
import { ShieldAlert, CheckCircle2, Factory, Package, ScrollText, ExternalLink, Flag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FSSAIComplianceBlockProps {
    licenseNumber?: string;
    isVeg?: boolean;
    manufacturer?: string;
    packer?: string;
    className?: string;
}

export function FSSAIComplianceBlock({
    licenseNumber = "10021021000452",
    isVeg = true,
    manufacturer = "Purity Foods Pvt. Ltd.",
    packer = "EcoLogistics India",
    className
}: FSSAIComplianceBlockProps) {
    return (
        <div className={cn("bg-[var(--callout-bg)] border border-[var(--callout-border)] rounded-[var(--radius-card)] p-8 md:p-12 shadow-[var(--shadow-card)] relative overflow-hidden", className)}>
            <div className="flex flex-col lg:flex-row gap-12 items-start relative z-10">
                <div className="lg:w-80 shrink-0 space-y-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--badge-bg)] border border-[var(--callout-border)] rounded-[var(--radius-badge)] shadow-sm">
                            <ShieldAlert className="w-3.5 h-3.5 text-[var(--badge-text)]" />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--badge-text)]">Statutory Verified</span>
                        </div>
                        <h2 className="text-4xl font-normal leading-[0.85] tracking-tighter text-[var(--text-primary)]" style={{ fontFamily: 'var(--heading-font)' }}>
                            Bharat Food <br /><span className="italic" style={{ color: 'var(--primary)' }}>Standards.</span>
                        </h2>
                    </div>

                    <div className="bg-[var(--bg-primary)]/80 backdrop-blur-sm rounded-[var(--radius-card)] p-6 border border-[var(--callout-border)] shadow-[var(--shadow-hover)] flex flex-col items-center text-center space-y-4 relative">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/en/thumb/9/90/FSSAI_logo.svg/1200px-FSSAI_logo.svg.png"
                            alt="FSSAI"
                            className="h-10 w-auto object-contain opacity-90 brightness-0"
                            style={{ filter: 'grayscale(100%)' }}
                        />
                        <div className="space-y-2">
                            <span className="block text-[8px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">License Number</span>
                            <span className="inline-block text-lg font-black text-[var(--text-primary)] tracking-tighter tabular-nums px-4 py-1.5 bg-[var(--bg-secondary)]/50 rounded-[var(--radius-button)] border border-[var(--border)] font-mono">
                                {licenseNumber}
                            </span>
                        </div>

                        {/* Veg/Non-veg indicator */}
                        <div className="flex items-center gap-2 bg-[var(--bg-secondary)]/30 px-3 py-1.5 rounded-full border border-[var(--border)]">
                            <div className="w-4 h-4 rounded-sm border-2 flex items-center justify-center bg-card"
                                style={{ borderColor: isVeg ? '#16A34A' : '#DC2626' }}>
                                <div className="w-2 h-2 rounded-full"
                                    style={{ background: isVeg ? '#16A34A' : '#DC2626' }} />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-primary)]">
                                {isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-[var(--bg-primary)]/40 backdrop-blur-sm rounded-[var(--radius-card)] border border-[var(--callout-border)] space-y-4">
                        <div className="w-10 h-10 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center text-[var(--primary)]">
                            <Factory className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="block text-[8px] font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-1">Manufacturer</span>
                            <h4 className="text-sm font-black text-[var(--text-primary)] leading-tight uppercase tracking-tight">{manufacturer}</h4>
                        </div>
                    </div>

                    <div className="p-6 bg-[var(--bg-primary)]/40 backdrop-blur-sm rounded-[var(--radius-card)] border border-[var(--callout-border)] space-y-4">
                        <div className="w-10 h-10 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center text-[var(--primary)]">
                            <Package className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="block text-[8px] font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-1">Packer & Logistics</span>
                            <h4 className="text-sm font-black text-[var(--text-primary)] leading-tight uppercase tracking-tight">{packer}</h4>
                        </div>
                    </div>

                    <div className="md:col-span-2 p-6 bg-[var(--bg-primary)]/60 rounded-[var(--radius-card)] border border-[var(--callout-border)] flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <Flag className="w-5 h-5 text-[var(--primary)]" />
                            <p className="text-[10px] font-medium italic tracking-tight text-[var(--text-primary)] leading-relaxed">
                                This product is processed and packaged in compliance with Bharat’s national food safety guidelines.
                            </p>
                        </div>
                        <div className="shrink-0 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-[var(--primary)]">
                            <CheckCircle2 className="w-4 h-4" />
                            Direct Sourcing
                        </div>
                    </div>
                </div>
            </div>

            {/* Background Texture Blur - Rasoi Axiom */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)] opacity-[0.03] rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        </div>
    );
}
