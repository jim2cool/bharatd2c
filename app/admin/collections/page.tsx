'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { getActiveStoreIdClient } from '@/lib/getActiveStore.client'
import { TableSkeleton } from '../components/AdminSkeletons'
import Image from 'next/image'

export default function CollectionsListPage() {
    const router = useRouter()
    const [storeId, setStoreId] = useState<string | null>(null)
    const [collections, setCollections] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const id = getActiveStoreIdClient()
        if (!id) {
            router.replace('/admin/stores')
            return
        }
        setStoreId(id)
        loadCollections(id)
    }, [router])

    const loadCollections = async (activeStoreId: string) => {
        setLoading(true)
        const { data } = await supabaseBrowser
            .from('collections')
            .select('*')
            .eq('store_id', activeStoreId)
            .order('created_at', { ascending: false })

        setCollections(data || [])
        setLoading(false)
    }

    if (loading || !storeId) {
        return (
            <div className="p-6 space-y-4">
                <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6" />
                <TableSkeleton rows={5} cols={4} />
            </div>
        )
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Collections</h1>
                <Link
                    href="/admin/collections/new"
                    className="bg-black text-white px-4 py-2 rounded text-sm font-medium"
                >
                    Create collection
                </Link>
            </div>

            <div className="bg-white border rounded overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="w-16 px-6 py-3"></th>
                            <th className="text-left px-6 py-3">Title</th>
                            <th className="text-left px-6 py-3">Type</th>
                            <th className="text-right px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {collections.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                    No collections found. Group your products together for better store organization.
                                </td>
                            </tr>
                        )}
                        {collections.map((col) => (
                            <tr key={col.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="w-10 h-10 bg-gray-100 rounded border relative overflow-hidden">
                                        {col.image ? (
                                            <Image src={col.image} alt={col.title} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <Link href={`/admin/collections/${col.id}`} className="font-medium text-blue-600 hover:underline">
                                        {col.title}
                                    </Link>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded capitalize">
                                        {col.collection_type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Link href={`/admin/collections/${col.id}`} className="text-gray-400 hover:text-black">
                                        Edit
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
