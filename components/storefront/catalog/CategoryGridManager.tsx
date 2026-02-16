"use client";

import { useState } from "react";
import ProductCard from "@/components/ui/product-card";
import { QuickAddModal } from "../product/QuickAddModal";

interface CategoryGridManagerProps {
    products: any[];
    density?: 'dense' | 'editorial' | 'standard';
}

export default function CategoryGridManager({ products, density = 'standard' }: CategoryGridManagerProps) {
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

    const gridClasses = {
        dense: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-3 gap-y-6",
        editorial: "grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12",
        standard: "grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    }[density];

    if (!products || products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-[var(--bg-secondary)] rounded-[var(--radius-card)] border border-dashed border-[var(--border)]">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2" style={{ fontFamily: 'var(--heading-font)' }}>No Products Found</h3>
                <p className="text-sm text-[var(--text-secondary)] max-w-sm text-center">
                    We couldn't find any products matching your current filters. Try adjusting them or clearing filters to see more.
                </p>
            </div>
        );
    }

    return (
        <>
            <div className={`grid ${gridClasses}`}>
                {products.map((product) => (
                    <div key={product.id} className="relative group">
                        <ProductCard product={product} />

                        {/* Quick Add Overlay */}
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10 hidden md:block">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    setSelectedProduct(product);
                                }}
                                className="bg-[var(--bg-primary)]/90 backdrop-blur-sm shadow-sm border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--primary)] hover:text-[var(--cta-text)] px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all"
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
