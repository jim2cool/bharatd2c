import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import Link from "next/link";
import { getProducts } from "@/lib/products";
import HeroCarousel from "@/app/components/HeroCarousel";
import ProductCard from "@/app/components/ProductCard";
import { TrustBar } from "@/app/components/ui/trust-bar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { getActiveStoreId } from "@/lib/getActiveStore";
import { notFound } from "next/navigation";
import LandingPage from "@/components/platform/LandingPage";

export default async function HomePage() {
  const storeId = await getActiveStoreId();

  // If no store (root domain), show Platform Landing Page
  if (!storeId) {
    return <LandingPage />;
  }

  const products = await getProducts(storeId);

  const testimonials = [
    {
      quote: "Clean packaging and exactly what I was looking for.",
      name: "Ananya Sharma",
      city: "Mumbai",
    },
    {
      quote: "Feels premium without being overpriced.",
      name: "Rohit Mehta",
      city: "Bangalore",
    },
    {
      quote: "Simple products that do their job well.",
      name: "Megha Kapoor",
      city: "Delhi",
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      {/* ================= HERO ================= */}
      <HeroCarousel />

      {/* ================= FEATURED PRODUCTS (CAROUSEL RESTORED) ================= */}
      <section className="py-10 md:py-16">
        <div className="container px-4 md:px-6 mx-auto max-w-[1400px]">
          <header className="mb-12 text-center space-y-2">
            <h2 className="text-3xl md:text-4xl font-normal tracking-tight text-foreground">
              Featured Products
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Essentials for your daily ritual
            </p>
          </header>

          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {products.map((p: any) => (
                <CarouselItem key={p.id} className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <ProductCard product={p} />
                </CarouselItem>
              ))}
            </CarouselContent>
            {/* Dawn-style simple navigation */}
            <div className="hidden md:block">
              <CarouselPrevious className="left-[-20px] h-10 w-10 border-border/60 hover:bg-background" />
              <CarouselNext className="right-[-20px] h-10 w-10 border-border/60 hover:bg-background" />
            </div>
          </Carousel>

          <div className="mt-12 text-center">
            <Button asChild variant="outline" size="lg" className="rounded-none border-foreground/20 hover:bg-foreground hover:text-background transition-all uppercase tracking-widest text-xs font-bold px-8 h-12">
              <Link href="/products">
                View All Products
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="py-16 md:py-24 bg-muted/30 border-y border-border/40">
        <div className="container px-4 md:px-6 mx-auto max-w-[1400px]">
          <header className="mb-12 text-center">
            <h2 className="text-2xl md:text-3xl font-normal tracking-tight text-foreground">
              What our customers say
            </h2>
          </header>

          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-5xl mx-auto"
          >
            <CarouselContent className="-ml-4">
              {testimonials.map((t, i) => (
                <CarouselItem key={i} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="h-full p-8 bg-background border border-border/40 flex flex-col items-center text-center gap-4 hover:border-border/80 transition-colors">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <span key={s} className="text-black text-xs">★</span>
                      ))}
                    </div>
                    <blockquote className="text-sm md:text-base text-foreground/80 leading-relaxed flex-grow">
                      "{t.quote}"
                    </blockquote>
                    <cite className="not-italic text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {t.name}, {t.city}
                    </cite>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:block">
              <CarouselPrevious className="left-[-50px] border-border/60" />
              <CarouselNext className="right-[-50px] border-border/60" />
            </div>
          </Carousel>
        </div>
      </section>

      {/* ================= TRUST BAR (RESTORED) ================= */}
      <TrustBar />

      {/* ================= FINAL CTA ================= */}
      <section className="py-20 md:py-32 bg-background">
        <div className="container px-4 text-center max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-4xl font-normal tracking-tight text-foreground">
            Thoughtful care starts here
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Formulations designed for the Indian climate, made with global standards.
            No harsh chemicals, just effective care.
          </p>
          <div className="pt-4">
            <Button asChild size="lg" className="rounded-none bg-foreground text-background hover:bg-foreground/90 h-14 px-10 uppercase tracking-widest text-sm font-bold">
              <Link href="/products">
                Shop The Collection
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
