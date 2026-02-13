import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import sharp from 'sharp'

// Initialize S3 Client (Hetzner)
const s3 = new S3Client({
    endpoint: process.env.HETZNER_S3_ENDPOINT,
    region: 'eu-central-1',
    credentials: {
        accessKeyId: process.env.HETZNER_S3_ACCESS_KEY!,
        secretAccessKey: process.env.HETZNER_S3_SECRET_KEY!,
    },
})

export async function POST(req: Request) {
    try {
        console.log('--- SAVE PRODUCT WITH IMAGE UPLOAD START ---')
        const supabase = await createClient()
        const { content, specs, images, pricing } = await req.json()

        // 1. Auth & Store Resolution
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        // Find store (simplified for now)
        let storeId = null
        const { data: store } = await supabase.from('stores').select('id').eq('owner_id', user.id).single()
        if (store) {
            storeId = store.id
        } else if (process.env.NODE_ENV === 'development') {
            const { data: anyStore } = await supabase.from('stores').select('id').limit(1).single()
            if (anyStore) storeId = anyStore.id
        }

        if (!storeId) return NextResponse.json({ error: 'Store not found' }, { status: 404 })

        // 2. Create Initial Product (Draft) to get ID
        const productSlug = content.hero.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')

        const { data: product, error: insertError } = await supabase
            .from('products')
            .insert({
                store_id: storeId,
                title: content.hero.title,
                content_markup: content.listing.shortDescription || content.listing.short_description || '',
                price: typeof content.hero.price === 'string' ? parseFloat(content.hero.price.replace(/[^0-9.]/g, '')) : content.hero.price,
                mrp: pricing?.cogs ? parseFloat(pricing.cogs) * 1.5 : null,
                status: 'draft',
                slug: productSlug,
                images: [], // Placeholder, will update after upload
                highlights: content.listing.bullets || []
            })
            .select('id')
            .single()

        if (insertError) {
            console.error('Insert Product Error details:', insertError)
            throw insertError
        }
        const productId = product.id

        // 3. Process & Upload Images
        console.log(`Processing ${images.length} images for product ${productId}...`)

        // Helper to upload single image
        const processImage = async (url: string, index: number) => {
            try {
                // Fetch image (using same headers as proxy)
                const response = await fetch(url, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
                    }
                })
                if (!response.ok) throw new Error(`Fetch failed: ${response.status}`)

                const buffer = Buffer.from(await response.arrayBuffer())

                // Resize & Convert to WebP
                const webpBuffer = await sharp(buffer)
                    .resize({ width: 1600, withoutEnlargement: true })
                    .webp({ quality: 80 })
                    .toBuffer()

                const filename = index === 0 ? `${productSlug}-hero.webp` : `${productSlug}-${index}.webp`
                const key = `${productId}/${filename}`

                // Upload to S3
                await s3.send(new PutObjectCommand({
                    Bucket: process.env.HETZNER_S3_BUCKET!,
                    Key: key,
                    Body: webpBuffer,
                    ContentType: 'image/webp',
                }))

                return `${process.env.HETZNER_PUBLIC_BASE_URL}/${key}`
            } catch (error) {
                console.error(`Failed to process image ${url}:`, error)
                return null // Skip failed images
            }
        }

        // Run uploads in parallel
        const uploadPromises = images.map((url: string, index: number) => processImage(url, index))
        const uploadedUrls = (await Promise.all(uploadPromises)).filter(url => url !== null)

        // 4. Update Product with Permanent URLs
        const { error: updateError } = await supabase
            .from('products')
            .update({ images: uploadedUrls })
            .eq('id', productId)

        if (updateError) throw updateError

        console.log('Product saved and image uploads complete.')
        return NextResponse.json({ productId, imageUrls: uploadedUrls })

    } catch (error: any) {
        console.error('Save Product Detailed Error:', error)
        return NextResponse.json({
            error: 'Internal server error',
            message: error.message
        }, { status: 500 })
    }
}
