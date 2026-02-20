export type CommerceArchitecture = 'product-engine' | 'story-first' | 'catalog-first';

export type CategoryType =
    | 'fashion'
    | 'beauty'
    | 'electronics'
    | 'home'
    | 'health'
    | 'spiritual'
    | 'furniture'
    | 'food'
    | 'dropshipping'
    | 'marketplace'
    | 'multi';

export interface StylePreset {
    id: 'minimal' | 'bold' | 'organic' | 'tech' | 'premium' | 'marketplace' | 'feminine' | 'gen-z' | 'cro';
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
    urgencyLevel: 'low' | 'medium' | 'high';
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
