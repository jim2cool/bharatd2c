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
    <div className="group relative flex flex-col gap-3 min-w-[200px]">

      {/* IMAGE CONTAINER - 1:1 ASPECT RATIO ALWAYS */}
      <div className="relative aspect-square overflow-hidden bg-muted/20">
        <Link href={`/products/${slug}`} className="block w-full h-full">
          {/* Primary Image */}
          <Image
            src={primaryImage}
            alt={title}
            fill
            loading={priority ? "eager" : "lazy"}
            className={`object-cover transition-all duration-700 ease-in-out ${secondaryImage ? "group-hover:opacity-0" : "group-hover:scale-105"}`}
          />

          {/* Secondary Image (Swap on Hover) */}
          {secondaryImage && (
            <Image
              src={secondaryImage}
              alt={title}
              fill
              loading="lazy"
              className="absolute inset-0 object-cover opacity-0 transition-opacity duration-700 ease-in-out group-hover:opacity-100 group-hover:scale-105"
            />
          )}
        </Link>

        {/* BADGES */}
        {hasDiscount && (
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-foreground text-[10px] font-bold px-2 py-1 uppercase tracking-wider shadow-sm rounded-sm">
            {discountPercent}% OFF
          </div>
        )}

        {/* QUICK ADD BUTTON - Dawn Style (Floating Bottom Right) */}
        <div className="absolute bottom-3 right-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 rounded-full shadow-md bg-white hover:bg-black hover:text-white transition-colors"
            onClick={handleQuickAdd}
            aria-label="Quick Add"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* INFO */}
      <div className="flex flex-col gap-1 items-start">
        <h3 className="text-sm font-medium text-foreground leading-tight group-hover:underline underline-offset-4 decoration-1 decoration-foreground/50 transition-all">
          <Link href={`/products/${slug}`}>
            {title}
          </Link>
        </h3>

        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-foreground">₹{finalPrice}</span>

          {hasDiscount && (
            <span className="text-muted-foreground line-through text-xs">
              ₹{comparePrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
