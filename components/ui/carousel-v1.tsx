"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CARD_WIDTH = 260;   // fixed card width
const CARD_GAP = 16;      // fixed gap between cards
const ARROW_GUTTER = 56;  // reserved space for arrows (each side)

export default function Carousel({
  children,
}: {
  children: React.ReactNode[];
}) {
  const total = children.length;
  const [index, setIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(1);

  useEffect(() => {
    const calculate = () => {
      const viewport = window.innerWidth;

      // space available ONLY for cards
      const usable =
        viewport - ARROW_GUTTER * 2 - 32; // safety padding

      const count = Math.floor(
        (usable + CARD_GAP) / (CARD_WIDTH + CARD_GAP)
      );

      setVisibleCount(Math.max(1, Math.min(4, count)));
    };

    calculate();
    window.addEventListener("resize", calculate);
    return () => window.removeEventListener("resize", calculate);
  }, []);

  const next = () =>
    setIndex((i) => (i + 1) % total);

  const prev = () =>
    setIndex((i) => (i - 1 + total) % total);

  const items = [];
  for (let i = 0; i < visibleCount; i++) {
    items.push(children[(index + i) % total]);
  }

  return (
    <div className="relative w-full flex items-center justify-center">
      {/* LEFT ARROW */}
      <button
        onClick={prev}
        className="
          absolute left-2
          h-10 w-10
          rounded-full
          bg-white shadow-xl
          flex items-center justify-center
          text-slate-900
          z-10
          border border-slate-100
          hover:bg-slate-50 transition-all
        "
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* TRACK */}
      <div
        className="flex justify-center"
        style={{
          gap: `${CARD_GAP}px`,
          marginLeft: ARROW_GUTTER,
          marginRight: ARROW_GUTTER,
        }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              width: CARD_WIDTH,
              minWidth: CARD_WIDTH,
            }}
          >
            {item}
          </div>
        ))}
      </div>

      {/* RIGHT ARROW */}
      <button
        onClick={next}
        className="
          absolute right-2
          h-10 w-10
          rounded-full
          bg-white shadow-xl
          flex items-center justify-center
          text-slate-900
          z-10
          border border-slate-100
          hover:bg-slate-50 transition-all
        "
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
