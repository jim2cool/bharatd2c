import { supabase } from "@/lib/supabase-public";

/* ======================================================
   PRODUCTS (HOMEPAGE)
   ====================================================== */
/* ======================================================
   PRODUCTS (HOMEPAGE)
   ====================================================== */
export async function getProducts(storeId: string, limit = 8) {
  // Try to find the featured collection first
  const { data: featuredCol } = await supabase
    .from("collections")
    .select("slug, source_type")
    .eq("store_id", storeId)
    .eq("is_featured", true)
    .single();

  if (featuredCol) {
    const { products } = await getProductsByCollection(
      storeId,
      featuredCol.slug,
      1,
      limit,
      "newest"
    );
    if (products && products.length > 0) return products;
  }

  // Fallback to latest products if no featured collection or it's empty
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("store_id", storeId)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getProducts error:", error);
    return [];
  }

  return data ?? [];
}

/* ======================================================
   PRODUCTS (ALL) — PAGINATED
   ====================================================== */
export async function getProductsPaginated(
  storeId: string,
  page: number,
  pageSize: number,
  sort: string
) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("products")
    .select("*", { count: "exact" })
    .eq("store_id", storeId)
    .eq("status", "published");

  if (sort === "price_asc") {
    query = query
      .not("price", "is", null)
      .order("price", { ascending: true });
  } else if (sort === "price_desc") {
    query = query
      .not("price", "is", null)
      .order("price", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error("getProductsPaginated error:", error);
    return { products: [], total: 0 };
  }

  return {
    products: data ?? [],
    total: count ?? 0,
  };
}

/* ======================================================
   PRODUCTS BY COLLECTION — PAGINATED
   ====================================================== */
/* ======================================================
   PRODUCTS BY COLLECTION — PAGINATED
   ====================================================== */
export async function getProductsByCollection(
  storeId: string,
  slug: string,
  page: number,
  pageSize: number,
  sort: string,
  filters?: { minPrice?: number; maxPrice?: number; inStock?: boolean; subcategories?: string[] }
) {
  // 1. Fetch collection metadata to check source type
  const { data: collectionContent, error: collectionError } = await supabase
    .from("collections")
    .select("*")
    .eq("store_id", storeId)
    .eq("slug", slug)
    .single();

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("products")
    .select("*, product_variants!inner(inventory)", { count: "exact" }) // Join to check stock if needed
    .eq("store_id", storeId)
    .eq("status", "published");

  // 1.5 Apply Filters
  if (filters?.minPrice !== undefined) query = query.gte("price", filters.minPrice);
  if (filters?.maxPrice !== undefined) query = query.lte("price", filters.maxPrice);
  if (filters?.inStock) query = query.gt("product_variants.inventory", 0);
  if (filters?.subcategories && filters.subcategories.length > 0) {
    // Simplified subcategory filtering - assuming category slug matches
    query = query.in("category", filters.subcategories);
  }

  // 2. Apply Dynamic Source Logic
  if (collectionContent?.source_type === 'latest') {
    query = query.order("created_at", { ascending: false });
  } else if (collectionContent?.source_type === 'best_selling') {
    query = query.order("rating", { ascending: false, nullsFirst: false });
  } else {
    // Default or Manual: Use the slug array filter
    query = query.contains("collection_slug", [slug]);
  }

  // 3. Apply Pagination Sort (if manual or not already sorted)
  if (!collectionContent?.source_type || collectionContent.source_type === 'manual') {
    if (sort === "price_asc") {
      query = query
        .not("price", "is", null)
        .order("price", { ascending: true });
    } else if (sort === "price_desc") {
      query = query
        .not("price", "is", null)
        .order("price", { ascending: false });
    } else if (sort === "newest") {
      query = query.order("created_at", { ascending: false });
    }
  }

  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error("getProductsByCollection error:", error);
    return { products: [], total: 0 };
  }

  return {
    products: data ?? [],
    total: count ?? 0,
  };
}

/* ======================================================
   SINGLE PRODUCT BY SLUG
   ====================================================== */
export async function getProductBySlug(slug: string, storeId: string) {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      product_variants (
        id,
        title,
        price,
        mrp,
        inventory,
        is_default,
        status
      )
    `)
    .eq("slug", slug)
    .eq("store_id", storeId)
    .eq("status", "published")
    .single()

  if (error || !data) {
    return null
  }

  return data
}

