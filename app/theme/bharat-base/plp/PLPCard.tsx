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
      <div className="border rounded p-3 hover:shadow-sm transition">
        <div className="aspect-square bg-gray-100 mb-2">
          {image && (
            <ThemeImage
              src={image}
              alt={product.title}
              priority={false}
            />
          )}
        </div>

        <h3 className="text-sm font-medium">{product.title}</h3>
        <p className="text-sm font-semibold mt-1">₹{product.price}</p>
      </div>
    </Link>
  );
}
