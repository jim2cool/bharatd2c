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

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop";

const defaultSlides = [
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
];

export default function HeroCarousel({ slides: propSlides }: { slides?: any[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const slides = (propSlides && propSlides.length > 0) ? propSlides : defaultSlides;

  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [api]);

  return (
    <section className="relative w-full h-[85vh] overflow-hidden bg-background">
      <Carousel
        setApi={setApi}
        opts={{
          loop: true,
          align: "start",
        }}
        className="w-full h-full"
      >
        <CarouselContent className="-ml-0 h-full">
          {slides.map((slide, index) => (
            <CarouselItem key={index} className="pl-0 relative h-[85vh] w-full">
              {/* Image Background */}
              <div className="absolute inset-0 w-full h-full">
                <Image
                  src={slide.image || slide.image_url || PLACEHOLDER_IMAGE}
                  alt={slide.title}
                  fill
                  priority={index === 0}
                  className="object-cover"
                />
                {/* Gradient Overlay for Contrast (P2-1) */}
                <div className="absolute inset-0 bg-black/30" />
              </div>

              {/* Content Overlay - Fashion Lifestyle Style */}
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 md:p-12 z-10 text-white">
                <div className="max-w-4xl space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-12 duration-1000">
                  <p className="text-xs md:text-sm font-sans font-bold tracking-[0.4em] uppercase text-white/90 drop-shadow-md">
                    {slide.subtitle}
                  </p>
                  <h1 className="text-5xl md:text-8xl lg:text-9xl font-serif font-normal tracking-tight leading-[1] drop-shadow-lg uppercase">
                    {slide.title}
                  </h1>
                  <div className="pt-8">
                    <Button
                      asChild
                      size="lg"
                      className="bg-white/10 backdrop-blur-md text-white hover:bg-white hover:text-black border border-white/30 rounded-full h-14 px-12 md:px-14 uppercase tracking-[0.2em] text-[10px] font-bold transition-all duration-500 shadow-2xl"
                    >
                      <Link href={slide.link || slide.cta_link || slide.ctaLink || "/"}>
                        {slide.cta || slide.cta_text || slide.ctaText || "Shop Now"}
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Minimal Navigation Arrows - Dawn Style */}
        <CarouselPrevious className="left-8 bg-transparent border-white/40 text-white hover:bg-white hover:text-black h-12 w-12 md:h-14 md:w-14 transition-all" />
        <CarouselNext className="right-8 bg-transparent border-white/40 text-white hover:bg-white hover:text-black h-12 w-12 md:h-14 md:w-14 transition-all" />

      </Carousel>

      {/* Dots Indicator */}
      <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-3 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`h-1.5 rounded-full transition-all duration-500 ${i === (api?.selectedScrollSnap() || 0)
              ? "bg-white w-12"
              : "bg-white/40 w-2 hover:bg-white/60"
              }`}
            onClick={() => api?.scrollTo(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-20 text-white/80 hidden md:block">
        <span className="text-xs uppercase tracking-widest">Scroll Down</span>
      </div>
    </section>
  );
}
