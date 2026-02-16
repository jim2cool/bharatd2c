"use client";

import React from 'react';

export default function NewsletterBlock({ config }: { config: any }) {
    return (
        <section className="py-16 bg-[var(--bg-secondary)] text-[var(--text-primary)] text-center border-y border-[var(--border)]">
            <div className="container px-4 max-w-xl mx-auto space-y-8">
                <h2 className="text-4xl md:text-5xl font-[var(--font-weight-display)] mb-6" style={{ fontFamily: 'var(--heading-font)' }}>
                    {config.title || "Join The Circle"}
                </h2>
                <p className="text-[var(--text-secondary)] font-sans tracking-widest uppercase text-[10px] mb-8">
                    {config.subtitle || "Exclusive updates, limited drops, and styling rituals."}
                </p>
                <div className="flex gap-0 border-b border-[var(--border)] pb-4">
                    <input
                        type="email"
                        placeholder="Your email address"
                        className="bg-transparent border-0 outline-none text-[var(--text-primary)] w-full placeholder:text-[var(--text-secondary)]/50"
                    />
                    <button className="text-[10px] font-bold uppercase tracking-[0.3em] hover:text-[var(--primary)] transition-colors">Join</button>
                </div>
            </div>
        </section>
    );
}
