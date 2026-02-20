'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { getActiveStoreIdClient } from '@/lib/getActiveStore.client'
import { PageSkeleton } from '@/components/ui/Skeletons'
import { EmptyState } from '@/components/ui/EmptyState'
import { Users, ArrowRight, TrendingUp } from 'lucide-react'
import { SearchInput } from '../components/SearchInput'

export default function CustomersPage() {
    const router = useRouter()
    const [storeId, setStoreId] = useState<string | null>(null)
    const [customers, setCustomers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        const id = getActiveStoreIdClient()
        if (!id) {
            router.replace('/admin/stores')
            return
        }
        setStoreId(id)
        loadCustomers(id)
    }, [router])

    const loadCustomers = async (activeStoreId: string) => {
        setLoading(true)
        // Fetch all orders for this store to aggregate customers
        // In a real app with 10k+ orders, we'd use a dedicated 'customers' table
        // For now, this "Live Aggregation" approach ensures existing data is reused
        const { data: orders } = await supabaseBrowser
            .from('orders')
            .select('meta, total_amount, created_at')
            .eq('store_id', activeStoreId)
            .order('created_at', { ascending: false })

        if (!orders) {
            setCustomers([])
            setLoading(false)
            return
        }

        const customerMap = new Map()

        orders.forEach(order => {
            const phone = order.meta?.phone
            if (!phone) return

            if (!customerMap.has(phone)) {
                customerMap.set(phone, {
                    phone,
                    name: order.meta?.name || 'Unknown Customer',
                    email: order.meta?.email || null,
                    total_orders: 0,
                    total_spent: 0,
                    last_order_at: order.created_at,
                    address: `${order.meta?.address || ''}, ${order.meta?.city || ''}`.trim().replace(/^,/, '')
                })
            }

            const c = customerMap.get(phone)
            c.total_orders += 1
            c.total_spent += Number(order.total_amount || 0)
        })

        setCustomers(Array.from(customerMap.values()))
        setLoading(false)
    }

    const filteredCustomers = customers.filter(c => {
        const q = search.toLowerCase()
        return c.name.toLowerCase().includes(q) || c.phone.includes(q)
    })

    if (loading) return <PageSkeleton />

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900 uppercase tracking-tight">Customers</h1>
                    <p className="text-sm text-neutral-500 font-medium tracking-tight">Manage and view your customer relationships.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                            <Users className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Total Customers</span>
                    </div>
                    <div className="text-3xl font-bold text-neutral-900">{customers.length}</div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
                            <TrendingUp className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Avg. Order Value</span>
                    </div>
                    <div className="text-3xl font-bold text-neutral-900">
                        ₹{customers.length > 0 ? Math.round(customers.reduce((acc, c) => acc + c.total_spent, 0) / customers.reduce((acc, c) => acc + c.total_orders, 0)) : 0}
                    </div>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <SearchInput
                        label="Search Customers"
                        placeholder="By name or phone..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        containerClassName="flex-1 max-w-md"
                    />
                </div>

                {filteredCustomers.length === 0 ? (
                    <div className="p-20 text-center">
                        <EmptyState
                            title="No customers found"
                            description="Customers will appear here once they place an order."
                            icon={<Users className="w-12 h-12 opacity-10" />}
                        />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50">
                                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-neutral-400">Customer</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-neutral-400">Total Orders</th>
                                    <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-widest text-neutral-400">Total Spent</th>
                                    <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-widest text-neutral-400">Last Active</th>
                                    <th className="px-6 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y border-neutral-100">
                                {filteredCustomers.map((customer, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors group border-b border-slate-50 last:border-none">
                                        <td className="px-6 py-4 text-sm font-bold text-neutral-900">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 font-bold border border-blue-100 shadow-sm">
                                                    {customer.name.substring(0, 1).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-neutral-900 uppercase tracking-tight">{customer.name}</p>
                                                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-0.5">{customer.phone}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-neutral-500 font-bold">
                                            {customer.total_orders} Orders
                                        </td>
                                        <td className="px-6 py-4 text-sm text-right font-bold text-neutral-900">
                                            ₹{customer.total_spent.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-right text-neutral-400 font-medium tracking-tight">
                                            {new Date(customer.last_order_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => router.push(`/admin/customers/${customer.phone}`)}
                                                className="p-2 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                            >
                                                <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
