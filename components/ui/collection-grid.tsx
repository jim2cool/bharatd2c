"use client";

import Image from "next/image";
import Link from "next/link";

interface CollectionItem {
    id: string;
    title: string;
    image_url: string;
    link: string;
}

interface CollectionGridProps {
    title?: string;
    items: CollectionItem[];
}

export default function CollectionGrid({ title = "New Arrivals", items }: CollectionGridProps) {
    if (!items || items.length === 0) return null;

    return (
        <section className="py-12 bg-[var(--bg-primary)]">
            <div className="container px-4 mx-auto max-w-[1600px]">
                {title && (
                    <header className="mb-8 text-center">
                        <h2 className="text-3xl md:text-5xl font-[var(--font-weight-display)] text-[var(--text-primary)] border-b border-[var(--border)] pb-4 inline-block px-12 uppercase tracking-tight" style={{ fontFamily: 'var(--heading-font)' }}>
                            {title}
                        </h2>
                    </header>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                    {items.map((item) => (
                        <Link key={item.id} href={item.link} className="group flex flex-col gap-4">
                            <div className="relative aspect-[3/4] overflow-hidden bg-[var(--bg-secondary)] rounded-[var(--radius-card)]">
                                {item.image_url && (
                                    <Image
                                        src={item.image_url}
                                        alt={item.title}
                                        fill
                                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                    />
                                )}
                                <div className="absolute inset-0 bg-foreground/5 group-hover:bg-foreground/0 transition-colors duration-500" />
                            </div>
                            <div className="flex flex-col gap-1 items-center">
                                <h3 className="text-xs md:text-sm font-medium tracking-widest uppercase text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors">
                                    {item.title}
                                </h3>
                                <div className="h-px w-0 group-hover:w-full bg-[var(--primary)] transition-all duration-500" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
