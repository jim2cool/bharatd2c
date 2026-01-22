"use client";

import { useEffect, useState } from "react";

const slides = [
  "/hero.jpg",
  "/hero2.jpg",
  "/hero3.jpg",
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const goTo = (index: number) => setCurrent(index);
  const prev = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  const next = () =>
    setCurrent((prev) => (prev + 1) % slides.length);

  return (
    <section className="section hero">
      <div className="hero-carousel relative overflow-hidden">
        {slides.map((src, i) => (
          <div
            key={i}
            className={`hero-slide ${i === current ? "is-active" : ""}`}
          >
            <img
              src={src}
              alt={`Slide ${i + 1}`}
              className="hero-image img-cover"
            />

            <div className="hero-content">
              <h1 className="hero-title">Everyday Care, Done Right</h1>
              <p className="hero-subtitle">
                Clean formulations. Honest pricing. No noise.
              </p>
              <button className="btn btn-accent">
                Explore Collection
              </button>
            </div>
          </div>
        ))}

        {/* Navigation */}
        <button
          className="hero-nav hero-nav-prev"
          onClick={prev}
          aria-label="Previous slide"
        >
          ‹
        </button>
        <button
          className="hero-nav hero-nav-next"
          onClick={next}
          aria-label="Next slide"
        >
          ›
        </button>

        {/* Indicators */}
        <div className="hero-indicators">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`hero-dot ${i === current ? "is-active" : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
