import { ProductData } from "../../types/pdp";
import { MediaGallery } from "./MediaGallery";
import { Rating } from "./Rating";

interface HeroProps {
    product: ProductData;
}

export function Hero({ product }: HeroProps) {
    return (
        <section data-cluster="hero" className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-12 pb-4 md:py-8">
            {/* Media Column - Mobile: First */}
            <div className="w-full">
                <MediaGallery media={product.media} />
            </div>

            {/* Info Column */}
            <div className="flex flex-col px-4 md:px-0 pt-3 md:pt-0 self-start">

                {/* Title */}
                <h1
                    className="text-[1.75rem] md:text-3xl lg:text-4xl font-bold tracking-tight text-foreground mb-2"
                    style={{ lineHeight: 'var(--line-height, 1.15)' }}
                >
                    {product.title}
                </h1>

                {/* Descriptor */}
                <p
                    className="text-[0.95rem] md:text-lg text-muted-foreground/90 mb-3"
                    style={{ lineHeight: 'var(--line-height, 1.5)' }}
                >
                    {product.subtitle}
                </p>

                {/* Rating Row - Immediately visible */}
                <div className="flex items-center gap-3 md:mb-2">
                    <Rating
                        rating={product.rating}
                        reviewCount={product.reviewCount}
                        size="md"
                    />
                </div>

                {/* Note: Price/CTAs are NOT here, they are in Conversion cluster */}
            </div>
        </section>
    )
}
