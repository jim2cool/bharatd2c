"use client";

import { useState } from "react";
import ProductCard from "@/components/ui/product-card";
import { QuickAddModal } from "../product/QuickAddModal";

interface CategoryGridManagerProps {
    products: any[];
}

export default function CategoryGridManager({ products }: CategoryGridManagerProps) {
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

    if (!products || products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">No Products Found</h3>
                <p className="text-sm text-neutral-500 max-w-sm text-center">
                    We couldn't find any products matching your current filters. Try adjusting them or clearing filters to see more.
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                    <div key={product.id} className="relative group">
                        <ProductCard product={product} />

                        {/* Quick Add Overlay */}
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10 hidden md:block">
                            <button
                                onClick={(e) => {
                                    e.preventDefault(); // Prevents link navigation from ProductCard if it bubbles
                                    setSelectedProduct(product);
                                }}
                                className="bg-white/90 backdrop-blur-sm shadow-sm border border-neutral-200 text-neutral-900 hover:bg-black hover:text-white px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all"
                            >
                                Quick Add
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {selectedProduct && (
                <QuickAddModal
                    isOpen={!!selectedProduct}
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </>
    );
}
