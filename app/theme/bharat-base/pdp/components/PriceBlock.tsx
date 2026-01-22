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
    <div className="mt-3">
      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold">₹{price}</span>

        {mrp && (
          <span className="line-through text-gray-500">
            ₹{mrp}
          </span>
        )}

        {discount && (
          <span className="text-green-600 text-sm font-semibold">
            {discount}% off
          </span>
        )}
      </div>

      <div className="flex gap-4 text-xs text-gray-600 mt-1">
        <span>✔ Cash on Delivery</span>
        <span>✔ Fast Shipping</span>
        <span>✔ Easy Returns</span>
      </div>
    </div>
  );
}
