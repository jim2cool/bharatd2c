"use client"

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { usePDP } from '@/app/(storefront)/products/[slug]/context/PDPContext';

export function StorySection() {
    const { product } = usePDP();
    const containerRef = React.useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
    const y = useTransform(scrollYProgress, [0, 0.3], [100, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.3], [0.95, 1]);

    const storyContent = product.content.find(s =>
        s.title.toLowerCase().includes('story') ||
        s.title.toLowerCase().includes('about') ||
        s.title.toLowerCase().includes('narrative')
    )?.content || product.description_intro;

    if (!storyContent) return null;

    return (
        <section
            ref={containerRef}
            className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-[var(--bg-primary)]"
            style={{ paddingBlock: 'var(--section-gap)' }}
        >
            {/* Subtle Fiber Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/felt.png')]" />

            <motion.div
                style={{ opacity, scale, y }}
                className="max-w-[900px] px-8 text-center z-10"
            >
                <div className="flex flex-col items-center gap-8 mb-16">
                    <div className="w-[1px] h-20 bg-gradient-to-b from-transparent via-[var(--primary)]/30 to-transparent" />
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[var(--primary)] leading-none" style={{ fontFamily: 'var(--body-font)' }}>
                        NARRATIVE ARCHIVE
                    </span>
                </div>

                <h2 className="text-5xl lg:text-8xl font-normal leading-[0.9] tracking-tighter text-[var(--text-primary)] mb-20 italic" style={{ fontFamily: 'var(--heading-font)' }}>
                    The intersection of <br />
                    <span className="not-italic font-black text-[var(--primary)]">purpose</span> and <span className="not-italic font-black">artisanal craft</span>.
                </h2>

                <div className="prose prose-neutral max-w-none">
                    <div
                        className="text-2xl lg:text-4xl text-[var(--text-secondary)] font-medium leading-[1.5] italic opacity-90"
                        style={{ fontFamily: 'var(--heading-font)' }}
                        dangerouslySetInnerHTML={{ __html: storyContent }}
                    />
                </div>

                <div className="mt-24 flex flex-col items-center gap-6 group cursor-pointer">
                    <div className="w-14 h-14 rounded-full border border-[var(--border)] flex items-center justify-center transition-all duration-500 group-hover:bg-[var(--text-primary)] group-hover:scale-110">
                        <svg className="w-5 h-5 group-hover:text-[var(--bg-primary)] transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-secondary)] opacity-40 group-hover:opacity-100 transition-opacity">Continuum</span>
                </div>
            </motion.div>

            {/* Background Atmosphere */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--primary)] opacity-[0.03] rounded-full blur-[150px]" />
                <div className="absolute bottom-0 left-[10%] w-[400px] h-[400px] bg-[var(--primary)] opacity-[0.03] rounded-full blur-[120px]" />
            </div>
        </section>
    );
}
