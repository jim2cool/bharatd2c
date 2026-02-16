import { ShieldCheck, RefreshCw, Truck, Lock } from "lucide-react"

export function TrustStrip() {
    return (
        <div className="space-y-4 pt-4 border-t border-neutral-100 mt-2">
            {/* Value Propositions */}
            <div className="flex flex-wrap justify-between gap-3">
                <div className="flex items-center gap-2 bg-neutral-50 px-3 py-1.5 rounded-full border border-neutral-100">
                    <Truck className="h-3 w-3 text-indigo-600" />
                    <span className="text-[9px] font-black uppercase tracking-tighter text-neutral-600">Free Shipping</span>
                </div>
                <div className="flex items-center gap-2 bg-neutral-50 px-3 py-1.5 rounded-full border border-neutral-100">
                    <RefreshCw className="h-3 w-3 text-indigo-600" />
                    <span className="text-[9px] font-black uppercase tracking-tighter text-neutral-600">7-Day Returns</span>
                </div>
                <div className="flex items-center gap-2 bg-neutral-50 px-3 py-1.5 rounded-full border border-neutral-100">
                    <ShieldCheck className="h-3 w-3 text-indigo-600" />
                    <span className="text-[9px] font-black uppercase tracking-tighter text-neutral-600">100% Genuine</span>
                </div>
            </div>

            {/* Payment Trust */}
            <div className="bg-neutral-50/50 rounded-xl p-3 border border-neutral-100/50 flex flex-col items-center gap-2">
                <div className="flex items-center gap-1.5 mb-1">
                    <Lock className="w-2.5 h-2.5 text-neutral-400" />
                    <span className="text-[8px] font-black text-neutral-400 uppercase tracking-widest">Secure Checkout</span>
                </div>

                <div className="flex items-center gap-4 opacity-40 grayscale hover:grayscale-0 transition-all">
                    {/* Simplified SVG Logos for Premium Feel */}
                    <svg className="h-4" viewBox="0 0 48 16" fill="currentColor"><path d="M18.3 15.5l1.6-9.9h2.6l-1.6 9.9h-2.6zm8.1-9.9c-.6-.2-1.5-.5-2.6-.5-2.8 0-4.8 1.5-4.8 3.7 0 1.6 1.4 2.5 2.5 3 1.1.5 1.5.9 1.5 1.4 0 .8-.9 1.2-1.8 1.2-1.2 0-1.8-.2-2.8-.6l-.4-.2-.4 2.4c.7.3 1.9.6 3.2.6 3 0 5-1.5 5-3.8 0-1.3-.8-2.2-2.5-3.1-1-.5-1.7-.9-1.7-1.5 0-.5.6-1.1 1.8-1.1.9 0 1.6.2 2.1.4l.2.1.4-2.4zm10.7 6.4c0 .1.1.2.1.2l1.1-3s-.2-.5-.4-.5c-.3 0-.7.3-1 1.2l-.7 3.3.9-1.2zm-4.7-6.4l-2.2 9.9h2.7l.4-2.8h3.3l.3 2.8h2.6l-2.3-9.9h-4.8zm-15.1 0l-4.1 6.8-.4-2.1c-.5-1.7-2-4.1-3.7-4.7h-4.7v.5c1.1.2 2.3.6 3 1.2.4.4.6.8.8 1.6l1.3 7.6h2.8l4.1-9.9h-3.1z" /></svg>
                    <svg className="h-6" viewBox="0 0 32 20" fill="currentColor"><circle cx="11" cy="10" r="10" fillOpacity="0.8" /><circle cx="21" cy="10" r="10" fillOpacity="0.5" /><path d="M16 4.2c1.4 1.4 2.2 3.3 2.2 5.3s-.8 3.9-2.2 5.3c-1.4-1.4-2.2-3.3-2.2-5.3s.8-3.9 2.2-5.3z" /></svg>
                    <svg className="h-3" viewBox="0 0 60 20" fill="currentColor"><path d="M11 2h3l-4 16h-3l4-16zM19 2h3l-4 16h-3l4-16zM28 2h3l-4 16h-3l4-16zM40 2h10c4 0 7 2 7 5s-3 5-7 5h-7l-1 6h-3l3-16zm10 7c2 0 4-1 4-2s-2-2-4-2h-6l-1 4h7zM3 10c0-4 3-8 7-8s7 4 7 8-3 8-7 8-7-4-7-8z" /></svg>
                </div>
            </div>
        </div>
    )
}
