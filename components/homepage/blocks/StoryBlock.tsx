"use client";

import React from 'react';
import ImageWithText from '@/components/ui/image-with-text';

export default function StoryBlock({ config }: { config: any }) {
    return (
        <ImageWithText
            title={config.title || "Our Story"}
            text={config.content || config.text || "Discover the passion behind every piece."}
            imageUrl={config.imageUrl || config.image_url || "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop"}
            ctaText={config.show_cta ? (config.cta_text || "Learn More") : undefined}
            ctaLink={config.cta_link || "/about"}
            reverse={config.reverse || false}
        />
    );
}
