import { supabase } from "@/lib/supabase";

/* ======================================================
   PRODUCTS (HOMEPAGE)
   ====================================================== */
export async function getProducts(limit = 8) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
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
  page: number,
  pageSize: number,
  sort: string
) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("products")
    .select("*", { count: "exact" })
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
export async function getProductsByCollection(
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
export async function getProductBySlug(slug: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) {
    console.error("getProductBySlug error:", error);
    return null;
  }

  return data;
}
