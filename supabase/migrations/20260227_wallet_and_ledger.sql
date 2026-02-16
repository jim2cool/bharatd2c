-- Operational Systems (Wallets / Credits)

-- 1. Create seller_wallets table
CREATE TABLE IF NOT EXISTS public.seller_wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    balance NUMERIC NOT NULL DEFAULT 0.00,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(store_id)
);

-- 2. Create ledger_entries table
CREATE TABLE IF NOT EXISTS public.ledger_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID NOT NULL REFERENCES public.seller_wallets(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'fee', 'refund', 'bonus', 'payment_gateway_settlement')),
    status VARCHAR(20) NOT NULL DEFAULT 'completed',
    description TEXT,
    reference_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Row Level Security Policies
ALTER TABLE public.seller_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ledger_entries ENABLE ROW LEVEL SECURITY;

-- Wallets read policy
CREATE POLICY "Store owners can read their wallets"
ON public.seller_wallets FOR SELECT
USING (store_id IN (SELECT id FROM public.stores WHERE owner_id = auth.uid()));

-- Ledger entries read policy
CREATE POLICY "Store owners can read their ledger entries"
ON public.ledger_entries FOR SELECT
USING (wallet_id IN (
    SELECT id FROM public.seller_wallets WHERE store_id IN (
        SELECT id FROM public.stores WHERE owner_id = auth.uid()
    )
));

-- Service role will handle inserts/updates for financial integrity
-- So no INSERT/UPDATE/DELETE policies for public or authenticated roles.

-- 4. Triggers for updated_at
CREATE OR REPLACE FUNCTION update_wallet_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_seller_wallets_modtime
BEFORE UPDATE ON public.seller_wallets
FOR EACH ROW EXECUTE PROCEDURE update_wallet_updated_at_column();
