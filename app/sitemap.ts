import { MetadataRoute } from 'next'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { getActiveStoreId } from '@/lib/getActiveStore'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const storeId = await getActiveStoreId()

    // Base routes
    const routes = [
        '',
        '/products',
        '/collections',
        '/track-order',
    ].map((route) => ({
        url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://easyd2c.in'}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    if (!storeId) return routes

    // Fetch Products
    const { data: products } = await supabaseAdmin
        .from('products')
        .select('slug, updated_at')
        .eq('store_id', storeId)
        .eq('status', 'published')

    const productRoutes = (products || []).map((product) => ({
        url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://easyd2c.in'}/products/${product.slug}`,
        lastModified: new Date(product.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }))

    // Fetch Collections
    const { data: collections } = await supabaseAdmin
        .from('collections')
        .select('slug, updated_at')
        .eq('store_id', storeId)
        .eq('status', 'published')

    const collectionRoutes = (collections || []).map((collection) => ({
        url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://easyd2c.in'}/collections/${collection.slug}`,
        lastModified: new Date(collection.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.5,
    }))

    return [...routes, ...productRoutes, ...collectionRoutes]
}
