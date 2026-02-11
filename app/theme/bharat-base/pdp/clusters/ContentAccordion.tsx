import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

function extractSections(html?: string | null) {
  if (!html) return [];

  const parts = html.split(/<h2>/i).slice(1);

  return parts.map((block) => {
    const [title, ...rest] = block.split("</h2>");
    return {
      title: title.trim(),
      content: rest.join("").trim(),
    };
  });
}

export default function ContentAccordion({
  content,
}: {
  content?: string | null;
}) {
  const sections = extractSections(content);

  if (!sections.length) return null;

  return (
    <Accordion type="multiple" className="w-full">
      {sections.map((s, i) => (
        <AccordionItem key={i} value={`section-${i}`}>
          <AccordionTrigger>{s.title}</AccordionTrigger>
          <AccordionContent>
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: s.content }}
            />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
