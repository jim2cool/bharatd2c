import { cn } from "@/lib/utils";
import { ProductData } from "../types/pdp";
import { Rating } from "./hero/Rating";
import { usePDP } from "../context/PDPContext";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/ui/motion-primitives";

interface ProductInfoProps {
    product: ProductData;
}

export function ProductInfo({ product }: ProductInfoProps) {
    const { storeConfig } = usePDP();
    const mood = storeConfig?.mood_card_selected?.toLowerCase() || '';

    // Dil Se Desi / Rooh check for Maker Attribution placement
    const isArtisanal = ['dil_se_desi', 'rooh_aur_riwaz'].includes(mood);

    return (
        <FadeIn className="flex flex-col px-4 md:px-0" style={{ gap: 'calc(var(--component-gap) * 0.5)' }}>
            {/* 1. Above Title only if NOT artisanal */}
            {product.subtitle && !isArtisanal && (
                <div className="flex items-center gap-2">
                    <span className="w-6 h-[1px] bg-[var(--primary)] opacity-40 block" />
                    <p className="text-[10px] md:text-xs text-[var(--text-primary)] font-bold uppercase tracking-[0.2em] leading-none">
                        {product.subtitle}
                    </p>
                </div>
            )}

            {/* Title - Thematic Font & Weight */}
            <h1 className={cn(
                "text-3xl md:text-4xl lg:text-5xl tracking-tighter text-[var(--text-primary)] leading-[1.1] text-balance",
                mood === 'dhamaka' ? "font-black uppercase" : "font-normal"
            )} style={{ fontFamily: 'var(--heading-font)' }}>
                {product.title}
            </h1>

            {/* 2. Below Title for artisanal cards (Maker Attribution) */}
            {product.subtitle && isArtisanal && (
                <p className="text-xs italic text-[var(--text-secondary)] opacity-80">
                    Handcrafted by {product.subtitle}
                </p>
            )}

            {/* Rating Row - Standard Sequence */}
            <div className="flex items-center gap-2 mt-1">
                <Rating
                    rating={product.rating}
                    reviewCount={product.reviewCount}
                    size="sm"
                />
            </div>
        </FadeIn>
    )
}
