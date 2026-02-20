import * as z from "zod";

export const configSchema = z.object({
    presetId: z.string().optional(),
    architecture: z.enum(['product-engine', 'story-first', 'catalog-first']),
    seller: z.object({
        urgencyLevel: z.enum(['low', 'medium', 'high']),
        socialProofWeight: z.enum(['light', 'medium', 'heavy']),
        trustDensity: z.enum(['light', 'medium', 'heavy']),
        ctaProminence: z.enum(['balanced', 'dominant']),
        densityScale: z.enum(['compact', 'balanced', 'airy']),
        codBias: z.boolean(),
    }),
    category: z.object({
        category: z.enum(['fashion', 'beauty', 'electronics', 'home', 'health', 'spiritual', 'furniture', 'food', 'dropshipping', 'marketplace', 'multi']),
        requiredModules: z.array(z.string()),
        optionalModules: z.array(z.string()),
        imageRatio: z.enum(['1:1', '4:5', '16:9']),
        variantSelectorType: z.enum(['swatch', 'dropdown', 'grid']),
    }),
    style: z.object({
        id: z.enum(["marketplace", "minimal", "bold", "organic", "tech", "premium", "feminine", "gen-z", "cro"]),
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
