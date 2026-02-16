'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-public';
import { FadeInStagger, FadeInItem } from '@/components/motion/FadeIn';

interface TestimonialCarouselConfig {
    title?: string;
    testimonials?: { name: string; text: string; rating?: number; location?: string }[];
}

const FALLBACK_TESTIMONIALS = [
    { name: 'Priya S.', location: 'Mumbai', text: 'Absolutely love the quality! Delivered within 3 days. Will definitely order again.', rating: 5 },
    { name: 'Rahul K.', location: 'Delhi', text: 'Great products at amazing prices. Packaging was excellent too.', rating: 5 },
    { name: 'Anita M.', location: 'Bangalore', text: 'Trustworthy seller. Exactly as described. Very happy with my purchase!', rating: 4 },
];

export default function TestimonialCarouselBlock({
    config,
    storeId,
}: {
    config: TestimonialCarouselConfig;
    storeId: string;
}) {
    const { title = 'What Our Customers Say', testimonials: configTestimonials } = config;
    const testimonials = configTestimonials || FALLBACK_TESTIMONIALS;

    return (
        <section className="py-[var(--section-gap)] bg-[var(--bg-primary)]">
            <div className="container mx-auto px-4">
                <h2
                    className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] text-center mb-10"
                    style={{ fontFamily: 'var(--heading-font)' }}
                >
                    {title}
                </h2>

                <FadeInStagger className="grid grid-cols-1 md:grid-cols-3 gap-[var(--component-gap)]">
                    {testimonials.map((t, i) => (
                        <FadeInItem key={i}>
                            <div className="bg-[var(--bg-secondary)] rounded-[var(--radius-card)] p-6 border border-[var(--border)]">
                                {/* Stars */}
                                <div className="flex gap-0.5 mb-3">
                                    {Array.from({ length: 5 }).map((_, si) => (
                                        <span
                                            key={si}
                                            className="text-sm"
                                            style={{ color: si < (t.rating || 5) ? 'var(--star-colour)' : 'var(--border)' }}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                                <p className="text-[var(--text-primary)] text-sm leading-relaxed mb-4">
                                    &ldquo;{t.text}&rdquo;
                                </p>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">
                                        {t.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-[var(--text-primary)]">{t.name}</p>
                                        {t.location && (
                                            <p className="text-xs text-[var(--text-secondary)]">{t.location}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </FadeInItem>
                    ))}
                </FadeInStagger>
            </div>
        </section>
    );
}
