"use client";

import { useState } from "react";

export default function ImageGallery({
  images,
}: {
  images: string[];
}) {
  const imgs = images.length ? images : ["/placeholder.png"];
  const [index, setIndex] = useState(0);

  return (
    <div className="relative">
      <img
        src={imgs[index]}
        alt="Product image"
        className="w-full aspect-square object-cover rounded"
      />

      {imgs.length > 1 && (
        <>
          <div className="flex justify-center gap-2 mt-2">
            {imgs.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-2 w-2 rounded-full ${
                  i === index ? "bg-black" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
