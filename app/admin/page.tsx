'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
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

type RangeKey = 'today' | 'yesterday' | '7d' | '30d'

const STATUS_COLORS: Record<string, string> = {
  new: '#9CA3AF',
  confirmed: '#2563EB',
  shipped: '#16A34A',
  cancelled: '#DC2626',
}

export default function AdminDashboard() {
  const [range, setRange] = useState<RangeKey>('today')
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboard()
  }, [range])

  const loadDashboard = async () => {
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

    const { data: orders } = await supabaseBrowser
      .from('orders')
      .select(`
        id,
        order_number,
        status,
        total_amount,
        created_at,
        order_items (
          qty,
          price,
          products (
            title,
            cogs
          )
        )
      `)
      .gte('created_at', from.toISOString())
      .lte('created_at', now.toISOString())

    const safeOrders = orders || []

    let revenue = 0
    let profit = 0
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

        if (!productMap[title]) {
          productMap[title] = { qty: 0, profit: 0 }
        }

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
      topProducts: Object.entries(productMap)
        .map(([title, v]) => ({ title, ...v }))
        .sort((a, b) => b.qty - a.qty)
        .slice(0, 5),
      recentOrders: safeOrders.slice(0, 5),
    })

    setLoading(false)
  }

  if (loading || !stats) return <div className="p-6">Loading dashboard…</div>

  const pieData = Object.entries(stats.statusCount).map(([k, v]) => ({
    name: k,
    value: v,
  }))

  const barData = Object.entries(stats.hourly).map(([h, v]) => ({
    hour: `${h}:00`,
    orders: v,
  }))

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="flex gap-2">
          {(['today', 'yesterday', '7d', '30d'] as RangeKey[]).map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 border rounded text-sm ${
                range === r ? 'bg-black text-white' : 'bg-white'
              }`}
            >
              {r === '7d' ? 'Last 7 days' : r === '30d' ? 'Last 30 days' : r}
            </button>
          ))}
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-5 gap-4">
        <Stat label="Orders" value={stats.orders} />
        <Stat label="Revenue" value={`₹${stats.revenue}`} />
        <Stat label="Profit" value={`₹${stats.profit}`} />
        <Stat label="Margin" value={`${stats.margin}%`} />
        <Stat
          label="New orders"
          sub="Not yet processed"
          value={stats.statusCount.new || 0}
        />
      </div>

      {/* CHARTS */}
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
                {pieData.map(d => (
                  <Cell
                    key={d.name}
                    fill={STATUS_COLORS[d.name] || '#000'}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* BOTTOM */}
      <div className="grid grid-cols-2 gap-6">
        <Card title="Top products">
          {stats.topProducts.map(p => (
            <div key={p.title} className="flex justify-between text-sm py-1">
              <span>{p.title}</span>
              <span className="text-gray-500">
                {p.qty} sold · ₹{p.profit}
              </span>
            </div>
          ))}
        </Card>

        <Card title="Recent orders">
          {stats.recentOrders.map(o => {
            const firstItem = o.order_items?.[0]?.products?.title || 'Order'
            const extra =
              o.order_items.length > 1
                ? ` +${o.order_items.length - 1} items`
                : ''
            return (
              <div
                key={o.id}
                className="flex justify-between text-sm py-1"
              >
                <div>
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className="text-blue-600"
                  >
                    {firstItem}
                    {extra}
                  </Link>
                  <div className="text-xs text-gray-500">
                    #{o.order_number}
                  </div>
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
