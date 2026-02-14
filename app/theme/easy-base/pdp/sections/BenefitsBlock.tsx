export default function BenefitsBlock({
  items,
}: {
  items: { title: string; description?: string | null }[];
}) {
  if (!items?.length) return null;
  return (
    <section className="space-y-3">
      {items.map((b, i) => (
        <div key={i}>
          <div className="font-medium">{b.title}</div>
          {b.description && (
            <p className="text-sm text-muted-foreground">{b.description}</p>
          )}
        </div>
      ))}
    </section>
  );
}
