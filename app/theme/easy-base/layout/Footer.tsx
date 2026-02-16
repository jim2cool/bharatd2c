"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoreNavigation } from "@/lib/navigation";
import { FadeIn } from "@/components/motion/FadeIn";

function getFooterConfig(moodCard: string) {
  const mc = moodCard || 'Minimal';

  switch (mc) {
    case 'Bold':
      return {
        bg: 'bg-[var(--bg-hero)]',
        text: 'text-[var(--text-secondary)]',
        heading: 'text-white font-bold uppercase tracking-tighter text-sm border-b-2 border-[var(--primary)] pb-1 inline-block',
        link: 'text-[var(--text-secondary)] hover:text-white transition-colors text-sm',
        divider: '|',
        dividerColour: '',
        border: 'border-[var(--border-dark)]',
        copyright: 'text-[var(--text-secondary)]',
      };
    case 'Luxury':
      return {
        bg: 'bg-[var(--bg-primary)]',
        text: 'text-[var(--text-secondary)]',
        heading: 'font-serif italic tracking-[0.15em] text-[var(--text-primary)] border-b border-[var(--border)] pb-2 text-sm inline-block',
        link: 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-sm',
        divider: '·',
        dividerColour: 'text-[var(--accent-gold)]',
        border: 'border-[var(--border)]',
        copyright: 'text-[var(--text-secondary)]',
      };
    case 'Spiritual':
      return {
        bg: 'bg-[var(--bg-primary)]',
        text: 'text-[var(--text-secondary)]',
        heading: 'font-light tracking-[0.2em] uppercase text-[11px] text-[var(--text-secondary)] opacity-60',
        link: 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-sm tracking-wide',
        divider: '·',
        dividerColour: 'text-[var(--accent-gold)]',
        border: 'border-[var(--border)]',
        copyright: 'text-[var(--text-secondary)] opacity-60',
      };
    case 'Sleek':
      return {
        bg: 'bg-[var(--bg-primary)]',
        text: 'text-[var(--text-secondary)]',
        heading: 'font-mono uppercase text-[10px] bg-[var(--primary)]/10 text-[var(--primary)] px-2 py-1 inline-block',
        link: 'font-mono text-[11px] text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors',
        divider: '|',
        dividerColour: 'text-[var(--border-dark)]',
        border: 'border-[var(--border-dark)]',
        copyright: 'text-[var(--text-secondary)] font-mono text-[11px]',
      };
    case 'Fresh':
      return {
        bg: 'bg-[var(--bg-primary)]',
        text: 'text-[var(--text-secondary)]',
        heading: 'font-black uppercase tracking-tight text-sm text-[var(--primary)] border-b border-[var(--border)] pb-1 inline-block',
        link: 'text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors text-sm font-medium uppercase text-xs tracking-wider',
        divider: '|',
        dividerColour: '',
        border: 'border-[var(--border)]',
        copyright: 'text-[var(--text-secondary)]',
      };
    default:
      return {
        bg: 'bg-[var(--bg-secondary)]',
        text: 'text-[var(--text-secondary)]',
        heading: 'text-sm font-semibold tracking-wide uppercase text-[var(--text-primary)]',
        link: 'text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors text-sm',
        divider: '|',
        dividerColour: '',
        border: 'border-[var(--border)]',
        copyright: 'text-[var(--text-secondary)]',
      };
  }
}

