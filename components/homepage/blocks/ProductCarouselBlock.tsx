"use client";

import React, { useEffect, useState } from 'react';
import { getProducts } from '@/lib/products';
import ProductCard from '@/components/ui/product-card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

export default function ProductCarouselBlock({ config, storeId }: { config: any, storeId: string }) {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const fetched = await getProducts(storeId, config.limit || 8);
            setProducts(fetched || []);
            setLoading(false);
        }
        load();
    }, [storeId, config]);

    if (loading) return null;

    return (
        <section className="py-16 bg-[var(--bg-primary)]">
            <div className="container px-4 mx-auto max-w-[1600px]">
                {config.title && (
                    <header className="mb-12 text-center">
                        <h2 className="text-3xl md:text-5xl font-[var(--font-weight-display)] text-[var(--text-primary)] border-b border-[var(--border)] pb-4 inline-block px-12 uppercase tracking-tight" style={{ fontFamily: 'var(--heading-font)' }}>
                            {config.title}
                        </h2>
                    </header>
                )}

                <Carousel opts={{ align: "start", loop: true }} className="w-full">
                    <CarouselContent className="-ml-8">
                        {products.map((p) => (
                            <CarouselItem key={p.id} className="pl-8 basis-[85%] md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                                <ProductCard product={p} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <div className="flex justify-center gap-12 mt-16">
                        <CarouselPrevious className="static translate-y-0 h-14 w-14 rounded-full border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] hover:bg-[var(--primary)] hover:text-[var(--cta-text)] transition-all shadow-lg" />
                        <CarouselNext className="static translate-y-0 h-14 w-14 rounded-full border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] hover:bg-[var(--primary)] hover:text-[var(--cta-text)] transition-all shadow-lg" />
                    </div>
                </Carousel>
            </div>
        </section>
    );
}
