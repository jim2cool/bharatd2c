'use client'

import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useRef, ReactNode } from 'react'
import { useMotion } from './InteractionProvider'

interface MagneticProps {
    children: ReactNode
    strength?: number
    className?: string
}

export function Magnetic({ children, strength = 0.3, className = '' }: MagneticProps) {
    const { reducedMotion } = useMotion()
    const ref = useRef<HTMLDivElement>(null)
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const springX = useSpring(x, { stiffness: 150, damping: 15 })
    const springY = useSpring(y, { stiffness: 150, damping: 15 })

    if (reducedMotion) return <div className={className}>{children}</div>

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = ref.current?.getBoundingClientRect()
        if (!rect) return
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        x.set((e.clientX - centerX) * strength)
        y.set((e.clientY - centerY) * strength)
    }

    const handleMouseLeave = () => {
        x.set(0)
        y.set(0)
    }

    return (
        <motion.div
            ref={ref}
            className={className}
            style={{ x: springX, y: springY }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {children}
        </motion.div>
    )
}
