"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { getCart } from "@/lib/cart";
import { SlideOutCart } from "@/components/SlideOutCart";
import { ShoppingBag, Search, X } from "lucide-react";
import { ScaleTap } from "@/components/motion/ScaleTap";
import { getStoreNavigation } from "@/lib/navigation";

// ─── Per-card nav configuration ────────────────────────────────────────────────
function getCardConfig(moodCard: string) {
  const mc = moodCard || 'Minimal';
  switch (mc) {
    case 'Bold':
      return {
        height: 'h-[60px]',
        bg: 'bg-transparent data-[scrolled=true]:bg-white',
        border: '',
        logoFont: 'font-black uppercase tracking-tighter text-xl',
        linkStyle: 'uppercase font-medium text-xs tracking-widest text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors',
        cartLabel: false,
        useBagText: false,
        useMenuText: false,
        drawerSide: 'left',
        drawerDark: true,
        scrollBehavior: 'dhamaka',
      };
    case 'Luxury':
      return {
        height: 'h-[72px]',
        bg: 'bg-[var(--bg-primary)]',
        border: '',
        logoFont: 'font-serif tracking-[0.12em] uppercase text-lg text-[var(--text-primary)]',
        linkStyle: 'text-xs tracking-[0.15em] uppercase text-[var(--text-primary)] hover:opacity-70 transition-opacity',
        cartLabel: true,
        useBagText: true,
        useMenuText: true,
        drawerSide: 'right',
        drawerDark: false,
        drawerFullScreen: true,
        scrollBehavior: 'border',
      };
    case 'Heritage':
      return {
        height: 'h-[64px]',
        bg: 'bg-[var(--bg-primary)]',
        border: 'border-b border-[var(--border)]',
        logoFont: 'font-bold text-lg text-[var(--text-primary)]',
        linkStyle: 'text-sm text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors',
        cartLabel: false,
        useBagText: false,
        useMenuText: false,
        drawerSide: 'right',
        drawerDark: false,
        scrollBehavior: 'border',
      };
    case 'Spiritual':
      return {
        height: 'h-[68px]',
        bg: 'bg-[var(--bg-primary)]',
        border: 'border-b border-[var(--border)]',
        logoFont: 'font-serif tracking-[0.15em] text-lg text-[var(--text-primary)]',
        linkStyle: 'text-xs tracking-[0.2em] uppercase text-[var(--text-primary)] hover:opacity-70 transition-opacity relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-[var(--accent-gold)] after:scale-x-0 hover:after:scale-x-100 after:transition-transform',
        cartLabel: true,
        useBagText: true,
        useMenuText: true,
        drawerSide: 'right',
        drawerDark: false,
        drawerFullScreen: true,
        scrollBehavior: 'border',
      };
    case 'Fresh':
      return {
        height: 'h-[56px]',
        bg: 'bg-[var(--bg-primary)]',
        border: 'border-b border-[var(--border)]',
        logoFont: 'font-black uppercase tracking-tighter text-xl text-[var(--primary)]',
        linkStyle: 'uppercase font-semibold text-xs tracking-wider text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors',
        cartLabel: false,
        useBagText: false,
        useMenuText: false,
        drawerSide: 'right',
        drawerDark: false,
        scaleTapCart: true,
        scrollBehavior: 'border',
      };
    case 'Professional':
      return {
        height: 'h-[56px]',
        bg: 'bg-[var(--bg-primary)]',
        border: 'border-b border-[var(--border)]',
        logoFont: 'font-semibold text-lg text-[var(--text-primary)]',
        linkStyle: 'text-sm font-medium text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors',
        cartLabel: false,
        useBagText: false,
        useMenuText: false,
        drawerSide: 'right',
        scrollBehavior: 'border',
      };
    case 'Gourmet':
      return {
        height: 'h-[64px]',
        bg: 'bg-[var(--bg-primary)]',
        border: 'border-b border-[var(--border)]',
        logoFont: 'text-2xl text-[var(--text-primary)]',
        linkStyle: 'text-sm text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors',
        cartLabel: false,
        useBagText: false,
        useMenuText: false,
        drawerSide: 'right',
        drawerDark: false,
        scrollBehavior: 'border',
      };
    case 'Sleek':
      return {
        height: 'h-[60px]',
        bg: 'bg-[var(--bg-primary)]',
        border: 'border-b border-[var(--border-dark)]',
        logoFont: 'font-mono font-bold uppercase tracking-widest text-sm text-[var(--text-primary)]',
        linkStyle: 'font-mono uppercase text-[10px] tracking-[0.2em] text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors',
        cartLabel: false,
        useBagText: false,
        useMenuText: false,
        drawerSide: 'right',
        drawerDark: true,
        scrollBehavior: 'border',
      };
    case 'Clinical':
      return {
        height: 'h-[56px]',
        bg: 'bg-[var(--bg-primary)]',
        border: 'border-b border-[var(--border)]',
        logoFont: 'font-semibold text-lg text-[var(--primary)]',
        linkStyle: 'text-sm text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors',
        cartLabel: false,
        useBagText: false,
        useMenuText: false,
        drawerSide: 'right',
        scrollBehavior: 'border',
      };
    // Minimal — default
    default:
      return {
        height: 'h-[56px]',
        bg: 'bg-[var(--bg-primary)]',
        border: 'border-b border-[var(--border)]',
        logoFont: 'font-semibold text-lg text-[var(--text-primary)]',
        linkStyle: 'text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors',
        cartLabel: false,
        useBagText: false,
        useMenuText: false,
        drawerSide: 'right',
        scrollBehavior: 'border',
      };
  }
}

