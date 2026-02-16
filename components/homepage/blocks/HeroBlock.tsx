"use client";

import React from 'react';
import HeroCarousel from '@/components/ui/hero-carousel';

export default function HeroBlock({ config }: { config: any }) {
    const slides = config.slides || [
        {
            id: 'default',
            title: config.title || 'Welcome',
            subtitle: config.subtitle || 'Discover our curated selection',
            image_url: config.image_url || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop',
            cta_text: config.show_cta ? (config.cta_text || 'Shop Now') : undefined,
            cta_link: config.cta_link || '/products'
        }
    ];

    return <HeroCarousel slides={slides} />;
}
