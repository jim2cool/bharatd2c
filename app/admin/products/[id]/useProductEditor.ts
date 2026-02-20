'use client'

import { useEffect, useState } from 'react'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { revalidateProduct } from '../actions'
import { ResolutionEngine } from '@/lib/utils/resolution'
import { CategoryType } from '@/types/architecture'

export type Testimonial = {
  quote: string
  name: string
  rating: number
  location?: string
  hidden?: boolean
}

// Types for the form data
export type ProductFormData = {
  title: string
  status: 'draft' | 'published'
  category: CategoryType
  category_data?: Record<string, any>
  price: number
  mrp?: number | null
  cogs: number
  qty?: number | null
  location?: string | null
  rating?: number | null
  review_count?: number | null
  highlights: string[]
  content_markup?: string | null
  images: string[]
  testimonials: Testimonial[]
  seo_title?: string | null
  seo_description?: string | null
  bundle_settings: {
    enabled: boolean;
    multi_purchase_enabled?: boolean | null;
    multi_qty?: number | null;
    multi_discount_type?: 'flat' | 'percentage' | null;
    multi_discount_value?: number | null;
    cross_sell_ids?: string[] | null;
    most_popular_index?: number | null;
    cross_sell_title?: string | null;
    tiers?: { qty: number; discount: number; label: string }[] | null;
  }
  urgency_settings: {
    enabled: boolean;
    type: string;
    config?: {
      minutes?: number | null;
      stock?: number | null;
      viewers?: number | null;
      text?: string | null;
    }
  }
  cod_enabled: boolean
  prepaid_enabled?: boolean | null
  cart_button_enabled?: boolean | null
  trust_indicators?: { icon: string; text: string }[] | null
  trust_strip_image_url?: string | null
  related_products_title?: string | null
  prepaid_discount_type?: 'flat' | 'percentage' | null
  prepaid_discount_value?: number | null
  prepaid_offer_text?: string | null
  has_variants?: boolean | null
  variant_options?: { name: string; values: string[] }[] | null
  variants?: {
    title: string;
    price: number;
    mrp: number;
    inventory: number;
    location: string;
    cogs: number;
    sku: string;
    attributes: Record<string, string>;
  }[] | null
  use_store_payment_settings?: boolean | null
  show_estimated_delivery?: boolean | null
  shipping_cost_estimate?: number | null
  gateway_fee?: number | null
  base_ad_cost?: number | null
}

