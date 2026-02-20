
export const FONT_OPTIONS = [
    { value: "Inter", label: "Inter (Universal)" },
    { value: "Outfit", label: "Outfit (Modern)" },
    { value: "Plus Jakarta Sans", label: "Plus Jakarta (Geometric)" },
    { value: "Playfair Display", label: "Playfair Display (Serif)" },
    { value: "Poppins", label: "Poppins (Friendly)" },
    { value: "Space Grotesk", label: "Space Grotesk (Tech)" },
    { value: "Montserrat", label: "Montserrat (Bold/Urban)" },
    { value: "Cormorant Garamond", label: "Cormorant (Elegant Serif)" },
    { value: "Lora", label: "Lora (Readable Serif)" },
    { value: "Anton", label: "Anton (Display)" },
    { value: "JetBrains Mono", label: "JetBrains Mono (Code)" },
    { value: "Dancing Script", label: "Dancing Script (Cursive)" },
];

export const PRESETS: any[] = [
    {
        id: "minimal-editorial",
        presetId: "minimal-editorial",
        name: "Minimal / Editorial Luxury",
        description: "Serif headings, high contrast, airy",
        architecture: "product-engine",
        seller: {
            urgencyLevel: 'medium', socialProofWeight: 'medium', trustDensity: 'medium',
            ctaProminence: 'balanced', densityScale: 'balanced', codBias: true
        },
        category: {
            category: 'multi', requiredModules: [], optionalModules: [],
            imageRatio: '1:1', variantSelectorType: 'dropdown'
        },
        style: {
            id: 'minimal',
            colors: {
                background: "#F8F8F6", surface: "#FFFFFF", textPrimary: "#111111", textSecondary: "#6E6E6E",
                primary: "#1E1E1E", primaryForeground: "#FFFFFF", secondary: "#D6D6D6", secondaryForeground: "#111111",
                accent: "#B8A98F", border: "#EAEAEA", success: "#2E7D32", error: "#C62828", warning: "#ED6C02"
            },
            typography: {
                headingFont: "Cormorant Garamond", bodyFont: "Inter", scale: "classic",
                headingCase: "normal", headingWeight: 600, letterSpacing: "normal", lineHeight: "loose"
            },
            shape: { radiusScale: "clean", elevation: "raised", borderStyle: "subtle" },
            motion: { intensity: "normal", speed: "relaxed" }
        },
        // Flat fields for UI compatibility
        colors: {
            background: "#F8F8F6", surface: "#FFFFFF", textPrimary: "#111111", textSecondary: "#6E6E6E",
            primary: "#1E1E1E", primaryForeground: "#FFFFFF", secondary: "#D6D6D6", secondaryForeground: "#111111",
            accent: "#B8A98F", border: "#EAEAEA", success: "#2E7D32", error: "#C62828", warning: "#ED6C02"
        },
        typography: { headingFont: "Cormorant Garamond", bodyFont: "Inter", scale: "classic", headingCase: "normal", headingWeight: "semibold", letterSpacing: "normal", lineHeight: "loose" },
        shape: { radiusScale: "clean", elevation: "raised", borderStyle: "subtle", cornerSmoothing: true },
        density: { densityScale: "airy", sectionPadding: 1.4, componentGap: 1.25, gridTightness: "relaxed" },
        motion: { enabled: true, intensity: "expressive", speed: "relaxed", hoverMode: "lift", scrollReveal: "fade" },
        conversion: { ctaProminence: "balanced", badgeStyle: "minimal", socialProofWeight: "subtle", urgencyStyle: "simple" },
        brand: { gradientStyle: "none", darkMode: false },
    },
    {
        id: "performance-cro",
        presetId: "performance-cro",
        name: "Performance CRO",
        description: "Standard Blue/Red, compact, trust-focused",
        architecture: "product-engine",
        seller: {
            urgencyLevel: 'high', socialProofWeight: 'heavy', trustDensity: 'high',
            ctaProminence: 'dominant', densityScale: 'compact', codBias: true
        },
        category: {
            category: 'multi', requiredModules: [], optionalModules: [],
            imageRatio: '1:1', variantSelectorType: 'dropdown'
        },
        style: {
            id: 'cro',
            colors: {
                background: "#FFFFFF", surface: "#FFFFFF", textPrimary: "#111827", textSecondary: "#4B5563",
                primary: "#1D4ED8", primaryForeground: "#FFFFFF", secondary: "#E5E7EB", secondaryForeground: "#111827",
                accent: "#DC2626", border: "#E5E7EB", success: "#22c55e", error: "#ef4444", warning: "#f59e0b"
            },
            typography: {
                headingFont: "Inter", bodyFont: "Inter", scale: "modern",
                headingCase: "normal", headingWeight: 700, letterSpacing: "tight", lineHeight: "normal"
            },
            shape: { radiusScale: "clean", elevation: "soft", borderStyle: "hairline" },
            motion: { intensity: "subtle", speed: "fast" }
        },
        // Flat fields
        colors: {
            background: "#FFFFFF", surface: "#F7F8F9", textPrimary: "#1C1C1C", textSecondary: "#6B7280",
            primary: "#0055CC", primaryForeground: "#FFFFFF", secondary: "#E2E8F0", secondaryForeground: "#1E293B",
            accent: "#EB4E4B", border: "#E2E8F0", success: "#10B981", error: "#EF4444", warning: "#F59E0B"
        },
        typography: { headingFont: "Inter", bodyFont: "Inter", scale: "modern", headingCase: "normal", headingWeight: "bold", letterSpacing: "tight", lineHeight: "normal" },
        shape: { radiusScale: "clean", elevation: "soft", borderStyle: "hairline", cornerSmoothing: false },
        density: { densityScale: "compact", sectionPadding: 0.9, componentGap: 0.75, gridTightness: "tight" },
        motion: { enabled: true, intensity: "subtle", speed: "fast", hoverMode: "lift", scrollReveal: "none" },
        conversion: { ctaProminence: "aggressive", badgeStyle: "pill", socialProofWeight: "heavy", urgencyStyle: "alarming" },
        brand: { gradientStyle: "none", darkMode: false },
    }
];
