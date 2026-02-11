export default function ContentBlock({ html }: { html: string }) {
  if (!html) return null;
  return (
    <section
      className="prose prose-sm max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
