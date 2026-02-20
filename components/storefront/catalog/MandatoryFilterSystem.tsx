"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Filter, X, ChevronDown, Check } from "lucide-react";

interface MandatoryFilterSystemProps {
    categories?: string[];
    maxPrice?: number;
}

export default function MandatoryFilterSystem({
    categories = [],
    maxPrice = 10000,
}: MandatoryFilterSystemProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const [isOpen, setIsOpen] = useState(false);
    const [isDesktop, setIsDesktop] = useState(true);

    // Filter State
    const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "0");
    const [currentMaxPrice, setCurrentMaxPrice] = useState(searchParams.get("maxPrice") || maxPrice.toString());
    const [inStock, setInStock] = useState(searchParams.get("inStock") === "true");
    const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
        searchParams.getAll("subcategory")
    );

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleApplyFilters = () => {
        const params = new URLSearchParams(searchParams.toString());

        // Reset page to 1 on filter change
        params.set("page", "1");

        if (minPrice && minPrice !== "0") params.set("minPrice", minPrice);
        else params.delete("minPrice");

        if (currentMaxPrice && parseInt(currentMaxPrice) < maxPrice) params.set("maxPrice", currentMaxPrice);
        else params.delete("maxPrice");

        if (inStock) params.set("inStock", "true");
        else params.delete("inStock");

        params.delete("subcategory");
        selectedSubcategories.forEach(sub => params.append("subcategory", sub));

        router.push(`${pathname}?${params.toString()}`);
        if (!isDesktop) setIsOpen(false);
    };

    const clearFilters = () => {
        setMinPrice("0");
        setCurrentMaxPrice(maxPrice.toString());
        setInStock(false);
        setSelectedSubcategories([]);
        const params = new URLSearchParams(searchParams.toString());
        params.delete("minPrice");
        params.delete("maxPrice");
        params.delete("inStock");
        params.delete("subcategory");
        router.push(`${pathname}?${params.toString()}`);
    };

    const FilterContent = () => (
        <div className="space-y-8">
            {/* Stock Filter */}
            <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900 border-b pb-2">Availability</h3>
                <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${inStock ? 'bg-primary border-primary' : 'border-neutral-300 group-hover:border-primary'}`}>
                        {inStock && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span className="text-sm text-neutral-700 select-none">In Stock Only</span>
                    <input
                        type="checkbox"
                        className="hidden"
                        checked={inStock}
                        onChange={(e) => setInStock(e.target.checked)}
                    />
                </label>
            </div>

            {/* Price Filter */}
            <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900 border-b pb-2">Price Range</h3>
                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <span className="text-xs text-neutral-500 mb-1 block">Min (₹)</span>
                        <input
                            type="number"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="w-full p-2 border border-neutral-200 rounded-lg text-sm focus:ring-1 focus:ring-primary focus:outline-none"
                        />
                    </div>
                    <span className="text-neutral-300 mt-5">-</span>
                    <div className="flex-1">
                        <span className="text-xs text-neutral-500 mb-1 block">Max (₹)</span>
                        <input
                            type="number"
                            value={currentMaxPrice}
                            onChange={(e) => setCurrentMaxPrice(e.target.value)}
                            className="w-full p-2 border border-neutral-200 rounded-lg text-sm focus:ring-1 focus:ring-primary focus:outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Dynamic Subcategories (if any) */}
            {categories && categories.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900 border-b pb-2">Product Type</h3>
                    <div className="space-y-2">
                        {categories.map((acc) => (
                            <label key={acc} className="flex items-center gap-3 cursor-pointer group">
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedSubcategories.includes(acc) ? 'bg-primary border-primary' : 'border-neutral-300 group-hover:border-primary'}`}>
                                    {selectedSubcategories.includes(acc) && <Check className="w-3.5 h-3.5 text-white" />}
                                </div>
                                <span className="text-sm text-neutral-700 capitalize select-none">{acc.replace(/-/g, ' ')}</span>
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={selectedSubcategories.includes(acc)}
                                    onChange={(e) => {
                                        if (e.target.checked) setSelectedSubcategories([...selectedSubcategories, acc]);
                                        else setSelectedSubcategories(selectedSubcategories.filter(s => s !== acc));
                                    }}
                                />
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Apply Button */}
            <div className="pt-4 border-t flex items-center justify-between">
                <button onClick={clearFilters} className="text-sm text-neutral-500 hover:text-black underline">Clear All</button>
                <button
                    onClick={handleApplyFilters}
                    className="bg-black text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-neutral-800 transition-colors"
                >
                    Apply Filters
                </button>
            </div>
        </div>
    );

    if (isDesktop) {
        return (
            <aside className="w-64 flex-shrink-0 sticky top-24 h-fit">
                <div className="flex items-center gap-2 font-bold text-lg mb-6 pb-4 border-b">
                    <Filter className="w-5 h-5" /> Filters
                </div>
                <FilterContent />
            </aside>
        );
    }

    // Mobile View Drawer
    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 bg-white border border-neutral-200 px-4 py-2 rounded-full text-sm font-medium shadow-sm"
            >
                <Filter className="w-4 h-4" /> Filters
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex">
                    <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={() => setIsOpen(false)} />
                    <div className="relative w-[300px] bg-white h-full shadow-xl flex flex-col pt-16 animate-in slide-in-from-left duration-200">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 p-2 bg-neutral-100 rounded-full hover:bg-neutral-200"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <div className="p-6 overflow-y-auto flex-1">
                            <div className="flex items-center gap-2 font-bold text-xl mb-8">
                                <Filter className="w-5 h-5" /> Filters
                            </div>
                            <FilterContent />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
