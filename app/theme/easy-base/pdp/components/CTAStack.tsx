"use client";

import { addToCart } from "@/lib/cart";
import { STORE_CONFIG } from "@/lib/storeConfig";
import { useRouter } from "next/navigation";

export default function CTAStack({ product }: { product: any }) {
  const router = useRouter();
  const cartEnabled =
    product.enable_cart ?? STORE_CONFIG.enableCart;

  const add = () => {
    addToCart({
      product_id: product.id,
      title: product.title,
      image: product.images[0],
      price: product.price,
      qty: 1,
    });
  };

  return (
    <div className="space-y-3 pt-2">
      <button
        onClick={() => {
          add();
          router.push("/checkout");
        }}
        className="w-full bg-[var(--primary)] text-[var(--primary-foreground)] rounded-[var(--radius-button)] py-4 text-sm font-semibold transition-all hover:shadow-[var(--shadow-hover)] active:scale-[0.97]"
      >
        Order Now — Cash on Delivery
      </button>

      {cartEnabled && (
        <button
          onClick={() => {
            add();
            router.push("/cart");
          }}
          className="w-full border border-[var(--border)] text-[var(--text-primary)] py-3 text-sm rounded-[var(--radius-button)] hover:bg-[var(--bg-secondary)] transition"
        >
          Add to Cart
        </button>
      )}

      <div className="text-[11px] text-[var(--text-secondary)] text-center">
        Pay Online &amp; Get Extra Discount (Coming Soon)
      </div>
    </div>
  );
}
