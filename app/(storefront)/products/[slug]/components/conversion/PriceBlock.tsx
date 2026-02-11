import { cn } from "@/lib/utils"

interface PriceBlockProps {
    mrp: number
    sellingPrice: number
    percentageOff?: number
    savingsAmount: number
    className?: string
}

export function PriceBlock({ mrp, sellingPrice, percentageOff, savingsAmount, prepaidSavings, className }: PriceBlockProps & { prepaidSavings?: number }) {
    const calculatedPercentage = percentageOff || Math.round(((mrp - sellingPrice) / mrp) * 100)

    return (
        <div className={cn("flex flex-col gap-1", className)}>
            {/* Dawn-style price: simple, clean, left-aligned */}
            <div className="flex items-baseline gap-2">
                <span className="text-xl md:text-2xl font-semibold text-foreground">
                    ₹{sellingPrice.toLocaleString()}
                </span>
                {savingsAmount > 0 && (
                    <>
                        <span className="text-sm text-muted-foreground line-through">
                            ₹{mrp.toLocaleString()}
                        </span>
                        <span className="text-sm font-medium text-green-700 dark:text-green-500">
                            {calculatedPercentage}% off
                        </span>
                    </>
                )}
            </div>

            {/* Prepaid Savings Nudge */}
            {prepaidSavings && prepaidSavings > 0 && (
                <div className="flex items-center gap-1.5 text-xs font-medium text-saffron-700 bg-saffron-50 px-2 py-1 rounded w-fit mt-1">
                    <span role="img" aria-label="money">💰</span>
                    Pay online & get extra ₹{prepaidSavings} OFF
                </div>
            )}

            {/* Tax note - subtle */}
            <span className="text-[10px] text-muted-foreground mt-1">
                Tax included.{' '}
                <span className="underline underline-offset-2 cursor-pointer hover:text-foreground transition-colors">
                    Shipping
                </span>
                {' '}calculated at checkout.
            </span>
        </div>
    );
}
