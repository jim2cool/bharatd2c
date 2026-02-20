'use client'

import { ShoppingBag, Box, Database, ExternalLink, Rocket, Layers } from "lucide-react"

export default function DropshippingPage() {
    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <header className="flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-black text-neutral-900 tracking-tight">Dropshipping</h1>
                    <p className="text-neutral-500 text-sm font-medium mt-1">Scale your inventory without holding stock.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl text-xs font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95">
                    Source Products
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* SUPPLIER CLOUD */}
                <div className="pulse-card p-10 group relative overflow-hidden bg-gradient-to-br from-white to-neutral-50 border-blue-100">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-500">
                        <Rocket className="w-32 h-32" />
                    </div>
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-blue-100">
                            ⚡ Priority Sync
                        </div>
                        <h2 className="text-2xl font-black text-neutral-900 tracking-tight mb-4">Supplier Cloud</h2>
                        <p className="text-neutral-500 font-medium leading-relaxed mb-8 max-w-sm">
                            Connect to the supplier network. Instant sync for products, orders, and automated fulfillment.
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-10">
                            <div className="p-4 bg-white border border-slate-100 rounded-2xl">
                                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Stock Items</p>
                                <p className="text-xl font-black text-neutral-900">50,000+</p>
                            </div>
                            <div className="p-4 bg-white border border-slate-100 rounded-2xl">
                                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Avg. Margin</p>
                                <p className="text-xl font-black text-neutral-900">35%</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button className="flex-1 py-4 bg-neutral-900 text-white rounded-2xl text-xs font-black hover:bg-neutral-800 transition-all">
                                Configure API
                            </button>
                            <button className="px-6 py-4 bg-white border border-slate-100 text-neutral-900 rounded-2xl text-xs font-black hover:bg-slate-50 transition-all">
                                <ExternalLink className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* NIHO / OTHERS */}
                <div className="pulse-card p-10 group relative overflow-hidden bg-white border-dashed">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Layers className="w-32 h-32" />
                    </div>
                    <div className="relative z-10 h-full flex flex-col justify-center text-center">
                        <div className="w-16 h-16 bg-neutral-50 rounded-[2rem] border border-dashed border-neutral-200 flex items-center justify-center mx-auto mb-6">
                            <Box className="w-8 h-8 text-neutral-300" />
                        </div>
                        <h3 className="text-lg font-black text-neutral-400 tracking-tight mb-2">More Providers Coming</h3>
                        <p className="text-sm font-medium text-neutral-400 max-w-xs mx-auto">
                            We are working on integrating GlowRoad and Meesho Business to provide even more inventory options.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
