'use client';

interface ShimmerSkeletonProps {
    className?: string;
    width?: string;
    height?: string;
    rounded?: string;
}

/**
 * CSS-based shimmer skeleton — zero JS overhead.
 * Uses --shimmer-base and --shimmer-highlight from ThemeProvider.
 * Per-card shimmer on CTAs: only Dhamaka and Taza get this on mount —
 * apply shimmer-cta class to their primary CTA button, not this component.
 */
export function ShimmerSkeleton({ className = '', width, height, rounded = 'rounded-[var(--radius-card)]' }: ShimmerSkeletonProps) {
    return (
        <div
            className={`shimmer-skeleton ${rounded} ${className}`}
            style={{ width, height }}
            aria-hidden="true"
        />
    );
}

/**
 * Preset skeleton shapes for common UI elements.
 */
export function ProductCardSkeleton() {
    return (
        <div className="flex flex-col gap-3">
            <ShimmerSkeleton className="w-full aspect-square" />
            <ShimmerSkeleton className="h-4 w-3/4" rounded="rounded-full" />
            <ShimmerSkeleton className="h-4 w-1/2" rounded="rounded-full" />
            <ShimmerSkeleton className="h-8 w-full" rounded="rounded-[var(--radius-button)]" />
        </div>
    );
}

export function TextLineSkeleton({ width = '100%' }: { width?: string }) {
    return <ShimmerSkeleton height="1rem" width={width} rounded="rounded-full" />;
}
