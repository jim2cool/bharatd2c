"use client";

import Link from "next/link";
import Image from "next/image";
import { addToCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function ProductCard({ product, priority = false }: { product: any, priority?: boolean }) {
  const {
    id,
    title,
    images,
    price,
    sellingPrice,
    mrp,
    slug
  } = product;

  /* ---------- IMAGE SAFETY ---------- */
  const PLACEHOLDER = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop";
  const imageList = Array.isArray(images) ? images : [];
  const primaryImage =
    imageList.length > 0 && imageList[0] ? imageList[0] : PLACEHOLDER;
  const secondaryImage =
    imageList.length > 1 && imageList[1] ? imageList[1] : null;

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
    addToCart({
      product_id: id,
      title,
      image: primaryImage,
      price: finalPrice,
      qty: 1
    });
    // Optional: Show toast
  };

  return (
    <div className="group relative flex flex-col gap-6 w-full animate-in fade-in duration-700">
      {/* IMAGE CONTAINER - Editorial 3:4 Aspect Ratio */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#F6F6F6] transition-all duration-700">
        <Link href={`/products/${slug}`} className="block w-full h-full">
          {/* Primary Image */}
          <Image
            src={primaryImage}
            alt={title}
            fill
            loading={priority ? "eager" : "lazy"}
            className={`object-cover transition-transform duration-1000 ease-out group-hover:scale-105 ${secondaryImage ? "group-hover:opacity-0" : ""}`}
          />

          {/* Secondary Image (Swap on Hover) */}
          {secondaryImage && (
            <Image
              src={secondaryImage}
              alt={title}
              fill
              loading="lazy"
              className="absolute inset-0 object-cover opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100 group-hover:scale-105"
            />
          )}
        </Link>

        {/* BADGES - Minimalist Saffron Ribbon */}
        {hasDiscount && (
          <div className="absolute top-4 left-4 bg-[#e26a00] text-white text-[9px] font-bold px-3 py-1.5 uppercase tracking-widest shadow-lg z-10">
            {discountPercent}% Off
          </div>
        )}

        {/* QUICK ADD - Modern Overlay */}
        <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-10">
          <Button
            variant="default"
            size="lg"
            className="w-full rounded-none bg-white/90 backdrop-blur-md text-black hover:bg-black hover:text-white shadow-xl uppercase tracking-[0.2em] text-[9px] font-bold h-12 border-0"
            onClick={handleQuickAdd}
          >
            Quick Add
          </Button>
        </div>
      </div>

      {/* INFO - Minimalist Typography */}
      <div className="flex flex-col gap-2 items-center text-center px-2">
        <h3 className="text-lg md:text-xl font-serif font-normal text-charcoal-900 leading-tight group-hover:text-charcoal-700 transition-colors">
          <Link href={`/products/${slug}`}>
            {title}
          </Link>
        </h3>

        <div className="flex items-center gap-3 text-sm">
          <span className="font-sans font-medium text-charcoal-900">₹{finalPrice}</span>
          {hasDiscount && (
            <span className="text-gray-400 line-through text-xs font-light">
              ₹{comparePrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
