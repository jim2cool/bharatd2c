"use client";

type RatingProps = {
  value: number;
  count?: number;
  size?: number;
};

export default function Rating({
  value,
  count,
  size = 16,
}: RatingProps) {
  const fullStars = Math.floor(value);
  const decimal = value - fullStars;
  const hasPartial = decimal > 0 && fullStars < 5;
  const emptyStars = 5 - fullStars - (hasPartial ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      {/* Full stars */}
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`full-${i}`} size={size} fillPercent={100} />
      ))}

      {/* Partial star */}
      {hasPartial && (
        <Star
          key="partial"
          size={size}
          fillPercent={Math.round(decimal * 100)}
        />
      )}

      {/* Empty stars */}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`empty-${i}`} size={size} fillPercent={0} />
      ))}

      <span className="ml-1 text-sm text-muted-foreground">
        {value.toFixed(1)}
        {count !== undefined && ` (${count})`}
      </span>
    </div>
  );
}

function Star({
  size,
  fillPercent,
}: {
  size: number;
  fillPercent: number;
}) {
  return (
    <div
      className="relative"
      style={{ width: size, height: size }}
    >
      {/* Empty */}
      <svg
        viewBox="0 0 24 24"
        className="absolute inset-0 text-gray-300"
        fill="currentColor"
      >
        <path d="M12 17.3l6.18 3.73-1.64-7.03L21.5 9.24l-7.19-.61L12 2 9.69 8.63 2.5 9.24l4.96 4.76L5.82 21z" />
      </svg>

      {/* Filled */}
      {fillPercent > 0 && (
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${fillPercent}%` }}
        >
          <svg
            viewBox="0 0 24 24"
            className="text-yellow-500"
            fill="currentColor"
          >
            <path d="M12 17.3l6.18 3.73-1.64-7.03L21.5 9.24l-7.19-.61L12 2 9.69 8.63 2.5 9.24l4.96 4.76L5.82 21z" />
          </svg>
        </div>
      )}
    </div>
  );
}
