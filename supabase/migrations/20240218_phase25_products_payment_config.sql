-- Phase 25: Product Level Payment Configs
-- 1. Add columns to products table to override store settings

DO $$
BEGIN
    -- COD
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'cod_enabled') THEN
        ALTER TABLE products ADD COLUMN cod_enabled BOOLEAN DEFAULT TRUE;
    END IF;

    -- Prepaid
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'prepaid_enabled') THEN
        ALTER TABLE products ADD COLUMN prepaid_enabled BOOLEAN DEFAULT TRUE;
    END IF;

    -- Cart
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'cart_button_enabled') THEN
        ALTER TABLE products ADD COLUMN cart_button_enabled BOOLEAN DEFAULT TRUE;
    END IF;

    -- Use Store Settings (Override Flag)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'use_store_payment_settings') THEN
        ALTER TABLE products ADD COLUMN use_store_payment_settings BOOLEAN DEFAULT TRUE;
    END IF;
END $$;
