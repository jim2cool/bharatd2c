export interface MediaItem {
    id: string;
    type: 'image' | 'video';
    src: string;
    alt: string;
    aspectRatio?: string; // e.g. "aspect-square", "aspect-[4/5]"
}

export interface Review {
    id: string;
    author: string;
    location?: string;
    rating: number;
    date: string;
    content: string;
    verified: boolean;
}

export interface BundleOption {
    id: string;
    unitCount: number; // e.g., 1, 2, 3
    sellingPrice: number;
    mrp: number; // For calculating savings
    savingsText?: string; // Derived or explicit
    badge?: string; // "Best Value", "Most Popular"
}

export interface ContentSection {
    id: string;
    title: string;
    content: string; // HTML supported or plain text
}

export interface ProductHighlight {
    id: string;
    text: string;
    icon?: string; // Name of Lucide icon if needed, or just text
}

export interface RelatedProduct {
    id: string;
    slug: string;
    title: string;
    image: string;
    price: number;
    mrp: number;
}

export interface ProductData {
    id: string;
    slug: string;
    title: string;
    subtitle: string; // 1-line functional descriptor
    rating: number;
    reviewCount: number;

    media: MediaItem[];

    highlights: ProductHighlight[]; // 3-5 bullets

    pricing: {
        mrp: number;
        sellingPrice: number;
        discountDetails: {
            percentageOff: number;
            savingsAmount: number;
        };
        prepaid?: {
            type: 'flat' | 'percentage';
            value: number;
            offerText?: string;
            calculatedSavings: number;
        };
    };

    urgency_settings?: {
        enabled: boolean;
        type: 'timer' | 'stock' | 'text';
        text?: string;
        timer?: number; // minutes
        stock?: number;
    };

    bundle_settings?: {
        enabled: boolean;
        title?: string;
    };

    cod_enabled?: boolean;

    bundles: BundleOption[];

    reviews: {
        summary: {
            averageRating: number;
            totalReviews: number;
            distribution?: Record<number, number>;
        };
        featured: Review[]; // 1-2 reviews
    };

    content: ContentSection[]; // Description, How it works, etc.

    relatedProducts: RelatedProduct[]; // AOV / People also bought
}

// Prop Interfaces for Components

export interface HeroProps {
    title: string;
    subtitle: string;
    rating: number;
    reviewCount: number;
    media: MediaItem[];
}

export interface HighlightsProps {
    highlights: ProductHighlight[];
}

export interface ConversionProps {
    pricing: ProductData['pricing'];
    bundles: BundleOption[];
}

export interface PriceBlockProps {
    mrp: number;
    sellingPrice: number;
    discountPercentage: number;
    savingsAmount: number;
    prepaidSavings?: number;
}

export interface BundleSelectorProps {
    bundles: BundleOption[];
    selectedBundleId: string;
    onSelect: (id: string) => void;
}

export interface CTAGroupProps {
    sellingPrice: number;
    savingsAmount: number; // For "Pay Online & Save X"
    prepaidSavings: number;
    onCodClick: () => void;
    onPrepaidClick: () => void;
    onAddToCart?: () => void;
    codEnabled?: boolean;
}

export interface ProofProps {
    rating: number;
    reviewCount: number;
    reviews: Review[];
}

export interface ContentProps {
    sections: ContentSection[];
}

export interface AOVProps {
    products: RelatedProduct[];
}
