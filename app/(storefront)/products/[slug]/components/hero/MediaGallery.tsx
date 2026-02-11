"use client"
import * as React from 'react'

import { useState, useCallback } from "react"
import Image from "next/image"
import useEmblaCarousel from "embla-carousel-react"
import { MediaItem } from "../../types/pdp"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface MediaGalleryProps {
    media: MediaItem[]
}

export function MediaGallery({ media }: MediaGalleryProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" })
    const [selectedIndex, setSelectedIndex] = useState(0)

    const [canScrollPrev, setCanScrollPrev] = useState(false)
    const [canScrollNext, setCanScrollNext] = useState(false)

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

    if (!media.length) return null

    return (
        <div className="flex flex-col gap-4 w-full relative group">
            {/* Main Carousel */}
            <div
                className="overflow-hidden border bg-muted relative"
                ref={emblaRef}
                style={{ borderRadius: 'var(--radius-gallery, 0.75rem)' }}
            >
                <div className="flex touch-pan-y shadow-inner">
                    {media.map((item) => (
                        <div
                            key={item.id}
                            className="relative min-w-full flex-[0_0_100%]"
                        >
                            <div className={cn("relative w-full overflow-hidden", "aspect-square")}>
                                <Image
                                    src={item.src}
                                    alt={item.alt}
                                    fill
                                    className="object-cover"
                                    priority={true} // Priority for LCP on first render
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mobile Navigation: Arrows */}
                <div className="absolute inset-0 flex items-center justify-between p-2 md:hidden pointer-events-none">
                    <Button
                        variant="secondary"
                        size="icon"
                        className={cn(
                            "h-8 w-8 rounded-full bg-background/80 hover:bg-background/90 shadow-sm pointer-events-auto transition-opacity",
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
                            "h-8 w-8 rounded-full bg-background/80 hover:bg-background/90 shadow-sm pointer-events-auto transition-opacity",
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
                                index === selectedIndex ? "bg-white w-3" : "bg-white/60"
                            )}
                            onClick={() => scrollTo(index)}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* Thumbnails - Desktop Only */}
            <div className="hidden md:flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {media.map((item, index) => (
                    <button
                        key={item.id}
                        onClick={() => scrollTo(index)}
                        className={cn(
                            "relative h-16 w-16 shrink-0 overflow-hidden border transition-all",
                            item.aspectRatio || "aspect-square",
                            index === selectedIndex ? "ring-2 ring-primary ring-offset-1 border-primary" : "border-transparent opacity-70 hover:opacity-100"
                        )}
                        style={{ borderRadius: 'var(--radius-image, 0.5rem)' }}
                    >
                        <Image
                            src={item.src}
                            alt={`Thumbnail ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="64px"
                        />
                    </button>
                ))}
            </div>
        </div>
    )
}
