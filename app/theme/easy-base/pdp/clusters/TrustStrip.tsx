import { Badge } from "@/components/ui/badge";

export default function TrustStrip({
  codAvailable,
}: {
  codAvailable?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {codAvailable && <Badge variant="secondary">COD Available</Badge>}
      <Badge variant="secondary">Easy Returns</Badge>
      <Badge variant="secondary">Fast Shipping</Badge>
    </div>
  );
}
