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
            {/* Dawn-style price: simple, clean, left-aligned */}
            <div className="flex items-baseline gap-1.5">
                <span className="text-sm md:text-base font-bold text-muted-foreground -mb-2 md:-mb-1">₹</span>
                <span className="text-3xl md:text-4xl font-black tracking-tighter text-foreground">
                    {sellingPrice.toLocaleString()}
                </span>
                {savingsAmount > 0 && (
                    <div className="flex flex-col items-start leading-none ml-2">
                        <span className="text-[10px] md:text-xs text-muted-foreground line-through decoration-red-500/50">
                            ₹{mrp.toLocaleString()}
                        </span>
                        <span className="text-[10px] md:text-xs font-bold text-green-600 uppercase tracking-wider">
                            {calculatedPercentage}% off
                        </span>
                    </div>
                )}
            </div>



            {/* Scarcity Nudge */}
            {stock !== undefined && stock > 0 && stock < 10 && (
                <div className="flex items-center gap-2 mt-2 bg-red-50 border border-red-100 px-3 py-1.5 rounded-lg w-fit">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    <span className="text-[11px] font-black uppercase tracking-wider text-red-600">
                        Hurry! Only {stock} left
                    </span>
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
