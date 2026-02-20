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
        <div className={cn("bg-neutral-50 border border-neutral-100 rounded-[2.5rem] p-10 md:p-14 shadow-sm relative overflow-hidden", className)}>
            <div className="flex flex-col lg:flex-row gap-16 items-start">
                <div className="lg:w-96 shrink-0 space-y-10">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-neutral-100 rounded-full">
                            <ShieldAlert className="w-3.5 h-3.5 text-orange-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-900">Statutory Compliance</span>
                        </div>
                        <h2 className="text-3xl font-black tracking-tighter text-neutral-900">Food Safety <br /><span className="text-neutral-400 font-medium italic">& Governance.</span></h2>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-8 border border-neutral-100 shadow-xl shadow-neutral-900/5 relative">
                        <div className="flex flex-col items-center text-center space-y-6">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/en/thumb/9/90/FSSAI_logo.svg/1200px-FSSAI_logo.svg.png"
                                alt="FSSAI"
                                className="h-12 w-auto object-contain opacity-80"
                            />
                            <div>
                                <span className="block text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">License No.</span>
                                <span className="text-xl font-black text-neutral-900 tracking-tighter tabular-nums px-4 py-1.5 bg-neutral-50 rounded-xl border border-neutral-100">
                                    {licenseNumber}
                                </span>
                            </div>
                            <button className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1.5 hover:underline">
                                Verify License <ExternalLink className="w-3 h-3" />
                            </button>
                        </div>

                        <div className="absolute -top-4 -right-4">
                            <div className={cn(
                                "w-12 h-12 rounded-2xl border-2 flex items-center justify-center bg-white shadow-xl",
                                isVeg ? "border-emerald-500" : "border-rose-500"
                            )}>
                                <div className={cn(
                                    "w-4 h-4 rounded-full",
                                    isVeg ? "bg-emerald-500" : "bg-rose-500"
                                )} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-8 bg-white/50 rounded-[2.5rem] border border-neutral-100 space-y-6">
                        <div className="w-12 h-12 rounded-2xl bg-neutral-900 flex items-center justify-center text-white">
                            <Factory className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="block text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Manufactured By</span>
                            <h4 className="text-lg font-black text-neutral-900 leading-tight mb-2">{manufacturer}</h4>
                            <p className="text-[10px] font-medium text-neutral-500 leading-relaxed uppercase tracking-tight">
                                Plot 44-A, Industrial Growth Centre, Phase II, Khorda, Odisha - 752054
                            </p>
                        </div>
                    </div>

                    <div className="p-8 bg-white/50 rounded-[2.5rem] border border-neutral-100 space-y-6">
                        <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-900 border border-neutral-200">
                            <Package className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="block text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Marketed & Packed By</span>
                            <h4 className="text-lg font-black text-neutral-900 leading-tight mb-2">{packer}</h4>
                            <p className="text-[10px] font-medium text-neutral-500 leading-relaxed uppercase tracking-tight">
                                12th Floor, Empire Tower, SV Road, Andheri West, Mumbai - 400058
                            </p>
                        </div>
                    </div>

                    <div className="md:col-span-2 p-8 bg-neutral-900 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 text-white group">
                        <div className="flex items-center gap-6">
                            <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center shrink-0">
                                <Flag className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <span className="block text-[9px] font-black uppercase tracking-widest text-primary">Regional Provenance</span>
                                <p className="text-sm font-black italic tracking-tighter">Proudly crafted and sourced within Bharat.</p>
                            </div>
                        </div>
                        <div className="px-6 py-3 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest">ISO 22000 Certified</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
