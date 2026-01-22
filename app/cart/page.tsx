"use client";

import {
  getCart,
  updateQty,
  removeFromCart,
} from "@/lib/cart";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CartPage() {
  const router = useRouter();
  const [item, setItem] = useState<any>(null);

  useEffect(() => {
    const cart = getCart();
    if (!cart.length) {
      router.push("/products");
      return;
    }
    setItem(cart[0]);
  }, [router]);

  if (!item) return null;

  const subtotal = item.price * item.qty;

  const changeQty = (delta: number) => {
    const newQty = item.qty + delta;
    if (newQty < 1) return;

    updateQty(newQty);
    setItem({ ...item, qty: newQty });
  };

  return (
    <main className="max-w-md mx-auto px-4 py-10">
      <h1 className="text-xl font-semibold mb-4">Your Cart</h1>

      <div className="flex gap-3 border p-3 rounded mb-4">
        <div className="w-20 h-20 bg-gray-100 shrink-0">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1">
          <div className="font-medium">{item.title}</div>

          <div className="text-sm text-gray-600 mt-1">
            ₹{item.price} × {item.qty}
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-3 mt-2">
            <button
              onClick={() => changeQty(-1)}
              className="border px-2"
            >
              −
            </button>
            <span>{item.qty}</span>
            <button
              onClick={() => changeQty(1)}
              className="border px-2"
            >
              +
            </button>
          </div>

          <button
            onClick={() => {
              removeFromCart();
              router.push("/products");
            }}
            className="text-sm text-red-600 mt-3"
          >
            Remove
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="border-t pt-4 mb-4 text-sm">
        <div className="flex justify-between mb-1">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>
        <div className="flex justify-between text-gray-500">
          <span>Shipping</span>
          <span>Free</span>
        </div>
      </div>

      <div className="text-lg font-semibold mb-4">
        Total: ₹{subtotal}
      </div>

      <button
        onClick={() => router.push("/checkout")}
        className="w-full bg-black text-white py-3 text-lg font-semibold"
      >
        Proceed to Checkout
      </button>
    </main>
  );
}
