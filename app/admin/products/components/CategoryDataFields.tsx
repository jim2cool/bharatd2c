"use client";

import { useFormContext } from "react-hook-form";
import { CategoryType } from "@/types/architecture";
import { Sparkles, Zap, Leaf, Ruler, Box, Clock, ShieldCheck, Info } from "lucide-react";

interface CategoryDataFieldsProps {
    category: CategoryType;
}

export function CategoryDataFields({ category }: CategoryDataFieldsProps) {
    const { register, watch } = useFormContext();

    if (!category || category === 'multi' || category === 'marketplace') return null;

    // Define fields per category
    const renderFields = () => {
        switch (category) {
            case 'beauty':
            case 'health':
            case 'food':
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                                    <Leaf className="w-4 h-4 text-green-500" />
                                    Active Ingredients / Key Nutrients
                                </label>
                                <textarea
                                    {...register("category_data.ingredients")}
                                    placeholder="Enter as comma separated list (e.g., Vitamin C, Hyaluronic Acid)"
                                    className="w-full p-3 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-black min-h-[100px]"
                                />
                                <p className="text-[10px] text-neutral-400">Used in Ingredients Module & Glossaries</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                                    <Info className="w-4 h-4 text-blue-500" />
                                    Usage / Dosage Instructions
                                </label>
                                <textarea
                                    {...register("category_data.usage_instructions")}
                                    placeholder="e.g., Apply twice daily / Take 1 pill with water"
                                    className="w-full p-3 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-black min-h-[100px]"
                                />
                            </div>
                        </div>
                    </div>
                );

            case 'electronics':
            case 'furniture':
            case 'home':
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-yellow-500" />
                                    Technical Specs / Material
                                </label>
                                <textarea
                                    {...register("category_data.specs")}
                                    placeholder="Format: Label:Value (one per line)&#10;Processor: A17 Pro&#10;Material: Solid Oak"
                                    className="w-full p-3 border border-neutral-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-black min-h-[120px]"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                                    <Ruler className="w-4 h-4 text-purple-500" />
                                    Dimensions & Weight
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        {...register("category_data.dimensions.length")}
                                        placeholder="Length (cm)"
                                        className="w-full p-2 border border-neutral-200 rounded-lg text-sm"
                                    />
                                    <input
                                        {...register("category_data.dimensions.width")}
                                        placeholder="Width (cm)"
                                        className="w-full p-2 border border-neutral-200 rounded-lg text-sm"
                                    />
                                    <input
                                        {...register("category_data.dimensions.height")}
                                        placeholder="Height (cm)"
                                        className="w-full p-2 border border-neutral-200 rounded-lg text-sm"
                                    />
                                    <input
                                        {...register("category_data.dimensions.weight")}
                                        placeholder="Weight (kg)"
                                        className="w-full p-2 border border-neutral-200 rounded-lg text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'fashion':
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-pink-500" />
                                    Fabric & Care
                                </label>
                                <textarea
                                    {...register("category_data.fabric_care")}
                                    placeholder="e.g. 100% Cotton, Machine Wash Cold"
                                    className="w-full p-3 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-black min-h-[100px]"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                                    <Ruler className="w-4 h-4 text-indigo-500" />
                                    Fit Type
                                </label>
                                <select
                                    {...register("category_data.fit_type")}
                                    className="w-full p-3 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-black"
                                >
                                    <option value="regular">Regular Fit</option>
                                    <option value="slim">Slim Fit</option>
                                    <option value="oversized">Oversized / Relaxed</option>
                                </select>
                            </div>
                        </div>
                    </div>
                );

            case 'dropshipping':
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-orange-500" />
                                    Processing Time
                                </label>
                                <input
                                    {...register("category_data.processing_time")}
                                    placeholder="e.g. 1-2 Business Days"
                                    className="w-full p-3 border border-neutral-200 rounded-xl text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                                    <Box className="w-4 h-4 text-blue-500" />
                                    Shipping Time
                                </label>
                                <input
                                    {...register("category_data.shipping_time")}
                                    placeholder="e.g. 5-9 Days"
                                    className="w-full p-3 border border-neutral-200 rounded-xl text-sm"
                                />
                            </div>
                        </div>
                    </div>
                );

            case 'spiritual':
                return (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-purple-500" />
                                Ritual / Significance
                            </label>
                            <textarea
                                {...register("category_data.ritual")}
                                placeholder="Describe the spiritual significance or ritual use..."
                                className="w-full p-3 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-black min-h-[100px]"
                            />
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="p-4 bg-neutral-50 rounded-xl text-xs text-neutral-400 italic text-center">
                        No specific fields configured for {category}
                    </div>
                );
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm animate-in fade-in slide-in-from-bottom-2">
            <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-500 mb-6 pb-2 border-b border-neutral-100">
                {category} Specifics
            </h3>
            {renderFields()}
        </div>
    );
}
