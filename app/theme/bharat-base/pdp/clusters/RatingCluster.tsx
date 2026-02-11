import { Star } from "lucide-react";

export default function RatingCluster({
  rating,
  reviewCount,
}: {
  rating?: number | null;
  reviewCount?: number | null;
}) {
  if (!rating || !reviewCount) return null;

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <div className="flex items-center gap-1 text-foreground">
        <Star className="w-4 h-4 fill-current" />
        <span className="font-medium">{rating.toFixed(1)}</span>
      </div>
      <span>({reviewCount} reviews)</span>
    </div>
  );
}
