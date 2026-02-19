"use client"

import { useState, useEffect } from "react"
import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface Variant {
    id: string
    title: string
    price: number
    inventory: number
    options: Record<string, string>
}

interface VariantOption {
    name: string
    values: string[]
}

interface VariantSelectorProps {
    options: VariantOption[]
    variants: Variant[]
    onVariantSelect: (variant: Variant | null) => void
}

export function VariantSelector({ options, variants, onVariantSelect }: VariantSelectorProps) {
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})

    // Auto-select first options on load
    useEffect(() => {
        const defaults: Record<string, string> = {}
        options.forEach(opt => {
            if (opt.values.length > 0) {
                defaults[opt.name] = opt.values[0]
            }
        })
        setSelectedOptions(defaults)
    }, []) // Run once on mount

    // Find matching variant whenever options change
    useEffect(() => {
        if (Object.keys(selectedOptions).length === options.length) {
            const match = variants.find(v => {
                return Object.entries(selectedOptions).every(([key, val]) => v.options[key] === val)
            })
            onVariantSelect(match || null)
        } else {
            onVariantSelect(null)
        }
    }, [selectedOptions, variants, options.length, onVariantSelect])

    const isOptionAvailable = (optionName: string, value: string) => {
        // Simple check: is there ANY variant with this specific option value?
        // Advanced: is it available given CURRENT selections of OTHER options?
        // For now, simple check to see if it exists in the variants list at all
        return variants.some(v => v.options[optionName] === value)
    }

    return (
        <div className="space-y-4 py-4 border-t border-neutral-100">
            {options.map((option) => (
                <div key={option.name} className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-neutral-900 uppercase tracking-wide">
                            {option.name}: <span className="text-neutral-500">{selectedOptions[option.name]}</span>
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {option.values.map((value) => {
                            const isSelected = selectedOptions[option.name] === value
                            const available = isOptionAvailable(option.name, value)

                            return (
                                <button
                                    key={value}
                                    onClick={() => setSelectedOptions(prev => ({ ...prev, [option.name]: value }))}
                                    disabled={!available}
                                    className={cn(
                                        "relative px-5 py-2.5 rounded-xl text-xs font-bold border transition-all duration-200",
                                        isSelected
                                            ? "bg-primary text-primary-foreground border-primary shadow-[0_4px_12px_rgba(var(--primary-rgb),0.2)] transform scale-105"
                                            : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-900 hover:text-neutral-900",
                                        !available && "opacity-40 cursor-not-allowed bg-neutral-50 text-neutral-400 border-neutral-100 line-through"
                                    )}
                                >
                                    {value}
                                    {isSelected && (
                                        <div className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 rounded-full bg-white border border-neutral-100 flex items-center justify-center shadow-md">
                                            <Check className="w-3 h-3 text-primary stroke-[3px]" />
                                        </div>
                                    )}
                                </button>
                            )
                        })}
                    </div>
                </div>
            ))}
        </div>
    )
}
