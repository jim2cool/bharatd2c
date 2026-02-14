export default function StarRating({
  rating,
  count,
}: {
  rating: number;
  count: number;
}) {
  const full = Math.floor(rating);
  const partial = rating - full;

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <div className="flex">
        {[0, 1, 2, 3, 4].map((i) => {
          if (i < full) return <Star key={i} fill={1} />;
          if (i === full && partial > 0)
            return <Star key={i} fill={partial} />;
          return <Star key={i} fill={0} />;
        })}
      </div>
      <span className="text-gray-500">
        {rating} ({count} reviews)
      </span>
    </div>
  );
}

function Star({ fill }: { fill: number }) {
  return (
    <div className="relative w-4 h-4">
      <span className="absolute text-gray-300">★</span>
      <span
        className="absolute overflow-hidden text-yellow-500"
        style={{ width: `${fill * 100}%` }}
      >
        ★
      </span>
    </div>
  );
}
