'use client'

import { useEffect, useState } from 'react'
import { supabaseBrowser } from '../../../../lib/supabase-browser'
import { useParams } from 'next/navigation'

type Product = {
  id: string
  title: string
  price: number
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

type Variant = {
  id: string
  title: string
  price: number
  sku: string | null
}

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>()

  const [product, setProduct] = useState<Product | null>(null)
  const [variants, setVariants] = useState<Variant[]>([])
  const [loading, setLoading] = useState(true)

  // PDP fields
  const [rating, setRating] = useState<number | ''>('')
  const [reviewCount, setReviewCount] = useState<number | ''>('')
  const [mrp, setMrp] = useState<number | ''>('')

  const [highlights, setHighlights] = useState<string[]>([])
  const [images, setImages] = useState<string[]>([])
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [contentMarkup, setContentMarkup] = useState('')

  useEffect(() => {
    const load = async () => {
      const { data: productData } = await supabaseBrowser
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      const { data: variantData } = await supabaseBrowser
        .from('variants')
        .select('*')
        .eq('product_id', id)

      if (!productData) return

      setProduct(productData)
      setVariants(variantData || [])

      setRating(productData.rating ?? '')
      setReviewCount(productData.review_count ?? '')
      setMrp(productData.mrp ?? '')

      setHighlights(productData.highlights || [])
      setImages(productData.images || [])
      setTestimonials(productData.testimonials || [])
      setContentMarkup(productData.content_markup || '')

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

  if (loading || !product) return <p>Loading…</p>

  return (
    <div className="space-y-8">

      {/* PRODUCT CORE */}
      <section className="border border-gray-700 p-4 rounded">
        <h2 className="text-xl font-bold mb-4">Product</h2>

        <div className="space-y-3 max-w-xl">
          <input
            value={product.title}
            onChange={(e) =>
              setProduct({ ...product, title: e.target.value })
            }
            className="w-full p-2 bg-black border border-gray-600 rounded"
            placeholder="Title"
          />

          <input
            type="number"
            value={product.price}
            onChange={(e) =>
              setProduct({ ...product, price: Number(e.target.value) })
            }
            className="w-full p-2 bg-black border border-gray-600 rounded"
            placeholder="Base price"
          />

          <select
            value={product.status}
            onChange={(e) =>
              setProduct({ ...product, status: e.target.value })
            }
            className="w-full p-2 bg-black border border-gray-600 rounded"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>

          <input
            value={product.seo_title || ''}
            onChange={(e) =>
              setProduct({ ...product, seo_title: e.target.value })
            }
            className="w-full p-2 bg-black border border-gray-600 rounded"
            placeholder="SEO title"
          />

          <textarea
            value={product.seo_description || ''}
            onChange={(e) =>
              setProduct({ ...product, seo_description: e.target.value })
            }
            className="w-full p-2 bg-black border border-gray-600 rounded"
            placeholder="SEO description"
          />
        </div>
      </section>

      {/* PDP CONTENT */}
      <section className="border border-gray-700 p-4 rounded">
        <h2 className="text-xl font-bold mb-4">PDP Content</h2>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <input
            type="number"
            step="0.1"
            placeholder="Rating"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="p-2 bg-black border border-gray-600 rounded"
          />

          <input
            type="number"
            placeholder="Review count"
            value={reviewCount}
            onChange={(e) => setReviewCount(Number(e.target.value))}
            className="p-2 bg-black border border-gray-600 rounded"
          />

          <input
            type="number"
            placeholder="MRP"
            value={mrp}
            onChange={(e) => setMrp(Number(e.target.value))}
            className="p-2 bg-black border border-gray-600 rounded"
          />
        </div>

        {/* Highlights */}
        <h3 className="font-semibold mb-2">Highlights</h3>
        {highlights.map((h, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              value={h}
              onChange={(e) => {
                const copy = [...highlights]
                copy[i] = e.target.value
                setHighlights(copy)
              }}
              className="flex-1 p-2 bg-black border border-gray-600 rounded"
            />
            <button
              onClick={() =>
                setHighlights(highlights.filter((_, idx) => idx !== i))
              }
              className="px-3 border border-gray-600"
            >
              ×
            </button>
          </div>
        ))}
        <button
          onClick={() => setHighlights([...highlights, ''])}
          className="text-sm underline mb-4"
        >
          + Add highlight
        </button>

        {/* Images */}
        <h3 className="font-semibold mb-2">Images (URLs)</h3>
        {images.map((img, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              value={img}
              onChange={(e) => {
                const copy = [...images]
                copy[i] = e.target.value
                setImages(copy)
              }}
              className="flex-1 p-2 bg-black border border-gray-600 rounded"
            />
            <button
              onClick={() =>
                setImages(images.filter((_, idx) => idx !== i))
              }
              className="px-3 border border-gray-600"
            >
              ×
            </button>
          </div>
        ))}
        <button
          onClick={() => setImages([...images, ''])}
          className="text-sm underline mb-4"
        >
          + Add image
        </button>

        {/* Testimonials */}
        <h3 className="font-semibold mb-2">Testimonials</h3>
        {testimonials.map((t, i) => (
          <div key={i} className="border border-gray-600 p-3 mb-3">
            <input
              placeholder="Image URL"
              value={t.image || ''}
              onChange={(e) => {
                const copy = [...testimonials]
                copy[i] = { ...copy[i], image: e.target.value }
                setTestimonials(copy)
              }}
              className="w-full p-2 bg-black border border-gray-600 rounded mb-2"
            />
            <input
              placeholder="Name"
              value={t.name || ''}
              onChange={(e) => {
                const copy = [...testimonials]
                copy[i] = { ...copy[i], name: e.target.value }
                setTestimonials(copy)
              }}
              className="w-full p-2 bg-black border border-gray-600 rounded mb-2"
            />
            <input
              placeholder="Location"
              value={t.location || ''}
              onChange={(e) => {
                const copy = [...testimonials]
                copy[i] = { ...copy[i], location: e.target.value }
                setTestimonials(copy)
              }}
              className="w-full p-2 bg-black border border-gray-600 rounded mb-2"
            />
            <textarea
              placeholder="Testimonial text"
              value={t.text || ''}
              onChange={(e) => {
                const copy = [...testimonials]
                copy[i] = { ...copy[i], text: e.target.value }
                setTestimonials(copy)
              }}
              className="w-full p-2 bg-black border border-gray-600 rounded"
            />
            <button
              onClick={() =>
                setTestimonials(testimonials.filter((_, idx) => idx !== i))
              }
              className="text-sm underline mt-2"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={() =>
            setTestimonials([
              ...testimonials,
              { image: '', text: '', name: '', location: '' },
            ])
          }
          className="text-sm underline mb-4"
        >
          + Add testimonial
        </button>

        {/* Content Markup */}
        <h3 className="font-semibold mb-2">Content Markup</h3>
        <p className="text-xs text-gray-500 mb-2">
          Each &lt;h2&gt; creates a new accordion on the PDP
        </p>
        <textarea
          rows={12}
          value={contentMarkup}
          onChange={(e) => setContentMarkup(e.target.value)}
          className="w-full p-3 bg-black border border-gray-600 rounded font-mono text-sm"
        />
      </section>

      <button
        onClick={saveProduct}
        className="bg-white text-black px-6 py-2 rounded"
      >
        Save Product
      </button>

    </div>
  )
}
