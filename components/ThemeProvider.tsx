import { ArchitectureConfig, StylePreset, SellerModifier } from "@/types/architecture";

export type ThemeConfig = ArchitectureConfig & {
  presetId?: string;

  // 1. BRAND TOKENS (Identity) - BACKWARD COMPAT (Mapped to Style)
  colors: StylePreset['colors'];
  brand: {
    gradientStyle: "none" | "subtle" | "bold";
    darkMode: boolean;
  };

  // 2. TYPOGRAPHY SYSTEM (Mapped to Style)
  typography: StylePreset['typography'] & {
    accentFont?: string;
  };

  // 3. SHAPE & DEPTH (Mapped to Style)
  shape: StylePreset['shape'] & {
    cornerSmoothing: boolean;
  };

  // 4. DENSITY & SPACING (Mapped to Seller)
  density: SellerModifier & {
    sectionPadding: number;
    componentGap: number;
    gridTightness: "tight" | "normal" | "relaxed";
  };

  // 5. MOTION & INTERACTION (Mapped to Style)
  motion: StylePreset['motion'] & {
    enabled: boolean;
    hoverMode: string;
    scrollReveal: string;
  };

  // 6. CONVERSION VISUALS (Mapped to Seller)
  conversion: SellerModifier & {
    urgencyStyle: "simple" | "highlighted" | "alarming";
    badgeStyle: string;
  };
};

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULTS & HELPERS
// ═══════════════════════════════════════════════════════════════════════════

const DEFAULT_STYLE: StylePreset = {
  id: 'minimal',
  colors: {
    background: "#ffffff",
    surface: "#f9fafb",
    textPrimary: "#111827",
    textSecondary: "#6b7280",
    primary: "#111111",
    primaryForeground: "#ffffff",
    secondary: "#f3f4f6",
    secondaryForeground: "#1f2937",
    accent: "#ef4444",
    border: "#e5e7eb",
    success: "#22c55e",
    error: "#ef4444",
    warning: "#f59e0b",
  },
  typography: {
    headingFont: "Inter",
    bodyFont: "Inter",
    headingCase: "normal",
    headingWeight: 700,
    letterSpacing: "normal",
    lineHeight: "normal",
    scale: "modern",
  },
  shape: {
    radiusScale: "clean",
    elevation: "soft",
    borderStyle: "subtle",
  },
  motion: {
    intensity: "normal",
    speed: "normal",
  },
};

const DEFAULT_SELLER: SellerModifier = {
  urgencyLevel: 'medium',
  socialProofWeight: 'medium',
  trustDensity: 'medium',
  ctaProminence: 'balanced',
  densityScale: 'balanced',
  codBias: true,
};

const DEFAULT_CONFIG: ThemeConfig = {
  presetId: "custom",
  architecture: 'product-engine',
  seller: DEFAULT_SELLER,
  category: {
    category: 'multi',
    requiredModules: [],
    optionalModules: [],
    imageRatio: '1:1',
    variantSelectorType: 'dropdown',
  },
  style: DEFAULT_STYLE,

  // Backward Compat Fields
  colors: DEFAULT_STYLE.colors,
  brand: {
    gradientStyle: "none",
    darkMode: false,
  },
  typography: {
    ...DEFAULT_STYLE.typography,
    accentFont: "Inter",
  },
  shape: {
    ...DEFAULT_STYLE.shape,
    cornerSmoothing: true,
  },
  density: {
    ...DEFAULT_SELLER,
    sectionPadding: 1,
    componentGap: 1,
    gridTightness: "normal",
  },
  motion: {
    ...DEFAULT_STYLE.motion,
    enabled: true,
    hoverMode: "lift",
    scrollReveal: "fade",
  },
  conversion: {
    ...DEFAULT_SELLER,
    urgencyStyle: "highlighted",
    badgeStyle: "bold",
  },
};

// --- MAPPINGS ---

const RADIUS_MAP = {
  sharp: { sm: "0px", md: "0px", lg: "0px", full: "0px" },
  clean: { sm: "0.25rem", md: "0.375rem", lg: "0.5rem", full: "9999px" },
  soft: { sm: "0.375rem", md: "0.5rem", lg: "0.75rem", full: "9999px" },
  round: { sm: "0.5rem", md: "0.75rem", lg: "1rem", full: "9999px" },
  pill: { sm: "0.75rem", md: "1rem", lg: "1.5rem", full: "9999px" },
};

const SHADOW_MAP = {
  flat: "none",
  soft: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  raised: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  floating: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
};

const TYPE_SCALE = {
  classic: { h1: "2.5rem", h2: "2rem", h3: "1.75rem", body: "1rem" },
  modern: { h1: "3.5rem", h2: "2.5rem", h3: "2rem", body: "1rem" },
  expressive: { h1: "4.5rem", h2: "3.5rem", h3: "2.5rem", body: "1.125rem" },
};

// Helper functions
function isObject(item: any) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

