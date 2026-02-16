'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, ReactNode } from 'react'
import { useMotion } from './InteractionProvider'

interface ParallaxProps {
    children: ReactNode
    speed?: number
    className?: string
}

export function Parallax({ children, speed = 0.15, className = '' }: ParallaxProps) {
    const { reducedMotion } = useMotion()
    const ref = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start']
    })

    const y = useTransform(scrollYProgress, [0, 1], ['0%', `${speed * 100}%`])

    if (reducedMotion) return <div ref={ref} className={className}>{children}</div>

    return (
        <div ref={ref} className={`overflow-hidden ${className}`}>
            <motion.div style={{ y }} className="will-change-transform">
                {children}
            </motion.div>
        </div>
    )
}
