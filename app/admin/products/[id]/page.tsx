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
import { ExternalLink, ImageIcon } from 'lucide-react'
import { CoreSection, ContentSection, SEOSection, PaymentOptionsSection, TrustSignalsSection, QuantityBreaksSection, CrossSellSection, UrgencySection, VariantsSection, ShippingSection } from '../components/FormSections'
import { getStoreBaseUrl } from '@/lib/getStoreUrl'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { slugify } from '@/lib/utils'
import { useState } from 'react'
import { Card } from '../components/ProductFormUI'

// Schema definition
const productSchema = z.object({
  title: z.string().min(1, 'Product title is required'),
  status: z.enum(['draft', 'published']),
  price: z.number().min(0, 'Price cannot be negative'),
  mrp: z.number().nullable().optional(),
  cogs: z.number().min(0, 'COGS cannot be negative'),
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
    multi_purchase_enabled: z.boolean().nullable().optional(),
    multi_qty: z.number().nullable().optional(),
    multi_discount_type: z.enum(['flat', 'percentage']).nullable().optional(),
    multi_discount_value: z.number().nullable().optional(),
    cross_sell_ids: z.array(z.string()).nullable().optional(),
    most_popular_index: z.number().nullable().optional(),
    cross_sell_title: z.string().nullable().optional(),
    tiers: z.array(z.object({
      qty: z.union([z.number(), z.nan()]).transform(val => isNaN(val) ? 1 : val),
      discount: z.union([z.number(), z.nan()]).transform(val => isNaN(val) ? 0 : val),
      label: z.string()
    })).nullable().optional(),
  }),

  urgency_settings: z.object({
    enabled: z.boolean(),
    type: z.string(),
    config: z.object({
      minutes: z.number().nullable().optional(),
      stock: z.number().nullable().optional(),
      viewers: z.number().nullable().optional(),
      text: z.string().optional().nullable(),
    }).optional()
  }),

  cod_enabled: z.boolean(),
  prepaid_enabled: z.boolean().nullable().optional(),
  cart_button_enabled: z.boolean().nullable().optional(),
  use_store_payment_settings: z.boolean().nullable().optional(),
  show_estimated_delivery: z.boolean().nullable().optional(),

  related_products_title: z.string().optional().nullable(),
  prepaid_discount_type: z.enum(['flat', 'percentage']).nullable().optional(),
  prepaid_discount_value: z.number().nullable().optional(),
  prepaid_offer_text: z.string().optional().nullable(),
  trust_indicators: z.array(z.object({
    icon: z.string(),
    text: z.string()
  })).max(4).nullable().optional(),
  trust_strip_image_url: z.string().optional().nullable(),

  has_variants: z.boolean().nullable().optional(),
  variant_options: z.array(z.object({
    name: z.string(),
    values: z.array(z.string())
  })).nullable().optional(),
  variants: z.array(z.any()).nullable().optional(),
  shipping_cost_estimate: z.number().nullable().optional(),
  gateway_fee: z.number().nullable().optional(),
  base_ad_cost: z.number().nullable().optional(),
})

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>()
  const { product, loading, saving, save } = useProductEditor(id)
  const [storeUrl, setStoreUrl] = useState<string>('')
  const [activeSection, setActiveSection] = useState<string | null>('gallery')

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section)
  }

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
      urgency_settings: { enabled: false, type: 'countdown' },
      cod_enabled: true,
      prepaid_enabled: true,
      cart_button_enabled: true,
      use_store_payment_settings: true,
      show_estimated_delivery: true,
      trust_indicators: [],
      trust_strip_image_url: '',
      prepaid_discount_type: 'flat',
      has_variants: false,
      variant_options: [],
      variants: [],
      shipping_cost_estimate: 0,
      gateway_fee: 0,
      base_ad_cost: 0
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
        shipping_cost_estimate: product.shipping_cost_estimate || 0,
        gateway_fee: product.gateway_fee || 0,
        base_ad_cost: product.base_ad_cost || 0,
        seo_title: product.seo_title,
        seo_description: product.seo_description,
        bundle_settings: {
          enabled: product.bundle_settings?.enabled ?? true,
          ...product.bundle_settings,
          // Ensure tiers exist if enabled, or just default them to avoid NaN
          tiers: product.bundle_settings?.tiers || [
            { qty: 1, discount: 0, label: 'Pack of 1' },
            { qty: 2, discount: 10, label: 'Pack of 2' },
            { qty: 3, discount: 20, label: 'Pack of 3' }
          ]
        },
        urgency_settings: product.urgency_settings || { enabled: false, type: 'countdown' },
        cod_enabled: product.cod_enabled ?? true,
        prepaid_enabled: product.prepaid_enabled ?? true,
        cart_button_enabled: product.cart_button_enabled ?? true,
        use_store_payment_settings: product.use_store_payment_settings,
        show_estimated_delivery: product.show_estimated_delivery ?? true,
        trust_indicators: product.trust_indicators || [],
        trust_strip_image_url: product.trust_strip_image_url,
        prepaid_discount_type: product.prepaid_discount_type || 'flat',
        prepaid_discount_value: product.prepaid_discount_value,
        prepaid_offer_text: product.prepaid_offer_text,
        has_variants: !!product.has_variants,
        variant_options: product.variant_options || [],
        variants: product.product_variants || []
      })
    }
  }, [product, reset])

  if (loading) {
    return <div className="p-8">Loading product…</div>
  }

  const onSubmit = async (data: any) => {
    const success = await save(data)
    if (success) {
      toast.success('Product saved successfully')
      reset(data)
    } else {
      toast.error('Failed to save product')
    }
  }

  const onInvalid = (errors: any) => {
    // safely log field names
    console.error('--- FORM VALIDATION ERRORS ---', Object.keys(errors))

    // Construct readable error message
    const errorMessages = Object.keys(errors)
      .map(key => {
        const err = errors[key];
        // Handle nested errors (e.g. variants, bundles) roughly
        if (err && typeof err === 'object' && !err.message) {
          return `${key} (Nested Error)`;
        }
        return `${key}: ${err?.message}`;
      })
      .join('\n');

    toast.error(`Validation Failed:\n${errorMessages || 'Check console'}`)
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="max-w-6xl mx-auto px-8 pt-10 pb-32 space-y-8">
        {/* NAVIGATION / BREADCRUMBS */}
        <div className="flex items-center justify-between mb-0">
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
            href={storeUrl ? `${storeUrl}/products/${slugify(watch('seo_title') || watch('title') || 'product')}?preview=true` : '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs font-black text-blue-600 hover:text-blue-700 transition-colors px-4 py-2 bg-blue-50 rounded-xl"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Preview on Store
          </a>
        </div>

        {/* HEADER & STATUS */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-black uppercase tracking-wider">Product Editor</div>
            </div>
            <h1 className="text-3xl font-black text-neutral-900 tracking-tight leading-none">
              {watch('title') || 'New Product'}
            </h1>
            <p className="text-[11px] text-neutral-400 font-medium">
              Identifier: <code className="text-[10px] bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-500 font-bold">{id}</code>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <div className="bg-white border border-neutral-100 rounded-2xl p-1 flex items-center shadow-sm">
                  {['draft', 'published', 'archived'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => field.onChange(s)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${field.value === s
                        ? 'bg-neutral-900 text-white shadow-lg'
                        : 'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50'
                        }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            />
          </div>
        </div>

        {/* SINGLE COLUMN LAYOUT */}
        <div className="max-w-4xl mx-auto space-y-4">
          {/* 1. Core Info (Always Open) */}
          <CoreSection />

          {/* 2. Product Gallery */}
          <Controller
            control={control}
            name="images"
            render={({ field }) => (
              <Card
                title="Product Gallery"
                subtitle="Visual assets for your storefront"
                icon={ImageIcon}
                isOpen={activeSection === 'gallery'}
                onToggle={() => toggleSection('gallery')}
              >
                <ProductImagesBlock
                  images={field.value}
                  setImages={field.onChange}
                  productId={id}
                  productTitle={watch('title')}
                />
              </Card>
            )}
          />

          {/* 3. Product Page Content */}
          <ContentSection
            isOpen={activeSection === 'content'}
            onToggle={() => toggleSection('content')}
          />

          {/* 4. Payment Options */}
          <PaymentOptionsSection
            isOpen={activeSection === 'payments'}
            onToggle={() => toggleSection('payments')}
          />

          {/* 5. Product Variants */}
          <VariantsSection
            isOpen={activeSection === 'variants'}
            onToggle={() => toggleSection('variants')}
          />

          {/* 6. Shipping & Delivery */}
          <ShippingSection
            isOpen={activeSection === 'shipping'}
            onToggle={() => toggleSection('shipping')}
          />

          {/* 7. Trust Signals (Integrated Testimonials) */}
          <TrustSignalsSection
            isOpen={activeSection === 'trust'}
            onToggle={() => toggleSection('trust')}
          />

          {/* 7. Quantity Breaks */}
          <QuantityBreaksSection
            isOpen={activeSection === 'quantity-breaks'}
            onToggle={() => toggleSection('quantity-breaks')}
          />

          {/* 8. Cross-sell Recommendations */}
          <CrossSellSection
            isOpen={activeSection === 'cross-sells'}
            onToggle={() => toggleSection('cross-sells')}
          />

          {/* 9. Urgency & Scarcity */}
          <UrgencySection
            isOpen={activeSection === 'urgency'}
            onToggle={() => toggleSection('urgency')}
          />

          {/* 8. SEO */}
          <SEOSection
            isOpen={activeSection === 'seo'}
            onToggle={() => toggleSection('seo')}
          />
        </div>

        {/* SAVE BAR */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-100 z-50">
          <div className="max-w-6xl mx-auto px-8 py-6 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className={`px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${saving
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
