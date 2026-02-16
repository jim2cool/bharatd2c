"use client"

import { X, ShoppingBag, Minus, Plus, Trash2, CheckCircle2 } from "lucide-react"
import { Drawer } from "vaul"
import { useState, useEffect } from "react"
import { getCart, updateQty, removeFromCart, CartItem } from "@/lib/cart"
import Image from "next/image"
import Link from "next/link"

interface SlideOutCartProps {
    open: boolean
    onClose: () => void
}

export function SlideOutCart({ open, onClose }: SlideOutCartProps) {
    const [cart, setCart] = useState<CartItem[]>([])
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        setCart(getCart())

        const handleCartUpdate = () => {
            setCart(getCart())
        }

        window.addEventListener("cart-updated", handleCartUpdate)
        return () => window.removeEventListener("cart-updated", handleCartUpdate)
    }, [])

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
    const freeShippingThreshold = 999
    const shippingProgress = Math.min((subtotal / freeShippingThreshold) * 100, 100)
    const remainingForFreeShipping = Math.max(freeShippingThreshold - subtotal, 0)

    const handleUpdateQty = (productId: string, newQty: number) => {
        if (newQty < 1) return
        updateQty(productId, newQty)
        setCart(getCart())
    }

    const handleRemove = (productId: string) => {
        removeFromCart(productId)
        setCart(getCart())
    }

    if (!mounted) return null

    return (
        <Drawer.Root open={open} onOpenChange={(isOpen) => !isOpen && onClose()} direction="right">
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-foreground/40 z-50" />
                <Drawer.Content className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card z-50 flex flex-col shadow-xl">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-border">
                        <div className="flex items-center gap-2">
                            <ShoppingBag className="w-5 h-5" />
                            <Drawer.Title className="text-lg font-semibold">Shopping Cart ({cart.length})</Drawer.Title>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-secondary rounded-full transition-colors"
                            aria-label="Close cart"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Free Shipping Progress */}
                    {subtotal > 0 && subtotal < freeShippingThreshold && (
                        <div className="px-6 py-4 bg-saffron-100 border-b border-saffron-200">
                            <p className="text-sm text-foreground mb-2">
                                Add <span className="font-semibold">₹{remainingForFreeShipping}</span> more for <span className="font-semibold">FREE SHIPPING</span>
                            </p>
                            <div className="w-full bg-card rounded-full h-2 overflow-hidden">
                                <div
                                    className="h-full bg-saffron-500 transition-all duration-500"
                                    style={{ width: `${shippingProgress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {subtotal >= freeShippingThreshold && (
                        <div className="px-6 py-4 bg-green-50 border-b border-green-200">
                            <p className="text-sm text-green-700 font-bold flex items-center gap-2 uppercase tracking-tight">
                                <CheckCircle2 className="w-4 h-4" />
                                You've unlocked FREE SHIPPING!
                            </p>
                        </div>
                    )}

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto px-6 py-4">
                        {cart.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center py-12">
                                <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                                <h3 className="text-lg font-medium text-foreground mb-2">Your cart is empty</h3>
                                <p className="text-sm text-muted-foreground mb-6">Add items to get started</p>
                                <Link
                                    href="/products"
                                    onClick={onClose}
                                    className="btn btn-primary"
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {cart.map((item) => (
                                    <div key={item.product_id} className="flex gap-4 pb-4 border-b border-border last:border-0">
                                        {/* Product Image */}
                                        <div className="relative w-20 h-20 flex-shrink-0 bg-secondary rounded-md overflow-hidden">
                                            <Image
                                                src={item.image || "/placeholder.png"}
                                                alt={item.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-medium text-foreground mb-1 line-clamp-2">
                                                {item.title}
                                            </h3>
                                            <p className="text-sm font-semibold text-foreground mb-2">
                                                ₹{item.price.toLocaleString()}
                                            </p>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleUpdateQty(item.product_id, item.qty - 1)}
                                                    disabled={item.qty <= 1}
                                                    className="p-1 border border-border rounded hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                    aria-label="Decrease quantity"
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="text-sm font-medium w-8 text-center">{item.qty}</span>
                                                <button
                                                    onClick={() => handleUpdateQty(item.product_id, item.qty + 1)}
                                                    className="p-1 border border-border rounded hover:bg-secondary transition-colors"
                                                    aria-label="Increase quantity"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            onClick={() => handleRemove(item.product_id)}
                                            className="p-2 text-muted-foreground hover:text-destructive transition-colors self-start"
                                            aria-label="Remove item"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {cart.length > 0 && (
                        <div className="border-t border-border p-6 space-y-4">
                            {/* Subtotal */}
                            <div className="flex items-center justify-between text-lg">
                                <span className="font-medium">Subtotal</span>
                                <span className="font-bold">₹{subtotal.toLocaleString()}</span>
                            </div>

                            {/* Trust Signals */}
                            <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground py-3 border-y border-border">
                                <div className="text-center">
                                    <div className="font-medium">COD Available</div>
                                    <div className="text-muted-foreground">Pay on delivery</div>
                                </div>
                                <div className="text-center border-x border-border">
                                    <div className="font-medium">7-Day Returns</div>
                                    <div className="text-muted-foreground">Hassle-free</div>
                                </div>
                                <div className="text-center">
                                    <div className="font-medium">100% Genuine</div>
                                    <div className="text-muted-foreground">Direct from brand</div>
                                </div>
                            </div>

                            {/* Checkout Button */}
                            <Link
                                href="/checkout"
                                onClick={onClose}
                                className="block w-full text-center btn btn-primary py-4 text-base"
                            >
                                Proceed to Checkout
                            </Link>

                            {/* Continue Shopping */}
                            <button
                                onClick={onClose}
                                className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    )}
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    )
}
