import { ArchitectureConfig, StylePreset, SellerModifier } from "@/types/architecture";
import { StoreConfig } from "@/types/store-config";

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
  id: 'Minimal', // G1 fix: must match ob_design_tokens.mood_card_name exactly
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
  architecture: 'product_engine',
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

// ═══════════════════════════════════════════════════════════════════════════
// CSS GENERATION — DRS v3 COMPLIANT
// Injects all 26 mood-card tokens from vw_store_config_resolved flat columns.
// Legacy style fallbacks are preserved for stores not yet on intelligence mode.
// ═══════════════════════════════════════════════════════════════════════════
function generateCss(config: ThemeConfig, sc?: Partial<StoreConfig>) {
  const { style, seller } = config;

  // ── 1. COLOUR TOKENS ─────────────────────────────────────────────────────
  // Priority: v3 flat tokens from vw_store_config_resolved > legacy style obj

  const primary = sc?.primary_colour || sc?.cta_colour || style.colors.primary;
  const primaryFg = sc?.cta_text_colour || style.colors.primaryForeground;
  const bgPrimary = sc?.background_colour || style.colors.background;
  const bgSecondary = (sc as any)?.bg_secondary || sc?.surface_colour || style.colors.surface;
  const bgHero = (sc as any)?.bg_hero || bgPrimary;
  const textPrimary = (sc as any)?.text_primary_colour || style.colors.textPrimary;
  const textSecondary = (sc as any)?.text_secondary_colour || sc?.secondary_colour || style.colors.textSecondary;
  const textOnDark = (sc as any)?.text_on_dark || "#ffffff";
  const borderColour = (sc as any)?.border_colour || style.colors.border;
  const borderDark = (sc as any)?.border_dark || borderColour;
  const accent = sc?.secondary_colour || style.colors.accent;
  const accentGold = (sc as any)?.accent_gold || null;
  const starColour = (sc as any)?.star_colour || "#F59E0B";

  // ── 2. RADIUS TOKENS ─────────────────────────────────────────────────────
  const radius = RADIUS_MAP[style.shape.radiusScale] || RADIUS_MAP.clean;
  const radiusButton = sc?.border_radius_button || radius.md;
  const radiusCard = sc?.border_radius_card || radius.lg;
  const radiusImage = sc?.border_radius_image || radius.lg;
  const radiusBadge = (sc as any)?.border_radius_badge || radius.full;
  const heroRadius = (sc as any)?.hero_radius || radiusImage;

  // ── 3. SHADOW TOKENS ─────────────────────────────────────────────────────
  // Note: view exposes shadow_hover (card-level shadow) and shadow_cta — not shadow_token
  const shadowCard = (sc as any)?.shadow_hover || SHADOW_MAP[style.shape.elevation] || SHADOW_MAP.soft;
  const shadowHover = (sc as any)?.shadow_hover ? `${(sc as any).shadow_hover}, 0 8px 24px rgba(0,0,0,0.12)` : SHADOW_MAP.floating;
  const shadowCta = (sc as any)?.shadow_cta || "none";

  // ── 4. TYPOGRAPHY TOKENS ─────────────────────────────────────────────────
  const scale = TYPE_SCALE[style.typography.scale] || TYPE_SCALE.modern;
  const headingFont = sc?.heading_font ? `"${sc.heading_font}"` : `"${style.typography.headingFont}"`;
  const bodyFont = sc?.body_font ? `"${sc.body_font}"` : `"${style.typography.bodyFont}"`;

  // ── 5. MOTION TOKENS ─────────────────────────────────────────────────────
  const motionDuration = (sc as any)?.motion_duration || sc?.motion_enter_duration || "300ms";
  const motionEasing = sc?.motion_easing || "easeOut";
  const motionScaleTap = (sc as any)?.motion_scale_tap || "0.98";
  const motionYOffset = (sc as any)?.motion_y_offset || "12";

  // ── 6. SEMANTIC COMPONENT TOKENS (urgency / callout / badge) ─────────────
  const urgencyBg = (sc as any)?.urgency_bg || "#EEF2FF";
  const urgencyText = (sc as any)?.urgency_text || primary;
  const calloutBg = (sc as any)?.callout_bg || bgSecondary;
  const calloutBorder = (sc as any)?.callout_border || borderColour;
  const badgeBg = (sc as any)?.badge_bg || urgencyBg;
  const badgeText = (sc as any)?.badge_text || urgencyText;

  // ── 7. SHIMMER TOKENS (Phase 15) ──────────────────────────────────────────
  const shimmerBase = (sc as any)?.shimmer_base || bgSecondary;
  const shimmerHighlight = (sc as any)?.shimmer_highlight || "#FFFFFF";

  // ── 7. DENSITY ───────────────────────────────────────────────────────────
  const densityMultiplier = sc?.density_multiplier === 'compact' ? 0.8
    : sc?.density_multiplier === 'airy' ? 1.2 : 1;

  const css = `
    :root {
      /* ── COLOUR ─────────────────────────────────────── */
      --primary:            ${primary};
      --primary-foreground: ${primaryFg};
      --bg-primary:         ${bgPrimary};
      --bg-secondary:       ${bgSecondary};
      --bg-hero:            ${bgHero};
      --text-primary:       ${textPrimary};
      --text-secondary:     ${textSecondary};
      --text-on-dark:       ${textOnDark};
      --border:             ${borderColour};
      --border-dark:        ${borderDark};
      --accent:             ${accent};
      ${accentGold ? `--accent-gold: ${accentGold};` : ''}
      --star-colour:        ${starColour};

      /* ── RADIUS ─────────────────────────────────────── */
      --radius-button:  ${radiusButton};
      --radius-card:    ${radiusCard};
      --radius-image:   ${radiusImage};
      --radius-badge:   ${radiusBadge};
      --radius-input:   ${radius.sm};
      --hero-radius:    ${heroRadius};

      /* ── SHADOW ─────────────────────────────────────── */
      --shadow-card:  ${shadowCard};
      --shadow-hover: ${shadowHover};
      --shadow-cta:   ${shadowCta};

      /* ── TYPOGRAPHY ─────────────────────────────────── */
      --heading-font: ${headingFont}, system-ui, sans-serif;
      --body-font:    ${bodyFont}, system-ui, sans-serif;
      --font-heading: ${headingFont}, system-ui, sans-serif;
      --font-body:    ${bodyFont}, system-ui, sans-serif;
      --text-h1:      ${scale.h1};
      --text-h2:      ${scale.h2};
      --text-h3:      ${scale.h3};
      --text-body:    ${scale.body};

      /* ── MOTION ─────────────────────────────────────── */
      --motion-duration:   ${motionDuration};
      --motion-easing:     ${motionEasing};
      --motion-scale-tap:  ${motionScaleTap};
      --motion-y-offset:   ${motionYOffset}px;

      /* ── CTA CANONICAL ALIASES ───────────────────────── */
      --cta-colour:      ${sc?.cta_colour || primary};
      --cta-text-colour: ${sc?.cta_text_colour || primaryFg};

      /* ── SEMANTIC COMPONENTS ─────────────────────────── */
      --urgency-bg:     ${urgencyBg};
      --urgency-text:   ${urgencyText};
      --callout-bg:     ${calloutBg};
      --callout-border: ${calloutBorder};
      --badge-bg:       ${badgeBg};
      --badge-text:     ${badgeText};

      /* ── SHIMMER ────────────────────────────────────── */
      --shimmer-base:      ${shimmerBase};
      --shimmer-highlight: ${shimmerHighlight};

      /* ── PAGE ROOT BACKGROUND (warm/dark cards apply here) */
      background-color: ${bgPrimary};
      color: ${textPrimary};
      --noise-overlay: ${['clinical', 'professional'].includes(sc?.mood_card?.toLowerCase() || '')
      ? `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
      : 'none'};
      --noise-opacity: ${sc?.mood_card?.toLowerCase() === 'clinical' ? '0.05' : '0.03'};

      /* ── DENSITY ─────────────────────────────────────── */
      --section-gap: ${sc?.section_gap || `calc(4rem * ${config.density?.sectionPadding || 1} * ${densityMultiplier})`};
      --component-gap: ${sc?.component_gap || `calc(1.5rem * ${config.density?.componentGap || 1} * ${densityMultiplier})`};
      --spacing-section: var(--section-gap);
      --spacing-gap:     var(--component-gap);
      --component-gap-light: ${sc?.component_gap_light || 'var(--spacing-gap)'};
      --container-max:   ${seller.densityScale === 'compact' ? '1024px' : seller.densityScale === 'airy' ? '1536px' : '1280px'};

      /* ── LEGACY SHADCN ALIASES (backward compat) ─────── */
      --background:           ${bgPrimary};
      --foreground:           ${textPrimary};
      --card:                 ${bgSecondary};
      --card-foreground:      ${textPrimary};
      --popover:              ${bgSecondary};
      --popover-foreground:   ${textPrimary};
      --secondary:            ${bgSecondary};
      --secondary-foreground: ${textSecondary};
      --muted:                ${bgSecondary};
      --muted-foreground:     ${textSecondary};
      --destructive:          ${style.colors.error};
      --destructive-foreground: #ffffff;
      --input:                ${borderColour};
      --ring:                 ${primary};

      /* ── TAILWIND V4 ALIASES ─────────────────────────── */
      --color-primary:    ${primary};
      --color-accent:     ${accent};
      --color-background: ${bgPrimary};
      --color-foreground: ${textPrimary};

      /* ── CONVERSION ──────────────────────────────────── */
      --social-proof-opacity: ${(sc as any)?.trust_density === 'light' ? '0.5' : (sc as any)?.trust_density === 'medium' ? '0.8' : '1.0'};
      --cta-scale: ${(sc as any)?.cta_prominence === 'dominant' ? '1.05' : '1.0'};
    }
  `;

  return css;
}

// ═══════════════════════════════════════════════════════════════════════════
// THEME PROVIDER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

import { InteractionProvider } from "./motion/InteractionProvider";

export default function ThemeProvider({
  themeConfig,
  storeConfig,
  children,
}: {
  themeConfig?: Partial<ThemeConfig> | null;
  storeConfig?: Partial<StoreConfig> | null;
  children: React.ReactNode;
}) {
  // Merge with defaults to ensure all values exist
  const baseThemeConfig = themeConfig || {}; // V3 Architecture dictates reading directly from storeConfig root mapping
  const config = deepMerge(DEFAULT_CONFIG, baseThemeConfig);
  const css = generateCss(config, storeConfig || undefined);

  return (
    <>
      {/* Security: css content is generated from trusted configuration objects (enums, numbers, hex codes). Font names should be validated at input source. */}
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <InteractionProvider tokens={{
        motion_duration: (storeConfig as any)?.motion_duration,
        motion_easing: storeConfig?.motion_easing || undefined,
        motion_scale_tap: (storeConfig as any)?.motion_scale_tap
      }}>
        {children}
      </InteractionProvider>
    </>
  );
}

// Export defaults for use in Admin UI
export { DEFAULT_CONFIG };
