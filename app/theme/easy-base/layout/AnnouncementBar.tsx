"use client";

import { Truck } from "lucide-react";

export default function AnnouncementBar() {
  return (
    <div className="bg-black text-white text-[11px] md:text-xs uppercase tracking-[0.12em] font-medium text-center py-2.5 flex items-center justify-center gap-2">
      <Truck className="w-3.5 h-3.5" />
      Free Shipping on Orders Above ₹999 | COD Available
    </div>
  );
}
