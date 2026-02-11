import { Review } from "../../types/pdp"
import { Star, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export function ReviewCard({ review }: { review: Review }) {
    return (
        <div className="h-full p-6 bg-muted/10 border border-border/20 rounded-sm flex flex-col justify-between transition-colors hover:bg-muted/20">
            <div>
                {/* Stars - Clean, Black, Small */}
                <div className="flex gap-0.5 mb-4">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            className={cn(
                                "w-3.5 h-3.5",
                                i < review.rating ? "fill-foreground text-foreground" : "text-muted-foreground/20"
                            )}
                            strokeWidth={0}
                        />
                    ))}
                </div>

                {/* Title/Content */}
                <h4 className="text-sm font-bold text-foreground mb-2 line-clamp-1">
                    {/* Assuming review might have a title, if not use part of content or generic */}
                    Great Product
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                    {review.content}
                </p>
            </div>

            {/* Author Footer */}
            <div className="mt-6 flex items-center justify-between border-t border-border/10 pt-4">
                <div className="flex flex-col">
                    <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        {review.author}
                        {review.verified && (
                            <CheckCircle className="w-3 h-3 text-foreground/60" />
                        )}
                    </span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">
                        Verified Buyer
                    </span>
                </div>
                <span className="text-[10px] text-muted-foreground">
                    {review.date}
                </span>
            </div>
        </div>
    )
}
