"use client"

import { useState, useEffect } from "react"
import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { ScaleTap } from "@/components/ui/motion-primitives"

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
        <div className="border-t flex flex-col" style={{ paddingTop: 'var(--component-gap)', gap: 'var(--component-gap)' }}>
            {options.map((option) => (
                <div key={option.name} className="flex flex-col" style={{ gap: 'calc(var(--component-gap) * 0.5)' }}>
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">
                            {option.name}: <span className="text-[var(--text-primary)]">{selectedOptions[option.name]}</span>
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {option.values.map((value) => {
                            const isSelected = selectedOptions[option.name] === value
                            const available = isOptionAvailable(option.name, value)

                            return (
                                <ScaleTap key={value}>
                                    <button
                                        onClick={() => setSelectedOptions(prev => ({ ...prev, [option.name]: value }))}
                                        disabled={!available}
                                        className={cn(
                                            "relative h-10 min-w-[3rem] px-4 flex items-center justify-center rounded-[var(--radius-md)] text-sm font-bold border transition-all duration-300",
                                            isSelected
                                                ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)] shadow-sm"
                                                : "bg-[var(--bg-primary)] text-[var(--text-primary)] border-[var(--border)] hover:border-[var(--text-primary)]/30 hover:bg-[var(--bg-secondary)]",
                                            !available && "opacity-40 cursor-not-allowed bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-transparent line-through"
                                        )}
                                    >
                                        {value}
                                        {isSelected && (
                                            <motion.div
                                                layoutId={`active-${option.name}`}
                                                className="absolute inset-0 border-2 border-[var(--primary)] z-10 rounded-[var(--radius-md)]"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                    </button>
                                </ScaleTap>

                            )
                        })}
                    </div>
                </div>
            ))}
        </div>
    )
}