export function useProductEditor(id: string) {
  const [product, setProduct] = useState<any>(null)
  const [platformSettings, setPlatformSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /* ---------- LOAD ---------- */
  useEffect(() => {
    const load = async () => {
      const productQuery = supabaseBrowser
        .from('products')
        .select(`
          *,
          stores(*),
          product_variants(*)
        `)
        .eq('id', id)
        .single()

      const platformQuery = supabaseBrowser
        .from('platform_settings')
        .select('*')
        .eq('id', 1)
        .single()

      const [productRes, platformRes] = await Promise.all([productQuery, platformQuery])

      if (productRes.error) {
        setError(productRes.error.message)
        setLoading(false)
        return
      }

      setPlatformSettings(platformRes.data || { cod_enabled: true, prepaid_enabled: true, cart_button_enabled: true })

      const data = productRes.data
      setProduct({
        ...data,
        bundle_settings: {
          enabled: false,
          multi_purchase_enabled: false,
          multi_qty: 1,
          multi_discount_type: 'percentage',
          multi_discount_value: 0,
          cross_sell_ids: [],
          cross_sell_title: 'Related product',
          ...data.bundle_settings
        },
        category: data.category || 'multi',
        category_data: data.category_data || {},
        use_store_payment_settings: data.use_store_payment_settings !== false, // Default to true if null/undefined
        urgency_settings: {
          enabled: false,
          type: 'countdown',
          config: {
            minutes: 10,
            stock: 5,
            viewers: 15
          },
          ...data.urgency_settings
        },
        show_estimated_delivery: data.show_estimated_delivery !== false
      })
      setLoading(false)
    }

    load()
  }, [id])

  /* ---------- SAVE ---------- */
  const save = async (data: ProductFormData) => {
    setSaving(true)
    setError(null)

    // Ensure all numeric values are clean
    const payload = {
      ...data,
      price: Number(data.price),
      cogs: Number(data.cogs),
      mrp: data.mrp ? Number(data.mrp) : null,
      qty: data.qty ? Number(data.qty) : null,
      rating: data.rating ? Number(data.rating) : null,
      review_count: data.review_count ? Number(data.review_count) : null,
      prepaid_discount_value: data.prepaid_discount_value ? Number(data.prepaid_discount_value) : null,
      bundle_settings: {
        ...data.bundle_settings,
        multi_qty: data.bundle_settings.multi_qty ? Number(data.bundle_settings.multi_qty) : 1,
        multi_discount_value: data.bundle_settings.multi_discount_value ? Number(data.bundle_settings.multi_discount_value) : 0,
        most_popular_index: data.bundle_settings.most_popular_index !== undefined ? Number(data.bundle_settings.most_popular_index) : null
      },
      urgency_settings: {
        ...data.urgency_settings,
        config: {
          ...data.urgency_settings.config,
          minutes: data.urgency_settings.config?.minutes ? Number(data.urgency_settings.config.minutes) : null,
          stock: data.urgency_settings.config?.stock ? Number(data.urgency_settings.config.stock) : null,
          viewers: data.urgency_settings.config?.viewers ? Number(data.urgency_settings.config.viewers) : null,
        }
      },
      cod_enabled: !!data.cod_enabled,
      prepaid_enabled: !!data.prepaid_enabled,
      cart_button_enabled: !!data.cart_button_enabled,
      trust_indicators: (data.trust_indicators || []).slice(0, 4),
      trust_strip_image_url: (() => {
        if (!data.trust_strip_image_url) return null;
        // Check if it's a local Windows/Unix path pointing to 'public'
        const publicMatch = data.trust_strip_image_url.match(/[\\\/]public[\\\/](.*)/i);
        if (publicMatch && publicMatch[1]) {
          return '/' + publicMatch[1].replace(/\\/g, '/');
        }
        return data.trust_strip_image_url;
      })(),
      related_products_title: data.related_products_title || 'People also bought',
      use_store_payment_settings: data.use_store_payment_settings !== false, // Default to true if undefined
      show_estimated_delivery: data.show_estimated_delivery !== false, // Default to true if undefined
      shipping_cost_estimate: data.shipping_cost_estimate ? Number(data.shipping_cost_estimate) : 0,
      gateway_fee: data.gateway_fee ? Number(data.gateway_fee) : 0,
      base_ad_cost: data.base_ad_cost ? Number(data.base_ad_cost) : 0
    }

    // Validation: Enforce that at least one purchase path is resolved
    const ctx = {
      platform: platformSettings || { cod_enabled: true, prepaid_enabled: true },
      store: product?.stores,
      product: payload,
      useStoreDefaults: payload.use_store_payment_settings
    }

    const finalCod = ResolutionEngine.resolveBoolean('cod_enabled', ctx)
    const finalPrepaid = ResolutionEngine.resolveBoolean('prepaid_enabled', ctx)

    if (!finalCod && !finalPrepaid) {
      setError("Critical Configuration Error: The resolved configuration for this product results in NO available payment methods. Please ensure at least one (COD or Prepaid) is enabled at either the Platform, Store, or Product level.")
      setSaving(false)
      return false
    }

    // 1. UPDATE PRODUCT
    // Use a strict allow-list to avoid sending protected columns or trash
    const updatePayload = {
      title: payload.title,
      status: payload.status,
      category: payload.category,
      category_data: payload.category_data,
      price: payload.price,
      mrp: payload.mrp,
      cogs: payload.cogs,
      qty: payload.qty,
      location: payload.location,
      rating: payload.rating,
      review_count: payload.review_count,
      highlights: payload.highlights,
      content_markup: payload.content_markup,
      images: payload.images,
      testimonials: payload.testimonials,
      seo_title: payload.seo_title,
      seo_description: payload.seo_description,
      bundle_settings: payload.bundle_settings,
      urgency_settings: payload.urgency_settings,
      cod_enabled: payload.cod_enabled,
      prepaid_enabled: payload.prepaid_enabled,
      cart_button_enabled: payload.cart_button_enabled,
      trust_indicators: payload.trust_indicators,
      trust_strip_image_url: payload.trust_strip_image_url,
      related_products_title: payload.related_products_title,
      prepaid_discount_type: payload.prepaid_discount_type,
      prepaid_discount_value: payload.prepaid_discount_value,
      prepaid_offer_text: payload.prepaid_offer_text,
      has_variants: !!data.has_variants,
      variant_options: data.variant_options || [],
      use_store_payment_settings: payload.use_store_payment_settings,
      show_estimated_delivery: payload.show_estimated_delivery,
      shipping_cost_estimate: payload.shipping_cost_estimate,
      gateway_fee: payload.gateway_fee,
      base_ad_cost: payload.base_ad_cost
    }

    const { error: productError, data: updateData, count } = await supabaseBrowser
      .from('products')
      .update(updatePayload)
      .eq('id', id)
      .select()

    if (productError) {
      setSaving(false)
      setError(productError.message)
      return false
    }

    const has_variants = !!data.has_variants
    const variants = data.variants

    // 2. SYNC VARIANTS
    if (has_variants && variants && variants.length > 0) {
      // Re-fetch existing IDs to potentially preserve them, but for now simple delete-reinsert
      await supabaseBrowser
        .from('product_variants')
        .delete()
        .eq('product_id', id)

      const variantsToInsert = variants.map((v: any) => ({
        product_id: id,
        title: v.title,
        price: Number(v.price),
        mrp: Number(v.mrp || v.price),
        inventory: Number(v.inventory || 0),
        location: v.location || '',
        cogs: Number(v.cogs || 0),
        sku: v.sku || '',
        attributes: v.attributes || {},
        status: 'active'
      }))

      const { error: variantError } = await supabaseBrowser
        .from('product_variants')
        .insert(variantsToInsert)

      if (variantError) {
        console.error('Variant sync failed:', variantError)
        setSaving(false)
        setError(variantError.message)
        return false
      }
    } else {
      await supabaseBrowser
        .from('product_variants')
        .delete()
        .eq('product_id', id)
    }

    // 3. REVALIDATE
    await revalidateProduct(product.slug)

    setSaving(false)
    return true
  }

  return {
    product,
    loading,
    saving,
    error,
    save,
  }
}
