'use client'

import React from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import { Card, Field, Label, Stat } from './ProductFormUI'
import { ProductFormData } from '../[id]/useProductEditor'

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
                <textarea
                    {...register('content_markup')}
                    rows={8}
                    className="w-full border rounded-2xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                    placeholder="HTML or plain text description..."
                />
            </div>
        </Card>
    )
}

export function SEOSection() {
    const { register, formState: { errors } } = useFormContext<ProductFormData>()

    return (
        <Card title="Search engine listing" subtitle="How this product appears on Google">
            <div className="space-y-4">
                <Field label="SEO Title" error={errors.seo_title?.message}>
                    <input
                        {...register('seo_title')}
                        className="border rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        placeholder="SEO title"
                    />
                </Field>
                <Field label="SEO Description" error={errors.seo_description?.message}>
                    <textarea
                        {...register('seo_description')}
                        className="border rounded-xl px-3 py-2 w-full min-h-[100px] focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        placeholder="SEO description"
                    />
                </Field>
            </div>
        </Card>
    )
}

export function ConversionSection() {
    const { register, watch, formState: { errors } } = useFormContext<ProductFormData>()

    return (
        <Card title="Conversion settings" subtitle="Manage scarcity, urgency and bundles">
            <div className="space-y-8">
                {/* BUNDLES */}
                <div className="flex items-center justify-between">
                    <div>
                        <Label className="mb-0">Bundle Offer</Label>
                        <p className="text-xs text-neutral-500">Enable automated product bundles</p>
                    </div>
                    <input
                        type="checkbox"
                        className="h-5 w-5 rounded border-neutral-300 text-blue-600 focus:ring-blue-500 transition-all"
                        {...register('bundle_settings.enabled')}
                    />
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
