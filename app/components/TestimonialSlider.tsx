"use client";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Star } from "lucide-react";

const defaultTestimonials = [
    {
        quote: "Clean packaging and exactly what I was looking for. The formula feels incredible on my skin.",
        name: "Ananya Sharma",
        city: "Mumbai",
    },
    {
        quote: "Feels premium without being overpriced. I've switched my entire routine to these products.",
        name: "Rohit Mehta",
        city: "Bangalore",
    },
    {
        quote: "Simple products that do their job well. No nonsense, just good skincare.",
        name: "Megha Kapoor",
        city: "Delhi",
    },
];

export default function TestimonialSlider({
    testimonials = defaultTestimonials,
    title = "Loved solely for results",
    subtitle = "Join thousands of others who have upgraded their daily ritual."
}: {
    testimonials?: any[];
    title?: string;
    subtitle?: string;
}) {
    return (
        <section className="py-20 md:py-32 bg-muted/20 border-y border-border/40">
            <div className="container px-4 md:px-6 mx-auto max-w-[1400px]">
                <header className="mb-16 md:mb-24 text-center">
                    <h2 className="text-3xl md:text-5xl font-normal tracking-tight text-foreground mb-4">
                        {title}
                    </h2>
                    <p className="text-muted-foreground text-sm md:text-xl max-w-2xl mx-auto">
                        {subtitle}
                    </p>
                </header>

                <Carousel
                    opts={{
                        align: "center",
                        loop: true,
                    }}
                    className="w-full max-w-6xl mx-auto"
                >
                    <CarouselContent className="-ml-4">
                        {testimonials.map((t, i) => (
                            <CarouselItem key={i} className="pl-4 md:basis-2/3 lg:basis-1/2">
                                <div className="h-full p-8 md:p-12 lg:p-16 flex flex-col items-center text-center gap-6 md:gap-8 bg-background border border-border/40 shadow-sm hover:shadow-md transition-all duration-500">
                                    <div className="flex gap-1 text-black">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star key={s} className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                                        ))}
                                    </div>
                                    <blockquote className="text-lg md:text-2xl lg:text-3xl text-foreground font-light leading-relaxed">
                                        &ldquo;{t.quote}&rdquo;
                                    </blockquote>
                                    <div className="mt-auto">
                                        <cite className="not-italic text-sm font-bold uppercase tracking-widest text-foreground">
                                            {t.name}
                                        </cite>
                                        <span className="block text-xs text-muted-foreground mt-1 tracking-wider">
                                            {t.city}
                                        </span>
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <div className="block mt-8 flex justify-center gap-4">
                        <div className="flex justify-center gap-4 w-full relative h-12">
                            <CarouselPrevious className="static translate-y-0 h-12 w-12 border-border/40 hover:bg-foreground hover:text-background transition-colors" />
                            <CarouselNext className="static translate-y-0 h-12 w-12 border-border/40 hover:bg-foreground hover:text-background transition-colors" />
                        </div>
                    </div>
                </Carousel>
            </div>
        </section>
    );
}
