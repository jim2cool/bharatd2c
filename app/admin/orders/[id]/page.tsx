'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { calculateRiskScore } from '@/lib/rto-engine'
import { Layout, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import ShippingManager from './components/ShippingManager'

const STATUS_OPTIONS = [
  'new',
  'confirmed',
  'held',
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
      .select('*, shipping_cost_actual, gateway_fee_actual, net_profit')
      .eq('id', id)
      .single()

    const { data: itemData } = await supabaseBrowser
      .from('order_items')
      .select(`
        qty,
        price,
        cogs_at_sale,
        products ( title, cogs, shipping_cost_preset, gateway_fee_percentage ),
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

  /* ---------------- RTO RISK ---------------- */

  const runRisk = async () => {
    setSaving(true)
    const { count: previousRtos } = await supabaseBrowser
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('customer_id', order.customer_id)
      .eq('status', 'rto')

    // Fetch other signals for the record
    const { count: sameAddressCount } = await supabaseBrowser
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('customer_id', order.customer_id)
      .eq('payment_mode', 'cod')
      .filter('created_at', 'gte', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

    const result = await calculateRiskScore({
      pincode: meta.pincode,
      category: 'default',
      payment_mode: order.payment_mode,
      total_amount: order.total_amount,
      previous_rtos: previousRtos || 0,
      name: meta.name,
      address: meta.address,
      phone: meta.phone,
      order_timestamp: order.created_at,
      same_address_30d_count: sameAddressCount || 0,
      session_signals: meta.session_signals // If available in meta
    })

    const newMeta = {
      ...meta,
      risk_score: result.score,
      risk_drivers: result.drivers,
      risk_summary: result.summary,
      risk_recommendation: result.recommendation,
      action_type: result.action_type
    }

    await supabaseBrowser
      .from('orders')
      .update({
        risk_level: result.level,
        meta: newMeta,
      })
      .eq('id', order.id)

    toast.success(`Risk generated: ${result.summary}`)
    loadOrder()
    setSaving(false)
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

  /* ---------------- DERIVED TOTALS & PROFIT ---------------- */

  const itemsSubtotal = items.reduce(
    (sum, i) => sum + i.qty * i.price,
    0
  )

  const taxAmount = meta.tax_amount || 0
  const shippingAmount = meta.shipping_amount || 0
  const grandTotal = itemsSubtotal + taxAmount + shippingAmount

  // Profit Engine Logic
  const totalCogs = items.reduce((sum, i) => {
    const unitCogs = i.cogs_at_sale || i.products?.cogs || 0
    return sum + (i.qty * unitCogs)
  }, 0)

  // Estimated fees if actuals are 0
  const estShipping = order.shipping_cost_actual || (order.status === 'shipped' || order.status === 'delivered' ? 70 : 0)
  const estGateway = order.gateway_fee_actual || (order.payment_mode === 'online' ? (order.total_amount * 0.025) : 0)

  const realProfit = order.total_amount - totalCogs - estShipping - estGateway
  const profitMargin = order.total_amount > 0 ? (realProfit / order.total_amount) * 100 : 0
  const marginColor = profitMargin >= 30 ? 'text-green-600' : profitMargin >= 15 ? 'text-amber-600' : 'text-red-600'
  const marginBg = profitMargin >= 30 ? 'bg-green-50' : profitMargin >= 15 ? 'bg-amber-50' : 'bg-red-50'

  /* ---------------- UI ---------------- */

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-black uppercase tracking-tighter">Order #{order.order_number || order.id?.slice(0, 8)}</h1>
          {order.payment_mode === 'cod' && (
            <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-widest ${order.status === 'held' ? 'bg-orange-100 text-orange-700' : order.meta?.otp_verified ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {order.status === 'held' ? '⌛ Held for Review' : order.meta?.otp_verified ? '✓ Verified' : '⚠ Action Required'}
            </span>
          )}
        </div>
      </div>

      {order.status === 'held' && (
        <div className="mb-6 bg-orange-50 border-2 border-orange-100 rounded-[2rem] p-8 flex items-center justify-between shadow-sm animate-in zoom-in-95 duration-500">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center border border-orange-200 shadow-inner">
              <Sparkles className="w-7 h-7 text-orange-600" />
            </div>
            <div>
              <h2 className="text-lg font-black text-orange-900 uppercase tracking-tighter">Minimal Setup - Guardrail Active</h2>
              <p className="text-sm font-bold text-orange-700/80 leading-relaxed max-w-xl mt-1">
                This order was held because your store is in <span className="underline decoration-2 underline-offset-4 font-black">Minimal Mode (State D)</span>.
                Without WhatsApp or a Gateway, the RTO engine cannot automatically verify intent. Manual approval is required.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => updateStatus('confirmed')}
              className="px-8 py-4 bg-orange-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-orange-700 transition-all shadow-xl shadow-orange-200 active:scale-95"
            >
              Approve Order
            </button>
            <button
              onClick={() => updateStatus('cancelled')}
              className="px-8 py-4 bg-white border-2 border-orange-200 text-orange-700 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-orange-100 transition-all active:scale-95"
            >
              Cancel Order
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT / MAIN */}
        <div className="lg:col-span-2 space-y-8">

          {/* ITEMS — PRIMARY FOCUS */}
          <div className="bg-white border border-slate-300 rounded-xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 font-semibold text-neutral-800">
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
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between mb-3">
              <h2 className="font-semibold">Customer & Address</h2>
              <button
                onClick={() => setEditMode(!editMode)}
                className="text-sm text-blue-600"
              >
                {editMode ? 'Cancel' : 'Edit'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {['name', 'phone', 'address', 'city', 'state', 'pincode'].map(f => (
                <div key={f} className={f === 'address' ? 'col-span-2' : ''}>
                  <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1.5">
                    {f}
                  </div>
                  {editMode ? (
                    <input
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm"
                      value={meta[f] || ''}
                      onChange={e =>
                        setOrder({
                          ...order,
                          meta: { ...meta, [f]: e.target.value },
                        })
                      }
                    />
                  ) : (
                    <div className="text-sm font-medium">{meta[f] || '—'}</div>
                  )}
                </div>
              ))}
            </div>

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
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
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
                  <div key={i} className="flex justify-between">
                    <div>
                      <div className="font-medium">{po.name}</div>
                      <div className="text-xs text-gray-500">
                        {po.district}, {po.region}
                      </div>
                    </div>
                    <div className={po.delivery_status === 'Delivery' ? 'text-green-600' : 'text-orange-600'}>
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

        {/* RIGHT / ACTION RAIL */}
        <div className="space-y-8">

          {/* PROFIT ENGINE (MANIFESTO PRIME) */}
          <div className={`border rounded-xl p-5 shadow-sm ${marginBg} border-current/10`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black uppercase tracking-widest text-neutral-800">Profit Breakdown</h2>
              <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${marginColor} bg-white border border-current/20`}>
                {Math.round(profitMargin)}% Margin
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Gross Revenue</span>
                <span className="font-bold">₹{order.total_amount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500 text-xs">- Total COGS</span>
                <span className="text-red-600 font-medium tracking-tight">₹{totalCogs}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500 text-xs">- Est. Shipping</span>
                <span className="text-red-600 font-medium tracking-tight">₹{estShipping}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500 text-xs">- Gateway Fees</span>
                <span className="text-red-600 font-medium tracking-tight">₹{Math.round(estGateway)}</span>
              </div>

              <div className={`flex justify-between items-center border-t border-current/10 pt-3 mt-1 ${marginColor}`}>
                <span className="text-xs font-black uppercase tracking-tight">Net Contribution</span>
                <span className="text-lg font-black tracking-tighter">₹{Math.round(realProfit)}</span>
              </div>
            </div>

            <p className="text-[9px] text-neutral-400 mt-4 leading-tight italic font-medium">
              *Net contribution is calculated after subtracting direct COGS, estimated shipping, and gateway costs.
            </p>
          </div>

          {/* ORDER SUMMARY */}
          <div className="bg-white border border-slate-300 rounded-xl p-4 shadow-sm">
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
                <div className="text-xl font-bold">₹{order.total_amount}</div>
                {order.total_amount < grandTotal && (
                  <div className="text-[10px] text-green-600 font-normal">
                    Prepaid Savings: -₹{grandTotal - order.total_amount} applied
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* STATUS */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-sm font-bold text-neutral-800 mb-4 flex items-center gap-2">
              <Layout className="w-4 h-4 text-blue-500" />
              Order status
            </h2>
            <select
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all cursor-pointer shadow-sm"
              value={order.status}
              onChange={e => updateStatus(e.target.value)}
            >
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <ShippingManager order={order} onUpdate={loadOrder} />

          {/* RTO RISK ASSESSMENT */}
          <div className={`border rounded-xl p-5 shadow-sm transition-all ${order.risk_level === 'kill' ? 'bg-black text-white border-black' :
            order.risk_level === 'high' ? 'bg-red-50 text-red-900 border-red-200' :
              order.risk_level === 'medium' ? 'bg-orange-50 text-orange-900 border-orange-200' :
                order.risk_level === 'low' ? 'bg-green-50 text-green-900 border-green-200' :
                  'bg-slate-50 text-slate-800 border-slate-200'
            }`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                RTO Engine Logic
              </h2>
              {order.risk_level && (
                <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${order.risk_level === 'kill' ? 'bg-red-600 text-white border-red-800' :
                  order.risk_level === 'high' ? 'bg-white text-red-700 border-red-200' :
                    order.risk_level === 'medium' ? 'bg-white text-orange-700 border-orange-200' :
                      'bg-white text-green-700 border-green-200'
                  }`}>
                  {order.risk_level === 'kill' ? '🚫 KILL' : `Score: ${meta.risk_score || 0}`}
                </div>
              )}
            </div>

            {meta.risk_summary ? (
              <div className="mb-4">
                <div className="text-sm font-black mb-1">{meta.risk_summary}</div>
                <div className="text-xs font-medium leading-relaxed opacity-80">{meta.risk_recommendation}</div>
              </div>
            ) : (
              <div className="text-xs font-medium opacity-60 mb-4 italic">
                RTO scoring engine active.
              </div>
            )}

            {meta.risk_drivers && meta.risk_drivers.length > 0 && (
              <div className="space-y-1 my-4 border-t border-current/10 pt-4">
                <div className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">Technical Signals</div>
                {meta.risk_drivers.map((driver: string, i: number) => (
                  <div key={i} className="text-[10px] font-medium pl-2 border-l-2 border-current/20 py-0.5 opacity-60">
                    {driver}
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={runRisk}
              disabled={saving}
              className="w-full bg-white border border-current/10 py-2.5 rounded-lg text-[11px] uppercase tracking-widest font-black hover:bg-black hover:text-white transition-all shadow-sm active:scale-95 disabled:opacity-50"
            >
              {saving ? 'Analyzing...' : meta.risk_summary ? 'Re-Run Risk Engine' : 'Generate Full Risk Profile'}
            </button>

            {/* Kill-level: surface cancel action in-card */}
            {order.risk_level === 'kill' && order.status !== 'cancelled' && (
              <button
                onClick={() => updateStatus('cancelled')}
                className="w-full mt-3 bg-red-600 text-white py-3 rounded-lg text-[11px] uppercase tracking-widest font-black hover:bg-red-700 transition-all active:scale-95 shadow-lg shadow-red-900/50"
              >
                🚫 Cancel Order — Kill Risk
              </button>
            )}
          </div>

          {/* MANUAL VERIFY ACTION */}
          {order.payment_mode === 'cod' && !order.meta?.otp_verified && (
            <div className="bg-blue-600 text-white rounded-xl p-6 shadow-xl shadow-blue-100 border border-blue-400">
              <h2 className="text-sm font-bold mb-2">Manual Verification</h2>
              <p className="text-xs opacity-90 mb-4 leading-relaxed font-medium">
                Verify intent via call or WhatsApp.
              </p>
              <button
                onClick={manualVerify}
                disabled={saving}
                className="w-full bg-white text-blue-600 py-2.5 rounded-lg text-sm font-bold hover:bg-neutral-50 transition-colors active:scale-95 shadow-lg"
              >
                Mark as Verified
              </button>
            </div>
          )}

          <button
            onClick={() => router.back()}
            className="w-full border border-neutral-200 rounded-xl py-3 text-sm font-bold bg-white hover:bg-neutral-50 transition-colors text-neutral-600"
          >
            Back to orders
          </button>
        </div>
      </div>
    </div>
  )
}

