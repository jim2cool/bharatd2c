/**
 * Simple in-memory rate limiter for API routes.
 *
 * For production at scale, replace with Redis-backed solution.
 * This works well for single-instance deployments (Vercel, single server).
 */

interface RateLimitEntry {
    count: number
    resetAt: number
}

const store = new Map<string, RateLimitEntry>()

// Clean up expired entries every 5 minutes
setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of store) {
        if (now > entry.resetAt) {
            store.delete(key)
        }
    }
}, 5 * 60 * 1000)

interface RateLimitConfig {
    /** Max requests allowed in the window */
    maxRequests: number
    /** Time window in seconds */
    windowSeconds: number
}

interface RateLimitResult {
    allowed: boolean
    remaining: number
    resetAt: number
}

export function rateLimit(key: string, config: RateLimitConfig): RateLimitResult {
    const now = Date.now()
    const windowMs = config.windowSeconds * 1000
    const entry = store.get(key)

    if (!entry || now > entry.resetAt) {
        // First request or window expired — start fresh
        const newEntry: RateLimitEntry = {
            count: 1,
            resetAt: now + windowMs,
        }
        store.set(key, newEntry)
        return { allowed: true, remaining: config.maxRequests - 1, resetAt: newEntry.resetAt }
    }

    if (entry.count >= config.maxRequests) {
        return { allowed: false, remaining: 0, resetAt: entry.resetAt }
    }

    entry.count++
    return { allowed: true, remaining: config.maxRequests - entry.count, resetAt: entry.resetAt }
}
