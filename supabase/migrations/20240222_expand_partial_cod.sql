-- Phase 26: Expanded Partial COD Configuration
-- Adds support for store-wide and product-level partial COD with weight-based and percentage settings.

DO $$
BEGIN
    -- 1. Update Stores Table
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'stores' AND column_name = 'partial_cod_config') THEN
        ALTER TABLE public.stores ADD COLUMN partial_cod_config JSONB DEFAULT '{
            "enabled": false,
            "method": "percentage",
            "percentage_value": 10,
            "shipping_rates": {
                "0_500": 60,
                "501_1000": 90,
                "1001_1500": 120,
                "1501_plus": 180
            }
        }'::jsonb;
    END IF;

    -- 2. Update Products Table
    -- Weight in grams
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'weight_grams') THEN
        ALTER TABLE public.products ADD COLUMN weight_grams INTEGER DEFAULT 500;
    END IF;

    -- Partial COD Enable Flag (Override)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'partial_cod_enabled') THEN
        ALTER TABLE public.products ADD COLUMN partial_cod_enabled BOOLEAN DEFAULT FALSE;
    END IF;

    -- Use Store Settings Flag
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'use_store_partial_settings') THEN
        ALTER TABLE public.products ADD COLUMN use_store_partial_settings BOOLEAN DEFAULT TRUE;
    END IF;

END $$;
