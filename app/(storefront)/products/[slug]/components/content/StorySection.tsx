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
            className="relative min-h-[70vh] flex items-center justify-center overflow-hidden py-32 bg-[#fafafa]"
        >
            {/* Subtle Noise/Fiber Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/felt.png')]" />

            <motion.div
                style={{ opacity, scale, y }}
                className="max-w-[900px] px-8 text-center z-10"
            >
                <div className="flex flex-col items-center gap-6 mb-12">
                    <span className="w-px h-16 bg-primary/20" />
                    <span className="text-[11px] font-black uppercase tracking-[0.6em] text-primary leading-none">
                        Our Manifesto
                    </span>
                </div>

                <h2 className="text-4xl lg:text-7xl font-display font-medium leading-[1.05] tracking-tight text-neutral-900 mb-16 italic">
                    The intersection of <span className="not-italic font-black text-primary">purpose</span> and <span className="not-italic font-black">craft</span>.
                </h2>

                <div className="prose prose-neutral max-w-none">
                    <div
                        className="text-xl lg:text-3xl text-neutral-500 font-medium leading-[1.6] italic first-letter:text-6xl first-letter:font-black first-letter:not-italic first-letter:float-left first-letter:mr-3 first-letter:mt-2 first-letter:text-primary"
                        dangerouslySetInnerHTML={{ __html: storyContent }}
                    />
                </div>

                <div className="mt-20 flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border border-neutral-200 flex items-center justify-center group cursor-pointer hover:bg-neutral-900 transition-colors">
                        <svg className="w-4 h-4 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-300">Keep Exploring</span>
                </div>
            </motion.div>

            {/* Background Atmosphere */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-full pointer-events-none">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px]" />
            </div>
        </section>
    );
}
