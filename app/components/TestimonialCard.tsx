export default function TestimonialCard({
  quote,
  name,
  city,
}: {
  quote: string;
  name: string;
  city: string;
}) {
  return (
    <div
      className="
        bg-white
        rounded-xl
        shadow-sm
        p-5
        flex flex-col
        justify-between
        text-sm
      "
      style={{
        width: 260,          // 🔒 MUST match carousel CARD_WIDTH
        minHeight: 170,      // 🔒 height parity across cards
      }}
    >
      <p className="text-gray-700 leading-relaxed line-clamp-3">
        “{quote}”
      </p>

      <div className="flex items-center gap-3 mt-4">
        <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
          👤
        </div>
        <div>
          <div className="font-medium text-gray-900">{name}</div>
          <div className="text-xs text-gray-500">{city}</div>
        </div>
      </div>
    </div>
  );
}
