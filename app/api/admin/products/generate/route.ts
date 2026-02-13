import { NextResponse } from 'next/server'
// Cheerio removed for stability

// --- STRATEGY PATTERN INTERFACE ---
interface ExtractionResult {
    title: string
    description: string
    images: string[]
    price?: string
    currency?: string
    originalPrice?: string
}

interface Extractor {
    canHandle(url: string): boolean
    extract(html: string, url: string): Promise<ExtractionResult>
}

// --- CONCRETE STRATEGIES ---

const AmazonStrategy: Extractor = {
    canHandle: (url) => url.includes('amazon') || url.includes('amzn'),
    extract: async (html, url) => {
        const titleMatch = html.match(/<span id="productTitle"[^>]*>([^<]+)<\/span>/i) || html.match(/<title>([^<]+)<\/title>/i)
        const title = titleMatch ? titleMatch[1].trim() : ''

        const descMatch = html.match(/<div id="feature-bullets"[^>]*>([\s\S]*?)<\/div>/i)
        const description = descMatch ? descMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 500) : ''

        const images: string[] = []
        // Amazon dynamic handling (often needs more robust parsing, keeping simple regex for now)
        const imgRegex = /<img[^>]+src=["'](https?:\/\/[^"']+)["'][^>]*>/gi
        let match
        while ((match = imgRegex.exec(html)) !== null) {
            if (match[1].includes('media-amazon') && match[1].includes('_SX') && !match[1].includes('sprite')) {
                if (images.length < 5) images.push(match[1])
            }
        }
        return { title, description, images }
    }
}

const FlipkartStrategy: Extractor = {
    canHandle: (url) => url.includes('flipkart.com'),
    extract: async (html, url) => {
        const titleMatch = html.match(/<span class="B_NuCI"[^>]*>([^<]+)<\/span>/i) || html.match(/<h1[^>]*>([^<]+)<\/h1>/i) || html.match(/<title>([^<]+)<\/title>/i)
        let title = titleMatch ? titleMatch[1].trim() : ''

        // Clean Flipkart title
        title = title
            .replace(/\|.+$/, '')
            .replace(/\/p\/itm.+$/, '')
            .trim()

        const images: string[] = []
        const ogImage = html.match(/<meta\s+property="og:image"\s+content="([^"]*)"/i)
        if (ogImage) images.push(ogImage[1])

        return { title, description: '', images }
    }
}

const MeeshoStrategy: Extractor = {
    canHandle: (url) => url.includes('meesho.com'),
    extract: async (html, url) => {
        // Fallback title extraction from URL if HTML is blocked (likely)
        let title = ''
        if (html.includes('Access Denied') || html.length < 500) {
            const urlObj = new URL(url)
            const pathSegments = urlObj.pathname.split('/')
            const slug = pathSegments.sort((a, b) => b.length - a.length)[0]
            title = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        } else {
            const titleMatch = html.match(/<title>([^<]+)<\/title>/i)
            title = titleMatch ? titleMatch[1] : ''
        }

        // Clean Meesho Title
        title = title.replace(/\/p\/.+$/, '').replace(/\?.*$/, '').replace(/\|.+$/, '').replace(/\s+/g, ' ').trim()

        // Brute force clean logic
        const pIndex = title.indexOf('/p/')
        if (pIndex !== -1) title = title.substring(0, pIndex).trim()
        if (title.length > 150) title = title.substring(0, 147) + '...'

        // Images: Meesho blocks basic fetch, use placeholders or look for LD-JSON if available
        // For now, we return empty images to trigger the fallback generator
        return { title, description: 'Shop this product on Meesho', images: [] }
    }
}

