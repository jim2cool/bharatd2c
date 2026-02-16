// C1 fix: DB stores underscores, not hyphens (2026-02-26)
export type CommerceArchitecture = 'product_engine' | 'story_first' | 'catalog_first';

export type CategoryType =
    | 'fashion'
    | 'beauty'
    | 'electronics'
    | 'home'
    | 'health'
    | 'spiritual'  // The "Seer" persona (Gurus, Sage, Traditional Rituals)
    | 'furniture'
    | 'food'
    | 'dropshipping'
    | 'marketplace'
    | 'multi'
    // C4 fix: 5 missing categories added (2026-02-26)
    | 'jewellery'
    | 'art'
    | 'pets'
    | 'baby'
    | 'stationery'
    // C6 fix: Adding remaining categories to reach 24 (2026-02-27)
    | 'automotive'
    | 'sports'
    | 'gardening'
    | 'b2b'
    // C5 fix: 4 future/digital categories added (2026-02-27)
    | 'digital'
    | 'experience'
    | 'renewed'
    | 'consultation';

// G1 fix: StylePreset.id must use EXACT DB primary keys from ob_design_tokens (title case + spaces)
// DB-verified 2026-02-26: "Saaf Suthra", "Dhamaka", etc. — NOT slug format
export type MoodCardKey =
    | 'Minimal'
    | 'Bold'
    | 'Heritage'
    | 'Luxury'
    | 'Organic'
    | 'Fresh'
    | 'Professional'
    | 'Serene'
    | 'Gourmet'
    | 'Sleek'
    | 'Zen'
    | 'Vibrant'
    | 'Playful'
    | 'Industrial'
    | 'Urban'
    | 'Earth'
    | 'Clinical'
    | 'Quiet Luxury';

export interface StylePreset {
    id: MoodCardKey;
    colors: {
        background: string;
        surface: string;
        textPrimary: string;
        textSecondary: string;
        primary: string;
        primaryForeground: string;
        secondary: string;
        secondaryForeground: string;
        accent: string;
        border: string;
        success: string;
        error: string;
        warning: string;
    };
    typography: {
        headingFont: string;
        bodyFont: string;
        headingCase: 'normal' | 'uppercase' | 'capitalize';
        headingWeight: number;
        letterSpacing: string;
        lineHeight: string;
        scale: 'classic' | 'modern' | 'expressive';
    };
    shape: {
        radiusScale: 'sharp' | 'clean' | 'soft' | 'round' | 'pill';
        elevation: 'flat' | 'soft' | 'raised' | 'floating';
        borderStyle: 'none' | 'hairline' | 'subtle' | 'thick';
    };
    motion: {
        intensity: 'subtle' | 'normal' | 'expressive';
        speed: 'fast' | 'normal' | 'relaxed';
    };
}

export interface SellerModifier {
    urgencyLevel: 'none' | 'low' | 'medium' | 'high'; // C3 fix: `none` added (2026-02-26)
    socialProofWeight: 'light' | 'medium' | 'heavy';
    trustDensity: 'light' | 'medium' | 'heavy';
    ctaProminence: 'balanced' | 'dominant';
    densityScale: 'compact' | 'balanced' | 'airy';
    codBias: boolean;
}

export interface CategoryConfig {
    category: CategoryType;
    requiredModules: string[];
    optionalModules: string[];
    imageRatio: '1:1' | '4:5' | '16:9';
    variantSelectorType: 'swatch' | 'dropdown' | 'grid';
    // Data
    data?: Record<string, any>;
}

export interface ArchitectureConfig {
    architecture: CommerceArchitecture;
    seller: SellerModifier;
    category: CategoryConfig;
    style: StylePreset;
}
