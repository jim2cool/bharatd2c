-- Phase 24: Robust Prepaid Discounts
-- 1. Create Enum for Rule Scope
DO $$ BEGIN
    CREATE TYPE prepaid_scope AS ENUM ('store', 'collection', 'product');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create Prepaid Configs Table
CREATE TABLE IF NOT EXISTS prepaid_configs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    scope prepaid_scope NOT NULL,
    scope_id UUID, -- Null if scope is 'store'
    type TEXT NOT NULL CHECK (type IN ('flat', 'percentage')),
    value NUMERIC NOT NULL CHECK (value >= 0),
    min_order_value NUMERIC DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    priority INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Add Stacking Logic to Stores
ALTER TABLE stores 
ADD COLUMN IF NOT EXISTS prepaid_stacking_logic TEXT DEFAULT 'highest_only' 
CHECK (prepaid_stacking_logic IN ('highest_only', 'stack_all'));

-- 4. Enable RLS
ALTER TABLE prepaid_configs ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
CREATE POLICY "Public Read Access" ON prepaid_configs
    FOR SELECT USING (true);

CREATE POLICY "Authenticated Insert" ON prepaid_configs
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated Update" ON prepaid_configs
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated Delete" ON prepaid_configs
    FOR DELETE USING (auth.role() = 'authenticated');

-- 6. Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_prepaid_store ON prepaid_configs(store_id);
CREATE INDEX IF NOT EXISTS idx_prepaid_scope ON prepaid_configs(scope, scope_id);
