'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabaseBrowser } from '../../../../lib/supabase-browser'
import { evaluateCODRisk } from '../../../../lib/cod-risk'

export default function OrderDetailPage() {
  const { id } = useParams()
  const router = useRouter()

  const [order, setOrder] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])
  const [customer, setCustomer] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const loadOrder = async () => {
    setLoading(true)

    const { data: orderData } = await supabaseBrowser
      .from('orders')
      .select('*')
      .eq('id', id)
      .single()

    const { data: itemData } = await supabaseBrowser
  .from('order_items')
  .select(`
    qty,
    price,
    product_id,
    variant_id,
    products (
      title
    ),
    variants (
      title
    )
  `)
  .eq('order_id', id)


    let customerData = null
    if (orderData?.customer_id) {
      const { data } = await supabaseBrowser
        .from('customers')
        .select('*')
        .eq('id', orderData.customer_id)
        .single()
      customerData = data
    }

    setOrder(orderData)
    setItems(itemData || [])
    setCustomer(customerData)
    setLoading(false)
  }

  useEffect(() => {
    loadOrder()
  }, [])

  const updateStatus = async (status: string) => {
    await supabaseBrowser
      .from('orders')
      .update({ status })
      .eq('id', id)

    router.push('/admin/orders')
  }

  const runRiskCheck = async () => {
    if (!order) return

    let previousOrdersCount = 0

    if (customer?.phone) {
      const { count } = await supabaseBrowser
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('payment_mode', 'COD')
        .eq('customer_id', order.customer_id)

      previousOrdersCount = count || 0
    }

    const result = evaluateCODRisk({
      paymentMode: order.payment_mode,
      totalAmount: order.total_amount,
      previousOrdersCount,
      phone: customer?.phone,
    })

    await supabaseBrowser
      .from('orders')
      .update({
        risk_level: result.level,
        tags: result.reasons,
      })
      .eq('id', order.id)

    alert(
      `Risk Level: ${result.level.toUpperCase()}\n\nReasons:\n${
        result.reasons.length ? result.reasons.join('\n') : 'None'
      }`
    )

    await loadOrder()
  }

  if (loading) return <p className="p-6">Loading order…</p>
  if (!order) return <p className="p-6">Order not found</p>

  const meta = order.meta || {}

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">
        Order {order.id.slice(0, 8)}
      </h1>

      {/* ORDER SUMMARY */}
      <div className="border p-4 mb-4">
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Payment:</strong> {order.payment_mode}</p>
        <p><strong>Total:</strong> ₹{order.total_amount}</p>
        <p>
          <strong>Created:</strong>{' '}
          {new Date(order.created_at).toLocaleString()}
        </p>

        <p>
          <strong>Risk Level:</strong>{' '}
          <span
            className={
              order.risk_level === 'high'
                ? 'text-red-600'
                : order.risk_level === 'medium'
                ? 'text-orange-600'
                : 'text-green-600'
            }
          >
            {order.risk_level || 'low'}
          </span>
        </p>

        {order.tags && order.tags.length > 0 && (
          <p className="text-red-600 mt-2">
            <strong>Risk Reasons:</strong> {order.tags.join(', ')}
          </p>
        )}
      </div>

      {/* CUSTOMER */}
      <div className="border p-4 mb-4">
        <h2 className="font-bold mb-2">Customer</h2>
        <p><strong>Name:</strong> {meta.name || '—'}</p>
        <p><strong>Phone:</strong> {meta.phone || customer?.phone}</p>

        <p className="mt-2">
          <strong>Address:</strong><br />
          {meta.address}<br />
          {meta.pincode}
        </p>
      </div>

      {/* ITEMS */}
      <div className="border p-4 mb-4">
        <h2 className="font-bold mb-2">Items</h2>
        {items.length === 0 && <p>No items (Buy Now order)</p>}
        {items.map((i, idx) => (
  <div
    key={idx}
    className="flex justify-between border-b py-2 text-sm"
  >
    <div>
      <div className="font-semibold">
        {i.products?.title || 'Unknown Product'}
      </div>

      {i.variants?.title && (
        <div className="text-gray-500 text-xs">
          Variant: {i.variants.title}
        </div>
      )}
    </div>

    <div className="text-right">
      <div>{i.qty} × ₹{i.price}</div>
      <div className="text-xs text-gray-400">
        = ₹{i.qty * i.price}
      </div>
    </div>
  </div>
))}

      </div>

      {/* ACTIONS */}
      <div className="space-x-3">
        <button
          onClick={() => updateStatus('approved')}
          className="bg-green-600 text-white px-4 py-2"
        >
          Approve
        </button>

        <button
          onClick={() => updateStatus('cancelled')}
          className="bg-red-600 text-white px-4 py-2"
        >
          Cancel
        </button>

        <button
          onClick={runRiskCheck}
          className="bg-yellow-600 text-white px-4 py-2"
        >
          Run COD Risk Check
        </button>

        <button
          onClick={() => router.back()}
          className="border px-4 py-2"
        >
          Back
        </button>
      </div>
    </div>
  )
}
