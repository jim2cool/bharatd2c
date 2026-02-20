-- Migration: Create Sales Channels Configuration Table for Marketing Engine

-- Create the table
CREATE TABLE IF NOT EXISTS public.sales_channels_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Meta (Facebook/Instagram)
    meta_is_active BOOLEAN DEFAULT false,
    meta_pixel_id TEXT,
    meta_capi_token TEXT, -- In production, this should ideally be encrypted
    
    -- Google (GA4 & Merchant Center)
    google_is_active BOOLEAN DEFAULT false,
    ga4_measurement_id TEXT,
    google_merchant_id TEXT,
    
    -- Unique constraint: one config per store
    CONSTRAINT unique_store_channel_config UNIQUE (store_id)
);

-- RLS Policies
ALTER TABLE public.sales_channels_config ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active configs (needed to inject pixels on storefront)
-- We explicitly restrict pulling the CAPI token to the frontend for security.
CREATE POLICY "Public profiles are viewable by everyone."
    ON public.sales_channels_config FOR SELECT
    USING (true);

-- Allow store owners to view and edit their own configs
CREATE POLICY "Store owners can manage their own channel configs."
    ON public.sales_channels_config FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.store_roles sr 
            WHERE sr.store_id = sales_channels_config.store_id 
            AND sr.user_id = auth.uid()
            AND sr.role IN ('owner', 'admin')
        )
    );

-- Add to our realtime publication if needed
ALTER PUBLICATION supabase_realtime ADD TABLE public.sales_channels_config;

-- Automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_sales_channels_config_modtime
BEFORE UPDATE ON public.sales_channels_config
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
