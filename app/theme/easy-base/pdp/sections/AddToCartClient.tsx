"use client";

import { useState } from "react";
import { addToCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";

type Props = {
  variantId: string;
  qty?: number;
};

export default function AddToCartClient({
  variantId,
  qty = 1,
}: Props) {
  const [loading, setLoading] = useState(false);

  async function handleAddToCart() {
    try {
      setLoading(true);
      await addToCart({
        variantId,
        qty,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      size="lg"
      className="w-full rounded-xl"
      onClick={handleAddToCart}
      disabled={loading}
    >
      {loading ? "Adding…" : "Add to Cart"}
    </Button>
  );
}
