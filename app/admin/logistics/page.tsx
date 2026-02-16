'use client'

import { Truck, Package, Globe, ExternalLink, ShieldCheck } from "lucide-react"

export default function LogisticsPage() {
    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <header className="flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-black text-neutral-900 tracking-tight">Logistics</h1>
                    <p className="text-neutral-500 text-sm font-medium mt-1">Manage your shipping partners and track deliveries.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-2xl text-xs font-black hover:bg-neutral-800 transition-all shadow-xl active:scale-95">
                    Connect Partner
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* NIMBUS POST */}
                <div className="pulse-card p-8 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:rotate-12 transition-transform duration-500">
                        <Truck className="w-24 h-24" />
                    </div>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                            <Package className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-neutral-900 tracking-tight mt-1">Nimbus Post</h3>
                            <div className="flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3 text-green-500" />
                                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Official Partner</span>
                            </div>
                        </div>
                    </div>
                    <p className="text-sm font-medium text-neutral-500 leading-relaxed mb-8">
                        India's most trusted logistics aggregator. Access BlueDart, Delhivery, and Xpressbees in one click.
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-[10px] font-black rounded-lg uppercase tracking-widest">Coming Soon</span>
                        <button className="text-[10px] font-black uppercase tracking-widest text-blue-600 flex items-center gap-2">
                            Learn More <ExternalLink className="w-3 h-3" />
                        </button>
                    </div>
                </div>

                {/* SHIPROCKET */}
                <div className="pulse-card p-8 group relative overflow-hidden opacity-60 grayscale">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:rotate-12 transition-transform duration-500">
                        <Truck className="w-24 h-24" />
                    </div>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-neutral-400">
                            <Package className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-neutral-900 tracking-tight mt-1">Shiprocket</h3>
                            <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Future Integration</span>
                        </div>
                    </div>
                    <p className="text-sm font-medium text-neutral-400 leading-relaxed mb-8">
                        Complete shipping solution for e-commerce. Integrate Shiprocket for pan-India presence.
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                        <span className="px-3 py-1 bg-neutral-100 text-neutral-400 text-[10px] font-black rounded-lg uppercase tracking-widest">Planned</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
