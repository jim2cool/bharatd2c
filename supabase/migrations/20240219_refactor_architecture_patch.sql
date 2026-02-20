-- Migration: Patch legacy theme_config data to support 4-layer architecture
-- This script safely updates the theme_config JSONB column on all stores

UPDATE stores
SET theme_config = jsonb_build_object(
    'architecture', COALESCE(theme_config->>'architecture', 'product-engine'),
    'presetId', COALESCE(theme_config->>'presetId', 'custom'),
    'seller', jsonb_build_object(
        'urgencyLevel', COALESCE(theme_config->'seller'->>'urgencyLevel', 'medium'),
        'socialProofWeight', COALESCE(theme_config->'seller'->>'socialProofWeight', 'medium'),
        'trustDensity', COALESCE(theme_config->'seller'->>'trustDensity', 'medium'),
        'ctaProminence', COALESCE(theme_config->'seller'->>'ctaProminence', 'balanced'),
        'densityScale', COALESCE(theme_config->'seller'->>'densityScale', 'balanced'),
        'codBias', COALESCE((theme_config->'seller'->>'codBias')::boolean, true)
    ),
    'category', jsonb_build_object(
        'category', COALESCE(theme_config->'category'->>'category', 'multi'),
        'requiredModules', COALESCE(theme_config->'category'->'requiredModules', '[]'::jsonb),
        'optionalModules', COALESCE(theme_config->'category'->'optionalModules', '[]'::jsonb),
        'imageRatio', COALESCE(theme_config->'category'->>'imageRatio', '1:1'),
        'variantSelectorType', COALESCE(theme_config->'category'->>'variantSelectorType', 'dropdown')
    ),
    'style', jsonb_build_object(
        'id', COALESCE(theme_config->'style'->>'id', 'minimal'),
        'colors', COALESCE(theme_config->'style'->'colors', theme_config->'colors', '{"primary": "#111111", "background": "#ffffff"}'::jsonb),
        'typography', COALESCE(theme_config->'style'->'typography', theme_config->'typography', '{"headingFont": "Inter", "bodyFont": "Inter"}'::jsonb),
        'shape', COALESCE(theme_config->'style'->'shape', theme_config->'shape', '{"radiusScale": "clean"}'::jsonb),
        'motion', COALESCE(theme_config->'style'->'motion', theme_config->'motion', '{"intensity": "normal"}'::jsonb)
    ),
    -- Keep flat fields for backward compatibility
    'colors', COALESCE(theme_config->'colors', '{"primary": "#111111", "background": "#ffffff"}'::jsonb),
    'brand', COALESCE(theme_config->'brand', '{"gradientStyle": "none", "darkMode": false}'::jsonb),
    'typography', COALESCE(theme_config->'typography', '{"headingFont": "Inter", "bodyFont": "Inter"}'::jsonb),
    'shape', COALESCE(theme_config->'shape', '{"radiusScale": "clean"}'::jsonb),
    'density', COALESCE(theme_config->'density', '{"scale": "balanced"}'::jsonb),
    'motion', COALESCE(theme_config->'motion', '{"enabled": true}'::jsonb),
    'conversion', COALESCE(theme_config->'conversion', '{"ctaProminence": "balanced"}'::jsonb)
)
WHERE theme_config IS NOT NULL;
