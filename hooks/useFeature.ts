'use client'

import { useEffect, useState } from 'react'
import { supabaseBrowser } from '@/lib/supabase-browser'

export function useFeature(featureName: string, storeId?: string) {
    const [isEnabled, setIsEnabled] = useState<boolean | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkFeature = async () => {
            try {
                // Check for store-specific flag first, then global flag
                const { data, error } = await supabaseBrowser
                    .from('feature_flags')
                    .select('is_enabled, store_id')
                    .eq('name', featureName)
                    .or(`store_id.is.null,store_id.eq.${storeId}`)
                    .order('store_id', { ascending: false }) // Store-specific first
                    .limit(1)
                    .single()

                if (error) throw error
                setIsEnabled(data?.is_enabled ?? false)
            } catch (err) {
                console.error(`Error checking feature ${featureName}:`, err)
                setIsEnabled(false)
            } finally {
                setLoading(false)
            }
        }

        checkFeature()
    }, [featureName, storeId])

    return { isEnabled, loading }
}
