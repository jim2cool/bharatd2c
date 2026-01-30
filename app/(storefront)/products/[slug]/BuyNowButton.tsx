"use client";

import { useRouter } from "next/navigation";

export default function BuyNowButton({
  price,
  productId,
}: {
  price: number;
  productId: string;
}) {
  const router = useRouter();

  return (
    <button
      onClick={() =>
        router.push(`/checkout?price=${price}&product_id=${productId}`)
      }
      className="w-full bg-black text-white py-3 text-lg font-semibold"
    >
      Buy Now
    </button>
  );
}
