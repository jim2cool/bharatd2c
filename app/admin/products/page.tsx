'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabaseBrowser } from '@/lib/supabase-browser'

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
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] =
    useState<'all' | 'published' | 'draft'>('all')
  const [locationFilter, setLocationFilter] = useState<'all' | string>('all')
  const [page, setPage] = useState(1)

  const loadProducts = async () => {
    setLoading(true)

    const { data, error } = await supabaseBrowser
      .from('products')
      .select('*')
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
    loadProducts()
  }, [])

  // Apply filters + pagination locally (SAFE + FAST for V1)
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
    if (!selected.length) return

    await supabaseBrowser
      .from('products')
      .update({ status })
      .in('id', selected)

    loadProducts()
  }

  const totalPages = Math.ceil(allProducts.length / PAGE_SIZE)

  if (loading) {
    return <div className="p-6">Loading products…</div>
  }

  return (
    <div className="p-6 space-y-4">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          Products <span className="text-gray-400">({allProducts.length})</span>
        </h1>

        <Link
          href="/admin/products/new"
          className="px-4 py-2 bg-black text-white rounded text-sm"
        >
          Add product
        </Link>
      </div>

      {/* FILTER BAR */}
      <div className="flex gap-3 items-center">
        <input
          value={search}
          onChange={e => {
            setPage(1)
            setSearch(e.target.value)
          }}
          placeholder="Search products…"
          className="w-64 px-3 py-2 border rounded text-sm"
        />

        <select
          value={statusFilter}
          onChange={e => {
            setPage(1)
            setStatusFilter(e.target.value as any)
          }}
          className="px-3 py-2 border rounded text-sm"
        >
          <option value="all">All status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>

        <select
          value={locationFilter}
          onChange={e => {
            setPage(1)
            setLocationFilter(e.target.value)
          }}
          className="px-3 py-2 border rounded text-sm"
        >
          <option value="all">All locations</option>
          <option value="Gurgaon">Gurgaon</option>
          <option value="Bangalore">Bangalore</option>
        </select>
      </div>

      {/* BULK BAR */}
      {selected.length > 0 && (
        <div className="flex gap-3 items-center bg-gray-50 border rounded px-4 py-2 text-sm shadow-sm">
          <strong>{selected.length}</strong> selected

          <button
            onClick={() => bulkUpdateStatus('published')}
            className="px-3 py-1.5 border rounded"
          >
            Publish
          </button>

          <button
            onClick={() => bulkUpdateStatus('draft')}
            className="px-3 py-1.5 border rounded"
          >
            Unpublish
          </button>
        </div>
      )}

      {/* TABLE */}
      <div className="border rounded bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3 w-8">
                <input
                  type="checkbox"
                  checked={
                    products.length > 0 &&
                    selected.length === products.length
                  }
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-right">Price</th>
              <th className="p-3 text-right">COGS</th>
              <th className="p-3 text-right">Margin</th>
              <th className="p-3 text-right">Qty</th>
              <th className="p-3 text-left">Location</th>
              <th className="p-3 text-center">Status</th>
            </tr>
          </thead>

          <tbody>
            {products.map(p => {
              const margin =
                p.price > 0
                  ? Math.round(((p.price - p.cogs) / p.price) * 100)
                  : 0

              return (
                <tr key={p.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(p.id)}
                      onChange={() => toggleSelect(p.id)}
                    />
                  </td>

                  <td className="p-3">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="font-medium hover:underline"
                    >
                      {p.title}
                    </Link>
                  </td>

                  <td className="p-3 text-right">₹{p.price}</td>
                  <td className="p-3 text-right">₹{p.cogs}</td>

                  <td className="p-3 text-right">
                    <span
                      className={
                        margin >= 40
                          ? 'text-green-600'
                          : margin >= 20
                          ? 'text-orange-600'
                          : 'text-red-600'
                      }
                    >
                      {margin}%
                    </span>
                  </td>

                  <td className="p-3 text-right">{p.qty ?? '-'}</td>
                  <td className="p-3">{p.location ?? '-'}</td>

                  <td className="p-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        p.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
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

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-end gap-2 text-sm">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Prev
          </button>
          <span className="px-2 py-1">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
