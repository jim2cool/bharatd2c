'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { getActiveStoreIdClient } from '@/lib/getActiveStore.client'
import { PageSkeleton } from '@/components/ui/Skeletons'
import { EmptyState } from '@/components/ui/EmptyState'
import { ShoppingBag } from 'lucide-react'
import { SearchInput } from '../components/SearchInput'

const PAGE_SIZE = 25

const STATUS_FILTERS = [
  { label: 'All', value: 'all', color: 'gray' },
  { label: 'New', value: 'new', color: 'blue' },
  { label: 'Confirmed', value: 'confirmed', color: 'indigo' },
  { label: 'Held', value: 'held', color: 'orange' },
  { label: 'Shipped', value: 'shipped', color: 'purple' },
  { label: 'Cancelled', value: 'cancelled', color: 'red' },
]

const STATUS_PILL: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800',
  confirmed: 'bg-indigo-100 text-indigo-800',
  held: 'bg-orange-100 text-orange-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  rto: 'bg-orange-100 text-orange-800',
}

export default function OrdersPage() {
  const router = useRouter()

  const [storeId, setStoreId] = useState<string | null>(null)

  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [status, setStatus] = useState('all')
  const [search, setSearch] = useState('')

  const [cursor, setCursor] = useState<string | null>(null)
  const [prevCursors, setPrevCursors] = useState<string[]>([])
  const [hasNext, setHasNext] = useState(false)

  /* ----------------------------------------
     STORE CONTEXT GUARD (CLIENT SAFE)
  ---------------------------------------- */
  useEffect(() => {
    const id = getActiveStoreIdClient()
    if (!id) {
      router.replace('/admin/stores')
      return
    }
    setStoreId(id)
  }, [router])

  /* ---------------- LOAD ORDERS ---------------- */

  const loadOrders = async (activeStoreId: string) => {
    setLoading(true)

    let query = supabaseBrowser
      .from('orders')
      .select(
        `
        id,
        order_number,
        status,
        payment_mode,
        total_amount,
        created_at,
        meta
      `
      )
      .eq('store_id', activeStoreId)
      .order('created_at', { ascending: false })
      .limit(PAGE_SIZE + 1)

    if (status !== 'all') {
      query = query.eq('status', status)
    }

    if (cursor) {
      query = query.lt('created_at', cursor)
    }

    const { data } = await query

    const rows = data || []
    setHasNext(rows.length > PAGE_SIZE)
    setOrders(rows.slice(0, PAGE_SIZE))
    setLoading(false)
  }

  /* ---------------- EFFECTS ---------------- */

  useEffect(() => {
    if (!storeId) return
    setCursor(null)
    setPrevCursors([])
    loadOrders(storeId)
  }, [status, storeId])

  /* ---------------- HELPERS ---------------- */

  const formatIST = (ts: string) =>
    new Date(ts).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short',
    })

  const filteredOrders = orders.filter(o => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      o.order_number?.toLowerCase().includes(q) ||
      o.meta?.phone?.includes(q)
    )
  })

  /* ---------------- GUARD RENDER ---------------- */

  if (!storeId || loading) {
    return <PageSkeleton />
  }

  /* ---------------- UI ---------------- */

  return (
    <div>
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-4">Orders</h1>

        <SearchInput
          label="Search Orders"
          placeholder="By order # or phone..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          containerClassName="w-full max-w-md"
        />
      </div>

      {/* STATUS FILTERS */}
      <div className="flex gap-2 mb-4">
        {STATUS_FILTERS.map(f => {
          const active = status === f.value
          const activeClass = {
            gray: 'bg-gray-100 text-gray-900',
            blue: 'bg-blue-100 text-blue-900',
            indigo: 'bg-indigo-100 text-indigo-900',
            orange: 'bg-orange-100 text-orange-900',
            purple: 'bg-purple-100 text-purple-900',
            red: 'bg-red-100 text-red-900',
          }[f.color]

          return (
            <button
              key={f.value}
              onClick={() => setStatus(f.value)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition
                ${active ? activeClass : 'text-gray-500 hover:bg-gray-100'}
              `}
            >
              {f.label}
            </button>
          )
        })}
      </div>

      {/* TABLE or EMPTY STATE */}
      {filteredOrders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          description="Your orders will appear here once customers start purchasing. Try placing a test order on your storefront."
          icon={<ShoppingBag className="w-8 h-8 opacity-20" />}
        />
      ) : (
        <div className="bg-white border rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b text-gray-600">
              <tr>
                <th className="w-10 px-4 py-2"></th>
                <th className="text-left px-4 py-2">Order</th>
                <th className="text-left px-4 py-2">Customer</th>
                <th className="text-right px-4 py-2">Total</th>
                <th className="text-left px-4 py-2">Payment</th>
                <th className="text-left px-4 py-2">Verified</th>
                <th className="text-left px-4 py-2">Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map(order => (
                <tr
                  key={order.id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="px-4 py-1.5">
                    <input type="checkbox" disabled />
                  </td>

                  <td className="px-4 py-1.5">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-blue-600 font-medium"
                    >
                      #{order.order_number}
                    </Link>
                    <div className="text-xs text-gray-500">
                      {formatIST(order.created_at)} IST
                    </div>
                  </td>

                  <td className="px-4 py-1.5">
                    <div className="font-medium">
                      {order.meta?.name || '—'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {order.meta?.phone}
                    </div>
                  </td>

                  <td className="px-4 py-1.5 text-right">
                    ₹{order.total_amount}
                  </td>

                  <td className="px-4 py-1.5">
                    {order.payment_mode?.toUpperCase()}
                  </td>

                  <td className="px-4 py-1.5">
                    {order.payment_mode === 'cod' ? (
                      order.meta?.otp_verified ? (
                        <span className="text-green-600 text-xs font-semibold flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                          OTP Verified
                        </span>
                      ) : (
                        <span className="text-red-500 text-xs font-medium">PENDING</span>
                      )
                    ) : (
                      <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Prepaid</span>
                    )}
                  </td>

                  <td className="px-4 py-1.5">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_PILL[order.status] || 'bg-gray-100'
                        }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* PAGINATION */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={prevCursors.length === 0}
          onClick={() => {
            const prev = prevCursors[prevCursors.length - 1]
            setPrevCursors(prevCursors.slice(0, -1))
            setCursor(prev || null)
          }}
          className="px-3 py-1.5 border rounded text-sm disabled:opacity-50"
        >
          Previous
        </button>

        <button
          disabled={!hasNext}
          onClick={() => {
            const last = orders[orders.length - 1]?.created_at
            if (!last) return
            setPrevCursors([...prevCursors, cursor || ''])
            setCursor(last)
          }}
          className="px-3 py-1.5 border rounded text-sm disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}
