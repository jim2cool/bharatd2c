"use client"

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { usePDP } from '@/app/(storefront)/products/[slug]/context/PDPContext';
import { addToCart, setDirectCheckoutItem } from '@/lib/cart';

export function usePDPHandlers() {
    const router = useRouter();
    const { product, selectedVariant, currentPrice, currentQty, prepaidSavings } = usePDP();

    const handleCod = () => {
        if (product.has_variants && !selectedVariant) {
            toast.error("Please select an option first");
            return;
        }
        setDirectCheckoutItem({
            product_id: product.id,
            variant_id: selectedVariant?.id,
            title: `${product.title}${selectedVariant ? ` - ${selectedVariant.title}` : ""}`,
            image: product.media[0]?.src || "",
            price: currentPrice,
            qty: currentQty
        });
        router.push("/checkout");
    };

    const handlePrepaid = () => {
        if (product.has_variants && !selectedVariant) {
            toast.error("Please select an option first");
            return;
        }
        setDirectCheckoutItem({
            product_id: product.id,
            variant_id: selectedVariant?.id,
            title: `${product.title}${selectedVariant ? ` - ${selectedVariant.title}` : ""}`,
            image: product.media[0]?.src || "",
            price: currentPrice,
            qty: currentQty,
            prepaid_discount: prepaidSavings
        });
        router.push("/checkout");
    };

    const handleAddToCart = () => {
        if (product.has_variants && !selectedVariant) {
            toast.error("Please select an option first");
            return;
        }
        addToCart({
            product_id: product.id,
            variant_id: selectedVariant?.id,
            title: `${product.title}${selectedVariant ? ` - ${selectedVariant.title}` : ""}`,
            image: product.media[0]?.src || "",
            price: currentPrice,
            qty: currentQty,
            prepaid_discount: prepaidSavings
        });
        router.push("/cart");
    };

    return { handleCod, handlePrepaid, handleAddToCart };
}
