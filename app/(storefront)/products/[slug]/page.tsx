import { notFound } from "next/navigation"
import { getProductDataForPDP } from "@/lib/pdp-adapter"
import { MediaGallery } from "./components/hero/MediaGallery"
import { ProductInfo } from "./components/ProductInfo"
import { Highlights } from "./components/highlights/Highlights"
import { Conversion } from "./components/conversion/Conversion"
import { Proof } from "./components/proof/Proof"
import { ContentAccordions } from "./components/content/ContentAccordions"
import { PeopleAlsoBought } from "./components/aov/PeopleAlsoBought"
import { getActiveStore } from "@/lib/getActiveStore"
import { Metadata, ResolvingMetadata } from "next"

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params
  const store = await getActiveStore()

  if (!slug || !store) return {}

  const product = await getProductDataForPDP(slug, store.id)
  if (!product) return {}

  const previousImages = (await parent).openGraph?.images || []

  return {
    title: `${product.title} | ${store.name}`,
    description: product.subtitle?.replace(/<[^>]*>?/gm, '').slice(0, 160) || `Buy ${product.title} on ${store.name}`,
    openGraph: {
      title: product.title,
      description: product.subtitle?.slice(0, 160),
      images: [
        {
          url: product.media?.[0]?.src || '',
          width: 800,
          height: 600,
          alt: product.title,
        },
        ...previousImages,
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description: product.subtitle?.slice(0, 160),
      images: [product.media?.[0]?.src || ''],
    },
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const store = await getActiveStore()

  if (!slug || !store) notFound()

  const product = await getProductDataForPDP(slug, store.id)
  if (!product) notFound()

  // JSON-LD Product Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "image": product.media?.map(m => m.src),
    "description": product.subtitle?.replace(/<[^>]*>?/gm, ''),
    "sku": product.id,
    "brand": {
      "@type": "Brand",
      "name": store.name
    },
    "offers": {
      "@type": "Offer",
      "url": `${store.domain}/products/${slug}`,
      "priceCurrency": "INR",
      "price": product.pricing.sellingPrice,
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition"
    }
  }

  const themeConfig = store.theme_config
  const pdpOrder = themeConfig?.cro_strategy?.pdp_order || ['highlights', 'conversion', 'content']
  const belowFoldOrder = ['reviews', 'related'] // Default below fold

  return (
    <main className="min-h-screen bg-background pb-32 md:pb-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-10">

        {/* Dawn-Style Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10">

          {/* LEFT COLUMN: Media Gallery */}
          <div className="w-full min-w-0">
            <MediaGallery media={product.media} />
          </div>

          {/* RIGHT COLUMN: Product Info + Dynamic Order Components */}
          <div className="relative">
            <div className="lg:sticky lg:top-6 h-fit flex flex-col gap-3">
              {/* Product Info is always first */}
              <ProductInfo product={product} />

              {/* Dynamic RHS Components */}
              {pdpOrder.map((compId: string) => {
                switch (compId) {
                  case 'highlights':
                    return <Highlights key="highlights" highlights={product.highlights} />
                  case 'conversion':
                  case 'bundles':
                    return <Conversion key="conversion" product={product} />
                  case 'content':
                  case 'ingredients':
                  case 'how_to_use':
                  case 'specs':
                    return <ContentAccordions key="content" sections={product.content} />
                  case 'reviews':
                    // If reviews are requested in RHS
                    return (
                      <div key="reviews-rhs" className="border-t pt-4 mt-2">
                        <Proof rating={product.rating} reviewCount={product.reviewCount} reviews={product.reviews} compact />
                      </div>
                    )
                  default:
                    return null
                }
              })}
            </div>
          </div>

        </div>

        {/* FULL WIDTH SECTIONS (Below Fold) */}
        <div className="mt-8 space-y-8 border-t pt-8">
          {belowFoldOrder.map((sectionId) => {
            // Avoid double rendering if reviews are in RHS
            if (sectionId === 'reviews' && pdpOrder.includes('reviews')) return null;

            switch (sectionId) {
              case 'reviews':
                return <Proof key="proof" rating={product.rating} reviewCount={product.reviewCount} reviews={product.reviews} />
              case 'related':
                return <PeopleAlsoBought key="related" products={product.relatedProducts} />
              default:
                return null;
            }
          })}
        </div>
      </div>
    </main>
  )
}
