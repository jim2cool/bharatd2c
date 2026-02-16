'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-public';
import { FadeInStagger, FadeInItem } from '@/components/motion/FadeIn';

interface CategoryPillsConfig {
    title?: string;
    collection_ids?: string[];
}

interface Collection {
    id: string;
    name: string;
    slug: string;
    image_url?: string;
}

export default function CategoryPillsBlock({
    config,
    storeId,
}: {
    config: CategoryPillsConfig;
    storeId: string;
}) {
    const { title = 'Shop by Category' } = config;
    const [collections, setCollections] = useState<Collection[]>([]);

    useEffect(() => {
        if (!storeId) return;
        supabase
            .from('collections')
            .select('id, name, slug, image_url')
            .eq('store_id', storeId)
            .limit(8)
            .then(({ data }) => {
                if (data) setCollections(data);
            });
    }, [storeId]);

    if (collections.length === 0) return null;

    return (
        <section className="py-[var(--section-gap)] bg-[var(--bg-primary)]">
            <div className="container mx-auto px-4">
                {title && (
                    <h2
                        className="text-2xl font-bold text-[var(--text-primary)] text-center mb-8"
                        style={{ fontFamily: 'var(--heading-font)' }}
                    >
                        {title}
                    </h2>
                )}
                <FadeInStagger className="flex flex-wrap justify-center gap-3">
                    {collections.map(col => (
                        <FadeInItem key={col.id}>
                            <Link
                                href={`/collections/${col.slug}`}
                                className="inline-flex items-center gap-2 px-5 py-2.5 border border-[var(--border)] rounded-[var(--radius-button)] text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--primary)] hover:text-primary-foreground hover:border-[var(--primary)] transition-all duration-200"
                            >
                                {col.name}
                            </Link>
                        </FadeInItem>
                    ))}
                </FadeInStagger>
            </div>
        </section>
    );
}
