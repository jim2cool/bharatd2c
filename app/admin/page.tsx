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

import { ArrowRight, CheckCircle2, Circle, Plus, Settings, ShoppingBag, Truck } from 'lucide-react'
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
    hasTheme: false
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

    // 2. Check Store Config for Checklist
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
      hasShipping: false, // Placeholder for now
      hasTheme: !!store?.theme_config && Object.keys(store.theme_config).length > 0
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
    // ... existing analytics loading logic relies on stats state ...
    // Copy-pasting the existing logic here for brevity in this replace block?
    // Actually, I should keep the existing loadDashboard function and just call it.
    // But since I am replacing the whole component body, I re-implement it below.

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
  if (isNewStore) {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Setup Guide</h1>
          <p className="text-gray-600">Use this personalized guide to get your store up and running.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-6 border-b bg-gray-50">
            <h2 className="font-semibold text-lg">Just a few steps to launch</h2>
          </div>

          <div className="divide-y">
            {/* Step 1: Add Product */}
            <div className="p-6 flex gap-4 items-start hover:bg-gray-50 transition-colors">
              {checklist.hasProducts ? <CheckCircle2 className="text-green-600 w-6 h-6 mt-1" /> : <Circle className="text-gray-300 w-6 h-6 mt-1" />}
              <div className="flex-1">
                <h3 className={`font-medium text-lg ${checklist.hasProducts ? 'text-gray-500 line-through' : 'text-black'}`}>Add your first product</h3>
                <p className="text-gray-600 text-sm mt-1 mb-3">Write a description, add photos, and set pricing for the products you plan to sell.</p>
                {!checklist.hasProducts && (
                  <button onClick={() => router.push('/admin/products/new')} className="text-sm bg-black text-white px-4 py-2 rounded font-medium inline-flex items-center">
                    Add product <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                )}
              </div>
            </div>

            {/* Step 2: Custom Domain */}
            <div className="p-6 flex gap-4 items-start hover:bg-gray-50 transition-colors">
              {checklist.hasDomain ? <CheckCircle2 className="text-green-600 w-6 h-6 mt-1" /> : <Circle className="text-gray-300 w-6 h-6 mt-1" />}
              <div className="flex-1">
                <h3 className={`font-medium text-lg ${checklist.hasDomain ? 'text-gray-500 line-through' : 'text-black'}`}>Add a custom domain</h3>
                <p className="text-gray-600 text-sm mt-1 mb-3">Your customers will use this to find your online store.</p>
                {!checklist.hasDomain && (
                  <button onClick={() => router.push('/admin/settings/domains')} className="text-sm border border-gray-300 px-4 py-2 rounded font-medium">Add domain</button>
                )}
              </div>
            </div>

            {/* Step 3: Customize Theme */}
            <div className="p-6 flex gap-4 items-start hover:bg-gray-50 transition-colors">
              {checklist.hasTheme ? <CheckCircle2 className="text-green-600 w-6 h-6 mt-1" /> : <Circle className="text-gray-300 w-6 h-6 mt-1" />}
              <div className="flex-1">
                <h3 className={`font-medium text-lg ${checklist.hasTheme ? 'text-gray-500 line-through' : 'text-black'}`}>Customize your online store</h3>
                <p className="text-gray-600 text-sm mt-1 mb-3">Choose a theme and add your logo, colors, and images to reflect your brand.</p>
                {!checklist.hasTheme && (
                  <button onClick={() => router.push('/admin/settings/theme')} className="text-sm border border-gray-300 px-4 py-2 rounded font-medium">Customize theme</button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ---------------- EXISTING DASHBOARD VIEW ----------------
  // (Re-using old render logic here, assuming stats is populated)
  if (!stats) return <div>Loading stats...</div>

  const pieData = Object.entries(stats.statusCount || {}).map(([k, v]) => ({ name: k, value: v }))
  const barData = Object.entries(stats.hourly || {}).map(([h, v]) => ({ hour: `${h}:00`, orders: v }))

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="flex gap-2">
          {(['today', 'yesterday', '7d', '30d'] as RangeKey[]).map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 border rounded text-sm ${range === r ? 'bg-black text-white' : 'bg-white'}`}
            >
              {r === '7d' ? 'Last 7 days' : r === '30d' ? 'Last 30 days' : r}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        <Stat label="Orders" value={stats.orders} />
        <Stat label="Revenue" value={`₹${stats.revenue}`} />
        <Stat label="Profit" value={`₹${stats.profit}`} />
        <Stat label="Margin" value={`${stats.margin}%`} />
        <Stat label="New orders" sub="Not yet processed" value={stats.statusCount?.new || 0} />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card title="Order flow (hourly)">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={barData}>
              <XAxis dataKey="hour" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="orders" fill="#2563EB" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Orders by status">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={80}>
                {pieData.map((d: any) => <Cell key={d.name} fill={STATUS_COLORS[d.name] || '#000'} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card title="Top products">
          {stats.topProducts?.map((p: TopProduct) => (
            <div key={p.title} className="flex justify-between text-sm py-1">
              <span>{p.title}</span>
              <span className="text-gray-500">{p.qty} sold · ₹{p.profit}</span>
            </div>
          ))}
        </Card>
        <Card title="Recent orders">
          {stats.recentOrders?.map((o: RecentOrder) => {
            const firstItem = o.order_items?.[0]?.products?.title || 'Order'
            const extra = o.order_items.length > 1 ? ` +${o.order_items.length - 1} items` : ''
            return (
              <div key={o.id} className="flex justify-between text-sm py-1">
                <div>
                  <Link href={`/admin/orders/${o.id}`} className="text-blue-600">
                    {firstItem}{extra}
                  </Link>
                  <div className="text-xs text-gray-500">#{o.order_number}</div>
                </div>
                <span>₹{o.total_amount}</span>
              </div>
            )
          })}
        </Card>
      </div>
    </div>
  )
}

/* ----------------------------------------
   SMALL UI COMPONENTS (UNCHANGED)
---------------------------------------- */

function Stat({ label, value, sub }: any) {
  return (
    <div className="border rounded p-4 bg-white">
      <div className="text-xs text-gray-500">{label}</div>
      {sub && <div className="text-[11px] text-gray-400">{sub}</div>}
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </div>
  )
}

function Card({ title, children }: any) {
  return (
    <div className="border rounded p-4 bg-white">
      <h3 className="font-medium mb-3">{title}</h3>
      {children}
    </div>
  )
}
