'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { getActiveStoreIdClient } from '@/lib/getActiveStore.client'
import SEOBlock from '../../components/SEOBlock'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RotateCcw, Trash2, Save, ArrowLeft, Globe, Eye, FileText, Check, ShieldCheck, HelpCircle } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function PageEditor() {
    const { id } = useParams<{ id: string }>()
    const router = useRouter()
    const [storeId, setStoreId] = useState<string | null>(null)

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [slug, setSlug] = useState('')
    const [isActive, setIsActive] = useState(true)
    const [type, setType] = useState('custom')
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
            .from('pg_store_pages')
            .select('*')
            .eq('id', id)
            .single()

        if (data) {
            setTitle(data.title)
            setContent(data.content || '')
            setSlug(data.slug)
            setIsActive(data.is_active)
            setType(data.type)
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
            is_active: isActive,
            type,
            seo_title: seoTitle,
            seo_description: seoDescription,
            updated_at: new Date().toISOString()
        }

        if (isNew) {
            const { data, error } = await supabaseBrowser
                .from('pg_store_pages')
                .insert([payload])
                .select()
                .single()

            if (!error && data) {
                toast.success('Page created')
                router.push(`/admin/pages/${data.id}`)
            } else {
                toast.error(error?.message || 'Failed to create page')
            }
        } else {
            const { error } = await supabaseBrowser
                .from('pg_store_pages')
                .update(payload)
                .eq('id', id)

            if (error) {
                toast.error(error.message)
            } else {
                toast.success('Page updated')
            }
        }
        setSaving(false)
    }

    const onDelete = async () => {
        if (!confirm('Are you sure you want to delete this page?')) return
        await supabaseBrowser.from('pg_store_pages').delete().eq('id', id)
        toast.success('Page deleted')
        router.push('/admin/pages')
    }

    const onRestore = async () => {
        if (!confirm('Restore this page to its default content? Current changes will be lost.')) return;

        const { data: store } = await supabaseBrowser.from('store_config').select('mood_card').eq('store_id', storeId).single();
        const archetype = store?.mood_card?.archetype || 'generic';

        // Map slug to dummy content
        const defaults: Record<string, string> = {
            'shipping-policy': `<h1>Shipping Policy</h1><p>We offer fast and reliable shipping across India. Standard delivery takes 3-5 business days.</p>`,
            'refund-policy': `<h1>Refund Policy</h1><p>We have a 7-day no-questions-asked refund policy for all unused products.</p>`,
            'terms-and-conditions': `<h1>Terms & Conditions</h1><p>By using our store, you agree to our terms of service and usage policies.</p>`
        };

        if (defaults[slug]) {
            setContent(defaults[slug]);
            toast.success('Restored to intelligence defaults');
        } else {
            toast.error('No default content found for this page type');
        }
    }

    if (loading || !storeId) return <div className="p-8">Loading editor...</div>

    return (
        <div className="max-w-5xl mx-auto p-6 pb-24 space-y-6">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <Link href="/admin/pages" className="p-2 hover:bg-neutral-100 rounded-xl transition-all">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-2xl font-black tracking-tight uppercase italic">{isNew ? 'New Page' : 'Edit Page'}</h1>
                </div>

                <div className="flex items-center gap-4">
                    {!isNew && (
                        <>
                            <button onClick={onRestore} title="Restore to Intelligence" className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-blue-100 shadow-sm">
                                <RotateCcw className="w-5 h-5" />
                            </button>
                            <button onClick={onDelete} className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-all border border-red-100 shadow-sm">
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </>
                    )}
                    <button
                        onClick={onSave}
                        disabled={saving}
                        className="bg-neutral-900 text-white px-8 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 shadow-lg"
                    >
                        <Save className="w-4 h-4" />
                        Save Page
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* MAIN CONTENT */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white border border-[var(--border)] rounded-[2rem] p-8 space-y-6 shadow-sm">
                        <div>
                            <label className="block text-sm font-medium mb-1">Title</label>
                            <input
                                className="w-full border rounded px-3 py-2 text-sm font-medium"
                                placeholder="e.g. About Us"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
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
                    <div className="bg-white border border-[var(--border)] rounded-[2rem] p-8 shadow-sm">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-4 block">Content</Label>
                        <Textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Page content (HTML/Markdown supported)..."
                            className="min-h-[400px] font-mono text-sm bg-neutral-50/30 rounded-2xl border-neutral-100 focus:bg-white transition-all"
                        />
                    </div>

                    <div className="bg-white border rounded p-6">
                        <h2 className="font-medium mb-4">Visibility</h2>
                        <div className="space-y-3">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="isActive"
                                    checked={isActive}
                                    onChange={() => setIsActive(true)}
                                    className="accent-black"
                                />
                                <div className="text-sm">Visible</div>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="isActive"
                                    checked={!isActive}
                                    onChange={() => setIsActive(false)}
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
