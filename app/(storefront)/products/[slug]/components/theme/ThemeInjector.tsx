"use client"

import React from 'react';
import { StylePreset } from '@/types/architecture';

interface ThemeInjectorProps {
    style: StylePreset;
    children: React.ReactNode;
}

/**
 * ThemeInjector (Client Component)
 * Converts DRS v3 StylePreset tokens into CSS variables.
 * Note: This mirrors the logic in ThemeProvider.tsx but allows for scoped 
 * style injection if needed, though for PDP it usually affects global root.
 */
export function ThemeInjector({ style, children }: ThemeInjectorProps) {
    if (!style) return <>{children}</>;

    // ── RADIUS MAPPING ──────────────────────────────────────────────────────
    const radiusMap = {
        sharp: { sm: "0px", md: "0px", lg: "0px", full: "0px" },
        clean: { sm: "0.25rem", md: "0.375rem", lg: "0.5rem", full: "9999px" },
        soft: { sm: "0.375rem", md: "0.5rem", lg: "0.75rem", full: "9999px" },
        round: { sm: "0.5rem", md: "0.75rem", lg: "1rem", full: "9999px" },
        pill: { sm: "0.75rem", md: "1rem", lg: "1.5rem", full: "9999px" },
    };

    const radius = radiusMap[style.shape.radiusScale] || radiusMap.clean;

    // ── SHADOW MAPPING ──────────────────────────────────────────────────────
    const shadowMap = {
        flat: "none",
        soft: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        raised: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        floating: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    };

    const shadow = shadowMap[style.shape.elevation] || shadowMap.soft;

    const variables = {
        // Colors
        '--bg-background': style.colors.background,
        '--bg-surface': style.colors.surface,
        '--text-primary': style.colors.textPrimary,
        '--text-secondary': style.colors.textSecondary,
        '--col-primary': style.colors.primary,
        '--col-primary-fg': style.colors.primaryForeground,
        '--col-secondary': style.colors.secondary,
        '--col-secondary-fg': style.colors.secondaryForeground,
        '--col-accent': style.colors.accent,
        '--col-border': style.colors.border,
        '--col-success': style.colors.success,
        '--col-error': style.colors.error,
        '--col-warning': style.colors.warning,

        // Typography
        '--font-heading': `"${style.typography.headingFont}", system-ui, sans-serif`,
        '--font-body': `"${style.typography.bodyFont}", system-ui, sans-serif`,
        '--heading-case': style.typography.headingCase,
        '--heading-weight': style.typography.headingWeight,
        '--letter-spacing': style.typography.letterSpacing,
        '--line-height': style.typography.lineHeight,

        // Shape
        '--radius-button': radius.md,
        '--radius-card': radius.lg,
        '--radius-image': radius.lg,
        '--radius-input': radius.sm,
        '--shadow-card': shadow,

        // Motion
        '--motion-speed': style.motion.speed === 'fast' ? '150ms' :
            style.motion.speed === 'relaxed' ? '500ms' : '300ms',
        '--motion-ease': style.motion.intensity === 'expressive' ? 'cubic-bezier(0.34, 1.56, 0.64, 1)' :
            style.motion.intensity === 'subtle' ? 'ease-out' : 'ease-in-out',
    } as React.CSSProperties;

    return (
        <div style={variables} className="contents">
            <style jsx global>{`
            body {
                background-color: var(--bg-background);
                color: var(--text-primary);
                font-family: var(--font-body);
            }
            h1, h2, h3, h4, h5, h6 {
                font-family: var(--font-heading);
                text-transform: var(--heading-case);
                font-weight: var(--heading-weight);
                letter-spacing: var(--letter-spacing);
            }
        `}</style>
            {children}
        </div>
    );
}
