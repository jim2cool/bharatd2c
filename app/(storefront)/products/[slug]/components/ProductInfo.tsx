
import { ProductData } from "../types/pdp";
import { Rating } from "./hero/Rating";


import { motion } from "framer-motion";
import { FadeIn } from "@/components/ui/motion-primitives";

interface ProductInfoProps {
    product: ProductData;
}

export function ProductInfo({ product }: ProductInfoProps) {
    return (
        <FadeIn className="flex flex-col gap-3 px-4 md:px-0">
            {/* Subtitle / Collection - Micro-Typography */}
            {product.subtitle && (
                <div className="flex items-center gap-2">
                    <span className="w-6 h-[1px] bg-primary/40 block" />
                    <p className="text-[10px] md:text-xs text-primary font-bold uppercase tracking-[0.2em] leading-none">
                        {product.subtitle}
                    </p>
                </div>
            )}

            {/* Title - Display Font, Tight Leading */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter text-foreground leading-[1.1] text-balance">
                {product.title}
            </h1>

            {/* Rating Row (Left Aligned) - Compact */}
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
