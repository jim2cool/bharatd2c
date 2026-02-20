"use client"

import React from 'react'
import { Zap } from 'lucide-react'

export const FabricDetailsModule = ({ fabric, care }: { fabric?: string, care?: string }) => {
    if (!fabric && !care) return null;
    return (
        <div className="p-6 bg-white border rounded-[2.5rem] shadow-sm border-neutral-100">
            <div className="flex items-center gap-4">
                <div className="p-4 bg-orange-50 rounded-2xl"><Zap className="w-6 h-6 text-orange-500" /></div>
                <div>
                    <h3 className="text-xs font-black uppercase tracking-widest">Fabric & Care</h3>
                    <p className="text-[11px] text-neutral-500 mt-1 font-medium italic">
                        {fabric || 'Premium Quality'}
                        {care && <span className="block mt-1 text-neutral-400 not-italic">Care: {care}</span>}
                    </p>
                </div>
            </div>
        </div>
    );
};
