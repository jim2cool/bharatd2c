import { createBrowserClient } from '@supabase/ssr'

export const supabaseBrowser = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    cookieOptions: {
      domain: (process.env.NEXT_PUBLIC_ROOT_DOMAIN && typeof window !== 'undefined' && !window.location.hostname.includes('localhost'))
        ? `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
        : undefined,
    },
  }
)
