"use client";

import { addToCart } from "@/lib/cart";
import { STORE_CONFIG } from "@/lib/storeConfig";
import { useRouter } from "next/navigation";

export default function CTAStack({
  product,
}: {
  product: {
    id: string;
    title: string;
    images: string[];
    price: number;
    enable_cart?: boolean;
  };
}) {
  const router = useRouter();

  const cartEnabled =
    product.enable_cart ?? STORE_CONFIG.enableCart;

  const handleAddToCart = () => {
    addToCart({
      product_id: product.id,
      title: product.title,
      image: product.images[0],
      price: product.price,
      qty: 1,
    });
    router.push("/cart");
  };

  const handleDirectCheckout = () => {
    addToCart({
      product_id: product.id,
      title: product.title,
      image: product.images[0],
      price: product.price,
      qty: 1,
    });
    router.push("/checkout");
  };

  return (
    <div className="mt-6 space-y-2">

      {/* PRIMARY CTA — COD DIRECT */}
      <button
        onClick={handleDirectCheckout}
        className="w-full bg-black active:scale-[0.98] transition text-white py-3 text-lg font-semibold rounded"
      >
        Order Now – Cash on Delivery
      </button>

      {/* SECONDARY CTA — ADD TO CART (OPTIONAL) */}
      {cartEnabled && (
        <button
          onClick={handleAddToCart}
          className="w-full border py-3 text-sm rounded"
        >
          Add to Cart
        </button>
      )}

      <button
        disabled
        className="w-full border py-3 text-sm opacity-60 rounded"
      >
        Pay Online & Get Extra Discount (Coming Soon)
      </button>
    </div>
  );
}