export default function Footer({ store }: { store?: any }) {
  const [navData, setNavData] = useState<{ collections: any[]; policies: any[]; static_pages: any[] }>({
    collections: [],
    policies: [],
    static_pages: [],
  });

  const storeName = store?.name || "Easy D2C";
  const moodCard = store?.appearance_mood_card || store?.mood_card || 'saaf_suthra';
  const config = getFooterConfig(moodCard);

  // Tagline: content_seeds → about → fallback
  const tagline =
    store?.content_seeds?.tagline ||
    store?.about ||
    "Thoughtfully designed products, built for everyday Indian routines.";

  useEffect(() => {
    const fetchNav = async () => {
      if (store?.id) {
        const data = await getStoreNavigation(store.id);
        setNavData(data);
      }
    };
    fetchNav();
  }, [store?.id]);

  // Social icons (simple text links if available)
  const socialLinks = store?.social_links || {};
  const hasSocials = Object.keys(socialLinks).length > 0;

  // Policy links with Shaahi/Rooh gold dot separator
  const policyLinks = navData.policies || [];
  const isDotSep = config.divider === '·';

  return (
    <FadeIn>
      <footer className={`site-footer ${config.bg} border-t ${config.border}`}>
        <div className="container mx-auto px-4 py-16">
          <div className="grid gap-12 md:grid-cols-4">
            {/* Brand column */}
            <div className="space-y-4">
              <h3
                className={config.heading}
                style={{ fontFamily: 'var(--heading-font)' }}
              >
                {storeName}
              </h3>
              <p className={`${config.text} text-sm leading-relaxed max-w-xs`}>
                {tagline}
              </p>
              {hasSocials && (
                <div className="flex gap-3 mt-4 flex-wrap">
                  {Object.entries(socialLinks).map(([platform, url]) => (
                    <a
                      key={platform}
                      href={url as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${config.link} capitalize`}
                    >
                      {platform}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Collections column */}
            <FooterCol title="Collections" headingClass={config.heading}>
              {navData.collections.map((c: any) => (
                <Link key={c.id} href={`/collections/${c.slug}`} className={config.link}>
                  {c.name}
                </Link>
              ))}
              <Link href="/collections" className={`${config.link} font-medium`}>
                All Products →
              </Link>
            </FooterCol>

            {/* Support column */}
            <FooterCol title="Support" headingClass={config.heading}>
              <Link href="/track-order" className={config.link}>Track Order</Link>
              {navData.policies.map((p: any) => (
                <Link key={p.id} href={`/pages/${p.slug}`} className={config.link}>
                  {p.title}
                </Link>
              ))}
            </FooterCol>

            {/* Company column */}
            <FooterCol title="Company" headingClass={config.heading}>
              {navData.static_pages.map((p: any) => (
                <Link key={p.id} href={`/pages/${p.slug}`} className={config.link}>
                  {p.title}
                </Link>
              ))}
              <Link href="/contact" className={config.link}>Contact Us</Link>
            </FooterCol>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={`border-t ${config.border}`}>
          <div className="container mx-auto px-4 py-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <p className={`text-xs ${config.copyright}`}>
              © 2026 {storeName}. All rights reserved.
            </p>

            {/* Policy links with per-card separators */}
            {policyLinks.length > 0 && (
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                {policyLinks.map((p: any, i: number) => (
                  <span key={p.id} className="flex items-center gap-2">
                    <Link href={`/pages/${p.slug}`} className={`text-xs ${config.copyright} hover:opacity-100 transition-opacity`}>
                      {p.title}
                    </Link>
                    {i < policyLinks.length - 1 && (
                      <span className={`text-xs ${config.dividerColour || config.copyright} opacity-40`}>
                        {config.divider}
                      </span>
                    )}
                  </span>
                ))}
              </div>
            )}

            <p className={`text-xs ${config.copyright}`}>
              Made with ❤️ in India 🇮🇳
            </p>
          </div>
        </div>
      </footer>
    </FadeIn>
  );
}

function FooterCol({
  title,
  children,
  headingClass = '',
}: {
  title: string;
  children: React.ReactNode;
  headingClass?: string;
}) {
  return (
    <div className="flex flex-col gap-4">
      <h4 className={headingClass} style={{ fontFamily: 'var(--heading-font)' }}>
        {title}
      </h4>
      <div className="flex flex-col gap-2.5">
        {children}
      </div>
    </div>
  );
}
