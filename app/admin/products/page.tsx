'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { getActiveStoreIdClient } from '@/lib/getActiveStore.client'
import { ProductListSkeleton } from '../components/AdminSkeletons'
import {
  Plus,
  Search,
  X,
  ChevronDown,
  ShoppingBag,
  ExternalLink,
  Edit,
  MoreHorizontal,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

type Product = {
  id: string
  title: string
  price: number
  cogs: number
  status: 'published' | 'draft'
  qty?: number | null
  location?: string | null
}

const PAGE_SIZE = 10

export default function ProductsPage() {
  const router = useRouter()

  const [storeId, setStoreId] = useState<string | null>(null)

  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] =
    useState<'all' | 'published' | 'draft'>('all')
  const [locationFilter, setLocationFilter] = useState<'all' | string>('all')
  const [page, setPage] = useState(1)

  /* ----------------------------------------
     STORE CONTEXT GUARD (CLIENT SAFE)
  ---------------------------------------- */
  useEffect(() => {
    const id = getActiveStoreIdClient()
    if (!id) {
      router.replace('/admin/stores')
      return
    }
    setStoreId(id)
  }, [router])

  /* ----------------------------------------
     LOAD PRODUCTS (STORE SCOPED)
  ---------------------------------------- */
  const loadProducts = async (activeStoreId: string) => {
    setLoading(true)

    const { data, error } = await supabaseBrowser
      .from('products')
      .select('*')
      .eq('store_id', activeStoreId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to load products', error)
      setLoading(false)
      return
    }

    setAllProducts(data || [])
    setLoading(false)
  }

  useEffect(() => {
    if (!storeId) return
    loadProducts(storeId)
  }, [storeId])

  /* ----------------------------------------
     FILTERS + PAGINATION (UNCHANGED)
  ---------------------------------------- */
  useEffect(() => {
    let filtered = [...allProducts]

    if (search) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.status === statusFilter)
    }

    if (locationFilter !== 'all') {
      filtered = filtered.filter(p => p.location === locationFilter)
    }

    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE

    setProducts(filtered.slice(from, to))
    setSelected([])
  }, [allProducts, search, statusFilter, locationFilter, page])

  /* ----------------------------------------
     BULK ACTIONS (UNCHANGED, SAFE)
  ---------------------------------------- */
  const toggleSelect = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selected.length === products.length) {
      setSelected([])
    } else {
      setSelected(products.map(p => p.id))
    }
  }

  const bulkUpdateStatus = async (status: 'published' | 'draft') => {
    if (!selected.length || !storeId) return

    await supabaseBrowser
      .from('products')
      .update({ status })
      .in('id', selected)
      .eq('store_id', storeId)

    loadProducts(storeId)
  }

  const totalPages = Math.ceil(allProducts.length / PAGE_SIZE)

  /* ----------------------------------------
     GUARD RENDER
  ---------------------------------------- */
  if (!storeId || loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6" />
        <ProductListSkeleton />
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8 bg-[#fafafa] min-h-screen">
      {/* HEADER */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-black text-neutral-900 tracking-tight">
            Inventory <span className="text-neutral-400 ml-1">({allProducts.length})</span>
          </h1>
          <p className="text-neutral-500 text-sm font-medium mt-1">Manage your catalog and stock levels.</p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/admin/products/generate"
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-100 ring-4 ring-white hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group"
          >
            <Sparkles className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
            Generate with AI
          </Link>
          <Link
            href="/admin/products/import"
            className="px-6 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs font-bold hover:bg-neutral-50 shadow-sm transition-all"
          >
            Bulk Import
          </Link>
          <Link
            href="/admin/products/new"
            className="px-6 py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 shadow-md transition-all flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Product
          </Link>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-5 rounded-[2rem] border border-neutral-100 shadow-sm">
        <div className="relative flex-1 max-w-xl w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-neutral-400" />
          <input
            value={search}
            onChange={e => {
              setPage(1)
              setSearch(e.target.value)
            }}
            placeholder="Search by title, SKU or category..."
            className="w-full pl-12 pr-4 py-3 bg-neutral-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-neutral-400"
          />
        </div>

        <select
          value={statusFilter}
          onChange={e => {
            setPage(1)
            setStatusFilter(e.target.value as any)
          }}
          className="px-4 py-2 bg-neutral-50 border-none rounded-xl text-sm font-medium cursor-pointer"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>

        <select
          value={locationFilter}
          onChange={e => {
            setPage(1)
            setLocationFilter(e.target.value)
          }}
          className="px-4 py-2 bg-neutral-50 border-none rounded-xl text-sm font-medium cursor-pointer"
        >
          <option value="all">All Locations</option>
          <option value="Gurgaon">Gurgaon</option>
          <option value="Bangalore">Bangalore</option>
        </select>

        {selected.length > 0 && (
          <div className="h-8 w-[1px] bg-neutral-200 mx-2" />
        )}

        {selected.length > 0 && (
          <div className="flex gap-2 items-center">
            <button
              onClick={() => bulkUpdateStatus('published')}
              className="px-4 py-2 bg-green-50 text-green-700 rounded-xl text-xs font-bold hover:bg-green-100 transition-all"
            >
              Publish Selection
            </button>
            <button
              onClick={() => bulkUpdateStatus('draft')}
              className="px-4 py-2 bg-neutral-50 text-neutral-600 rounded-xl text-xs font-bold hover:bg-neutral-100 transition-all"
            >
              Move to Draft
            </button>
          </div>
        )}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[2.5rem] border border-neutral-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-50">
                <th className="p-6 w-8 text-center">
                  <input
                    type="checkbox"
                    className="rounded border-neutral-300 focus:ring-neutral-900"
                    checked={
                      products.length > 0 &&
                      selected.length === products.length
                    }
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="p-6 text-left font-bold text-neutral-400 uppercase tracking-widest text-[10px]">Product / Catalog</th>
                <th className="p-6 text-right font-bold text-neutral-400 uppercase tracking-widest text-[10px]">Price</th>
                <th className="p-6 text-right font-bold text-neutral-400 uppercase tracking-widest text-[10px]">Margins</th>
                <th className="p-6 text-right font-bold text-neutral-400 uppercase tracking-widest text-[10px]">Inventory</th>
                <th className="p-6 text-left font-bold text-neutral-400 uppercase tracking-widest text-[10px]">Location</th>
                <th className="p-6 text-center font-bold text-neutral-400 uppercase tracking-widest text-[10px]">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-50">
              {products.map(p => {
                const margin =
                  p.price > 0
                    ? Math.round(((p.price - p.cogs) / p.price) * 100)
                    : 0

                return (
                  <tr key={p.id} className="group hover:bg-neutral-50 transition-colors">
                    <td className="p-6 text-center">
                      <input
                        type="checkbox"
                        className="rounded border-neutral-300 focus:ring-neutral-900"
                        checked={selected.includes(p.id)}
                        onChange={() => toggleSelect(p.id)}
                      />
                    </td>

                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl border border-neutral-100 bg-neutral-50 flex-shrink-0 relative overflow-hidden group-hover:shadow-md transition-all">
                          {/* Using a placeholder or first image if we had access to full object */}
                          <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-neutral-300">
                            IMG
                          </div>
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/admin/products/${p.id}`}
                            className="font-bold text-neutral-900 hover:text-blue-600 transition-colors truncate block"
                          >
                            {p.title}
                          </Link>
                          <p className="text-[11px] text-neutral-400 font-medium">Standard Variant</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-6 text-right">
                      <p className="font-bold text-neutral-900">₹{p.price.toLocaleString()}</p>
                      <p className="text-[10px] text-neutral-400 font-medium tracking-tight whitespace-nowrap">COGS: ₹{p.cogs}</p>
                    </td>

                    <td className="p-6 text-right">
                      <span
                        className={`text-xs font-black px-2 py-1 rounded-lg ${margin >= 40
                          ? 'bg-green-50 text-green-700'
                          : margin >= 20
                            ? 'bg-orange-50 text-orange-700'
                            : 'bg-red-50 text-red-700'
                          }`}
                      >
                        {margin}%
                      </span>
                    </td>

                    <td className="p-6 text-right">
                      <div className="flex flex-col items-end">
                        <span className={`text-sm font-bold ${p.qty && p.qty < 10 ? 'text-orange-600' : 'text-neutral-900'}`}>
                          {p.qty ?? 'N/A'}
                        </span>
                        <div className="w-16 h-1 bg-neutral-100 rounded-full mt-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${p.qty && p.qty < 10 ? 'bg-orange-500' : 'bg-neutral-900'}`}
                            style={{ width: `${Math.min((p.qty || 0) * 2, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="p-6">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
                        <span className="text-xs font-bold text-neutral-600">{p.location ?? 'Global'}</span>
                      </div>
                    </td>

                    <td className="p-6 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${p.status === 'published'
                          ? 'bg-green-900 text-white shadow-sm'
                          : 'bg-neutral-100 text-neutral-500'
                          }`}
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-neutral-100 shadow-sm">
          <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
            Showing Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="px-4 py-2 border border-neutral-100 rounded-xl text-xs font-bold hover:bg-neutral-50 disabled:opacity-30 transition-all"
            >
              Previous
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              className="px-4 py-2 border border-neutral-100 rounded-xl text-xs font-bold hover:bg-neutral-50 disabled:opacity-30 transition-all"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

