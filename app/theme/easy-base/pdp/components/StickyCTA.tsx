"use client";

import { useEffect, useState } from "react";
import AddToCartClient from "./AddToCartClient";

type Props = {
  productId: string;
  title: string;
  price: number;
};

export default function StickyCTA({
  productId,
  title,
  price,
}: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 140);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[var(--bg-primary)] border-t border-[var(--border)] shadow-[var(--shadow-hover)] px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">
            {title}
          </div>
          <div className="text-base font-semibold text-[var(--primary)]">
            ₹{price}
          </div>
        </div>

        <div className="w-44">
          <AddToCartClient
            productId={productId}
            title={title}
            price={price}
          />
        </div>
      </div>
    </div>
  );
}
