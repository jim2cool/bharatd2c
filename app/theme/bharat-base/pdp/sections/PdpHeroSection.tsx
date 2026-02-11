"use client";

import StarRating from "../components/StarRating";
import ImageGallery from "../components/ImageGallery";
import PriceBlock from "../components/PriceBlock";
import CTAStack from "../components/CTAStack";
import { renderIf } from "../../shared/renderIf";
import { PDP_SECTIONS } from "../pdpSections";

export default function PdpHeroSection({ product }: { product: any }) {
	
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* LEFT COLUMN */}
      <div>
        {renderIf(
          PDP_SECTIONS.includes("gallery"),
          <div className="rounded-lg overflow-hidden">
            <ImageGallery images={product.images || []} />
          </div>
        )}
      </div>

      {/* RIGHT COLUMN */}
      <div className="flex flex-col">
        {renderIf(
          PDP_SECTIONS.includes("title"),
          <h1 className="text-2xl md:text-3xl font-semibold leading-tight">
            {product.title}
          </h1>
        )}

        {renderIf(
          PDP_SECTIONS.includes("rating") && product.rating,
          <div className="mt-2 text-sm text-gray-600">
            <StarRating
              rating={product.rating}
              count={product.review_count || 0}
            />
          </div>
        )}

        {renderIf(
          PDP_SECTIONS.includes("price"),
          <div className="mt-4">
            <PriceBlock price={product.price} mrp={product.mrp} />
          </div>
        )}

        {renderIf(
  PDP_SECTIONS.includes("price") && product?.price,
  <div className="mt-4">
    <PriceBlock
      price={product.price}
      mrp={product.mrp}
    />
  </div>
)}

      </div>
    </div>
  );
}


