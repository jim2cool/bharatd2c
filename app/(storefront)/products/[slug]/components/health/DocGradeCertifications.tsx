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

export function DocGradeCertifications({
    certifications = DEFAULT_CERTS,
    className
}: DocGradeCertificationsProps) {
    return (
        <div className={cn("bg-emerald-50/30 border border-emerald-100 rounded-[3rem] p-10 md:p-14 shadow-sm relative overflow-hidden", className)}>
            {/* Background Medical Pattern (Simplified) */}
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12">
                <Activity className="w-64 h-64 text-emerald-900" />
            </div>

            <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 rounded-full border border-emerald-200">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Safety Verified</span>
                        </div>
                        <h2 className="text-4xl font-black tracking-tighter text-neutral-900">Clinical & Health <br /><span className="text-emerald-600">Certifications.</span></h2>
                    </div>

                    <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700 hover:text-emerald-900 transition-colors group">
                        <FileText className="w-4 h-4" />
                        Download Full Lab Report
                        <ExternalLink className="w-3 h-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {certifications.map((cert) => (
                        <div key={cert.id} className="p-8 bg-white rounded-[2.5rem] border border-emerald-50 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all group">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-500">
                                <Award className="w-6 h-6" />
                            </div>

                            <h3 className="text-sm font-black uppercase tracking-widest text-neutral-900 mb-1">{cert.name}</h3>
                            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-tight mb-4">{cert.org}</p>

                            <p className="text-[11px] leading-relaxed text-neutral-500 font-medium mb-6">
                                {cert.description}
                            </p>

                            <div className="pt-4 border-t border-emerald-50 flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    <CheckCircle className="w-3 h-3 text-emerald-500 fill-emerald-500/10" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Verified</span>
                                </div>
                                {cert.expiry && (
                                    <span className="text-[9px] font-bold text-neutral-300 uppercase tracking-widest">Valid: {cert.expiry}</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 p-6 bg-white/40 backdrop-blur-md rounded-3xl border border-emerald-100 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4 text-center md:text-left">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-black text-xs">
                            AQI
                        </div>
                        <div>
                            <span className="block text-[9px] font-black uppercase tracking-widest text-emerald-600">Internal Audit Status</span>
                            <span className="text-xs font-bold text-neutral-700">Batch #992-B: Triple Purity Cleared (Clean Room Grade A)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
