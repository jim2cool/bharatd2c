"use client"

import React from 'react';
import { StylePreset } from '@/types/architecture';

interface ThemeInjectorProps {
    style: StylePreset;
    children: React.ReactNode;
}

export function ThemeInjector({ style, children }: ThemeInjectorProps) {
    if (!style) return <>{children}</>;

    // Convert camelCase to kebab-case for CSS variables
    // e.g. textPrimary -> --text-primary
    // but specific mapping allows for better control
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

        // Typography settings (font families would be loaded globally or via Next.js font optimization)
        '--font-heading': style.typography.headingFont,
        '--font-body': style.typography.bodyFont,
        '--heading-case': style.typography.headingCase,
        '--heading-weight': style.typography.headingWeight,
        '--letter-spacing': style.typography.letterSpacing,
        '--line-height': style.typography.lineHeight,

        // Shape
        '--radius-scale': style.shape.radiusScale === 'round' ? '1rem' :
            style.shape.radiusScale === 'pill' ? '9999px' :
                style.shape.radiusScale === 'sharp' ? '0px' :
                    style.shape.radiusScale === 'clean' ? '0.5rem' : '0.75rem',

        '--shadow-elevation': style.shape.elevation === 'flat' ? 'none' :
            style.shape.elevation === 'raised' ? '0 10px 15px -3px rgb(0 0 0 / 0.1)' :
                style.shape.elevation === 'floating' ? '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' : '0 4px 6px -1px rgb(0 0 0 / 0.1)',

        '--border-width': style.shape.borderStyle === 'thick' ? '2px' :
            style.shape.borderStyle === 'hairline' ? '1px' :
                style.shape.borderStyle === 'none' ? '0px' : '1px',

        // Motion
        '--motion-speed': style.motion.speed === 'fast' ? '150ms' :
            style.motion.speed === 'relaxed' ? '500ms' : '300ms',
        '--motion-ease': style.motion.intensity === 'expressive' ? 'cubic-bezier(0.34, 1.56, 0.64, 1)' :
            style.motion.intensity === 'subtle' ? 'ease-out' : 'ease-in-out',
    } as React.CSSProperties;

    return (
        <div style={variables} className="contents">
            <style jsx global>{`
            :root {
                --radius-button: var(--radius-scale);
                --radius-card: var(--radius-scale);
                --radius-input: var(--radius-scale);
            }
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
