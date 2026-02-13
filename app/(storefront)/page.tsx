import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getProducts } from "@/lib/products";
import HeroCarousel from "@/app/components/HeroCarousel";
import ProductCard from "@/app/components/ProductCard";
import Marquee from "@/app/components/Marquee";
import TestimonialSlider from "@/app/components/TestimonialSlider";
import { TrustBar } from "@/app/components/ui/trust-bar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { getActiveStoreId } from "@/lib/getActiveStore";
import LandingPage from "@/components/platform/LandingPage";
import ImageWithText from "@/app/components/ImageWithText";
import CollectionGrid from "@/app/components/CollectionGrid";

export default async function HomePage() {
  const storeId = await getActiveStoreId();

  // If no store (root domain), show Platform Landing Page
  if (!storeId) {
    return <LandingPage />;
  }

  const products = await getProducts(storeId);
  const mockupCollections = [
    { id: '1', title: 'Summer Collection', image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2040&auto=format&fit=crop', link: '/products' },
    { id: '2', title: 'Street Style', image_url: 'https://images.unsplash.com/photo-1529133039903-3961bb338ce1?q=80&w=2040&auto=format&fit=crop', link: '/products' },
    { id: '3', title: 'Minimalist Luxe', image_url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=2005&auto=format&fit=crop', link: '/products' },
    { id: '4', title: 'Urban Edge', image_url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop', link: '/products' },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* 1. HERO BANNER */}
      <HeroCarousel slides={[
        {
          id: 'default-1',
          title: 'Limited Style',
          subtitle: 'Pure Lifestyle Essentials',
          image_url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop',
          cta_text: 'Shop The Look',
          cta_link: '/products'
        }
      ]} />

      {/* 2. COLLECTION GRID - NEW ARRIVALS */}
      <CollectionGrid title="New Arrivals" items={mockupCollections} />

      {/* 3. BRAND STORY SECTION */}
      <ImageWithText
        title="The Art of Everyday"
        text="Minimalism is not about having less. It is about having enough of what matters. Collection redefines luxury through simplicity and craftsmanship."
        imageUrl="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop"
        ctaText="Our Vision"
        reverse={true}
      />

      {/* 4. FEATURED PRODUCTS (ProductCard Showcase) */}
      <section className="py-16 bg-[#F6F6F6]">
        <div className="container px-4 mx-auto max-w-[1600px]">
          <header className="mb-12 text-center">
            <h2 className="text-3xl md:text-5xl font-serif text-charcoal-900 border-b border-charcoal-100 pb-4 inline-block px-12 uppercase tracking-tight">
              Curated Edit
            </h2>
          </header>

          <Carousel opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent className="-ml-8">
              {products.length > 0 ? products.map((p: any) => (
                <CarouselItem key={p.id} className="pl-8 basis-[85%] md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <ProductCard product={p} />
                </CarouselItem>
              )) : [1, 2, 3, 4].map(i => (
                <CarouselItem key={i} className="pl-8 basis-[85%] md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <div className="animate-pulse">
                    <div className="aspect-[3/4] bg-neutral-200 shadow-sm" />
                    <div className="h-5 bg-neutral-100 rounded-full w-2/3 mt-6 mb-3 mx-auto" />
                    <div className="h-4 bg-neutral-100 rounded-full w-1/4 mx-auto" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {/* Minimalist Nav arrows at bottom */}
            <div className="flex justify-center gap-12 mt-16">
              <CarouselPrevious className="static translate-y-0 h-14 w-14 rounded-full border-neutral-200 hover:bg-black hover:text-white transition-all shadow-lg" />
              <CarouselNext className="static translate-y-0 h-14 w-14 rounded-full border-neutral-200 hover:bg-black hover:text-white transition-all shadow-lg" />
            </div>
          </Carousel>
        </div>
      </section>

      {/* 5. TRUST & VALUES */}
      <div className="bg-white border-y border-neutral-100">
        <TrustBar />
      </div>

      {/* FOOTER PLACEHOLDER - Simple Newsletter */}
      <section className="py-16 bg-black text-white text-center">
        <div className="container px-4 max-w-xl mx-auto space-y-8">
          <h2 className="text-4xl md:text-5xl font-serif mb-6">Join The Circle</h2>
          <p className="text-white/60 font-sans tracking-widest uppercase text-[10px] mb-8">Exclusive updates, limited drops, and styling rituals.</p>
          <div className="flex gap-0 border-b border-white/30 pb-4">
            <input type="email" placeholder="Your email address" className="bg-transparent border-0 outline-none text-white w-full placeholder:text-white/20 placeholder:font-serif" />
            <button className="text-[10px] font-bold uppercase tracking-[0.3em] hover:text-beige-300 transition-colors">Join</button>
          </div>
        </div>
      </section>
    </main>
  );
}
