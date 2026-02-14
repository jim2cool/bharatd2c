import { Card } from "@/components/ui/card";

export default function TestimonialsGrid({
  testimonials,
}: {
  testimonials?: { name: string; text: string }[] | null;
}) {
  if (!testimonials?.length) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
      {testimonials.map((t, i) => (
        <Card key={i} className="p-4 text-sm">
          <p className="mb-2">“{t.text}”</p>
          <p className="font-medium text-foreground">{t.name}</p>
        </Card>
      ))}
    </div>
  );
}
