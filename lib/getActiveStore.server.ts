import { supabaseAdmin as supabase } from "./supabase-admin";

/**
 * DEV-SAFE store resolver
 * Store is passed explicitly (no headers, no cookies)
 */
export async function getActiveStoreIdServer(storeSlug: string) {
  if (!storeSlug) {
    throw new Error("storeSlug is required");
  }

  const { data, error } = await supabase
    .from("stores")
    .select("id")
    .eq("slug", storeSlug)
    .single();

  if (error || !data) {
    throw new Error(`No store found for slug: ${storeSlug}`);
  }

  return data.id;
}
