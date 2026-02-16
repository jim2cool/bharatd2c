import { StylePreset } from "@/types/architecture";

export const PRESET_MINIMAL: StylePreset = {
    id: 'Minimal',
    colors: {
        background: '#ffffff',
        surface: '#f9fafb',
        textPrimary: '#111827',
        textSecondary: '#6b7280',
        primary: '#111827',
        primaryForeground: '#ffffff',
        secondary: '#f3f4f6',
        secondaryForeground: '#111827',
        accent: '#3b82f6',
        border: '#e5e7eb',
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b'
    },
    typography: {
        headingFont: 'var(--font-inter)',
        bodyFont: 'var(--font-inter)',
        headingCase: 'normal',
        headingWeight: 600,
        letterSpacing: '-0.02em',
        lineHeight: '1.5',
        scale: 'modern'
    },
    shape: {
        radiusScale: 'clean',
        elevation: 'soft',
        borderStyle: 'subtle'
    },
    motion: {
        intensity: 'normal',
        speed: 'normal'
    }
};

export const PRESET_BOLD: StylePreset = {
    id: 'Bold',
    colors: {
        background: '#ffffff',
        surface: '#eeeeee',
        textPrimary: '#000000',
        textSecondary: '#444444',
        primary: '#000000',
        primaryForeground: '#ffff00',
        secondary: '#ffffff',
        secondaryForeground: '#000000',
        accent: '#ff0000',
        border: '#000000',
        success: '#00ff00',
        error: '#ff0000',
        warning: '#ffff00'
    },
    typography: {
        headingFont: 'var(--font-heavy)',
        bodyFont: 'var(--font-system)',
        headingCase: 'uppercase',
        headingWeight: 400,
        letterSpacing: '0.05em',
        lineHeight: '1.1',
        scale: 'expressive'
    },
    shape: {
        radiusScale: 'sharp',
        elevation: 'flat',
        borderStyle: 'thick'
    },
    motion: {
        intensity: 'expressive',
        speed: 'fast'
    }
};

export const PRESET_HERITAGE: StylePreset = {
    id: 'Heritage',
    colors: {
        background: '#fdfaf6', // Parchment
        surface: '#f4ece1',
        textPrimary: '#3c2a21', // Deep Coffee
        textSecondary: '#6d4c41',
        primary: '#8d6e63', // Clay
        primaryForeground: '#ffffff',
        secondary: '#d7ccc8',
        secondaryForeground: '#3c2a21',
        accent: '#bf360c', // Burnt Siennah
        border: '#d7ccc8',
        success: '#388e3c',
        error: '#d32f2f',
        warning: '#f57c00'
    },
    typography: {
        headingFont: 'var(--font-serif)',
        bodyFont: 'var(--font-serif)',
        headingCase: 'normal',
        headingWeight: 700,
        letterSpacing: '0.01em',
        lineHeight: '1.3',
        scale: 'classic'
    },
    shape: {
        radiusScale: 'soft',
        elevation: 'soft',
        borderStyle: 'subtle'
    },
    motion: {
        intensity: 'subtle',
        speed: 'relaxed'
    }
};

export const PRESET_LUXURY: StylePreset = {
    id: 'Luxury',
    colors: {
        background: '#ffffff',
        surface: '#fafafa',
        textPrimary: '#000000',
        textSecondary: '#737373',
        primary: '#000000',
        primaryForeground: '#ffffff',
        secondary: '#f5f5f5',
        secondaryForeground: '#000000',
        accent: '#c5a059', // Champagne Gold
        border: '#e5e5e5',
        success: '#166534',
        error: '#991b1b',
        warning: '#92400e'
    },
    typography: {
        headingFont: 'var(--font-serif)',
        bodyFont: 'var(--font-sans)',
        headingCase: 'uppercase',
        headingWeight: 300,
        letterSpacing: '0.2em',
        lineHeight: '1.2',
        scale: 'classic'
    },
    shape: {
        radiusScale: 'sharp',
        elevation: 'soft',
        borderStyle: 'none'
    },
    motion: {
        intensity: 'subtle',
        speed: 'relaxed'
    }
};

export const PRESET_ORGANIC: StylePreset = {
    id: 'Organic',
    colors: {
        background: '#fcfbf8',
        surface: '#f4f1ea',
        textPrimary: '#2c2825',
        textSecondary: '#6d6862',
        primary: '#3a4d39',
        primaryForeground: '#ffffff',
        secondary: '#eceae4',
        secondaryForeground: '#2c2825',
        accent: '#d48c70',
        border: '#e6e2da',
        success: '#4a6741',
        error: '#ba4a4a',
        warning: '#d9a655'
    },
    typography: {
        headingFont: 'var(--font-sans)',
        bodyFont: 'var(--font-sans)',
        headingCase: 'normal',
        headingWeight: 500,
        letterSpacing: '0em',
        lineHeight: '1.6',
        scale: 'classic'
    },
    shape: {
        radiusScale: 'pill',
        elevation: 'soft',
        borderStyle: 'none'
    },
    motion: {
        intensity: 'subtle',
        speed: 'relaxed'
    }
};

