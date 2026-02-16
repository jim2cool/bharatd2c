'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { useMotion } from './InteractionProvider'

interface StaggerGroupProps {
    children: ReactNode
    staggerDelay?: number  // seconds between each child's entrance
    className?: string
    once?: boolean         // only animate on first viewport entry
}

/**
 * StaggerGroup — container that sequences entrance animations across a list of children.
 * Used for benefit lists, testimonial rows, and component grids.
 * Each direct child should be wrapped with StaggerItem.
 *
 * @example
 * <StaggerGroup>
 *   <StaggerItem><BenefitCard /></StaggerItem>
 *   <StaggerItem><BenefitCard /></StaggerItem>
 * </StaggerGroup>
 */
export function StaggerGroup({
    children,
    staggerDelay = 0.08,
    className = '',
    once = true,
}: StaggerGroupProps) {
    return (
        <motion.div
            className={className}
            initial="hidden"
            whileInView="visible"
            viewport={{ once, margin: '-40px' }}
            variants={{
                visible: {
                    transition: { staggerChildren: staggerDelay }
                }
            }}
        >
            {children}
        </motion.div>
    )
}

interface StaggerItemProps {
    children: ReactNode
    className?: string
}

/**
 * StaggerItem — individual child within a StaggerGroup.
 * Fades in with a slight upward motion, timed by the parent StaggerGroup.
 */
export function StaggerItem({ children, className = '' }: StaggerItemProps) {
    const { duration, easing, reducedMotion } = useMotion()

    return (
        <motion.div
            className={className}
            variants={{
                hidden: { opacity: 0, y: reducedMotion ? 0 : 10 },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration, ease: easing as any }
                }
            }}
        >
            {children}
        </motion.div>
    )
}
