'use client'
import Link from 'next/link'
import './admin-pulse.css'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import StoreSwitcher from '@/components/admin/StoreSwitcher'
import { getActiveStoreIdClient } from '@/lib/getActiveStore.client'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { Toaster, toast } from 'sonner'
import {
  Globe,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  BarChart3,
  Settings,
  Globe2,
  Palette,
  Megaphone,
  FileText,
  Image as ImageIcon,
  Layers,
  Percent,
  ChevronRight,
  LogOut,
  Plus,
  Truck,
  Sparkles
} from 'lucide-react'
import { getStoreBaseUrl } from '@/lib/getStoreUrl'
import { Menu, X, ArrowUpRight } from 'lucide-react'

type NavItem = {
  label: string
  href: string
  icon: any
}

type NavGroup = {
  section: string
  items: NavItem[]
}

export function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [storeId, setStoreId] = useState<string | null>(null)
  const [storeName, setStoreName] = useState<string>('Easy D2C')
  const [storeUrl, setStoreUrl] = useState<string>('/')
  const [architecture, setArchitecture] = useState<string>('product-engine')

  useEffect(() => {
    setMounted(true)
    const sid = getActiveStoreIdClient()
    setStoreId(sid)

    if (sid) {
      getStoreBaseUrl(supabaseBrowser).then(url => setStoreUrl(url))

      // Fetch Store Info
      supabaseBrowser.from('stores').select('name, theme_config').eq('id', sid).single().then(({ data }) => {
        if (data?.name) setStoreName(data.name)
        if (data?.theme_config?.architecture) {
          setArchitecture(data.theme_config.architecture)
        }
      })

      // 🛰️ REAL-TIME ORDER NOTIFICATIONS (Optimized)
      const channel = supabaseBrowser.channel('admin-order-pulse')

      let lastToast = 0;

      channel
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'orders',
            filter: `store_id=eq.${sid}`
          },
          (payload) => {
            // Prevent spam: only show 1 toast every 2 seconds
            const now = Date.now();
            if (now - lastToast < 2000) return;
            lastToast = now;

            const newOrder = payload.new as any
            toast.success('New Order Received!', {
              description: `Order #${newOrder.order_number} just landed.`,
              action: {
                label: 'View Order',
                onClick: () => router.push(`/admin/orders/${newOrder.id}`)
              },
              duration: 8000,
            })
          }
        )
        .subscribe()

      return () => {
        supabaseBrowser.removeChannel(channel)
      }
    }
  }, [router])

  const GROUPS: NavGroup[] = [
    {
      section: 'Overview',
      items: [
        { label: 'Overview', href: '/admin', icon: LayoutDashboard },
        { label: 'Analytics', href: '#', icon: BarChart3 },
      ]
    },
    {
      section: 'Growth',
      items: [
        { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
        { label: 'Customers', href: '/admin/customers', icon: Users },
        { label: 'Discounts', href: '/admin/discounts', icon: Percent },
        { label: 'Marketing', href: '/admin/marketing', icon: Megaphone },
      ].filter(item => {
        if (architecture === 'story-first' && item.label === 'Discounts') return false;
        return true;
      })
    },
    {
      section: 'Storefront',
      items: [
        { label: 'Products', href: '/admin/products', icon: Package },
        { label: 'Collections', href: '/admin/collections', icon: Layers },
        { label: 'Media', href: '/admin/media', icon: ImageIcon },
        { label: 'Pages', href: '/admin/pages', icon: FileText },
        { label: 'Appearance', href: '/admin/settings/appearance', icon: Palette },
      ]
    },
    {
      section: 'Operations',
      items: [
        { label: 'Logistics', href: '/admin/logistics', icon: Truck },
        { label: 'Dropshipping', href: '/admin/dropshipping', icon: Package },
      ].filter(item => {
        if (architecture === 'story-first') return false;
        return true;
      })
    },
    {
      section: 'Channels',
      items: [
        { label: 'Meta (Instagram/FB)', href: '/admin/channels/meta', icon: Globe2 },
        { label: 'Google (Ads/Analytics)', href: '/admin/channels/google', icon: Globe2 },
      ]
    },
    {
      section: 'Config',
      items: [
        { label: 'Domain', href: '/admin/settings/domains', icon: Globe2 },
        { label: 'Settings', href: '/admin/settings/general', icon: Settings },
      ]
    }
  ].filter(group => group.items.length > 0);

  const [isOpen, setIsOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Close mobile menu on path change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  return (
    <div className="flex h-dvh overflow-hidden bg-[#f8fafc]">
      {/* MOBILE MENU OVERLAY */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* LEFT NAV */}
      <aside className={`
        fixed inset-y-0 left-0 w-[280px] bg-white border-r border-slate-100 flex flex-col z-[60] transition-transform duration-300 lg:static lg:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="px-6 py-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200 group-hover:scale-110 transition-transform duration-500">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="text-base font-black text-neutral-900 tracking-tighter uppercase">{storeName}</div>
              <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest -mt-1 font-mono">Control Center</div>
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 lg:hidden text-neutral-400 hover:text-neutral-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto pb-8 scrollbar-hide">
          {GROUPS.map((group, gIdx) => (
            <div key={gIdx} className="mb-6">
              <div className="nav-group-title">{group.section}</div>
              {group.items.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                const isPlaceholder = item.href === '#'

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`nav-item ${isActive ? 'active' : ''} ${isPlaceholder ? 'opacity-40 cursor-not-allowed grayscale' : ''}`}
                    onClick={(e) => isPlaceholder && e.preventDefault()}
                  >
                    <Icon className={`shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'}`} />
                    <span className="flex-1">{item.label}</span>
                    {isActive ? (
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)]" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-40 transition-opacity" />
                    )}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        {/* BOTTOM SECTION */}
        <div className="p-4 border-t border-slate-50">
          <div className="p-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-black text-blue-600">
                {storeName.substring(0, 2).toUpperCase()}
              </div>
              <div className="hidden sm:block">
                <p className="text-[10px] font-black text-neutral-900 uppercase tracking-widest leading-none">Admin</p>
                <p className="text-[9px] font-bold text-neutral-400 uppercase mt-0.5">Manage Store</p>
              </div>
            </div>
            <button
              onClick={async () => {
                await supabaseBrowser.auth.signOut()
                router.push('/login')
              }}
              className="p-2.5 rounded-xl hover:bg-neutral-50 text-neutral-400 hover:text-red-500 transition-all"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Toaster position="top-right" richColors />

        {/* TOP BAR */}
        <header className="h-[72px] bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-40 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 lg:hidden text-neutral-600 hover:bg-neutral-50 rounded-xl transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2">
              {mounted ? (
                <>
                  <Link
                    href="/admin"
                    className="text-[10px] font-black text-neutral-900 uppercase tracking-widest opacity-40 hover:opacity-100 hover:text-blue-600 transition-all"
                  >
                    Admin
                  </Link>
                  <ChevronRight className="w-3 h-3 text-neutral-300" />
                  {pathname !== '/admin' && (
                    <>
                      <Link
                        href={pathname}
                        className="text-[10px] font-black text-neutral-900 uppercase tracking-widest hover:text-blue-600 transition-all"
                      >
                        {GROUPS.flatMap(g => g.items).find(i => i.href === pathname)?.label || pathname.split('/').pop()}
                      </Link>
                    </>
                  )}
                  {pathname === '/admin' && (
                    <span className="text-[10px] font-black text-neutral-900 uppercase tracking-widest">
                      Overview
                    </span>
                  )}
                </>
              ) : (
                <div className="h-4 w-24 bg-neutral-100 animate-pulse rounded-md" />
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {storeId && (
              <a
                href={storeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 transition-all shadow-lg shadow-neutral-200"
              >
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                <span>Live Store</span>
              </a>
            )}

            <div className="h-6 w-px bg-slate-100 hidden sm:block mx-1" />

            <div className="flex items-center gap-2">
              <StoreSwitcher />
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 bg-[#f8fafc]/50">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

