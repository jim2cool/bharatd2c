"use client";

import { useFormContext } from "react-hook-form";
import { Layout } from "lucide-react";
import { Accordion } from "./Accordion";
import { ThemeConfig } from "@/components/ThemeProvider";
import { PDPArchitectureManager } from "./PDPArchitectureManager";

export function StructureSection() {
    const { register, watch, setValue } = useFormContext<ThemeConfig>();
    const config = watch();

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-xl font-extrabold text-neutral-900">Store Structure</h2>
                <p className="text-neutral-500">Define the architectural foundation of your store.</p>
            </div>

            <Accordion title="Architecture & Layout" icon={Layout} defaultOpen={true}>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-neutral-700 mb-2">System Architecture</label>
                            <select
                                {...register("architecture")}
                                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-100 rounded-lg text-sm font-medium focus:ring-2 focus:ring-black"
                            >
                                <option value="product_engine">Product Engine (Standard D2C)</option>
                                <option value="story_first">Story First (Content-Heavy)</option>
                                <option value="catalog_first">Catalog First (High Volume)</option>
                            </select>
                            <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                                <strong>Product Engine:</strong> Optimized for single-product or clear hero product focus.<br />
                                <strong>Story First:</strong> Best for lifestyle brands with rich narratives.<br />
                                <strong>Catalog First:</strong> Dense layouts for large inventories.
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-neutral-700 mb-2">Store Category</label>
                            <select
                                {...register("category.category")}
                                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-100 rounded-lg text-sm font-medium capitalize focus:ring-2 focus:ring-black"
                            >
                                {['fashion', 'beauty', 'electronics', 'home', 'health', 'spiritual', 'furniture', 'food', 'dropshipping', 'marketplace', 'multi'].map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <p className="text-xs text-neutral-400 mt-2">
                                Adjusts default AI behavior and terminology.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-neutral-700 mb-2">Global Image Ratio</label>
                            <select
                                {...register("category.imageRatio")}
                                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-100 rounded-lg text-sm font-medium focus:ring-2 focus:ring-black"
                            >
                                <option value="1:1">Square (1:1)</option>
                                <option value="4:5">Portrait (4:5)</option>
                                <option value="16:9">Widescreen (16:9)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-neutral-700 mb-2">Variant Selector Style</label>
                            <select
                                {...register("category.variantSelectorType")}
                                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-100 rounded-lg text-sm font-medium capitalize focus:ring-2 focus:ring-black"
                            >
                                <option value="dropdown">Dropdown</option>
                                <option value="swatch">Color Swatches</option>
                                <option value="grid">Size Grid</option>
                            </select>
                        </div>
                    </div>
                </div>
            </Accordion>

            <Accordion title="PDP Architecture & Sequence" icon={Layout} defaultOpen={false}>
                <div className="py-2">
                    <PDPArchitectureManager />
                </div>
            </Accordion>
        </div>
    );
}
