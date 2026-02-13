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
    return (
        <section className="py-12 bg-background">
            <div className="container px-4 mx-auto max-w-[1600px]">
                {title && (
                    <header className="mb-8 text-center">
                        <h2 className="text-3xl md:text-5xl font-serif text-charcoal-900 border-b border-charcoal-100 pb-4 inline-block px-12">
                            {title}
                        </h2>
                    </header>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                    {items.map((item) => (
                        <Link key={item.id} href={item.link} className="group flex flex-col gap-4">
                            <div className="relative aspect-[3/4] overflow-hidden bg-[#F6F6F6]">
                                <Image
                                    src={item.image_url}
                                    alt={item.title}
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-500" />
                            </div>
                            <div className="flex flex-col gap-1 items-center">
                                <h3 className="text-xs md:text-sm font-sans font-bold tracking-widest uppercase text-charcoal-900 group-hover:text-beige-300 transition-colors">
                                    {item.title}
                                </h3>
                                <div className="h-px w-0 group-hover:w-full bg-beige-300 transition-all duration-500" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
