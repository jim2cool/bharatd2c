"use client";

import { useState } from "react";

export default function ImageGallery({ images }: { images: string[] }) {
  const imgs = images.length ? images : ["/placeholder.png"];
  const [index, setIndex] = useState(0);

  return (
    <div className="bg-[var(--bg-secondary)] p-3 rounded-[var(--radius-card)] shadow-[var(--shadow-card)]">
      <img
        src={imgs[index]}
        alt="Product image"
        className="w-full aspect-square object-cover rounded-[var(--radius-image)] transition"
      />

      {imgs.length > 1 && (
        <div className="flex justify-center gap-2 mt-3">
          {imgs.map((_, i) => (
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
