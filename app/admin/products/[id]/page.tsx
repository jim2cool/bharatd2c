'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useProductEditor, type ProductFormData } from './useProductEditor'
import ProductImagesBlock from './ProductImagesBlock'
import TestimonialsBlock from './TestimonialsBlock'
import { toast } from 'sonner'
import { FormProvider } from 'react-hook-form'
import { ExternalLink } from 'lucide-react'
import { CoreSection, PricingSection, ContentSection, SEOSection, ConversionSection } from '../components/FormSections'
import { getStoreBaseUrl } from '@/lib/getStoreUrl'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { useState } from 'react'

// Schema definition
const productSchema = z.object({
  title: z.string().min(1, 'Product title is required'),
  status: z.enum(['draft', 'published']),
  price: z.number().min(0, 'Price cannot be negative'),
  mrp: z.number().nullable().optional(),
  cogs: z.number().min(0.01, 'COGS must be greater than 0'),
  qty: z.number().nullable().optional(),
  location: z.string().optional().nullable(),

  rating: z.number().nullable().optional(),
  review_count: z.number().nullable().optional(),

  highlights: z.array(z.string()),
  content_markup: z.string().optional().nullable(),

  images: z.array(z.string()),

  // Testimonials should be a required array (can be empty)
  testimonials: z.array(z.any()),

  seo_title: z.string().optional().nullable(),
  seo_description: z.string().optional().nullable(),

  bundle_settings: z.object({
    enabled: z.boolean(),
  }),

  urgency_settings: z.object({
    enabled: z.boolean(),
    type: z.string(),
    text: z.string().optional().nullable(),
    timer: z.number().optional().nullable(),
    stock: z.number().optional().nullable(),
  }),

  cod_enabled: z.boolean(),

  prepaid_discount_type: z.enum(['flat', 'percentage']),
  prepaid_discount_value: z.number().nullable().optional(),
  prepaid_offer_text: z.string().optional().nullable(),
})

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>()
  const { product, loading, saving, save } = useProductEditor(id)
  const [storeUrl, setStoreUrl] = useState<string>('')

  useEffect(() => {
    getStoreBaseUrl(supabaseBrowser).then(url => setStoreUrl(url))
  }, [])

  const methods = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      highlights: [],
      images: [],
      testimonials: [],
      bundle_settings: { enabled: true },
      urgency_settings: { enabled: false, type: 'text' },
      cod_enabled: true,
      prepaid_discount_type: 'flat',
    }
  })

  const { handleSubmit, reset, formState: { isDirty }, watch, control } = methods

  useEffect(() => {
    if (product) {
      reset({
        title: product.title,
        status: product.status,
        price: product.price,
        mrp: product.mrp,
        cogs: product.cogs,
        qty: product.qty,
        location: product.location,
        rating: product.rating,
        review_count: product.review_count,
        highlights: product.highlights || [],
        content_markup: product.content_markup,
        images: product.images || [],
        testimonials: product.testimonials || [],
        seo_title: product.seo_title,
        seo_description: product.seo_description,
        bundle_settings: product.bundle_settings || { enabled: true },
        urgency_settings: product.urgency_settings || { enabled: false, type: 'text' },
        cod_enabled: product.cod_enabled ?? true,
        prepaid_discount_type: product.prepaid_discount_type || 'flat',
        prepaid_discount_value: product.prepaid_discount_value,
        prepaid_offer_text: product.prepaid_offer_text,
      })
    }
  }, [product, reset])

  if (loading) {
    return <div className="p-8">Loading product…</div>
  }

  const onSubmit = async (data: ProductFormData) => {
    const success = await save(data)
    if (success) {
      toast.success('Product saved successfully')
      reset(data)
    } else {
      toast.error('Failed to save product')
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-6xl mx-auto px-8 pt-10 pb-32 space-y-14">
        {/* NAVIGATION / BREADCRUMBS */}
        <div className="flex items-center justify-between mb-2">
          <Link
            href="/admin/products"
            className="flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-neutral-900 transition-colors group"
          >
            <div className="p-1.5 rounded-lg bg-neutral-50 group-hover:bg-neutral-100 transition-colors">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </div>
            Back to Inventory
          </Link>

          <a
            href={storeUrl ? `${storeUrl}/products/${watch('seo_title') || watch('title')}` : '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs font-black text-blue-600 hover:text-blue-700 transition-colors px-4 py-2 bg-blue-50 rounded-xl"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Preview on Store
          </a>
        </div>

        {/* HEADER */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-black text-neutral-900 tracking-tight flex items-center gap-3">
              Edit Product
              <span className="text-neutral-300 font-medium">/</span>
              <span className="text-neutral-400 font-medium text-xl truncate max-w-[300px]">{watch('title')}</span>
            </h1>
            <p className="text-sm text-neutral-500 font-medium mt-1">
              Update product information, pricing and content.
            </p>
          </div>

          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <span
                className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${field.value === 'published'
                  ? 'bg-green-50 text-green-700 border-green-200'
                  : 'bg-neutral-50 text-neutral-600 border-neutral-200'
                  }`}
              >
                {field.value}
              </span>
            )}
          />
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-10">
            <CoreSection />
            <PricingSection />
            <ContentSection />

            <Controller
              control={control}
              name="testimonials"
              render={({ field }) => (
                <TestimonialsBlock
                  testimonials={field.value}
                  setTestimonials={field.onChange}
                />
              )}
            />
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-10">
            <Controller
              control={control}
              name="images"
              render={({ field }) => (
                <ProductImagesBlock
                  images={field.value}
                  setImages={field.onChange}
                  productId={id}
                  productTitle={watch('title')}
                />
              )}
            />

            <SEOSection />
            <ConversionSection />
          </div>
        </div>

        {/* SAVE BAR */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-100 z-50">
          <div className="max-w-6xl mx-auto px-8 py-6 flex justify-end">
            <button
              type="submit"
              disabled={saving || !isDirty}
              className={`px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${saving || !isDirty
                ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                : 'bg-neutral-900 text-white hover:bg-neutral-800 shadow-lg shadow-neutral-100'
                }`}
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </div>
      </form>
    </FormProvider >
  )
}
