import { ShieldCheck, RefreshCw, Truck, Lock } from "lucide-react"

export function TrustStrip() {
    const items = [
        { icon: Truck, label: "Free shipping" },
        { icon: RefreshCw, label: "7-day returns" },
        { icon: ShieldCheck, label: "100% genuine" },
        { icon: Lock, label: "Secure payment" },
    ]

    return (
        <div className="flex items-center justify-center flex-wrap gap-x-6 gap-y-2 text-[11px] text-muted-foreground/80 pt-2 border-t border-border/40 mt-2">
            {items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5 uppercase tracking-wide">
                    <item.icon className="h-3.5 w-3.5 text-foreground/40" strokeWidth={1.5} />
                    <span>{item.label}</span>
                </div>
            ))}
        </div>
    )
}
