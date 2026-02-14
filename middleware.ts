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
    const cleanHostname = hostname.split(':')[0].replace(/^www\./, '')
    const parts = cleanHostname.split('.')
    let storeSlug = ''

    // 3. Detect Platform Root (Landing Page)
    let isPlatformRoot = false
    if (cleanHostname.includes('localhost')) {
        if (parts.length === 1) isPlatformRoot = true
    } else {
        if (
            cleanHostname === 'easy-d2c.com' ||
            cleanHostname === 'www.easy-d2c.com' ||
            cleanHostname === 'bharat-d2c.com' ||
            cleanHostname === 'www.bharat-d2c.com'
        ) {
            isPlatformRoot = true
        }
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

    // 6. Maintenance Mode Check
    try {
        const { data: maintenanceSetting } = await supabase
            .from('platform_settings')
            .select('value')
            .eq('key', 'maintenance_mode')
            .single()

        const isMaintenance = maintenanceSetting?.value === true || maintenanceSetting?.value === 'true'

        if (isMaintenance && !url.pathname.startsWith('/super-admin') && !url.pathname.startsWith('/login')) {
            // Check if user is super-admin before blocking
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
                if (profile?.role !== 'super_admin') {
                    return NextResponse.rewrite(new URL('/maintenance', request.url))
                }
            } else {
                return NextResponse.rewrite(new URL('/maintenance', request.url))
            }
        }
    } catch (e) {
        console.warn("Maintenance check failed, continuing...")
    }

    // 7. Handle Impersonation
    const impersonationId = request.cookies.get('impersonation_target_id')?.value
    if (impersonationId) {
        requestHeaders.set('x-impersonate-user-id', impersonationId)
        // Adjust response with updated headers
        response = NextResponse.next({
            request: { headers: requestHeaders }
        })
    }

    // 8. Authentication & Route Protection
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (url.pathname.startsWith("/admin") || url.pathname.startsWith("/super-admin")) {
        if (!user) {
            const redirectUrl = request.nextUrl.clone();
            const isSuper = url.pathname.startsWith("/super-admin");
            redirectUrl.pathname = isSuper ? "/super-admin/login" : "/login";
            redirectUrl.searchParams.set("next", request.nextUrl.pathname);
            return NextResponse.redirect(redirectUrl);
        }
    }

    return response
}
