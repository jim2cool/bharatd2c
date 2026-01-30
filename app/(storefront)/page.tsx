import Carousel from "@/app/components/Carousel";
import HeroCarousel from "@/app/components/HeroCarousel";
import ProductCard from "@/app/components/ProductCard";
import TestimonialCard from "@/app/components/TestimonialCard";
import TrustBar from "@/app/components/TrustBar";
import { getProducts } from "@/lib/products";

export default async function HomePage() {
  const products = await getProducts();

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
    <main>
      {/* ================= HERO ================= */}
      <HeroCarousel />

      {/* ================= FEATURED PRODUCTS ================= */}
      <section className="section">
        <div className="container">
          <header className="section-header">
            <h2 className="section-title">Featured Products</h2>
          </header>

          <div className="mt-10">
            <Carousel>
              {products.map((p: any) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </Carousel>
          </div>

          <div className="mt-10 text-center">
            <button className="btn btn-primary">
              View All Products
            </button>
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="section section--muted">
        <div className="container">
          <header className="section-header">
            <h2 className="section-title">What our customers say</h2>
          </header>

          <Carousel itemWidth={320}>
            {testimonials.map((t, i) => (
              <TestimonialCard key={i} {...t} />
            ))}
          </Carousel>
        </div>
      </section>

      {/* ================= TRUST BAR ================= */}
      <TrustBar />

      {/* ================= FINAL CTA ================= */}
      <section className="final-cta">
        <div className="container text-center">
          <h2 className="section-title">
            Thoughtful care starts here
          </h2>
          <p className="section-subtitle">
            Products made for real Indian routines
          </p>
          <div className="mt-8">
            <button className="btn btn-accent">
              Browse All Products
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
