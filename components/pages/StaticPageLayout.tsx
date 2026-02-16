"use client";

import React from "react";

interface StaticPageLayoutProps {
    title: string;
    children: React.ReactNode;
    updatedAt?: string;
}

export default function StaticPageLayout({ title, children, updatedAt }: StaticPageLayoutProps) {
    return (
        <div className="bg-[var(--bg-primary)] min-h-screen">
            <header className="py-20 border-b border-[var(--border)]">
                <div className="container max-w-4xl px-4 mx-auto text-center">
                    <h1
                        className="text-4xl md:text-5xl font-[var(--font-weight-display)] text-[var(--text-primary)] tracking-tight mb-4"
                        style={{ fontFamily: 'var(--heading-font)' }}
                    >
                        {title}
                    </h1>
                    {updatedAt && (
                        <p className="text-[10px] uppercase font-black tracking-[0.2em] text-[var(--text-secondary)]">
                            Last Updated: {new Date(updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    )}
                </div>
            </header>

            <main className="py-20">
                <div
                    className="container max-w-3xl px-6 mx-auto prose prose-neutral md:prose-lg max-w-none 
            prose-headings:text-[var(--text-primary)] 
            prose-headings:font-[var(--font-weight-display)]
            prose-p:text-[var(--text-secondary)] 
            prose-strong:text-[var(--text-primary)]
            prose-li:text-[var(--text-secondary)]
            prose-a:text-[var(--primary)]
            prose-a:no-underline hover:prose-a:underline
            [&_h2]:mt-12 [&_h2]:mb-6
            [&_h3]:mt-8 [&_h3]:mb-4
            "
                    style={{ fontFamily: 'var(--body-font)' }}
                >
                    {children}
                </div>
            </main>

            <footer className="py-20 border-t border-[var(--border)]">
                <div className="container max-w-3xl px-6 mx-auto text-center">
                    <p className="text-[var(--text-secondary)] text-sm italic">
                        Questions about this document? Contact our support team.
                    </p>
                </div>
            </footer>
        </div>
    );
}
