'use client'

import { useParams } from 'next/navigation'
import { useProductEditor } from './useProductEditor'
import ProductImagesBlock from './ProductImagesBlock'
import TestimonialsBlock from './TestimonialsBlock'

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>()
  const editor = useProductEditor(id)

  if (editor.loading || !editor.product) {
    return <div className="p-8">Loading product…</div>
  }

  const {
    product,
    setProduct,
    rating,
    setRating,
    reviewCount,
    setReviewCount,
    mrp,
    setMrp,
    highlights,
    setHighlights,
    images,
    setImages,
    contentMarkup,
    setContentMarkup,
    error,
    save,
    saving,
  } = editor

  const profit = product.price - product.cogs
  const margin =
    product.price > 0 ? Math.round((profit / product.price) * 100) : 0

  return (
    <div className="max-w-6xl mx-auto px-8 pt-10 pb-32 space-y-14">

      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold">Edit product</h1>
          <p className="text-sm text-gray-500 mt-1">
            Update product information, pricing and content.
          </p>
        </div>

        <span
          className={`text-xs px-2 py-1 rounded-full border ${
            product.status === 'published'
              ? 'bg-green-50 text-green-700 border-green-200'
              : 'bg-gray-50 text-gray-600 border-gray-200'
          }`}
        >
          {product.status}
        </span>
      </div>

      {error && (
        <div className="border border-red-200 bg-red-50 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* GRID */}
      <div className="grid grid-cols-3 gap-8">

        {/* LEFT COLUMN */}
        <div className="col-span-2 space-y-10">

          {/* CORE */}
          <Card
            title="Core information"
            subtitle="Title and publishing state"
          >
            <div className="space-y-4">
              <Field label="Product title">
                <input
                  className="border rounded px-3 py-2 w-full"
                  value={product.title}
                  onChange={e =>
                    setProduct({ ...product, title: e.target.value })
                  }
                />
              </Field>

              <Field label="Status">
                <select
                  className="border rounded px-3 py-2 w-48"
                  value={product.status}
                  onChange={e =>
                    setProduct({
                      ...product,
                      status: e.target.value as 'draft' | 'published',
                    })
                  }
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </Field>
            </div>
          </Card>
		  

          {/* PRICING */}
          <Card
            title="Pricing & inventory"
            subtitle="Price, margins and stock"
          >
            <div className="grid grid-cols-3 gap-4">
              <Field label="Selling price">
                <NumberInput
                  value={product.price}
                  onChange={v => setProduct({ ...product, price: v })}
                />
              </Field>

              <Field label="MRP (strike-off)">
                <NumberInput value={mrp} onChange={setMrp} />
              </Field>

              <Field label="COGS">
                <NumberInput
                  value={product.cogs}
                  onChange={v => setProduct({ ...product, cogs: v })}
                />
              </Field>

              <Field label="Quantity available">
                <NumberInput
                  value={product.qty ?? ''}
                  onChange={v =>
                    setProduct({ ...product, qty: v === '' ? null : v })
                  }
                />
              </Field>

              <Field label="Stock location">
                <input
                  className="border rounded px-3 py-2 w-full"
                  value={product.location ?? ''}
                  onChange={e =>
                    setProduct({ ...product, location: e.target.value })
                  }
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6 text-sm text-gray-600">
              <Stat label="Profit per unit" value={`₹${profit}`} />
              <Stat label="Margin" value={`${margin}%`} />
            </div>
          </Card>

          {/* CONTENT */}
          <Card
            title="Product page content"
            subtitle="What shoppers see on the product page"
          >
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Field label="Rating (0–5)">
                <NumberInput value={rating} onChange={setRating} />
              </Field>

              <Field label="Review count">
                <NumberInput value={reviewCount} onChange={setReviewCount} />
              </Field>
            </div>

            <div className="mb-6">
              <Label>Key highlights</Label>
              <p className="text-sm text-gray-500 mb-2">
                Short bullet points shown near the product title.
              </p>

              {highlights.map((h, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input
                    className="flex-1 border rounded px-3 py-2"
                    value={h}
                    onChange={e => {
                      const copy = [...highlights]
                      copy[i] = e.target.value
                      setHighlights(copy)
                    }}
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

            <div>
              <Label>Detailed description</Label>
              <p className="text-sm text-gray-500 mb-2">
                Only HTML is supported. Each h2 tag becomes an accordion section on the product page.
              </p>

              <textarea
                rows={8}
                className="w-full border rounded px-3 py-2 font-mono text-sm"
                value={contentMarkup}
                onChange={e => setContentMarkup(e.target.value)}
              />
            </div>
          </Card>
		  <TestimonialsBlock
  testimonials={editor.testimonials}
  setTestimonials={editor.setTestimonials}
/>

        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-10">

          {/* IMAGES */}
          <ProductImagesBlock
  images={images}
  setImages={setImages}
  productId={product.id}
  productTitle={product.title}
/>


          {/* SEO */}
          <Card
            title="Search engine listing"
            subtitle="How this product appears on Google"
          >
            <input
              className="border rounded px-3 py-2 w-full mb-3"
              placeholder="SEO title"
              value={product.seo_title || ''}
              onChange={e =>
                setProduct({ ...product, seo_title: e.target.value })
              }
            />

            <textarea
              className="border rounded px-3 py-2 w-full"
              placeholder="SEO description"
              value={product.seo_description || ''}
              onChange={e =>
                setProduct({ ...product, seo_description: e.target.value })
              }
            />
          </Card>
        </div>
      </div>

      {/* SAVE BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="max-w-6xl mx-auto px-8 py-4 flex justify-end">
          <button
            onClick={async () => {
              const ok = await save()
              if (ok) alert('Product saved')
            }}
            disabled={saving}
            className="px-6 py-2 bg-black text-white rounded"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ---------- UI helpers ---------- */

function Card({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: any
}) {
  return (
    <section className="bg-white border rounded p-6">
      <h2 className="font-semibold mb-1">{title}</h2>
      {subtitle && (
        <p className="text-sm text-gray-500 mb-6">{subtitle}</p>
      )}
      {children}
    </section>
  )
}

function Field({ label, children }: any) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  )
}

function Label({ children }: any) {
  return <div className="text-sm font-medium mb-1">{children}</div>
}

function NumberInput({
  value,
  onChange,
}: {
  value: number | ''
  onChange: (v: any) => void
}) {
  return (
    <input
      type="number"
      className="border rounded px-3 py-2 w-full"
      value={value}
      onChange={e =>
        onChange(e.target.value === '' ? '' : Number(e.target.value))
      }
    />
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border rounded px-3 py-2 bg-gray-50">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  )
}
