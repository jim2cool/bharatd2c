export default function StarRating({
  rating,
  count,
}: {
  rating: number;
  count: number;
}) {
  const fullStars = Math.floor(rating);
  const partial = rating - fullStars;

  return (
    <div className="flex items-center gap-1 text-sm text-gray-600">
      <div className="flex">
        {[0, 1, 2, 3, 4].map((i) => {
          if (i < fullStars) {
            return <Star key={i} fill={1} />;
          }
          if (i === fullStars && partial > 0) {
            return <Star key={i} fill={partial} />;
          }
          return <Star key={i} fill={0} />;
        })}
      </div>
      <span className="ml-1">
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
