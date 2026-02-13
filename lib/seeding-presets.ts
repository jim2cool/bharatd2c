export const CATEGORY_PRESETS: Record<string, any> = {
    fashion: {
        presetId: 'editorial',
        colors: { primary: '#dc2626', secondary: '#1f2937', accent: '#f59e0b', background: '#ffffff', surface: '#f3f4f6', text: '#111827' },
        typography: { headingFont: 'Space Grotesk', bodyFont: 'Inter', scale: 'default', lineHeight: 'tight', paragraphGap: 'compact' },
        corners: { buttons: 'pill', cards: 'sharp', inputs: 'subtle', images: 'sharp', badges: 'pill', selectors: 'subtle' }
    },
    beauty: {
        presetId: 'nature',
        colors: { primary: '#2f4f4f', secondary: '#5f7f7f', accent: '#8fbc8f', background: '#fdfbf7', surface: '#f5f2eb', text: '#2f3f2f' },
        typography: { headingFont: 'Outfit', bodyFont: 'DM Sans', scale: 'default', lineHeight: 'spacious', paragraphGap: 'loose' },
        corners: { buttons: 'rounded', cards: 'rounded', inputs: 'rounded', images: 'rounded', badges: 'pill', selectors: 'rounded' }
    },
    tech: {
        presetId: 'tech',
        colors: { primary: '#2563eb', secondary: '#3b82f6', accent: '#06b6d4', background: '#f8fafc', surface: '#ffffff', text: '#0f172a' },
        typography: { headingFont: 'Inter', bodyFont: 'Inter', scale: 'default', lineHeight: 'default', paragraphGap: 'default' },
        corners: { buttons: 'subtle', cards: 'subtle', inputs: 'subtle', images: 'subtle', badges: 'pill', selectors: 'subtle' }
    },
    home: {
        presetId: 'luxury',
        colors: { primary: '#0f172a', secondary: '#1e293b', accent: '#d4af37', background: '#fafafa', surface: '#ffffff', text: '#0f172a' },
        typography: { headingFont: 'Playfair Display', bodyFont: 'Inter', scale: 'default', lineHeight: 'spacious', paragraphGap: 'default' },
        corners: { buttons: 'sharp', cards: 'sharp', inputs: 'sharp', images: 'sharp', badges: 'subtle', selectors: 'sharp' }
    },
    other: {
        presetId: 'modern',
        colors: { primary: '#111111', secondary: '#333333', accent: '#e26a00', background: '#ffffff', surface: '#f9f9f9', text: '#111111' },
        typography: { headingFont: 'Inter', bodyFont: 'Inter', scale: 'default', lineHeight: 'default', paragraphGap: 'default' },
        corners: { buttons: 'subtle', cards: 'subtle', inputs: 'subtle', images: 'subtle', badges: 'pill', selectors: 'subtle' }
    }
}
