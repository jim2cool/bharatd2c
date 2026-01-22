"use client";

import PLPCard from "./PLPCard";
import { layoutTokens } from "../tokens/layout";

export default function PLPGrid({ products }: { products: any[] }) {
  return (
    <div
      className={`${layoutTokens.pageMaxWidth} mx-auto ${layoutTokens.pagePaddingX} py-10`}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <PLPCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
