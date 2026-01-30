'use client'

import { useEffect, useState } from 'react'
import { supabaseBrowser } from '../../../../lib/supabase-browser'
import { useParams } from 'next/navigation'

type Product = {
  id: string
  title: string
  price: number
  cogs: number
  status: string
  seo_title: string | null
  seo_description: string | null

  rating?: number | null
  review_count?: number | null
  mrp?: number | null
  highlights?: string[] | null
  images?: string[] | null
  testimonials?: any[] | null
  content_markup?: string | null
}

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  const [rating, setRating] = useState<number | ''>('')
  const [reviewCount, setReviewCount] = useState<number | ''>('')
  const [mrp, setMrp] = useState<number | ''>('')

  const [highlights, setHighlights] = useState<string[]>([])
  const [images, setImages] = useState<string[]>([])
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [contentMarkup, setContentMarkup] = useState('')

  useEffect(() => {
    const load = async () => {
      const { data } = await supabaseBrowser
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (!data) return

      setProduct(data)
      setRating(data.rating ?? '')
      setReviewCount(data.review_count ?? '')
      setMrp(data.mrp ?? '')
      setHighlights(data.highlights || [])
      setImages(data.images || [])
      setTestimonials(data.testimonials || [])
      setContentMarkup(data.content_markup || '')

      setLoading(false)
    }

    load()
  }, [id])

  const saveProduct = async () => {
    if (!product) return

    await supabaseBrowser
      .from('products')
      .update({
        title: product.title,
        price: product.price,
        cogs: product.cogs,
        status: product.status,
        seo_title: product.seo_title,
        seo_description: product.seo_description,

        rating: rating === '' ? null : rating,
        review_count: reviewCount === '' ? null : reviewCount,
        mrp: mrp === '' ? null : mrp,
        highlights,
        images,
        testimonials,
        content_markup: contentMarkup,
      })
      .eq('id', id)

    alert('Product saved')
  }

  if (loading || !product) return <div className="p-6">Loading…</div>

  const profit = product.price - product.cogs
  const margin =
    product.price > 0 ? Math.round((profit / product.price) * 100) : 0

  return (
    <div className="space-y-8 max-w-4xl">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Edit product</h1>
        <button
          onClick={saveProduct}
          className="px-5 py-2 bg-black text-white rounded"
        >
          Save
        </button>
      </div>

      {/* CORE */}
      <section className="bg-white border rounded p-6 space-y-4">
        <h2 className="font-semibold">Core information</h2>

        <input
          value={product.title}
          onChange={e =>
            setProduct({ ...product, title: e.target.value })
          }
          className="w-full border rounded px-3 py-2"
          placeholder="Product title"
        />

        <div className="grid grid-cols-4 gap-4">
          <input
            type="number"
            value={product.price}
            onChange={e =>
              setProduct({ ...product, price: Number(e.target.value) })
            }
            className="border rounded px-3 py-2"
            placeholder="Price"
          />

          <input
            type="number"
            value={product.cogs}
            onChange={e =>
              setProduct({ ...product, cogs: Number(e.target.value) })
            }
            className="border rounded px-3 py-2"
            placeholder="COGS"
          />

          <div className="border rounded px-3 py-2 bg-gray-50 text-sm">
            Profit: ₹{profit}
          </div>

          <div className="border rounded px-3 py-2 bg-gray-50 text-sm">
            Margin: {margin}%
          </div>
        </div>

        <select
          value={product.status}
          onChange={e =>
            setProduct({ ...product, status: e.target.value })
          }
          className="border rounded px-3 py-2 w-48"
        >
          <option value="draft">Unpublished</option>
          <option value="published">Published</option>
        </select>
      </section>

      {/* SEO */}
      <section className="bg-white border rounded p-6 space-y-3">
        <h2 className="font-semibold">SEO</h2>

        <input
          value={product.seo_title || ''}
          onChange={e =>
            setProduct({ ...product, seo_title: e.target.value })
          }
          className="w-full border rounded px-3 py-2"
          placeholder="SEO title"
        />

        <textarea
          value={product.seo_description || ''}
          onChange={e =>
            setProduct({ ...product, seo_description: e.target.value })
          }
          className="w-full border rounded px-3 py-2"
          placeholder="SEO description"
        />
      </section>

      {/* PDP CONTENT */}
      <section className="bg-white border rounded p-6 space-y-6">
        <h2 className="font-semibold">PDP content</h2>

        <div className="grid grid-cols-3 gap-4">
          <input
            type="number"
            placeholder="Rating"
            value={rating}
            onChange={e => setRating(Number(e.target.value))}
            className="border rounded px-3 py-2"
          />
          <input
            type="number"
            placeholder="Review count"
            value={reviewCount}
            onChange={e => setReviewCount(Number(e.target.value))}
            className="border rounded px-3 py-2"
          />
          <input
            type="number"
            placeholder="MRP"
            value={mrp}
            onChange={e => setMrp(Number(e.target.value))}
            className="border rounded px-3 py-2"
          />
        </div>

        {/* Highlights */}
        <div>
          <h3 className="font-medium mb-2">Highlights</h3>
          {highlights.map((h, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                value={h}
                onChange={e => {
                  const copy = [...highlights]
                  copy[i] = e.target.value
                  setHighlights(copy)
                }}
                className="flex-1 border rounded px-3 py-2"
              />
              <button
                onClick={() =>
                  setHighlights(highlights.filter((_, idx) => idx !== i))
                }
                className="px-3 border rounded"
              >
                ×
              </button>
            </div>
          ))}
          <button
            onClick={() => setHighlights([...highlights, ''])}
            className="text-sm underline"
          >
            + Add highlight
          </button>
        </div>

        {/* Content Markup */}
        <div>
          <h3 className="font-medium mb-2">Content markup</h3>
          <textarea
            rows={10}
            value={contentMarkup}
            onChange={e => setContentMarkup(e.target.value)}
            className="w-full border rounded px-3 py-2 font-mono text-sm"
          />
        </div>
      </section>
    </div>
  )
}
