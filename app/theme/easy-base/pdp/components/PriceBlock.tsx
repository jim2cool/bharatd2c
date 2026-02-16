export default function PriceBlock({
  price,
  mrp,
}: {
  price: number;
  mrp?: number;
}) {
  const discount =
    mrp && mrp > price
      ? Math.round(((mrp - price) / mrp) * 100)
      : null;

  return (
    <div className="mt-4 bg-[var(--bg-secondary)] rounded-[var(--radius-card)] p-4 shadow-[var(--shadow-card)]">
      <div className="flex items-baseline gap-3 flex-wrap">
        <span className="text-3xl font-bold text-[var(--primary)]">
          ₹{price}
        </span>

        {mrp && (
          <span className="text-sm text-[var(--text-secondary)] line-through">
            ₹{mrp}
          </span>
        )}

        {discount && (
          <span className="text-xs font-semibold bg-green-50 text-green-700 rounded-[var(--radius-badge)] px-2 py-0.5">
            {discount}% off
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-[var(--text-secondary)] mt-3">
        <span>✔ Cash on Delivery</span>
        <span>✔ Fast Shipping</span>
        <span>✔ Easy Returns</span>
      </div>
    </div>
  );
}
