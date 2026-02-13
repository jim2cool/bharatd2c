"use client";

import { motion } from "framer-motion";

const defaultItems = [
    "Cruelty Free",
    "Made in India",
    "Toxin Free",
    "Dermatologically Tested",
    "Vegan",
    "Sulfate Free",
    "Paraben Free",
    "Sustainable Packaging",
    "Cruelty Free",
    "Made in India",
    "Toxin Free",
    "Dermatologically Tested",
    "Vegan",
    "Sulfate Free",
    "Paraben Free",
    "Sustainable Packaging",
];

export default function Marquee({ items = defaultItems }: { items?: string[] }) {
    return (
        <div className="relative flex overflow-x-hidden border-y border-border/40 bg-background py-4">
            <div className="absolute inset-y-0 left-0 w-8 md:w-16 bg-gradient-to-r from-background to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-8 md:w-16 bg-gradient-to-l from-background to-transparent z-10" />

            <motion.div
                className="flex whitespace-nowrap"
                animate={{ x: "-50%" }}
                transition={{
                    repeat: Infinity,
                    ease: "linear",
                    duration: 20,
                }}
            >
                <div className="flex gap-8 md:gap-16 px-4 md:px-8 font-medium text-xs md:text-sm tracking-widest uppercase text-muted-foreground">
                    {items.map((item, index) => (
                        <span key={index} className="flex-shrink-0">
                            {item}
                        </span>
                    ))}
                </div>
                <div className="flex gap-8 md:gap-16 px-4 md:px-8 font-medium text-xs md:text-sm tracking-widest uppercase text-muted-foreground">
                    {items.map((item, index) => (
                        <span key={`dup-${index}`} className="flex-shrink-0">
                            {item}
                        </span>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
