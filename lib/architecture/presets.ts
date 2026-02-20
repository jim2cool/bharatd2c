import { StylePreset } from "@/types/architecture";

export const PRESET_MINIMAL: StylePreset = {
    id: 'minimal',
    colors: {
        background: '#ffffff',
        surface: '#f9fafb',
        textPrimary: '#111827', // Gray 900
        textSecondary: '#6b7280', // Gray 500
        primary: '#111827', // Black
        primaryForeground: '#ffffff',
        secondary: '#f3f4f6', // Gray 100
        secondaryForeground: '#111827',
        accent: '#3b82f6', // Blue 500
        border: '#e5e7eb', // Gray 200
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b'
    },
    typography: {
        headingFont: 'var(--font-inter)', // Fallback to Inter
        bodyFont: 'var(--font-inter)',
        headingCase: 'normal',
        headingWeight: 600,
        letterSpacing: '-0.02em',
        lineHeight: '1.5',
        scale: 'modern'
    },
    shape: {
        radiusScale: 'clean', // 0.5rem
        elevation: 'soft',
        borderStyle: 'subtle'
    },
    motion: {
        intensity: 'normal',
        speed: 'normal'
    }
};

export const PRESET_BOLD: StylePreset = {
    id: 'bold',
    colors: {
        background: '#ffffff',
        surface: '#eeeeee',
        textPrimary: '#000000',
        textSecondary: '#444444',
        primary: '#000000',
        primaryForeground: '#ffff00', // Yellow text on black
        secondary: '#ffffff',
        secondaryForeground: '#000000',
        accent: '#ff0000', // Red
        border: '#000000', // Black borders
        success: '#00ff00',
        error: '#ff0000',
        warning: '#ffff00'
    },
    typography: {
        headingFont: 'var(--font-heavy)', // Anton
        bodyFont: 'var(--font-system)',
        headingCase: 'uppercase',
        headingWeight: 400, // Anton is 400 only but looks heavy
        letterSpacing: '0.05em',
        lineHeight: '1.1',
        scale: 'expressive'
    },
    shape: {
        radiusScale: 'sharp', // 0px
        elevation: 'flat',
        borderStyle: 'thick' // 2px
    },
    motion: {
        intensity: 'expressive',
        speed: 'fast'
    }
};

export const PRESET_ORGANIC: StylePreset = {
    id: 'organic',
    colors: {
        background: '#fcfbf8', // Warm off-white
        surface: '#f4f1ea', // Stone
        textPrimary: '#2c2825', // Dark brown/charcoal
        textSecondary: '#6d6862',
        primary: '#3a4d39', // Forest Green
        primaryForeground: '#ffffff',
        secondary: '#eceae4',
        secondaryForeground: '#2c2825',
        accent: '#d48c70', // Terracotta
        border: '#e6e2da',
        success: '#4a6741',
        error: '#ba4a4a',
        warning: '#d9a655'
    },
    typography: {
        headingFont: 'var(--font-serif)', // Playfair for Organic feels nice too, or soft sans
        bodyFont: 'var(--font-sans)',
        headingCase: 'normal',
        headingWeight: 500,
        letterSpacing: '0em',
        lineHeight: '1.6',
        scale: 'classic'
    },
    shape: {
        radiusScale: 'pill', // 9999px
        elevation: 'soft',
        borderStyle: 'none'
    },
    motion: {
        intensity: 'subtle',
        speed: 'relaxed'
    }
};

export const PRESET_TECH: StylePreset = {
    id: 'tech',
    colors: {
        background: '#050505', // Almost Black
        surface: '#111111',
        textPrimary: '#ffffff',
        textSecondary: '#888888',
        primary: '#0070f3', // Vercel Blue
        primaryForeground: '#ffffff',
        secondary: '#1a1a1a',
        secondaryForeground: '#ffffff',
        accent: '#7928ca', // Purple
        border: '#333333',
        success: '#00e0b0', // Cyan
        error: '#ff3333',
        warning: '#f5a623'
    },
    typography: {
        headingFont: 'var(--font-mono)', // JetBrains Mono
        bodyFont: 'var(--font-sans)',
        headingCase: 'capitalize',
        headingWeight: 500,
        letterSpacing: '-0.03em',
        lineHeight: '1.4',
        scale: 'modern'
    },
    shape: {
        radiusScale: 'clean', // 0.5rem
        elevation: 'flat',
        borderStyle: 'hairline' // 1px
    },
    motion: {
        intensity: 'normal',
        speed: 'fast'
    }
};

