import { supabase } from './supabase-client'
import { ProductData, MediaItem, ProductHighlight, BundleOption, Review, ContentSection } from '@/app/(storefront)/products/[slug]/types/pdp'

export async function getProductDataForPDP(slug: string, storeId: string): Promise<ProductData | null> {
    // 1. Fetch Product with variants
    const { data: product, error: productError } = await supabase
        .from('products')
        .select(`
            *,
            urgency_settings,
            bundle_settings,
            cod_enabled,
            prepaid_discount_type,
            prepaid_discount_value,
            prepaid_offer_text,
            product_variants (
                id,
                title,
                price,
                mrp,
                inventory,
                is_default,
                status,
                unit_count
            )
        `)
        .eq('slug', slug)
        .eq('store_id', storeId)
        .eq('status', 'published')
        .single()

    if (productError || !product) {
        console.error('Error fetching product:', productError)
        return null
    }

    // 2. Map Media
    const media: MediaItem[] = (product.images || []).map((url: string, index: number) => ({
        id: `media_${index}`,
        type: 'image' as const,
        src: url,
        alt: `${product.title} image ${index + 1}`,
        aspectRatio: 'aspect-[4/5]'
    }))

    // 3. Map Highlights
    const highlights: ProductHighlight[] = (product.highlights || []).map((text: string, index: number) => ({
        id: `highlight_${index}`,
        text
    }))

    // 4. Map Bundles from variants
    const variants = product.product_variants || []
    const bundles: BundleOption[] = variants
        .filter((v: any) => v.status === 'active')
        .map((variant: any) => ({
            id: variant.id,
            unitCount: variant.unit_count || 1,
            sellingPrice: Number(variant.price),
            mrp: Number(variant.mrp || variant.price),
            savingsText: variant.mrp ? `Save ₹${Number(variant.mrp) - Number(variant.price)}` : undefined,
            badge: variant.is_default ? 'Best Value' : undefined
        }))

    // If no variants, create default bundle from product pricing
    if (bundles.length === 0) {
        bundles.push({
            id: 'default',
            unitCount: 1,
            sellingPrice: Number(product.price),
            mrp: Number(product.mrp || product.price),
            savingsText: product.mrp ? `Save ₹${Number(product.mrp) - Number(product.price)}` : undefined
        })
    }

    // 5. Map Reviews (Testimonials)
    const testimonials = product.testimonials || []
    const reviews: Review[] = testimonials.map((t: any, index: number) => ({
        id: `rev_${index}`,
        author: t.name || 'Anonymous',
        location: t.location || 'India',
        rating: Number(t.rating) || 5,
        date: 'Recently',
        content: t.quote || '',
        verified: !t.hidden
    }))

    // 6. Map Content Sections
    const content: ContentSection[] = [
        {
            id: 'desc',
            title: 'Description',
            content: product.content_markup || product.short_description || 'No description available.'
        }
    ]

    if (product.how_to_use) {
        content.push({ id: 'how_to', title: 'How to Use', content: product.how_to_use })
    }
    if (product.who_is_it_for) {
        content.push({ id: 'who_for', title: 'Who Is It For', content: product.who_is_it_for })
    }
    if (product.why_it_works) {
        content.push({ id: 'why', title: 'Why It Works', content: product.why_it_works })
    }

    // 7. Fetch Related Products
    const { data: relatedData } = await supabase
        .from('products')
        .select('id, slug, title, images, price, mrp')
        .eq('store_id', storeId)
        .eq('status', 'published')
        .neq('id', product.id)
        .limit(4)

    const relatedProducts = (relatedData || []).map((p: any) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        image: p.images?.[0] || '',
        price: Number(p.price),
        mrp: Number(p.mrp || p.price)
    }))

    return {
        id: product.id,
        slug: product.slug,
        title: product.title,
        subtitle: product.subtitle || product.short_description || '',
        rating: Number(product.rating) || 4.5,
        reviewCount: product.review_count || 0,
        media,
        highlights,
        pricing: {
            mrp: Number(product.mrp || product.price),
            sellingPrice: Number(product.price),
            discountDetails: {
                percentageOff: product.mrp ? Math.round(((Number(product.mrp) - Number(product.price)) / Number(product.mrp)) * 100) : 0,
                savingsAmount: product.mrp ? Number(product.mrp) - Number(product.price) : 0
            },
            prepaid: product.prepaid_discount_value ? {
                type: product.prepaid_discount_type || 'flat',
                value: Number(product.prepaid_discount_value),
                offerText: product.prepaid_offer_text,
                calculatedSavings: product.prepaid_discount_type === 'percentage'
                    ? Math.round((Number(product.price) * Number(product.prepaid_discount_value)) / 100)
                    : Number(product.prepaid_discount_value)
            } : undefined
        },
        urgency_settings: product.urgency_settings || undefined,
        bundle_settings: product.bundle_settings || undefined,
        cod_enabled: product.cod_enabled ?? true,
        bundles,
        reviews: {
            summary: {
                averageRating: Number(product.rating) || 4.5,
                totalReviews: product.review_count || 0
            },
            featured: reviews.slice(0, 5)
        },
        content,
        relatedProducts
    }
}
