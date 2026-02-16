"use client"

import React from 'react';
import { ShieldCheck, Award, FileText, CheckCircle, ExternalLink, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Certification {
    id: string;
    name: string;
    org: string;
    description: string;
    expiry?: string;
}

interface DocGradeCertificationsProps {
    certifications?: Certification[];
    className?: string;
}

const DEFAULT_CERTS: Certification[] = [
    {
        id: 'fssai',
        name: 'FSSAI Licensed',
        org: 'Food Safety & Standards Authority India',
        description: 'Meets all national food safety standards for manufacturing and storage.',
        expiry: 'Dec 2026'
    },
    {
        id: 'gmp',
        name: 'GMP Certified',
        org: 'Global Manufacturing Practices',
        description: 'Adherence to stringent quality control during entire production cycle.',
        expiry: 'June 2025'
    },
    {
        id: 'organic',
        name: 'USDA Organic',
        org: 'United States Dept. of Agriculture',
        description: 'Certified 100% organic without use of synthetic pesticides or fertilizers.'
    },
    {
        id: 'lab-tested',
        name: 'Double Lab Tested',
        org: 'SGS Global Laboratories',
        description: 'Verified for purity and potency by independent third-party laboratories.'
    }
];

export function DocGradeCertifications({ certifications = DEFAULT_CERTS, className }: DocGradeCertificationsProps) {
    return (
        <div className={cn("bg-[var(--callout-bg)] border border-[var(--callout-border)] rounded-none p-8 md:p-12 shadow-[var(--shadow-card)] relative overflow-hidden", className)}>
            <div className="absolute top-0 right-0 p-12 opacity-[0.02] rotate-12 pointer-events-none">
                <Activity className="w-64 h-64 text-[var(--primary)]" />
            </div>

            <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--badge-bg)] border border-[var(--callout-border)] rounded-full">
                            <ShieldCheck className="w-3.5 h-3.5 text-[var(--badge-text)]" />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--badge-text)]">Laboratory Verified</span>
                        </div>
                        <h2 className="text-4xl font-normal leading-[0.85] tracking-tighter text-[var(--text-primary)]" style={{ fontFamily: 'var(--heading-font)' }}>
                            Clinical Grade <br /><span className="italic" style={{ color: 'var(--primary)' }}>Certifications.</span>
                        </h2>
                    </div>

                    <button className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--primary)] hover:opacity-70 transition-all group border-b border-[var(--primary)] pb-1">
                        <FileText className="w-4 h-4" />
                        Download Analysis Report
                        <ExternalLink className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {certifications.map((cert) => (
                        <div key={cert.id} className="p-6 bg-[var(--bg-primary)]/40 backdrop-blur-sm rounded-none border border-[var(--callout-border)] shadow-sm hover:bg-[var(--bg-primary)]/60 transition-all group flex flex-col justify-between">
                            <div>
                                <div className="w-10 h-10 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center mb-6 text-[var(--primary)] group-hover:scale-110 transition-transform duration-500">
                                    <Award className="w-5 h-5" />
                                </div>

                                <h3 className="text-[11px] font-black uppercase tracking-widest text-[var(--text-primary)] mb-1 leading-tight">{cert.name}</h3>
                                <p className="text-[8px] text-[var(--primary)] font-bold uppercase tracking-tight mb-4">{cert.org}</p>

                                <p className="text-[10px] leading-relaxed text-[var(--text-secondary)] font-medium mb-6 opacity-80 uppercase tracking-tight">
                                    {cert.description}
                                </p>
                            </div>

                            <div className="pt-4 border-t border-[var(--callout-border)] border-dashed flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    <CheckCircle className="w-3 h-3 text-[var(--primary)]" />
                                    <span className="text-[8px] font-black uppercase tracking-widest text-[var(--text-primary)]">Verified</span>
                                </div>
                                {cert.expiry && (
                                    <span className="text-[8px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">EXP: {cert.expiry}</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-10 p-5 bg-[var(--bg-primary)]/80 rounded-none border border-[var(--callout-border)] border-l-4 border-l-[var(--primary)] flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-[var(--badge-bg)] border border-[var(--callout-border)] flex items-center justify-center text-[var(--badge-text)] font-black text-[9px] tracking-tighter">
                            AQC
                        </div>
                        <div>
                            <span className="block text-[8px] font-black uppercase tracking-widest text-[var(--primary)]">Audit Compliance Check</span>
                            <span className="text-[10px] font-bold text-[var(--text-primary)] uppercase tracking-tight">Batch #SB-902 Verified Clean Room Grade A+</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Structural Axiom Decoration */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--primary)]/10 to-transparent" />
        </div>
    );
}
