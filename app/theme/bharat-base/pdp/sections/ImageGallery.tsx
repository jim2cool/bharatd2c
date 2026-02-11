"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ImageGallery({
  images,
}: {
  images: string[];
}) {
  const [index, setIndex] = useState(0);

  if (!images?.length) return null;

  const prev = () =>
    setIndex(i => (i === 0 ? images.length - 1 : i - 1));
  const next = () =>
    setIndex(i => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="space-y-3">
      {/* MAIN IMAGE */}
      <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
        <img
          src={images[index]}
          alt=""
          className="h-full w-full object-cover"
        />

        {/* ARROWS – MOBILE ONLY */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1 lg:hidden"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1 lg:hidden"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* DOTS – MOBILE */}
      {images.length > 1 && (
        <div className="flex justify-center gap-2 lg:hidden">
          {images.map((_, i) => (
            <span
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2 w-2 rounded-full cursor-pointer ${
                i === index ? "bg-black" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}

      {/* THUMBNAILS – DESKTOP ONLY */}
      {images.length > 1 && (
        <div className="hidden gap-2 lg:flex">
          {images.map((img, i) => (
            <div
              key={i}
              onClick={() => setIndex(i)}
              className={`h-20 w-20 cursor-pointer overflow-hidden rounded-md border ${
                i === index ? "ring-2 ring-black" : ""
              }`}
            >
              <img
                src={img}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
