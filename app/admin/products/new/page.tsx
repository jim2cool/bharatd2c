'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '../../../../lib/supabase-browser'

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

export default function NewProductPage() {
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [price, setPrice] = useState<number | ''>('')

  const createProduct = async () => {
    if (!title || !price) {
      alert('Title and price are required')
      return
    }

    const slug = slugify(title)

    const { data, error } = await supabaseBrowser
      .from('products')
      .insert({
        title,
        price,
        slug,
        status: 'draft',
        store_id: 'b3589f69-28a2-4831-b20c-06512f483ce4', // required
      })
      .select('id')
      .single()

    if (error || !data) {
      console.error(error)
      alert(error?.message || 'Failed to create product')
      return
    }

    router.push(`/admin/products/${data.id}`)
  }

  return (
    <div className="max-w-xl space-y-4">
      <h1 className="text-2xl font-bold">New Product</h1>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Product title"
        className="w-full p-2 bg-black border border-gray-600 rounded"
      />

      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        placeholder="Base price"
        className="w-full p-2 bg-black border border-gray-600 rounded"
      />

      <button
        onClick={createProduct}
        className="bg-white text-black px-4 py-2 rounded"
      >
        Create Product
      </button>

      <p className="text-xs text-gray-500">
        Product will be created as <strong>draft</strong>.  
        Add details on the next screen.
      </p>
    </div>
  )
}
