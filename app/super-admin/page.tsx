import { createClient } from '@/lib/supabase-server'
import SuperAdminAnalytics from './components/SuperAdminAnalytics'
import { Store, Users, ShoppingBag, IndianRupee, TrendingUp, Calendar } from 'lucide-react'

export default async function SuperAdminDashboard() {
    const supabase = await createClient()

    // 0. Security Verification
    const { data: { user } } = await supabase.auth.getUser()
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user?.id)
        .single()

    if (profile?.role !== 'super_admin' && user?.email !== 'shashwat@e4a.in') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-8 bg-white border border-red-100 rounded-2xl shadow-sm">
                    <h1 className="text-2xl font-black text-red-600 mb-2">Unauthorized Access</h1>
                    <p className="text-gray-500 font-medium whitespace-pre-wrap">You do not have permission to view this console.</p>
                </div>
            </div>
        )
    }

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
        <div className="min-h-screen bg-[#FAFAF9] selection:bg-black selection:text-white">
            <div className="max-w-[1600px] mx-auto py-12 px-6 lg:px-12 space-y-12">
                {/* 1. PROFESSIONAL HEADER */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-2xl rotate-3 hover:rotate-0 transition-transform cursor-pointer">
                                <TrendingUp className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-[10px] font-black bg-black/5 px-2.5 py-1 rounded-full uppercase tracking-[0.2em] text-black">Console v2.4</span>
                        </div>
                        <h1 className="text-5xl font-black text-neutral-900 tracking-tighter pt-4">Nexus Hub</h1>
                        <p className="text-neutral-500 font-medium text-lg max-w-md">Orchestrating the Bharat D2C ecosystem with precision intelligence.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-3 overflow-hidden">
                            {users?.slice(0, 3).map((u, i) => (
                                <div key={i} className="inline-block h-10 w-10 rounded-full ring-4 ring-[#FAFAF9] bg-neutral-200 border border-neutral-300 flex items-center justify-center text-[10px] font-black uppercase">
                                    {u.first_name?.[0] || u.email[0]}
                                </div>
                            ))}
                        </div>
                        <div className="h-10 w-px bg-neutral-200 mx-2" />
                        <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl border border-neutral-200 shadow-sm text-sm font-bold text-neutral-600 hover:border-black transition-colors cursor-pointer group">
                            <Calendar className="w-4 h-4 group-hover:text-black transition-colors" />
                            Active Period: <span className="text-black ml-1">Last 30 Days</span>
                        </div>
                    </div>
                </div>

                {/* 2. BENTO METRICS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: 'Network Revenue', value: `₹${totalRevenue.toLocaleString()}`, sub: 'Revenue flow across all stores', icon: IndianRupee, color: 'text-neutral-900', bg: 'bg-white' },
                        { label: 'Fulfilled Nodes', value: totalOrders, sub: 'Successfully routed transactions', icon: ShoppingBag, color: 'text-neutral-900', bg: 'bg-white' },
                        { label: 'Active Clusters', value: activeStores, sub: 'Provisioned storefront instances', icon: Store, color: 'text-neutral-900', bg: 'bg-white' },
                        { label: 'Identity Growth', value: newUsers, sub: 'New verified platform identities', icon: Users, color: 'text-neutral-900', bg: 'bg-white' },
                    ].map((m, i) => (
                        <div key={i} className={`${m.bg} p-8 rounded-[2rem] border border-neutral-200 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-xl transition-all duration-500 group relative overflow-hidden`}>
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-150 transition-transform duration-700">
                                <m.icon className="w-24 h-24 text-black" />
                            </div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-100 group-hover:bg-black group-hover:text-white transition-all duration-300">
                                    <m.icon className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{m.label}</span>
                            </div>
                            <div className="text-4xl font-black text-neutral-900 mb-2 tracking-tighter">{m.value}</div>
                            <p className="text-xs font-medium text-neutral-500 leading-relaxed">{m.sub}</p>
                        </div>
                    ))}
                </div>

                {/* 3. CORE ANALYTICS BENTO */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 bg-white border border-neutral-200 rounded-[2.5rem] shadow-sm p-8 group hover:border-neutral-300 transition-colors">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-2xl font-black text-neutral-900 tracking-tight">Revenue Trajectory</h3>
                                <p className="text-sm font-medium text-neutral-400">Time-series data for platform growth</p>
                            </div>
                            <div className="flex items-center gap-2 bg-neutral-50 p-1 rounded-xl">
                                <button className="px-3 py-1.5 text-[10px] font-black uppercase rounded-lg bg-white shadow-sm border border-neutral-200">Real-time</button>
                                <button className="px-3 py-1.5 text-[10px] font-black uppercase rounded-lg text-neutral-400 hover:text-neutral-900">Historical</button>
                            </div>
                        </div>
                        <div className="h-[400px]">
                            <SuperAdminAnalytics revenueData={revenueData} storeData={storeData} />
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-8">
                        {/* TOP PERFORMERS */}
                        <div className="bg-black text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl -mr-16 -mt-16" />
                            <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-blue-400" />
                                Peak Velocity
                            </h3>
                            <div className="space-y-6">
                                {storeData.slice(0, 3).map((store, i) => (
                                    <div key={i} className="flex items-center justify-between group cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-black text-sm group-hover:bg-white group-hover:text-black transition-all">
                                                {i + 1}
                                            </div>
                                            <div>
                                                <div className="font-bold text-sm">{store.name}</div>
                                                <div className="text-[10px] text-white/40 uppercase font-black">{store.orders} Orders</div>
                                            </div>
                                        </div>
                                        <div className="h-1 w-12 bg-white/10 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500" style={{ width: `${(store.orders / storeData[0].orders) * 100}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8 pt-8 border-t border-white/10">
                                <button className="w-full py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-neutral-200 transition-colors">View All Nodes</button>
                            </div>
                        </div>

                        {/* ACCESS LOGS QUICK-LOOK */}
                        <div className="bg-white border border-neutral-200 rounded-[2.5rem] p-8 shadow-sm">
                            <h3 className="text-xl font-black text-neutral-900 mb-6 flex items-center gap-2">
                                <Users className="w-5 h-5 text-neutral-400" />
                                Recent Access
                            </h3>
                            <div className="space-y-4">
                                {users?.slice(0, 4).map((user, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-[10px] font-black uppercase text-neutral-400">
                                            {user.email[0]}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs font-bold text-neutral-900 truncate">{user.email}</div>
                                            <div className="text-[10px] text-neutral-400 uppercase font-black tracking-tighter">{user.role}</div>
                                        </div>
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. DATA TABLES GRID */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {/* STORES SECTION */}
                    <div className="bg-white rounded-[2.5rem] border border-neutral-200 shadow-sm overflow-hidden">
                        <div className="px-10 py-8 border-b border-neutral-50 flex items-center justify-between bg-neutral-50/30">
                            <div>
                                <h2 className="text-xl font-black text-neutral-900 flex items-center gap-3">
                                    <Store className="w-6 h-6 text-neutral-400" />
                                    Provisioned Clusters
                                </h2>
                                <p className="text-xs text-neutral-400 font-medium mt-1">Real-time store instance monitoring</p>
                            </div>
                            <span className="text-[10px] font-black bg-white border border-neutral-200 px-4 py-1.5 rounded-full uppercase tracking-[0.1em] shadow-sm">Index: {stores?.length || 0}</span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-[10px] text-neutral-400 font-black uppercase tracking-[0.2em] bg-neutral-50/50">
                                    <tr>
                                        <th className="px-10 py-5">Instance Identity</th>
                                        <th className="px-10 py-5">Protocol</th>
                                        <th className="px-10 py-5 text-right">Synchronization</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-50">
                                    {stores?.slice(0, 8).map((store) => (
                                        <tr key={store.id} className="hover:bg-neutral-50/50 transition-colors group">
                                            <td className="px-10 py-6">
                                                <div className="font-black text-neutral-900 group-hover:text-black transition-colors flex items-center gap-2">
                                                    {store.name}
                                                    <div className="w-1 h-1 rounded-full bg-blue-500" />
                                                </div>
                                                <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-tighter mt-0.5">{store.custom_domain || 'nexus-default.relay'}</div>
                                            </td>
                                            <td className="px-10 py-6">
                                                <code className="text-[10px] bg-black text-white px-2 py-1 rounded-lg font-black tracking-tighter shadow-sm">{store.store_code}</code>
                                            </td>
                                            <td className="px-10 py-6 text-right text-neutral-500 font-black tabular-nums tracking-tighter">
                                                {new Date(store.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="bg-neutral-50/50 p-6 text-center">
                            <button className="text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-black transition-colors">Expand Full Cluster Matrix</button>
                        </div>
                    </div>

                    {/* USERS SECTION */}
                    <div className="bg-white rounded-[2.5rem] border border-neutral-200 shadow-sm overflow-hidden text-neutral-900">
                        <div className="px-10 py-8 border-b border-neutral-50 flex items-center justify-between bg-neutral-50/30">
                            <div>
                                <h2 className="text-xl font-black text-neutral-900 flex items-center gap-3">
                                    <Users className="w-6 h-6 text-neutral-400" />
                                    Identity Repository
                                </h2>
                                <p className="text-xs text-neutral-400 font-medium mt-1">Auth-level permissions and role distribution</p>
                            </div>
                            <span className="text-[10px] font-black bg-white border border-neutral-200 px-4 py-1.5 rounded-full uppercase tracking-[0.1em] shadow-sm">Entropy: {users?.length || 0}</span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-[10px] text-neutral-400 font-black uppercase tracking-[0.2em] bg-neutral-50/50">
                                    <tr>
                                        <th className="px-10 py-5">Credential Entity</th>
                                        <th className="px-10 py-5">Clearance Level</th>
                                        <th className="px-10 py-5 text-right">Onboarding</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-50">
                                    {users?.slice(0, 8).map((user) => (
                                        <tr key={user.id} className="hover:bg-neutral-50/50 transition-colors group">
                                            <td className="px-10 py-6">
                                                <div className="font-black text-neutral-900 group-hover:text-black transition-colors">{user.email}</div>
                                                <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-tighter mt-0.5">{user.first_name || 'Anonymous Node'}</div>
                                            </td>
                                            <td className="px-10 py-6">
                                                <span className={`px-2.5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider shadow-sm border ${user.role === 'super_admin'
                                                    ? 'bg-black text-white border-black'
                                                    : 'bg-white text-neutral-500 border-neutral-200'
                                                    }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-10 py-6 text-right text-neutral-500 font-black tabular-nums tracking-tighter">
                                                {new Date(user.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="bg-neutral-50/50 p-6 text-center">
                            <button className="text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-black transition-colors">Audit Identity Vault</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
