'use client'

import { useEffect, useState } from 'react'
import { supabaseBrowser } from '../../../lib/supabase-browser'

type Order = {
  id: string
  created_at: string
  payment_mode: string
  total_amount: number
  status: string
  risk_level: string | null
  meta: {
    name?: string
    phone?: string
    address?: string
    pincode?: string
  } | null
  customers?: {
    phone?: string
  } | null
}

const TABS = [
  { key: 'pending', label: 'Pending', statuses: ['new', 'pending_approval'] },
  { key: 'approved', label: 'Approved', statuses: ['approved'] },
  { key: 'cancelled', label: 'Cancelled', statuses: ['cancelled'] },
  { key: 'all', label: 'All', statuses: [] },
]

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [activeTab, setActiveTab] = useState('pending')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)

  const loadOrders = async () => {
    setLoading(true)

    let query = supabaseBrowser
      .from('orders')
      .select(`
        id,
        created_at,
        payment_mode,
        total_amount,
        status,
        risk_level,
        meta,
        customers ( phone )
      `)
      .order('created_at', { ascending: false })

    const tab = TABS.find((t) => t.key === activeTab)
    if (tab && tab.statuses.length > 0) {
      query = query.in('status', tab.statuses)
    }

    if (search.trim()) {
      const term = `%${search.trim()}%`
      query = query.or(
        `id.ilike.${term},customers.phone.ilike.${term},meta->>phone.ilike.${term}`
      )
    }

    const { data } = await query
    setOrders(data || [])
    setSelected({})
    setLoading(false)
  }

  useEffect(() => {
    loadOrders()
  }, [activeTab, search])

  const toggleSelect = (id: string) => {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  if (loading) return <p className="p-6">Loading orders…</p>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Orders</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 sticky top-0 bg-black z-10">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2 border rounded ${
              activeTab === t.key
                ? 'bg-white text-black'
                : 'border-gray-600 text-gray-300 hover:border-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <input
        placeholder="Search by Order ID or Phone"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border border-gray-600 bg-black text-white p-2 mb-4 w-full rounded"
      />

      <table className="w-full border border-gray-700 rounded overflow-hidden">
        <thead className="bg-gray-900 text-gray-300">
          <tr>
            <th className="p-2 border"></th>
            <th className="p-2 border">Order</th>
            <th className="p-2 border">Customer</th>
            <th className="p-2 border">Payment</th>
            <th className="p-2 border">Amount</th>
            <th className="p-2 border">Risk</th>
            <th className="p-2 border">Status</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((o) => (
            <tr
              key={o.id}
              className="odd:bg-black even:bg-gray-900 hover:bg-gray-800 align-top"
            >
              <td className="p-2 border text-center">
                <input
                  type="checkbox"
                  checked={!!selected[o.id]}
                  onChange={() => toggleSelect(o.id)}
                />
              </td>

              <td className="p-2 border text-blue-600 underline">
                <a href={`/admin/orders/${o.id}`}>
                  {o.id.slice(0, 8)}
                </a>
              </td>

              {/* CUSTOMER DETAILS */}
              <td className="p-2 border text-sm text-gray-300">
                <div><b>{o.meta?.name || '—'}</b></div>
                <div>{o.meta?.phone || o.customers?.phone || '—'}</div>
                <div className="text-xs text-gray-400">
                  {o.meta?.address}
                  {o.meta?.pincode ? `, ${o.meta.pincode}` : ''}
                </div>
              </td>

              <td className="p-2 border">{o.payment_mode}</td>
              <td className="p-2 border">₹{o.total_amount}</td>

              <td className="p-2 border">
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    o.risk_level === 'high'
                      ? 'bg-red-900 text-red-300'
                      : o.risk_level === 'medium'
                      ? 'bg-orange-900 text-orange-300'
                      : 'bg-green-900 text-green-300'
                  }`}
                >
                  {o.risk_level || 'low'}
                </span>
              </td>

              <td className="p-2 border">
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    o.status === 'approved'
                      ? 'bg-green-900 text-green-300'
                      : o.status === 'cancelled'
                      ? 'bg-red-900 text-red-300'
                      : 'bg-orange-900 text-orange-300'
                  }`}
                >
                  {o.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
