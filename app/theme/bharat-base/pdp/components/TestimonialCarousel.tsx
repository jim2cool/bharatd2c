"use client";

import { useState } from "react";

export default function TestimonialCarousel({
  testimonials,
}: {
  testimonials: {
    image?: string;
    text: string;
    name?: string;
    location?: string;
  }[];
}) {
  const [index, setIndex] = useState(0);
  const t = testimonials[index];

  return (
    <div className="mt-8 border rounded p-4">
      <div className="flex items-center gap-3">
        {t.image && (
          <img
            src={t.image}
            className="w-10 h-10 rounded-full object-cover"
          />
        )}
        <div className="text-sm">
          <div className="font-semibold">
            {t.name || "Customer"}
          </div>
          {t.location && (
            <div className="text-gray-500 text-xs">
              {t.location}
            </div>
          )}
        </div>
      </div>

      <p className="mt-3 text-sm text-gray-700">
        “{t.text}”
      </p>

      {testimonials.length > 1 && (
        <div className="flex justify-center gap-2 mt-3">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2 w-2 rounded-full ${
                i === index
                  ? "bg-black"
                  : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
