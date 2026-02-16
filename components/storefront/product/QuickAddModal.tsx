"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/lib/cart";
import { supabaseBrowser } from "@/lib/supabase-browser";

export function QuickAddModal({ isOpen, product, onClose }: { isOpen: boolean; product: any; onClose: () => void }) {
    const [variants, setVariants] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && product?.id) {
            setLoading(true);
            supabaseBrowser
                .from("product_variants")
                .select("*")
                .eq("product_id", product.id)
                .eq("status", "active")
                .then(({ data }) => {
                    setVariants(data || []);
                    if (data && data.length > 0) {
                        setSelectedVariantId(data[0].id);
                    }
                    setLoading(false);
                });
        }
    }, [isOpen, product]);

    if (!isOpen || !product) return null;

    const image = Array.isArray(product.images) && product.images.length > 0
        ? product.images[0]
        : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&auto=format&fit=crop";

    const handleAddToCart = () => {
        const variant = variants.find(v => v.id === selectedVariantId);
        addToCart({
            product_id: product.id,
            variant_id: selectedVariantId || undefined,
            title: variant ? `${product.title} - ${variant.title}` : product.title,
            image,
            price: variant ? variant.price : product.price,
            qty: 1,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
            <div className="fixed inset-0 bg-foreground/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-lg bg-[var(--bg-primary)] rounded-[var(--radius-card)] shadow-2xl overflow-hidden flex flex-col sm:flex-row">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-card/80 hover:bg-secondary rounded-full transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Product Image */}
                <div className="relative w-full sm:w-2/5 aspect-square sm:aspect-auto bg-secondary">
                    <Image src={image} alt={product.title} fill className="object-cover" />
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6 flex flex-col">
                    <h2 className="text-xl font-bold font-serif text-[var(--text-primary)] mb-2 leading-tight">
                        {product.title}
                    </h2>
                    <p className="text-lg font-semibold text-[var(--text-primary)] mb-6">
                        ₹{product.price}
                    </p>

                    {loading ? (
                        <div className="flex-1 flex items-center justify-center py-8">
                            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : variants.length > 0 ? (
                        <div className="flex-1 flex flex-col gap-3 mb-6 overflow-y-auto pr-2 max-h-[40vh] sm:max-h-auto scrollbar-thin">
                            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] opacity-60">Select Option</span>
                            {variants.map((v) => (
                                <button
                                    key={v.id}
                                    onClick={() => setSelectedVariantId(v.id)}
                                    className={`flex flex-col text-left p-3 border rounded-[var(--radius-button)] transition-all ${selectedVariantId === v.id ? 'border-[var(--primary)] ring-1 ring-[var(--primary)] bg-[var(--bg-secondary)]' : 'border-[var(--border)] hover:border-[var(--text-secondary)]'}`}
                                >
                                    <span className="font-semibold text-sm text-[var(--text-primary)]">{v.title}</span>
                                    <span className="text-sm text-[var(--text-secondary)] opacity-70">₹{v.price}</span>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center mb-6">
                            <p className="text-sm text-muted-foreground italic">No variants available for this product.</p>
                        </div>
                    )}

                    <Button
                        onClick={handleAddToCart}
                        disabled={loading}
                        className="w-full h-12 rounded-[var(--radius-button)] uppercase tracking-widest text-xs font-bold"
                    >
                        Add to Cart
                    </Button>
                </div>
            </div>
        </div>
    );
}
