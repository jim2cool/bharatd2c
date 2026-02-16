'use client'

import { motion } from 'framer-motion'
import { ReactNode, useRef } from 'react'
import { useMotion } from './InteractionProvider'

interface FadeInProps {
    children: ReactNode
    delay?: number
    yOffset?: number   // explicit override; otherwise uses --motion-y-offset CSS var
    className?: string
}

export function FadeIn({ children, delay = 0, yOffset, className = '' }: FadeInProps) {
    const { duration, easing, reducedMotion } = useMotion()
    const ref = useRef<HTMLDivElement>(null)

    // Read --motion-y-offset from CSS (set per mood card by ThemeProvider)
    const cssOffset = typeof window !== 'undefined' && ref.current
        ? parseInt(getComputedStyle(ref.current).getPropertyValue('--motion-y-offset') || '12', 10)
        : 12
    const y = yOffset ?? cssOffset

    return (
        <motion.div
            ref={ref}
            className={className}
            initial={{ opacity: 0, y: reducedMotion ? 0 : y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration, ease: easing as any, delay }}
        >
            {children}
        </motion.div>
    )
}


interface FadeInStaggerProps {
    children: ReactNode
    staggerDelay?: number
    className?: string
}

export function FadeInStagger({ children, staggerDelay = 0.08, className = '' }: FadeInStaggerProps) {
    return (
        <motion.div
            className={className}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={{
                visible: { transition: { staggerChildren: staggerDelay } }
            }}
        >
            {children}
        </motion.div>
    )
}

interface FadeInItemProps {
    children: ReactNode
    className?: string
}

export function FadeInItem({ children, className = '' }: FadeInItemProps) {
    const { duration, easing } = useMotion()

    return (
        <motion.div
            className={className}
            variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0, transition: { duration, ease: easing as any } }
            }}
        >
            {children}
        </motion.div>
    )
}
