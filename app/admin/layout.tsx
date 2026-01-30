'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { label: 'Home', href: '/admin' },
  { label: 'Orders', href: '/admin/orders' },
  { label: 'Products', href: '/admin/products' },
  { label: 'Collections', href: '#' },
  { label: 'Customers', href: '#' },
  { label: 'Analytics', href: '#' },
  { label: 'Discounts', href: '#' },

  { section: 'Operations' },
  { label: 'Shipping', href: '#' },
  { label: 'Payments', href: '#' },
  { label: 'Taxes', href: '#' },

  { section: 'Settings' },
  { label: 'Store settings', href: '/admin/settings' },
  { label: 'Users & permissions', href: '#' },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen bg-[#f6f6f7]">
      {/* LEFT NAV */}
      <aside className="w-[240px] bg-white border-r">
        <div className="px-4 py-4 border-b">
          <div className="text-lg font-semibold">
            Bharat D2C
          </div>
          <div className="text-xs text-gray-500">
            Admin
          </div>
        </div>

        <nav className="px-2 py-3 text-sm">
          {NAV.map((item, idx) =>
            item.section ? (
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
                className={`block px-3 py-2 rounded mb-1 ${
                  pathname === item.href
                    ? 'bg-gray-100 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                } ${
                  item.href === '#'
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

      {/* MAIN */}
      <div className="flex-1 flex flex-col">
        {/* TOP BAR */}
        <header className="h-[56px] bg-white border-b flex items-center justify-between px-6">
          <div className="text-sm font-medium text-gray-700">
            Admin
          </div>

          <div className="flex items-center gap-4 text-sm">
            <button className="text-gray-600 hover:text-black">
              Account
            </button>
            <button className="text-gray-600 hover:text-black">
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
