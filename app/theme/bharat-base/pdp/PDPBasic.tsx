"use client";

import { renderIf } from "../shared/renderIf";
import { layoutTokens } from "../tokens/layout";
import { PDP_SECTIONS } from "./pdpSections";

// SECTION WRAPPERS
import PdpHeroSection from "./sections/PdpHeroSection";
import PdpHighlightsSection from "./sections/PdpHighlightsSection";
import PdpCTASection from "./sections/PdpCTASection";
import PdpSocialProofSection from "./sections/PdpSocialProofSection";
import PdpDescriptionSection from "./sections/PdpDescriptionSection";
import PdpTrustSection from "./sections/PdpTrustSection";

export default function PDPBasic({ product }: { product: any }) {
  return (
    <main className="bg-white text-black pb-28">
      <div
        className={`${layoutTokens.pageMaxWidth} mx-auto ${layoutTokens.pagePaddingX} pb-10`}
      >
        {/* HERO (gallery + title + rating + price) */}
        {renderIf(
          PDP_SECTIONS.includes("hero"),
          <PdpHeroSection product={product} />
        )}

              {/* HIGHLIGHTS / KEY BENEFITS */}
        {renderIf(
          PDP_SECTIONS.includes("highlights"),
          <div className={layoutTokens.sectionSpacing}>
            <PdpHighlightsSection product={product} />
          </div>
        )}


        {/* SOCIAL PROOF (reviews / testimonials) */}
        {renderIf(
          PDP_SECTIONS.includes("testimonials"),
          <div className={layoutTokens.sectionSpacingLarge}>
            <PdpSocialProofSection product={product} />
          </div>
        )}

        {/* DESCRIPTION / ACCORDION / CONTENT */}
        {renderIf(
          PDP_SECTIONS.includes("content"),
          <div className={layoutTokens.sectionSpacingLarge}>
            <PdpDescriptionSection product={product} />
          </div>
        )}
      </div>
    </main>
  );
}
