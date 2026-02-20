"use client";

import { useFormContext, Controller } from "react-hook-form";
import {
    Shirt, Smartphone, Armchair, Pizza, Activity,
    Sparkles, Truck, Store, Layers
} from "lucide-react";
import { CategoryType } from "@/types/architecture";

const CATEGORIES: { id: CategoryType; label: string; icon: any }[] = [
    { id: 'fashion', label: 'Fashion', icon: Shirt },
    { id: 'beauty', label: 'Beauty', icon: Sparkles },
    { id: 'electronics', label: 'Electronics', icon: Smartphone },
    { id: 'home', label: 'Home', icon: Store },
    { id: 'furniture', label: 'Furniture', icon: Armchair },
    { id: 'health', label: 'Health', icon: Activity },
    { id: 'food', label: 'Food', icon: Pizza },
    { id: 'dropshipping', label: 'Dropshipping', icon: Truck },
    { id: 'multi', label: 'General / Multi', icon: Layers },
];

export function CategorySelector() {
    const { control } = useFormContext();

    return (
        <div className="space-y-3 mb-8">
            <label className="text-xs font-black uppercase tracking-widest text-neutral-400">Product Category</label>
            <Controller
                control={control}
                name="category"
                defaultValue="multi"
                render={({ field }) => (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        {CATEGORIES.map((cat) => {
                            const Icon = cat.icon;
                            const isSelected = field.value === cat.id;

                            return (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => field.onChange(cat.id)}
                                    className={`
                                        flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-300
                                        ${isSelected
                                            ? 'bg-neutral-900 border-neutral-900 text-white shadow-lg scale-[1.02]'
                                            : 'bg-white border-neutral-200 text-neutral-500 hover:border-neutral-300 hover:bg-neutral-50'
                                        }
                                    `}
                                >
                                    <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-neutral-400'}`} />
                                    <span className="text-[10px] font-bold uppercase tracking-wide">{cat.label}</span>
                                </button>
                            );
                        })}
                    </div>
                )}
            />
        </div>
    );
}
