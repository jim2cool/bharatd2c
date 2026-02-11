export function adaptProductForPDP(product: any) {
  if (!product) return null

  const variants =
    product.product_variants
      ?.filter((v: any) => v.status === "active")
      .map((v: any) => ({
        id: v.id,
        title: v.title,
        price: Number(v.price),
        mrp: v.mrp ? Number(v.mrp) : undefined,
        inventory: v.inventory,
        is_default: v.is_default,
      })) || []

  return {
    id: product.id,
    title: product.title,
    slug: product.slug,
    status: product.status,

    images: product.images || [],
    highlights: product.highlights || [],
    rating: product.rating,
    review_count: product.review_count,
    testimonials: product.testimonials,
    content_markup: product.content_markup,

    cod_allowed: product.cod_allowed ?? true,

    variants,
  }
}
