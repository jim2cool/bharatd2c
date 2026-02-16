-- Phase 1: Payment Configuration Schema

CREATE TABLE IF NOT EXISTS public.store_payment_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL CHECK (provider IN ('razorpay', 'cashfree', 'payu', 'stripe')),
    api_key VARCHAR(255) NOT NULL,
    api_secret VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT false,
    environment VARCHAR(20) NOT NULL DEFAULT 'production' CHECK (environment IN ('sandbox', 'production')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(store_id, provider)
);

-- Row Level Security Policies
ALTER TABLE public.store_payment_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Store owners can manage their payment configs"
ON public.store_payment_configs FOR ALL
USING (store_id IN (SELECT id FROM public.stores WHERE owner_id = auth.uid()))
WITH CHECK (store_id IN (SELECT id FROM public.stores WHERE owner_id = auth.uid()));

-- Updated_at trigger
CREATE TRIGGER update_store_payment_configs_modtime
BEFORE UPDATE ON public.store_payment_configs
FOR EACH ROW EXECUTE PROCEDURE update_wallet_updated_at_column();
