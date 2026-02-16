'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { getActiveStoreIdClient } from '@/lib/getActiveStore.client'
import {
    Zap,
    Layers,
    ShoppingBag,
    Search,
    ChevronRight,
    Plus,
    ArrowUpRight,
    Package,
    CheckCircle2,
    AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

type Product = {
    id: string
    title: string
    images: string[]
    price: number
    bundle_settings: {
        enabled: boolean
        multi_purchase_enabled?: boolean
        multi_qty?: number
        multi_discount_type?: 'flat' | 'percentage'
        multi_discount_value?: number
        cross_sell_product_ids?: string[]
    }
}

export default function BundlesPage() {
    const router = useRouter()
    const [storeId, setStoreId] = useState<string | null>(null)
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        const id = getActiveStoreIdClient()
        if (!id) {
            router.replace('/admin/stores')
            return
        }
        setStoreId(id)
        loadProducts(id)
    }, [router])

    const loadProducts = async (activeStoreId: string) => {
        setLoading(true)
        const { data, error } = await supabaseBrowser
            .from('products')
            .select('id, title, images, price, bundle_settings')
            .eq('store_id', activeStoreId)
            .eq('status', 'published')
            .order('title')

        if (error) {
            console.error('Failed to load products', error)
        } else {
            setProducts(data || [])
        }
        setLoading(false)
    }

    const filtered = products.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase())
    )

    const activeBundles = products.filter(p => p.bundle_settings?.enabled).length
    const crossSellCount = products.reduce((acc, p) => acc + (p.bundle_settings?.cross_sell_product_ids?.length || 0), 0)

    if (loading) return (
        <div className="p-10 space-y-6 animate-pulse">
            <div className="h-10 w-64 bg-slate-200 rounded-2xl" />
            <div className="grid grid-cols-3 gap-6">
                {[1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-100 rounded-[2rem]" />)}
            </div>
            <div className="h-96 bg-slate-50 rounded-[2.5rem]" />
        </div>
    )

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {/* HEADER */}
            <div className="flex items-end justify-between">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-neutral-900 tracking-tighter uppercase">
                        Conversion <span className="text-blue-600">Pulse</span>
                    </h1>
                    <p className="text-neutral-500 font-medium text-sm">Manage bundles, cross-sells and AOV boosters.</p>
                </div>

                <div className="relative w-72 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-blue-600 transition-colors" />
                    <Input
                        placeholder="Search products..."
                        className="pl-11 h-12 rounded-2xl bg-white border-none shadow-sm focus:ring-2 focus:ring-blue-500"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Bundle Rules</p>
                        <h3 className="text-4xl font-black text-neutral-900 tracking-tighter">{activeBundles}</h3>
                    </div>
                    <Zap className="absolute right-6 bottom-6 w-12 h-12 text-blue-500/10 group-hover:scale-110 transition-transform" />
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Cross-sell Prompts</p>
                        <h3 className="text-4xl font-black text-neutral-900 tracking-tighter">{crossSellCount}</h3>
                    </div>
                    <Layers className="absolute right-6 bottom-6 w-12 h-12 text-orange-500/10 group-hover:scale-110 transition-transform" />
                </div>
                <div className="bg-neutral-900 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-slate-400/50 uppercase tracking-widest mb-1">Est. AOV Lift</p>
                        <h3 className="text-4xl font-black text-white tracking-tighter">+18.4%</h3>
                    </div>
                    <ArrowUpRight className="absolute right-6 bottom-6 w-12 h-12 text-white/10 group-hover:scale-110 transition-transform" />
                </div>
            </div>

            {/* PRODUCT LIST */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                    <h2 className="text-lg font-black text-neutral-900 tracking-tight">Rules Inventory</h2>
                    <Button variant="ghost" size="sm" className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                        Export Rules
                    </Button>
                </div>

                <div className="divide-y divide-slate-50">
                    {filtered.map(p => (
                        <div key={p.id} className="p-6 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200">
                                    {p.images?.[0] ? (
                                        <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center"><Package className="w-6 h-6 text-slate-300" /></div>
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-black text-neutral-900 tracking-tight leading-tight">{p.title}</h4>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">₹{p.price.toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-12">
                                {/* BUNDLE STATUS */}
                                <div className="hidden md:block">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Bundle Logic</p>
                                    {p.bundle_settings?.multi_purchase_enabled ? (
                                        <Badge className="bg-green-50 text-green-700 border-none px-3 py-1 font-black text-[10px] rounded-lg">
                                            {p.bundle_settings.multi_discount_value}{p.bundle_settings.multi_discount_type === 'percentage' ? '%' : '₹'} OFF ON {p.bundle_settings.multi_qty}x
                                        </Badge>
                                    ) : (
                                        <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">None</span>
                                    )}
                                </div>

                                {/* CROSS-SELL STATUS */}
                                <div className="hidden lg:block w-40">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Cross-selling</p>
                                    <div className="flex items-center gap-1">
                                        <span className="text-xs font-black text-neutral-900">
                                            {p.bundle_settings?.cross_sell_product_ids?.length || 0}
                                        </span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Linked Products</span>
                                    </div>
                                </div>

                                <Button
                                    onClick={() => router.push(`/admin/products/${p.id}`)}
                                    className="bg-white border text-neutral-900 hover:bg-neutral-900 hover:text-white rounded-xl font-bold text-xs h-10 px-5 group/btn"
                                >
                                    Configure
                                    <ChevronRight className="w-3.5 h-3.5 ml-2 group-hover/btn:translate-x-0.5 transition-transform" />
                                </Button>
                            </div>
                        </div>
                    ))}

                    {filtered.length === 0 && (
                        <div className="p-20 text-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-slate-100">
                                <Search className="w-8 h-8 text-slate-200" />
                            </div>
                            <h3 className="text-xl font-black text-neutral-900 tracking-tight">No products matching "{search}"</h3>
                            <p className="text-slate-400 text-sm mt-1">Try a different search term or check all products.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
