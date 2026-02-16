"use client"

import React, { useState } from 'react';
import { Search, Info, ShieldCheck, AlertCircle, Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Ingredient {
    name: string;
    function: string;
    rating: 'good' | 'average' | 'poor' | 'natural';
    description: string;
}

interface IngredientsGlossaryProps {
    ingredients?: string | Ingredient[];
    className?: string;
}

const DEFAULT_INGREDIENTS: Ingredient[] = [
    {
        name: "Retinol",
        function: "Anti-aging",
        rating: "good",
        description: "A derivative of Vitamin A that helps to increase cell turnover and stimulate collagen production."
    },
    {
        name: "Ceramides NP",
        function: "Barrier Support",
        rating: "good",
        description: "Lipids that help to restore and maintain the skin's natural barrier, preventing moisture loss."
    },
    {
        name: "Hyaluronic Acid",
        function: "Hydration",
        rating: "natural",
        description: "A natural molecule that can hold up to 1000x its weight in water, providing deep skin hydration."
    }
];

export function IngredientsGlossary({ ingredients, className }: IngredientsGlossaryProps) {
    const [searchTerm, setSearchTerm] = useState("");

    const parsedIngredients: Ingredient[] = React.useMemo(() => {
        if (!ingredients) return DEFAULT_INGREDIENTS;
        if (Array.isArray(ingredients)) return ingredients;

        return ingredients.split(',').map(i => i.trim()).filter(Boolean).map(name => ({
            name,
            function: "Key Active",
            rating: "good" as const,
            description: "Active ingredient provided in product formulation."
        }));
    }, [ingredients]);

    const filteredIngredients = parsedIngredients.filter(i =>
        i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.function.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Token-mapped rating styles — no hardcoded colours
    const getRatingStyle = (rating: Ingredient['rating']) => {
        switch (rating) {
            case 'good': return { icon: ShieldCheck, label: 'Scientific Grade' };
            case 'natural': return { icon: Leaf, label: 'Natural Source' };
            case 'average': return { icon: Info, label: 'Usage Limited' };
            case 'poor': return { icon: AlertCircle, label: 'Not Recommended' };
        }
    };

    return (
        <div className={cn("bg-[var(--bg-primary)] border border-[var(--border)] rounded-[var(--radius-card)] p-8 shadow-[var(--shadow-card)]", className)}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.2em] mb-2 text-[var(--text-primary)]">Transparency Glossary</h3>
                    <p className="text-xs text-[var(--text-secondary)] font-medium uppercase tracking-tight">Full Ingredient Breakdown & Safety Scores</p>
                </div>

                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] group-focus-within:text-[var(--primary)] transition-colors" />
                    <input
                        type="text"
                        placeholder="SEARCH INGREDIENTS..."
                        className="pl-12 pr-6 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[var(--radius-button)] text-[10px] font-medium tracking-widest uppercase focus:ring-2 focus:ring-[var(--primary)]/20 transition-all w-full md:w-64 text-[var(--text-primary)]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredIngredients.map((ingredient, idx) => {
                    const style = getRatingStyle(ingredient.rating);
                    const Icon = style.icon;

                    return (
                        <div key={idx} className="p-6 bg-[var(--bg-secondary)] rounded-[var(--radius-card)] border border-[var(--border)] hover:border-[var(--primary)]/20 transition-all group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="space-y-1">
                                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]">{ingredient.name}</h4>
                                    <span className="text-[10px] font-medium text-[var(--text-secondary)] uppercase tracking-widest">{ingredient.function}</span>
                                </div>
                                <div className="px-3 py-1.5 rounded-[var(--radius-badge)] flex items-center gap-1.5 bg-[var(--badge-bg)]">
                                    <Icon className="w-3 h-3 text-[var(--badge-text)]" />
                                    <span className="text-[9px] font-semibold uppercase tracking-widest text-[var(--badge-text)]">{style.label}</span>
                                </div>
                            </div>
                            <p className="text-[11px] leading-relaxed text-[var(--text-secondary)] font-medium">
                                {ingredient.description}
                            </p>
                        </div>
                    );
                })}
            </div>

            {filteredIngredients.length === 0 && (
                <div className="py-12 text-center">
                    <p className="text-xs font-medium uppercase tracking-widest text-[var(--text-secondary)]">No matching ingredients found.</p>
                </div>
            )}

            <div className="mt-8 pt-6 border-t border-dashed border-[var(--border)] flex flex-wrap gap-6 justify-center">
                {['good', 'natural', 'average'].map((r: any) => {
                    const style = getRatingStyle(r);
                    const Icon = style.icon;
                    return (
                        <div key={r} className="flex items-center gap-2">
                            <Icon className="w-3.5 h-3.5 text-[var(--badge-text)]" />
                            <span className="text-[10px] font-medium uppercase tracking-widest text-[var(--text-secondary)]">{style.label}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
