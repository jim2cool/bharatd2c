"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCart } from "@/lib/cart";
import { SlideOutCart } from "@/components/SlideOutCart";
import { ShoppingBag, Menu, X } from "lucide-react";

export default function Header() {
  const [count, setCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = getCart();
      setCount(cart.reduce((sum, i) => sum + i.qty, 0));
    };

    updateCartCount();
    window.addEventListener("cart-updated", updateCartCount);
    return () => window.removeEventListener("cart-updated", updateCartCount);
  }, []);

  return (
    <header className="site-header">
      {/* ================= DESKTOP ================= */}
      <div className="site-header-inner desktop">
        <Link href="/" className="site-logo font-bold tracking-tight text-xl uppercase italic">
          Bharat D2C
        </Link>

        <nav className="site-nav flex items-center gap-8">
          <Link href="/products" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors tracking-wide">
            Shop
          </Link>
          <Link href="/collections" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors tracking-wide">
            Collections
          </Link>

          <button
            onClick={() => setCartOpen(true)}
            className="site-cart flex items-center gap-2 relative group"
            aria-label="Open cart"
          >
            <ShoppingBag className="w-5 h-5 text-gray-700 group-hover:text-primary transition-colors" />
            <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">Cart</span>
            {count > 0 && <span className="cart-badge bg-primary text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center absolute -top-1 -right-2">{count}</span>}
          </button>
        </nav>
      </div>

      {/* ================= MOBILE ================= */}
      <div className="site-header-inner mobile">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="mobile-menu-toggle flex items-center justify-center w-10 h-10"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        <Link href="/" className="site-logo font-bold uppercase italic text-sm tracking-tighter">
          Bharat D2C
        </Link>

        <button
          onClick={() => setCartOpen(true)}
          className="site-cart relative"
          aria-label="Open cart"
        >
          <ShoppingBag className="w-5 h-5" />
          {count > 0 && (
            <span className="cart-badge">
              {count}
            </span>
          )}
        </button>
      </div>

      {/* ================= MOBILE DRAWER ================= */}
      {mobileOpen && (
        <div className="mobile-drawer">
          <nav className="mobile-nav">
            <ul>
              <li>
                <Link href="/" onClick={() => setMobileOpen(false)}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" onClick={() => setMobileOpen(false)}>
                  Shop
                </Link>
              </li>
              <li>
                <button onClick={() => { setMobileOpen(false); setCartOpen(true); }}>
                  Cart
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {/* ================= SLIDE-OUT CART ================= */}
      <SlideOutCart open={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
}
