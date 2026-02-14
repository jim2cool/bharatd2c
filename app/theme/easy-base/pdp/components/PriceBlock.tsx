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
    <div className="mt-4 bg-[#f8f8f8] rounded-xl p-4 shadow-sm">
      <div className="flex items-baseline gap-3 flex-wrap">
        <span className="text-3xl font-bold text-black">
          ₹{price}
        </span>

        {mrp && (
          <span className="text-sm text-gray-500 line-through">
            ₹{mrp}
          </span>
        )}

        {discount && (
          <span className="text-xs font-semibold text-green-700">
            {discount}% off
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-700 mt-3">
        <span>✔ Cash on Delivery</span>
        <span>✔ Fast Shipping</span>
        <span>✔ Easy Returns</span>
      </div>
    </div>
  );
}
