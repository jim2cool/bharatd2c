import { notFound } from "next/navigation"
import { getProductDataForPDP } from "@/lib/pdp-adapter"
import { getActiveStore } from "@/lib/getActiveStore"
import { Metadata, ResolvingMetadata } from "next"
import { PDPClientWrapper } from "./components/PDPClientWrapper"

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

export default async function ProductPage(props: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { slug } = await props.params
  const searchParams = await props.searchParams
  const store = await getActiveStore()

  if (!slug || !store) notFound()

  // 1. Preview Mode Logic
  const isPreviewRequest = searchParams.preview === 'true'
  let isPreviewMode = false

  if (isPreviewRequest) {
    const { supabaseAdmin } = await import('@/lib/supabase-admin')
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()

    // Check for standard Supabase Auth Token
    // We iterate over cookies to find the one starting with 'sb-' and ending with '-auth-token'
    const authCookie = cookieStore.getAll().find(c => c.name.startsWith('sb-') && c.name.endsWith('-auth-token'))

    if (authCookie) {
      // Verify the token is valid by getting the user
      const { data: { user }, error } = await supabaseAdmin.auth.getUser(authCookie.value)
      if (user && !error) {
        isPreviewMode = true
      }
    }
  }

  const product = await getProductDataForPDP(slug, store.id, { isPreview: isPreviewMode })
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
  const architectureId = themeConfig?.architecture || 'product-engine'
  const categoryConfig = {
    category: product.category || themeConfig?.category?.category || 'multi',
    requiredModules: themeConfig?.category?.requiredModules || [],
    optionalModules: themeConfig?.category?.optionalModules || [],
    imageRatio: themeConfig?.category?.imageRatio || '1:1',
    variantSelectorType: themeConfig?.category?.variantSelectorType || 'dropdown',
    data: product.category_data || {}
  }

  return (
    <main className="min-h-screen bg-background pb-32 md:pb-12 text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 py-3 md:py-10">

        {/* PREVIEW MODE BANNER */}
        {isPreviewMode && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-center gap-3 text-yellow-800">
            <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
            <span className="font-bold text-sm uppercase tracking-wider">Preview Mode</span>
            <span className="text-sm opacity-75 hidden md:inline">• You are viewing a draft or unpublished product.</span>
          </div>
        )}

        {/* Deterministic Architecture-Based Rendering */}
        <PDPClientWrapper
          product={product}
          architectureId={architectureId}
          categoryConfig={categoryConfig as any}
        />

      </div>
    </main>
  )
}
