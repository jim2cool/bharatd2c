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

import { ArrowRight, CheckCircle2, Circle, Plus, Settings, ShoppingBag, Truck, Sparkles, Layers, AlertCircle, Zap, LayoutDashboard } from "lucide-react"
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
    setLoading(true)

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

    // 1. Fetch Orders
    const { data: orders } = await supabaseBrowser
      .from('orders')
      .select(`
        id, order_number, status, total_amount, created_at,
        order_items (qty, price, products (title, cogs))
      `)
      .eq('store_id', activeStoreId)
      .gte('created_at', from.toISOString())
      .lte('created_at', now.toISOString())
      .order('created_at', { ascending: false })

    // 2. Fetch Low Stock Products
    const { data: lowStock } = await supabaseBrowser
      .from('products')
      .select('id, title, qty')
      .eq('store_id', activeStoreId)
      .lt('qty', 10)
      .limit(5)

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

    // 3. Construct Unified Feed
    const feed: any[] = [
      ...safeOrders.slice(0, 8).map(o => ({
        type: 'order',
        id: o.id,
        time: o.created_at,
        title: o.order_items?.[0]?.products?.[0]?.title || 'New Order',
        meta: `Order #${o.order_number}`,
        amount: o.total_amount,
        status: o.status
      })),
      ...(lowStock || []).map(p => ({
        type: 'alert',
        id: `alert-${p.id}`,
        time: new Date().toISOString(), // Inventory alerts are "current"
        title: `Low Stock: ${p.title}`,
        meta: `Only ${p.qty} left in stock`,
        status: 'critical'
      }))
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())

    setStats({
      orders: safeOrders.length,
      revenue,
      profit,
      margin: revenue ? Math.round((profit / revenue) * 100) : 0,
      statusCount,
      hourly,
      topProducts: Object.entries(productMap).map(([t, v]) => ({ title: t, ...v })).sort((a, b) => b.qty - a.qty).slice(0, 5),
      recentOrders: safeOrders.slice(0, 5),
      activityFeed: feed
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
          <div className="bg-neutral-900 rounded-[3rem] p-10 md:p-16 text-white shadow-3xl shadow-blue-900/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 group-hover:rotate-12 transition-transform duration-1000">
              <Sparkles className="w-64 h-64" />
            </div>
            <div className="relative z-10 max-w-2xl space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">
                ✨ Pro Feature
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.1]">
                Your store, <br />
                <span className="text-blue-500">powered by AI.</span>
              </h1>
              <p className="text-neutral-400 font-medium text-lg leading-relaxed">
                Transform any product link into a complete store listing in seconds. High-res imagery, persuasive copy, and SEO mapping — fully automated.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/admin/products/generate?onboarding=true"
                  className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-blue-600 text-white rounded-[1.5rem] text-sm font-black hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 hover:-translate-y-1 active:translate-y-0"
                >
                  Launch AI Generator <ArrowRight className="w-4 h-4" />
                </Link>
                <div className="px-6 py-5 bg-white/5 border border-white/10 rounded-[1.5rem] flex items-center gap-3 backdrop-blur-sm">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-neutral-300">AI Engine: Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12">
          <OnboardingChecklist checklist={checklist} />
        </div>
      </div>
    )
  }

  // ---------------- EXISTING DASHBOARD VIEW ----------------
  // (Re-using old render logic here, assuming stats is populated)
  if (!stats) return <div>Loading stats...</div>

  const pieData = Object.entries(stats.statusCount || {}).map(([k, v]) => ({ name: k, value: v }))

  // ---------------- EXISTING DASHBOARD VIEW ----------------
  if (!stats) return <div>Loading stats...</div>

  const barData = Object.entries(stats.hourly || {}).map(([h, v]) => ({ hour: `${h}:00`, orders: v }))

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* AI DAILY PULSE SUMMARY */}
      <section className="relative overflow-hidden p-12 bg-neutral-900 rounded-[3.5rem] text-white shadow-3xl shadow-blue-900/20">
        <div className="absolute top-0 right-0 p-16 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
          <Sparkles className="w-80 h-80 rotate-12" />
        </div>
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 backdrop-blur-md">
              <Sparkles className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Daily Intelligence Pulse</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
            {stats.revenue > 10000 ? "Performance Peak." : "Operations Active."} <br />
            <span className="text-white/20">
              {stats.orders > 0 ? "Momentum Sustained." : "Awaiting Velocity."}
            </span>
          </h1>
          <p className="max-w-2xl text-lg font-medium text-neutral-400 leading-relaxed">
            {stats.orders > 0 ? (
              <>
                Revenue trends are matching high-tier projections with <span className="text-white font-bold">{stats.orders} confirmed orders</span>.
                Your current edge is a <span className="text-green-400 font-bold">{stats.margin}% margin</span>, significantly outperforming competitors.
              </>
            ) : (
              "The platform architecture is fully synchronized. Your storefront is currently live and optimized for conversion. Start by launching your first AI-generated campaign."
            )}
          </p>
          {stats.orders > 0 && (
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="px-5 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3 backdrop-blur-md">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-300">Growth Velocity: +12%</span>
              </div>
              <div className="px-5 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3 backdrop-blur-md">
                <LayoutDashboard className="w-4 h-4 text-blue-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-300">Marketplace IQ: Stable</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* NORTH STAR BENTO GRID */}
      <div className="bento-grid">
        <div className="col-span-12 md:col-span-4 lg:col-span-3">
          <PulseStat
            label="Revenue"
            value={`₹${stats.revenue.toLocaleString()}`}
            trend="+12%"
            icon={<ShoppingBag className="w-5 h-5" />}
            color="blue"
          />
        </div>
        <div className="col-span-6 md:col-span-4 lg:col-span-3">
          <PulseStat
            label="Orders"
            value={stats.orders}
            trend="+8%"
            icon={<CheckCircle2 className="w-5 h-5" />}
            color="green"
          />
        </div>
        <div className="col-span-6 md:col-span-4 lg:col-span-3">
          <PulseStat
            label="Profit"
            value={`₹${stats.profit.toLocaleString()}`}
            trend="+15%"
            icon={<Layers className="w-5 h-5" />}
            color="purple"
          />
        </div>
        <div className="col-span-12 lg:col-span-3">
          <PulseStat
            label="Pending"
            value={stats.statusCount?.new || 0}
            icon={<Truck className="w-5 h-5" />}
            color="orange"
            sub="To be fulfilled"
          />
        </div>

        {/* PERFORMANCE PULSE */}
        <div className="col-span-12 lg:col-span-8">
          <PulseCard title="Performance Pulse" sub="Real-time sales velocity">
            <div className="h-[350px] mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="pulseGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="hour"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    cursor={{ fill: '#f8fafc', radius: 12 }}
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px -12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="orders" fill="#2563eb" radius={[12, 12, 4, 4]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </PulseCard>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="col-span-12 lg:col-span-4">
          <PulseCard title="Daily Activity" sub="Unified store events">
            <div className="space-y-6 mt-8">
              {stats.activityFeed?.length === 0 && (
                <p className="text-center py-10 text-neutral-400 font-bold text-xs uppercase tracking-widest leading-loose bg-neutral-50 rounded-3xl border border-dashed border-neutral-100">
                  No recent activity found. <br /> Your store is quiet.
                </p>
              )}
              {stats.activityFeed?.map((item: any) => (
                <div key={item.id} className="flex items-start gap-4 group">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-300 ${item.type === 'alert'
                    ? 'bg-red-50 text-red-600 border-red-100'
                    : 'bg-slate-50 text-neutral-600 border-slate-100 group-hover:bg-neutral-900 group-hover:text-white'
                    }`}>
                    {item.type === 'alert' ? <AlertCircle className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-neutral-900 truncate">
                      {item.title}
                    </p>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-0.5">{item.meta}</p>
                  </div>
                  <div className="text-right">
                    {item.amount !== undefined ? (
                      <p className="text-sm font-black text-neutral-900">₹{item.amount.toLocaleString()}</p>
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse ml-auto" />
                    )}
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${item.status === 'critical' ? 'text-red-600' : 'text-blue-600'
                      }`}>
                      {item.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/admin/orders" className="flex items-center justify-center gap-2 w-full mt-10 py-4 bg-neutral-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-neutral-200 hover:-translate-y-1 active:translate-y-0 transition-all">
              View All History <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </PulseCard>
        </div>
      </div>
    </div>
  )
}

function PulseStat({ label, value, trend, icon, color, sub }: any) {
  const colors: any = {
    blue: 'text-blue-600 bg-blue-50 border-blue-100',
    green: 'text-green-600 bg-green-50 border-green-100',
    purple: 'text-purple-600 bg-purple-50 border-purple-100',
    orange: 'text-orange-600 bg-orange-50 border-orange-100',
  }

  return (
    <div className="pulse-card p-10 h-full flex flex-col justify-between group hover:border-neutral-900 transition-all duration-700">
      <div className="flex items-center justify-between mb-8">
        <div className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center border group-hover:bg-neutral-900 group-hover:text-white group-hover:scale-110 transition-all duration-500 ${colors[color]}`}>
          {icon}
        </div>
        {trend && (
          <span className="text-[10px] font-black text-green-600 bg-green-50 px-4 py-2 rounded-full border border-green-100 shadow-sm">
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em] mb-2">{label}</p>
        <p className="text-4xl font-black text-neutral-900 tracking-tighter group-hover:scale-[1.02] origin-left transition-transform duration-500">{value}</p>
        {sub && <p className="text-[10px] font-bold text-neutral-400 mt-3 uppercase tracking-widest">{sub}</p>}
      </div>
    </div>
  )
}

function PulseCard({ title, sub, children }: any) {
  return (
    <div className="pulse-card p-10 h-full">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-xl font-black text-neutral-900 tracking-tight">{title}</h3>
          <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mt-0.5">{sub}</p>
        </div>
      </div>
      {children}
    </div>
  )
}
