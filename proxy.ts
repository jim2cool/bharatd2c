import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}

export default async function middleware(request: NextRequest) {
    const url = request.nextUrl
    const hostname = request.headers.get('host') || ''

    // 1. Detect if it's an admin subdomain (e.g., admin.mystore.com)
    const isAdminSubdomain = hostname.startsWith('admin.')

    // 2. Extract the store slug/domain
    const cleanHostname = hostname.replace(/^www\./, '')
    const parts = cleanHostname.split('.')
    let storeSlug = ''

    // 3. Detect Platform Root (Landing Page)
    let isPlatformRoot = false
    if (cleanHostname.includes('localhost')) {
        if (parts.length === 1) isPlatformRoot = true
    } else {
        // Add production platform domain check here if known
    }

    // Logic for storeSlug
    if (cleanHostname.includes('localhost')) {
        if (parts.length >= 2) storeSlug = parts[0]
    } else if (parts.length >= 3) {
        storeSlug = parts[0]
    } else {
        storeSlug = cleanHostname
    }

    // Pass slug via headers
    const requestHeaders = new Headers(request.headers)

    if (isPlatformRoot) {
        requestHeaders.set('x-is-platform-root', 'true')
    } else if (storeSlug && storeSlug !== 'admin' && storeSlug !== 'www') {
        requestHeaders.set('x-store-slug', storeSlug)
    }

    // 4. Create Initial Response
    let response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    })

    if (isAdminSubdomain) {
        const path = url.pathname.startsWith('/admin') ? url.pathname : `/admin${url.pathname}`
        response = NextResponse.rewrite(new URL(`${path}${url.search}`, request.url), {
            request: { headers: requestHeaders }
        })
    }

    // 5. Initialize Supabase Client for Middleware
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        request.cookies.set(name, value)
                        response.cookies.set(name, value, options)
                    })
                },
            },
        }
    )

    // IMPORTANT: Refresh the session
    await supabase.auth.getUser()

    return response
}
