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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* LEFT COLUMN */}
          <div>
            {renderIf(
              PDP_SECTIONS.includes("gallery"),
              <ImageGallery images={product.images || []} />
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div>
            {renderIf(
              PDP_SECTIONS.includes("title"),
              <h1 className="text-2xl font-bold">{product.title}</h1>
            )}

            {renderIf(
              PDP_SECTIONS.includes("rating") && product.rating,
              <div className="mt-1">
                <StarRating
                  rating={product.rating}
                  count={product.review_count || 0}
                />
              </div>
            )}

            {renderIf(
              PDP_SECTIONS.includes("price"),
              <PriceBlock price={product.price} mrp={product.mrp} />
            )}

            {renderIf(
              PDP_SECTIONS.includes("highlights"),
              <HighlightBullets items={product.highlights || []} />
            )}

            {renderIf(
              PDP_SECTIONS.includes("cta"),
              <CTAStack product={product} />
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
          <AccordionRenderer markup={product.content_markup} />
        )}
      </div>
    </main>
  );
}
