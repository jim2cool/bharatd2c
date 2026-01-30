"use client";

import { getCart, updateQty, removeFromCart } from "@/lib/cart";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any[]>([]);
  const refreshCart = () => {
  setCart(getCart());
};


  useEffect(() => {
    const items = getCart();
    if (!items.length) {
      router.push("/products");
      return;
    }
    setCart(items);
  }, [router]);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <main className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-xl font-semibold text-center mb-6">
        Your Cart
      </h1>

      {/* CART ITEMS */}
      <div className="space-y-4">
        {cart.map((item, index) => (
          <div
            key={item.product_id || index}
            className="flex gap-3 border rounded-lg p-3"
          >
            {/* Image */}
            <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden shrink-0">
              <img
                src={
                  item.image && item.image.trim()
                    ? item.image
                    : "/placeholder-product.png"
                }
                alt={item.title}
                className="w-full h-full object-cover"
                onError={e => {
                  e.currentTarget.src =
                    "/placeholder-product.png";
                }}
              />
            </div>

            {/* Details */}
            <div className="flex-1">
              <div className="text-sm font-medium leading-tight">
                {item.title}
              </div>

              <div className="text-xs text-gray-600 mt-0.5">
                ₹{item.price} × {item.qty}
              </div>

              {/* Qty */}
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => {
    updateQty(item.product_id, item.qty - 1);
    refreshCart();
  }}
  className="w-7 h-7 border rounded text-sm"
                >
                  −
                </button>

                <span className="text-sm w-4 text-center">
                  {item.qty}
                </span>

                <button
                  onClick={() => {
    updateQty(item.product_id, item.qty + 1);
    refreshCart();
  }}
  className="w-7 h-7 border rounded text-sm"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => {
    removeFromCart(item.product_id);
    refreshCart();
  }}
  className="text-xs text-red-600 mt-2"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* SUMMARY */}
      <div className="border-t mt-6 pt-4 text-sm">
        <div className="flex justify-between mb-1">
          <span className="text-gray-600">
            Subtotal
          </span>
          <span>₹{subtotal}</span>
        </div>

        <div className="flex justify-between text-gray-500 mb-2">
          <span>Shipping</span>
          <span>Free</span>
        </div>

        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>₹{subtotal}</span>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={() => router.push("/checkout")}
        className="w-full mt-6 bg-black text-white py-3 rounded-lg text-lg font-semibold"
      >
        Proceed to Checkout
      </button>
    </main>
  );
}
