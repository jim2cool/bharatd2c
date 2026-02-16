import { ProductHighlight } from "../../types/pdp";

interface HighlightsProps {
    highlights: ProductHighlight[];
}

export function Highlights({ highlights }: HighlightsProps) {
    if (!highlights || highlights.length < 3) return null;

    return (
        <section data-cluster="highlights" className="px-4 md:px-0">
            <ul className="flex flex-col gap-1">
                {highlights.map((item) => (
                    <li key={item.id} className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed">
                        <span className="text-foreground/40 mt-0.5">•</span>
                        <span>{item.text}</span>
                    </li>
                ))}
            </ul>
        </section>
    )
}
