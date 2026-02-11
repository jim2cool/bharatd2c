import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default async function StoresList() {
    const { data: stores } = await supabase.from('stores')
        .select(`
        *,
        owner:owner_id(email)
    `)
        .order('created_at', { ascending: false })

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-black">All Stores</h1>
                <Link href="/onboarding" className="px-4 py-2 bg-black text-white rounded text-sm font-medium">
                    + New Store
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 font-medium text-gray-500">Store Name</th>
                            <th className="px-6 py-3 font-medium text-gray-500">Domain</th>
                            <th className="px-6 py-3 font-medium text-gray-500">Plan</th>
                            <th className="px-6 py-3 font-medium text-gray-500">Owner</th>
                            <th className="px-6 py-3 font-medium text-gray-500">Status</th>
                            <th className="px-6 py-3 font-medium text-gray-500 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y text-gray-900">
                        {stores?.map((store: any) => (
                            <tr key={store.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium">{store.name}</td>
                                <td className="px-6 py-4 text-gray-600">{store.slug}.platform.com</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700 capitalize">
                                        {store.subscription_plan || 'free'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-600">{store.owner?.email || '-'}</td>
                                <td className="px-6 py-4">
                                    {store.is_active ? (
                                        <span className="text-green-600 font-medium">Active</span>
                                    ) : (
                                        <span className="text-red-500 font-medium">Inactive</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Link href={`/super-admin/stores/${store.id}`} className="text-blue-600 hover:underline">
                                        Manage
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {(!stores || stores.length === 0) && (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                    No stores found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
