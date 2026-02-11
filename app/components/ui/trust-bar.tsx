"use client";

import { Truck, CreditCard, RefreshCw, Flag } from "lucide-react";

export function TrustBar() {
    const items = [
        { icon: Truck, label: "Free Shipping", sub: "On orders over ₹999" },
        { icon: CreditCard, label: "Cash on Delivery", sub: "Available nationwide" },
        { icon: RefreshCw, label: "Easy Returns", sub: "7-day hassle-free" },
        { icon: Flag, label: "Made for India", sub: "Designed for our climate" },
    ];

    return (
        <section className="bg-background border-t border-border/40">
            <div className="container px-4 md:px-6 py-12 mx-auto max-w-[1400px]">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                    {items.map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center gap-3">
                            <div className="p-3 rounded-full bg-muted/50 text-foreground">
                                <item.icon className="h-6 w-6" strokeWidth={1.5} />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">
                                    {item.label}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {item.sub}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
