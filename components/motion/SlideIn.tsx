'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { useMotion } from './InteractionProvider'

type Direction = 'bottom' | 'top' | 'left' | 'right'

interface SlideInProps {
    children: ReactNode
    direction?: Direction
    delay?: number
    distance?: number  // px offset, defaults to CSS --motion-y-offset or 16
    className?: string
}

function getDirectionOffset(direction: Direction, distance: number) {
    switch (direction) {
        case 'bottom': return { x: 0, y: distance }
        case 'top': return { x: 0, y: -distance }
        case 'left': return { x: -distance, y: 0 }
        case 'right': return { x: distance, y: 0 }
    }
}

/**
 * SlideIn — directional slide entrance for panels, drawers, and side-entering elements.
 * Calibrated per mood card via --motion-y-offset CSS variable.
 *
 * @example
 * <SlideIn direction="bottom" delay={0.1}>
 *   <Panel />
 * </SlideIn>
 */
export function SlideIn({
    children,
    direction = 'bottom',
    delay = 0,
    distance,
    className = '',
}: SlideInProps) {
    const { duration, easing, reducedMotion } = useMotion()

    // Resolve distance: explicit prop > CSS var > default 16px
    const resolvedDistance = distance ?? (
        typeof window !== 'undefined'
            ? parseInt(
                getComputedStyle(document.documentElement)
                    .getPropertyValue('--motion-y-offset') || '16',
                10
            )
            : 16
    )

    const offset = reducedMotion
        ? { x: 0, y: 0 }
        : getDirectionOffset(direction, resolvedDistance)

    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, ...offset }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, ...offset }}
            transition={{ duration, ease: easing as any, delay }}
        >
            {children}
        </motion.div>
    )
}
