"use client";

import { renderIf } from "../shared/renderIf";
import { layoutTokens } from "../tokens/layout";
import { PDP_SECTIONS } from "./pdpSections";

import StarRating from "./components/StarRating";
import ImageGallery from "./components/ImageGallery";
import PriceBlock from "./components/PriceBlock";
import HighlightBullets from "./components/HighlightBullets";
import CTAStack from "./components/CTAStack";
import TestimonialCarousel from "./components/TestimonialCarousel";
import AccordionRenderer from "./components/AccordionRenderer";

export default function PDPBasic({ product }: { product: any }) {
  return (
    <main className="bg-white text-black pb-28">
      <div
        className={`${layoutTokens.pageMaxWidth} mx-auto ${layoutTokens.pagePaddingX} pb-10`}
      >
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
              PDP_SECTIONS.includes("highlights"),
              <div className="mt-4">
                <HighlightBullets items={product.highlights || []} />
              </div>
            )}

            {renderIf(
              PDP_SECTIONS.includes("cta"),
              <div className="mt-6">
                <CTAStack product={product} />
              </div>
            )}

            {/* DESKTOP testimonials */}
            {renderIf(
              PDP_SECTIONS.includes("testimonials") &&
                product.testimonials?.length > 0,
              <div className={`hidden md:block ${layoutTokens.sectionSpacing}`}>
                <TestimonialCarousel testimonials={product.testimonials} />
              </div>
            )}
          </div>
        </div>

        {/* MOBILE testimonials */}
        {renderIf(
          PDP_SECTIONS.includes("testimonials") &&
            product.testimonials?.length > 0,
          <div className={`md:hidden ${layoutTokens.sectionSpacingLarge}`}>
            <TestimonialCarousel testimonials={product.testimonials} />
          </div>
        )}

        {/* ACCORDIONS / CONTENT */}
        {renderIf(
          PDP_SECTIONS.includes("content") && product.content_markup,
          <div className="mt-10">
            <AccordionRenderer markup={product.content_markup} />
          </div>
        )}
      </div>
    </main>
  );
}
