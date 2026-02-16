'use client'

import React from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import { Card, Field, Label, Stat } from './ProductFormUI'
import { useParams } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { ProductFormData } from '../[id]/useProductEditor'
import { Editor } from '@/components/admin/Editor'

export function CoreSection() {
    const { register, formState: { errors } } = useFormContext<ProductFormData>()

    return (
        <Card title="Core information" subtitle="Title and publishing state">
            <div className="space-y-4">
                <Field label="Product title" error={errors.title?.message}>
                    <input
                        {...register('title')}
                        className="border rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                </Field>

                <Field label="Status">
                    <select
                        {...register('status')}
                        className="border rounded-xl px-3 py-2 w-48 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
                    >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                    </select>
                </Field>
            </div>
        </Card>
    )
}

export function PricingSection() {
    const { register, watch, formState: { errors } } = useFormContext<ProductFormData>()

    const price = watch('price')
    const cogs = watch('cogs')
    const profit = (price || 0) - (cogs || 0)
    const margin = price > 0 ? Math.round((profit / price) * 100) : 0

    return (
        <Card title="Pricing & inventory" subtitle="Price, margins and stock">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Field label="Selling price" error={errors.price?.message}>
                    <input
                        {...register('price', { valueAsNumber: true })}
                        type="number"
                        className="border rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                </Field>

                <Field label="MRP (strike-off)" error={errors.mrp?.message}>
                    <input
                        {...register('mrp', { valueAsNumber: true })}
                        type="number"
                        className="border rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                </Field>

                <Field label="COGS" error={errors.cogs?.message}>
                    <input
                        {...register('cogs', { valueAsNumber: true })}
                        type="number"
                        className="border rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                </Field>

                <Field label="Quantity available" error={errors.qty?.message}>
                    <input
                        {...register('qty', { valueAsNumber: true })}
                        type="number"
                        className="border rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                </Field>

                <Field label="Stock location" error={errors.location?.message}>
                    <input
                        {...register('location')}
                        className="border rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                </Field>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8">
                <Stat label="Profit per unit" value={`₹${profit}`} />
                <Stat label="Margin" value={`${margin}%`} />
            </div>
        </Card>
    )
}

