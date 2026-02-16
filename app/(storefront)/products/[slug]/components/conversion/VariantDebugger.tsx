"use client"

import { useEffect } from "react"
import { ProductData } from "@/app/(storefront)/products/[slug]/types/pdp"

export function VariantDebugger({ product }: { product: ProductData }) {
    useEffect(() => {
        console.group("Variant Debugger")
        console.log("Has Variants:", product.has_variants)
        console.log("Variant Options:", product.variant_options)
        console.log("Variants:", product.variants)

        if (product.variants) {
            product.variants.forEach((v, i) => {
                console.log(`Variant ${i} [${v.id}]:`, v.options)
            })
        }
        console.groupEnd()
    }, [product])

    return (
        <div className="p-4 bg-destructive/10 border border-red-200 rounded-lg text-xs font-mono text-red-800 my-4">
            <p className="font-bold">Variant Debugger Active (Check Console)</p>
            <p>Variants Count: {product.variants?.length || 0}</p>
            <div className="mt-2 max-h-40 overflow-auto whitespace-pre">
                {JSON.stringify(product.variants, null, 2)}
            </div>
        </div>
    )
}
