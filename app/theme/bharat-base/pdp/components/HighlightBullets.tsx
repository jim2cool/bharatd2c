export default function HighlightBullets({
  items,
}: {
  items: string[];
}) {
  if (!items.length) return null;

  return (
    <ul className="mt-4 space-y-3">
      {items.map((item, i) => (
        <li
          key={i}
          className="flex gap-3 text-sm text-gray-800"
        >
          <span className="text-green-700 mt-[2px]">✔</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
