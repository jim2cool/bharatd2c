'use client'

import { useState } from 'react'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { useParams, useRouter } from 'next/navigation'

export default function NewVariantPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [sku, setSku] = useState('')

  const save = async () => {
    await supabaseBrowser.from('variants').insert({
      product_id: id,
      title,
      price: Number(price),
      sku,
    })

    router.push(`/admin/products/${id}`)
  }

  return (
    <div className="max-w-md space-y-4">
      <h1 className="text-xl font-bold">New Variant</h1>

      <input
        placeholder="Variant title (e.g. Size M)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 bg-black border border-gray-600 rounded"
      />

      <input
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="w-full p-2 bg-black border border-gray-600 rounded"
      />

      <input
        placeholder="SKU (optional)"
        value={sku}
        onChange={(e) => setSku(e.target.value)}
        className="w-full p-2 bg-black border border-gray-600 rounded"
      />

      <button
        onClick={save}
        className="bg-white text-black px-4 py-2 rounded"
      >
        Save Variant
      </button>
    </div>
  )
}
