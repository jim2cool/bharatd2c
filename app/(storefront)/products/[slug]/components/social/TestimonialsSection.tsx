"use client"

import React from 'react';
import { Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Testimonial {
    id: string;
    quote: string;
    author: string;
    role?: string;
    avatar?: string;
}

interface TestimonialsSectionProps {
    testimonials?: Testimonial[];
    className?: string;
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [
    {
        id: '1',
        quote: "The texture and the subtle fragrance are unlike anything I've experienced. It feels like a return to nature's purest form.",
        author: "Ananya Sharma",
        role: "Holistic Wellness Practitioner"
    },
    {
        id: '2',
        quote: "Every detail from the packaging to the product itself speaks of a brand that values craftsmanship over convenience.",
        author: "Vikram Malhotra",
        role: "Art Director"
    }
];

export function TestimonialsSection({
    testimonials = DEFAULT_TESTIMONIALS,
    className
}: TestimonialsSectionProps) {
    return (
        <div className={cn("py-16 md:py-24 space-y-16", className)}>
            <div className="max-w-3xl mx-auto text-center space-y-4 px-6">
                <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--primary)] mb-2">
                    <span className="w-8 h-px bg-[var(--primary)]" />
                    Voices of Experience
                    <span className="w-8 h-px bg-[var(--primary)]" />
                </div>
                <h2 className="text-4xl md:text-5xl font-normal tracking-tighter text-[var(--text-primary)] leading-[0.9]" style={{ fontFamily: 'var(--heading-font)' }}>
                    Loved by those who <br />
                    <span className="italic" style={{ color: 'var(--text-secondary)' }}>seek the exceptional.</span>
                </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 px-6">
                {testimonials.map((t, i) => (
                    <div
                        key={t.id}
                        className={cn(
                            "relative p-10 md:p-16 border transition-all duration-700",
                            "bg-[var(--bg-primary)] border-[var(--border)] rounded-[var(--radius-card)]",
                            i % 2 === 1 ? "md:mt-12" : ""
                        )}
                        style={{ boxShadow: 'var(--shadow-card)' }}
                    >
                        {/* Pull Quote Mark - Rooh/Shaahi Axiom */}
                        <Quote
                            className="absolute -top-6 -left-6 w-16 h-16 opacity-10 text-[var(--primary)]"
                            style={{ strokeWidth: 1 }}
                        />

                        <div className="relative z-10 space-y-8">
                            <p
                                className="text-xl md:text-2xl font-normal leading-relaxed text-[var(--text-primary)]"
                                style={{
                                    fontFamily: 'var(--heading-font)',
                                    fontStyle: 'italic'
                                }}
                            >
                                "{t.quote}"
                            </p>

                            <div className="flex items-center gap-4">
                                <div className="h-px w-12 bg-[var(--accent-gold)] opacity-40" />
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--primary)]">
                                        {t.author}
                                    </p>
                                    {t.role && (
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-secondary)] mt-0.5">
                                            {t.role}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Accent - Shaahi Axiom: Gold rule */}
            <div className="max-w-xs mx-auto h-px bg-[var(--accent-gold)] opacity-20" />
        </div>
    );
}
