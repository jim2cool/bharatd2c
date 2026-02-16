export interface MediaItem {
    id: string;
    type: 'image' | 'video';
    src: string;
    alt: string;
    aspectRatio?: string; // e.g. "aspect-square", "aspect-[4/5]"
    tier?: 'clean' | 'lifestyle' | 'weak';
}

import { SellerModifier, CategoryType } from '@/types/architecture';

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
    description_intro?: string; // Phase 22: Content before the first H2
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
        type: 'timer' | 'stock' | 'text' | 'countdown' | 'low_stock' | 'recent_view';
        text?: string;
        timer?: number; // minutes
        stock?: number;
        viewers?: number; // Added for recent_view
        config?: {
            minutes?: number;
            stock?: number;
            viewers?: number;
        };
    };

    bundle_settings?: {
        enabled: boolean;
        title?: string;
        tiers?: { qty: number; label: string; discount: number }[];
        most_popular_index?: number;
    };

    trust_indicators?: { icon: string; text: string }[] | null;
    trust_strip_image_url?: string | null;
    cod_enabled?: boolean;
    prepaid_enabled?: boolean;
    cart_button_enabled?: boolean;
    show_estimated_delivery?: boolean;
    shipping_settings?: {
        handling_time_min: number;
        handling_time_max: number;
        transit_time_min: number;
        transit_time_max: number;
        is_edd_enabled: boolean;
        free_shipping_threshold?: number;
        edd_mode?: 'detailed' | 'compact';
    };

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
    related_products_title?: string;

    seller_config?: SellerModifier;

    // Phase 17: Admin Alignment
    category: CategoryType;
    has_variants?: boolean;
    show_quantity_selector?: boolean;
    variant_options?: { name: string; values: string[] }[];
    variants?: {
        id: string;
        title: string;
        price: number;
        mrp?: number;
        inventory: number;
        sku?: string;
        options: Record<string, string>; // e.g. { Color: "Red", Size: "M" }
    }[];

    category_data?: Record<string, any>;

    debug?: {
        store: any;
        platform: any;
    };
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
    prepaidEnabled?: boolean;
    cartEnabled?: boolean;
    prepaidOfferText?: string;
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
