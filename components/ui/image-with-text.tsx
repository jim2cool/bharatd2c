"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ImageWithTextProps {
    title?: string;
    text?: string;
    image?: string;
    ctaText?: string;
    ctaLink?: string;
    reverse?: boolean;
}

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1491336477066-31156b5e4f35?q=80&w=2070&auto=format&fit=crop";

export default function ImageWithText({
    title = "Curating Tomorrow's Memories",
    text = "Design your own rituals of gratitude. From handcrafted keepsakes to bespoke hampers, we ensure every gift leaves an indelible mark of affection and quality.",
    image,
    imageUrl, // Supporting both conventions
    ctaText = "Our Philosophy",
    ctaLink = "/about",
    reverse = false,
}: ImageWithTextProps & { imageUrl?: string }) {
    const finalImage = image || imageUrl || PLACEHOLDER_IMAGE;
    return (
        <section className="py-16 md:py-24 bg-[#F9F7F4]">
            <div className="container px-4 md:px-8 mx-auto max-w-[1600px]">
                <div className={`grid lg:grid-cols-2 gap-20 lg:gap-32 items-center ${reverse ? "lg:flex-row-reverse" : ""}`}>
                    <div className={`relative aspect-[4/5] overflow-hidden bg-[#F3F0E9] shadow-2xl ${reverse ? "lg:order-last" : ""}`}>
                        <Image
                            src={finalImage}
                            alt={title}
                            fill
                            className="object-cover transition-transform duration-1000 hover:scale-105"
                        />
                    </div>
                    <div className="space-y-12">
                        <header className="space-y-6">
                            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#e26a00]">Our Legacy</p>
                            <h2 className="text-5xl md:text-7xl lg:text-8xl font-serif font-normal tracking-tight leading-[1.0] text-charcoal-900">
                                {title}
                            </h2>
                        </header>
                        <div className="space-y-8 text-lg md:text-xl text-charcoal-500 font-light leading-relaxed max-w-xl font-sans">
                            <p>{text}</p>
                        </div>
                        {ctaText && ctaLink && (
                            <div className="pt-6">
                                <Button asChild size="lg" className="rounded-none bg-foreground text-primary-foreground hover:bg-foreground/90 h-16 px-16 uppercase tracking-[0.3em] text-[10px] font-bold transition-all shadow-xl">
                                    <Link href={ctaLink}>
                                        {ctaText}
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