function deepMerge(target: any, source: any): any {
  if (!source) return target;

  const output = { ...target };
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

// CSS Generation Logic
function generateCss(config: ThemeConfig) {
  const { style, seller } = config;

  // 1. Colors
  const colors = `
        --background: ${style.colors.background};
        --foreground: ${style.colors.textPrimary};
        --card: ${style.colors.surface};
        --card-foreground: ${style.colors.textPrimary};
        --popover: ${style.colors.surface};
        --popover-foreground: ${style.colors.textPrimary};
        --primary: ${style.colors.primary};
        --primary-foreground: ${style.colors.primaryForeground};
        --secondary: ${style.colors.secondary};
        --secondary-foreground: ${style.colors.secondaryForeground};
        --muted: ${style.colors.surface}; 
        --muted-foreground: ${style.colors.textSecondary};
        --accent: ${style.colors.secondary};
        --accent-foreground: ${style.colors.secondaryForeground};
        --destructive: ${style.colors.error};
        --destructive-foreground: #ffffff;
        --border: ${style.colors.border};
        --input: ${style.colors.border};
        --ring: ${style.colors.primary};
        
        --color-success: ${style.colors.success};
        --color-warning: ${style.colors.warning};
        --color-urgency: ${style.colors.accent};
        --gradient-opacity: ${config.brand?.gradientStyle === 'bold' ? '0.15' : config.brand?.gradientStyle === 'subtle' ? '0.05' : '0'};
        
        /* Tailwind v4 Color Aliases */
        --color-primary: ${style.colors.primary};
        --color-accent: ${style.colors.secondary};
        --color-background: ${style.colors.background};
        --color-foreground: ${style.colors.textPrimary};
    `;

  // 2. Shape
  const radius = RADIUS_MAP[style.shape.radiusScale] || RADIUS_MAP.clean;
  const shapes = `
        --radius: ${radius.md};
        --radius-sm: ${radius.sm};
        --radius-md: ${radius.md};
        --radius-lg: ${radius.lg};
        --radius-full: ${radius.full};
        
        /* Semantic Radius Mappings */
        --radius-button: ${radius.md};
        --radius-card: ${radius.lg};
        --radius-input: ${radius.sm};
        --radius-image: ${radius.lg};

        --shadow-elevation: ${SHADOW_MAP[style.shape.elevation] || SHADOW_MAP.soft};
        --border-width: ${style.shape.borderStyle === 'none' ? '0px' : style.shape.borderStyle === 'hairline' ? '1px' : '2px'};
    `;

  // 3. Typography
  const scale = TYPE_SCALE[style.typography.scale] || TYPE_SCALE.modern;
  const typography = `
        --font-heading: "${style.typography.headingFont}", system-ui, sans-serif;
        --font-body: "${style.typography.bodyFont}", system-ui, sans-serif;
        --text-h1: ${scale.h1};
        --text-h2: ${scale.h2};
        --text-h3: ${scale.h3};
        --text-body: ${scale.body};
        --font-weight-heading: ${style.typography.headingWeight};
        --text-transform-heading: ${style.typography.headingCase};
        --letter-spacing: ${style.typography.letterSpacing === 'tight' ? '-0.025em' : style.typography.letterSpacing === 'wide' ? '0.05em' : '0'};
        --line-height: ${style.typography.lineHeight === 'compact' ? '1.2' : style.typography.lineHeight === 'loose' ? '1.75' : '1.5'};
    `;

  // 4. Density
  const density = `
        --spacing-section: calc(4rem * ${config.density?.sectionPadding || 1});
        --spacing-gap: calc(1.5rem * ${config.density?.componentGap || 1});
        --container-max: ${seller.densityScale === 'compact' ? '1024px' : seller.densityScale === 'airy' ? '1536px' : '1280px'};
    `;

  // 5. Conversion
  const conversion = `
        --social-proof-opacity: ${seller.socialProofWeight === 'light' ? '0.5' : seller.socialProofWeight === 'medium' ? '0.8' : '1.0'};
        --cta-scale: ${seller.ctaProminence === 'dominant' ? '1.05' : '1.0'};
  `;

  return `
        :root {
            ${colors}
            ${shapes}
            ${typography}
            ${density}
            ${conversion}
        }
    `;
}

// ═══════════════════════════════════════════════════════════════════════════
// THEME PROVIDER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function ThemeProvider({
  themeConfig,
  children,
}: {
  themeConfig: Partial<ThemeConfig> | null;
  children: React.ReactNode;
}) {
  // Merge with defaults to ensure all values exist
  const config = deepMerge(DEFAULT_CONFIG, themeConfig);
  const css = generateCss(config);

  return (
    <>
      {/* Security: css content is generated from trusted configuration objects (enums, numbers, hex codes). Font names should be validated at input source. */}
      <style dangerouslySetInnerHTML={{ __html: css }} />
      {children}
    </>
  );
}

// Export defaults for use in Admin UI
export { DEFAULT_CONFIG };
