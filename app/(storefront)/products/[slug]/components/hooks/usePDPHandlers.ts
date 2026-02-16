'use client';

import { useRouter } from 'next/navigation';
import { addToCart, setDirectCheckoutItem } from '@/lib/cart';
import { usePDP } from '../../context/PDPContext';

/**
 * usePDPHandlers — action handlers for the PDP conversion nucleus.
 * Handles COD order, prepaid payment initiation, and add-to-cart.
 */
export function usePDPHandlers() {
    const router = useRouter();
    const { product, qty, selectedVariant, currentPrice } = usePDP();

    const cartItem = {
        product_id: product?.id,
        title: product?.title,
        price: currentPrice,
        qty,
        image: product?.media?.[0]?.src || '',
        variant: selectedVariant?.label || null,
    };

    const handleCod = () => {
        setDirectCheckoutItem(cartItem);
        router.push('/checkout');
    };

    const handlePrepaid = () => {
        setDirectCheckoutItem(cartItem);
        router.push('/checkout?payment=online');
    };

    const handleAddToCart = () => {
        addToCart(cartItem);
        window.dispatchEvent(new Event('cart-updated'));
    };

    return { handleCod, handlePrepaid, handleAddToCart };
}
