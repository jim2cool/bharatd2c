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
        featured: Review[]
    }
}

export function Proof({ reviews, reviewCount }: ProofProps) {
    if (reviewCount === 0) return null

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

                    {/* Navigation - Top right or bottom? Dawn usually has arrows or dots. 
                        Let's put them absolute top-right aligned with title if possible, or simple side arrows. 
                        Simple side arrows are fine for now. */}
                    <div className="hidden md:block">
                        <CarouselPrevious className="left-[-3rem] h-10 w-10 border-none bg-transparent hover:bg-transparent text-foreground/50 hover:text-foreground" />
                        <CarouselNext className="right-[-3rem] h-10 w-10 border-none bg-transparent hover:bg-transparent text-foreground/50 hover:text-foreground" />
                    </div>
                </Carousel>
            </div>
        </section>
    )
}
