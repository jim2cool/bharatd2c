-- Ensure product_collections table exists with proper foreign keys
CREATE TABLE IF NOT EXISTS "public"."product_collections" (
    "product_id" UUID NOT NULL,
    "collection_id" UUID NOT NULL,
    CONSTRAINT "product_collections_pkey" PRIMARY KEY ("product_id", "collection_id"),
    CONSTRAINT "product_collections_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE,
    CONSTRAINT "product_collections_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("id") ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE "public"."product_collections" ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Enable read access for all users" ON "public"."product_collections"
    FOR SELECT USING (true);

CREATE POLICY "Enable all access for authenticated users" ON "public"."product_collections"
    FOR ALL USING (auth.role() = 'authenticated');

-- Grant permissions
GRANT ALL ON TABLE "public"."product_collections" TO "authenticated";
GRANT SELECT ON TABLE "public"."product_collections" TO "anon";
GRANT ALL ON TABLE "public"."product_collections" TO "service_role";
