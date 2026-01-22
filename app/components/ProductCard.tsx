"use client";

import Link from "next/link";
import { addToCart } from "@/lib/cart";

export default function ProductCard({ product }: { product: any }) {
  const {
    id,
    title,
    images,
    price,
    sellingPrice,
    mrp,
  } = product;

  /* ---------- IMAGE SAFETY ---------- */
  const imageList = Array.isArray(images) ? images : [];
  const primaryImage =
    imageList.length > 0 ? imageList[0] : "/placeholder-product.png";
  const secondaryImage =
    imageList.length > 1 ? imageList[1] : null;

  /* ---------- PRICE ---------- */
  const finalPrice = sellingPrice ?? price;
  const comparePrice = mrp && mrp > finalPrice ? mrp : null;

  const hasDiscount = Boolean(comparePrice);
  const discountPercent = hasDiscount
    ? Math.round(((comparePrice - finalPrice) / comparePrice) * 100)
    : null;

  /* ---------- QUICK ADD ---------- */
  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ ...product, qty: 1 });
  };

  return (
    <div className="product-card">
      {/* IMAGE */}
      <div className="product-media">
        <Link href={`/products/${product.slug}`} className="product-media">
          <img
            src={primaryImage}
            alt={title}
            className="product-image primary"
          />

          {secondaryImage && (
            <img
              src={secondaryImage}
              alt={title}
              className="product-image secondary"
            />
          )}

          {hasDiscount && (
            <span className="product-badge">
              {discountPercent}% OFF
            </span>
          )}
        </Link>
      </div>

      {/* QUICK ADD — CARD LEVEL */}
      <button
        className="quick-add"
        aria-label="Add to cart"
        onClick={handleQuickAdd}
      >
        <img src="/quick-add-cart.png" alt="" />
      </button>

      {/* INFO */}
      <div className="product-info">
        <h3 className="product-title">{title}</h3>

        <div className="product-price">
          <span className="price-current">₹{finalPrice}</span>

          {hasDiscount && (
            <span className="price-compare">
              ₹{comparePrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
