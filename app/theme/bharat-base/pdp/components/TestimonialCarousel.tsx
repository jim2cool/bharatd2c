"use client";

import { useState } from "react";

export default function TestimonialCarousel({ testimonials }: any) {
  const [index, setIndex] = useState(0);
  const t = testimonials[index];

  return (
    <div className="bg-[#fafafa] rounded-xl p-5 shadow-sm">
      <p className="text-sm text-gray-800 leading-relaxed">
        “{t.text}”
      </p>

      <div className="mt-4 text-sm font-medium text-gray-700">
        {t.name || "Verified Customer"}
        {t.location && (
          <span className="text-gray-500 font-normal">
            {" "}
            · {t.location}
          </span>
        )}
      </div>

      {testimonials.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {testimonials.map((_: any, i: number) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2 w-2 rounded-full ${
                i === index ? "bg-black" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
