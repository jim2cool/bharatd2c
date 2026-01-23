type FieldProps = {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  textarea?: boolean;
  name?: string;
  autoComplete?: string;
  inputMode?: "text" | "numeric";
};

export default function Field({
  placeholder,
  value,
  onChange,
  error = "",
  textarea = false,
  name,
  autoComplete,
  inputMode,
}: FieldProps) {
  const baseClass =
    "w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-black";

  return (
    <div>
      {textarea ? (
        <textarea
          name={name}
          autoComplete={autoComplete}
          rows={1}
          style={{ height: "40px" }}
          className={`${baseClass} resize-none leading-[1.25] ${
            error ? "border-red-500" : ""
          }`}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <input
          name={name}
          autoComplete={autoComplete}
          inputMode={inputMode}
          className={`${baseClass} ${
            error ? "border-red-500" : ""
          }`}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}

      {error && (
        <div className="mt-1 text-xs text-red-600">{error}</div>
      )}
    </div>
  );
}
