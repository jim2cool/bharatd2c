"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

const slides = [
  {
    image: "/hero.jpg",
    title: "Everyday Care, Done Right",
    subtitle: "Clean formulations. Honest pricing. No noise.",
    cta: "Shop Now",
    link: "/products"
  },
  {
    image: "/hero2.jpg",
    title: "Pure & Potent",
    subtitle: "Ingredients that actually work for your skin.",
    cta: "Explore Serums",
    link: "/products"
  },
  {
    image: "/hero3.jpg",
    title: "Simple Routines",
    subtitle: "Less steps, more glow.",
    cta: "View Bundles",
    link: "/products"
  }
];

export default function HeroCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [api]);

  return (
    <section className="relative w-full overflow-hidden bg-background">
      <Carousel
        setApi={setApi}
        opts={{
          loop: true,
          align: "start",
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-0">
          {slides.map((slide, index) => (
            <CarouselItem key={index} className="pl-0 relative min-h-[500px] md:min-h-[650px] w-full">
              {/* Image Background */}
              <div className="absolute inset-0 w-full h-full">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority={index === 0}
                  className="object-cover"
                />
                {/* Gradient Overlay for Contrast (P2-1) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40 z-[5]" />
              </div>

              {/* Content Overlay - Dawn Style (Bottom Left or Center) */}
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 md:p-12 z-10 text-white">
                <div className="max-w-2xl space-y-4 md:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <h1 className="text-4xl md:text-6xl font-medium tracking-tight leading-[1.1] drop-shadow-md">
                    {slide.title}
                  </h1>
                  <p className="text-lg md:text-xl font-light text-white/95 max-w-lg mx-auto leading-relaxed drop-shadow-sm">
                    {slide.subtitle}
                  </p>
                  <div className="pt-4">
                    <Button
                      asChild
                      size="lg"
                      className="bg-white text-black hover:bg-white/90 border-none rounded-none h-12 px-8 uppercase tracking-widest text-sm font-bold"
                    >
                      <Link href={slide.link}>
                        {slide.cta}
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Minimal Navigation Arrows - Dawn Style */}
        <CarouselPrevious className="left-4 bg-transparent border-white/30 text-white hover:bg-white/20 hover:text-white h-10 w-10 md:h-12 md:w-12" />
        <CarouselNext className="right-4 bg-transparent border-white/30 text-white hover:bg-white/20 hover:text-white h-10 w-10 md:h-12 md:w-12" />

      </Carousel>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === (api?.selectedScrollSnap() || 0)
              ? "bg-white w-8"
              : "bg-white/40 hover:bg-white/60"
              }`}
            onClick={() => api?.scrollTo(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
