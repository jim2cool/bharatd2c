"use client";

import { useState } from "react";

export default function TestimonialCarousel({ testimonials }: any) {
  const [index, setIndex] = useState(0);
  const t = testimonials[index];

  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[var(--radius-card)] p-5 shadow-[var(--shadow-card)]">
      <p className="text-sm text-[var(--text-primary)] leading-relaxed">
        "{t.text}"
      </p>

      <div className="mt-4 text-sm font-medium text-[var(--text-primary)]">
        {t.name || "Verified Customer"}
        {t.location && (
          <span className="text-[var(--text-secondary)] font-normal">
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
              className={`h-2 w-2 rounded-[var(--radius-badge)] transition ${i === index ? "bg-[var(--primary)]" : "bg-[var(--border)]"
                }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
