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
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const loadProducts = async () => {
    setLoading(true)
    const { data } = await supabaseBrowser
      .from('products')
      .select('id, title, price, cogs, status')
      .order('created_at', { ascending: false })

    setProducts(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const toggleSelect = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const bulkUpdateStatus = async (status: 'published' | 'draft') => {
    if (!selected.length) return

    await supabaseBrowser
      .from('products')
      .update({ status })
      .in('id', selected)

    setSelected([])
    loadProducts()
  }

  if (loading) return <div className="p-6">Loading products…</div>

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Products</h1>

        <div className="flex gap-2">
          <button
            onClick={() => bulkUpdateStatus('published')}
            className="px-3 py-1.5 border rounded text-sm"
          >
            Publish
          </button>
          <button
            onClick={() => bulkUpdateStatus('draft')}
            className="px-3 py-1.5 border rounded text-sm"
          >
            Unpublish
          </button>
          <Link
            href="/admin/products/new"
            className="px-3 py-1.5 bg-black text-white rounded text-sm"
          >
            Add product
          </Link>
        </div>
      </div>

      {/* TABLE */}
      <div className="border rounded overflow-hidden bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3 w-8"></th>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-right">Price</th>
              <th className="p-3 text-right">COGS</th>
              <th className="p-3 text-right">Margin</th>
              <th className="p-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => {
              const profit = p.price - p.cogs
              const margin =
                p.price > 0 ? Math.round((profit / p.price) * 100) : 0

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
    </div>
  )
}
