"use client"
import * as React from 'react'
import { useState, useCallback } from "react"
import Image from "next/image"
import useEmblaCarousel from "embla-carousel-react"
import { MediaItem } from "../../types/pdp"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import { FadeIn, ScaleTap } from "@/components/ui/motion-primitives"

import { usePDP } from '@/app/(storefront)/products/[slug]/context/PDPContext';

interface MediaGalleryProps {
    media: MediaItem[]
}

export function MediaGallery({ media }: MediaGalleryProps) {
    const { storeConfig } = usePDP();
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" })
    const [selectedIndex, setSelectedIndex] = useState(0)

    const [canScrollPrev, setCanScrollPrev] = useState(false)
    const [canScrollNext, setCanScrollNext] = useState(false)

    // ... callbacks remain the same

    const onSelect = useCallback(() => {
        if (!emblaApi) return
        setSelectedIndex(emblaApi.selectedScrollSnap())
        setCanScrollPrev(emblaApi.canScrollPrev())
        setCanScrollNext(emblaApi.canScrollNext())
    }, [emblaApi])

    React.useEffect(() => {
        if (!emblaApi) return
        onSelect()
        emblaApi.on("select", onSelect)
        emblaApi.on("reInit", onSelect)

        return () => {
            emblaApi.off("select", onSelect)
            emblaApi.off("reInit", onSelect)
        }
    }, [emblaApi, onSelect])

    const scrollTo = useCallback(
        (index: number) => emblaApi && emblaApi.scrollTo(index),
        [emblaApi]
    )

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])

    const getAspectRatio = () => {
        const moodCard = storeConfig?.mood_card_selected || '';
        switch (moodCard) {
            case 'Luxury':
            case 'Spiritual':
            case 'Quiet Luxury':
                return 'aspect-[3/4]';
            case 'Heritage':
            case 'Clinical':
            case 'Zen':
            case 'Earth':
                return 'aspect-[4/5]';
            case 'Gourmet':
                // Note: Rasoi hero is full-bleed h-screen max-h-[55vh]
                // but gallery thumbnails follow 4:3
                return 'aspect-[4/3]';
            case 'Minimal':
            case 'Professional':
                return 'aspect-[4/3]';
            case 'Sleek':
            case 'Industrial':
                return 'aspect-[16/9]';
            case 'Bold':
            case 'Fresh':
            case 'Vibrant':
            case 'Playful':
            case 'Urban':
            default:
                return 'aspect-square';
        }
    };

    if (!media.length) return null

    const aspectRatio = getAspectRatio();

    return (
        <FadeIn className="flex flex-col gap-4 w-full relative group">
            {/* Main Carousel */}
            <div
                className="overflow-visible md:overflow-hidden border-none md:border bg-transparent md:bg-muted relative"
                ref={emblaRef}
                style={{ borderRadius: 'var(--radius-gallery, 0.75rem)' }}
            >
                {/* ... Carousel Content ... */}
                <div className="flex touch-pan-y shadow-none md:shadow-inner gap-2 md:gap-0 pl-4 md:pl-0">
                    {media.map((item, idx) => {
                        const isWeak = item.tier === 'weak';
                        const mood = storeConfig?.mood_card_selected || '';

                        // Compensatory rendering: weak images use bg-secondary (tone-accurate per ThemeProvider)
                        const getTier3Bg = () => 'bg-[var(--bg-secondary)]';

                        return (
                            <div
                                key={item.id}
                                className={cn(
                                    "relative min-w-0 flex-[0_0_85%] md:flex-[0_0_100%] pl-4 first:pl-0 md:pl-0 transition-opacity duration-500",
                                    isWeak && mood === 'Minimal' && "scale-[0.9]", // Reduction
                                    isWeak && ['Luxury', 'Spiritual', 'Quiet Luxury'].includes(mood) && "flex-[0_0_60%] mx-auto" // Hard flag reduction
                                )}
                            >
                                <div
                                    className={cn(
                                        "relative w-full overflow-hidden rounded-lg md:rounded-none group",
                                        aspectRatio,
                                        isWeak && getTier3Bg(),
                                        isWeak && "p-8", // Centering weak images
                                        mood === 'Sleek' && "shadow-[0_0_40px_rgba(var(--color-primary-rgb),0.2)]" // Adaptive Product Glow
                                    )}
                                >
                                    <Image
                                        src={item.src}
                                        alt={item.alt}
                                        fill
                                        className={cn(
                                            "object-cover transition-all duration-700",
                                            isWeak ? "object-contain" : "object-cover",
                                            ['Fresh', 'Vibrant'].includes(mood) && "saturate-[1.10] brightness-[1.10]", // Boost
                                            mood === 'Gourmet' && "sepia-[0.15] brightness-[1.05]", // Warmth
                                            isWeak && mood === 'Bold' && "brightness-[0.8] contrast-[1.2]" // Masking
                                        )}
                                        priority={idx === 0}
                                        sizes="(max-width: 768px) 85vw, 50vw"
                                    />
                                    {/* Noise Overlay Layer */}
                                    <div
                                        className="absolute inset-0 pointer-events-none opacity-[var(--noise-opacity,0)] mix-blend-overlay"
                                        style={{ backgroundImage: 'var(--noise-overlay)' }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Mobile Navigation: Arrows */}
                <div className="absolute inset-0 flex items-center justify-between p-2 md:hidden pointer-events-none">
                    <Button
                        variant="secondary"
                        size="icon"
                        className={cn(
                            "h-8 w-8 rounded-[var(--radius-badge)] bg-[var(--bg-primary)]/80 hover:bg-[var(--bg-primary)]/90 shadow-[var(--shadow-card)] pointer-events-auto transition-opacity",
                            !canScrollPrev ? "opacity-0" : "opacity-100"
                        )}
                        onClick={scrollPrev}
                        disabled={!canScrollPrev}
                        style={{ borderRadius: 'var(--radius-button, 9999px)' }}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Previous slide</span>
                    </Button>
                    <Button
                        variant="secondary"
                        size="icon"
                        className={cn(
                            "h-8 w-8 rounded-[var(--radius-badge)] bg-[var(--bg-primary)]/80 hover:bg-[var(--bg-primary)]/90 shadow-[var(--shadow-card)] pointer-events-auto transition-opacity",
                            !canScrollNext ? "opacity-0" : "opacity-100"
                        )}
                        onClick={scrollNext}
                        disabled={!canScrollNext}
                        style={{ borderRadius: 'var(--radius-button, 9999px)' }}
                    >
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">Next slide</span>
                    </Button>
                </div>

                {/* Mobile Navigation: Dots */}
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 md:hidden">
                    {media.map((_, index) => (
                        <button
                            key={index}
                            className={cn(
                                "w-1.5 h-1.5 rounded-full transition-all shadow-sm",
                                index === selectedIndex ? "bg-[var(--primary)] w-3" : "bg-[var(--primary)]/40"
                            )}
                            onClick={() => scrollTo(index)}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* Thumbnails - Desktop Only - With Shared Layout Animation */}
            <div className="hidden md:flex gap-2 overflow-x-auto pb-1 scrollbar-hide p-1">
                {media.map((item, index) => {
                    const isSelected = index === selectedIndex;
                    return (
                        <ScaleTap key={item.id}>
                            <button
                                onClick={() => scrollTo(index)}
                                className={cn(
                                    "relative h-16 w-16 shrink-0 overflow-hidden border transition-opacity rounded-[var(--radius-image,0.5rem)]",
                                    item.aspectRatio || "aspect-square",
                                    isSelected ? "" : "border-transparent opacity-70 hover:opacity-100"
                                )}
                            >
                                {isSelected && (
                                    <motion.div
                                        layoutId="gallery-ring"
                                        className="absolute inset-0 border-2 border-[var(--primary)] z-10 rounded-[var(--radius-image,0.5rem)]"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <Image
                                    src={item.src}
                                    alt={`Thumbnail ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="64px"
                                />
                            </button>
                        </ScaleTap>
                    )
                })}
            </div>
        </FadeIn>
    )
}
