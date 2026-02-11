"use client"

import { BundleOption } from "../../types/pdp"
import { cn } from "@/lib/utils"

interface BundleSelectorProps {
    bundles: BundleOption[]
    selectedBundleId: string
    onSelect: (id: string) => void
}

export function BundleSelector({ bundles, selectedBundleId, onSelect }: BundleSelectorProps) {
    if (!bundles || bundles.length === 0) return null

    return (
        <div className="flex flex-col gap-3 my-4">
            <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-foreground uppercase tracking-widest">
                    Select Quantity
                </label>
                {/* Optional: 'Best Value' label hint if needed here */}
            </div>

            {/* Dawn-style Grid: 3 columns restored */}
            <div className="grid grid-cols-3 gap-3">
                {bundles.map((bundle) => {
                    const isSelected = selectedBundleId === bundle.id

                    return (
                        <button
                            key={bundle.id}
                            onClick={() => onSelect(bundle.id)}
                            className={cn(
                                "relative flex flex-col items-center justify-between p-3 border-2 rounded-sm transition-all text-center h-full min-h-[80px]",
                                isSelected
                                    ? "border-primary bg-primary/[0.02]"
                                    : "border-border/60 hover:border-foreground/40 bg-background"
                            )}
                        >
                            {/* Tags: "Best Value" / "Most Popular" */}
                            {bundle.badge && (
                                <span
                                    className={cn(
                                        "absolute -top-2.5 inset-x-0 mx-auto w-fit px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full shadow-sm z-10",
                                        isSelected
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted text-muted-foreground border border-border"
                                    )}
                                    // Saffron accent if it's "Best Value"
                                    style={bundle.badge.toLowerCase().includes('best') || bundle.badge.toLowerCase().includes('popular') ? {
                                        backgroundColor: 'var(--saffron-500, #e26a00)',
                                        color: '#ffffff',
                                        border: 'none'
                                    } : {}}
                                >
                                    {bundle.badge}
                                </span>
                            )}

                            <div className="flex flex-col items-center gap-0.5 mt-1">
                                <span className={cn("text-sm font-bold", isSelected ? "text-foreground" : "text-foreground/80")}>
                                    {bundle.unitCount} {bundle.unitCount === 1 ? "Unit" : "Units"}
                                </span>
                                <span className="text-xs text-muted-foreground font-medium">
                                    ₹{bundle.sellingPrice}
                                </span>
                            </div>

                            {/* Savings Hint */}
                            {bundle.mrp > bundle.sellingPrice && (
                                <span className="text-[10px] text-green-600 font-bold mt-1">
                                    Save ₹{bundle.mrp - bundle.sellingPrice}
                                </span>
                            )}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
