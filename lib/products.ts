import { supabase } from "@/lib/supabase";

/* ======================================================
   PRODUCTS (HOMEPAGE)
   ====================================================== */
/* ======================================================
   PRODUCTS (HOMEPAGE)
   ====================================================== */
export async function getProducts(storeId: string, limit = 8) {
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
  sort: string
) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("products")
    .select("*", { count: "exact" })
    .eq("store_id", storeId)
    .eq("status", "published")
    .contains("collection_slug", [slug]);

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

