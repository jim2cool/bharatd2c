"use client";

import React from 'react';
import HeroBlock from './blocks/HeroBlock';
import FeaturedCollectionBlock from './blocks/FeaturedCollectionBlock';
import TrustStripBlock from './blocks/TrustStripBlock';
import StoryBlock from './blocks/StoryBlock';
import ProductCarouselBlock from './blocks/ProductCarouselBlock';
import CollectionGridBlock from './blocks/CollectionGridBlock';
import NewsletterBlock from './blocks/NewsletterBlock';
import SocialProofBlock from './blocks/SocialProofBlock';
import CountdownTimerBlock from './blocks/CountdownTimerBlock';
import TestimonialCarouselBlock from './blocks/TestimonialCarouselBlock';
import AnnouncementBannerBlock from './blocks/AnnouncementBannerBlock';
import CategoryPillsBlock from './blocks/CategoryPillsBlock';
import { FadeIn } from '../motion/FadeIn';

interface Section {
    id?: string;
    block_type?: string;
    type?: string;          // legacy
    position?: number;
    order?: number;         // legacy
    config: Record<string, any>;
    is_locked?: boolean;
}

interface HomepageBlockRendererProps {
    sections: Section[];
    storeId: string;
}

export default function HomepageBlockRenderer({ sections, storeId }: HomepageBlockRendererProps) {
    if (!sections || sections.length === 0) return null;

    const sorted = [...sections].sort((a, b) =>
        (a.position ?? a.order ?? 0) - (b.position ?? b.order ?? 0)
    );

    return (
        <div className="flex flex-col gap-[var(--section-gap)] pb-[var(--section-gap)]">
            {sorted.map((section, index) => {
                // Support both block_type (new) and type (legacy)
                const blockType = section.block_type || section.type || '';
                const key = section.id || `${blockType}-${index}`;

                let content: React.ReactNode;

                switch (blockType) {
                    case 'hero':
                        content = <HeroBlock key={key} config={section.config} />;
                        break;

                    case 'featured_collection':
                        content = <FeaturedCollectionBlock key={key} config={section.config} storeId={storeId} />;
                        break;

                    case 'trust_strip':
                        content = <TrustStripBlock key={key} config={section.config} />;
                        break;

                    case 'story_block':
                    case 'image_with_text':
                        content = <StoryBlock key={key} config={section.config} />;
                        break;

                    case 'product_carousel':
                        content = <ProductCarouselBlock key={key} config={section.config} storeId={storeId} />;
                        break;

                    case 'collection_grid':
                        content = <CollectionGridBlock key={key} config={section.config} storeId={storeId} />;
                        break;

                    case 'newsletter':
                        content = <NewsletterBlock key={key} config={section.config} />;
                        break;

                    case 'social_proof':
                        content = <SocialProofBlock key={key} config={section.config} />;
                        break;

                    case 'countdown_timer':
                        content = <CountdownTimerBlock key={key} config={section.config} />;
                        break;

                    case 'testimonial_carousel':
                        content = <TestimonialCarouselBlock key={key} config={section.config} storeId={storeId} />;
                        break;

                    case 'announcement_banner':
                        // No FadeIn — announcement lives above the fold
                        return <AnnouncementBannerBlock key={key} config={section.config} />;

                    case 'category_pills':
                        content = <CategoryPillsBlock key={key} config={section.config} storeId={storeId} />;
                        break;

                    case 'video_hero':
                        // Placeholder — same as hero, uses video_url from config
                        content = <HeroBlock key={key} config={{ ...section.config, isVideo: true }} />;
                        break;

                    case 'spacer':
                        return <div key={key} className="h-12 md:h-20" />;

                    default:
                        content = (
                            <div key={key} className="py-10 text-center border border-dashed border-[var(--border)] text-[var(--text-secondary)] text-sm">
                                Block type &quot;{blockType}&quot; is coming soon
                            </div>
                        );
                }

                // Hero and announcement are full-bleed — no FadeIn wrapper
                if (blockType === 'hero' || blockType === 'video_hero') {
                    return content;
                }

                return (
                    <FadeIn key={key} delay={Math.min(index * 0.05, 0.3)}>
                        {content}
                    </FadeIn>
                );
            })}
        </div>
    );
}
