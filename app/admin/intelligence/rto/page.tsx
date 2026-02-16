"use client";

import { useEffect, useState } from "react";
import { getActiveStoreIdClient } from "@/lib/getActiveStore.client";
import { PageSkeleton } from "@/components/ui/Skeletons";
import { Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AutomationToggle } from "./components/AutomationToggle";
import { RiskAnalysis } from "./components/RiskAnalysis";
import { HoldQueue } from "./components/HoldQueue";
import { RTODegradationPrompts } from "@/app/admin/components/RTODegradationPrompts";

export default function RTOIntelligencePage() {
    const [storeId, setStoreId] = useState<string | null>(null);

    useEffect(() => {
        setStoreId(getActiveStoreIdClient());
    }, []);

    if (!storeId) return <PageSkeleton />;

    return (
        <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Link href="/admin" className="p-2 bg-white rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                            <ArrowLeft className="w-4 h-4 text-slate-400" />
                        </Link>
                        <div className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                            Mission Control
                        </div>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
                        RTO Intelligence <Sparkles className="w-8 h-8 text-blue-600 animate-pulse" />
                    </h1>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed max-w-xl">
                        Centralized risk management and return-to-origin protection.
                        Optimize your verification loops and recover lost revenue gaps.
                    </p>
                </div>

                <div className="w-full md:w-80">
                    <AutomationToggle storeId={storeId} />
                </div>
            </div>

            {/* ANALYTICS SECTION */}
            <section className="space-y-6">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                    <h2 className="text-sm font-black text-slate-900 uppercase tracking-tighter">Performance Intelligence</h2>
                </div>
                <RiskAnalysis storeId={storeId} />
            </section>

            {/* MAIN CONTENT GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* HOLD QUEUE - 2/3 WIDTH */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-amber-500 rounded-full" />
                        <h2 className="text-sm font-black text-slate-900 uppercase tracking-tighter">Action Required</h2>
                    </div>
                    <HoldQueue storeId={storeId} />
                </div>

                {/* DEGRADATION PROMPTS - 1/3 WIDTH */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-red-500 rounded-full" />
                        <h2 className="text-sm font-black text-slate-900 uppercase tracking-tighter">Optimization Gaps</h2>
                    </div>
                    <div className="bg-slate-50/50 rounded-[3rem] p-4 border-2 border-slate-50">
                        <RTODegradationPrompts storeId={storeId} />
                    </div>
                </div>
            </div>
        </div>
    );
}
