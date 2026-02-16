"use client";

import { getCart, updateQty, removeFromCart } from "@/lib/cart";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any[]>([]);

  const refreshCart = () => {
    setCart(getCart());
  };

  useEffect(() => {
    const items = getCart();
    setCart(items);
  }, []); // Run once on mount

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const freeShippingThreshold = 999;
  const remainingForFreeShipping = Math.max(freeShippingThreshold - subtotal, 0);
  const shippingProgress = Math.min((subtotal / freeShippingThreshold) * 100, 100);

  if (cart.length === 0) {
    return (
      <main className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <h1 className="text-2xl font-medium">Your cart is empty</h1>
        <Button asChild>
          <Link href="/products">
            Continue Shopping
          </Link>
        </Button>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background py-12 md:py-16 pb-32 md:pb-16">
      <section className="container max-w-4xl px-4 md:px-6 mx-auto">
        <h1 className="text-3xl md:text-4xl font-normal tracking-tight text-center mb-12">
          Your Cart
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* CART ITEMS (Left Column) */}
          <div className="md:col-span-2 space-y-8">
            {/* Free Shipping Progress */}
            <div className="p-4 bg-muted/20 border rounded-sm mb-6">
              {subtotal < freeShippingThreshold ? (
                <p className="text-sm text-muted-foreground mb-3">
                  Add <span className="font-semibold text-foreground">₹{remainingForFreeShipping}</span> more for <span className="font-semibold text-green-600 uppercase tracking-wider text-xs">Free Shipping</span>
                </p>
              ) : (
                <p className="text-sm font-medium text-green-700 mb-3">
                  🎉 You've unlocked FREE SHIPPING!
                </p>
              )}
              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-saffron-500 transition-all duration-500"
                  style={{ width: `${shippingProgress}%` }}
                />
              </div>
            </div>

            {cart.map((item, index) => (
              <div
                key={item.product_id || index}
                className="flex gap-6 py-6 border-b border-border/40 first:pt-0"
              >
                {/* Image */}
                <div className="w-24 h-24 bg-muted/20 relative shrink-0 overflow-hidden">
                  <Image
                    src={item.image || "/placeholder.png"}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="text-base font-medium text-foreground leading-tight line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-base font-semibold text-foreground">
                      ₹{(item.price * item.qty).toLocaleString()}
                    </p>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    ₹{item.price.toLocaleString()} each
                  </p>

                  <div className="flex items-center justify-between pt-2">
                    {/* Qty Control */}
                    <div className="flex items-center border border-border/60 rounded-sm">
                      <button
                        onClick={() => {
                          updateQty(item.product_id, item.qty - 1);
                          refreshCart();
                        }}
                        className="h-8 w-8 flex items-center justify-center hover:bg-muted transition-colors"
                        disabled={item.qty <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => {
                          updateQty(item.product_id, item.qty + 1);
                          refreshCart();
                        }}
                        className="h-8 w-8 flex items-center justify-center hover:bg-muted transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        removeFromCart(item.product_id);
                        refreshCart();
                      }}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* SUMMARY (Right Column) */}
          <div className="md:col-span-1">
            <div className="bg-muted/30 p-6 rounded-sm space-y-4 sticky top-24">
              <div className="flex justify-between text-base">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-base">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>

              <div className="border-t border-border/40 pt-4 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>

              <p className="text-[10px] font-black text-muted-foreground text-center uppercase tracking-widest pt-2">
                Secure checkout • COD available
              </p>

              <Button
                onClick={() => router.push("/checkout")}
                size="lg"
                className="w-full rounded-none h-14 uppercase tracking-widest font-bold shadow-lg"
              >
                Checkout
              </Button>
            </div>
          </div>
        </div>

        {/* CROSS-SELL (P3-3) */}
        <div className="mt-16 border-t pt-12">
          <h2 className="text-xl md:text-2xl font-normal mb-8 tracking-tight text-center md:text-left">
            People also bought
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {/* We'll use a few dummy products for the cross-sell here, or fetch them if we had a dedicated hook */}
            {/* For now, just a placeholder that matches the PDP style */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="group flex flex-col gap-3">
                <div className="aspect-square relative overflow-hidden bg-muted/20 rounded-sm">
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 text-[10px] uppercase font-bold tracking-widest">
                    Recommended
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="h-4 w-3/4 bg-muted/30 rounded animate-pulse" />
                  <div className="h-4 w-1/4 bg-muted/30 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MOBILE STICKY CTA (P0-4) */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 z-40 md:hidden animate-in slide-in-from-bottom duration-300 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="container mx-auto flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Total</span>
            <span className="text-lg font-bold">₹{subtotal.toLocaleString()}</span>
          </div>
          <Button
            onClick={() => router.push("/checkout")}
            size="lg"
            className="flex-1 rounded-none h-12 uppercase tracking-widest font-bold"
          >
            Checkout
          </Button>
        </div>
      </div>
    </main>
  );
}
