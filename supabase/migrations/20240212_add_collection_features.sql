-- Migration: Add dynamic collection fields
-- 1. Add columns to collections table
ALTER TABLE "public"."collections" 
ADD COLUMN IF NOT EXISTS "is_featured" BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS "source_type" TEXT DEFAULT 'manual',
ADD COLUMN IF NOT EXISTS "automated_settings" JSONB DEFAULT '{}'::jsonb;

-- 2. Add an index for faster lookups of featured collections
CREATE INDEX IF NOT EXISTS "collections_is_featured_idx" ON "public"."collections" ("is_featured") WHERE "is_featured" = true;

-- 3. Ensure every store has a 'Featured' collection (Manual check/creation will be handled in a script)
-- However, we can set a constraint that there's at most one featured collection per store
CREATE UNIQUE INDEX IF NOT EXISTS "unique_featured_collection_per_store" 
ON "public"."collections" ("store_id") 
WHERE ("is_featured" = true);
