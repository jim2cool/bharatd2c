"use client";

import TestimonialCarousel from "../components/TestimonialCarousel";

type Props = {
  product: any;
  variant?: "reviews" | "testimonials" | "mixed";
};

export default function PdpSocialProofSection({
  product,
  variant = "reviews",
}: Props) {
  const testimonials = product?.testimonials || [];

  if (!testimonials.length) return null;

  return <TestimonialCarousel testimonials={testimonials} />;
}
