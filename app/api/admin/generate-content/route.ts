import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
    try {
        const { storeId, storeName, category } = await req.json()

        if (!storeId || !category || !storeName) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const apiKey = process.env.GOOGLE_GEMINI_API_KEY
        if (!apiKey) {
            console.warn('GOOGLE_GEMINI_API_KEY is not set. Skipping AI generation.')
            return NextResponse.json({ success: false, message: 'API key not configured' })
        }

        const genAI = new GoogleGenerativeAI(apiKey)
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" })

        const prompt = `
        You are an expert copywriter for direct-to-consumer (D2C) brands. 
        I need placeholder store content for a new ${category} brand called "${storeName}".
        Generate the following in JSON format WITHOUT markdown blocks:
        {
            "brandMission": "A short, punchy 1-2 sentence brand mission statement.",
            "heroHeadline": "A high-converting hero headline (max 6 words).",
            "products": [
                {
                    "title": " flagship product name",
                    "description": "3-sentence compelling description.",
                    "price": 1499
                },
                {
                    "title": "second product name",
                    "description": "3-sentence compelling description.",
                    "price": 1999
                },
                {
                    "title": "third product name",
                    "description": "3-sentence compelling description.",
                    "price": 899
                },
                {
                    "title": "fourth product name",
                    "description": "3-sentence compelling description.",
                    "price": 1299
                }
            ]
        }
        Return ONLY valid JSON.
        `

        const result = await model.generateContent(prompt)
        const responseText = result.response.text()
        const jsonMatch = responseText.match(/\{[\s\S]*\}/)

        let content
        if (jsonMatch) {
            content = JSON.parse(jsonMatch[0])
        } else {
            throw new Error('Failed to parse JSON from Gemini response')
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

        if (supabaseUrl && supabaseKey) {
            const supabase = createClient(supabaseUrl, supabaseKey)

            // Get category assets for images
            const { getDummyAssets } = require('@/lib/intelligence/dummyContent')
            const assets = getDummyAssets(category)

            // Update seller profiles with content_seeds
            const { error: profileError } = await supabase
                .from('ob_seller_profiles')
                .upsert({
                    store_id: storeId,
                    content_seeds: {
                        brand_name: storeName,
                        hero_headline: content.heroHeadline,
                        brand_mission: content.brandMission,
                        hero_image: assets[0] || ''
                    }
                }, { onConflict: 'store_id' })

            if (profileError && profileError.code !== '42P01') {
                console.error('Failed to update seller profile:', profileError)
            }

            // Insert multiple products
            if (content.products && Array.isArray(content.products)) {
                const productSeeds = content.products.map((p: any, idx: number) => ({
                    store_id: storeId,
                    title: p.title,
                    slug: p.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, ''),
                    description: p.description,
                    price: parseInt(p.price) || 999,
                    status: 'published',
                    category: category,
                    images: [assets[idx % assets.length] || assets[0]]
                }))

                const { error: productsError } = await supabase
                    .from('products')
                    .insert(productSeeds)

                if (productsError) {
                    console.error('Failed to create products:', productsError)
                }
            }
        }

        return NextResponse.json({ success: true, content })
    } catch (error: any) {
        console.error('Magic Moment Generation Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