export const PRESET_FRESH: StylePreset = {
    id: 'Fresh',
    colors: {
        background: '#ebf4ff',
        surface: '#ffffff',
        textPrimary: '#000000',
        textSecondary: '#4a5568',
        primary: '#7f5af0',
        primaryForeground: '#ffffff',
        secondary: '#2cb67d',
        secondaryForeground: '#000000',
        accent: '#ff8906',
        border: '#000000',
        success: '#2cb67d',
        error: '#e53170',
        warning: '#ff8906'
    },
    typography: {
        headingFont: 'var(--font-heavy)',
        bodyFont: 'var(--font-sans)',
        headingCase: 'uppercase',
        headingWeight: 800,
        letterSpacing: '-0.04em',
        lineHeight: '0.9',
        scale: 'expressive'
    },
    shape: {
        radiusScale: 'clean',
        elevation: 'raised',
        borderStyle: 'thick'
    },
    motion: {
        intensity: 'expressive',
        speed: 'fast'
    }
};

export const PRESET_PROFESSIONAL: StylePreset = {
    id: 'Professional',
    colors: {
        background: '#f1f3f6',
        surface: '#ffffff',
        textPrimary: '#212121',
        textSecondary: '#878787',
        primary: '#2874f0',
        primaryForeground: '#ffffff',
        secondary: '#ff9f00',
        secondaryForeground: '#ffffff',
        accent: '#fb641b',
        border: '#e0e0e0',
        success: '#388e3c',
        error: '#d32f2f',
        warning: '#ffa000'
    },
    typography: {
        headingFont: 'var(--font-sans)',
        bodyFont: 'var(--font-sans)',
        headingCase: 'normal',
        headingWeight: 500,
        letterSpacing: '0',
        lineHeight: '1.4',
        scale: 'modern'
    },
    shape: {
        radiusScale: 'clean',
        elevation: 'soft',
        borderStyle: 'hairline'
    },
    motion: {
        intensity: 'subtle',
        speed: 'fast'
    }
};

export const PRESET_SERENE: StylePreset = {
    id: 'Serene',
    colors: {
        background: '#fff0f5',
        surface: '#ffe4e1',
        textPrimary: '#4a3b3b',
        textSecondary: '#8b7d7b',
        primary: '#db7093',
        primaryForeground: '#ffffff',
        secondary: '#fff5ee',
        secondaryForeground: '#4a3b3b',
        accent: '#ff69b4',
        border: '#ffc0cb',
        success: '#98fb98',
        error: '#ffb6c1',
        warning: '#ffe4b5'
    },
    typography: {
        headingFont: 'var(--font-cursive)',
        bodyFont: 'var(--font-sans)',
        headingCase: 'normal',
        headingWeight: 600,
        letterSpacing: '0.02em',
        lineHeight: '1.5',
        scale: 'modern'
    },
    shape: {
        radiusScale: 'round',
        elevation: 'soft',
        borderStyle: 'subtle'
    },
    motion: {
        intensity: 'expressive',
        speed: 'normal'
    }
};

export const PRESET_GOURMET: StylePreset = {
    id: 'Gourmet',
    colors: {
        background: '#fff8f1', // Creamy base
        surface: '#ffebd8',
        textPrimary: '#432818', // Chocolate
        textSecondary: '#99582a', // Caramel
        primary: '#bb3e03', // Burnt Orange
        primaryForeground: '#ffffff',
        secondary: '#f48c06', // Sunny Orange
        secondaryForeground: '#ffffff',
        accent: '#606c38', // Moss Green
        border: '#ffe5d9',
        success: '#2d6a4f',
        error: '#ae2012',
        warning: '#ffb703'
    },
    typography: {
        headingFont: 'var(--font-serif)',
        bodyFont: 'var(--font-sans)',
        headingCase: 'capitalize',
        headingWeight: 600,
        letterSpacing: '-0.01em',
        lineHeight: '1.2',
        scale: 'expressive'
    },
    shape: {
        radiusScale: 'soft',
        elevation: 'raised',
        borderStyle: 'subtle'
    },
    motion: {
        intensity: 'normal',
        speed: 'normal'
    }
};

