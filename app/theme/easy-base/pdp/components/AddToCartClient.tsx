"use client";

import { useState } from "react";
import { addToCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";

type Props = {
  productId: string;
  title: string;
  price: number;
  image?: string;
  qty?: number;
};

export default function AddToCartClient({
  productId,
  title,
  price,
  image = "",
  qty = 1,
}: Props) {
  const [loading, setLoading] = useState(false);

  function handleAddToCart() {
    setLoading(true);

    addToCart({
      product_id: productId,
      title,
      price,
      image,
      qty,
    });

    setLoading(false);
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
