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
        <section
            className="px-6 lg:px-24 bg-[var(--bg-primary)] flex flex-col"
            style={{ paddingBlock: 'var(--section-gap)', gap: 'var(--section-gap)' }}
        >
            {narrativeBlocks.map((block, idx) => {
                const isEven = idx % 2 === 0;

                return (
                    <div
                        key={block.id}
                        className={`flex flex-col lg:flex-row items-center gap-20 lg:gap-32 ${isEven ? '' : 'lg:flex-row-reverse'}`}
                    >
                        {/* Media Container (Asymmetrical) */}
                        <motion.div
                            initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            viewport={{ once: true }}
                            className="flex-1 w-full relative group"
                        >
                            <div className="aspect-[4/5] bg-[var(--bg-secondary)] rounded-2xl overflow-hidden relative z-10 border border-[var(--border)]">
                                <Image
                                    src={product.media[idx % product.media.length]?.src || ""}
                                    alt={block.title}
                                    fill
                                    className="object-cover transition-all duration-1000 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </div>

                            {/* Floating Metadata (Premium Axiom) */}
                            <div className={`absolute top-12 ${isEven ? '-right-8' : '-left-8'} z-20 hidden lg:block`}>
                                <div className="bg-[var(--bg-primary)]/80 backdrop-blur-md border border-[var(--border)] p-4 shadow-xl rounded-none flex items-center gap-4">
                                    <span className="text-[40px] font-normal leading-none tracking-tighter opacity-10" style={{ fontFamily: 'var(--heading-font)' }}>
                                        0{idx + 1}
                                    </span>
                                    <div className="w-px h-8 bg-[var(--border)]" />
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)]">ARCHIVE REV.</span>
                                </div>
                            </div>

                            {/* Decorative background block */}
                            <div className={`absolute -inset-10 border-[1px] border-[var(--primary)]/10 rounded-3xl -z-1 translate-x-${isEven ? '6' : '-6'} translate-y-6 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-1000`} />
                        </motion.div>

                        {/* Text Container */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="flex-1 flex flex-col items-start gap-10"
                        >
                            <div className="space-y-6">
                                <span className="inline-block text-[10px] font-black uppercase tracking-[0.4em] text-[var(--primary)] border-b border-[var(--primary)] pb-2">
                                    CHAPTER 0{idx + 1}
                                </span>
                                <h3 className="text-5xl lg:text-7xl font-normal leading-[0.9] tracking-tighter text-[var(--text-primary)] italic" style={{ fontFamily: 'var(--heading-font)' }}>
                                    {block.title.split(' ').map((word, i) => (
                                        <span key={i} className={i === 1 ? 'not-italic font-black block' : ''}>
                                            {word}{' '}
                                        </span>
                                    ))}
                                </h3>
                            </div>

                            <div
                                className="text-xl lg:text-2xl text-[var(--text-secondary)] leading-relaxed font-medium opacity-80"
                                dangerouslySetInnerHTML={{ __html: block.content }}
                            />

                            <button className="px-10 py-5 bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-none text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[var(--primary)] hover:text-primary-foreground transition-all duration-300 group flex items-center gap-6 overflow-hidden relative">
                                <span className="relative z-10 text-primary-foreground">Explore Detailed Craft</span>
                                <div className="w-2 h-2 rounded-full bg-card relative z-10 animate-pulse" />
                                <div className="absolute inset-0 bg-[var(--primary)] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                            </button>
                        </motion.div>
                    </div>
                );
            })}
        </section>
    );
}
