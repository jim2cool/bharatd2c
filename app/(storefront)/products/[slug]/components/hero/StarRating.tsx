"use client"

import { Star, StarHalf } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
    rating: number
    reviewCount: number
    size?: "sm" | "md" | "lg"
    className?: string
    showCount?: boolean
}

export function StarRating({
    rating,
    reviewCount,
    size = "md",
    className,
    showCount = true
}: StarRatingProps) {
    // Ensure rating is between 0 and 5
    const clampedRating = Math.max(0, Math.min(5, rating))

    // Icon size mapping
    const iconSize = {
        sm: "w-3 h-3",
        md: "w-4 h-4",
        lg: "w-5 h-5"
    }

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <div className="flex items-center gap-0.5" aria-label={`Rating: ${clampedRating} out of 5 stars`}>
                {[1, 2, 3, 4, 5].map((star) => {
                    const isFull = clampedRating >= star
                    const isHalf = !isFull && clampedRating >= star - 0.5

                    return (
                        <div key={star} className="relative">
                            <Star
                                className={cn(
                                    iconSize[size],
                                    "text-muted-foreground/20 fill-muted-foreground/10"
                                )}
                                strokeWidth={1.5}
                            />
                            {isFull && (
                                <Star
                                    className={cn(
                                        iconSize[size],
                                        "absolute inset-0 text-[#FFB800] fill-[#FFB800]"
                                    )}
                                    strokeWidth={1}
                                />
                            )}
                            {isHalf && (
                                <div className="absolute inset-0 overflow-hidden w-[50%]">
                                    <Star
                                        className={cn(
                                            iconSize[size],
                                            "text-[#FFB800] fill-[#FFB800]"
                                        )}
                                        strokeWidth={1}
                                    />
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            {showCount && (
                <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={cn(
                        "font-bold text-foreground",
                        size === "sm" ? "text-sm" : "text-base"
                    )}>
                        {clampedRating.toFixed(1)}
                    </span>
                    <span className={cn(
                        "text-muted-foreground font-medium underline underline-offset-4 decoration-muted-foreground/30",
                        size === "sm" ? "text-xs" : "text-sm"
                    )}>
                        ({reviewCount.toLocaleString()} reviews)
                    </span>
                </div>
            )}
        </div>
    )
}
