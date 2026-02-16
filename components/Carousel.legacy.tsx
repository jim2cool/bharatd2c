"use client";

import { useRef } from "react";

export default function Carousel({
  children,
  itemWidth = 300,
}: {
  children: React.ReactNode;
  itemWidth?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!ref.current) return;
    ref.current.scrollBy({
      left: dir === "left" ? -itemWidth : itemWidth,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      {/* Left Arrow */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-[-16px] top-1/2 -translate-y-1/2
        z-10 h-8 w-8 rounded-full bg-card shadow
        text-lg flex items-center justify-center"
      >
        ‹
      </button>

      {/* Right Arrow */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-[-16px] top-1/2 -translate-y-1/2
        z-10 h-8 w-8 rounded-full bg-card shadow
        text-lg flex items-center justify-center"
      >
        ›
      </button>

      <div
        ref={ref}
        className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar px-2"
      >
        {children}
      </div>
    </div>
  );
}
