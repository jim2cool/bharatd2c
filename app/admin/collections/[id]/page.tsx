'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { getActiveStoreIdClient } from '@/lib/getActiveStore.client'
import SEOBlock from '../../components/SEOBlock'
import { ArrowLeft, Save, Trash2, Globe, Plus, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function CollectionEditor() {
    const { id } = useParams<{ id: string }>()
    const router = useRouter()
    const [storeId, setStoreId] = useState<string | null>(null)

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [slug, setSlug] = useState('')
    const [image, setImage] = useState('')
    const [collectionType, setCollectionType] = useState<'manual' | 'automated'>('manual')
    const [seoTitle, setSeoTitle] = useState('')
    const [seoDescription, setSeoDescription] = useState('')

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [products, setProducts] = useState<any[]>([])
    const [availableProducts, setAvailableProducts] = useState<any[]>([])
    const [showAddProduct, setShowAddProduct] = useState(false)

    const isNew = id === 'new'

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
            setTitle(col.title)
            setDescription(col.description || '')
            setSlug(col.slug)
            setImage(col.image || '')
            setCollectionType(col.collection_type)
            setSeoTitle(col.seo_title || '')
            setSeoDescription(col.seo_description || '')

            const { data: colProducts } = await supabaseBrowser
                .from('collection_products')
                .select('*, products(*)')
                .eq('collection_id', id)
                .order('position', { ascending: true })

            setProducts(colProducts?.map(cp => cp.products) || [])
        }

        await loadAvailableProducts(sid)
        setLoading(false)
    }, [id, isNew])

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

    const onSave = async () => {
        if (!title || !slug) {
            alert('Title and slug are required')
            return
        }

        setSaving(true)
        const payload = {
            store_id: storeId,
            title,
            description,
            slug,
            image,
            collection_type: collectionType,
            seo_title: seoTitle,
            seo_description: seoDescription,
            updated_at: new Date().toISOString()
        }

        let finalId = id
        if (isNew) {
            const { data, error } = await supabaseBrowser
                .from('collections')
                .insert([payload])
                .select()
                .single()

            if (!error && data) {
                finalId = data.id
                router.push(`/admin/collections/${data.id}`)
            } else {
                alert(error?.message || 'Failed to create collection')
                setSaving(false)
                return
            }
        } else {
            const { error } = await supabaseBrowser
                .from('collections')
                .update(payload)
                .eq('id', id)

            if (error) alert(error.message)
        }

        // Update Products (Manual)
        if (collectionType === 'manual') {
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

    if (loading || !storeId) return <div className="p-8">Loading editor...</div>

    return (
        <div className="max-w-5xl mx-auto p-6 pb-24 space-y-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/collections" className="p-2 hover:bg-gray-100 rounded">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-2xl font-semibold">{isNew ? 'Create collection' : title}</h1>
                </div>
                <button
                    onClick={onSave}
                    disabled={saving}
                    className="bg-black text-white px-6 py-2 rounded text-sm font-medium flex items-center gap-2"
                >
                    {saving ? 'Saving...' : 'Save'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border rounded p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Title</label>
                            <input
                                className="w-full border rounded px-3 py-2 text-sm"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea
                                className="w-full border rounded px-3 py-2 text-sm h-32"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="bg-white border rounded p-6 space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-medium">Products</h2>
                            <button
                                onClick={() => setShowAddProduct(true)}
                                className="text-sm text-blue-600 font-medium flex items-center gap-1 hover:underline"
                            >
                                <Plus className="w-4 h-4" /> Add product
                            </button>
                        </div>

                        <div className="divide-y">
                            {products.length === 0 && (
                                <div className="py-8 text-center text-gray-400 text-sm italic">
                                    No products added yet.
                                </div>
                            )}
                            {products.map((p) => (
                                <div key={p.id} className="py-3 flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-50 rounded border relative overflow-hidden">
                                            {p.images?.[0] && <Image src={p.images[0]} alt={p.title} fill className="object-cover" />}
                                        </div>
                                        <div className="text-sm font-medium">{p.title}</div>
                                    </div>
                                    <button onClick={() => removeProduct(p.id)} className="text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 px-2">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <SEOBlock
                        title={seoTitle || title}
                        description={seoDescription}
                        slug={slug}
                        baseUrl="yourstore.com/collections"
                        onChange={(data) => {
                            setSeoTitle(data.title)
                            setSeoDescription(data.description)
                            setSlug(data.slug)
                        }}
                    />
                </div>

                <div className="space-y-6">
                    <div className="bg-white border rounded p-6">
                        <h2 className="font-medium mb-4">Collection type</h2>
                        <div className="space-y-4">
                            <label className="flex items-start gap-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="type"
                                    checked={collectionType === 'manual'}
                                    onChange={() => setCollectionType('manual')}
                                    className="mt-1 accent-black"
                                />
                                <div>
                                    <div className="text-sm font-medium">Manual</div>
                                    <div className="text-xs text-gray-500">Add products to this collection one by one.</div>
                                </div>
                            </label>
                            <label className="flex items-start gap-3 cursor-not-allowed opacity-50">
                                <input
                                    type="radio"
                                    name="type"
                                    disabled
                                    className="mt-1 accent-black"
                                />
                                <div>
                                    <div className="text-sm font-medium">Automated</div>
                                    <div className="text-xs text-gray-500">Existing and future products that match the conditions you set will be automatically added.</div>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className="bg-white border rounded p-6">
                        <h2 className="font-medium mb-4">Collection image</h2>
                        {image ? (
                            <div className="relative aspect-video rounded border overflow-hidden group">
                                <Image src={image} alt="Col" fill className="object-cover" />
                                <button onClick={() => setImage('')} className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="aspect-video bg-gray-50 border-2 border-dashed rounded flex flex-col items-center justify-center p-4">
                                <ImageIcon className="w-8 h-8 text-gray-300 mb-2" />
                                <button className="text-xs text-blue-600 font-medium">Add image</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* PRODUCT PICKER MODAL */}
            {showAddProduct && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg flex flex-col max-h-[80vh]">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h3 className="font-semibold">Add products</h3>
                            <button onClick={() => setShowAddProduct(false)}><X className="w-5 h-5" /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2">
                            {availableProducts.map(p => (
                                <button
                                    key={p.id}
                                    onClick={() => addProduct(p)}
                                    className="w-full text-left p-3 hover:bg-gray-50 rounded flex items-center gap-3"
                                >
                                    <div className="w-10 h-10 bg-gray-100 rounded border relative overflow-hidden flex-shrink-0">
                                        {p.images?.[0] && <Image src={p.images[0]} alt={p.title} fill className="object-cover" />}
                                    </div>
                                    <div className="text-sm font-medium">{p.title}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function ImageIcon({ className }: any) {
    return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
}
