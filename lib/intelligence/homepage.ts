import { supabase } from "@/lib/supabase-public";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getDummyCopy, getDummyAssets } from "./dummyContent";

// ─── Types ───────────────────────────────────────────────────────────────────
export type HomepageBlock = {
    id: string;
    block_type: string;    // canonical (spec compliant)
    position: number;
    config: Record<string, any>;
    is_locked: boolean;
    // legacy aliases — renderer accepts both
    type?: string;
    order?: number;
};

// ─── Template Definitions ─────────────────────────────────────────────────────
// Maps to the 14 valid block types from pg_homepage_block_types.
// Templates are keyed by commerce_architecture value.

function block(
    id: string,
    block_type: string,
    position: number,
    config: Record<string, any>,
    is_locked = false
): HomepageBlock {
    return { id, block_type, type: block_type, position, order: position, config, is_locked };
}

export const HOMEPAGE_TEMPLATES: Record<string, HomepageBlock[]> = {
    // Template 1 — Product-first: single-product or hero-driven stores
    product_hero_trust: [
        block('hero_banner', 'hero', 0, {
            title: 'Handcrafted for India',
            subtitle: 'Quality you can trust, delivered to your door',
            show_cta: true,
            cta_text: 'Shop Now',
            cta_url: '/collections',
        }, true),
        block('trust_strip_1', 'trust_strip', 1, {
            items: ['Free Delivery', 'Easy Returns', 'Secure Payments'],
        }, true),
        block('featured_col', 'featured_collection', 2, {
            title: 'Best Sellers',
            limit: 4,
            layout: 'grid',
        }),
        block('social_proof_1', 'social_proof', 3, {
            headline: '10,000+ happy customers',
            show_rating: true,
        }),
        block('newsletter_1', 'newsletter', 4, {
            title: 'Get exclusive offers',
            placeholder: 'Enter your email',
            cta_text: 'Subscribe',
        }),
    ],

    // Template 2 — Story-first: artisan, handmade, heritage brands
    story_brand_narrative: [
        block('hero_banner', 'hero', 0, {
            title: 'Born from Passion',
            subtitle: 'Every product tells a story of craft and care',
            show_cta: true,
            cta_text: 'Discover Our Story',
            cta_url: '/pages/about',
        }, true),
        block('story_block_1', 'image_with_text', 1, {
            title: 'Our Story',
            content: 'Born from passion, built with care. We believe in products that last generations.',
            image_position: 'right',
        }),
        block('featured_col', 'featured_collection', 2, {
            title: 'Crafted for You',
            limit: 4,
        }),
        block('testimonial_1', 'testimonial_carousel', 3, {
            title: 'What Customers Say',
        }),
        block('trust_strip_1', 'trust_strip', 4, {
            items: ['Ethically Sourced', 'Handcrafted', 'Traditional Methods'],
        }),
    ],

    // Template 3 — Catalog-first: multi-category, browse-driven stores
    collection_curator: [
        block('hero_banner', 'hero', 0, {
            title: 'Explore Our Collections',
            subtitle: 'Everything you need, curated with care',
            show_cta: true,
            cta_text: 'Browse All',
            cta_url: '/collections',
        }, true),
        block('category_pills_1', 'category_pills', 1, {
            title: 'Shop by Category',
        }),
        block('collection_grid_1', 'collection_grid', 2, {
            title: 'Browse by Category',
            columns: 3,
        }),
        block('product_carousel_1', 'product_carousel', 3, {
            title: 'Trending Now',
            limit: 8,
        }),
        block('trust_strip_1', 'trust_strip', 4, {
            items: ['100+ Brands', 'Free Shipping', 'Easy Returns'],
        }),
    ],

    // Template 4 — Deal-first: price-driven, high-volume stores
    deal_engine: [
        block('announcement_1', 'announcement_banner', 0, {
            text: 'Limited Time Offer — Ends Tonight!',
            bg_colour: 'var(--urgency-bg)',
            text_colour: 'var(--urgency-text)',
        }, true),
        block('hero_banner', 'hero', 1, {
            title: 'Exclusive Deals. Every Day.',
            subtitle: 'Limited time offers on top products',
            show_cta: true,
            cta_text: 'Shop the Sale',
            cta_url: '/collections',
        }, true),
        block('countdown_1', 'countdown_timer', 2, {
            end_date: '2026-12-31',
            label: 'Offer ends in',
        }),
        block('featured_col', 'featured_collection', 3, {
            title: 'Flash Sale',
            limit: 8,
            layout: 'grid',
        }),
        block('social_proof_1', 'social_proof', 4, {
            headline: 'Trusted by 50,000+ shoppers',
            show_rating: true,
        }),
    ],

    // Template 5 — Clean aesthetic: premium, minimal stores
    clean_aesthetic: [
        block('hero_banner', 'hero', 0, {
            title: 'Pure Quality',
            subtitle: 'Thoughtfully designed for everyday life',
            show_cta: true,
            cta_text: 'Shop Collection',
            cta_url: '/collections',
            variant: 'minimal',
        }, true),
        block('featured_col', 'featured_collection', 1, {
            title: 'New Arrivals',
            limit: 4,
            layout: 'grid',
            variant: 'minimal',
        }),
        block('image_text_1', 'image_with_text', 2, {
            title: 'Our Promise',
            content: 'Every product is selected for quality, sustainability, and lasting value.',
            image_position: 'left',
        }),
        block('newsletter_1', 'newsletter', 3, {
            title: 'Join Our Community',
            placeholder: 'Your email address',
            cta_text: 'Join',
        }),
    ],
};

