import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getProducts } from "@/lib/products";
import HeroCarousel from "@/components/ui/hero-carousel";
import ProductCard from "@/components/ui/product-card";
import Marquee from "@/components/ui/marquee";
import TestimonialSlider from "@/components/ui/testimonial-slider";
import TrustBar from "@/components/ui/trust-bar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { getActiveStoreId } from "@/lib/getActiveStore";
import { getActiveStore } from "@/lib/getActiveStore";
import LandingPage from "@/components/platform/LandingPage";
import HomepageBlockRenderer from "@/components/homepage/HomepageBlockRenderer";
import { supabase } from "@/lib/supabase-public";
import { initialise_store_pages } from "@/lib/intelligence/homepage";

export default async function HomePage() {
  const store = await getActiveStore();

  // If no store (root domain), show Platform Landing Page
  if (!store) {
    return <LandingPage />;
  }

  const storeId = store.id;

  // 1. Fetch Homepage from Registry
  let { data: homepage } = await supabase
    .from('pg_store_pages')
    .select('*')
    .eq('store_id', storeId)
    .eq('slug', 'index')
    .single();

  // 2. Auto-seed if missing
  if (!homepage) {
    const newPageId = await initialise_store_pages(storeId, store.commerce_architecture);
    if (newPageId) {
      const { data: seededPage } = await supabase
        .from('pg_store_pages')
        .select('*')
        .eq('id', newPageId)
        .single();
      homepage = seededPage;
    }
  }

  if (!homepage || !homepage.homepage_sections) {
    // Fallback if registry fails completely
    return (
      <main className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] text-[var(--text-secondary)]">
        <p>Storefront is being initialized. Refresh in a moment.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <HomepageBlockRenderer
        sections={homepage.homepage_sections}
        storeId={storeId}
      />
    </main>
  );
}

