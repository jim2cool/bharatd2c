"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface AccordionProps {
    title: string;
    icon: any;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

export function Accordion({ title, icon: Icon, children, defaultOpen = false }: AccordionProps) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="border border-neutral-200 rounded-xl overflow-hidden bg-white shadow-sm transition-all mb-4">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-neutral-600" />
                    </div>
                    <span className="font-bold text-neutral-800">{title}</span>
                </div>
                <ChevronDown className={`w-5 h-5 text-neutral-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
            </button>
            {open && <div className="p-5 pt-2 border-t border-neutral-100 animate-in slide-in-from-top-2 duration-300">{children}</div>}
        </div>
    );
}