export function ContentSection() {
    const { register, control, formState: { errors } } = useFormContext<ProductFormData>()

    return (
        <Card title="Product page content" subtitle="What shoppers see on the product page">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Field label="Rating (0–5)" error={errors.rating?.message}>
                    <input
                        {...register('rating', { valueAsNumber: true })}
                        type="number"
                        step="0.1"
                        max="5"
                        className="border rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                </Field>

                <Field label="Review count" error={errors.review_count?.message}>
                    <input
                        {...register('review_count', { valueAsNumber: true })}
                        type="number"
                        className="border rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                </Field>
            </div>

            <div className="mb-8">
                <Label>Key highlights</Label>
                <p className="text-sm text-neutral-500 mb-4">
                    Short bullet points shown near the product title.
                </p>

                <Controller
                    control={control}
                    name="highlights"
                    render={({ field }) => (
                        <div className="space-y-3">
                            {(field.value || []).map((h: string, i: number) => (
                                <div key={i} className="flex gap-2">
                                    <input
                                        className="flex-1 border rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        value={h}
                                        placeholder={`Highlight ${i + 1}`}
                                        onChange={e => {
                                            const newHighlights = [...(field.value || [])];
                                            newHighlights[i] = e.target.value;
                                            field.onChange(newHighlights);
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newHighlights = (field.value || []).filter((_: any, idx: number) => idx !== i);
                                            field.onChange(newHighlights);
                                        }}
                                        className="w-10 h-10 flex items-center justify-center border rounded-xl hover:bg-red-50 hover:text-red-500 transition-all font-bold"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => field.onChange([...(field.value || []), ''])}
                                className="text-sm font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 flex items-center gap-2 mt-2"
                            >
                                + Add highlight
                            </button>
                        </div>
                    )}
                />
            </div>

            <div>
                <Label>Detailed description</Label>
                <Controller
                    control={control}
                    name="content_markup"
                    render={({ field }) => (
                        <Editor
                            value={field.value || ''}
                            onChange={field.onChange}
                            placeholder="Describe your product in detail..."
                        />
                    )}
                />
            </div>
        </Card>
    )
}

export function SEOSection() {
    const { register, watch, formState: { errors } } = useFormContext<ProductFormData>()
    const title = watch('seo_title') || watch('title') || 'Product Title'
    const description = watch('seo_description') || 'Add a compelling description to improve your click-through rate in search results.'
    const slug = (watch as any)('slug') || 'product-url'

    return (
        <Card title="Search engine listing" subtitle="How this product appears on Google">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-4">
                    <Field label="SEO Title" error={errors.seo_title?.message}>
                        <div className="relative">
                            <input
                                {...register('seo_title')}
                                className="border rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none transition-all pr-12"
                                placeholder="SEO title"
                                maxLength={60}
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-neutral-400">
                                {watch('seo_title')?.length || 0}/60
                            </span>
                        </div>
                    </Field>
                    <Field label="SEO Description" error={errors.seo_description?.message}>
                        <div className="relative">
                            <textarea
                                {...register('seo_description')}
                                className="border rounded-xl px-3 py-2 w-full min-h-[100px] focus:ring-2 focus:ring-blue-500 outline-none transition-all pb-8"
                                placeholder="SEO description"
                                maxLength={160}
                            />
                            <span className="absolute right-3 bottom-3 text-[10px] font-bold text-neutral-400">
                                {watch('seo_description')?.length || 0}/160
                            </span>
                        </div>
                    </Field>
                </div>

                {/* GOOGLE PREVIEW */}
                <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-4">Google Search Preview</p>
                    <div className="max-w-[500px]">
                        <div className="text-[14px] text-[#202124] flex items-center gap-1 mb-1 truncate">
                            <span>https://easyd2c.in › products › </span>
                            <span className="font-medium">{slug}</span>
                        </div>
                        <h3 className="text-[20px] text-[#1a0dab] font-normal hover:underline cursor-pointer mb-1 leading-tight truncate">
                            {title}
                        </h3>
                        <p className="text-[14px] text-[#4d5156] leading-relaxed line-clamp-2">
                            {description}
                        </p>
                    </div>
                </div>
            </div>
        </Card>
    )
}

export function ConversionSection() {
    const { register, watch, formState: { errors } } = useFormContext<ProductFormData>()

    return (
        <Card title="Conversion settings" subtitle="Manage scarcity, urgency and bundles">
            <div className="space-y-8">
                {/* BUNDLES & CROSS-SELL */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <Label className="mb-0">Bundle & Cross-sell</Label>
                            <p className="text-xs text-neutral-500">Enable automated product bundles and cross-sell prompts</p>
                        </div>
                        <input
                            type="checkbox"
                            className="h-5 w-5 rounded border-neutral-300 text-blue-600 focus:ring-blue-500 transition-all"
                            {...register('bundle_settings.enabled')}
                        />
                    </div>

                    {watch('bundle_settings.enabled') && (
                        <div className="space-y-6 pl-6 border-l-2 border-neutral-100 animate-in slide-in-from-left-2 duration-300">
                            {/* MULTI-PURCHASE DISCOUNT */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label className="text-[11px] uppercase tracking-widest text-neutral-400">Multi-purchase Discount</Label>
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                                        {...register('bundle_settings.multi_purchase_enabled')}
                                    />
                                </div>

                                {watch('bundle_settings.multi_purchase_enabled') && (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4">
                                        <Field label="If Qty >=">
                                            <input
                                                type="number"
                                                {...register('bundle_settings.multi_qty', { valueAsNumber: true })}
                                                className="border rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            />
                                        </Field>
                                        <Field label="Discount Type">
                                            <select
                                                {...register('bundle_settings.multi_discount_type')}
                                                className="border rounded-xl px-3 py-2 w-full bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            >
                                                <option value="percentage">Percentage (%)</option>
                                                <option value="flat">Flat Amount (₹)</option>
                                            </select>
                                        </Field>
                                        <Field label="Value">
                                            <input
                                                type="number"
                                                {...register('bundle_settings.multi_discount_value', { valueAsNumber: true })}
                                                className="border rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            />
                                        </Field>
                                    </div>
                                )}
                            </div>

                            <div className="h-px bg-neutral-50" />

                            {/* CROSS-SELL PRODUCTS */}
                            <div className="space-y-4">
                                <Label className="text-[11px] uppercase tracking-widest text-neutral-400">Cross-sell Recommendations</Label>
                                <p className="text-xs text-neutral-500 -mt-2">Products to suggest in the checkout flow.</p>

                                <CrossSellSelector />
                            </div>
                        </div>
                    )}
                </div>

                <div className="h-px bg-neutral-100" />

                {/* COD TOGGLE */}
                <div className="flex items-center justify-between">
                    <div>
                        <Label className="mb-0">Cash on Delivery (COD)</Label>
                        <p className="text-xs text-neutral-500">Allow customers to pay on delivery</p>
                    </div>
                    <input
                        type="checkbox"
                        className="h-5 w-5 rounded border-neutral-300 text-blue-600 focus:ring-blue-500 transition-all"
                        {...register('cod_enabled')}
                    />
                </div>

                <div className="h-px bg-neutral-100" />

                {/* URGENCY */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <Label className="mb-0">Urgency Bar</Label>
                            <p className="text-xs text-neutral-500">Show scarcity or countdown timers</p>
                        </div>
                        <input
                            type="checkbox"
                            className="h-5 w-5 rounded border-neutral-300 text-blue-600 focus:ring-blue-500 transition-all"
                            {...register('urgency_settings.enabled')}
                        />
                    </div>

                    {watch('urgency_settings.enabled') && (
                        <div className="space-y-4 pl-6 border-l-2 border-neutral-100">
                            <Field label="Type">
                                <select
                                    {...register('urgency_settings.type')}
                                    className="border rounded-xl px-3 py-2 w-full bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                >
                                    <option value="text">Custom Text</option>
                                    <option value="timer">Countdown Timer</option>
                                    <option value="stock">Low Stock Count</option>
                                </select>
                            </Field>

                            {watch('urgency_settings.type') === 'text' && (
                                <Field label="Message text">
                                    <input
                                        {...register('urgency_settings.text')}
                                        className="border rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        placeholder="e.g. Selling Fast!"
                                    />
                                </Field>
                            )}

                            {watch('urgency_settings.type') === 'timer' && (
                                <Field label="Timer duration (minutes)">
                                    <input
                                        {...register('urgency_settings.timer', { valueAsNumber: true })}
                                        type="number"
                                        className="border rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    />
                                </Field>
                            )}

                            {watch('urgency_settings.type') === 'stock' && (
                                <Field label="Stock units left">
                                    <input
                                        {...register('urgency_settings.stock', { valueAsNumber: true })}
                                        type="number"
                                        className="border rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    />
                                </Field>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Card>
    )
}

function CrossSellSelector() {
    const { control } = useFormContext<ProductFormData>()
    const [allProducts, setAllProducts] = React.useState<any[]>([])
    const params = useParams()

    React.useEffect(() => {
        const load = async () => {
            const { data } = await supabaseBrowser
                .from('products')
                .select('id, title, images')
                .neq('id', params.id)
                .order('title')
            if (data) setAllProducts(data)
        }
        load()
    }, [params.id])

    return (
        <Controller
            control={control}
            name="bundle_settings.cross_sell_product_ids"
            render={({ field }) => {
                const selectedIds = field.value || []

                return (
                    <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {allProducts.map(p => {
                                const isSelected = selectedIds.includes(p.id)
                                return (
                                    <button
                                        key={p.id}
                                        type="button"
                                        onClick={() => {
                                            if (isSelected) {
                                                field.onChange(selectedIds.filter((id: string) => id !== p.id))
                                            } else {
                                                field.onChange([...selectedIds, p.id])
                                            }
                                        }}
                                        className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${isSelected
                                            ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                                            : 'border-neutral-100 hover:border-neutral-300 bg-white'
                                            }`}
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                                            {p.images?.[0] && (
                                                <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                                            )}
                                        </div>
                                        <span className={`text-xs font-bold truncate ${isSelected ? 'text-blue-700' : 'text-neutral-700'}`}>
                                            {p.title}
                                        </span>
                                    </button>
                                )
                            })}
                        </div>
                        {allProducts.length === 0 && (
                            <div className="p-4 border border-dashed rounded-xl text-center text-xs text-neutral-400">
                                No other products found to recommend.
                            </div>
                        )}
                    </div>
                )
            }}
        />
    )
}
