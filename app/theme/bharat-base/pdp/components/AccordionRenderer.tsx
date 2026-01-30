"use client";

import { useState } from "react";
import { splitMarkupByH2 } from "../utils/splitMarkupByH2";

export default function AccordionRenderer({ markup }: { markup: string }) {
  const sections = splitMarkupByH2(markup);
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mt-10 space-y-4">
      {sections.map((s, i) => (
        <div
          key={i}
          className="bg-[#fafafa] rounded-xl shadow-sm"
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full px-5 py-4 flex justify-between items-center font-medium"
          >
            <span>{s.title}</span>
            <span className="text-xl">
              {open === i ? "−" : "+"}
            </span>
          </button>

          {open === i && (
            <div
              className="px-5 pb-5 text-sm text-gray-700 prose"
              dangerouslySetInnerHTML={{ __html: s.content }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
