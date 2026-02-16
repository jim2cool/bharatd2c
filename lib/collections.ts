import { supabase } from "@/lib/supabase-public";

export async function getCollections(storeId: string) {
  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .eq("store_id", storeId);

  if (error) {
    console.error("getCollections error:", error);
    return [];
  }

  return data ?? [];
}

export const collectionsFallback = [
  {
    slug: "bracelets",
    title: "Bracelets",
    description: "Energy, intention, and everyday wear",
    image: "/collections/bracelets.jpg",
  },
  {
    slug: "wellness",
    title: "Wellness",
    description: "Products for balance and daily rituals",
    image: "/collections/wellness.jpg",
  },
];
