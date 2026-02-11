"use client";

import React from "react";

// ═══════════════════════════════════════════════════════════════════════════
// ENHANCED THEME CONFIG SCHEMA - Component-Level Styling
// ═══════════════════════════════════════════════════════════════════════════
export type ThemeConfig = {
  presetId?: string;

  // 1. COLOR SYSTEM (6 semantic colors)
  colors: {
    primary: string;      // Brand main color (CTA buttons)
    secondary: string;    // Supporting brand color
    accent: string;       // Highlights, badges
    background: string;   // Page background
    surface: string;      // Card/section backgrounds
    text: string;         // Base text color
  };

  // 2. COMPONENT-LEVEL CORNERS
  corners: {
    buttons: "sharp" | "subtle" | "rounded" | "pill";
    cards: "sharp" | "subtle" | "rounded";
    inputs: "sharp" | "subtle" | "rounded";
    images: "sharp" | "subtle" | "rounded" | "circle";
    badges: "sharp" | "subtle" | "pill";
    selectors: "sharp" | "subtle" | "rounded";
  };

  // 3. BUTTON STYLING
  buttons: {
    primaryStyle: "solid" | "gradient" | "glow";
    secondaryStyle: "outline" | "ghost" | "subtle";
    shadow: "none" | "subtle" | "elevated";
  };

  // 4. SPACING & LAYOUT
  spacing: {
    sectionGap: "tight" | "default" | "spacious";
    cardGap: "tight" | "default" | "relaxed";
  };

  // 5. TYPOGRAPHY
  typography: {
    headingFont: string;
    bodyFont: string;
    scale: "compact" | "default" | "large";
    lineHeight: "tight" | "default" | "spacious";
    paragraphGap: "compact" | "default" | "loose";
  };
};

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULTS & HELPERS
// ═══════════════════════════════════════════════════════════════════════════

const DEFAULT_CONFIG: ThemeConfig = {
  colors: {
    primary: "#111111",
    secondary: "#333333",
    accent: "#e26a00",
    background: "#ffffff",
    surface: "#f9f9f9",
    text: "#111111",
  },
  corners: {
    buttons: "rounded",
    cards: "subtle",
    inputs: "subtle",
    images: "subtle",
    badges: "pill",
    selectors: "subtle",
  },
  buttons: {
    primaryStyle: "solid",
    secondaryStyle: "outline",
    shadow: "subtle",
  },
  spacing: {
    sectionGap: "default",
    cardGap: "default",
  },
  typography: {
    headingFont: "Inter",
    bodyFont: "Inter",
    scale: "default",
    lineHeight: "default",
    paragraphGap: "default",
  },
};

// Corner value mappings
const CORNER_VALUES = {
  sharp: "0px",
  subtle: "0.5rem",
  rounded: "1rem",
  pill: "9999px",
  circle: "50%",
};

// Spacing value mappings
const SPACING_VALUES = {
  sectionGap: { tight: "2rem", default: "4rem", spacious: "6rem" },
  cardGap: { tight: "0.75rem", default: "1.5rem", relaxed: "2rem" },
};

// Shadow value mappings
const SHADOW_VALUES = {
  none: "none",
  subtle: "0 2px 8px rgba(0,0,0,0.08)",
  elevated: "0 4px 20px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.06)",
};

// Typography scale mappings
const TYPOGRAPHY_SCALE = {
  compact: { h1: "2rem", h2: "1.5rem", h3: "1.25rem", body: "0.875rem" },
  default: { h1: "2.5rem", h2: "1.75rem", h3: "1.5rem", body: "1rem" },
  large: { h1: "3rem", h2: "2rem", h3: "1.75rem", body: "1.125rem" },
};

const LINE_HEIGHTS = {
  tight: "1.25",
  default: "1.5",
  spacious: "1.75",
};

const PARAGRAPH_GAPS = {
  compact: "0.5rem",
  default: "1rem",
  loose: "1.5rem",
};

// Helper: Convert hex to RGB for oklch approximation
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    }
    : null;
}

// Helper: Determine if color is light or dark for contrast
function isLightColor(hex: string): boolean {
  const rgb = hexToRgb(hex);
  if (!rgb) return false;
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.5;
}

