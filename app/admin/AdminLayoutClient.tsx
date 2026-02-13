'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import StoreSwitcher from '@/components/admin/StoreSwitcher'
import { getActiveStoreIdClient } from '@/lib/getActiveStore.client'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { Toaster } from 'sonner'
import { Globe } from 'lucide-react'
import { getStoreBaseUrl } from '@/lib/getStoreUrl'

type NavItem =
  | { label: string; href: string }
  | { section: string }

export function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [storeId, setStoreId] = useState<string | null>(null)
  const [storeUrl, setStoreUrl] = useState<string>('/')

  // ✅ hydrate client-only storeId AFTER mount
  useEffect(() => {
    const sid = getActiveStoreIdClient()
    setStoreId(sid)

    if (sid) {
      getStoreBaseUrl(supabaseBrowser).then(url => setStoreUrl(url))
    }
  }, [])

  const NAV: NavItem[] = [
    { label: 'Home', href: '/admin' },
    { label: 'Manage Stores', href: '/admin/stores' },
    { label: 'Orders', href: '/admin/orders' },
    { label: 'Products', href: '/admin/products' },
    { label: 'Collections', href: '/admin/collections' },
    { label: 'Media', href: '/admin/media' },
    { label: 'Pages', href: '/admin/pages' },
    { label: 'Customers', href: '#' },
    { label: 'Analytics', href: '#' },

    { section: 'Operations' },
    { label: 'Shipping', href: '#' },
    { label: 'Payments', href: '#' },
    { label: 'Taxes', href: '#' },

    { section: 'Settings' },
    {
      label: 'Store settings',
      href: storeId ? `/admin/stores/${storeId}` : '/admin/stores',
    },
    { label: 'Domains', href: '/admin/settings/domains' },
    { label: 'Appearance', href: '/admin/settings/appearance' },
    { label: 'Users & permissions', href: '#' },
  ]

  return (
    <div className="flex min-h-screen bg-[#f6f6f7]">
      {/* LEFT NAV */}
      <aside className="w-[240px] bg-white border-r">
        <div className="px-4 py-4 border-b">
          <div className="text-lg font-semibold">Bharat D2C</div>
          <div className="text-xs text-gray-500">Admin</div>
        </div>

        <nav className="px-2 py-3 text-sm">
          {NAV.map((item, idx) =>
            'section' in item ? (
              <div
                key={idx}
                className="mt-4 mb-1 px-3 text-xs font-semibold text-gray-500 uppercase"
              >
                {item.section}
              </div>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className={`block px-3 py-2 rounded mb-1 ${pathname === item.href
                  ? 'bg-gray-100 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
                  } ${item.href === '#'
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                  }`}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>
      </aside>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex flex-col">
        <Toaster position="top-right" richColors />
        {/* TOP BAR */}
        <header className="h-[56px] bg-white border-b flex items-center justify-between px-6">
          <div className="text-sm font-medium text-gray-700">
            Admin
          </div>

          <div className="flex items-center gap-4 text-sm">
            {storeId && (
              <a
                href={storeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-1.5 bg-neutral-900 text-white rounded-xl text-xs font-black hover:bg-neutral-800 transition-all shadow-lg shadow-neutral-100"
              >
                <Globe className="w-3.5 h-3.5" />
                View Store
              </a>
            )}
            <StoreSwitcher />

            <Link href="/admin/stores" className="text-gray-600 hover:text-black">
              Manage Stores
            </Link>

            <button
              onClick={async () => {
                await supabaseBrowser.auth.signOut()
                router.push('/login')
              }}
              className="text-gray-600 hover:text-black"
            >
              Logout
            </button>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
