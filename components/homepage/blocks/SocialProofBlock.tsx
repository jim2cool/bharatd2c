'use client';

import { Star } from 'lucide-react';

interface SocialProofConfig {
    headline?: string;
    subheadline?: string;
    show_rating?: boolean;
    rating?: number;
    review_count?: number;
    stat_items?: { label: string; value: string }[];
}

export default function SocialProofBlock({ config }: { config: SocialProofConfig }) {
    const {
        headline = '10,000+ happy customers',
        subheadline,
        show_rating = true,
        rating = 4.8,
        review_count = 2340,
        stat_items,
    } = config;

    const stars = Math.round(rating);
    const stats = stat_items || [
        { label: 'Happy Customers', value: '10,000+' },
        { label: 'Average Rating', value: '4.8' },
        { label: 'Orders Delivered', value: '25,000+' },
    ];

    return (
        <section className="py-[var(--section-gap)] bg-[var(--bg-secondary)]">
            <div className="container mx-auto px-4 text-center">
                {show_rating && (
                    <div className="flex justify-center gap-1 mb-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                                key={i}
                                className="w-6 h-6"
                                fill={i < stars ? 'var(--star-colour)' : 'none'}
                                stroke={i < stars ? 'var(--star-colour)' : 'var(--border)'}
                            />
                        ))}
                    </div>
                )}

                <h2 className="text-2xl md:text-4xl font-bold text-[var(--text-primary)] mb-2"
                    style={{ fontFamily: 'var(--heading-font)' }}>
                    {headline}
                </h2>

                {subheadline && (
                    <p className="text-[var(--text-secondary)] mb-8">{subheadline}</p>
                )}

                <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-8">
                    {stats.map((stat, i) => (
                        <div key={i} className="text-center">
                            <div className="text-2xl md:text-3xl font-bold text-[var(--primary)] mb-1"
                                style={{ fontFamily: 'var(--heading-font)' }}>
                                {stat.value}
                            </div>
                            <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
