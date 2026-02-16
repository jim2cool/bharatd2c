import { CategoryType } from "@/types/architecture";

export interface CategoryModuleSchema {
    required: string[];
    optional: string[];
}

export const CATEGORY_MODULE_REGISTRY: Record<CategoryType, CategoryModuleSchema> = {
    fashion: {
        required: [
            'size-grid-selector',
            'size-guide-modal',
            'fabric-details',
            'care-instructions',
            'swatch-variants',
            'exchange-trust-messaging'
        ],
        optional: ['style-with', 'fit-assistant']
    },
    beauty: {
        required: [
            'ingredient-block',
            'how-to-use-section',
            'before-after-slider',
            'safety-badge',
            'faq-expanded-by-default'
        ],
        optional: ['skin-type-check', 'routine-builder']
    },
    electronics: {
        required: [
            'specs-table',
            'comparison-toggle',
            'warranty-badge',
            'emi-block',
            'feature-icon-grid'
        ],
        optional: ['compatibility-check']
    },
    home: {
        required: [
            'dimensions-block',
            'installation-guide',
            'demo-gallery',
            'delivery-emphasis-block'
        ],
        optional: ['assembly-instructions']
    },
    health: {
        required: [
            'dosage-instructions',
            'certification-badge',
            'subscription-option',
            'fssai-display'
        ],
        optional: ['safety-warnings']
    },
    spiritual: {
        required: [
            'meaning-benefits-section',
            'ritual-guide',
            'authenticity-block',
            'emotional-story-block'
        ],
        optional: []
    },
    furniture: {
        required: [
            'dimension-visual',
            'delivery-timeline',
            'installation-info',
            'financing-option'
        ],
        optional: ['care-guide']
    },
    food: {
        required: [
            'nutritional-table',
            'shelf-life-display',
            'ingredients-block',
            'storage-instructions',
            'fssai-compliance'
        ],
        optional: ['allergens-list']
    },
    dropshipping: {
        required: [
            'stock-counter',
            'shipping-timeline',
            'sales-pulse',
            'direct-trust-badges'
        ],
        optional: []
    },
    marketplace: {
        required: ['seller-info'],
        optional: []
    },
    multi: {
        required: [
            'mega-menu',
            'advanced-filters',
            'category-banners',
            'collection-logic'
        ],
        optional: []
    },
    jewellery: {
        required: ['material-care', 'authenticity-certificate'],
        optional: ['try-on']
    },
    art: {
        required: ['dimensions-block', 'framing-options'],
        optional: ['artist-bio']
    },
    pets: {
        required: ['size-guide-modal', 'ingredients-block'],
        optional: ['breed-recommendations']
    },
    baby: {
        required: ['safety-badge', 'age-group-indicator'],
        optional: ['material-certifications']
    },
    stationery: {
        required: ['paper-quality', 'dimensions-block'],
        optional: ['personalization-options']
    },
    digital: {
        required: ['digital-delivery-info', 'license-type-badge', 'format-details'],
        optional: ['sample-preview']
    },
    experience: {
        required: ['event-date-picker', 'location-map', 'participant-info'],
        optional: ['itinerary-details']
    },
    renewed: {
        required: ['condition-report', 'certified-pre-owned-badge', 'circular-impact-stat'],
        optional: ['buy-back-eligible']
    },
    consultation: {
        required: ['booking-calendar', 'meeting-duration', 'consultation-focus-areas'],
        optional: ['expert-bio']
    },
    automotive: {
        required: ['compatibility-vin-check', 'parts-specs'],
        optional: ['installation-service']
    },
    sports: {
        required: ['difficulty-level', 'size-chart-sport-specific'],
        optional: ['equipment-maintenance-guide']
    },
    gardening: {
        required: ['light-requirement', 'watering-needs'],
        optional: ['seasonal-guide']
    },
    b2b: {
        required: ['bulk-pricing-table', 'minimum-order-quantity', 'gst-invoice-badge'],
        optional: ['tax-exempt-eligible']
    }
};
