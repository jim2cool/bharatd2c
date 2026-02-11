'use client'

import { useEffect, useState } from 'react'
import { supabaseBrowser } from '@/lib/supabase-browser'

export type Testimonial = {
  quote: string
  name: string
  location?: string
  rating: number
  hidden?: boolean
}

export function useProductEditor(id: string) {
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [rating, setRating] = useState<number | ''>('')
  const [reviewCount, setReviewCount] = useState<number | ''>('')
  const [mrp, setMrp] = useState<number | ''>('')

  const [highlights, setHighlights] = useState<string[]>([])
  const [images, setImages] = useState<string[]>([])
  const [contentMarkup, setContentMarkup] = useState('')
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])

  // conversion settings
  const [bundleSettings, setBundleSettings] = useState<any>({ enabled: true })
  const [urgencySettings, setUrgencySettings] = useState<any>({ enabled: false, type: 'text', text: '' })
  const [codEnabled, setCodEnabled] = useState(true)

  // prepaid discount parity
  const [prepaidDiscountType, setPrepaidDiscountType] = useState<'flat' | 'percentage'>('flat')
  const [prepaidDiscountValue, setPrepaidDiscountValue] = useState<number | ''>('')
  const [prepaidOfferText, setPrepaidOfferText] = useState('')

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
      setRating(data?.rating ?? '')
      setReviewCount(data?.review_count ?? '')
      setMrp(data?.mrp ?? '')
      setHighlights(data?.highlights || [])
      setImages(data?.images || [])
      setContentMarkup(data?.content_markup || '')
      setTestimonials(data?.testimonials || [])

      setBundleSettings(data?.bundle_settings || { enabled: true })
      setUrgencySettings(data?.urgency_settings || { enabled: false, type: 'text', text: '' })
      setCodEnabled(data?.cod_enabled ?? true)

      setPrepaidDiscountType(data?.prepaid_discount_type || 'flat')
      setPrepaidDiscountValue(data?.prepaid_discount_value ?? '')
      setPrepaidOfferText(data?.prepaid_offer_text || '')

      setLoading(false)
    }

    load()
  }, [id])

  /* ---------- VALIDATION ---------- */
  const validate = () => {
    if (!product) return 'Product not loaded'

    if (rating !== '' && (rating < 0 || rating > 5)) {
      return 'Rating must be between 0 and 5'
    }

    if (reviewCount !== '' && reviewCount < 0) {
      return 'Review count cannot be negative'
    }

    if (mrp !== '' && mrp < Number(product.price)) {
      return 'MRP must be greater than or equal to selling price'
    }

    for (const t of testimonials) {
      if (!t.quote?.trim()) return 'Testimonial quote is required'
      if (!t.name?.trim()) return 'Testimonial name is required'
      if (t.rating < 1 || t.rating > 5)
        return 'Testimonial rating must be between 1 and 5'
    }

    return null
  }

  /* ---------- SAVE ---------- */
  const save = async () => {
    if (!product) return false

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return false
    }

    setSaving(true)
    setError(null)

    const payload = {
      title: product.title,
      price: Number(product.price),
      cogs: Number(product.cogs),
      qty: product.qty ?? null,
      location: product.location || null,
      status: product.status,

      seo_title: product.seo_title || null,
      seo_description: product.seo_description || null,

      rating: rating === '' ? null : rating,
      review_count: reviewCount === '' ? null : reviewCount,
      mrp: mrp === '' ? null : mrp,

      highlights,
      images,
      testimonials,
      content_markup: contentMarkup || null,

      bundle_settings: bundleSettings,
      urgency_settings: urgencySettings,
      cod_enabled: codEnabled,

      prepaid_discount_type: prepaidDiscountType,
      prepaid_discount_value: prepaidDiscountValue === '' ? null : Number(prepaidDiscountValue),
      prepaid_offer_text: prepaidOfferText || null,
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
    setProduct,

    loading,
    saving,
    error,
    setError,

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

    testimonials,
    setTestimonials,

    bundleSettings,
    setBundleSettings,
    urgencySettings,
    setUrgencySettings,
    codEnabled,
    setCodEnabled,

    prepaidDiscountType,
    setPrepaidDiscountType,
    prepaidDiscountValue,
    setPrepaidDiscountValue,
    prepaidOfferText,
    setPrepaidOfferText,

    save,
  }
}