// ─── Component ─────────────────────────────────────────────────────────────────
export default function Header({ store }: { store?: any }) {
  const [count, setCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navData, setNavData] = useState<{ collections: any[]; policies: any[]; static_pages: any[] }>({
    collections: [],
    policies: [],
    static_pages: [],
  });

  const storeName = store?.name || "Easy D2C";
  const logoUrl = store?.logo_url;
  const moodCard = store?.mood_card || 'saaf_suthra'; // canonical field from vw_store_config_resolved
  const hasSearch = store?.has_search || false;
  const card = getCardConfig(moodCard);

  // Scroll listener
  useEffect(() => {
    if (card.scrollBehavior === 'border' || card.scrollBehavior === 'dhamaka') {
      const onScroll = () => setScrolled(window.scrollY > 10);
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => window.removeEventListener('scroll', onScroll);
    }
  }, [card.scrollBehavior]);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = getCart();
      setCount(cart.reduce((sum: number, i: any) => sum + i.qty, 0));
    };
    const fetchNav = async () => {
      if (store?.id) {
        const data = await getStoreNavigation(store.id);
        setNavData(data);
      }
    };
    updateCartCount();
    fetchNav();
    window.addEventListener("cart-updated", updateCartCount);
    return () => window.removeEventListener("cart-updated", updateCartCount);
  }, [store?.id]);

  // Dhamaka: transparent → solid on scroll
  const headerBg =
    card.scrollBehavior === 'dhamaka'
      ? scrolled ? 'bg-white' : 'bg-transparent'
      : card.bg;

  // Border: hide at top, show on scroll (except Dhamaka which has no border)
  const headerBorder =
    card.scrollBehavior === 'border'
      ? scrolled
        ? card.border
        : 'border-b border-transparent'
      : card.scrollBehavior === 'dhamaka'
        ? ''
        : card.border;

  const Logo = () => (
    <Link href="/" className="flex items-center site-logo">
      {logoUrl ? (
        <Image
          src={logoUrl}
          alt={storeName}
          width={240}
          height={60}
          className="h-9 w-auto object-contain"
          priority
          sizes="(max-width: 768px) 150px, 240px"
        />
      ) : (
        <span className={card.logoFont} style={{ fontFamily: 'var(--heading-font)' }}>
          {storeName}
        </span>
      )}
    </Link>
  );

  const NavLinks = () => (
    <nav className="hidden md:flex items-center gap-8">
      {navData.collections.slice(0, 4).map((c: any) => (
        <Link key={c.id} href={`/collections/${c.slug}`} className={card.linkStyle}>
          {c.name}
        </Link>
      ))}
      <Link href="/track-order" className={card.linkStyle}>
        Track Order
      </Link>
    </nav>
  );

  const CartButton = () => {
    const CartEl = (
      <button
        onClick={() => setCartOpen(true)}
        className="site-cart flex items-center gap-1.5 relative"
        aria-label="Open cart"
      >
        {card.useBagText ? (
          <span className={`${card.linkStyle} text-sm font-medium`}>
            BAG {count > 0 ? `(${count})` : '(0)'}
          </span>
        ) : (
          <>
            <ShoppingBag className="w-5 h-5 text-[var(--text-primary)]" />
            {count > 0 && (
              <span className="cart-badge bg-[var(--primary)] text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center absolute -top-1 -right-2">
                {count}
              </span>
            )}
          </>
        )}
      </button>
    );

    // Taza: wrap cart in ScaleTap
    if (card.scaleTapCart) {
      return <ScaleTap>{CartEl}</ScaleTap>;
    }
    return CartEl;
  };

  const MenuButton = () => (
    <button
      onClick={() => setMobileOpen(!mobileOpen)}
      className="md:hidden flex items-center justify-center w-10 h-10"
      aria-label="Toggle menu"
    >
      {card.useMenuText ? (
        <span className={`${card.linkStyle} text-xs`}>
          {mobileOpen ? 'CLOSE' : 'MENU'}
        </span>
      ) : mobileOpen ? (
        <X className="w-5 h-5 text-[var(--text-primary)]" />
      ) : (
        /* Hamburger */
        <svg className="w-5 h-5 text-[var(--text-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      )}
    </button>
  );

  // Mobile drawer background
  const drawerBg = card.drawerDark
    ? 'bg-[var(--bg-primary)]'
    : card.drawerFullScreen
      ? 'bg-[var(--bg-primary)]'
      : 'bg-[var(--bg-primary)]';

  const drawerPosition = card.drawerSide === 'left'
    ? 'left-0 right-auto w-80'
    : card.drawerFullScreen
      ? 'inset-0'
      : 'right-0 left-auto w-80';

  return (
    <>
      <header
        className={`site-header sticky top-0 z-50 transition-all duration-300 ${card.height} ${headerBg} ${headerBorder}`}
        data-scrolled={scrolled}
        data-mood={moodCard}
      >
        <div className="max-w-[var(--container-max,1280px)] mx-auto px-4 sm:px-6 h-full flex items-center justify-between gap-6">
          <Logo />
          <div className="flex-1 flex justify-center">
            <NavLinks />
          </div>
          <div className="flex items-center gap-4">
            {hasSearch && (
              <button className="flex items-center justify-center w-8 h-8" aria-label="Search">
                <Search className="w-4 h-4 text-[var(--text-primary)]" />
              </button>
            )}
            <CartButton />
            <MenuButton />
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          className={`fixed top-0 ${drawerPosition} h-full ${drawerBg} z-[60] overflow-y-auto shadow-xl`}
          style={{ paddingTop: 'env(safe-area-inset-top)' }}
        >
          <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
            <span className={card.logoFont} style={{ fontFamily: 'var(--heading-font)' }}>
              {storeName}
            </span>
            <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
              <X className="w-5 h-5 text-[var(--text-primary)]" />
            </button>
          </div>
          <nav className="p-6 flex flex-col gap-[var(--component-gap-light)]">
            <Link href="/" onClick={() => setMobileOpen(false)} className={`${card.linkStyle} text-base py-2 border-b border-[var(--border)]`}>
              Home
            </Link>
            {navData.collections.map((c: any) => (
              <Link
                key={c.id}
                href={`/collections/${c.slug}`}
                onClick={() => setMobileOpen(false)}
                className={`${card.linkStyle} text-base py-2 border-b border-[var(--border)]`}
              >
                {c.name}
              </Link>
            ))}
            <Link href="/track-order" onClick={() => setMobileOpen(false)} className={`${card.linkStyle} text-base py-2 border-b border-[var(--border)]`}>
              Track Order
            </Link>
            {navData.policies.map((p: any) => (
              <Link
                key={p.id}
                href={`/pages/${p.slug}`}
                onClick={() => setMobileOpen(false)}
                className={`${card.linkStyle} text-sm py-2`}
              >
                {p.title}
              </Link>
            ))}
            <button
              onClick={() => { setMobileOpen(false); setCartOpen(true); }}
              className={`${card.linkStyle} text-base py-3 text-left font-semibold`}
            >
              {card.useBagText ? `BAG (${count})` : `Cart (${count})`}
            </button>
          </nav>
        </div>
      )}

      {/* Overlay for drawers */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[59] md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <SlideOutCart open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
