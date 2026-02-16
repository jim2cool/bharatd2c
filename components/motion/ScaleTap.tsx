'use client'

import { motion } from 'framer-motion'
import { ReactNode, MouseEventHandler } from 'react'
import { useMotion } from './InteractionProvider'

interface ScaleTapProps {
    children: ReactNode
    className?: string
    onClick?: MouseEventHandler<HTMLDivElement>
}

export function ScaleTap({ children, className = '', onClick, ...props }: ScaleTapProps) {
    const { scaleTap, duration } = useMotion()

    return (
        <motion.div
            className={className}
            whileTap={{ scale: scaleTap }}
            transition={{ duration: duration * 0.5, ease: 'easeOut' }}
            onClick={onClick}
            {...props}
        >
            {children}
        </motion.div>
    )
}
