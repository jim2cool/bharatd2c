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

    // Parse ingredients if string
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

    const getRatingStyle = (rating: Ingredient['rating']) => {
        switch (rating) {
            case 'good': return { color: 'text-emerald-600', bg: 'bg-emerald-50', icon: ShieldCheck, label: 'Scientific Grade' };
            case 'natural': return { color: 'text-green-600', bg: 'bg-green-50', icon: Leaf, label: 'Natural Source' };
            case 'average': return { color: 'text-amber-600', bg: 'bg-amber-50', icon: Info, label: 'Usage Limited' };
            case 'poor': return { color: 'text-rose-600', bg: 'bg-rose-50', icon: AlertCircle, label: 'Not Recommended' };
        }
    };

    return (
        <div className={cn("bg-white border border-neutral-100 rounded-[2.5rem] p-8 shadow-sm", className)}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-2">Transparency Glossary</h3>
                    <p className="text-xs text-neutral-500 font-bold uppercase tracking-tight">Full Ingredient Breakdown & Safety Scores</p>
                </div>

                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="SEARCH INGREDIENTS..."
                        className="pl-12 pr-6 py-3 bg-neutral-50 border-0 rounded-2xl text-[10px] font-black tracking-widest uppercase focus:ring-2 focus:ring-primary/20 transition-all w-full md:w-64"
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
                        <div key={idx} className="p-6 bg-neutral-50/50 rounded-3xl border border-neutral-100 hover:border-primary/20 transition-all group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="space-y-1">
                                    <h4 className="text-xs font-black uppercase tracking-wider text-neutral-900">{ingredient.name}</h4>
                                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{ingredient.function}</span>
                                </div>
                                <div className={cn("px-3 py-1.5 rounded-full flex items-center gap-1.5", style.bg)}>
                                    <Icon className={cn("w-3 h-3", style.color)} />
                                    <span className={cn("text-[9px] font-black uppercase tracking-widest", style.color)}>{style.label}</span>
                                </div>
                            </div>
                            <p className="text-[11px] leading-relaxed text-neutral-600 font-medium">
                                {ingredient.description}
                            </p>
                        </div>
                    );
                })}
            </div>

            {filteredIngredients.length === 0 && (
                <div className="py-12 text-center">
                    <p className="text-xs font-black uppercase tracking-widest text-neutral-400">No matching ingredients found.</p>
                </div>
            )}

            <div className="mt-8 pt-6 border-t border-dashed border-neutral-200 flex flex-wrap gap-6 justify-center">
                {['good', 'natural', 'average'].map((r: any) => {
                    const style = getRatingStyle(r);
                    const Icon = style.icon;
                    return (
                        <div key={r} className="flex items-center gap-2">
                            <Icon className={cn("w-3.5 h-3.5", style.color)} />
                            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{style.label}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
