import React from 'react';
import { PhotographyGuidance } from '../../components/PhotographyGuidance';
import { CategoryType, MoodCardKey } from '@/types/architecture';

const MOOD_MAPPING: Record<string, MoodCardKey> = {
    'shaahi': 'Luxury',
    'tech_aur_takneek': 'Sleek',
    'dil_se_desi': 'Heritage',
    'taza_aur_mast': 'Fresh',
    'swasth_aur_sachcha': 'Clinical',
    'gyaan_aur_bharosa': 'Professional'
};

interface PhotographyPromptProps {
    moodCard: string;
    category?: string;
    hasWeakImage?: boolean;
}

export function PhotographyPrompt({ moodCard, category = 'fashion', hasWeakImage }: PhotographyPromptProps) {
    // 1. Normalize moodCard to MoodCardKey
    const normalizedMood = (MOOD_MAPPING[moodCard.toLowerCase()] || moodCard) as MoodCardKey;

    // 2. Ensure category is a valid CategoryType
    const validCategory = (category || 'fashion') as CategoryType;

    // 3. Determine tier for guidance (tier3 if hasWeakImage, otherwise tier2 to show general guidance)
    const tier = hasWeakImage ? 'tier3' : 'tier2';

    return (
        <PhotographyGuidance
            moodCard={normalizedMood}
            category={validCategory}
            tier={tier}
        />
    );
}