export const PRESET_PREMIUM: StylePreset = {
    id: 'premium',
    colors: {
        background: '#ffffff',
        surface: '#f8f8f8',
        textPrimary: '#1a1a1a',
        textSecondary: '#666666',
        primary: '#1a1a1a',
        primaryForeground: '#ffffff',
        secondary: '#f0f0f0',
        secondaryForeground: '#1a1a1a',
        accent: '#d4af37', // Gold
        border: '#eaeaea',
        success: '#4a6741',
        error: '#ba4a4a',
        warning: '#d9a655'
    },
    typography: {
        headingFont: 'var(--font-serif)', // Playfair Display
        bodyFont: 'var(--font-sans)',
        headingCase: 'normal',
        headingWeight: 400,
        letterSpacing: '0.02em',
        lineHeight: '1.4',
        scale: 'classic'
    },
    shape: {
        radiusScale: 'sharp', // 0px
        elevation: 'soft',
        borderStyle: 'none'
    },
    motion: {
        intensity: 'subtle',
        speed: 'relaxed'
    }
};

export const PRESET_FEMININE: StylePreset = {
    id: 'feminine',
    colors: {
        background: '#fff0f5', // Lavender Blush
        surface: '#ffe4e1', // Misty Rose
        textPrimary: '#4a3b3b', // Warm Dark Gray
        textSecondary: '#8b7d7b',
        primary: '#db7093', // Pale Violet Red
        primaryForeground: '#ffffff',
        secondary: '#fff5ee', // Seashell
        secondaryForeground: '#4a3b3b',
        accent: '#ff69b4', // Hot Pink
        border: '#ffc0cb', // Pink
        success: '#98fb98',
        error: '#ffb6c1',
        warning: '#ffe4b5'
    },
    typography: {
        headingFont: 'var(--font-cursive)', // Dancing Script
        bodyFont: 'var(--font-sans)',
        headingCase: 'normal',
        headingWeight: 600,
        letterSpacing: '0.02em',
        lineHeight: '1.5',
        scale: 'modern'
    },
    shape: {
        radiusScale: 'round', // 1rem
        elevation: 'soft',
        borderStyle: 'subtle'
    },
    motion: {
        intensity: 'expressive',
        speed: 'normal'
    }
};

export const PRESET_GEN_Z: StylePreset = {
    id: 'gen-z',
    colors: {
        background: '#ebf4ff', // Light Blue
        surface: '#ffffff',
        textPrimary: '#000000',
        textSecondary: '#4a5568',
        primary: '#7f5af0', // Electric Purple
        primaryForeground: '#ffffff',
        secondary: '#2cb67d', // Green
        secondaryForeground: '#000000',
        accent: '#ff8906', // Orange
        border: '#000000', // Hard black borders
        success: '#2cb67d',
        error: '#e53170',
        warning: '#ff8906'
    },
    typography: {
        headingFont: 'var(--font-heavy)', // Anton again? Or Outfit Black? sticking to heavy for impact
        bodyFont: 'var(--font-sans)',
        headingCase: 'uppercase',
        headingWeight: 800,
        letterSpacing: '-0.04em',
        lineHeight: '0.9', // Tighter for Gen Z
        scale: 'expressive'
    },
    // ...
    shape: {
        radiusScale: 'clean', // 0.5rem (but often mixed with sharp)
        elevation: 'raised', // Hard shadow
        borderStyle: 'thick' // Brutalist borders
    },
    motion: {
        intensity: 'expressive',
        speed: 'fast'
    }
};

export const PRESET_MARKETPLACE: StylePreset = {
    id: 'marketplace',
    colors: {
        background: '#f1f3f6', // Light gray background
        surface: '#ffffff',
        textPrimary: '#212121', // Dark Gray
        textSecondary: '#878787',
        primary: '#2874f0', // Flipkart/Amazon Blue
        primaryForeground: '#ffffff',
        secondary: '#ff9f00', // Action Orange
        secondaryForeground: '#ffffff',
        accent: '#fb641b', // Offer Red/Orange
        border: '#e0e0e0',
        success: '#388e3c',
        error: '#d32f2f',
        warning: '#ffa000'
    },
    typography: {
        headingFont: 'var(--font-sans)', // Robot/Inter
        bodyFont: 'var(--font-sans)',
        headingCase: 'normal',
        headingWeight: 500,
        letterSpacing: '0',
        lineHeight: '1.4',
        scale: 'modern' // Information density
    },
    shape: {
        radiusScale: 'clean', // 4px/0.25rem
        elevation: 'soft',
        borderStyle: 'hairline'
    },
    motion: {
        intensity: 'subtle', // Performance first
        speed: 'fast'
    }
};

export const PRESET_REGISTRY = {
    minimal: PRESET_MINIMAL,
    bold: PRESET_BOLD,
    organic: PRESET_ORGANIC,
    tech: PRESET_TECH,
    premium: PRESET_PREMIUM,
    feminine: PRESET_FEMININE,
    'gen-z': PRESET_GEN_Z,
    marketplace: PRESET_MARKETPLACE
};
