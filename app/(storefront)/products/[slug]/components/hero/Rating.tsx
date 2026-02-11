import { Star, StarHalf } from "lucide-react"
import { cn } from "@/lib/utils"

interface RatingProps {
    rating: number
    reviewCount: number
    className?: string
    size?: "sm" | "md"
}

export function Rating({ rating, reviewCount, className, size = "md" }: RatingProps) {
    // Dawn-style: clear, simple stars.
    // If rating is 4.5, we show 4 full, 1 half, 0 empty?
    // Or just 5 stars with fill?
    // Let's stick to the filled star approach for simplicity and clean look.

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <div key={star} className="relative">
                        {/* Background Star */}
                        <Star
                            className={cn(
                                "text-muted-foreground/30",
                                size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"
                            )}
                            strokeWidth={1.5}
                        />

                        {/* Foreground Star (Overlay) */}
                        <div
                            className="absolute top-0 left-0 overflow-hidden"
                            style={{
                                width: Math.max(0, Math.min(1, rating - (star - 1))) * 100 + "%"
                            }}
                        >
                            <Star
                                className={cn(
                                    "fill-primary text-primary",
                                    size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"
                                )}
                                strokeWidth={0}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Review Count - subtle and underlined like Dawn */}
            <span className={cn(
                "text-muted-foreground font-normal hover:text-foreground transition-colors cursor-pointer border-b border-transparent hover:border-foreground/40 leading-none",
                size === "sm" ? "text-xs" : "text-sm"
            )}>
                ({reviewCount} reviews)
            </span>
        </div>
    )
}
