import * as z from "zod";

export const configSchema = z.object({
    presetId: z.string().optional(),
    architecture: z.enum(['product_engine', 'story_first', 'catalog_first']),
    seller: z.object({
        urgencyLevel: z.enum(['none', 'low', 'medium', 'high']),
        socialProofWeight: z.enum(['light', 'medium', 'heavy']),
        trustDensity: z.enum(['light', 'medium', 'heavy']),
        ctaProminence: z.enum(['balanced', 'dominant']),
        densityScale: z.enum(['compact', 'balanced', 'airy']),
        codBias: z.boolean(),
    }),
    category: z.object({
        category: z.enum([
            'fashion', 'beauty', 'electronics', 'home', 'health', 'spiritual',
            'furniture', 'food', 'dropshipping', 'marketplace', 'multi',
            'jewellery', 'art', 'pets', 'baby', 'stationery',
            'automotive', 'sports', 'gardening', 'b2b',
            'digital', 'experience', 'renewed', 'consultation'
        ]),
        requiredModules: z.array(z.string()),
        optionalModules: z.array(z.string()),
        imageRatio: z.enum(['1:1', '4:5', '16:9']),
        variantSelectorType: z.enum(['swatch', 'dropdown', 'grid']),
    }),
    style: z.object({
        // G1 fix: must match ob_design_tokens.mood_card_name exactly (title case + spaces)
        id: z.enum([
            'Minimal', 'Bold', 'Heritage', 'Luxury', 'Organic', 'Fresh',
            'Professional', 'Serene', 'Gourmet', 'Sleek', 'Zen', 'Vibrant',
            'Playful', 'Industrial', 'Urban', 'Earth', 'Clinical', 'Quiet Luxury'
        ]),
        colors: z.any(),
        typography: z.any(),
        shape: z.any(),
        motion: z.any(),
    }),

    // BACKWARD COMPAT (FLAT FOR UI)
    colors: z.any(),
    brand: z.any(),
    typography: z.any(),
    shape: z.any(),
    density: z.any(),
    motion: z.any(),
    conversion: z.any(),
});
