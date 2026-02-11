'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { getActiveStoreIdClient } from '@/lib/getActiveStore.client'
import { TableSkeleton } from '../components/AdminSkeletons'

export default function PagesListPage() {
    const router = useRouter()
    const [storeId, setStoreId] = useState<string | null>(null)
    const [pages, setPages] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const id = getActiveStoreIdClient()
        if (!id) {
            router.replace('/admin/stores')
            return
        }
        setStoreId(id)
        loadPages(id)
    }, [router])

    const loadPages = async (activeStoreId: string) => {
        setLoading(true)
        const { data } = await supabaseBrowser
            .from('pages')
            .select('*')
            .eq('store_id', activeStoreId)
            .order('updated_at', { ascending: false })

        setPages(data || [])
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
                <h1 className="text-2xl font-semibold">Pages</h1>
                <Link
                    href="/admin/pages/new"
                    className="bg-black text-white px-4 py-2 rounded text-sm font-medium"
                >
                    Add page
                </Link>
            </div>

            <div className="bg-white border rounded overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="text-left px-6 py-3">Title</th>
                            <th className="text-left px-6 py-3">Status</th>
                            <th className="text-right px-6 py-3">Last modified</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {pages.length === 0 && (
                            <tr>
                                <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                                    No pages found. Create your first page to get started.
                                </td>
                            </tr>
                        )}
                        {pages.map((page) => (
                            <tr key={page.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <Link href={`/admin/pages/${page.id}`} className="font-medium text-blue-600 hover:underline">
                                        {page.title}
                                    </Link>
                                    <div className="text-xs text-gray-400">/{page.slug}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${page.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {page.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right text-gray-500">
                                    {new Date(page.updated_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
