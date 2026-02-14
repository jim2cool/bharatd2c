export default function HighlightsBlock({ items }: { items: string[] }) {
  if (!items?.length) return null;
  return (
    <section>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        {items.map((h, i) => (
          <li key={i}>{h}</li>
        ))}
      </ul>
    </section>
  );
}
