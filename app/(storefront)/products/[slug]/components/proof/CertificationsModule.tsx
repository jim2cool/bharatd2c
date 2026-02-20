"use client"

import React from 'react'
import { CheckCircle2 } from 'lucide-react'

export const CertificationsModule = () => (
    <div className="flex flex-wrap gap-3">
        {['FSSAI Approved', 'Organic Certified', 'Dermatologist Tested', '100% Vegan'].slice(0, 2).map(c => (
            <div key={c} className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-100">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                <span className="text-[10px] font-black uppercase tracking-widest text-green-700">{c}</span>
            </div>
        ))}
    </div>
);
