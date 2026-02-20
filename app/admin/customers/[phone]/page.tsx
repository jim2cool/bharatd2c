'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { PageSkeleton } from '@/components/ui/Skeletons'
import { ShoppingBag, ChevronLeft, Phone, MapPin, Calendar, Wallet } from 'lucide-react'

export default function CustomerDetailPage() {
    const { phone } = useParams()
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [customer, setCustomer] = useState<any>(null)
    const [orders, setOrders] = useState<any[]>([])

    useEffect(() => {
        async function loadData() {
            setLoading(true)

            // Fetch all orders for this phone number
            const { data: orderData } = await supabaseBrowser
                .from('orders')
                .select('*')
                .contains('meta', { phone })
                .order('created_at', { ascending: false })

            if (!orderData || orderData.length === 0) {
                setLoading(false)
                return
            }

            const lastOrder = orderData[0]
            const meta = lastOrder.meta || {}

            setCustomer({
                phone: meta.phone,
                name: meta.name || 'Unknown Customer',
                email: meta.email || '—',
                address: meta.address || '—',
                city: meta.city || '—',
                state: meta.state || '—',
                pincode: meta.pincode || '—',
                total_spent: orderData.reduce((acc, o) => acc + Number(o.total_amount || 0), 0),
                total_orders: orderData.length,
                first_order_at: orderData[orderData.length - 1].created_at,
                last_order_at: orderData[0].created_at
            })

            setOrders(orderData)
            setLoading(false)
        }
        loadData()
    }, [phone])

    if (loading) return <PageSkeleton />
    if (!customer) return <div className="p-10 text-center">Customer not found</div>

    return (
        <div className="space-y-6">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors"
            >
                <ChevronLeft className="w-3 h-3" />
                Back to Customers
            </button>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-3xl bg-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-blue-100">
                        {customer.name.substring(0, 1).toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-neutral-900 uppercase tracking-tighter">{customer.name}</h1>
                        <div className="flex items-center gap-4 mt-1">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-400">
                                <Phone className="w-3 h-3" /> {customer.phone}
                            </div>
                            <div className="w-1 h-1 rounded-full bg-neutral-200" />
                            <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-400">
                                <Calendar className="w-3 h-3" /> Member since {new Date(customer.first_order_at).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* ORDER HISTORY */}
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                            <h2 className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">Order History</h2>
                            <div className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-neutral-600">
                                {orders.length} TOTAL
                            </div>
                        </div>

                        <div className="divide-y divide-slate-50">
                            {orders.map((order, idx) => (
                                <div key={idx} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-neutral-400 shadow-sm">
                                            <ShoppingBag className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <Link href={`/admin/orders/${order.id}`} className="text-sm font-bold text-neutral-900 hover:text-blue-600 transition-all uppercase tracking-tight">
                                                Order #{order.order_number}
                                            </Link>
                                            <p className="text-[10px] font-medium text-neutral-400 uppercase tracking-widest mt-0.5">
                                                {new Date(order.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-neutral-900">₹{order.total_amount.toLocaleString()}</p>
                                        <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${order.status === 'delivered' ? 'bg-green-50 text-green-600' :
                                                order.status === 'cancelled' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ADDRESS INFO */}
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                        <h2 className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 mb-6 flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5" /> Shipping Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-300 leading-none">Primary Address</p>
                                <p className="text-sm font-semibold text-neutral-700 leading-snug">{customer.address}</p>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-300 leading-none">City / State</p>
                                    <p className="text-sm font-semibold text-neutral-700 leading-snug">{customer.city}, {customer.state}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-300 leading-none">Pincode</p>
                                    <p className="text-sm font-mono font-bold text-neutral-700 leading-snug">{customer.pincode}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* LIFETIME VALUE */}
                    <div className="bg-slate-900 text-white border border-slate-900 rounded-2xl shadow-lg shadow-slate-200 p-8">
                        <h2 className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-4 flex items-center gap-2">
                            <Wallet className="w-3.5 h-3.5" /> Lifetime Value (LTV)
                        </h2>
                        <div className="text-4xl font-bold tracking-tighter mb-2">₹{customer.total_spent.toLocaleString()}</div>
                        <p className="text-xs font-medium text-slate-400">Total revenue generated through {customer.total_orders} individual orders.</p>

                        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Average Order</p>
                                <p className="text-lg font-bold tracking-tight mt-0.5">₹{Math.round(customer.total_spent / customer.total_orders).toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Orders</p>
                                <p className="text-lg font-bold tracking-tight mt-0.5 text-blue-400">{customer.total_orders}</p>
                            </div>
                        </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <h2 className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 mb-4">Contact Customer</h2>
                        <div className="space-y-3">
                            <a
                                href={`https://wa.me/91${customer.phone}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex items-center justify-center gap-2 py-2.5 bg-green-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-green-600 transition-all shadow-md shadow-green-100"
                            >
                                WhatsApp Support
                            </a>
                            <a
                                href={`tel:${customer.phone}`}
                                className="w-full flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-200 text-neutral-900 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-all"
                            >
                                Call Customer
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
