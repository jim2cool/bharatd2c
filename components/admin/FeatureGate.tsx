'use client'

import React from 'react'
import { useFeature } from '@/hooks/useFeature'

interface FeatureGateProps {
    name: string
    storeId?: string
    fallback?: React.ReactNode
    children: React.ReactNode
}

export function FeatureGate({ name, storeId, fallback = null, children }: FeatureGateProps) {
    const { isEnabled, loading } = useFeature(name, storeId)

    if (loading) return null // Or a small skeleton
    if (!isEnabled) return <>{fallback}</>

    return <>{children}</>
}
