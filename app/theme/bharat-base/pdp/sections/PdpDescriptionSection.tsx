"use client";

import AccordionRenderer from "../components/AccordionRenderer";

type Props = {
  product: any;
  variant?: "accordion" | "tabs" | "plain";
};

export default function PdpDescriptionSection({
  product,
  variant = "accordion",
}: Props) {
  // v1: pass-through to existing accordion renderer
  return <AccordionRenderer markup={product.content_markup} />;
}
