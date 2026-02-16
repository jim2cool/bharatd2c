'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useReducedMotion } from 'framer-motion'

interface MotionContextType {
    reducedMotion: boolean
    duration: number
    easing: string
    scaleTap: number
}

const MotionContext = createContext<MotionContextType>({
    reducedMotion: false,
    duration: 0.3,
    easing: 'easeOut',
    scaleTap: 0.98
})

interface InteractionProviderProps {
    children: ReactNode
    tokens: {
        motion_duration?: string | number
        motion_easing?: string
        motion_scale_tap?: string | number
    }
}

export function InteractionProvider({ children, tokens }: InteractionProviderProps) {
    const prefersReduced = useReducedMotion()

    // Parse duration from string (e.g. "300ms") to seconds
    const parseDuration = (d: string | number | undefined) => {
        if (!d) return 0.3
        if (typeof d === 'number') return d / 1000
        return parseFloat(d) / 1000
    }

    const value = {
        reducedMotion: !!prefersReduced,
        duration: prefersReduced ? 0 : parseDuration(tokens.motion_duration),
        easing: tokens.motion_easing || 'easeOut',
        scaleTap: prefersReduced ? 1 : parseFloat(String(tokens.motion_scale_tap || 0.98))
    }

    return (
        <MotionContext.Provider value={value}>
            {children}
        </MotionContext.Provider>
    )
}

export const useMotion = () => useContext(MotionContext)
