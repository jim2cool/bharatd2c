"use client";

import HighlightBullets from "../components/HighlightBullets";

type Props = {
  product: any;
  variant?: "bullets" | "icons";
};

export default function PdpHighlightsSection({
  product,
  variant = "bullets",
}: Props) {
  // v1: pass-through to existing highlight bullets
  return <HighlightBullets items={product.highlights || []} />;
}
