'use client'

import { useEffect, useState } from 'react'
import { supabaseBrowser } from '@/lib/supabase-browser'

// Types for the form data
export type ProductFormData = {
  title: string
  status: 'draft' | 'published'
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
  testimonials: any[]
  seo_title?: string | null
  seo_description?: string | null
  bundle_settings: { enabled: boolean }
  urgency_settings: { enabled: boolean; type: string; text?: string | null; timer?: number | null; stock?: number | null }
  cod_enabled: boolean
  prepaid_discount_type: 'flat' | 'percentage'
  prepaid_discount_value?: number | null
  prepaid_offer_text?: string | null
}

export function useProductEditor(id: string) {
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /* ---------- LOAD ---------- */
  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabaseBrowser
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      setProduct(data)
      setLoading(false)
    }

    load()
  }, [id])

  /* ---------- SAVE ---------- */
  const save = async (data: ProductFormData) => {
    setSaving(true)
    setError(null)

    const payload = {
      ...data,
      // Ensure numeric values are numbers or null
      price: Number(data.price),
      cogs: Number(data.cogs),
      mrp: data.mrp ? Number(data.mrp) : null,
      qty: data.qty ? Number(data.qty) : null,
      rating: data.rating ? Number(data.rating) : null,
      review_count: data.review_count ? Number(data.review_count) : null,
      prepaid_discount_value: data.prepaid_discount_value ? Number(data.prepaid_discount_value) : null,
    }

    const { error } = await supabaseBrowser
      .from('products')
      .update(payload)
      .eq('id', id)

    setSaving(false)

    if (error) {
      setError(error.message)
      return false
    }

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
