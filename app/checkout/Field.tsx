type FieldProps = {
  name: string;
  autoComplete?: string;
  inputMode?: "text" | "numeric" | "tel" | "email";
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  textarea?: boolean;
};

export default function Field({
  name,
  autoComplete,
  inputMode,
  placeholder,
  value,
  onChange,
  error,
  textarea,
}: FieldProps) {
  const baseClass = `
    w-full px-3 py-2.5 border rounded text-sm
    focus:outline-none focus:ring-1 focus:ring-black
    ${error ? "border-red-500" : "border-gray-300"}
  `;

  return (
    <div>
      {textarea ? (
        <textarea
          name={name}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className={baseClass}
        />
      ) : (
        <input
          type="text"
          name={name}
          autoComplete={autoComplete}
          inputMode={inputMode}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={baseClass}
        />
      )}
      {error && <div className="text-xs text-red-600 mt-1">{error}</div>}
    </div>
  );
}
