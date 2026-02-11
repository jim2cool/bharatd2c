'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { evaluateCODRisk } from '@/lib/cod-risk'

const STATUS_OPTIONS = [
  'new',
  'confirmed',
  'shipped',
  'delivered',
  'cancelled',
  'rto',
]

export default function OrderDetailPage() {
  const { id } = useParams()
  const router = useRouter()

  const [order, setOrder] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [editMode, setEditMode] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showIntel, setShowIntel] = useState(false)

  /* ---------------- LOAD ORDER ---------------- */

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
        products ( title ),
        variants ( title )
      `)
      .eq('order_id', id)

    setOrder(orderData)
    setItems(itemData || [])
    setLoading(false)
  }

  useEffect(() => {
    loadOrder()
  }, [])

  if (loading) {
    return <div className="p-6">Loading order…</div>
  }

  if (!order) {
    return <div className="p-6">Order not found</div>
  }

  const meta = order.meta || {}
  const pincodeMeta = meta.pincode_meta

  const formatIST = (ts: string) =>
    new Date(ts).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short',
    })

  /* ---------------- SAVE CUSTOMER ---------------- */

  const saveCustomer = async () => {
    setSaving(true)
    await supabaseBrowser
      .from('orders')
      .update({ meta })
      .eq('id', order.id)
    setEditMode(false)
    setSaving(false)
    loadOrder()
  }

  /* ---------------- STATUS UPDATE ---------------- */

  const updateStatus = async (status: string) => {
    await supabaseBrowser
      .from('orders')
      .update({ status })
      .eq('id', order.id)
    loadOrder()
  }

  /* ---------------- COD RISK ---------------- */

  const runRisk = async () => {
    const result = evaluateCODRisk({
      paymentMode: order.payment_mode,
      totalAmount: order.total_amount,
      previousOrdersCount: 0,
      phone: meta.phone,
    })

    await supabaseBrowser
      .from('orders')
      .update({
        risk_level: result.level,
        tags: result.reasons,
      })
      .eq('id', order.id)

    alert(
      `Risk: ${result.level.toUpperCase()}\n${result.reasons.join('\n') || 'No reasons'
      }`
    )

    loadOrder()
  }


  /* ---------------- VALIDATE PINCODE ---------------- */

  const validatePincode = async () => {
    const pin = meta.pincode
    if (!pin || pin.length !== 6) {
      alert('Invalid pincode length')
      return
    }

    setSaving(true)
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`)
      const data = await res.json()

      if (Array.isArray(data) && data[0]?.Status === 'Success') {
        const newMeta = {
          ...meta,
          pincode_meta: {
            post_offices: data[0].PostOffice,
            updated_at: new Date().toISOString(),
          },
        }

        await supabaseBrowser
          .from('orders')
          .update({ meta: newMeta })
          .eq('id', order.id)

        loadOrder()
        alert('Address data fetched and saved.')
      } else {
        alert('Failed to fetch data from IndiaPost API')
      }
    } catch (e) {
      alert('Error connecting to IndiaPost API')
    }
    setSaving(false)
  }

  /* ---------------- MANUAL VERIFY (P0-3) ---------------- */
  const manualVerify = async () => {
    if (!confirm('Mark this COD order as verified?')) return
    setSaving(true)
    const newMeta = { ...meta, otp_verified: true }
    await supabaseBrowser
      .from('orders')
      .update({ meta: newMeta })
      .eq('id', order.id)
    loadOrder()
    setSaving(false)
  }

  /* ---------------- DERIVED TOTALS ---------------- */

  const itemsSubtotal = items.reduce(
    (sum, i) => sum + i.qty * i.price,
    0
  )

  const taxAmount = meta.tax_amount || 0
  const shippingAmount = meta.shipping_amount || 0
  const grandTotal = itemsSubtotal + taxAmount + shippingAmount

  /* ---------------- UI ---------------- */

  return (
    <div>
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">
          Order #{order.order_number}
        </h1>
        <div className="text-sm text-gray-600 mt-1">
          Placed {formatIST(order.created_at)} IST ·{' '}
          {order.payment_mode?.toUpperCase()}
          {order.payment_mode === 'cod' && (
            <span className={`ml-3 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${order.meta?.otp_verified ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {order.meta?.otp_verified ? '✓ Verified' : '⚠ Action Required'}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT / MAIN */}
        <div className="lg:col-span-2 space-y-6">

          {/* ITEMS — PRIMARY FOCUS */}
          <div className="bg-white border rounded">
            <div className="px-4 py-3 border-b font-semibold">
              Items to ship
            </div>

            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 border-b">
                <tr>
                  <th className="text-left px-4 py-2">Item</th>
                  <th className="text-right px-4 py-2">Qty</th>
                  <th className="text-right px-4 py-2">Price</th>
                  <th className="text-right px-4 py-2">Total</th>
                </tr>
              </thead>

              <tbody>
                {items.map((i, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="px-4 py-2">
                      <div className="font-medium">
                        {i.products?.title}
                      </div>
                      {i.variants?.title && (
                        <div className="text-xs text-gray-500">
                          Variant: {i.variants.title}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-2 text-right">
                      {i.qty}
                    </td>
                    <td className="px-4 py-2 text-right">
                      ₹{i.price}
                    </td>
                    <td className="px-4 py-2 text-right font-medium">
                      ₹{i.qty * i.price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* CUSTOMER & ADDRESS */}
          <div className="bg-white border rounded p-4">
            <div className="flex justify-between mb-3">
              <h2 className="font-semibold">Customer & Address</h2>
              <button
                onClick={() => setEditMode(!editMode)}
                className="text-sm text-blue-600"
              >
                {editMode ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {['name', 'phone', 'address', 'city', 'state', 'pincode'].map(f => (
              <div key={f} className="mb-2">
                <div className="text-xs text-gray-500 uppercase">
                  {f}
                </div>
                {editMode ? (
                  <input
                    className="w-full border rounded px-2 py-1 text-sm"
                    value={meta[f] || ''}
                    onChange={e =>
                      setOrder({
                        ...order,
                        meta: { ...meta, [f]: e.target.value },
                      })
                    }
                  />
                ) : (
                  <div className="text-sm">{meta[f] || '—'}</div>
                )}
              </div>
            ))}

            {editMode && (
              <button
                onClick={saveCustomer}
                disabled={saving}
                className="mt-2 px-4 py-2 bg-black text-white rounded"
              >
                {saving ? 'Saving…' : 'Save changes'}
              </button>
            )}
          </div>

          {/* ADDRESS INTELLIGENCE */}

          <div className="bg-white border rounded p-4">
            <div className="flex justify-between items-center mb-3">
              <button
                onClick={() => setShowIntel(!showIntel)}
                className="text-sm font-medium"
              >
                Address intelligence · India Post{' '}
                {showIntel ? '▲' : '▼'}
              </button>
              <button
                onClick={validatePincode}
                disabled={saving}
                className="text-xs bg-gray-100 hover:bg-gray-200 border px-2 py-1.5 rounded"
              >
                {saving ? 'Fetching...' : 'Validate Pincode'}
              </button>
            </div>

            {showIntel && pincodeMeta && (
              <div className="mt-3 space-y-2 text-sm">
                {pincodeMeta.post_offices?.map((po: any, i: number) => (
                  <div
                    key={i}
                    className="flex justify-between"
                  >
                    <div>
                      <div className="font-medium">
                        {po.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {po.district}, {po.region}
                      </div>
                    </div>
                    <div
                      className={
                        po.delivery_status === 'Delivery'
                          ? 'text-green-600'
                          : 'text-orange-600'
                      }
                    >
                      {po.delivery_status}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {showIntel && !pincodeMeta && (
              <div className="text-sm text-gray-500 mt-2">
                No data available. Click "Validate Pincode" to fetch.
              </div>
            )}
          </div>

        </div>
      </div>

      {/* RIGHT / ACTION RAIL */}
      <div className="space-y-6">

        {/* ORDER SUMMARY */}
        <div className="bg-white border rounded p-4">
          <h2 className="font-semibold mb-3">Order summary</h2>

          <div className="flex justify-between text-sm mb-1">
            <span>Items subtotal</span>
            <span>₹{itemsSubtotal}</span>
          </div>

          <div className="flex justify-between text-sm mb-1">
            <span>Tax</span>
            <span>₹{taxAmount}</span>
          </div>

          <div className="flex justify-between text-sm mb-1">
            <span>Shipping</span>
            <span>₹{shippingAmount}</span>
          </div>

          <div className="flex justify-between font-semibold border-t pt-2 mt-2">
            <span>Total</span>
            <div className="text-right">
              <div>₹{order.total_amount}</div>
              {order.total_amount < grandTotal && (
                <div className="text-[10px] text-green-600 font-normal">
                  Prepaid Savings: -₹{grandTotal - order.total_amount} applied
                </div>
              )}
            </div>
          </div>
        </div>

        {/* STATUS */}
        <div className="bg-white border rounded p-4">
          <h2 className="font-semibold mb-2">Order status</h2>
          <select
            className="w-full border rounded px-2 py-2"
            value={order.status}
            onChange={e => updateStatus(e.target.value)}
          >
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-2">
            Changing status affects fulfillment & reporting.
          </p>
        </div>

        {/* COD RISK */}
        <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
          <h2 className="font-semibold mb-2">
            COD Risk (Experimental)
          </h2>
          <button
            onClick={runRisk}
            className="w-full bg-yellow-600 text-white py-2 rounded"
          >
            Run risk check
          </button>
        </div>

        {/* MANUAL VERIFY ACTION (P0-3) */}
        {order.payment_mode === 'cod' && !order.meta?.otp_verified && (
          <div className="bg-blue-50 border border-blue-200 rounded p-4">
            <h2 className="font-semibold mb-2">Manual Verification</h2>
            <p className="text-xs text-gray-600 mb-3">
              If you verified this order via call/WhatsApp, mark it here.
            </p>
            <button
              onClick={manualVerify}
              disabled={saving}
              className="w-full bg-blue-600 text-white py-2 rounded text-sm font-medium"
            >
              Mark as OTP Verified
            </button>
          </div>
        )}

        <button
          onClick={() => router.back()}
          className="w-full border rounded py-2 bg-white"
        >
          Back to orders
        </button>
      </div>
    </div>
  )
}
