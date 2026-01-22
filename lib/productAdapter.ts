import { FALLBACK_PRODUCT_IMAGE } from "@/app/theme/bharat-base/shared/media";
export function adaptProductForPDP(product: any) {
  return {
    id: product.id,
    slug: product.slug,
    title: product.title || "",
    price: product.price || 0,
    mrp: product.mrp || null,
    rating: product.rating || 0,
    review_count: product.review_count || 0,
    highlights: Array.isArray(product.highlights) ? product.highlights : [],
    images:
  Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [FALLBACK_PRODUCT_IMAGE],
    testimonials: product.testimonials || [],
    content_markup: product.content_markup || "",
    pdp_template: product.pdp_template || "bharat-basic",
  };
}
