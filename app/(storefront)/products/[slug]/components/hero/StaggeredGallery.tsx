"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { usePDP } from '@/app/(storefront)/products/[slug]/context/PDPContext';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export function StaggeredGallery() {
    const { product } = usePDP();
    const media = product.media || [];

    if (media.length === 0) return null;

    return (
        <section className="px-4 lg:px-8 py-8 lg:py-16">
            <div className="grid grid-cols-2 lg:grid-cols-12 gap-4 lg:gap-8 auto-rows-min">
                {media.map((item, idx) => {
                    let colSpan = "col-span-1";
                    let rowSpan = "row-span-1";
                    let aspectRatio = "aspect-[4/5]";

                    // Custom staggered layout logic (first 4 items)
                    if (idx === 0) {
                        colSpan = "lg:col-span-8";
                        rowSpan = "lg:row-span-2";
                        aspectRatio = "aspect-square lg:aspect-[4/5]";
                    } else if (idx === 1) {
                        colSpan = "lg:col-span-4";
                        rowSpan = "lg:row-span-2";
                        aspectRatio = "aspect-[3/4]";
                    } else if (idx === 2) {
                        colSpan = "lg:col-span-3";
                        aspectRatio = "aspect-[4/3]";
                    } else if (idx === 3) {
                        colSpan = "lg:col-span-5";
                        aspectRatio = "aspect-video";
                    } else {
                        colSpan = "lg:col-span-4";
                        aspectRatio = "aspect-square";
                    }

                    return (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 1,
                                delay: idx * 0.1,
                                ease: [0.16, 1, 0.3, 1]
                            }}
                            viewport={{ once: true }}
                            className={cn(
                                colSpan,
                                rowSpan,
                                "relative overflow-hidden bg-secondary group",
                                "rounded-[var(--radius-image,2.5rem)]"
                            )}
                        >
                            <Image
                                src={item.src}
                                alt={item.alt || product.title}
                                fill
                                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            {/* Decorative Grid Overlay for Editorial Vibe */}
                            <div className="absolute inset-0 bg-[var(--ink-900)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                            {/* Metadata Badge (Optional Visual Detail) */}
                            {idx === 0 && (
                                <div className="absolute top-8 left-8 p-4 backdrop-blur-xl bg-[var(--background)]/20 border border-[var(--border)]/30 rounded-[var(--radius-md,1.5rem)] hidden lg:block">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--primary-foreground)] drop-shadow-sm">01 / Main Gallery</span>
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
