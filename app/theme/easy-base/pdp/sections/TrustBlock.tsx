export default function TrustBlock({
  rating,
  reviewCount,
  codAvailable,
}: {
  rating?: number;
  reviewCount?: number;
  codAvailable?: boolean;
}) {
  if (!rating && !codAvailable) return null;

  return (
    <section className="flex flex-wrap gap-3 text-xs text-muted-foreground">
      {rating && (
        <span>
          ★ {rating} {reviewCount ? `(${reviewCount})` : ""}
        </span>
      )}
      {codAvailable && <span>• COD Available</span>}
    </section>
  );
}
