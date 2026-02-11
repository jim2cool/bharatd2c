import { notFound } from "next/navigation"
import { getProductDataForPDP } from "@/lib/pdp-adapter"
import { MediaGallery } from "./components/hero/MediaGallery"
import { ProductInfo } from "./components/ProductInfo"
import { Highlights } from "./components/highlights/Highlights"
import { Conversion } from "./components/conversion/Conversion"
import { Proof } from "./components/proof/Proof"
import { ContentAccordions } from "./components/content/ContentAccordions"
import { PeopleAlsoBought } from "./components/aov/PeopleAlsoBought"
import { getActiveStoreId } from "@/lib/getActiveStore"

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const storeId = await getActiveStoreId()

  if (!slug || !storeId) notFound()

  const product = await getProductDataForPDP(slug, storeId)

  if (!product) notFound()

  return (
    <main className="min-h-screen bg-background pb-32 md:pb-12">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-10">

        {/* Dawn-Style Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10">

          {/* LEFT COLUMN: Media Gallery */}
          <div className="w-full min-w-0">
            <MediaGallery media={product.media} />
          </div>

          {/* RIGHT COLUMN: Product Info + Conversion (Sticky) */}
          <div className="relative">
            <div className="lg:sticky lg:top-6 h-fit flex flex-col gap-3"> {/* Tightened gap-6 -> gap-3 */}

              {/* 1. Title, Subtitle & Rating */}
              <ProductInfo product={product} />

              {/* 2. Highlights (Bullet Points) */}
              <Highlights highlights={product.highlights} />

              {/* 3. Urgency/Price/Conversion */}
              <Conversion product={product} />

              {/* 4. Product Details Accordions */}
              <ContentAccordions sections={product.content} />

            </div>
          </div>

        </div>

        {/* FULL WIDTH SECTIONS (Below Fold) */}
        <div className="mt-8 space-y-8 border-t pt-8">

          {/* 5. Reviews */}
          <Proof rating={product.rating} reviewCount={product.reviewCount} reviews={product.reviews} />

          {/* 6. Related Products */}
          <PeopleAlsoBought products={product.relatedProducts} />

        </div>
      </div>
    </main>
  )
}
