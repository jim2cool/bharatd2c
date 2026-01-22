"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SortSelect({
  currentSort,
  basePath,
}: {
  currentSort: string;
  basePath: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <select
      className="
        w-auto
        min-w-[220px]
        border border-gray-300
        rounded-md
        px-3 py-2
        text-sm
        bg-white
        text-gray-900
        focus:outline-none
        focus:ring-2
        focus:ring-[#F59E0B]/30
      "
      value={currentSort}
      onChange={(e) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("sort", e.target.value);
        params.delete("page");
        router.push(`${basePath}?${params.toString()}`);
      }}
    >
      <option value="newest">Newest</option>
      <option value="price_asc">Price: Low to High</option>
      <option value="price_desc">Price: High to Low</option>
    </select>
  );
}
