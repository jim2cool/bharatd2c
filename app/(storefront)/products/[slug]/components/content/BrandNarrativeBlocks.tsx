"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { usePDP } from '@/app/(storefront)/products/[slug]/context/PDPContext';
import Image from 'next/image';

export function BrandNarrativeBlocks() {
    const { product } = usePDP();

    // We'll use product content sections or mock blocks if specific ones don't exist
    const narrativeBlocks = product.content.filter(s =>
        !s.title.toLowerCase().includes('story') &&
        !s.title.toLowerCase().includes('faq') &&
        !s.title.toLowerCase().includes('delivery')
    ).slice(0, 3);

    if (narrativeBlocks.length === 0) return null;

    return (
        <section className="px-6 lg:px-12 py-24 space-y-32">
            {narrativeBlocks.map((block, idx) => {
                const isEven = idx % 2 === 0;

                return (
                    <div
                        key={block.id}
                        className={`flex flex-col lg:flex-row items-center gap-16 lg:gap-24 ${isEven ? '' : 'lg:flex-row-reverse'}`}
                    >
                        {/* Media Container (L-Shaped/Asymmetrical) */}
                        <motion.div
                            initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            viewport={{ once: true }}
                            className="flex-1 w-full relative group"
                        >
                            <div className="aspect-[4/3] bg-neutral-100 rounded-[3rem] lg:rounded-[4rem] overflow-hidden relative z-10">
                                <Image
                                    src={product.media[idx % product.media.length]?.src || ""}
                                    alt={block.title}
                                    fill
                                    className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                                />
                            </div>
                            {/* Decorative background block (Asymmetry) */}
                            <div className={`absolute -inset-4 lg:-inset-8 border-[1.5rem] lg:border-[2rem] border-primary/5 rounded-[4rem] lg:rounded-[6rem] -z-1 translate-x-${isEven ? '4' : '-4'} translate-y-4`} />
                        </motion.div>

                        {/* Text Container */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="flex-1 flex flex-col items-start gap-8"
                        >
                            <div className="space-y-4">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                                    0{idx + 1} / {block.title}
                                </span>
                                <h3 className="text-4xl lg:text-5xl font-display font-medium leading-tight text-neutral-900 italic">
                                    Crafting the <span className="not-italic font-black text-neutral-900 underline decoration-primary decoration-4 underline-offset-8 transition-all hover:decoration-[12px]">Extraordinary</span>
                                </h3>
                            </div>
                            <div
                                className="text-lg lg:text-xl text-neutral-500 leading-relaxed font-medium line-clamp-4"
                                dangerouslySetInnerHTML={{ __html: block.content }}
                            />
                            <button className="px-8 py-4 bg-neutral-900 text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-primary transition-colors cursor-pointer group flex items-center gap-4">
                                Experience Detail
                                <motion.span
                                    className="w-2 h-2 rounded-full bg-white"
                                    animate={{ scale: [1, 1.4, 1] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                />
                            </button>
                        </motion.div>
                    </div>
                );
            })}
        </section>
    );
}