export const PRESET_SLEEK: StylePreset = {
    id: 'Sleek',
    colors: {
        background: '#050505',
        surface: '#111111',
        textPrimary: '#ffffff',
        textSecondary: '#888888',
        primary: '#0070f3',
        primaryForeground: '#ffffff',
        secondary: '#1a1a1a',
        secondaryForeground: '#ffffff',
        accent: '#7928ca',
        border: '#333333',
        success: '#00e0b0',
        error: '#ff3333',
        warning: '#f5a623'
    },
    typography: {
        headingFont: 'var(--font-mono)',
        bodyFont: 'var(--font-sans)',
        headingCase: 'capitalize',
        headingWeight: 500,
        letterSpacing: '-0.03em',
        lineHeight: '1.4',
        scale: 'modern'
    },
    shape: {
        radiusScale: 'clean',
        elevation: 'flat',
        borderStyle: 'hairline'
    },
    motion: {
        intensity: 'normal',
        speed: 'fast'
    }
};

export const PRESET_ZEN: StylePreset = {
    id: 'Zen',
    colors: {
        background: '#f8f9fa',
        surface: '#ffffff',
        textPrimary: '#1a1a1a',
        textSecondary: '#666666',
        primary: '#4a4a4a',
        primaryForeground: '#ffffff',
        secondary: '#e9ecef',
        secondaryForeground: '#1a1a1a',
        accent: '#ced4da',
        border: '#dee2e6',
        success: '#52b788',
        error: '#e63946',
        warning: '#ffb703'
    },
    typography: {
        headingFont: 'var(--font-serif)',
        bodyFont: 'var(--font-serif)',
        headingCase: 'normal',
        headingWeight: 300,
        letterSpacing: '0.05em',
        lineHeight: '1.8',
        scale: 'classic'
    },
    shape: {
        radiusScale: 'sharp',
        elevation: 'flat',
        borderStyle: 'hairline'
    },
    motion: {
        intensity: 'subtle',
        speed: 'relaxed'
    }
};

export const PRESET_VIBRANT: StylePreset = {
    id: 'Vibrant',
    colors: {
        background: '#ffffff',
        surface: '#fff5f5',
        textPrimary: '#2d3436',
        textSecondary: '#636e72',
        primary: '#d63031',
        primaryForeground: '#ffffff',
        secondary: '#fdcb6e',
        secondaryForeground: '#2d3436',
        accent: '#e84393',
        border: '#fab1a0',
        success: '#00b894',
        error: '#d63031',
        warning: '#fdcb6e'
    },
    typography: {
        headingFont: 'var(--font-heavy)',
        bodyFont: 'var(--font-sans)',
        headingCase: 'uppercase',
        headingWeight: 700,
        letterSpacing: '0.02em',
        lineHeight: '1.1',
        scale: 'expressive'
    },
    shape: {
        radiusScale: 'soft',
        elevation: 'raised',
        borderStyle: 'subtle'
    },
    motion: {
        intensity: 'expressive',
        speed: 'normal'
    }
};

export const PRESET_PLAYFUL: StylePreset = {
    id: 'Playful',
    colors: {
        background: '#fff9e6',
        surface: '#ffffff',
        textPrimary: '#2d3436',
        textSecondary: '#636e72',
        primary: '#ff7675',
        primaryForeground: '#ffffff',
        secondary: '#74b9ff',
        secondaryForeground: '#ffffff',
        accent: '#fab1a0',
        border: '#ffeaa7',
        success: '#55efc4',
        error: '#ff7675',
        warning: '#ffeaa7'
    },
    typography: {
        headingFont: 'var(--font-sans)',
        bodyFont: 'var(--font-sans)',
        headingCase: 'normal',
        headingWeight: 800,
        letterSpacing: '-0.02em',
        lineHeight: '1.2',
        scale: 'expressive'
    },
    shape: {
        radiusScale: 'round',
        elevation: 'raised',
        borderStyle: 'thick'
    },
    motion: {
        intensity: 'expressive',
        speed: 'normal'
    }
};

export const PRESET_INDUSTRIAL: StylePreset = {
    id: 'Industrial',
    colors: {
        background: '#f2f2f2',
        surface: '#e6e6e6',
        textPrimary: '#1a1a1a',
        textSecondary: '#4d4d4d',
        primary: '#ff5400',
        primaryForeground: '#ffffff',
        secondary: '#333333',
        secondaryForeground: '#ffffff',
        accent: '#999999',
        border: '#1a1a1a',
        success: '#4caf50',
        error: '#f44336',
        warning: '#ff9800'
    },
    typography: {
        headingFont: 'var(--font-mono)',
        bodyFont: 'var(--font-mono)',
        headingCase: 'uppercase',
        headingWeight: 700,
        letterSpacing: '-0.01em',
        lineHeight: '1.1',
        scale: 'modern'
    },
    shape: {
        radiusScale: 'sharp',
        elevation: 'flat',
        borderStyle: 'thick'
    },
    motion: {
        intensity: 'normal',
        speed: 'fast'
    }
};