// ─── Template Selector ────────────────────────────────────────────────────────
export function getDefaultHomepageSections(
    archetypeCluster?: string,
    commerceArchitecture?: string
): HomepageBlock[] {
    // Map archetype_cluster → template key
    const byArchetype: Record<string, string> = {
        catalog_first: 'collection_curator',
        story_first: 'story_brand_narrative',
        deal_first: 'deal_engine',
        minimal_premium: 'clean_aesthetic',
        product_engine: 'product_hero_trust',
        single_product: 'product_hero_trust',
        // Legacy values from earlier versions
        catalog_curator: 'collection_curator',
        narrative_brand: 'story_brand_narrative',
    };

    // Commerce architecture can override
    const byArchitecture: Record<string, string> = {
        catalog: 'collection_curator',
        story: 'story_brand_narrative',
        deal: 'deal_engine',
        minimal: 'clean_aesthetic',
    };

    const key = byArchetype[archetypeCluster || '']
        || byArchitecture[commerceArchitecture || '']
        || 'product_hero_trust';

    return HOMEPAGE_TEMPLATES[key] || HOMEPAGE_TEMPLATES.product_hero_trust;
}

// ─── Initialise Store Pages ───────────────────────────────────────────────────
export async function initialise_store_pages(
    storeId: string,
    archetypeOrArchitecture?: string
) {
    // 1. Check if homepage already exists
    const { data: existingPage } = await supabase
        .from('pg_store_pages')
        .select('id, homepage_sections')
        .eq('store_id', storeId)
        .or('slug.eq.index,page_type.eq.home')
        .maybeSingle();

    // If exists but sections are empty, backfill them
    if (existingPage) {
        const sections = existingPage.homepage_sections;
        const isEmpty = !sections || (Array.isArray(sections) && sections.length === 0);
        if (isEmpty) {
            const defaultSections = await buildSections(storeId, archetypeOrArchitecture);
            const client = supabaseAdmin || supabase;
            await client
                .from('pg_store_pages')
                .update({ homepage_sections: defaultSections })
                .eq('id', existingPage.id);
        }
        return existingPage.id;
    }

    // 2. Build sections with dummy copy
    const defaultSections = await buildSections(storeId, archetypeOrArchitecture);

    // 3. Insert homepage row
    const client = supabaseAdmin || supabase;
    const { data: newPage, error } = await client
        .from('pg_store_pages')
        .insert({
            store_id: storeId,
            slug: 'index',
            page_type: 'home',
            title: 'Home',
            homepage_sections: defaultSections,
            status: 'published',
        })
        .select()
        .single();

    if (error) {
        console.error('[homepage] Error seeding homepage:', {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint
        });
        return null;
    }

    // 4. Seed basic policy pages (only if they don't exist)
    const policies = [
        { slug: 'shipping-policy', title: 'Shipping Policy', page_type: 'policy', content: getDefaultPolicy('shipping') },
        { slug: 'refund-policy', title: 'Return & Refund Policy', page_type: 'policy', content: getDefaultPolicy('refund') },
        { slug: 'terms-and-conditions', title: 'Terms & Conditions', page_type: 'policy', content: getDefaultPolicy('terms') },
        { slug: 'privacy-policy', title: 'Privacy Policy', page_type: 'policy', content: getDefaultPolicy('privacy') },
    ];

    for (const policy of policies) {
        const { data: existing } = await supabase
            .from('pg_store_pages')
            .select('id')
            .eq('store_id', storeId)
            .eq('slug', policy.slug)
            .maybeSingle();

        if (!existing) {
            await supabase.from('pg_store_pages').insert({
                store_id: storeId,
                slug: policy.slug,
                page_type: policy.page_type,
                title: policy.title,
                content: policy.content,
                status: 'published',
                is_active: true,
                show_in_nav: false,
            });
        }
    }

    return newPage.id;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export async function buildSections(
    storeId: string,
    archetypeOrArchitecture?: string
): Promise<HomepageBlock[]> {
    // 1. Fetch Profile for context
    const client = supabaseAdmin || supabase;
    const { data: profile } = await client
        .from('ob_seller_profiles')
        .select('*')
        .eq('store_id', storeId)
        .maybeSingle();

    const category = profile?.primary_category || archetypeOrArchitecture || 'generic';
    const cluster = profile?.archetype_cluster || archetypeOrArchitecture;

    const copy = getDummyCopy(category);
    const assets = getDummyAssets(category);

    // Merge AI seeds if available
    const seeds = profile?.content_seeds || {};
    const finalHeroTitle = seeds.hero_headline || copy.hero_title;
    const finalHeroImage = seeds.hero_image || assets[0] || '';

    const sections = getDefaultHomepageSections(cluster, archetypeOrArchitecture);

    return sections.map(section => {
        if (section.block_type === 'hero') {
            return {
                ...section,
                config: {
                    ...section.config,
                    title: finalHeroTitle || section.config.title,
                    subtitle: copy.hero_subtitle || section.config.subtitle,
                    image_url: finalHeroImage,
                },
            };
        }
        if (section.block_type === 'trust_strip') {
            return {
                ...section,
                config: {
                    ...section.config,
                    items: [copy.usp_1, copy.usp_2, copy.usp_3].filter(Boolean).length > 0
                        ? [copy.usp_1, copy.usp_2, copy.usp_3].filter(Boolean)
                        : section.config.items,
                },
            };
        }
        if (section.block_type === 'image_with_text' || section.block_type === 'story_block') {
            return {
                ...section,
                config: {
                    ...section.config,
                    image_url: assets[1] || assets[0],
                }
            }
        }
        return section;
    });
}

function getDefaultPolicy(type: 'shipping' | 'refund' | 'terms' | 'privacy'): string {
    const policies: Record<string, string> = {
        shipping: '## Shipping Policy\n\nWe ship across India within 5-7 business days. Express delivery is available in select cities.\n\n## Free Shipping\n\nOrders above ₹499 qualify for free standard shipping.',
        refund: '## Return & Refund Policy\n\nWe accept returns within 7 days of delivery for damaged or defective products. Please contact us with your order number and photos.\n\n## Refunds\n\nApproved refunds are processed within 5-7 business days.',
        terms: '## Terms & Conditions\n\nBy using our store, you agree to these terms. All prices are in Indian Rupees and inclusive of applicable taxes.\n\n## Orders\n\nAll orders are subject to availability. We reserve the right to cancel orders in case of pricing errors.',
        privacy: '## Privacy Policy\n\nWe collect your name, email, phone number, and address to process your orders. We do not sell your data to third parties.\n\n## Cookies\n\nWe use cookies to improve your shopping experience.',
    };
    return policies[type];
}
