import { createClient } from '@/lib/supabase-server'
import SuperAdminAnalytics from './components/SuperAdminAnalytics'
import { Store, Users, ShoppingBag, IndianRupee, TrendingUp, Calendar } from 'lucide-react'

export default async function SuperAdminDashboard() {
    const supabase = await createClient()

    // 1. Fetch Basic Data
    const { data: stores } = await supabase
        .from('stores')
        .select('*')
        .order('created_at', { ascending: false })

    const { data: users } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

    // 2. Fetch Order Data for Analytics (Last 30 Days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: allOrders } = await supabase
        .from('orders')
        .select('total_amount, created_at, store_id, status')
        .gte('created_at', thirtyDaysAgo.toISOString())

    // 3. Calculate Platform Metrics
    const totalRevenue = allOrders?.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total_amount : 0), 0) || 0
    const totalOrders = allOrders?.length || 0
    const activeStores = stores?.length || 0
    const newUsers = users?.filter(u => new Date(u.created_at) > thirtyDaysAgo).length || 0

    // 4. Process Chart Data
    // Revenue by Date
    const revenueMap: Record<string, number> = {}
    allOrders?.forEach(o => {
        if (o.status === 'cancelled') return
        const date = new Date(o.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
        revenueMap[date] = (revenueMap[date] || 0) + o.total_amount
    })

    const revenueData = Object.keys(revenueMap).map(date => ({
        date,
        amount: revenueMap[date]
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Orders by Store
    const storeMap: Record<string, { name: string, orders: number }> = {}
    allOrders?.forEach(o => {
        const store = stores?.find(s => s.id === o.store_id)
        const name = store?.name || 'Unknown'
        if (!storeMap[o.store_id]) {
            storeMap[o.store_id] = { name, orders: 0 }
        }
        storeMap[o.store_id].orders++
    })

    const storeData = Object.values(storeMap)
        .sort((a, b) => b.orders - a.orders)
        .slice(0, 5)

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-10">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-100 pb-8">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-black text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">Engine Control</span>
                    </div>
                    <h1 className="text-4xl font-black text-neutral-900 tracking-tight">Super Admin Dashboard</h1>
                    <p className="text-neutral-500 mt-1 font-medium">Global platform health and oversight</p>
                </div>
                <div className="flex items-center gap-3 bg-neutral-50 px-4 py-2 rounded-xl border border-neutral-100 text-sm font-bold text-neutral-600">
                    <Calendar className="w-4 h-4" />
                    Last 30 Days
                </div>
            </div>

            {/* METRIC CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Platform Revenue', value: `₹${totalRevenue.toLocaleString()}`, sub: 'Last 30 days', icon: IndianRupee, color: 'text-green-600', bg: 'bg-green-50' },
                    { label: 'Global Orders', value: totalOrders, sub: 'Last 30 days', icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Total Stores', value: activeStores, sub: 'All time', icon: Store, color: 'text-purple-600', bg: 'bg-purple-50' },
                    { label: 'New Partners', value: newUsers, sub: 'Last 30 days', icon: Users, color: 'text-orange-600', bg: 'bg-orange-50' },
                ].map((m, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow group">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`${m.bg} ${m.color} p-3 rounded-xl group-hover:scale-110 transition-transform`}>
                                <m.icon className="w-6 h-6" />
                            </div>
                            <TrendingUp className="w-4 h-4 text-neutral-300" />
                        </div>
                        <div className="text-2xl font-black text-neutral-900 mb-1">{m.value}</div>
                        <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{m.label}</div>
                        <div className="mt-4 pt-4 border-t border-neutral-50 text-[10px] text-neutral-400 font-bold italic">{m.sub}</div>
                    </div>
                ))}
            </div>

            {/* ANALYTICS CHARTS */}
            <SuperAdminAnalytics revenueData={revenueData} storeData={storeData} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* STORES SECTION */}
                <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
                    <div className="px-8 py-6 border-b border-neutral-50 flex items-center justify-between">
                        <h2 className="text-xl font-black text-neutral-900 flex items-center gap-2">
                            <Store className="w-5 h-5" />
                            Recent Stores
                        </h2>
                        <span className="text-xs font-black bg-neutral-100 px-3 py-1 rounded-full uppercase tracking-widest">Total: {stores?.length || 0}</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-[10px] text-neutral-400 font-black uppercase tracking-widest bg-neutral-50/50">
                                <tr>
                                    <th className="px-8 py-4">Store</th>
                                    <th className="px-8 py-4">Code</th>
                                    <th className="px-8 py-4 text-right">Joined</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-50">
                                {stores?.slice(0, 5).map((store) => (
                                    <tr key={store.id} className="hover:bg-neutral-50 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">{store.name}</div>
                                            <div className="text-[10px] text-neutral-400 font-medium">{store.custom_domain || 'platform-default'}</div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <code className="text-[10px] bg-neutral-100 px-1.5 py-0.5 rounded font-black">{store.store_code}</code>
                                        </td>
                                        <td className="px-8 py-5 text-right text-neutral-500 font-bold tabular-nums">
                                            {new Date(store.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* USERS SECTION */}
                <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
                    <div className="px-8 py-6 border-b border-neutral-50 flex items-center justify-between">
                        <h2 className="text-xl font-black text-neutral-900 flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            Recent Users
                        </h2>
                        <span className="text-xs font-black bg-neutral-100 px-3 py-1 rounded-full uppercase tracking-widest">Total: {users?.length || 0}</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-[10px] text-neutral-400 font-black uppercase tracking-widest bg-neutral-50/50">
                                <tr>
                                    <th className="px-8 py-4">Identity</th>
                                    <th className="px-8 py-4">Access</th>
                                    <th className="px-8 py-4 text-right">Joined</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-50">
                                {users?.slice(0, 5).map((user) => (
                                    <tr key={user.id} className="hover:bg-neutral-50 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">{user.email}</div>
                                            <div className="text-[10px] text-neutral-400 font-medium capitalize">{user.first_name || 'Anonymous User'}</div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter shadow-sm border ${user.role === 'super_admin' ? 'bg-black text-white border-black' : 'bg-green-50 text-green-700 border-green-100'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right text-neutral-500 font-bold tabular-nums">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