export const PRESET_URBAN: StylePreset = {
    id: 'Urban',
    colors: {
        background: '#000000',
        surface: '#1a1a1a',
        textPrimary: '#ffffff',
        textSecondary: '#a0a0a0',
        primary: '#00ff41',
        primaryForeground: '#000000',
        secondary: '#ff00ff',
        secondaryForeground: '#ffffff',
        accent: '#00ffff',
        border: '#333333',
        success: '#00ff41',
        error: '#ff0000',
        warning: '#ffff00'
    },
    typography: {
        headingFont: 'var(--font-heavy)',
        bodyFont: 'var(--font-sans)',
        headingCase: 'uppercase',
        headingWeight: 900,
        letterSpacing: '-0.05em',
        lineHeight: '0.8',
        scale: 'expressive'
    },
    shape: {
        radiusScale: 'sharp',
        elevation: 'raised',
        borderStyle: 'thick'
    },
    motion: {
        intensity: 'expressive',
        speed: 'fast'
    }
};

export const PRESET_EARTH: StylePreset = {
    id: 'Earth',
    colors: {
        background: '#3e362e',
        surface: '#4b4237',
        textPrimary: '#ede0d4',
        textSecondary: '#ddb892',
        primary: '#7f5539',
        primaryForeground: '#ffffff',
        secondary: '#b08968',
        secondaryForeground: '#ffffff',
        accent: '#606c38',
        border: '#7f5539',
        success: '#606c38',
        error: '#bc4749',
        warning: '#e6ccb2'
    },
    typography: {
        headingFont: 'var(--font-serif)',
        bodyFont: 'var(--font-sans)',
        headingCase: 'normal',
        headingWeight: 500,
        letterSpacing: '0.02em',
        lineHeight: '1.5',
        scale: 'classic'
    },
    shape: {
        radiusScale: 'soft',
        elevation: 'soft',
        borderStyle: 'none'
    },
    motion: {
        intensity: 'subtle',
        speed: 'relaxed'
    }
};

export const PRESET_CLINICAL: StylePreset = {
    id: 'Clinical',
    colors: {
        background: '#ffffff',
        surface: '#f0f4f8',
        textPrimary: '#0f172a',
        textSecondary: '#475569',
        primary: '#0369a1',
        primaryForeground: '#ffffff',
        secondary: '#e2e8f0',
        secondaryForeground: '#0f172a',
        accent: '#22d3ee',
        border: '#cbd5e1',
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b'
    },
    typography: {
        headingFont: 'var(--font-sans)',
        bodyFont: 'var(--font-sans)',
        headingCase: 'normal',
        headingWeight: 400,
        letterSpacing: '-0.01em',
        lineHeight: '1.4',
        scale: 'modern'
    },
    shape: {
        radiusScale: 'clean',
        elevation: 'flat',
        borderStyle: 'hairline'
    },
    motion: {
        intensity: 'subtle',
        speed: 'fast'
    }
};

export const PRESET_QUIET_LUXURY: StylePreset = {
    id: 'Quiet Luxury',
    colors: {
        background: '#0a0a0a',
        surface: '#121212',
        textPrimary: '#ffffff',
        textSecondary: '#a3a3a3',
        primary: '#fafafa',
        primaryForeground: '#000000',
        secondary: '#171717',
        secondaryForeground: '#ffffff',
        accent: '#404040',
        border: '#262626',
        success: '#166534',
        error: '#991b1b',
        warning: '#92400e'
    },
    typography: {
        headingFont: 'var(--font-serif)',
        bodyFont: 'var(--font-sans)',
        headingCase: 'uppercase',
        headingWeight: 200,
        letterSpacing: '0.4em',
        lineHeight: '1.2',
        scale: 'classic'
    },
    shape: {
        radiusScale: 'sharp',
        elevation: 'flat',
        borderStyle: 'none'
    },
    motion: {
        intensity: 'subtle',
        speed: 'relaxed'
    }
};

export const PRESET_REGISTRY: Record<string, StylePreset> = {
    minimal: PRESET_MINIMAL,
    bold: PRESET_BOLD,
    heritage: PRESET_HERITAGE,
    luxury: PRESET_LUXURY,
    organic: PRESET_ORGANIC,
    fresh: PRESET_FRESH,
    professional: PRESET_PROFESSIONAL,
    serene: PRESET_SERENE,
    gourmet: PRESET_GOURMET,
    sleek: PRESET_SLEEK,
    zen: PRESET_ZEN,
    vibrant: PRESET_VIBRANT,
    playful: PRESET_PLAYFUL,
    industrial: PRESET_INDUSTRIAL,
    urban: PRESET_URBAN,
    earth: PRESET_EARTH,
    clinical: PRESET_CLINICAL,
    'quiet-luxury': PRESET_QUIET_LUXURY
};