const ShopifyStrategy: Extractor = {
    canHandle: (url) => {
        try {
            // Heuristic: Check if domain suggests shopify or html contains shopify globals
            return false // We need HTML to be sure, or passed flag. Ideally we check presence of specific meta tags in generic extract.
            // For now, let's assume generic fallback handles Shopify reasonably well via OG tags
        } catch { return false }
    },
    extract: async (html, url) => {
        // Shopify usually has good OG tags and JSON-LD
        const titleMatch = html.match(/<meta\s+property="og:title"\s+content="([^"]*)"/i)
        const title = titleMatch ? titleMatch[1] : ''

        const descMatch = html.match(/<meta\s+property="og:description"\s+content="([^"]*)"/i)
        const description = descMatch ? descMatch[1] : ''

        const images: string[] = []
        const ogImage = html.match(/<meta\s+property="og:image"\s+content="([^"]*)"/i)
        if (ogImage) images.push(ogImage[1])

        // Try getting product JSON
        const jsonMatch = html.match(/var meta = (\{.*\});/)
        // ... complex logic omitted for speed, relying on OG

        return { title, description, images }
    }
}

const DeoDapStrategy: Extractor = {
    canHandle: (url) => url.includes('deodap.com'),
    extract: async (html, url) => {
        // DeoDap is Shopify-based (usually)
        const titleMatch = html.match(/<meta\s+property="og:title"\s+content="([^"]*)"/i)
        const title = titleMatch ? titleMatch[1] : ''

        const descMatch = html.match(/<meta\s+property="og:description"\s+content="([^"]*)"/i)
        const description = descMatch ? descMatch[1] : ''

        const images: string[] = []
        const ogImage = html.match(/<meta\s+property="og:image"\s+content="([^"]*)"/i)
        if (ogImage) images.push(ogImage[1])

        return { title, description, images }
    }
}

const WordPressStrategy: Extractor = {
    canHandle: (url) => url.includes('wp-content') || false,
    extract: async (html, url) => {
        // WooCommerce Open Graph
        const titleMatch = html.match(/<meta\s+property="og:title"\s+content="([^"]*)"/i)
        const title = titleMatch ? titleMatch[1] : ''

        const images: string[] = []
        const ogImage = html.match(/<meta\s+property="og:image"\s+content="([^"]*)"/i)
        if (ogImage) images.push(ogImage[1])

        return { title, description: '', images }
    }
}

// GENERIC / FALLBACK STRATEGY
const GenericStrategy: Extractor = {
    canHandle: () => true,
    extract: async (html, url) => {
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i) ||
            html.match(/<meta\s+property="og:title"\s+content="([^"]*)"/i)
        let title = titleMatch ? titleMatch[1].trim() : ''

        // Clean title
        title = title.replace(/\|.+$/, '').replace(/:.+$/, '').trim()

        const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i) ||
            html.match(/<meta\s+property="og:description"\s+content="([^"]*)"/i)
        const description = descMatch ? descMatch[1] : ''

        let images: string[] = []
        const ogImage = html.match(/<meta\s+property="og:image"\s+content="([^"]*)"/i)
        if (ogImage) images.push(ogImage[1])

        // 1. Look for all high-res image patterns in the HTML (including data-src, data-lazy, etc.)
        const broadImgRegex = /(?:src|data-src|data-lazy|data-original|data-zoom|data-high-res)=["'](https?:\/\/[^"']+\.(?:jpg|jpeg|png|webp|avif)[^"']*)["']/gi
        let m
        while ((m = broadImgRegex.exec(html)) !== null) {
            const src = m[1].split('?')[0] // Clean query params for better dedup
            if (src && !src.includes('logo') && !src.includes('icon') && !src.includes('sprite') && !src.includes('pixel') && !src.includes('badge')) {
                images.push(m[1])
            }
        }

        // 2. Scan script tags for any large image patterns (common in Shopify/WC galleries)
        const scriptureRegex = /["'](https?:\/\/[^"']+\.(?:jpg|jpeg|png|webp)[^"']*)["']/gi
        let scriptMatch
        while ((scriptMatch = scriptureRegex.exec(html)) !== null) {
            const src = scriptMatch[1]
            if (src.includes('products') || src.includes('files') || src.includes('cdn')) {
                if (!src.includes('logo') && !src.includes('icon')) {
                    images.push(src)
                }
            }
        }

        // Filter and deduplicate
        const seen = new Set<string>()
        images = images.filter(img => {
            const low = img.toLowerCase()
            const isGarbage = low.includes('logo') || low.includes('icon') || low.includes('loading') || low.includes('placeholder')
            const isThumb = low.includes('_50x') || low.includes('_100x') || low.includes('_thumb')
            if (isGarbage || isThumb || seen.has(img)) return false
            seen.add(img)
            return true
        })

        return { title, description, images: images.slice(0, 15) }
    }
}

