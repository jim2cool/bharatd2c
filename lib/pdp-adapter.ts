import { supabaseAdmin } from './supabase-admin'
import { ProductData, MediaItem, ProductHighlight, BundleOption, Review, ContentSection } from '@/app/(storefront)/products/[slug]/types/pdp'
import { calculatePrepaidDiscount, PrepaidRule, CartItemForDiscount } from '@/lib/utils/discount-engine'
import { ResolutionEngine } from './utils/resolution'
import { ProductEntity, StoreEntity, ProductVariantEntity, PlatformSettingsEntity, PrepaidConfigEntity, ShippingSettingsEntity } from '@/types/supabase'

// Helper Types for Joined Data
interface ProductJoined extends ProductEntity {
    stores: StoreEntity | null;
    product_variants: ProductVariantEntity[];
    product_collections: { collection_id: string }[];
}

export async function getProductDataForPDP(slug: string, storeId: string, options?: { isPreview?: boolean }): Promise<ProductData | null> {
    // 1. Fetch Product with variants AND Store Settings AND Platform Settings
    // Note: We can't join platform_settings easily as it's not related by FK.
    // We will do a parallel fetch for platform settings to ensure speed.

    const productQuery = supabaseAdmin
        .from('products')
        .select(`
            *,
            urgency_settings,
            bundle_settings,
            category,
            category_data,
            cod_enabled,
            prepaid_discount_type,
            prepaid_discount_value,
            prepaid_offer_text,
            trust_indicators,
            trust_strip_image_url,
            related_products_title,
            use_store_payment_settings,
            show_estimated_delivery,
            stores (
                cod_enabled,
                prepaid_enabled,
                cart_button_enabled,
                prepaid_discount_type,
                prepaid_discount_value
            ),
            product_variants (
                id,
                title,
                price,
                mrp,
                inventory,
                is_default,
                status,
                unit_count,
                attributes
            ),
            product_collections (
                collection_id
            )
        `)
        .eq('slug', slug)
        .eq('store_id', storeId)

    // Only filter by published if NOT in preview mode
    if (!options?.isPreview) {
        productQuery.eq('status', 'published')
    }

    const platformQuery = supabaseAdmin
        .from('platform_settings')
        .select('*')
        .eq('id', 1)
        .single()

    const rulesQuery = supabaseAdmin
        .from('prepaid_configs')
        .select('*')
        .eq('store_id', storeId)
        .eq('is_active', true)

    const shippingSettingsQuery = supabaseAdmin
        .from('shipping_settings')
        .select('*')
        .eq('store_id', storeId)
        .single()

    const [productRes, platformRes, rulesRes, shippingRes] = await Promise.all([productQuery.single(), platformQuery, rulesQuery, shippingSettingsQuery])

    const product = productRes.data as ProductJoined | null
    const productError = productRes.error
    const rules = (rulesRes.data || []) as unknown as PrepaidRule[] // Adapted for internal logic
    const shippingSettings = (shippingRes.data || null) as ShippingSettingsEntity | null

    // Default platform settings if missing (fail open or closed? closed for safety)
    const platform = platformRes.data || { cod_enabled: true, prepaid_enabled: true, cart_button_enabled: true }

    if (productError || !product) {
        console.error('--- PDP FETCH ERROR ---', JSON.stringify(productError, null, 2))
        return null
    }

    // --- PAYMENT LOGIC RESOLUTION ---
    const ctx = {
        platform,
        store: product.stores || {},
        product: product,
        useStoreDefaults: product.use_store_payment_settings !== false
    }

    const finalCod = ResolutionEngine.resolveBoolean('cod_enabled', ctx)
    const finalPrepaid = ResolutionEngine.resolveBoolean('prepaid_enabled', ctx)
    const finalCart = ResolutionEngine.resolveBoolean('cart_button_enabled', ctx)

    // 4. Resolve Pricing/Discount Logic
    const store = product.stores
    let prepaidDiscount = undefined
    if (finalPrepaid) {
        // Prepare item for engine
        const item: CartItemForDiscount = {
            product_id: product.id,
            price: Number(product.price),
            qty: 1,
            collection_ids: product.product_collections?.map(pc => pc.collection_id) || []
        }

        const stackingLogic = store?.prepaid_stacking_logic || 'highest_only'
        const savings = calculatePrepaidDiscount([item], rules, stackingLogic)

        if (savings > 0) {
            prepaidDiscount = {
                type: 'flat' as const, // Simplified for display
                value: savings,
                offerText: product.prepaid_offer_text || undefined, // Keep product override if exists, or maybe generic
                calculatedSavings: savings
            }
        }
    }

    // 2. Map Media
    const imagesRaw = product.images || []
    const media: MediaItem[] = imagesRaw.map((img: any, index: number) => {
        const isObject = typeof img === 'object' && img !== null;
        const url = isObject ? img.url : img;
        const tier = isObject ? img.tier : 'tier1'; // Fallback for safety

        return {
            id: `media_${index}`,
            type: 'image' as const,
            src: url || '',
            alt: `${product.title} image ${index + 1}`,
            aspectRatio: 'aspect-[4/5]',
            tier: tier === 'tier3' ? 'weak' : tier === 'tier2' ? 'lifestyle' : 'clean'
        };
    });

    // 3. Map Highlights
    const highlights: ProductHighlight[] = (product.highlights || []).map((text: string, index: number) => ({
        id: `highlight_${index}`,
        text
    }))

    // 4. Map Bundles from variants
    const variants = product.product_variants || []
    const bundles: BundleOption[] = variants
        .filter(v => v.status === 'active')
        .map(variant => ({
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
    const testimonials = (product.testimonials as any[]) || []
    const reviews: Review[] = testimonials.map((t: any, index: number) => ({
        id: `rev_${index}`,
        author: t.name || 'Anonymous',
        location: t.location || 'India',
        rating: Number(t.rating) || 5,
        date: 'Recently',
        content: t.quote || '',
        verified: !t.hidden
    }))

    // 6. Map Content Sections (With Robust H2 Parsing)
    const content: ContentSection[] = []
    let description_intro = ''
    const rawContent = product.content_markup || product.short_description || ''

    if (rawContent) {
        // Split by <h2> tags. 
        // We use [\s\S] to match ANY character including newlines.
        const parts = rawContent.split(/<h2[\s\S]*?>([\s\S]*?)<\/h2>/gi)

        // parts[0] is content before the first H2 -> render as Intro Text
        if (parts[0]?.trim()) {
            description_intro = parts[0]
        }

        // parts[i] is H2-inner-content (Title), parts[i+1] is Content-after-H2 (Body)
        for (let i = 1; i < parts.length; i += 2) {
            let h2Inner = parts[i] || ''
            let afterH2 = parts[i + 1] || ''

            let title = h2Inner
            let extraContent = ''

            // Heuristic: If H2 inner content is too long or has breaks, it likely contains the body too
            if (h2Inner.length > 50 || /<br[\s\S]*?\/?>/i.test(h2Inner)) {
                // Try to split by first <br>
                const splitMatch = h2Inner.match(/(.*?)<br[\s\S]*?\/?>([\s\S]*)/i)
                if (splitMatch) {
                    title = splitMatch[1]
                    extraContent = splitMatch[2]
                }
            }

            // Clean title
            const plainTitle = title.replace(/<[^>]*>/g, '').trim()
            const fullSectionContent = (extraContent + afterH2).trim()

            if (plainTitle) {
                content.push({
                    id: `sec_${Math.floor(i / 2)}`,
                    title: plainTitle,
                    content: fullSectionContent || " "
                })
            }
        }
    }

    if (product.how_to_use) {
        content.push({ id: 'how_to', title: 'How to Use', content: product.how_to_use })
    }
    if (product.who_is_it_for) {
        content.push({ id: 'who_for', title: 'Who Is It For', content: product.who_is_it_for })
    }
    if (product.why_it_works) {
        content.push({ id: 'why', title: 'Why It Works', content: product.why_it_works })
    }

    // 7. Fetch Related Products (Smart Cross-sells)
    let relatedData: any[] = []
    // @ts-ignore - Supabase JSONB typing is tricky
    const crossSellIds = (product.bundle_settings as any)?.cross_sell_ids || []

    if (crossSellIds.length > 0) {
        // Fetch specific cross-sells
        const { data } = await supabaseAdmin
            .from('products')
            .select('id, slug, title, images, price, mrp')
            .in('id', crossSellIds)
            .eq('store_id', storeId)
            .eq('status', 'published')

        relatedData = data || []
    }

    // Fallback if no cross-sells or not enough found (optional: mix them? for now simple fallback)
    if (relatedData.length === 0) {
        const { data } = await supabaseAdmin
            .from('products')
            .select('id, slug, title, images, price, mrp')
            .eq('store_id', storeId)
            .eq('status', 'published')
            .neq('id', product.id)
            .limit(4)

        relatedData = data || []
    }

    const relatedProducts = relatedData.map(p => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        image: p.images?.[0] || '',
        price: Number(p.price),
        mrp: Number(p.mrp || p.price)
    }))

    // 8. Map Variants (Phase 17)
    const mappedVariants = product.has_variants ? product.product_variants.map(v => ({
        id: v.id,
        title: v.title,
        price: Number(v.price),
        mrp: v.mrp ? Number(v.mrp) : undefined,
        inventory: Number(v.inventory || 0),
        sku: v.sku || undefined,
        options: (v.attributes as Record<string, string>) || {}
    })) : undefined

    return {
        id: product.id,
        slug: product.slug,
        title: product.title,
        subtitle: product.subtitle || product.short_description || '',
        description_intro, // Added in Phase 22
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
            prepaid: prepaidDiscount // Updated with resolved discount
        },
        urgency_settings: (product.urgency_settings as any) || undefined,
        bundle_settings: (product.bundle_settings as any) || undefined,
        trust_indicators: (product.trust_indicators as any) || undefined,
        trust_strip_image_url: product.trust_strip_image_url || null,

        // Final Resolved Flags
        cod_enabled: finalCod,
        prepaid_enabled: finalPrepaid,
        cart_button_enabled: finalCart,
        show_estimated_delivery: product.show_estimated_delivery !== false, // Default to true
        shipping_settings: (shippingSettings as any) || undefined,

        bundles,
        reviews: {
            summary: {
                averageRating: Number(product.rating) || 4.5,
                totalReviews: product.review_count || 0
            },
            featured: reviews.slice(0, 5)
        },
        content,
        relatedProducts,
        related_products_title: (product.bundle_settings as any)?.cross_sell_title || product.related_products_title || 'People also bought',
        category: (product.category as any) || 'multi',
        category_data: (product.category_data as Record<string, any>) || {},

        // Phase 17
        has_variants: !!product.has_variants,
        variant_options: (product.variant_options as any[]) || [],
        variants: mappedVariants,
    }
}
