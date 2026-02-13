'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { getActiveStoreIdClient } from '@/lib/getActiveStore.client'
import SEOBlock from '../../components/SEOBlock'
import { ArrowLeft, Save, Trash2, Globe, Plus, X, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { getStoreBaseUrl } from '@/lib/getStoreUrl'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'

const collectionSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional().nullable(),
    slug: z.string().min(1, 'Slug is required'),
    image: z.string().optional().nullable(),
    collection_type: z.enum(['manual', 'automated']),
    source_type: z.enum(['manual', 'latest', 'best_selling']).optional().nullable(),
    is_featured: z.boolean(),
    seo_title: z.string().optional().nullable(),
    seo_description: z.string().optional().nullable(),
})

type CollectionFormData = z.infer<typeof collectionSchema>

export default function CollectionEditor() {
    const { id } = useParams<{ id: string }>()
    const router = useRouter()
    const [storeId, setStoreId] = useState<string | null>(null)
    const [storeUrl, setStoreUrl] = useState<string>('')

    useEffect(() => {
        getStoreBaseUrl(supabaseBrowser).then(url => setStoreUrl(url))
    }, [])

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [products, setProducts] = useState<any[]>([])
    const [availableProducts, setAvailableProducts] = useState<any[]>([])
    const [showAddProduct, setShowAddProduct] = useState(false)

    const isNew = id === 'new'

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors, isDirty },
    } = useForm<CollectionFormData>({
        resolver: zodResolver(collectionSchema),
        defaultValues: {
            title: '',
            description: '',
            slug: '',
            image: '',
            collection_type: 'manual',
            source_type: 'manual',
            is_featured: false,
            seo_title: '',
            seo_description: '',
        }
    })

    const collectionType = watch('collection_type')
    const sourceType = watch('source_type')
    const isFeatured = watch('is_featured')
    const image = watch('image')
    const title = watch('title')
    const seoTitle = watch('seo_title')
    const seoDescription = watch('seo_description')
    const slug = watch('slug')

    const loadCollection = useCallback(async (sid: string) => {
        if (isNew) {
            setLoading(false)
            loadAvailableProducts(sid)
            return
        }

        setLoading(true)
        const { data: col } = await supabaseBrowser
            .from('collections')
            .select('*')
            .eq('id', id)
            .single()

        if (col) {
            reset({
                title: col.title,
                description: col.description || '',
                slug: col.slug,
                image: col.image || '',
                collection_type: col.collection_type || 'manual',
                source_type: col.source_type || 'manual',
                is_featured: col.is_featured || false,
                seo_title: col.seo_title || '',
                seo_description: col.seo_description || '',
            })

            const { data: colProducts } = await supabaseBrowser
                .from('collection_products')
                .select('*, products(*)')
                .eq('collection_id', id)
                .order('position', { ascending: true })

            setProducts(colProducts?.map(cp => cp.products) || [])
        }

        await loadAvailableProducts(sid)
        setLoading(false)
    }, [id, isNew, reset])

    const loadAvailableProducts = async (sid: string) => {
        const { data } = await supabaseBrowser
            .from('products')
            .select('id, title, images')
            .eq('store_id', sid)
        setAvailableProducts(data || [])
    }

    useEffect(() => {
        const sid = getActiveStoreIdClient()
        if (!sid) {
            router.replace('/admin/stores')
            return
        }
        setStoreId(sid)
        loadCollection(sid)
    }, [loadCollection, router])

    const onSave = async (data: CollectionFormData) => {
        setSaving(true)
        const payload = {
            ...data,
            store_id: storeId,
            updated_at: new Date().toISOString()
        }

        let finalId = id
        if (isNew) {
            const { data: newCol, error } = await supabaseBrowser
                .from('collections')
                .insert([payload])
                .select()
                .single()

            if (!error && newCol) {
                finalId = newCol.id
                toast.success('Collection created')
                router.push(`/admin/collections/${newCol.id}`)
            } else {
                toast.error(error?.message || 'Failed to create collection')
                setSaving(false)
                return
            }
        } else {
            const { error } = await supabaseBrowser
                .from('collections')
                .update(payload)
                .eq('id', id)

            if (error) {
                toast.error(error.message)
            } else {
                toast.success('Collection updated')
            }
        }

        // Update Products (Manual)
        if (data.collection_type === 'manual') {
            await supabaseBrowser.from('collection_products').delete().eq('collection_id', finalId)
            if (products.length > 0) {
                await supabaseBrowser.from('collection_products').insert(
                    products.map((p, idx) => ({
                        collection_id: finalId,
                        product_id: p.id,
                        position: idx
                    }))
                )
            }
        }

        setSaving(false)
    }

    const addProduct = (p: any) => {
        if (products.find(x => x.id === p.id)) return
        setProducts([...products, p])
        setShowAddProduct(false)
    }

    const removeProduct = (pid: string) => {
        setProducts(products.filter(p => p.id !== pid))
    }

    if (loading || !storeId) return <div className="p-8 text-center bg-white min-h-[400px] flex items-center justify-center">Loading editor...</div>

    return (
        <form onSubmit={handleSubmit(onSave)} className="max-w-6xl mx-auto px-8 pt-10 pb-32 space-y-14">
            {/* NAVIGATION / BREADCRUMBS */}
            <div className="flex items-center justify-between mb-2">
                <Link
                    href="/admin/collections"
                    className="flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-neutral-900 transition-colors group"
                >
                    <div className="p-1.5 rounded-lg bg-neutral-50 group-hover:bg-neutral-100 transition-colors">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                    </div>
                    Back to Collections
                </Link>

                {!isNew && (
                    <a
                        href={storeUrl ? `${storeUrl}/collections/${slug}` : '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs font-black text-blue-600 hover:text-blue-700 transition-colors px-4 py-2 bg-blue-50 rounded-xl"
                    >
                        <Globe className="w-3.5 h-3.5" />
                        Preview on Store
                    </a>
                )}
            </div>

            {/* HEADER */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-black text-neutral-900 tracking-tight flex items-center gap-3">
                        {isNew ? 'New Collection' : 'Edit Collection'}
                        {!isNew && (
                            <>
                                <span className="text-neutral-300 font-medium">/</span>
                                <span className="text-neutral-400 font-medium text-xl truncate max-w-[300px]">{title}</span>
                            </>
                        )}
                    </h1>
                    <p className="text-sm text-neutral-500 font-medium mt-1">
                        {isNew ? 'Create a new collection to group your products.' : 'Update collection information and products.'}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="submit"
                        disabled={saving}
                        className={`px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${saving || !isDirty
                            ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                            : 'bg-neutral-900 text-white hover:bg-neutral-800 shadow-lg shadow-neutral-100'
                            }`}
                    >
                        {saving ? 'Saving...' : 'Save changes'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Title</label>
                            <input
                                {...register('title')}
                                placeholder="e.g. Summer Essentials"
                                className={`w-full border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-black outline-none transition-all ${errors.title ? 'border-red-500 bg-red-50' : 'border-neutral-200 focus:border-black'}`}
                            />
                            {errors.title && <p className="mt-1 text-xs text-red-600 font-medium">{errors.title.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Description</label>
                            <textarea
                                {...register('description')}
                                placeholder="Describe this collection for your customers..."
                                className="w-full border border-neutral-200 rounded-lg px-4 py-2 text-sm h-32 focus:ring-2 focus:ring-black outline-none transition-all focus:border-black"
                            />
                        </div>
                    </div>

                    <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm space-y-4">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="font-semibold text-neutral-800">Products</h2>
                            <button
                                type="button"
                                onClick={() => setShowAddProduct(true)}
                                className="text-sm text-black font-semibold flex items-center gap-1.5 bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                <Plus className="w-4 h-4" /> Add product
                            </button>
                        </div>

                        <div className="divide-y divide-neutral-100 border border-neutral-100 rounded-lg overflow-hidden">
                            {products.length === 0 && (
                                <div className="py-12 text-center text-neutral-400 text-sm bg-neutral-50/30">
                                    No products added yet. Start by adding one above.
                                </div>
                            )}
                            {products.map((p) => (
                                <div key={p.id} className="p-3 flex items-center justify-between hover:bg-neutral-50 group transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-neutral-100 rounded-lg border border-neutral-200 relative overflow-hidden flex-shrink-0">
                                            {p.images?.[0] && <Image src={p.images[0]} alt={p.title} fill className="object-cover" />}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-neutral-800">{p.title}</div>
                                            <div className="text-xs text-neutral-500">₹{p.price || '0'}</div>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeProduct(p.id)}
                                        className="text-neutral-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <SEOBlock
                        title={seoTitle || title || ''}
                        description={seoDescription || ''}
                        slug={slug || ''}
                        baseUrl="yourstore.com/collections"
                        onChange={(data) => {
                            setValue('seo_title', data.title, { shouldDirty: true })
                            setValue('seo_description', data.description, { shouldDirty: true })
                            setValue('slug', data.slug, { shouldDirty: true })
                        }}
                    />
                </div>

                <div className="space-y-6">
                    <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm bg-neutral-50/50">
                        <h2 className="font-semibold text-neutral-800 mb-4">Collection type</h2>
                        <div className="space-y-4">
                            <label className="flex items-start gap-3 cursor-pointer p-2 rounded-lg hover:bg-white transition-colors">
                                <input
                                    type="radio"
                                    value="manual"
                                    {...register('collection_type')}
                                    className="mt-1 accent-black w-4 h-4"
                                />
                                <div className="flex-1">
                                    <div className="text-sm font-bold text-neutral-800">Manual</div>
                                    <div className="text-xs text-neutral-500">Add products to this collection one by one.</div>
                                </div>
                            </label>
                            <label className="flex items-start gap-3 cursor-pointer p-2 rounded-lg hover:bg-white transition-colors">
                                <input
                                    type="radio"
                                    value="automated"
                                    {...register('collection_type')}
                                    className="mt-1 accent-black w-4 h-4"
                                />
                                <div className="flex-1">
                                    <div className="text-sm font-bold text-neutral-800">Automated</div>
                                    <div className="text-xs text-neutral-500">Existing and future products that match valid conditions will be added.</div>
                                </div>
                            </label>

                            {collectionType === 'automated' && (
                                <div className="pl-7 space-y-3 pt-4 border-t border-neutral-200/50">
                                    <label className="flex items-center gap-3 cursor-pointer text-sm font-medium text-neutral-700">
                                        <input
                                            type="radio"
                                            value="latest"
                                            {...register('source_type')}
                                            className="accent-black w-3.5 h-3.5"
                                        />
                                        <span>Latest products</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer text-sm font-medium text-neutral-700">
                                        <input
                                            type="radio"
                                            value="best_selling"
                                            {...register('source_type')}
                                            className="accent-black w-3.5 h-3.5"
                                        />
                                        <span>Best selling (by rating)</span>
                                    </label>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
                        <h2 className="font-semibold text-neutral-800 mb-4">Storefront display</h2>
                        <label className="flex items-start gap-4 cursor-pointer p-2 rounded-lg hover:bg-neutral-50 transition-colors">
                            <input
                                type="checkbox"
                                {...register('is_featured')}
                                className="mt-1 h-4 w-4 rounded border-neutral-300 accent-black"
                            />
                            <div className="flex-1">
                                <div className="text-sm font-bold text-neutral-800">Feature this collection</div>
                                <div className="text-[11px] text-neutral-500 leading-relaxed mt-0.5">Enabled collection will replace the current featured collection on the homepage.</div>
                            </div>
                        </label>
                    </div>

                    <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
                        <h2 className="font-semibold text-neutral-800 mb-4">Collection image</h2>
                        {image ? (
                            <div className="relative aspect-video rounded-lg border border-neutral-200 overflow-hidden group">
                                <Image src={image} alt="Collection" fill className="object-cover transition-transform group-hover:scale-105" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        type="button"
                                        onClick={() => setValue('image', '', { shouldDirty: true })}
                                        className="bg-white text-black p-2 rounded-full shadow-lg"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="aspect-video bg-neutral-50 border-2 border-dashed border-neutral-200 rounded-xl flex flex-col items-center justify-center p-6 text-center hover:bg-neutral-100 transition-colors cursor-pointer group">
                                <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-white transition-colors">
                                    <ImageIcon className="w-5 h-5 text-neutral-400" />
                                </div>
                                <button type="button" className="text-sm text-black font-bold">Add image</button>
                                <p className="text-[10px] text-neutral-500 mt-1">Recommended size 1200x600px</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* PRODUCT PICKER MODAL */}
            {showAddProduct && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl flex flex-col max-h-[85vh] overflow-hidden border border-neutral-200">
                        <div className="p-5 border-b flex justify-between items-center bg-neutral-50">
                            <h3 className="font-bold text-lg">Add products</h3>
                            <button type="button" onClick={() => setShowAddProduct(false)} className="hover:bg-neutral-200 p-2 rounded-full transition-colors"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-3 space-y-1">
                            {availableProducts.length === 0 && <div className="p-8 text-center text-neutral-400">No products available.</div>}
                            {availableProducts.map(p => (
                                <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => addProduct(p)}
                                    className="w-full text-left p-3 hover:bg-neutral-50 rounded-xl flex items-center gap-4 group transition-all"
                                >
                                    <div className="w-12 h-12 bg-neutral-100 rounded-lg border border-neutral-200 relative overflow-hidden flex-shrink-0 shadow-sm">
                                        {p.images?.[0] && <Image src={p.images[0]} alt={p.title} fill className="object-cover" />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-bold text-neutral-800">{p.title}</div>
                                        <div className="text-xs text-neutral-400">Add to collection</div>
                                    </div>
                                    <Plus className="w-4 h-4 text-neutral-300 group-hover:text-black transition-colors" />
                                </button>
                            ))}
                        </div>
                        <div className="p-4 bg-neutral-50 border-t flex justify-end">
                            <button type="button" onClick={() => setShowAddProduct(false)} className="px-4 py-2 text-sm font-bold hover:bg-neutral-200 rounded-lg transition-colors">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </form>
    )
}
