"use client";

import { useState } from "react";
import { splitMarkupByH2 } from "../utils/splitMarkupByH2";

export default function AccordionRenderer({
  markup,
}: {
  markup: string;
}) {
  const sections = splitMarkupByH2(markup);
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mt-8 space-y-2">
      {sections.map((s, i) => (
        <div key={i} className="border rounded">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full text-left px-4 py-3 font-medium flex justify-between items-center"
          >
            <span>{s.title}</span>
            <span>{open === i ? "−" : "+"}</span>
          </button>

          {open === i && (
            <div
              className="px-4 pb-4 text-sm text-gray-700 prose"
              dangerouslySetInnerHTML={{ __html: s.content }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
