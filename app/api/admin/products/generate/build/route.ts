import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function POST(req: Request) {
    try {
        const supabase = await createClient()
        const { specs, images, pricing } = await req.json()

        // 1. Dynamic Content Generation (Template-based fallback until LLM is live)
        // This ensures the output matches the input specs, unlike the previous hardcoded mock.

        const title = specs.title || "New Product"
        const productType = title.split(' ').slice(-2).join(' ') || "Product"
        const features = specs.features ? specs.features.split(',') : ["High Quality", "Durable", "Premium Finish"]

        const heroTitle = title.length > 80 ? title.substring(0, 80) + "..." : title

        const finalContent = {
            hero: {
                title: heroTitle,
                subtitle: `Premium ${productType} for Modern Living`,
                price: pricing?.cogs ? `₹${(parseFloat(pricing.cogs) * 1.5).toLocaleString()}` : "₹2,999",
            },
            listing: {
                shortDescription: `
<div class="product-description">
    <p>${specs.description || `Experience the best in class performance with our ${title}. Designed for efficiency and built to last.`}</p>
    
    <h2 class="text-xl font-bold mt-6 mb-4">Key Features</h2>
    <ul class="list-disc pl-5 space-y-2">
        ${features.map((f: string) => `<li>${f.trim()}</li>`).join('\n        ')}
        <li>Premium Material - Made from ${specs.material || 'high-grade materials'}</li>
        <li>Perfect Dimensions - ${specs.dimensions || 'Standard size'} for easy fit</li>
    </ul>

    <h2 class="text-xl font-bold mt-8 mb-4">Specifications</h2>
    <div class="grid grid-cols-2 gap-4 bg-neutral-50 p-4 rounded-xl">
        <div class="font-bold">Material</div><div>${specs.material || 'Standard'}</div>
        <div class="font-bold">Dimensions</div><div>${specs.dimensions || 'Standard'}</div>
        <div class="font-bold">Weight</div><div>${specs.weight || 'N/A'}</div>
        <div class="font-bold">Category</div><div>${productType}</div>
    </div>

    <h2 class="text-xl font-bold mt-8 mb-4">Product Story & Design</h2>
    <div class="space-y-6">
        <div class="aplus-section">
            <h3 class="font-bold mb-2">Superior Build Quality</h3>
            <p>Crafted with ${specs.material || 'premium materials'}, this ${productType} is designed to withstand daily use while maintaining its aesthetic appeal.</p>
        </div>
        <div class="aplus-section">
            <h3 class="font-bold mb-2">Efficient Performance</h3>
            <p>Engineered for efficiency, it delivers outstanding results. ${specs.features || ''}</p>
        </div>
    </div>
</div>
                `.trim(),
                bullets: features.map((f: string) => f.trim()).slice(0, 5)
            }
        }

        return NextResponse.json(finalContent)
    } catch (error) {
        console.error('Build Error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
