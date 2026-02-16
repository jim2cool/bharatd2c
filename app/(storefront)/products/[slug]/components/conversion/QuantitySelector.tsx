"use client"

import { Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface QuantitySelectorProps {
    qty: number
    onQtyChange: (qty: number) => void
    min?: number
    max?: number
}

export function QuantitySelector({ qty, onQtyChange, min = 1, max = 10 }: QuantitySelectorProps) {
    const handleDecrease = () => {
        if (qty > min) onQtyChange(qty - 1)
    }

    const handleIncrease = () => {
        if (qty < max) onQtyChange(qty + 1)
    }

    return (
        <div className="flex items-center gap-2 py-1.5 border-y border-[var(--border)]">
            <span className="text-sm font-medium text-[var(--text-secondary)]">Quantity</span>
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 bg-[var(--bg-primary)] hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] border-[var(--border)]"
                    onClick={handleDecrease}
                    disabled={qty <= min}
                    aria-label="Decrease quantity"
                >
                    <Minus className="h-4 w-4" />
                </Button>
                <span className="w-10 text-center font-semibold text-lg text-[var(--text-primary)]">
                    {qty}
                </span>
                <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 bg-[var(--bg-primary)] hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] border-[var(--border)]"
                    onClick={handleIncrease}
                    disabled={qty >= max}
                    aria-label="Increase quantity"
                >
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
