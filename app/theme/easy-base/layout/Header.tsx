"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getCart } from "@/lib/cart";
import { SlideOutCart } from "@/components/SlideOutCart";
import { ShoppingBag, Menu, X } from "lucide-react";

export default function Header({ store }: { store?: any }) {
  const [count, setCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const storeName = store?.name || "Easy D2C";
  const logoUrl = store?.logo_url;

  // Header Style from Theme Config
  const headerStyle = store?.theme_config?.header?.style || "default";

  useEffect(() => {
    const updateCartCount = () => {
      const cart = getCart();
      setCount(cart.reduce((sum, i) => sum + i.qty, 0));
    };

    updateCartCount();
    window.addEventListener("cart-updated", updateCartCount);
    return () => window.removeEventListener("cart-updated", updateCartCount);
  }, []);

  const Logo = ({ className = "" }: { className?: string }) => (
    <Link href="/" className={`site-logo flex items-center ${className}`}>
      {logoUrl ? (
        <Image
          src={logoUrl}
          alt={storeName}
          width={240}
          height={60}
          className="h-10 w-auto object-contain"
          priority
          sizes="(max-width: 768px) 150px, 240px"
          quality={90}
        />
      ) : (
        <span className="font-black tracking-tighter text-2xl uppercase text-neutral-900">
          {storeName}
        </span>
      )}
    </Link>
  );

  const NavLinks = () => (
    <nav className="site-nav flex items-center gap-8">
      <Link href="/products" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors tracking-wide">
        Shop
      </Link>
      <Link href="/collections" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors tracking-wide">
        Collections
      </Link>
      <Link href="/track-order" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors tracking-wide">
        Track Order
      </Link>
    </nav>
  );

  const Actions = () => (
    <div className="flex items-center gap-6">
      <button
        onClick={() => setCartOpen(true)}
        className="site-cart flex items-center gap-2 relative group"
        aria-label="Open cart"
      >
        <ShoppingBag className="w-5 h-5 text-gray-700 group-hover:text-primary transition-colors" />
        <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">Cart</span>
        {count > 0 && <span className="cart-badge bg-primary text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center absolute -top-1 -right-2">{count}</span>}
      </button>

      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="mobile-menu-toggle md:hidden flex items-center justify-center w-10 h-10"
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
    </div>
  );

  return (
    <header className={`site-header bg-white border-b border-gray-100 transition-all duration-300 ${store?.theme_config?.header?.sticky ? 'sticky top-0 z-50' : ''}`}>
      {/* ================= DESKTOP ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {headerStyle === "default" && (
            <>
              <Logo />
              <div className="hidden md:flex flex-1 justify-center">
                <NavLinks />
              </div>
              <Actions />
            </>
          )}

          {headerStyle === "modern" && (
            <>
              <div className="flex items-center gap-10">
                <Logo />
                <div className="hidden md:block">
                  <NavLinks />
                </div>
              </div>
              <Actions />
            </>
          )}

          {headerStyle === "minimal" && (
            <>
              <Logo />
              <div className="flex items-center gap-8">
                <div className="hidden md:block">
                  <NavLinks />
                </div>
                <Actions />
              </div>
            </>
          )}
        </div>
      </div>

      {/* ================= MOBILE DRAWER ================= */}
      {mobileOpen && (
        <div className="fixed inset-0 top-20 bg-white z-40 md:hidden animate-in slide-in-from-top duration-300 overflow-y-auto">
          <nav className="p-8 space-y-6">
            <Link href="/" onClick={() => setMobileOpen(false)} className="block text-2xl font-bold border-b pb-4">Home</Link>
            <Link href="/products" onClick={() => setMobileOpen(false)} className="block text-2xl font-bold border-b pb-4">Shop</Link>
            <Link href="/collections" onClick={() => setMobileOpen(false)} className="block text-2xl font-bold border-b pb-4">Collections</Link>
            <Link href="/track-order" onClick={() => setMobileOpen(false)} className="block text-2xl font-bold border-b pb-4">Track Order</Link>
            <button
              onClick={() => { setMobileOpen(false); setCartOpen(true); }}
              className="w-full text-left text-2xl font-bold border-b pb-4 flex justify-between items-center"
            >
              Cart
              {count > 0 && <span className="bg-black text-white px-3 py-1 rounded-full text-sm">{count}</span>}
            </button>
          </nav>
        </div>
      )}

      {/* ================= SLIDE-OUT CART ================= */}
      <SlideOutCart open={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
}
