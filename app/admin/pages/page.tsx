'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { getActiveStoreIdClient } from '@/lib/getActiveStore.client'
import { TableSkeleton } from '../components/AdminSkeletons'
import { Layout, ArrowRight, FileText, Settings } from 'lucide-react'
import { initialise_store_pages } from '@/lib/intelligence/homepage'

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
        const { data, error } = await supabaseBrowser
            .from('pg_store_pages')
            .select('*')
            .eq('store_id', activeStoreId)
            .order('updated_at', { ascending: false })

        if (data && data.length === 0) {
            // AUTO-FILL STANDARD PAGES via intelligence
            await initialise_store_pages(activeStoreId)
            const { data: seeded } = await supabaseBrowser
                .from('pg_store_pages')
                .select('*')
                .eq('store_id', activeStoreId)
                .order('updated_at', { ascending: false })

            setPages(seeded || [])
            if (seeded && seeded.length > 0) {
                toast.success('Standard store pages have been initialized!')
            }
        } else {
            setPages(data || [])
        }
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
                    className="bg-neutral-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-black transition-all"
                >
                    Add page
                </Link>
            </div>

            {/* HOMEPAGE DESIGNER CARD */}
            <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 rounded-2xl p-6 text-white flex items-center justify-between shadow-xl">
                <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                        <Layout className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Homepage Designer</h2>
                        <p className="text-neutral-400 text-sm mt-0.5">Customize your storefront's main page sections and content.</p>
                    </div>
                </div>
                <Link
                    href="/admin/homepage"
                    className="bg-white text-black px-6 py-2.5 rounded-xl text-sm font-black hover:bg-neutral-100 transition-all flex items-center gap-2"
                >
                    Design Homepage <ArrowRight className="w-4 h-4" />
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
                                    <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${page.is_active ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-600'}`}>
                                        {page.is_active ? 'Active' : 'Hidden'}
                                    </span>
                                    <span className="ml-2 text-[10px] border px-1.5 py-0.5 rounded-md uppercase font-black tracking-widest text-neutral-400">{page.type}</span>
                                </td>
                                <td className="px-6 py-4 text-right text-neutral-500 font-medium">
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
