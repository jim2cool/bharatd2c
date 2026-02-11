
import { ProductData } from "../types/pdp";
import { Rating } from "./hero/Rating";


interface ProductInfoProps {
    product: ProductData;
}

export function ProductInfo({ product }: ProductInfoProps) {
    return (
        <div className="flex flex-col gap-2 px-4 md:px-0">
            {/* Title - Dawn uses normal weight, elegant sizing */}
            <h1 className="text-xl md:text-2xl font-normal tracking-tight text-foreground leading-snug">
                {product.title}
            </h1>

            {/* Subtitle - Understated */}
            {product.subtitle && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                    {product.subtitle}
                </p>
            )}

            {/* Rating Row (Left Aligned) */}
            <div className="flex items-center gap-2 mt-2">
                <Rating
                    rating={product.rating}
                    reviewCount={product.reviewCount}
                    size="sm"
                />
            </div>
        </div>
    )
}
