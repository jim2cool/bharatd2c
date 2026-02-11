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
        className="w-full btn btn-primary py-4 text-lg transition-all hover:shadow-md active:scale-[0.97]"
      >
        Order Now — Cash on Delivery
      </button>

      {cartEnabled && (
        <button
          onClick={() => {
            add();
            router.push("/cart");
          }}
          className="w-full border border-gray-300 py-3 text-sm rounded-xl hover:bg-gray-50 transition"
        >
          Add to Cart
        </button>
      )}

      <div className="text-[11px] text-gray-400 text-center">
        Pay Online & Get Extra Discount (Coming Soon)
      </div>
    </div>
  );
}
