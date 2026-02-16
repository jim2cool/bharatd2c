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

    const normalizedPath = url.pathname.replace(/\/$/, "") || "/";
    const pathSegments = normalizedPath.split('/');
    const isLoginPath = pathSegments.includes("login");

    if (isAdminSubdomain && !isLoginPath) {
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
                        const isLocalhost = cleanHostname.includes('localhost')
                        const cookieOptions = {
                            ...options,
                            // Ensure the cookie is accessible by subdomains if we have a root domain, but not on localhost
                            domain: (process.env.NEXT_PUBLIC_ROOT_DOMAIN && !isLocalhost)
                                ? `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
                                : undefined,
                        }
                        response.cookies.set(name, value, cookieOptions)
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

    // 7. Authentication & Route Protection
    const {
        data: { user },
    } = await supabase.auth.getUser()


    if (isLoginPath) {
        return response;
    }

    if ((normalizedPath.startsWith("/admin") || normalizedPath.startsWith("/super-admin"))) {
        if (!user) {
            const isSuper = normalizedPath.startsWith("/super-admin");
            const redirectPath = isSuper ? "/super-admin/login" : "/login";

            // Final safety: never redirect to a login path from this block
            // (even though isLoginPath check above should have caught it)
            if (normalizedPath === redirectPath) return response;

            const redirectUrl = new URL(redirectPath, request.url);
            redirectUrl.searchParams.set("next", url.pathname);

            if (process.env.NODE_ENV === 'production' || request.headers.get('x-forwarded-proto') === 'https') {
                redirectUrl.protocol = 'https:';
            }

            return NextResponse.redirect(redirectUrl);
        }

        // Fetch profile once for all role checks
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        // Super-admin routes require super_admin role
        if (normalizedPath.startsWith("/super-admin")) {
            if (profile?.role !== 'super_admin') {
                return NextResponse.redirect(new URL('/admin?error=unauthorized', request.url))
            }
        }

        // Seller/Admin routes require at least 'seller' or 'admin' role
        if (normalizedPath.startsWith("/admin")) {
            const allowedRoles = ['seller', 'store_owner', 'admin', 'super_admin']
            if (!profile || !allowedRoles.includes(profile.role)) {
                return NextResponse.redirect(new URL('/login?error=unauthorized', request.url))
            }
        }
    }

    // 8. Handle Impersonation (only super-admins can impersonate)
    const impersonationId = request.cookies.get('impersonation_target_id')?.value
    if (impersonationId && user) {
        const { data: impersonatorProfile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (impersonatorProfile?.role === 'super_admin') {
            requestHeaders.set('x-impersonate-user-id', impersonationId)
            requestHeaders.set('x-is-impersonating', 'true')
            requestHeaders.set('x-impersonator-id', user.id)

            // Re-create response with new headers if needed, otherwise continue
            response = NextResponse.next({
                request: { headers: requestHeaders }
            })
        } else {
            // Non-super-admin trying to impersonate — clear the cookie with security flags
            response.cookies.delete('impersonation_target_id')
            response.cookies.set('impersonation_target_id', '', {
                maxAge: 0,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax'
            })
        }
    }

    return response
}
