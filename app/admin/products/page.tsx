'use client'

import { useEffect, useState } from 'react'
import { supabaseBrowser } from '../../../lib/supabase-browser'

type Product = {
  id: string
  title: string
  status: string
  price: number
}

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabaseBrowser
        .from('products')
        .select('id, title, status, price')
        .order('created_at', { ascending: false })

      setProducts(data || [])
      setLoading(false)
    }

    load()
  }, [])

  if (loading) return <p className="p-6">Loading products…</p>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <a
          href="/admin/products/new"
          className="bg-white text-black px-4 py-2 rounded"
        >
          + Add Product
        </a>
      </div>

      <table className="w-full border border-gray-700 rounded">
        <thead className="bg-gray-900 text-gray-300">
          <tr>
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Price</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr
              key={p.id}
              className="odd:bg-black even:bg-gray-900 hover:bg-gray-800"
            >
              <td className="p-2 border">{p.title}</td>
              <td className="p-2 border">₹{p.price}</td>
              <td className="p-2 border">{p.status}</td>

              <td className="p-2 border space-x-3">
                {/* Admin edit (UUID-based, internal) */}
                <a
                  href={`/admin/products/${p.id}`}
                  className="text-blue-400 underline"
                >
                  Edit
                </a>

                {/* Public PDP (slug-based, SEO-safe) */}
                <a
                  href={`/products/${slugify(p.title)}`}
                  target="_blank"
                  className="text-gray-400 underline"
                >
                  View
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
