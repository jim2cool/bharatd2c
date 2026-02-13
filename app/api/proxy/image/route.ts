import { NextResponse } from 'next/server'

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const url = searchParams.get('url')

    if (!url) {
        return NextResponse.json({ error: 'Missing URL parameter' }, { status: 400 })
    }

    try {
        const decodedUrl = decodeURIComponent(url)
        console.log(`[Proxy] Fetching: ${decodedUrl}`)

        const response = await fetch(decodedUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
            }
        })

        if (!response.ok) {
            throw new Error(`Upstream error: ${response.status} ${response.statusText}`)
        }

        const arrayBuffer = await response.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        const headers = new Headers()
        headers.set('Content-Type', response.headers.get('Content-Type') || 'image/jpeg')
        headers.set('Cache-Control', 'public, max-age=31536000, immutable')
        headers.set('Content-Length', buffer.length.toString())

        return new Response(buffer, {
            status: 200,
            headers
        })
    } catch (error: any) {
        console.error('[Proxy Error]', error)
        return NextResponse.json({
            error: 'Failed to proxy image',
            details: error.message,
            url: url
        }, { status: 500 })
    }
}
