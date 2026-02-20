export type ComponentSlot =
    | 'media-gallery'
    | 'staggered-gallery'
    | 'product-header'
    | 'price-display'
    | 'variant-selector'
    | 'quantity-selector'
    | 'edd-display'
    | 'cta-group'
    | 'trust-badges'
    | 'trust-bar'
    | 'highlights'
    | 'bundles'
    | 'accordions'
    | 'reviews'
    | 'cross-sell'
    | 'category-modules'
    | 'story-section'
    | 'brand-narrative-blocks'
    | 'features-section'
    | 'faq-section'
    | 'testimonials-section';

import { StylePreset } from "@/types/architecture";
import { PRESET_REGISTRY } from "./presets";

export interface ArchitectureSchema {
    zones: {
        gallery: ComponentSlot[];
        conversion: ComponentSlot[];
        description: ComponentSlot[];
        socialProof: ComponentSlot[];
        crossSell: ComponentSlot[];
    };
    layout: 'standard' | 'story' | 'catalog';
    style: StylePreset;
}

export const ARCHITECTURE_REGISTRY: Record<string, ArchitectureSchema> = {
    'product-engine': {
        layout: 'standard',
        style: PRESET_REGISTRY.minimal,
        zones: {
            gallery: ['media-gallery'],
            conversion: [
                'product-header',
                'reviews', // Mandatory Above Cluster
                'highlights',
                'price-display', // Called Offer Cluster in doc
                'variant-selector',
                'quantity-selector',
                'edd-display',
                'cta-group',
                'trust-badges',
                'trust-bar'
            ],
            description: ['category-modules', 'bundles', 'accordions'],
            socialProof: ['reviews'],
            crossSell: ['cross-sell']
        }
    },
    'story-first': {
        layout: 'story',
        style: PRESET_REGISTRY.premium,
        zones: {
            gallery: ['staggered-gallery'],
            conversion: [
                'product-header',
                'reviews',
                'price-display',
                'variant-selector',
                'cta-group'
            ],
            description: [
                'category-modules',
                'story-section',
                'brand-narrative-blocks',
                'features-section',
                'faq-section'
            ],
            socialProof: ['testimonials-section', 'reviews'],
            crossSell: ['cross-sell']
        }
    },
    'catalog-first': {
        layout: 'catalog',
        style: PRESET_REGISTRY.marketplace,
        zones: {
            gallery: ['media-gallery'],
            conversion: [
                'product-header',
                'price-display',
                'variant-selector',
                'cta-group'
            ],
            description: ['category-modules', 'highlights', 'accordions'],
            socialProof: ['reviews'],
            crossSell: ['cross-sell']
        }
    }
};
