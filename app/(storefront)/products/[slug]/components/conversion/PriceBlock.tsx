import { cn } from "@/lib/utils"

interface PriceBlockProps {
    mrp: number
    sellingPrice: number
    percentageOff?: number
    savingsAmount: number
    className?: string
}

export function PriceBlock({ mrp, sellingPrice, percentageOff, savingsAmount, prepaidSavings, stock, className }: PriceBlockProps & { prepaidSavings?: number; stock?: number }) {
    const calculatedPercentage = percentageOff || Math.round(((mrp - sellingPrice) / mrp) * 100)

    return (
        <div className={cn("flex flex-col gap-1", className)}>
            {/* Price row */}
            <div className="flex items-baseline gap-1.5">
                <span className="text-sm md:text-base font-semibold text-[var(--text-secondary)] -mb-2 md:-mb-1">₹</span>
                <span className="text-3xl md:text-4xl font-bold tracking-tighter text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-mono, inherit)' }}>
                    {sellingPrice.toLocaleString()}
                </span>
                {savingsAmount > 0 && (
                    <div className="flex flex-col items-start leading-none ml-2">
                        <span className="text-[10px] md:text-xs text-[var(--text-secondary)] line-through">
                            ₹{mrp.toLocaleString()}
                        </span>
                        <span className="text-[10px] md:text-xs font-semibold text-[var(--badge-text)] bg-[var(--badge-bg)] rounded-[var(--radius-badge)] px-1.5 py-0.5 uppercase tracking-wider">
                            {calculatedPercentage}% off
                        </span>
                    </div>
                )}
            </div>

            {/* Scarcity Nudge — uses urgency tokens so all mood cards express it correctly */}
            {stock !== undefined && stock > 0 && stock < 10 && (
                <div className="flex items-center gap-2 mt-2 bg-[var(--urgency-bg)] border border-[var(--callout-border)] px-3 py-1.5 rounded-[var(--radius-badge)] w-fit">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--urgency-text)] opacity-60"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--urgency-text)]"></span>
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--urgency-text)]">
                        Hurry! Only {stock} left
                    </span>
                </div>
            )}

            {/* Tax note */}
            <span className="text-[10px] text-[var(--text-secondary)] mt-1">
                Tax included.{' '}
                <span className="underline underline-offset-2 cursor-pointer hover:text-[var(--text-primary)] transition-colors">
                    Shipping
                </span>
                {' '}calculated at checkout.
            </span>
        </div>
    );
}
