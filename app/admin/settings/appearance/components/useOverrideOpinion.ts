import { useState, useCallback } from 'react';
import { supabaseBrowser } from '@/lib/supabase-browser';

export type OpinionRecommendation = 'BLOCKED' | 'AGREES' | 'ADVISES_AGAINST' | 'CAUTION';

export interface OverrideOpinion {
    recommendation: OpinionRecommendation;
    reason: string;
    can_proceed: boolean;
}

export function useOverrideOpinion() {
    const [loading, setLoading] = useState(false);

    const getOpinion = useCallback(async (
        storeId: string,
        componentId: string,
        overrideType: 'ACTIVATE' | 'SUPPRESS' | 'REORDER'
    ): Promise<OverrideOpinion | null> => {
        setLoading(true);
        try {
            const { data, error } = await supabaseBrowser.rpc('fn_get_override_opinion', {
                p_store_id: storeId,
                p_component_id: componentId,
                p_override_type: overrideType
            });

            if (error) throw error;

            return data[0] as OverrideOpinion;
        } catch (err) {
            console.error('Failed to fetch override opinion:', err);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return { getOpinion, loading };
}
