export default function HighlightBullets({
  items,
}: {
  items: string[];
}) {
  if (!items.length) return null;

  return (
    <ul className="mt-4 space-y-2">
      {items.map((item, i) => (
        <li
          key={i}
          className="text-sm font-medium flex gap-2 items-start"
        >
          <span className="text-green-600">✔</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
