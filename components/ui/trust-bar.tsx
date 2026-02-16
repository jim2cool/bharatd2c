"use client";

export default function TrustBar() {
  return (
    <section className="bg-card border-t border-border">
      <div className="container py-8">
        <div
          className="
            grid grid-cols-2 gap-y-6
            md:grid-cols-4 md:gap-6
            text-center
          "
        >
          <TrustItem
            icon={<TruckIcon />}
            label="Free Shipping"
            sub="Orders over ₹999"
          />
          <TrustItem
            icon={<CardIcon />}
            label="Cash on Delivery"
            sub="Across India"
          />
          <TrustItem
            icon={<ReturnIcon />}
            label="Easy Returns"
            sub="Hassle-free"
          />
          <TrustItem
            icon={<IndiaIcon />}
            label="Made for India"
            sub="Everyday routines"
          />
        </div>
      </div>
    </section>
  );
}

function TrustItem({
  icon,
  label,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  sub: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="text-[#1E2A5E] opacity-80">
        {icon}
      </div>
      <p className="text-sm font-medium text-foreground">
        {label}
      </p>
      <p className="text-xs text-muted-foreground">
        {sub}
      </p>
    </div>
  );
}

/* ================= ICONS ================= */

function TruckIcon() {
  return (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M3 7h13v10H3z" />
      <path d="M16 10h4l1 3v4h-5z" />
      <circle cx="7.5" cy="17.5" r="1.5" />
      <circle cx="17.5" cy="17.5" r="1.5" />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </svg>
  );
}

function ReturnIcon() {
  return (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M3 12a9 9 0 1 0 9-9" />
      <path d="M3 4v8h8" />
    </svg>
  );
}

function IndiaIcon() {
  return (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15 15 0 0 1 0 20" />
      <path d="M12 2a15 15 0 0 0 0 20" />
    </svg>
  );
}
