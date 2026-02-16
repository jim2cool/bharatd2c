-- Update products.images from text[] to jsonb
-- We want to map ['url1', 'url2'] to [{ "url": "url1", "tier": "tier1" }, { "url": "url2", "tier": "tier1" }]

-- 1. Create a temporary column
ALTER TABLE products ADD COLUMN images_new jsonb DEFAULT '[]'::jsonb;

-- 2. Populate the temporary column from the old one
UPDATE products 
SET images_new = (
    SELECT jsonb_agg(jsonb_build_object('url', imm, 'tier', 'tier1'))
    FROM unnest(images) as imm
)
WHERE images IS NOT NULL AND array_length(images, 1) > 0;

-- 3. Drop the old column and rename the new one
ALTER TABLE products DROP COLUMN images;
ALTER TABLE products RENAME COLUMN images_new TO images;

-- 4. Do the same for variants if they have images (checking schema again...)
-- Looking at list_tables, variants don't have images, but product_variants might not have it either.
-- Wait, let me double check product_variants columns from previous list_tables output.
-- product_variants: id, product_id, title, price, mrp, sku, inventory, is_default, status, created_at, unit_count, attributes, location, cogs.
-- No images column in product_variants.