// Deep merge helper
function deepMerge<T extends object>(defaults: T, overrides: Partial<T> | null | undefined): T {
  if (!overrides) return defaults;
  const result = { ...defaults };
  for (const key in overrides) {
    if (Object.prototype.hasOwnProperty.call(overrides, key)) {
      const val = overrides[key];
      if (val && typeof val === "object" && !Array.isArray(val)) {
        (result as Record<string, unknown>)[key] = deepMerge(
          (defaults as Record<string, unknown>)[key] as object,
          val as object
        );
      } else if (val !== undefined) {
        (result as Record<string, unknown>)[key] = val;
      }
    }
  }
  return result;
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

  // Extract values
  const { colors, corners, buttons, spacing, typography } = config;

  // Determine foreground colors for contrast
  const primaryForeground = isLightColor(colors.primary) ? "#111111" : "#ffffff";
  const secondaryForeground = isLightColor(colors.secondary) ? "#111111" : "#ffffff";
  const accentForeground = isLightColor(colors.accent) ? "#111111" : "#ffffff";
  const bgForeground = isLightColor(colors.background) ? "#111111" : "#f5f5f5";

  // Get typography values with fallbacks
  const scaleKey = typography?.scale || "default";
  const scale = TYPOGRAPHY_SCALE[scaleKey as keyof typeof TYPOGRAPHY_SCALE] || TYPOGRAPHY_SCALE.default;

  const lineHeightKey = typography?.lineHeight || "default";
  const lineHeightValue = LINE_HEIGHTS[lineHeightKey as keyof typeof LINE_HEIGHTS] || LINE_HEIGHTS.default;

  const paragraphGapKey = typography?.paragraphGap || "default";
  const paragraphGapValue = PARAGRAPH_GAPS[paragraphGapKey as keyof typeof PARAGRAPH_GAPS] || PARAGRAPH_GAPS.default;

  // CSS Variables
  const css = `
    :root {
      /* ══════════════════════════════════════════════════════════════════════
         COLOR SYSTEM (6 semantic colors)
         ══════════════════════════════════════════════════════════════════════ */
      --color-primary: ${colors.primary};
      --color-secondary: ${colors.secondary};
      --color-accent: ${colors.accent};
      --color-background: ${colors.background};
      --color-surface: ${colors.surface};
      --color-text: ${colors.text};
      
      --color-primary-foreground: ${primaryForeground};
      --color-secondary-foreground: ${secondaryForeground};
      --color-accent-foreground: ${accentForeground};
      
      /* ══════════════════════════════════════════════════════════════════════
         COMPONENT-LEVEL CORNER RADIUS
         ══════════════════════════════════════════════════════════════════════ */
      --radius-button: ${CORNER_VALUES[corners.buttons]};
      --radius-card: ${CORNER_VALUES[corners.cards]};
      --radius-input: ${CORNER_VALUES[corners.inputs]};
      --radius-image: ${CORNER_VALUES[corners.images === "circle" ? "circle" : corners.images]};
      --radius-badge: ${CORNER_VALUES[corners.badges]};
      --radius-selector: ${CORNER_VALUES[corners.selectors]};
      
      /* Legacy fallbacks */
      --radius-sm: 0.375rem;
      --radius-md: 0.5rem;
      --radius-lg: 1rem;
      --radius: 0.5rem;
      
      /* ══════════════════════════════════════════════════════════════════════
         BUTTON STYLING
         ══════════════════════════════════════════════════════════════════════ */
      --button-shadow: ${SHADOW_VALUES[buttons.shadow]};
      
      /* ══════════════════════════════════════════════════════════════════════
         SPACING & LAYOUT
         ══════════════════════════════════════════════════════════════════════ */
      --spacing-section: ${SPACING_VALUES.sectionGap[spacing.sectionGap]};
      --spacing-card-gap: ${SPACING_VALUES.cardGap[spacing.cardGap]};
      
      /* ══════════════════════════════════════════════════════════════════════
         TYPOGRAPHY
         ══════════════════════════════════════════════════════════════════════ */
      --font-heading: "${typography.headingFont}", system-ui, sans-serif;
      --font-body: "${typography.bodyFont}", system-ui, sans-serif;
      --font-sans: "${typography.bodyFont}", system-ui, sans-serif;
      
      --text-h1: ${scale.h1};
      --text-h2: ${scale.h2};
      --text-h3: ${scale.h3};
      --text-body: ${scale.body};
      
      --line-height: ${lineHeightValue};
      --paragraph-gap: ${paragraphGapValue};
      
      /* ══════════════════════════════════════════════════════════════════════
         SHADCN UI TOKENS (Override for compatibility)
         ══════════════════════════════════════════════════════════════════════ */
      --primary: ${colors.primary};
      --primary-foreground: ${primaryForeground};
      
      --secondary: ${colors.secondary};
      --secondary-foreground: ${secondaryForeground};
      
      --accent: ${colors.accent};
      --accent-foreground: ${accentForeground};
      
      --background: ${colors.background};
      --foreground: ${bgForeground};
      
      --card: ${colors.surface};
      --card-foreground: ${bgForeground};
      
      --muted: ${isLightColor(colors.background) ? "#f6f6f6" : "#2a2a2a"};
      --muted-foreground: ${isLightColor(colors.background) ? "#666666" : "#a0a0a0"};
      
      --border: ${isLightColor(colors.background) ? "#e6e6e6" : "#3a3a3a"};
      --input: ${isLightColor(colors.background) ? "#e6e6e6" : "#3a3a3a"};
      --ring: ${colors.primary};
    }
    
    /* ══════════════════════════════════════════════════════════════════════
       COMPONENT-SPECIFIC UTILITY CLASSES
       ══════════════════════════════════════════════════════════════════════ */
    
    /* Buttons */
    .btn-primary {
      background-color: var(--color-primary);
      color: var(--color-primary-foreground);
      border-radius: var(--radius-button);
      box-shadow: var(--button-shadow);
    }
    
    .btn-secondary {
      background-color: var(--color-secondary);
      color: var(--color-secondary-foreground);
      border-radius: var(--radius-button);
    }
    
    .btn-accent {
      background-color: var(--color-accent);
      color: var(--color-accent-foreground);
      border-radius: var(--radius-button);
    }
    
    /* Cards */
    .theme-card {
      border-radius: var(--radius-card);
      background-color: var(--color-surface);
    }
    
    /* Inputs */
    .theme-input {
      border-radius: var(--radius-input);
    }
    
    /* Images */
    .theme-image {
      border-radius: var(--radius-image);
    }
    
    /* Badges */
    .theme-badge {
      border-radius: var(--radius-badge);
    }
    
    /* Selectors (quantity, variants) */
    .theme-selector {
      border-radius: var(--radius-selector);
    }
    
    /* Section spacing */
    .theme-section {
      padding-top: var(--spacing-section);
      padding-bottom: var(--spacing-section);
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      {children}
    </>
  );
}

// Export defaults for use in Admin UI
export { DEFAULT_CONFIG };
