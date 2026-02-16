"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Filter, X, ChevronDown, Check } from "lucide-react";

interface MandatoryFilterSystemProps {
    categories?: string[];
    maxPrice?: number;
    variant?: 'sidebar_filters' | 'top_filters' | 'minimal_filters';
}

export default function MandatoryFilterSystem({
    categories = [],
    maxPrice = 10000,
    variant = 'sidebar_filters',
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
        if (!isDesktop || variant === 'minimal_filters') setIsOpen(false);
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

    const FilterContent = ({ layout = 'vertical' }: { layout?: 'vertical' | 'horizontal' }) => (
        <div className={`space-y-8 ${layout === 'horizontal' ? 'flex flex-wrap items-start gap-x-12 gap-y-0 space-y-0' : ''}`}>
            {/* Stock Filter */}
            <div className="space-y-3 min-w-[200px]">
                <h3 className="text-sm font-[var(--font-weight-display)] uppercase tracking-wider text-[var(--text-primary)] border-b border-[var(--border)] pb-2" style={{ fontFamily: 'var(--heading-font)' }}>Availability</h3>
                <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded-[var(--radius-button)] border flex items-center justify-center transition-colors ${inStock ? 'bg-[var(--primary)] border-[var(--primary)]' : 'border-[var(--border)] group-hover:border-[var(--primary)]'}`}>
                        {inStock && <Check className="w-3.5 h-3.5 text-[var(--cta-text)]" />}
                    </div>
                    <span className="text-sm text-[var(--text-secondary)] select-none">In Stock Only</span>
                    <input
                        type="checkbox"
                        className="hidden"
                        checked={inStock}
                        onChange={(e) => setInStock(e.target.checked)}
                    />
                </label>
            </div>

            {/* Price Filter */}
            <div className="space-y-4 min-w-[280px]">
                <h3 className="text-sm font-[var(--font-weight-display)] uppercase tracking-wider text-[var(--text-primary)] border-b border-[var(--border)] pb-2" style={{ fontFamily: 'var(--heading-font)' }}>Price Range</h3>
                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <span className="text-xs text-[var(--text-secondary)] mb-1 block">Min (₹)</span>
                        <input
                            type="number"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="w-full p-2 border border-[var(--border)] rounded-[var(--radius-button)] text-sm focus:ring-1 focus:ring-[var(--primary)] focus:outline-none bg-[var(--bg-primary)] text-[var(--text-primary)]"
                        />
                    </div>
                    <span className="text-[var(--border)] mt-5">-</span>
                    <div className="flex-1">
                        <span className="text-xs text-[var(--text-secondary)] mb-1 block">Max (₹)</span>
                        <input
                            type="number"
                            value={currentMaxPrice}
                            onChange={(e) => setCurrentMaxPrice(e.target.value)}
                            className="w-full p-2 border border-[var(--border)] rounded-[var(--radius-button)] text-sm focus:ring-1 focus:ring-[var(--primary)] focus:outline-none bg-[var(--bg-primary)] text-[var(--text-primary)]"
                        />
                    </div>
                </div>
            </div>

            {/* Dynamic Subcategories */}
            {categories && categories.length > 0 && (
                <div className="space-y-3 flex-1 min-w-[200px]">
                    <h3 className="text-sm font-[var(--font-weight-display)] uppercase tracking-wider text-[var(--text-primary)] border-b border-[var(--border)] pb-2" style={{ fontFamily: 'var(--heading-font)' }}>Product Type</h3>
                    <div className={`space-y-2 ${layout === 'horizontal' ? 'grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2 space-y-0' : ''}`}>
                        {categories.map((acc) => (
                            <label key={acc} className="flex items-center gap-3 cursor-pointer group">
                                <div className={`w-5 h-5 rounded-[var(--radius-button)] border flex items-center justify-center transition-colors ${selectedSubcategories.includes(acc) ? 'bg-[var(--primary)] border-[var(--primary)]' : 'border-[var(--border)] group-hover:border-[var(--primary)]'}`}>
                                    {selectedSubcategories.includes(acc) && <Check className="w-3.5 h-3.5 text-[var(--cta-text)]" />}
                                </div>
                                <span className="text-sm text-[var(--text-secondary)] capitalize select-none">{acc.replace(/-/g, ' ')}</span>
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
            <div className={`pt-4 border-t border-[var(--border)] flex items-center justify-between ${layout === 'horizontal' ? 'w-full grid grid-cols-2 gap-4 border-none pt-0 mt-4' : ''}`}>
                <button onClick={clearFilters} className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] underline">Clear All</button>
                <button
                    onClick={handleApplyFilters}
                    className="bg-[var(--primary)] text-[var(--cta-text)] px-6 py-2.5 rounded-[var(--radius-button)] text-sm font-medium hover:opacity-90 transition-colors"
                >
                    Apply Filters
                </button>
            </div>
        </div>
    );

    // Sidebar View
    if (isDesktop && variant === 'sidebar_filters') {
        return (
            <aside className="w-64 flex-shrink-0 sticky top-24 h-fit">
                <div className="flex items-center gap-2 font-[var(--font-weight-display)] text-lg mb-6 pb-4 border-b border-[var(--border)] text-[var(--text-primary)] uppercase tracking-widest" style={{ fontFamily: 'var(--heading-font)' }}>
                    <Filter className="w-5 h-5" /> Filters
                </div>
                <FilterContent />
            </aside>
        );
    }

    // Top View
    if (isDesktop && variant === 'top_filters') {
        return (
            <div className="w-full mb-8 p-6 bg-[var(--bg-secondary)] rounded-[var(--radius-card)] border border-[var(--border)]">
                <div className="flex items-center gap-2 font-[var(--font-weight-display)] text-sm mb-6 pb-2 border-b border-[var(--border)] text-[var(--text-primary)] uppercase tracking-widest" style={{ fontFamily: 'var(--heading-font)' }}>
                    <Filter className="w-4 h-4" /> Filter Options
                </div>
                <FilterContent layout="horizontal" />
            </div>
        );
    }

    // Mobile/Minimal Drawer View
    return (
        <div className={variant === 'top_filters' ? 'mb-6' : ''}>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 bg-[var(--bg-primary)] border border-[var(--border)] px-4 py-2 rounded-[var(--radius-button)] text-sm font-medium shadow-sm text-[var(--text-primary)]"
            >
                <Filter className="w-4 h-4" /> Filters
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex">
                    <div className="fixed inset-0 bg-foreground/50 transition-opacity" onClick={() => setIsOpen(false)} />
                    <div className="relative w-[300px] bg-[var(--bg-primary)] h-full shadow-xl flex flex-col pt-16 animate-in slide-in-from-left duration-200">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 p-2 bg-[var(--bg-secondary)] rounded-full hover:bg-[var(--border)] text-[var(--text-primary)]"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <div className="p-6 overflow-y-auto flex-1">
                            <div className="flex items-center gap-2 font-[var(--font-weight-display)] text-xl mb-8 text-[var(--text-primary)] uppercase tracking-widest" style={{ fontFamily: 'var(--heading-font)' }}>
                                <Filter className="w-5 h-5" /> Filters
                            </div>
                            <FilterContent />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