// --- HELPERS ---
function decodeHtmlEntities(str: string) {
    return str.replace(/&[#a-zA-Z0-9]+;/g, (entity) => {
        const entities: { [key: string]: string } = {
            '&quot;': '"',
            '&amp;': '&',
            '&lt;': '<',
            '&gt;': '>',
            '&nbsp;': ' ',
            '&ndash;': '-',
            '&mdash;': '-',
            '&apos;': "'",
            '&#39;': "'",
            '&#x27;': "'"
        }
        return entities[entity] || entity
    })
}

// --- MAIN HANDLER ---

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { urls } = body

        if (!urls || !Array.isArray(urls) || urls.length === 0) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 })
        }

        const targetUrl = urls[0]
        console.log(`[Smart Extract] Processing: ${targetUrl}`)

        // 1. Fetch HTML
        let html = ''
        try {
            const response = await fetch(targetUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
                },
                next: { revalidate: 3600 }
            })
            if (response.ok) {
                html = await response.text()
            } else {
                console.log(`[Smart Extract] Fetch failed: ${response.status} for ${targetUrl}`)
            }
        } catch (e) {
            console.log(`[Smart Extract] Network error`, e)
        }

        // 2. Select Strategy
        let strategy = GenericStrategy
        if (AmazonStrategy.canHandle(targetUrl)) strategy = AmazonStrategy
        else if (FlipkartStrategy.canHandle(targetUrl)) strategy = FlipkartStrategy
        else if (MeeshoStrategy.canHandle(targetUrl)) strategy = MeeshoStrategy
        else if (DeoDapStrategy.canHandle(targetUrl)) strategy = DeoDapStrategy
        // Shopify & WP are often handled by Generic, but we can add specific checks if needed
        // Shopify detection usually needs HTML inspection or specific URL patterns (e.g. /products/)
        // We can add more specific detectors later.

        console.log(`[Smart Extract] Using strategy: ${strategy === GenericStrategy ? 'Generic' : 'Specific'}`)

        // 3. Extract
        let result = await strategy.extract(html, targetUrl)

        // 4. Post-processing / Fallback if extraction failed completely
        if (!result.title || result.title.includes('Access Denied')) {
            // Basic URL slug fallback
            const urlObj = new URL(targetUrl)
            const pathSegments = urlObj.pathname.split('/')
            const slug = pathSegments.sort((a, b) => b.length - a.length)[0]
            if (slug) {
                result.title = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                result.description = `Imported details for ${result.title}`
            } else {
                result.title = "Imported Product"
            }
        }

        // Decode HTML entities in title
        result.title = decodeHtmlEntities(result.title)

        // 5. Image Fallback
        if (!result.images || result.images.length === 0) {
            result.images = [
                "https://placehold.co/600x600/e2e8f0/1e293b?text=Image+1",
                "https://placehold.co/600x600/e2e8f0/1e293b?text=Image+2",
                "https://placehold.co/600x600/e2e8f0/1e293b?text=Source+Protected"
            ]
        }

        // 6. Construct Response
        const finalData = {
            specs: {
                title: result.title,
                description: result.description || `Premium quality ${result.title}.`,
                material: "Standard",
                dimensions: "Standard",
                weight: "N/A",
                features: "Premium Quality, Durable, Imported",
                variants: "Standard"
            },
            images: result.images.slice(0, 6),
            pricing: { cogs: '0', margin: '30' },
            sources: [targetUrl]
        }

        return NextResponse.json(finalData)

    } catch (error) {
        console.error('Generation Error:', error)
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal error' }, { status: 500 })
    }
}
