import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import ImpersonateButton from './components/ImpersonateButton'
import SeedStoreButton from './components/SeedStoreButton'

export default async function StoresList() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: stores } = await supabase.from('stores')
        .select(`
        *,
        owner:owner_id(id, email)
    `)
        .order('created_at', { ascending: false })

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-black font-black tracking-tight">Platform Stores</h1>
                <Link href="/onboarding" className="px-4 py-2 bg-black text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all">
                    + New Store
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-neutral-50/50 border-b border-neutral-100">
                        <tr>
                            <th className="px-6 py-4 font-bold text-neutral-400 uppercase tracking-widest text-[10px]">Store Profile</th>
                            <th className="px-6 py-4 font-bold text-neutral-400 uppercase tracking-widest text-[10px]">Access URL</th>
                            <th className="px-6 py-4 font-bold text-neutral-400 uppercase tracking-widest text-[10px]">Tier</th>
                            <th className="px-6 py-4 font-bold text-neutral-400 uppercase tracking-widest text-[10px]">Ownership</th>
                            <th className="px-6 py-4 font-bold text-neutral-400 uppercase tracking-widest text-[10px]">Status</th>
                            <th className="px-6 py-4 font-bold text-neutral-400 uppercase tracking-widest text-[10px] text-right">Operations</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-50 text-gray-900">
                        {stores?.map((store: any) => (
                            <tr key={store.id} className="hover:bg-neutral-50/30 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-neutral-900">{store.name}</div>
                                    <div className="text-[10px] text-neutral-400 font-medium">ID: {store.id.split('-')[0]}...</div>
                                </td>
                                <td className="px-6 py-4">
                                    <code className="text-[11px] bg-neutral-100 px-2 py-0.5 rounded-md font-bold text-neutral-600">
                                        {store.slug}.platform.com
                                    </code>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-50 text-blue-700 uppercase tracking-tighter">
                                        {store.subscription_plan || 'free'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-neutral-500 font-medium">{store.owner?.email || '-'}</td>
                                <td className="px-6 py-4">
                                    {store.is_active ? (
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                            <span className="text-green-600 font-bold text-xs">Live</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                                            <span className="text-red-400 font-bold text-xs">Inactive</span>
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <SeedStoreButton storeId={store.id} />
                                        <ImpersonateButton
                                            userId={store.owner_id}
                                            storeSlug={store.slug}
                                        />
                                        <Link
                                            href={`/super-admin/stores/${store.id}`}
                                            className="text-xs font-bold text-blue-600 hover:text-blue-800 underline decoration-2 underline-offset-4"
                                        >
                                            Details
                                        </Link>
                                    </div>
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
