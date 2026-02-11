'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { getActiveStoreIdClient } from '@/lib/getActiveStore.client'
import SEOBlock from '../../components/SEOBlock'
import { ArrowLeft, Save, Trash2, Globe } from 'lucide-react'
import Link from 'next/link'

export default function PageEditor() {
    const { id } = useParams<{ id: string }>()
    const router = useRouter()
    const [storeId, setStoreId] = useState<string | null>(null)

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [slug, setSlug] = useState('')
    const [status, setStatus] = useState<'draft' | 'published'>('draft')
    const [seoTitle, setSeoTitle] = useState('')
    const [seoDescription, setSeoDescription] = useState('')

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const isNew = id === 'new'

    const loadPage = useCallback(async (storeId: string) => {
        if (isNew) {
            setLoading(false)
            return
        }

        setLoading(true)
        const { data, error } = await supabaseBrowser
            .from('pages')
            .select('*')
            .eq('id', id)
            .single()

        if (data) {
            setTitle(data.title)
            setContent(data.content || '')
            setSlug(data.slug)
            setStatus(data.status)
            setSeoTitle(data.seo_title || '')
            setSeoDescription(data.seo_description || '')
        }
        setLoading(false)
    }, [id, isNew])

    useEffect(() => {
        const sid = getActiveStoreIdClient()
        if (!sid) {
            router.replace('/admin/stores')
            return
        }
        setStoreId(sid)
        loadPage(sid)
    }, [loadPage, router])

    const onSave = async () => {
        if (!title || !slug) {
            alert('Title and slug are required')
            return
        }

        setSaving(true)
        const payload = {
            store_id: storeId,
            title,
            content,
            slug,
            status,
            seo_title: seoTitle,
            seo_description: seoDescription,
            updated_at: new Date().toISOString()
        }

        if (isNew) {
            const { data, error } = await supabaseBrowser
                .from('pages')
                .insert([payload])
                .select()
                .single()

            if (!error && data) {
                router.push(`/admin/pages/${data.id}`)
            } else {
                alert(error?.message || 'Failed to create page')
            }
        } else {
            const { error } = await supabaseBrowser
                .from('pages')
                .update(payload)
                .eq('id', id)

            if (error) alert(error.message)
        }
        setSaving(false)
    }

    const onDelete = async () => {
        if (!confirm('Are you sure you want to delete this page?')) return
        await supabaseBrowser.from('pages').delete().eq('id', id)
        router.push('/admin/pages')
    }

    if (loading || !storeId) return <div className="p-8">Loading editor...</div>

    return (
        <div className="max-w-5xl mx-auto p-6 pb-24 space-y-6">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/pages" className="p-2 hover:bg-gray-100 rounded">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-2xl font-semibold">{isNew ? 'Add page' : title}</h1>
                </div>
                <div className="flex gap-3">
                    {!isNew && (
                        <button onClick={onDelete} className="p-2 text-red-600 hover:bg-red-50 rounded">
                            <Trash2 className="w-5 h-5" />
                        </button>
                    )}
                    <button
                        onClick={onSave}
                        disabled={saving}
                        className="bg-black text-white px-6 py-2 rounded text-sm font-medium flex items-center gap-2"
                    >
                        {saving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* MAIN CONTENT */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border rounded p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Title</label>
                            <input
                                className="w-full border rounded px-3 py-2 text-sm font-medium"
                                placeholder="e.g. About Us"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Content</label>
                            <textarea
                                className="w-full border rounded px-3 py-2 text-sm h-64 font-mono"
                                placeholder="Write your page content here (HTML supported)..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                            <p className="text-[10px] text-gray-400 mt-1 italic">Basic HTML editor coming soon. Using raw textarea for now.</p>
                        </div>
                    </div>

                    <SEOBlock
                        title={seoTitle || title}
                        description={seoDescription}
                        slug={slug}
                        baseUrl="yourstore.com/pages"
                        onChange={(data) => {
                            setSeoTitle(data.title)
                            setSeoDescription(data.description)
                            setSlug(data.slug)
                        }}
                    />
                </div>

                {/* SIDEBAR */}
                <div className="space-y-6">
                    <div className="bg-white border rounded p-6">
                        <h2 className="font-medium mb-4">Visibility</h2>
                        <div className="space-y-3">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="status"
                                    checked={status === 'published'}
                                    onChange={() => setStatus('published')}
                                    className="accent-black"
                                />
                                <div className="text-sm">Visible</div>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="status"
                                    checked={status === 'draft'}
                                    onChange={() => setStatus('draft')}
                                    className="accent-black"
                                />
                                <div className="text-sm">Hidden</div>
                            </label>
                        </div>
                    </div>

                    <div className="bg-white border rounded p-6">
                        <h2 className="font-medium mb-4">Online store</h2>
                        <div className="text-sm text-gray-500 mb-2">Theme template</div>
                        <select className="w-full border rounded px-3 py-2 text-sm bg-gray-50" disabled>
                            <option>Default page</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    )
}
