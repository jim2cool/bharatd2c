import Rating from "@/app/theme/bharat-base/shared/Rating";

type HeroBlockProps = {
  title: string;
  rating?: number;
  reviewCount?: number;
  highlights?: string[];
};

export default function HeroBlock({
  title,
  rating,
  reviewCount,
  highlights,
}: HeroBlockProps) {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold">{title}</h1>

      {typeof rating === "number" && (
        <Rating value={rating} count={reviewCount} />
      )}

      {Array.isArray(highlights) && highlights.length > 0 && (
        <ul className="space-y-1 text-sm text-muted-foreground">
          {highlights.map((item, i) => (
            <li key={i}>• {item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
