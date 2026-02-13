'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase-browser'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { getActiveStoreIdClient } from '@/lib/getActiveStore.client'

type RangeKey = 'today' | 'yesterday' | '7d' | '30d'
type TopProduct = {
  title: string
  qty: number
  profit: number
}
type RecentOrder = {
  id: string
  order_number: string
  total_amount: number
  order_items: {
    products?: {
      title?: string
    }
  }[]
}


const STATUS_COLORS: Record<string, string> = {
  new: '#9CA3AF',
  confirmed: '#2563EB',
  shipped: '#16A34A',
  cancelled: '#DC2626',
}

import { ArrowRight, CheckCircle2, Circle, Plus, Settings, ShoppingBag, Truck, Sparkles } from 'lucide-react'
import { OnboardingChecklist } from './components/OnboardingChecklist'
// ... existing imports

export default function AdminDashboard() {
  const router = useRouter()
  const [storeId, setStoreId] = useState<string | null>(null)

  // Dashboard State
  const [loading, setLoading] = useState(true)
  const [isNewStore, setIsNewStore] = useState(false)

  // Analytics State
  const [range, setRange] = useState<RangeKey>('today')
  const [stats, setStats] = useState<any>(null)

  // Onboarding State
  const [checklist, setChecklist] = useState({
    hasProducts: false,
    hasDomain: false,
    hasShipping: false,
    hasTheme: false,
    hasPages: false
  })

  /* ----------------------------------------
     STORE CONTEXT GUARD
  ---------------------------------------- */
  useEffect(() => {
    const id = getActiveStoreIdClient()
    if (!id) {
      router.replace('/admin/stores')
      return
    }
    setStoreId(id)
  }, [router])

  /* ----------------------------------------
     LOAD DATA
  ---------------------------------------- */
  useEffect(() => {
    if (!storeId) return
    checkStoreStatus(storeId)
  }, [storeId, range])

  const checkStoreStatus = async (activeStoreId: string) => {
    setLoading(true)

    // 1. Check Products (Indicator of "New" store)
    const { count: productCount } = await supabaseBrowser
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('store_id', activeStoreId)

    // 2. Check Pages
    const { count: pagesCount } = await supabaseBrowser
      .from('pages')
      .select('*', { count: 'exact', head: true })
      .eq('store_id', activeStoreId)

    // 3. Check Store Config for Checklist
    const { data: store } = await supabaseBrowser
      .from('stores')
      .select('domain, theme_config')
      .eq('id', activeStoreId)
      .single()

    const hasProducts = (productCount || 0) > 0

    // Update Checklist State
    setChecklist({
      hasProducts,
      hasDomain: !!store?.domain,
      hasPages: (pagesCount || 0) > 0,
      hasTheme: !!store?.theme_config && Object.keys(store.theme_config).length > 0,
      hasShipping: false, // Placeholder
    })

    // If no products, treating as "New Store" -> Show Checklist
    if (!hasProducts) {
      setIsNewStore(true)
      setLoading(false)
      return
    }

    // Otherwise, load full dashboard
    setIsNewStore(false)
    await loadDashboard(activeStoreId)
  }

  const loadDashboard = async (activeStoreId: string) => {

    const now = new Date()
    let from = new Date()

    if (range === 'today') from.setHours(0, 0, 0, 0)
    if (range === 'yesterday') {
      from.setDate(from.getDate() - 1)
      from.setHours(0, 0, 0, 0)
      now.setDate(now.getDate() - 1)
      now.setHours(23, 59, 59, 999)
    }
    if (range === '7d') from.setDate(from.getDate() - 7)
    if (range === '30d') from.setDate(from.getDate() - 30)

    const { data: orders } = await supabaseBrowser
      .from('orders')
      .select(`
        id, order_number, status, total_amount, created_at,
        order_items (qty, price, products (title, cogs))
      `)
      .eq('store_id', activeStoreId)
      .gte('created_at', from.toISOString())
      .lte('created_at', now.toISOString())

    const safeOrders = orders || []
    let revenue = 0, profit = 0
    let statusCount: Record<string, number> = {}
    let hourly: Record<string, number> = {}
    let productMap: Record<string, { qty: number; profit: number }> = {}

    safeOrders.forEach(order => {
      revenue += order.total_amount || 0
      statusCount[order.status] = (statusCount[order.status] || 0) + 1
      const hour = new Date(order.created_at).getHours()
      hourly[hour] = (hourly[hour] || 0) + 1
      order.order_items?.forEach((i: any) => {
        const title = i.products?.title || 'Unknown'
        const cogs = i.products?.cogs || 0
        const itemProfit = (i.price - cogs) * i.qty
        if (!productMap[title]) productMap[title] = { qty: 0, profit: 0 }
        productMap[title].qty += i.qty
        productMap[title].profit += itemProfit
        profit += itemProfit
      })
    })

    setStats({
      orders: safeOrders.length,
      revenue,
      profit,
      margin: revenue ? Math.round((profit / revenue) * 100) : 0,
      statusCount,
      hourly,
      topProducts: Object.entries(productMap).map(([t, v]) => ({ title: t, ...v })).sort((a, b) => b.qty - a.qty).slice(0, 5),
      recentOrders: safeOrders.slice(0, 5),
    })
    setLoading(false)
  }

  /* ----------------------------------------
     RENDER
  ---------------------------------------- */
  if (!storeId || loading) return <div className="p-6">Loading...</div>

  // ---------------- NEW STORE CHECKLIST VIEW ----------------
  // ---------------- NEW STORE CHECKLIST VIEW ----------------
  if (isNewStore) {
    return (
      <div className="bg-[#fafafa] min-h-screen">
        <div className="max-w-5xl mx-auto pt-12 px-6">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl shadow-blue-200/50 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-700">
              <Sparkles className="w-32 h-32" />
            </div>
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                ✨ Pro Feature
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter mb-4 leading-tight">
                Get ready to sell <br /> in seconds, not hours.
              </h1>
              <p className="text-blue-50 font-medium text-lg mb-8 opacity-90">
                Generate your first items with AI. Just paste a link and let our engine handle the photos, descriptions, and pricing.
              </p>
              <Link
                href="/admin/products/generate"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 rounded-2xl text-sm font-black hover:bg-blue-50 transition-all shadow-xl hover:-translate-y-1 active:translate-y-0"
              >
                Launch AI Generator <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
        <OnboardingChecklist checklist={checklist} />
      </div>
    )
  }

  // ---------------- EXISTING DASHBOARD VIEW ----------------
  // (Re-using old render logic here, assuming stats is populated)
  if (!stats) return <div>Loading stats...</div>

  const pieData = Object.entries(stats.statusCount || {}).map(([k, v]) => ({ name: k, value: v }))
  const barData = Object.entries(stats.hourly || {}).map(([h, v]) => ({ hour: `${h}:00`, orders: v }))

  return (
    <div className="p-8 space-y-8 bg-[#fafafa] min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-neutral-900 tracking-tight">Store Overview</h1>
          <p className="text-neutral-500 text-sm font-medium mt-1">Real-time performance metrics for your store.</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl border border-neutral-200 shadow-sm">
          {(['today', 'yesterday', '7d', '30d'] as RangeKey[]).map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${range === r
                ? 'bg-neutral-900 text-white shadow-md'
                : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
                }`}
            >
              {r === 'today' ? 'Today' : r === 'yesterday' ? 'Yesterday' : r === '7d' ? '7 Days' : '30 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Stat
          label="Total Revenue"
          value={`₹${stats.revenue.toLocaleString()}`}
          icon={<ShoppingBag className="w-4 h-4 text-blue-600" />}
          trend="+12.5%"
        />
        <Stat
          label="Total Orders"
          value={stats.orders}
          icon={<CheckCircle2 className="w-4 h-4 text-green-600" />}
        />
        <Stat
          label="Gross Profit"
          value={`₹${stats.profit.toLocaleString()}`}
          icon={<ArrowRight className="w-4 h-4 text-purple-600" />}
        />
        <Stat
          label="Avg. Margin"
          value={`${stats.margin}%`}
          icon={<Settings className="w-4 h-4 text-orange-600" />}
        />
        <Stat
          label="Pending Orders"
          value={stats.statusCount?.new || 0}
          icon={<Truck className="w-4 h-4 text-red-600" />}
          sub="Requires fulfillment"
        />
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Sales Velocity" sub="Order volume tracked hourly">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="hour"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#94a3b8' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                allowDecimals={false}
              />
              <Tooltip
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="orders" fill="url(#barGradient)" radius={[4, 4, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Order Distribution" sub="Status breakdown for current range">
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={5}
                  stroke="none"
                >
                  {pieData.map((d: any) => (
                    <Cell key={d.name} fill={STATUS_COLORS[d.name] || '#e2e8f0'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-black text-neutral-900">{stats.orders}</span>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Orders</span>
            </div>
          </div>
        </Card>
      </div>

      {/* BOTTOM ROWS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Top Performing Products" sub="Ranked by units sold">
          <div className="space-y-4 pt-2">
            {stats.topProducts?.map((p: TopProduct, i: number) => (
              <div key={p.title} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-neutral-50 border border-neutral-100 flex items-center justify-center text-xs font-bold text-neutral-400 group-hover:bg-neutral-900 group-hover:text-white transition-all">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-neutral-900 group-hover:underline">{p.title}</p>
                    <p className="text-[11px] text-neutral-400 font-medium">{p.qty} Units Sold</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-neutral-900">₹{p.profit.toLocaleString()}</p>
                  <p className="text-[10px] text-green-600 font-bold uppercase tracking-tight">Net Profit</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Recent Transactions" sub="Latest customer orders">
          <div className="space-y-4 pt-2">
            {stats.recentOrders?.map((o: RecentOrder) => {
              const firstItem = o.order_items?.[0]?.products?.title || 'Direct Order'
              const extra = o.order_items.length > 1 ? ` +${o.order_items.length - 1} items` : ''
              return (
                <div key={o.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <div>
                      <Link href={`/admin/orders/${o.id}`} className="text-sm font-bold text-neutral-900 hover:underline">
                        {firstItem}{extra}
                      </Link>
                      <p className="text-[11px] text-neutral-400 font-mono tracking-tighter">#{o.order_number}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-neutral-900">₹{o.total_amount.toLocaleString()}</p>
                    <Link href={`/admin/orders/${o.id}`} className="text-[10px] text-blue-600 font-bold uppercase tracking-widest hover:underline">
                      Details
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}

/* ----------------------------------------
   UPGRADED UI COMPONENTS
---------------------------------------- */

function Stat({ label, value, icon, sub, trend }: any) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-neutral-100 shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between h-full">
      <div className="flex justify-between items-start">
        <div className="p-2.5 rounded-2xl bg-neutral-50 border border-neutral-100 group-hover:bg-neutral-900 group-hover:text-white transition-all">
          {icon}
        </div>
        {trend && (
          <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">{label}</p>
        <p className="text-3xl font-black text-neutral-900 mt-1 tracking-tight">{value}</p>
        {sub && <p className="text-[10px] text-neutral-400 font-medium mt-1">{sub}</p>}
      </div>
    </div>
  )
}

function Card({ title, sub, children }: any) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-neutral-100 shadow-sm relative overflow-hidden">
      <div className="mb-8">
        <h3 className="text-xl font-black text-neutral-900 tracking-tight">{title}</h3>
        {sub && <p className="text-sm text-neutral-400 font-medium">{sub}</p>}
      </div>
      {children}
    </div>
  )
}
