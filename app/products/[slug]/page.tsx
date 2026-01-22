import PDPResolver from "@/app/theme/bharat-base/pdp/PDPResolver";
import PDPEmpty from "@/app/theme/bharat-base/pdp/PDPEmpty";
import { getProductBySlug } from "@/lib/products";
import { adaptProductForPDP } from "@/lib/productAdapter";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const rawProduct = await getProductBySlug(slug);

  if (!rawProduct) {
    return {
      title: "Product not found",
      description: "This product is unavailable.",
    };
  }

  return {
    title: rawProduct.seo_title || rawProduct.title,
    description:
      rawProduct.seo_description ||
      `Buy ${rawProduct.title} at best price.`,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const rawProduct = await getProductBySlug(slug);
  const product = rawProduct ? adaptProductForPDP(rawProduct) : null;

  if (!product) {
    return <PDPEmpty />;
  }

  return <PDPResolver product={product} />;
}
