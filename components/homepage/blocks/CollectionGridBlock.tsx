"use client";

import React, { useEffect, useState } from 'react';
import CollectionGrid from '@/components/ui/collection-grid';
import { getCollections } from '@/lib/collections';

export default function CollectionGridBlock({ config, storeId }: { config: any, storeId: string }) {
    const [collections, setCollections] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            // For now, we fetch all collections. In a future iteration, 
            // we can support selective slugs in the config.
            const fetched = await getCollections(storeId);

            const items = fetched.map(c => ({
                id: c.id,
                title: c.title,
                image_url: c.image,
                link: `/collections/${c.slug}`
            }));

            setCollections(items);
            setLoading(false);
        }
        load();
    }, [storeId, config]);

    if (loading || collections.length === 0) return null;

    return (
        <CollectionGrid
            title={config.title || "Browse Collections"}
            items={collections}
        />
    );
}
