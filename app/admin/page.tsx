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

import { ArrowRight, CheckCircle2, Circle, Plus, Settings, ShoppingBag, Truck, Sparkles, Layers, AlertCircle, Zap, LayoutDashboard, Clock } from "lucide-react"
import { OnboardingChecklist } from './components/OnboardingChecklist'
import { RTODegradationPrompts } from './components/RTODegradationPrompts'
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

  const loadDashboard = async (activeStoreId: string) => {
    setLoading(true)

    const getRanges = (range: RangeKey) => {
      const now = new Date()
      const currentTo = new Date(now)
      const currentFrom = new Date(now)
      const prevTo = new Date(now)
      const prevFrom = new Date(now)

      if (range === 'today') {
        currentFrom.setHours(0, 0, 0, 0)
        prevFrom.setDate(prevFrom.getDate() - 1)
        prevFrom.setHours(0, 0, 0, 0)
        prevTo.setDate(prevTo.getDate() - 1)
        prevTo.setHours(23, 59, 59, 999)
      } else if (range === 'yesterday') {
        currentFrom.setDate(currentFrom.getDate() - 1)
        currentFrom.setHours(0, 0, 0, 0)
        currentTo.setDate(currentTo.getDate() - 1)
        currentTo.setHours(23, 59, 59, 999)
        prevFrom.setDate(prevFrom.getDate() - 2)
        prevFrom.setHours(0, 0, 0, 0)
        prevTo.setDate(prevTo.getDate() - 2)
        prevTo.setHours(23, 59, 59, 999)
      } else if (range === '7d') {
        currentFrom.setDate(currentFrom.getDate() - 7)
        prevFrom.setDate(prevFrom.getDate() - 14)
        prevTo.setDate(prevTo.getDate() - 7)
      } else if (range === '30d') {
        currentFrom.setDate(currentFrom.getDate() - 30)
        prevFrom.setDate(prevFrom.getDate() - 60)
        prevTo.setDate(prevTo.getDate() - 30)
      }

      return {
        current: { from: currentFrom.toISOString(), to: currentTo.toISOString() },
        prev: { from: prevFrom.toISOString(), to: prevTo.toISOString() },
        label: range === 'today' ? 'vs Yesterday' : range === 'yesterday' ? 'vs Prev Day' : `vs Prev ${range.toUpperCase()}`
      }
    }

    const { current, prev, label } = getRanges(range)

    // Parallel Fetch: Orders (Current & Prev), Low Stock
    const [ordersRes, prevOrdersRes, lowStockRes] = await Promise.all([
      supabaseBrowser
        .from('orders')
        .select(`id, total_amount, created_at, order_items (qty, price, products (cogs))`)
        .eq('store_id', activeStoreId)
        .gte('created_at', current.from)
        .lte('created_at', current.to),
      supabaseBrowser
        .from('orders')
        .select(`id, total_amount, created_at, order_items (qty, price, products (cogs))`)
        .eq('store_id', activeStoreId)
        .gte('created_at', prev.from)
        .lte('created_at', prev.to),
      supabaseBrowser
        .from('products')
        .select('id, title, qty')
        .eq('store_id', activeStoreId)
        .lt('qty', 10)
        .limit(5)
    ]);

    const currData = ordersRes.data || []
    const oldData = prevOrdersRes.data || []

    const processOrders = (orders: any[]) => {
      let rev = 0, prof = 0, ords = 0;
      let statusCnt: Record<string, number> = {}
      let hourMap: Record<string, number> = {}
      let prodMap: Record<string, { qty: number; profit: number }> = {}

      orders?.forEach(o => {
        ords++;
        rev += o.total_amount || 0;
        statusCnt[o.status] = (statusCnt[o.status] || 0) + 1
        const hour = new Date(o.created_at).getHours()
        hourMap[hour] = (hourMap[hour] || 0) + 1

        o.order_items?.forEach((i: any) => {
          const title = i.products?.title || 'Unknown'
          const cogs = i.products?.cogs || 0
          const itemProfit = (i.price - cogs) * i.qty
          prof += itemProfit

          if (!prodMap[title]) prodMap[title] = { qty: 0, profit: 0 }
          prodMap[title].qty += i.qty
          prodMap[title].profit += itemProfit
        });
      });
      return { rev, prof, ords, statusCnt, hourMap, prodMap };
    }

    const curr = processOrders(currData)
    const old = processOrders(oldData)

    const calcTrend = (currVal: number, oldVal: number) => {
      if (oldVal === 0) return currVal > 0 ? '+100%' : '0%';
      const diff = ((currVal - oldVal) / oldVal) * 100;
      return `${diff > 0 ? '+' : ''}${Math.round(diff)}%`;
    }

    // Re-fetch recent orders for the feed
    const { data: feedOrders } = await supabaseBrowser
      .from('orders')
      .select('id, order_number, status, total_amount, created_at, order_items(products(title))')
      .eq('store_id', activeStoreId)
      .order('created_at', { ascending: false })
      .limit(8)

    const feed: any[] = [
      ...(feedOrders || []).map(o => ({
        type: 'order',
        id: o.id,
        time: o.created_at,
        title: o.order_items?.[0]?.products?.[0]?.title || 'New Order',
        meta: `Order #${o.order_number}`,
        amount: o.total_amount,
        status: o.status
      })),
      ...(lowStockRes.data || []).map(p => ({
        type: 'alert',
        id: `alert-${p.id}`,
        time: new Date().toISOString(),
        title: `Low Stock: ${p.title}`,
        meta: `Only ${p.qty} left`,
        status: 'critical'
      }))
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())

    setStats({
      orders: curr.ords,
      revenue: curr.rev,
      profit: curr.prof,
      margin: curr.rev ? Math.round((curr.prof / curr.rev) * 100) : 0,
      statusCount: curr.statusCnt,
      hourly: curr.hourMap,
      trends: {
        revenue: { value: calcTrend(curr.rev, old.rev), label },
        orders: { value: calcTrend(curr.ords, old.ords), label },
        profit: { value: calcTrend(curr.prof, old.prof), label }
      },
      activityFeed: feed,
      lowStockCount: lowStockRes.data?.length || 0,
      topProducts: Object.entries(curr.prodMap).map(([t, v]) => ({ title: t, ...v })).sort((a, b) => b.qty - a.qty).slice(0, 5)
    })
    setLoading(false)
  }

  const checkStoreStatus = async (activeStoreId: string) => {
    setLoading(true)

    // 1. Parallel Fetch: Products, Pages, Store Config
    const [productsRes, pagesRes, storeRes] = await Promise.all([
      supabaseBrowser
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('store_id', activeStoreId),
      supabaseBrowser
        .from('pages')
        .select('*', { count: 'exact', head: true })
        .eq('store_id', activeStoreId),
      supabaseBrowser
        .from('stores')
        .select('domain, theme_config')
        .eq('id', activeStoreId)
        .single()
    ]);

    const productCount = productsRes.count || 0;
    const pagesCount = pagesRes.count || 0;
    const store = storeRes.data;

    const hasProducts = productCount > 0;

    // Update Checklist State
    setChecklist({
      hasProducts,
      hasDomain: !!store?.domain,
      hasPages: pagesCount > 0,
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
          <div className="bg-white border border-neutral-200 rounded-[3rem] p-10 md:p-16 text-neutral-900 shadow-xl relative overflow-hidden group">
            <div className="relative z-10 max-w-2xl space-y-6">
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.1]">
                Welcome to your <br />
                <span className="text-blue-600">new store.</span>
              </h1>
              <p className="text-neutral-500 font-medium text-lg leading-relaxed">
                Your commerce platform is ready. Start by adding your first product to activate your storefront.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/admin/products/new"
                  className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-neutral-900 text-white rounded-[1.5rem] text-sm font-black hover:bg-neutral-800 transition-all shadow-xl hover:-translate-y-1 active:translate-y-0"
                >
                  Add Your First Product <ArrowRight className="w-4 h-4" />
                </Link>
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

  if (!stats) return <div className="p-10 text-[10px] uppercase font-black tracking-widest text-neutral-400">Loading Intelligence...</div>

  const pieData = Object.entries(stats.statusCount || {}).map(([k, v]) => ({ name: k, value: v }))

  const barData = Object.entries(stats.hourly || {})
    .map(([h, v]) => ({ hour: `${h}:00`, orders: v }))
    .sort((a, b) => parseInt(a.hour) - parseInt(b.hour))

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* AI DAILY PULSE SUMMARY */}
      <section className="relative overflow-hidden p-8 md:p-12 bg-neutral-900 rounded-[2.5rem] md:rounded-[3.5rem] text-white shadow-3xl shadow-blue-500/20 group">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-transparent to-purple-600/20 pointer-events-none opacity-50" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />
        <div className="absolute top-0 right-0 p-16 opacity-5 pointer-events-none group-hover:scale-110 group-hover:rotate-45 transition-transform duration-1000">
          <Sparkles className="w-80 h-80 rotate-12" />
        </div>
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 backdrop-blur-md">
              <Sparkles className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 font-mono">Operations Pulse</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
            {stats.revenue > 10000 ? "Strong Growth." : "Ready for Launch."} <br />
            <span className="text-white/20">
              {stats.orders > 0 ? "Tracking High." : "Store Online."}
            </span>
          </h1>
          <p className="max-w-2xl text-lg font-medium text-neutral-400 leading-relaxed">
            {stats.orders > 0 ? (
              <>
                Conversion trends are matching high-tier projections with <span className="text-white font-bold">{stats.orders} processed orders</span>.
                Your current average margin is <span className="text-green-400 font-bold">{stats.margin}%</span>.
              </>
            ) : (
              "Your global commerce infrastructure is initialized and ready. Launch your first product or marketing campaign to start generating sales."
            )}
          </p>
          {stats.orders > 0 && (
            <div className="flex flex-wrap gap-3 pt-4">
              <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3 backdrop-blur-md">
                <Zap className="w-3.5 h-3.5 text-yellow-400" />
                <span className="text-[9px] font-black uppercase tracking-widest text-neutral-300">Trend: +12% Growth</span>
              </div>
              {stats.lowStockCount > 0 && (
                <div className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 backdrop-blur-md">
                  <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-red-400">{stats.lowStockCount} Inventory Alerts</span>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* MASONRY DASHBOARD GRID */}
      <div className="masonry-grid">
        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <PulseStat
            label="Total Sales"
            value={`₹${stats.revenue.toLocaleString()}`}
            trend={stats.trends?.revenue.value}
            trendLabel={stats.trends?.revenue.label}
            icon={<ShoppingBag className="w-5 h-5" />}
            color="blue"
            helperText="Gross revenue before expenses and returns."
          />
        </div>
        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <PulseStat
            label="Order Volume"
            value={stats.orders}
            trend={stats.trends?.orders.value}
            trendLabel={stats.trends?.orders.label}
            icon={<CheckCircle2 className="w-5 h-5" />}
            color="green"
            helperText="Total number of orders processed in this period."
          />
        </div>
        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <PulseStat
            label="Net Profit"
            value={`₹${stats.profit.toLocaleString()}`}
            trend={stats.trends?.profit.value}
            trendLabel={stats.trends?.profit.label}
            icon={<Layers className="w-5 h-5" />}
            color="purple"
            helperText="Earnings after deducting COGS and platform fees."
          />
        </div>
        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <PulseStat
            label="On Hold"
            value={stats.statusCount?.held || 0}
            icon={<Clock className="w-5 h-5" />}
            color="purple"
            sub="Manual review queue"
            helperText="Orders held for review due to lack of automated verification tools."
          />
        </div>

        {/* PERFORMANCE PULSE */}
        <div className="col-span-12 xl:col-span-8">
          <PulseCard title="Revenue Stream" sub="Hourly sales velocity" helperText="Real-time tracking of order distribution throughout the day.">
            <div className="h-[300px] mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                  <XAxis
                    dataKey="hour"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    cursor={{ fill: '#f8fafc', radius: 12 }}
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px -12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="orders" fill="#2563eb" radius={[8, 8, 2, 2]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </PulseCard>
        </div>

        {/* TOP PRODUCTS & DEGRADATION PROMPTS */}
        <div className="col-span-12 xl:col-span-4 space-y-10">
          <PulseCard title="Revenue Drivers" sub="Top performing units" helperText="Products generating the most volume and margin.">
            <div className="mt-6 space-y-3">
              {(stats.topProducts || []).length === 0 && (
                <p className="text-center py-8 text-neutral-400 font-bold text-[10px] uppercase tracking-widest">No units sold yet</p>
              )}
              {stats.topProducts?.map((p: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100 group/item hover:bg-neutral-900 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-[9px] font-black text-neutral-900 shadow-sm group-hover/item:scale-110 transition-transform">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-neutral-900 group-hover/item:text-white truncate max-w-[120px]">{p.title}</p>
                      <p className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest">{p.qty} units</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-black text-neutral-900 group-hover/item:text-white">₹{p.profit.toLocaleString()}</p>
                    <p className="text-[8px] font-bold text-green-500 uppercase tracking-widest">Profit</p>
                  </div>
                </div>
              ))}
            </div>
          </PulseCard>

          <RTODegradationPrompts storeId={storeId} />
        </div>

        {/* RECENT ACTIVITY */}
        <div className="col-span-12 md:col-span-6 xl:col-span-12">
          <PulseCard title="Live Activity" sub="Event stream" helperText="Consolidated feed of orders and critical operational alerts.">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
              {stats.activityFeed?.length === 0 && (
                <div className="col-span-full">
                  <p className="text-center py-10 text-neutral-400 font-bold text-xs uppercase tracking-widest leading-loose bg-neutral-50 rounded-3xl border border-dashed border-neutral-100">
                    No recent activity found. <br /> Your store is quiet.
                  </p>
                </div>
              )}
              {stats.activityFeed?.map((item: any) => (
                <div key={item.id} className="flex items-start gap-2.5 p-3.5 bg-white border border-slate-100 rounded-2xl hover:shadow-lg hover:shadow-neutral-200 transition-all group">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-300 ${item.type === 'alert'
                    ? 'bg-red-50 text-red-600 border-red-100'
                    : 'bg-slate-50 text-neutral-600 border-slate-100 group-hover:bg-neutral-900 group-hover:text-white'
                    }`}>
                    {item.type === 'alert' ? <AlertCircle className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black text-neutral-900 truncate">
                      {item.title}
                    </p>
                    <p className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest mt-0.5">{item.meta}</p>
                  </div>
                  <div className="text-right shrink-0">
                    {item.amount !== undefined ? (
                      <p className="text-[10px] font-black text-neutral-900">₹{item.amount.toLocaleString()}</p>
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse ml-auto" />
                    )}
                    <p className={`text-[8px] font-bold uppercase tracking-widest ${item.status === 'critical' ? 'text-red-600' : 'text-blue-600'
                      }`}>
                      {item.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <Link href="/admin/orders" className="inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-neutral-900 text-white rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] shadow-xl shadow-neutral-200 hover:-translate-y-1 active:translate-y-0 transition-all">
                Full Event Log <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </PulseCard>
        </div>
      </div>
    </div>
  )
}

function PulseStat({ label, value, trend, trendLabel, icon, color, sub, helperText }: any) {
  const colors: any = {
    blue: 'text-blue-600 bg-blue-50 border-blue-100',
    green: 'text-green-600 bg-green-50 border-green-100',
    purple: 'text-purple-600 bg-purple-50 border-purple-100',
    orange: 'text-orange-600 bg-orange-50 border-orange-100',
  }

  const isPositive = trend?.startsWith('+')
  const isNeutral = trend === '0%'

  return (
    <div className="pulse-card p-6 md:p-10 h-full flex flex-col justify-between group hover:border-neutral-900 transition-all duration-700">
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-[1.5rem] flex items-center justify-center border group-hover:bg-neutral-900 group-hover:text-white group-hover:scale-110 transition-all duration-500 ${colors[color]}`}>
          {icon}
        </div>
        <div className="flex flex-col items-end gap-1">
          {trend && (
            <span className={`text-[10px] font-black px-4 py-2 rounded-full border shadow-sm ${isNeutral ? 'text-neutral-400 bg-neutral-50 border-neutral-100' :
              isPositive ? 'text-green-600 bg-green-50 border-green-100' :
                'text-red-600 bg-red-50 border-red-100'
              }`}>
              {trend}
            </span>
          )}
          {trendLabel && <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest">{trendLabel}</span>}
        </div>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <p className="text-[9px] font-black text-neutral-400 uppercase tracking-[0.3em]">{label}</p>
          {helperText && (
            <div className="relative group/tip">
              <AlertCircle className="w-3 h-3 text-neutral-300 hover:text-neutral-500 cursor-help transition-colors" />
              <div className="absolute bottom-full left-0 mb-3 w-48 p-3 bg-neutral-900 text-white text-[10px] font-medium rounded-xl opacity-0 group-hover/tip:opacity-100 pointer-events-none transition-opacity shadow-2xl z-50">
                {helperText}
                <div className="absolute top-full left-1.5 border-8 border-transparent border-t-neutral-900" />
              </div>
            </div>
          )}
        </div>
        <p className="text-3xl md:text-4xl font-black text-neutral-900 tracking-tighter group-hover:scale-[1.02] origin-left transition-transform duration-500">{value}</p>
        {sub && <p className="text-[9px] font-bold text-neutral-400 mt-2 uppercase tracking-widest">{sub}</p>}
      </div>
    </div>
  )
}

function PulseCard({ title, sub, children, helperText }: any) {
  return (
    <div className="pulse-card p-6 md:p-10 h-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg md:text-xl font-black text-neutral-900 tracking-tight">{title}</h3>
            {helperText && (
              <div className="relative group/tip">
                <AlertCircle className="w-3.5 h-3.5 text-neutral-300 hover:text-neutral-900 cursor-help transition-colors" />
                <div className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-neutral-900 text-white text-[10px] font-medium rounded-xl opacity-0 group-hover/tip:opacity-100 pointer-events-none transition-opacity shadow-2xl l z-50">
                  {helperText}
                  <div className="absolute top-full left-1.5 border-8 border-transparent border-t-neutral-900" />
                </div>
              </div>
            )}
          </div>
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-0.5">{sub}</p>
        </div>
      </div>
      {children}
    </div>
  )
}
