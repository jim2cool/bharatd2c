import { createClient } from '@/lib/supabase-server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'

interface StoreDetailProps {
    params: Promise<{ id: string }>
}

export default async function StoreDetailPage({ params }: StoreDetailProps) {
    const { id } = await params
    const supabase = await createClient()

    // 1. Fetch Store with Owner and Product Count
    const { data: store, error: storeError } = await supabase
        .from('stores')
        .select(`
            *,
            owner:profiles!owner_id(id, email, first_name, last_name)
        `)
        .eq('id', id)
        .single()

    if (storeError || !store) {
        notFound()
    }

    // 2. Fetch Product Count separately (Supabase count optimization)
    const { count: productCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('store_id', id)

    // 3. Fetch recent products
    const { data: recentProducts } = await supabase
        .from('products')
        .select('id, title, status, price, created_at')
        .eq('store_id', id)
        .order('created_at', { ascending: false })
        .limit(5)

    return (
        <div className="space-y-8 max-w-5xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4">
                <div>
                    <Link href="/super-admin/stores" className="text-sm text-gray-500 hover:text-black mb-1 inline-block">
                        &larr; Back to all stores
                    </Link>
                    <h1 className="text-3xl font-bold text-black">{store.name}</h1>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 border rounded text-sm font-medium hover:bg-gray-50">
                        Login as Owner
                    </button>
                    <button className={`px-4 py-2 rounded text-sm font-medium text-white ${store.is_active ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}>
                        {store.is_active ? 'Deactivate Store' : 'Activate Store'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Store Stats */}
                <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">Store Overview</h2>
                    <div className="grid grid-cols-1 gap-4">
                        <StatItem label="Status" value={store.is_active ? 'Active' : 'Inactive'} color={store.is_active ? 'text-green-600' : 'text-red-600'} />
                        <StatItem label="Slug" value={store.slug} />
                        <StatItem label="Domain" value={store.custom_domain || `${store.slug}.platform.com`} />
                        <StatItem label="Created" value={new Date(store.created_at).toLocaleDateString()} />
                    </div>
                </div>

                {/* Owner Info */}
                <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">Owner Details</h2>
                    <div className="space-y-3">
                        <div>
                            <p className="text-xs text-gray-500">Name</p>
                            <p className="font-medium">{store.owner?.first_name} {store.owner?.last_name || '-'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Email</p>
                            <p className="font-medium">{store.owner?.email}</p>
                        </div>
                        <Link href={`/super-admin/users?q=${store.owner?.email}`} className="text-blue-600 text-sm hover:underline inline-block">
                            View User Profile &rarr;
                        </Link>
                    </div>
                </div>

                {/* Plan Info */}
                <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">Subscription</h2>
                    <div className="space-y-3">
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                            <p className="text-xs text-blue-600 font-bold uppercase">Current Plan</p>
                            <p className="text-xl font-bold text-blue-900 capitalize">{store.subscription_plan || 'Free'}</p>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Total Products</span>
                            <span className="font-bold">{productCount}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Product Activity */}
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="p-6 border-b">
                    <h2 className="font-bold">Recent Products</h2>
                </div>
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 font-medium text-gray-500">Product</th>
                            <th className="px-6 py-3 font-medium text-gray-500">Status</th>
                            <th className="px-6 py-3 font-medium text-gray-500">Price</th>
                            <th className="px-6 py-3 font-medium text-gray-500 text-right">Added</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {recentProducts?.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium">{product.title}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${product.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {product.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-600">₹{product.price || '-'}</td>
                                <td className="px-6 py-4 text-right text-gray-500">
                                    {new Date(product.created_at).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                        {(!recentProducts || recentProducts.length === 0) && (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                    No products found for this store.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function StatItem({ label, value, color = 'text-black' }: { label: string; value: string; color?: string }) {
    return (
        <div>
            <p className="text-xs text-gray-500">{label}</p>
            <p className={`font-semibold ${color}`}>{value}</p>
        </div>
    )
}
