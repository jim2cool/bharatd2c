"use client"

import { ContentSection } from "../../types/pdp"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

interface ContentProps {
    sections: ContentSection[]
    intro?: string
}

export function ContentAccordions({ sections, intro }: ContentProps) {
    if ((!sections || sections.length === 0) && !intro) return null

    return (
        <div data-cluster="content" className="px-4 md:px-0 border-t border-border/60">
            {intro && (
                <div
                    className="prose prose-sm prose-neutral dark:prose-invert leading-relaxed max-w-none py-6"
                    dangerouslySetInnerHTML={{ __html: intro }}
                />
            )}

            {sections && sections.length > 0 && (
                <Accordion type="single" collapsible className="w-full">
                    {sections.map((section) => (
                        <AccordionItem key={section.id} value={section.id} className="border-b border-border/40">
                            <AccordionTrigger className="text-sm font-normal py-4 hover:no-underline text-foreground">
                                {section.title}
                            </AccordionTrigger>
                            <AccordionContent className="pb-4">
                                <div
                                    className="prose prose-sm prose-neutral dark:prose-invert leading-relaxed max-w-none"
                                    dangerouslySetInnerHTML={{ __html: section.content }}
                                />
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            )}
        </div>
    )
}
