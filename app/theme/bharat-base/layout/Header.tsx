"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCart } from "@/lib/cart";

export default function Header() {
  const [count, setCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

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
        <Link href="/" className="site-logo">
          YourBrand
        </Link>

        <nav className="site-nav">
  <Link href="/products">Shop</Link>
  <Link href="/collections">Collections</Link>

  <Link href="/cart" className="site-cart">
    Cart
    {count > 0 && <span className="cart-badge">{count}</span>}
  </Link>
</nav>

      </div>

      {/* ================= MOBILE ================= */}
      <div className="site-header-inner mobile">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="mobile-menu-toggle"
          aria-label="Toggle menu"
        >
          {mobileOpen ? "✕" : "☰"}
        </button>

        <Link href="/" className="site-logo">
          YourBrand
        </Link>

        <Link href="/cart" className="site-cart">
          🛒
          {count > 0 && (
            <span className="cart-badge">
              {count}
            </span>
          )}
        </Link>
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
                <Link href="/cart" onClick={() => setMobileOpen(false)}>
                  Cart
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
