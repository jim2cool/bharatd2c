import { supabase } from "@/lib/supabase";

/* ======================================================
   SINGLE PRODUCT
   ====================================================== */
export async function getProductBySlug(slug: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error("getProductBySlug error:", error);
    return null;
  }

  return data ?? null;
}

/* ======================================================
   ALL PRODUCTS (NO PAGINATION)
   ====================================================== */
export async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getProducts error:", error);
    return [];
  }

  return data ?? [];
}

/* ======================================================
   PRODUCTS — PAGINATED (PLP)
   ====================================================== */
export async function getProductsPaginated(
  page: number,
  pageSize = 12,
  sort = "newest"
) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("products")
    .select("*", { count: "exact" })
    .eq("status", "published")
    .range(from, to);

  switch (sort) {
    case "price_asc":
      query = query.order("sellingPrice", { ascending: true });
      break;
    case "price_desc":
      query = query.order("sellingPrice", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

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
   PRODUCTS BY COLLECTION (FINAL / SAFE)
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
  .or(
    `collection_slugs_text.ilike.%${slug}%,collection_slugs_text.eq.${slug}`
  );


  if (sort === "price_asc") {
    query = query.order("sellingPrice", { ascending: true });
  } else if (sort === "price_desc") {
    query = query.order("sellingPrice", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

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
