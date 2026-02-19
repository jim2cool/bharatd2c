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
  const [storeId, setStoreId] = useState<string | null>(null)
  const [storeUrl, setStoreUrl] = useState<string>('/')

  useEffect(() => {
    const sid = getActiveStoreIdClient()
    setStoreId(sid)

    if (sid) {
      getStoreBaseUrl(supabaseBrowser).then(url => setStoreUrl(url))

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
      section: 'Pulse',
      items: [
        { label: 'Overview', href: '/admin', icon: LayoutDashboard },
        { label: 'Analytics', href: '#', icon: BarChart3 },
      ]
    },
    {
      section: 'Growth',
      items: [
        { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
        { label: 'Customers', href: '#', icon: Users },
        { label: 'Discounts', href: '/admin/discounts', icon: Percent },
        { label: 'Marketing', href: '/admin/marketing', icon: Megaphone },
      ]
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
      ]
    },
    {
      section: 'Config',
      items: [
        { label: 'Domain', href: '/admin/settings/domains', icon: Globe2 },
        { label: 'Settings', href: '/admin/settings/general', icon: Settings },
      ]
    }
  ]

  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-[#f8fafc]">
      {/* LEFT NAV */}
      <aside className="w-[260px] bg-white border-r border-slate-100 flex flex-col admin-pulse-sidebar sticky top-0 h-screen">
        <div className="px-6 py-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-neutral-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-neutral-200">
              <div className="w-4 h-4 border-2 border-white rounded-sm rotate-45" />
            </div>
            <div>
              <div className="text-base font-black text-neutral-900 tracking-tighter uppercase">Easy D2C</div>
              <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest -mt-1">Pulse Enterprise</div>
            </div>
          </div>
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
                    <Icon className="shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-50" />}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        {/* BOTTOM SECTION */}
        <div className="p-4 border-t border-slate-50 space-y-2">
          {storeId && (
            <a
              href={storeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-neutral-900 text-white rounded-2xl shadow-xl shadow-neutral-100 group transition-all hover:bg-neutral-800"
            >
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-blue-400" />
                <span className="text-[11px] font-black uppercase tracking-widest">Live Store</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-50 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          )}

          <div className="p-2 flex items-center justify-between">
            <StoreSwitcher />
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
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Toaster position="top-right" richColors />

        {/* TOP BAR */}
        <header className="h-[72px] bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-10 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-black text-neutral-900 uppercase tracking-widest opacity-40">
              {GROUPS.find(g => g.items.some(i => i.href === pathname))?.section || 'Admin'}
            </h2>
            <ChevronRight className="w-3 h-3 text-neutral-300" />
            <h1 className="text-sm font-black text-neutral-900 uppercase tracking-widest">
              {GROUPS.flatMap(g => g.items).find(i => i.href === pathname)?.label || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Cloud Engine: Active</span>
            </div>
            <button className="w-10 h-10 bg-neutral-900 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform hover:scale-105 active:scale-95">
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto p-10 bg-[#f8fafc]/50">
          {children}
        </main>

        {/* FLOATING QUICK ACTIONS */}
        <div className="fixed bottom-10 right-10 z-50 flex flex-col items-end gap-4">
          {isOpen && (
            <div className="flex flex-col gap-3 mb-2 animate-in slide-in-from-bottom-10 fade-in duration-300">
              <a
                href={storeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-3 bg-white border border-slate-100 rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl hover:bg-slate-50 transition-all group"
              >
                <Globe className="w-4 h-4 text-blue-600" />
                <span>View Store</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-30 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
              <Link
                href="/admin/products/new"
                className="flex items-center gap-3 px-6 py-3 bg-white border border-slate-100 rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl hover:bg-slate-50 transition-all group"
              >
                <Plus className="w-4 h-4 text-neutral-900" />
                <span>Create Product</span>
              </Link>
            </div>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`w-16 h-16 rounded-[2rem] flex items-center justify-center text-white shadow-2xl transition-all duration-500 scale-110 active:scale-95 fab-glow ${isOpen ? 'bg-neutral-900 rotate-45' : 'bg-blue-600'
              }`}
          >
            <Plus className="w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  )
}

function ArrowUpRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 7h10v10" /><path d="M7 17L17 7" />
    </svg>
  )
}
