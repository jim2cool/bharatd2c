"use client"

import * as React from "react"
import { Review } from "../../types/pdp"
import { ReviewCard } from "./ReviewCard"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from "@/components/ui/carousel"

interface ProofProps {
    rating: number
    reviewCount: number
    reviews: {
        featured: any[]
    }
    compact?: boolean
}

export function Proof({ reviews, reviewCount, compact = false }: ProofProps) {
    if (reviewCount === 0) return null

    if (compact) {
        return (
            <div data-cluster="proof-compact" className="space-y-4">
                <h3 className="text-sm font-bold tracking-tight uppercase text-slate-400">What customers say</h3>
                <div className="flex flex-col gap-3">
                    {reviews.featured.slice(0, 2).map((review) => (
                        <div key={review.id} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <div className="flex gap-1 mb-1">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className={`text-[10px] ${i < (review.rating || 5) ? 'text-orange-400' : 'text-slate-200'}`}>★</span>
                                ))}
                            </div>
                            <p className="text-xs font-medium text-slate-700 line-clamp-2 italic">"{review.content}"</p>
                            <p className="text-[10px] font-bold text-slate-400 mt-2">— {review.author}</p>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <section data-cluster="proof" className="py-8 md:py-12 border-t border-border/10">
            <h2 className="text-xl md:text-2xl font-normal mb-8 px-4 md:px-0 tracking-tight text-foreground text-center md:text-left">
                What our customers say
            </h2>

            <div className="w-full relative px-0">
                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-4">
                        {reviews.featured.map((review) => (
                            <CarouselItem key={review.id} className="pl-4 basis-[85%] md:basis-1/3 lg:basis-1/4">
                                <ReviewCard review={review} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    <div className="hidden md:block">
                        <CarouselPrevious className="left-[-3rem] h-10 w-10 border-none bg-transparent hover:bg-transparent text-foreground/50 hover:text-foreground" />
                        <CarouselNext className="right-[-3rem] h-10 w-10 border-none bg-transparent hover:bg-transparent text-foreground/50 hover:text-foreground" />
                    </div>
                </Carousel>
            </div>
        </section>
    )
}
