"use client";

import { Truck } from "lucide-react";

/**
 * Announcement Bar Marquee Animation
 * Adding this inline as tailwind.config.ts was not found in the root.
 */
const MarqueeStyles = () => (
  <style dangerouslySetInnerHTML={{
    __html: `
    @keyframes marquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .animate-marquee {
      animation: marquee 20s linear infinite;
    }
  `}} />
);

interface AnnouncementBarProps {
  config?: {
    text?: string;
    style?: 'static' | 'marquee';
    background?: string;
    text_color?: string;
  };
}

export default function AnnouncementBar({ config }: AnnouncementBarProps) {
  const text = config?.text || "Free Shipping on Orders Above ₹999 | COD Available";
  const isMarquee = config?.style === 'marquee';
  const bgColor = config?.background || '#000000';
  const textColor = config?.text_color || '#ffffff';

  if (isMarquee) {
    return (
      <>
        <MarqueeStyles />
        <div
          className="overflow-hidden py-2.5 bg-black whitespace-nowrap"
          style={{ backgroundColor: bgColor }}
        >
          <div className="inline-block animate-marquee">
            {[1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 mx-8 text-[11px] md:text-xs uppercase tracking-[0.12em] font-medium"
                style={{ color: textColor }}
              >
                <Truck className="w-3.5 h-3.5" />
                {text}
              </span>
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <div
      className="text-white text-[11px] md:text-xs uppercase tracking-[0.12em] font-medium text-center py-2.5 flex items-center justify-center gap-2 shadow-sm"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <Truck className="w-3.5 h-3.5" />
      {text}
    </div>
  );
}
