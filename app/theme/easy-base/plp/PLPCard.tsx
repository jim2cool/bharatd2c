"use client";

import Link from "next/link";
import ThemeImage from "../shared/ThemeImage";

export default function PLPCard({ product }: { product: any }) {
  const image =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : null;

  return (
    <Link href={`/products/${product.slug}`}>
      <div className="border border-[var(--border)] rounded-[var(--radius-card)] p-3 bg-[var(--bg-primary)] hover:shadow-[var(--shadow-hover)] transition">
        <div className="aspect-square bg-[var(--bg-secondary)] rounded-[var(--radius-image)] mb-2 overflow-hidden">
          {image && (
            <ThemeImage
              src={image}
              alt={product.title}
              priority={false}
            />
          )}
        </div>

        <h3 className="text-sm font-medium text-[var(--text-primary)]">{product.title}</h3>
        <p className="text-sm font-semibold mt-1 text-[var(--primary)]">₹{product.price}</p>
      </div>
    </Link>
  );
}
