
-- SQL to add custom domain columns to stores table
ALTER TABLE stores 
ADD COLUMN IF NOT EXISTS custom_domain TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS custom_domain_status TEXT DEFAULT 'pending';

-- Create index for faster Caddy check lookups
CREATE INDEX IF NOT EXISTS idx_stores_custom_domain ON stores(custom_domain);
