'use client'

import React, { useState, useEffect } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import { Card, Field, Label, Stat } from './ProductFormUI'
import { useParams } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { ProductFormData } from '../[id]/useProductEditor'
import { Editor } from '@/components/admin/Editor'
import { Switch } from '@/components/ui/switch'
import {
    Layout,
    BadgeInfo,
    IndianRupee,
    Globe,
    Sparkles,
    Zap,
    ShieldCheck,
    Layers,
    Settings,
    Clock,
    Flame,
    ShoppingCart,
    Edit3,
    Plus,
    RefreshCw,
    Trash2,
    Truck,
    RotateCcw,
    Lock,
    Package,
    PlusCircle,
    Eye,
    Award,
    Star,
    MessageSquare,
    BadgeCheck,
    ArrowUpFromLine,
    Banknote
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import type { PrepaidConfig } from "@/lib/types/prepaid"
import TestimonialsBlock from '../[id]/TestimonialsBlock'
import { TrustStripUpload } from './TrustStripUpload'

const TRUST_ICONS = {
    ShieldCheck, Truck, RotateCcw, BadgeCheck, Lock, Award, Star, MessageSquare, Flame, Sparkles
}

export function CoreSection() {
    const { register, watch, formState: { errors } } = useFormContext<ProductFormData>()

    const price = watch('price') || 0
    const cogs = watch('cogs') || 0
    const shipping = watch('shipping_cost_estimate') || 0
    const gateway = watch('gateway_fee') || 0
    const adCost = watch('base_ad_cost') || 0

    const totalCost = cogs + shipping + gateway + adCost
    const profit = price - totalCost
    const margin = price > 0 ? Math.round((profit / price) * 100) : 0

    return (
        <Card title="Core Information" subtitle="Identify and price your product" icon={Layout}>
            <div className="space-y-10">
                <Field label="Product Title" error={errors.title?.message}>
                    <div className="relative group">
                        <input
                            {...register('title')}
                            className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300 shadow-sm"
                            placeholder="e.g. Premium Silk Saree"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors pointer-events-none">
                            <Edit3 className="w-4 h-4" />
                        </div>
                    </div>
                </Field>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <Field label="Selling Price" error={errors.price?.message}>
                        <div className="relative group/field">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs group-focus-within/field:text-blue-600 transition-colors z-10 pointer-events-none">₹</span>
                            <input
                                {...register('price', { valueAsNumber: true })}
                                type="number"
                                className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm"
                            />
                        </div>
                    </Field>

                    <Field label="MRP (Strike-off)" error={errors.mrp?.message}>
                        <div className="relative group/field">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs z-10 pointer-events-none">₹</span>
                            <input
                                {...register('mrp', { valueAsNumber: true })}
                                type="number"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-slate-500 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                    </Field>

                    <Field label="COGS (Cost)" error={errors.cogs?.message}>
                        <div className="relative group/field">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs z-10 pointer-events-none">₹</span>
                            <input
                                {...register('cogs', { valueAsNumber: true })}
                                type="number"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-slate-500 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                    </Field>

                    {!watch('has_variants') && (
                        <Field label="Inventory (Current Stock)" error={errors.qty?.message}>
                            <input
                                {...register('qty', { valueAsNumber: true })}
                                type="number"
                                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm"
                            />
                        </Field>
                    )}

                    <Field label="Warehouse Location" error={errors.location?.message}>
                        <input
                            {...register('location')}
                            placeholder="Primary Warehouse..."
                            className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm"
                        />
                    </Field>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-slate-100 pt-8 mt-2">
                    <Field label="Est. Shipping" error={errors.shipping_cost_estimate?.message}>
                        <div className="relative group/field">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs z-10 pointer-events-none">₹</span>
                            <input
                                {...register('shipping_cost_estimate', { valueAsNumber: true })}
                                type="number"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                                placeholder="e.g. 60"
                            />
                        </div>
                    </Field>

                    <Field label="Est. Gateway Fee" error={errors.gateway_fee?.message}>
                        <div className="relative group/field">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs z-10 pointer-events-none">₹</span>
                            <input
                                {...register('gateway_fee', { valueAsNumber: true })}
                                type="number"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                                placeholder="2% of price?"
                            />
                        </div>
                    </Field>

                    <Field label="Target Ad Cost" error={errors.base_ad_cost?.message}>
                        <div className="relative group/field">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs z-10 pointer-events-none">₹</span>
                            <input
                                {...register('base_ad_cost', { valueAsNumber: true })}
                                type="number"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                                placeholder="CPA Target"
                            />
                        </div>
                    </Field>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-4">
                    <Stat label="Net Contribution Margin" value={`₹${profit}`} className="bg-green-50 border-green-100 shadow-sm" />
                    <Stat label="Margin %" value={`${margin}%`} className="bg-blue-50 border-blue-100 shadow-sm" />
                </div>
            </div>
        </Card>
    )
}


export function SEOSection({ isOpen, onToggle }: { isOpen?: boolean; onToggle?: () => void }) {
    const { register, watch, formState: { errors } } = useFormContext<ProductFormData>()
    const title = watch('seo_title') || watch('title') || 'Product Title'
    const description = watch('seo_description') || 'Add a compelling description to improve your click-through rate in search results.'
    const slug = (watch as any)('slug') || 'product-url'

    return (
        <Card
            title="Search Engine Listing"
            subtitle="Preview and refine Google metadata"
            icon={Globe}
            isOpen={isOpen}
            onToggle={onToggle}
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <Field label="SEO Title" error={errors.seo_title?.message}>
                        <div className="relative group">
                            <input
                                {...register('seo_title')}
                                className="w-full bg-white border border-slate-300 rounded-2xl pl-4 pr-12 py-3.5 text-sm font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-neutral-300 shadow-sm"
                                placeholder="SEO title"
                                maxLength={60}
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black tracking-widest text-neutral-400">
                                {watch('seo_title')?.length || 0}/60
                            </span>
                        </div>
                    </Field>
                    <Field label="SEO Description" error={errors.seo_description?.message}>
                        <div className="relative group">
                            <textarea
                                {...register('seo_description')}
                                className="w-full bg-white border border-slate-300 rounded-2xl pl-4 pr-4 pt-4 pb-8 text-sm font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-neutral-300 min-h-[140px] shadow-sm"
                                placeholder="SEO description"
                                maxLength={160}
                            />
                            <span className="absolute right-4 bottom-3 text-[10px] font-black tracking-widest text-neutral-400">
                                {watch('seo_description')?.length || 0}/160
                            </span>
                        </div>
                    </Field>
                </div>

                {/* GOOGLE PREVIEW */}
                <div className="p-8 bg-neutral-50/50 rounded-[32px] border border-neutral-100 flex flex-col justify-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-300 mb-6 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        Google Search Preview
                    </p>
                    <div className="max-w-[500px]">
                        <div className="text-[13px] text-[#202124] flex items-center gap-1 mb-1 truncate opacity-70">
                            <span>https://easyd2c.in › products › </span>
                            <span className="font-medium">{slug}</span>
                        </div>
                        <h3 className="text-[19px] text-[#1a0dab] font-normal hover:underline cursor-pointer mb-2 leading-tight truncate">
                            {title}
                        </h3>
                        <p className="text-[13px] text-[#4d5156] leading-relaxed line-clamp-2">
                            {description}
                        </p>
                    </div>

                    <div className="mt-8 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                        <p className="text-[10px] text-blue-700 font-bold uppercase tracking-tight mb-2">Built-in Enhancements:</p>
                        <ul className="text-[10px] text-blue-600 font-medium space-y-1 list-disc list-inside">
                            <li>Automatic JSON-LD Schema (Rich Snippets)</li>
                            <li>OpenGraph & Twitter Cards generated</li>
                            <li>Images auto-named & converted to WebP</li>
                        </ul>
                    </div>
                </div>
            </div>
        </Card>
    )
}

export function ContentSection({ isOpen, onToggle }: { isOpen?: boolean; onToggle?: () => void }) {
    const { register, control, formState: { errors } } = useFormContext<ProductFormData>()

    return (
        <Card
            title="Product Page Content"
            subtitle="Detailed storefront presentation"
            icon={Sparkles}
            isOpen={isOpen}
            onToggle={onToggle}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <Field label="Star Rating (0–5)" error={errors.rating?.message}>
                    <div className="relative group">
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-400">★</span>
                        <input
                            {...register('rating', { valueAsNumber: true })}
                            type="number"
                            step="0.1"
                            max="5"
                            className="w-full bg-white border border-slate-300 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm"
                        />
                    </div>
                </Field>

                <Field label="Review Count" error={errors.review_count?.message}>
                    <input
                        {...register('review_count', { valueAsNumber: true })}
                        type="number"
                        className="w-full bg-white border border-neutral-300 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                    />
                </Field>
            </div>

            <div className="mb-10">
                <Label>Key highlights</Label>
                <p className="text-xs text-neutral-400 font-medium -mt-2 mb-6">
                    Bullet points shown next to the product main image.
                </p>

                <Controller
                    control={control}
                    name="highlights"
                    render={({ field }) => (
                        <div className="space-y-3">
                            {(field.value || []).map((h: string, i: number) => (
                                <div key={i} className="flex gap-4 group/item animate-in fade-in slide-in-from-left-2 duration-300">
                                    <div className="flex-1 relative">
                                        <input
                                            className="w-full bg-white border border-slate-300 rounded-2xl px-5 py-4 text-sm font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm"
                                            value={h}
                                            placeholder={`Highlight ${i + 1}`}
                                            onChange={e => {
                                                const newHighlights = [...(field.value || [])];
                                                newHighlights[i] = e.target.value;
                                                field.onChange(newHighlights);
                                            }}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newHighlights = (field.value || []).filter((_: any, idx: number) => idx !== i);
                                            field.onChange(newHighlights);
                                        }}
                                        className="w-12 h-default flex items-center justify-center border border-neutral-100 rounded-2xl hover:bg-red-50 hover:border-red-100 hover:text-red-500 transition-all text-neutral-400 font-bold"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => field.onChange([...(field.value || []), ''])}
                                className="w-full py-4 border-2 border-dashed border-neutral-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50/30 transition-all flex items-center justify-center gap-2 mt-4"
                            >
                                <span className="text-sm">+</span> Add highlight
                            </button>
                        </div>
                    )}
                />
            </div>

            <div>
                <Label>Detailed description</Label>
                <div className="flex items-center gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50 mb-6">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                        <BadgeInfo className="w-4 h-4" />
                    </div>
                    <p className="text-[11px] text-blue-800 leading-relaxed uppercase tracking-wide font-black">
                        Pro tip: Use H2 tags in the description to automatically generate interactive accordions on your storefront.
                    </p>
                </div>
                <Controller
                    control={control}
                    name="content_markup"
                    render={({ field }) => (
                        <div className="border border-neutral-300 rounded-[32px] overflow-hidden focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500 transition-all bg-white">
                            <Editor
                                value={field.value || ''}
                                onChange={field.onChange}
                                placeholder="Describe your product in detail..."
                            />
                        </div>
                    )}
                />
            </div>
        </Card>
    )
}

export function PaymentOptionsSection({ isOpen, onToggle }: { isOpen?: boolean; onToggle?: () => void }) {
    const { control, setValue, watch, register } = useFormContext<ProductFormData>()

    // Watch fields
    const useStoreSettings = watch('use_store_payment_settings')
    const cod = watch('cod_enabled')
    const prepaid = watch('prepaid_enabled')
    const cart = watch('cart_button_enabled')

    // Fetch store defaults when "Use Store Defaults" is ON
    const [storeDefaults, setStoreDefaults] = useState<{
        cod_enabled: boolean
        prepaid_enabled: boolean
        cart_button_enabled: boolean
        prepaid_discount_type: string
        prepaid_discount_value: number | null
    } | null>(null)
    const [loadingDefaults, setLoadingDefaults] = useState(false)

    useEffect(() => {
        if (!useStoreSettings) return
        const fetchDefaults = async () => {
            setLoadingDefaults(true)
            const { getActiveStoreIdClient } = await import('@/lib/getActiveStore.client')
            const storeId = getActiveStoreIdClient()
            if (!storeId) { setLoadingDefaults(false); return }

            const { supabaseBrowser } = await import('@/lib/supabase-browser')
            const { data } = await supabaseBrowser
                .from('stores')
                .select('cod_enabled, prepaid_enabled, cart_button_enabled, prepaid_discount_type, prepaid_discount_value')
                .eq('id', storeId)
                .single()

            if (data) setStoreDefaults(data as any)
            setLoadingDefaults(false)
        }
        fetchDefaults()
    }, [useStoreSettings])

    const validateToggles = (currentField: string, nextValue: boolean) => {
        const states: Record<string, boolean> = {
            cod_enabled: !!cod,
            prepaid_enabled: !!prepaid,
            cart_button_enabled: !!cart
        }
        states[currentField] = nextValue
        const activeCount = Object.values(states).filter(Boolean).length
        return activeCount >= 1
    }

    const ToggleRow = ({ name, title, sub, disabled }: { name: any, title: string, sub: string, disabled?: boolean }) => (
        <div className={`flex items-center justify-between p-6 rounded-[28px] border transition-all ${disabled ? 'bg-neutral-50 border-neutral-100 opacity-60' : 'bg-neutral-50/50 border-neutral-300 hover:bg-white'}`}>
            <div>
                <Label className="mb-0 text-neutral-900">{title}</Label>
                <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wide">{sub}</p>
            </div>
            <Controller
                control={control}
                name={name}
                render={({ field }) => (
                    <Switch
                        checked={!!field.value}
                        onCheckedChange={(val) => {
                            if (validateToggles(name, val)) {
                                field.onChange(val)
                            }
                        }}
                        disabled={disabled}
                    />
                )}
            />
        </div>
    )

    const StatusChip = ({ label, enabled }: { label: string; enabled: boolean }) => (
        <div className={`flex items-center justify-between p-5 rounded-2xl border ${enabled ? 'bg-green-50/80 border-green-200' : 'bg-red-50/80 border-red-200'}`}>
            <span className="text-sm font-bold text-neutral-800">{label}</span>
            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${enabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                {enabled ? 'Enabled' : 'Disabled'}
            </span>
        </div>
    )

    return (
        <Card
            title="Payment & Checkout"
            subtitle="Configure buttons and checkout behavior"
            icon={ShoppingCart}
            isOpen={isOpen}
            onToggle={onToggle}
            className={useStoreSettings ? "border-blue-100/50" : ""}
        >
            {/* OVERRIDE SWITCH */}
            <div className="flex items-center justify-between mb-8 p-6 bg-blue-50/50 rounded-[28px] border border-blue-100">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                        <Settings className="w-5 h-5" />
                    </div>
                    <div>
                        <Label className="mb-0 text-blue-900">Use Store Defaults</Label>
                        <p className="text-[10px] text-blue-600/70 font-bold uppercase tracking-wide">
                            {useStoreSettings ? "Currently inheriting store-wide settings" : "Custom payment configuration active"}
                        </p>
                    </div>
                </div>
                <Controller
                    control={control}
                    name="use_store_payment_settings"
                    render={({ field }) => (
                        <Switch
                            checked={!!field.value}
                            onCheckedChange={(val) => field.onChange(val)}
                        />
                    )}
                />
            </div>

            {/* Show store defaults (read-only) when toggle is ON */}
            {useStoreSettings ? (
                <div className="space-y-4">
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-widest mb-3">
                        Store-Level Defaults (Read-Only)
                    </p>
                    {loadingDefaults ? (
                        <p className="text-sm text-neutral-400 text-center py-4">Loading store settings…</p>
                    ) : storeDefaults ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <StatusChip label="Cash on Delivery" enabled={storeDefaults.cod_enabled} />
                            <StatusChip label="Prepaid Checkout" enabled={storeDefaults.prepaid_enabled} />
                            <StatusChip label="Add to Cart" enabled={storeDefaults.cart_button_enabled} />
                        </div>
                    ) : (
                        <p className="text-sm text-neutral-400 text-center py-4">Could not load store defaults.</p>
                    )}
                    {storeDefaults?.prepaid_enabled && storeDefaults?.prepaid_discount_value != null && storeDefaults.prepaid_discount_value > 0 && (
                        <div className="p-4 bg-orange-50/60 rounded-2xl border border-orange-100 mt-2">
                            <p className="text-xs font-bold text-orange-700 uppercase tracking-widest">
                                Prepaid Discount: {storeDefaults.prepaid_discount_type === 'percentage'
                                    ? `${storeDefaults.prepaid_discount_value}%`
                                    : `₹${storeDefaults.prepaid_discount_value}`
                                } off
                            </p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <ToggleRow name="cod_enabled" title="Cash on Delivery" sub="Enable COD button" />
                        <ToggleRow name="prepaid_enabled" title="Prepaid Checkout" sub="Enable Direct Payment" />
                        <ToggleRow name="cart_button_enabled" title="Add to Cart" sub="Enable cart workflow" />
                    </div>

                    {/* APPLICABLE PREPAID RULES (READ ONLY) */}
                    {prepaid && (
                        <div className="p-6 bg-orange-50/50 rounded-[28px] border border-orange-100 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-orange-600" />
                                    <h3 className="text-sm font-bold text-orange-900 uppercase tracking-wide">Applied Prepaid Rules</h3>
                                </div>
                                <Button
                                    onClick={() => window.open('/admin/discounts', '_blank')}
                                    variant="ghost"
                                    className="h-8 text-[10px] font-black uppercase tracking-widest text-orange-600 hover:text-orange-800 hover:bg-orange-100"
                                >
                                    Manage Rules <ArrowUpFromLine className="ml-1 w-3 h-3 rotate-45" />
                                </Button>
                            </div>

                            <p className="text-xs text-neutral-500 font-medium leading-relaxed">
                                Prepaid discounts are now centrally managed. Any Store-Wide or matching Collection/Product rules will apply automatically.
                            </p>

                            <div className="bg-white rounded-xl border border-orange-200 p-4">
                                <div className="flex items-center gap-2 text-xs font-bold text-orange-800">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    System will automatically calculate the best discount at checkout.
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="pt-6 border-t border-slate-100 flex items-center justify-between p-6 bg-indigo-50/50 rounded-[28px] border border-indigo-100 mt-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
                                <Banknote className="w-5 h-5" />
                            </div>
                            <div>
                                <Label className="mb-0 text-indigo-900">Standard Partial COD</Label>
                                <p className="text-[10px] text-indigo-600/70 font-bold uppercase tracking-wide">
                                    {watch('partial_cod_enabled') ? "Custom partial payment active" : "Inheriting store/RTO rules"}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col items-end gap-1 mr-2">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Use Store Policy</span>
                                <Controller
                                    control={control}
                                    name="use_store_partial_settings"
                                    render={({ field }) => (
                                        <Switch
                                            checked={!!field.value}
                                            onCheckedChange={(val) => field.onChange(val)}
                                        />
                                    )}
                                />
                            </div>
                            {!watch('use_store_partial_settings') && (
                                <div className="flex flex-col items-end gap-1">
                                    <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Force Partial</span>
                                    <Controller
                                        control={control}
                                        name="partial_cod_enabled"
                                        render={({ field }) => (
                                            <Switch
                                                checked={!!field.value}
                                                onCheckedChange={(val) => field.onChange(val)}
                                            />
                                        )}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <p className="mt-2 text-[10px] text-neutral-400 font-bold uppercase tracking-widest text-center italic">
                        * At least one payment or cart button must be active.
                    </p>
                </div>
            )}
        </Card>
    )
}

export function TrustSignalsSection({ isOpen, onToggle }: { isOpen?: boolean; onToggle?: () => void }) {
    const params = useParams()
    const { control, watch, setValue, register } = useFormContext<ProductFormData>()
    const testimonials = watch('testimonials') || []

    return (
        <Card
            title="Trust & Authority Suite"
            subtitle="Build instant buyer confidence with specialized badges and value props"
            icon={ShieldCheck}
            isOpen={isOpen}
            onToggle={onToggle}
            className="border-blue-100/50"
        >
            <div className="space-y-6">
                <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100/50 flex gap-3 items-start">
                    <Sparkles className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                    <div className="space-y-2">
                        <p className="text-[11px] font-bold text-orange-900 leading-relaxed uppercase tracking-tight">
                            <span className="text-orange-600">Mkt Pro Tip:</span> Use at least 2 indicators for "Social Proof" & "Risk Reversal".
                        </p>
                        <p className="text-[10px] text-neutral-500 font-medium italic">
                            Examples: "Secure Checkouts" (Trust), "5-Day Easy Returns" (Risk Reversal), "Free Shipping" (Incentive).
                        </p>
                    </div>
                </div>

                {/* 1. NATIVE TRUST INDICATORS */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label className="mb-0">Native Trust Badges</Label>
                        <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest bg-neutral-100 px-2 py-0.5 rounded-full">Max 4 items</span>
                    </div>
                    <Controller
                        control={control}
                        name="trust_indicators"
                        render={({ field }) => {
                            const indicators = (field.value || []).slice(0, 4)

                            // Pre-populate if empty
                            React.useEffect(() => {
                                if (indicators.length === 0) {
                                    field.onChange([
                                        { icon: 'RotateCcw', text: '5-Days Free Returns' },
                                        { icon: 'Truck', text: 'Free Doorstep Delivery' },
                                        { icon: 'ShieldCheck', text: 'Safe & Secure Payments' }
                                    ])
                                }
                            }, [])

                            const add = () => {
                                if (indicators.length >= 4) return
                                field.onChange([...indicators, { icon: 'BadgeCheck', text: 'New Indicator' }])
                            }

                            return (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {(indicators || []).map((item: any, idx: number) => (
                                        <div key={idx} className="flex gap-4 p-5 bg-white rounded-2xl border border-neutral-300 group transition-all hover:border-blue-200 shadow-sm">
                                            <div className="relative group/icon transition-all">
                                                <div className="w-10 h-10 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-400 group-hover:text-blue-500 transition-colors cursor-pointer">
                                                    {React.createElement((TRUST_ICONS as any)[item.icon] || BadgeCheck, { className: "w-5 h-5" })}
                                                </div>
                                                <div className="absolute left-0 top-full mt-2 p-2 bg-white border border-neutral-200 rounded-xl shadow-xl z-50 opacity-0 invisible group-hover/icon:opacity-100 group-hover/icon:visible transition-all grid grid-cols-5 gap-1 min-w-[170px]">
                                                    {Object.entries(TRUST_ICONS).map(([iconName, IconComponent]) => (
                                                        <button
                                                            key={iconName}
                                                            type="button"
                                                            onClick={() => {
                                                                const next = [...indicators]
                                                                next[idx].icon = iconName
                                                                field.onChange(next)
                                                            }}
                                                            className={`p-2 rounded-lg hover:bg-neutral-50 transition-colors ${item.icon === iconName ? 'text-blue-600 bg-blue-50' : 'text-neutral-400'}`}
                                                        >
                                                            <IconComponent className="w-4 h-4" />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <input
                                                className="flex-1 bg-transparent border-none text-sm font-bold text-neutral-900 focus:ring-0 outline-none p-0"
                                                value={item.text}
                                                placeholder="Indicator text..."
                                                onChange={(e) => {
                                                    const next = [...indicators]
                                                    next[idx].text = e.target.value
                                                    field.onChange(next)
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => field.onChange(indicators.filter((_: any, i: number) => i !== idx))}
                                                className="text-neutral-300 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-all font-bold"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                    {indicators.length < 4 && (
                                        <button
                                            type="button"
                                            onClick={add}
                                            className="flex items-center justify-center gap-2 p-5 border-2 border-dashed border-neutral-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:border-blue-200 hover:text-blue-600 transition-all hover:bg-white shadow-sm"
                                        >
                                            <PlusCircle className="w-4 h-4" /> Add Indicator
                                        </button>
                                    )}
                                </div>
                            )
                        }}
                    />
                </div>

                {/* SECONDARY TRUST STRIP (IMAGE) */}
                <div className="pt-8 border-t border-neutral-200/50 space-y-4">
                    <div className="flex items-center gap-2">
                        <Label className="mb-0">Secondary Trust Strip (Image)</Label>
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-full">New</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 font-medium">
                        Upload a custom trust badge image (e.g., PayU Secure Payments) to show below the CTA stack.
                    </p>
                    <Controller
                        control={control}
                        name="trust_strip_image_url"
                        render={({ field }) => (
                            <TrustStripUpload
                                value={field.value}
                                onChange={field.onChange}
                                productId={params.id as string}
                                productTitle={watch('title')}
                            />
                        )}
                    />
                </div>

                {/* 2. CUSTOMER TESTIMONIALS */}
                <div className="pt-8 border-t border-neutral-200/50">
                    <TestimonialsBlock
                        testimonials={testimonials}
                        setTestimonials={(t) => setValue('testimonials', t, { shouldDirty: true })}
                    />
                </div>
            </div>
        </Card>
    )
}

export function QuantityBreaksSection({ isOpen, onToggle }: { isOpen?: boolean; onToggle?: () => void }) {
    const { watch, control, setValue, register } = useFormContext<ProductFormData>()
    const price = watch('price') || 0
    const cogs = watch('cogs') || 0
    const shipping = watch('shipping_cost_estimate') || 0
    const gateway = watch('gateway_fee') || 0
    const adCost = watch('base_ad_cost') || 0

    return (
        <Card
            title="Quantity Breaks & Bundles"
            subtitle="Tiered discounts for multi-buys"
            icon={Layers}
            isOpen={isOpen}
            onToggle={onToggle}
        >
            {/* 1. QUANTITY BREAKS */}

            <div className="flex items-center justify-between mb-8 p-6 bg-blue-50/50 rounded-[28px] border border-blue-100">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                        <Package className="w-5 h-5" />
                    </div>
                    <div>
                        <Label className="mb-0 text-blue-900">Activate Quantity Breaks</Label>
                        <p className="text-[10px] text-blue-600/70 font-bold uppercase tracking-wide italic">Strict 3-tier structure</p>
                    </div>
                </div>
                <Controller
                    control={control}
                    name="bundle_settings.enabled"
                    render={({ field }) => (
                        <Switch
                            checked={!!field.value}
                            onCheckedChange={(val) => {
                                field.onChange(val)
                                // Pre-populate if missing
                                const tiers = watch('bundle_settings.tiers' as any)
                                if (val && (!tiers || tiers.length === 0)) {
                                    setValue('bundle_settings.tiers' as any, [
                                        { qty: 1, discount: 0, label: 'Pack of 1' },
                                        { qty: 2, discount: 10, label: 'Pack of 2' },
                                        { qty: 3, discount: 20, label: 'Pack of 3' }
                                    ])
                                    setValue('bundle_settings.most_popular_index' as any, 1)
                                }
                            }}
                        />
                    )}
                />
            </div>

            {watch('bundle_settings.enabled') && (
                <div className="space-y-6">
                    <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100/50 flex gap-3 items-start">
                        <Sparkles className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                        <p className="text-[11px] font-bold text-orange-900 leading-relaxed uppercase tracking-tight">
                            <span className="text-orange-600">Pro-Tip:</span> Use 3 tiers to leverage the "Decoy Effect". Mark the Tier 2 (Pack of 2) as Most Popular to anchor the customer's choice toward higher AOV.
                        </p>
                    </div>
                    {[0, 1, 2].map((idx) => {
                        const qty = watch(`bundle_settings.tiers.${idx}.qty` as any) || 1
                        const discount = watch(`bundle_settings.tiers.${idx}.discount` as any) || 0
                        const revenue = price * qty * (1 - discount / 100)
                        const totalCogs = cogs * qty
                        const totalShipping = shipping * qty
                        const totalAdCost = adCost * qty
                        // Gateway fee is typically % of revenue, but we'll use the unit estimate * qty for now to match CoreSection logic
                        const totalGateway = gateway * qty

                        const profit = revenue - (totalCogs + totalShipping + totalAdCost + totalGateway)

                        return (
                            <div key={idx} className="p-8 bg-white rounded-[32px] border border-neutral-300 transition-all hover:border-blue-300 relative group shadow-sm">
                                <div className="absolute -top-3 left-8 px-4 py-1 bg-neutral-900 text-white rounded-full text-[9px] font-black uppercase tracking-widest">
                                    Tier {idx + 1}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                    <Field label="Pack Name">
                                        <input
                                            {...register(`bundle_settings.tiers.${idx}.label` as any)}
                                            className="w-full bg-transparent border-none p-0 text-sm font-bold focus:ring-0 outline-none"
                                        />
                                    </Field>
                                    <Field label="Quantity">
                                        <input
                                            {...register(`bundle_settings.tiers.${idx}.qty` as any, { valueAsNumber: true })}
                                            type="number"
                                            className="w-full bg-transparent border-none p-0 text-sm font-black focus:ring-0 outline-none"
                                        />
                                    </Field>
                                    <Field label="Discount %">
                                        <div className="relative">
                                            <input
                                                {...register(`bundle_settings.tiers.${idx}.discount` as any, { valueAsNumber: true })}
                                                type="number"
                                                className="w-full bg-transparent border-none p-0 text-sm font-black focus:ring-0 outline-none"
                                            />
                                            <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] font-black text-neutral-400">%</span>
                                        </div>
                                    </Field>
                                    <div className="flex flex-col justify-center gap-1">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Gross Profit</span>
                                        <div className={`text-sm font-black ${profit > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                            ₹{profit.toLocaleString()}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 pt-5 border-t border-neutral-100 flex items-center justify-between">
                                    <label className="flex items-center gap-3 cursor-pointer group/popular select-none">
                                        <div className="relative flex items-center justify-center">
                                            <input
                                                type="radio"
                                                name="most_popular"
                                                checked={watch('bundle_settings.most_popular_index' as any) === idx}
                                                onChange={() => setValue('bundle_settings.most_popular_index' as any, idx, { shouldDirty: true })}
                                                className="peer appearance-none w-5 h-5 border-2 border-neutral-300 bg-neutral-50/50 rounded-full checked:border-blue-600 checked:bg-white transition-all focus:ring-4 focus:ring-blue-500/10 cursor-pointer"
                                            />
                                            <div className="absolute w-2 h-2 rounded-full bg-blue-600 scale-0 peer-checked:scale-100 transition-transform duration-200 pointer-events-none" />
                                        </div>
                                        <span className={`text-[11px] font-black uppercase tracking-widest transition-colors ${watch('bundle_settings.most_popular_index' as any) === idx ? 'text-blue-600' : 'text-neutral-400 group-hover/popular:text-neutral-600'}`}>
                                            Highlight as Most Popular
                                        </span>
                                    </label>
                                </div>
                            </div>
                        )
                    })}
                    <p className="text-[10px] text-center text-neutral-400 font-bold uppercase tracking-widest">
                        * Strictly 3 tiers required for conversion optimization
                    </p>
                </div>
            )}
        </Card>
    )
}

export function CrossSellSection({ isOpen, onToggle }: { isOpen?: boolean; onToggle?: () => void }) {
    const { register } = useFormContext<ProductFormData>()

    return (
        <Card
            title="Cross-sell Recommendations"
            subtitle="Suggest companion products"
            icon={ShoppingCart}
            isOpen={isOpen}
            onToggle={onToggle}
        >
            <div className="space-y-6">
                <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-100/50 flex gap-3 items-start">
                    <Sparkles className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
                    <p className="text-[11px] font-bold text-purple-900 leading-relaxed uppercase tracking-tight">
                        <span className="text-purple-600">Strategy:</span> Suggesting companion products increases Average Order Value (AOV) by providing a complete solution to the customer.
                    </p>
                </div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <Label className="uppercase tracking-widest text-neutral-400 font-black flex items-center gap-2 mb-0">
                        <ShoppingCart className="w-4 h-4" /> Section Title
                    </Label>
                    <div className="flex-1 max-w-sm">
                        <input
                            {...register('related_products_title')}
                            placeholder="Section Title (e.g. People also bought)"
                            className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-2 text-xs font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                        />
                    </div>
                </div>
                <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest italic opacity-70">
                    * Selected products will appear as high-converting recommendations on the Product Page
                </p>
                <div className="space-y-4">
                    <CrossSellSelector />
                </div>
            </div>
        </Card>
    )
}

export function UrgencySection({ isOpen, onToggle }: { isOpen?: boolean; onToggle?: () => void }) {
    const { register, watch, control } = useFormContext<ProductFormData>()
    const urgencyType = watch('urgency_settings.type')

    return (
        <Card
            title="Conversion Velocity (Urgency)"
            subtitle="Use scarcity and social proof to drive faster purchase decisions"
            icon={Zap}
            isOpen={isOpen}
            onToggle={onToggle}
            className="border-orange-100/50"
        >
            <div className="space-y-6">
                <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100/50 flex gap-3 items-start">
                    <Zap className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                    <p className="text-[11px] font-bold text-orange-900 leading-relaxed uppercase tracking-tight">
                        <span className="text-orange-600">Warning:</span> Use urgency sparingly. Authentic scarcity (low stock) works better than fake timers.
                    </p>
                </div>

                <div className="flex items-center justify-between p-6 bg-orange-50/50 rounded-[28px] border border-orange-200">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                            <Clock className="w-5 h-5" />
                        </div>
                        <div>
                            <Label className="mb-0 text-orange-900">Enable Urgency Suite</Label>
                            <p className="text-[10px] text-orange-600/70 font-bold uppercase tracking-wide">Display countdowns or live stock</p>
                        </div>
                    </div>
                    <Controller
                        control={control}
                        name="urgency_settings.enabled"
                        render={({ field }) => (
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Field label="Social Proof Type">
                        <div className="relative group">
                            <select
                                {...register('urgency_settings.type')}
                                className="w-full bg-white border border-neutral-300 rounded-2xl px-4 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none appearance-none transition-all cursor-pointer"
                            >
                                <option value="countdown">⏳ Countdown Timer</option>
                                <option value="low_stock">🔥 Low Stock Alert</option>
                                <option value="recent_view">👁️ Live Viewers count</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
                                <Settings className="w-4 h-4" />
                            </div>
                        </div>
                    </Field>

                    {urgencyType === 'countdown' && (
                        <Field label="Reset Cycle (Minutes)">
                            <input
                                {...register('urgency_settings.config.minutes' as any, { valueAsNumber: true })}
                                type="number"
                                className="w-full bg-white border border-neutral-300 rounded-2xl px-4 py-4 text-sm font-black focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                            />
                        </Field>
                    )}

                    {urgencyType === 'low_stock' && (
                        <Field label="Lower Bound (Stock Left)">
                            <input
                                {...register('urgency_settings.config.stock' as any, { valueAsNumber: true })}
                                type="number"
                                className="w-full bg-white border border-neutral-300 rounded-2xl px-4 py-4 text-sm font-black focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                                placeholder="e.g. 5"
                            />
                        </Field>
                    )}

                    {urgencyType === 'recent_view' && (
                        <Field label="Viewers Count">
                            <input
                                {...register('urgency_settings.config.viewers' as any, { valueAsNumber: true })}
                                type="number"
                                className="w-full bg-white border border-neutral-300 rounded-2xl px-4 py-4 text-sm font-black focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                                placeholder="e.g. 15"
                            />
                        </Field>
                    )}
                </div>
            </div>
        </Card>
    )
}


export function VariantsSection({ isOpen, onToggle }: { isOpen?: boolean; onToggle?: () => void }) {
    const { control, watch, setValue, getValues } = useFormContext<ProductFormData>()
    const hasVariants = watch('has_variants')
    const options = watch('variant_options') || []
    const variants = watch('variants') || []

    // Automatic Variant Generation
    React.useEffect(() => {
        if (!hasVariants) return

        // If no options, clear variants
        if (!options || options.length === 0) {
            if (variants.length > 0) setValue('variants', [])
            return
        }

        // Debounce slightly to avoid rapid updates while typing
        const timeoutId = setTimeout(() => {
            const currentVariants = getValues('variants') || []
            const currentPrice = getValues('price') || 0
            const currentMrp = getValues('mrp') || 0
            const currentCogs = getValues('cogs') || 0
            const currentQty = getValues('qty') || 100
            const currentLocation = getValues('location') || ''

            // 1. Generate all possible combinations
            let combinations: any[] = [[]]
            options.forEach(option => {
                if (!option.name) return // Skip empty names
                const newCombinations: any[] = []
                const values = option.values.length > 0 ? option.values : []

                // If an option has no values yet, we can't generate full combinations
                // But we should treat it as "pending". 
                // For now, let's only generate if values exist, or if we want to show partials.
                // Standard behavior: only generate if values exist.
                if (values.length > 0) {
                    values.forEach((value: string) => {
                        combinations.forEach(combo => {
                            newCombinations.push([...combo, { name: option.name, value }])
                        })
                    })
                    combinations = newCombinations
                }
            })

            // If we have options but no values, combinations might be empty or just [[]]
            if (combinations.length === 1 && combinations[0].length === 0) {
                // No valid combinations yet
                return
            }

            // 2. Merge with existing
            const newVariants = combinations.map((combo) => {
                const attributes = combo.reduce((acc: any, curr: any) => ({ ...acc, [curr.name]: curr.value }), {})
                const title = combo.map((c: any) => c.value).join(' / ')

                // Find match by attributes (composite key)
                const existing = currentVariants.find((v: any) => {
                    const vAttrs = v.attributes || {}
                    const keysA = Object.keys(attributes)
                    const keysB = Object.keys(vAttrs)
                    if (keysA.length !== keysB.length) return false
                    return keysA.every(key => vAttrs[key] === attributes[key])
                })

                if (existing) return existing

                return {
                    title,
                    price: currentPrice,
                    mrp: currentMrp,
                    sku: '',
                    inventory: currentQty,
                    location: currentLocation,
                    cogs: currentCogs,
                    attributes
                }
            })

            // Deep equality check to prevent infinite loops (simple JSON stringify for now)
            if (JSON.stringify(newVariants) !== JSON.stringify(currentVariants)) {
                setValue('variants', newVariants)
            }
        }, 500)

        return () => clearTimeout(timeoutId)
    }, [options, hasVariants])

    return (
        <Card
            title="Product Variants"
            subtitle="Options like size or color"
            icon={Layers}
            isOpen={isOpen}
            onToggle={onToggle}
        >
            <div className="flex items-center justify-between mb-10 p-5 bg-purple-50/50 rounded-2xl border border-purple-100">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                        <Settings className="w-5 h-5" />
                    </div>
                    <div>
                        <Label className="mb-0">Enable Variants</Label>
                        <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wide">For products with multiple sizes or colors</p>
                    </div>
                </div>
                <Controller
                    control={control}
                    name="has_variants"
                    render={({ field }) => (
                        <Switch checked={!!field.value} onCheckedChange={field.onChange} />
                    )}
                />
            </div>

            {hasVariants && (
                <div className="space-y-12 animate-in fade-in slide-in-from-top-4 duration-500">
                    {/* OPTION TYPES */}
                    <div className="space-y-6">
                        <Label className="text-[11px] uppercase tracking-widest text-neutral-400 font-black">Variant Options</Label>
                        <Controller
                            control={control}
                            name="variant_options"
                            render={({ field }) => (
                                <div className="space-y-6">
                                    {(field.value as any[] || []).map((opt: any, i: number) => (
                                        <div key={i} className="p-8 bg-neutral-50/50 rounded-[32px] border border-neutral-100 transition-all hover:bg-white hover:shadow-sm">
                                            <div className="flex items-center justify-between mb-6">
                                                <div className="flex items-center gap-3">
                                                    <span className="w-6 h-6 rounded-full bg-neutral-900 text-white text-[10px] font-black flex items-center justify-center">{i + 1}</span>
                                                    <div className="flex-1">
                                                        <Label className="text-[10px] text-neutral-400 font-bold mb-1.5 block">Option Name</Label>
                                                        <input
                                                            value={opt.name}
                                                            onChange={(e) => {
                                                                const newOptions = [...(field.value as any[] || [])]
                                                                newOptions[i].name = e.target.value
                                                                field.onChange(newOptions)
                                                            }}
                                                            placeholder="e.g. Size, Color, Material"
                                                            className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-2.5 text-sm font-bold text-neutral-900 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all placeholder:text-neutral-300"
                                                        />
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newOptions = (field.value as any[] || []).filter((_: any, idx: number) => idx !== i)
                                                        field.onChange(newOptions)
                                                    }}
                                                    className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-400 hover:bg-red-50 hover:text-red-600 transition-all"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                {opt.values.map((val: string, j: number) => (
                                                    <div key={j} className="group relative">
                                                        <span className="inline-flex items-center px-4 py-2 bg-white border border-neutral-200 rounded-xl text-xs font-bold text-neutral-700 shadow-sm transition-all group-hover:border-neutral-900 group-hover:pr-10">
                                                            {val}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newOptions = [...(field.value as any[] || [])]
                                                                newOptions[i].values = opt.values.filter((_: any, idx: number) => idx !== j)
                                                                field.onChange(newOptions)
                                                            }}
                                                            className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                                <div className="relative group flex items-center gap-2">
                                                    <input
                                                        id={`variant-input-${i}`}
                                                        placeholder="Add value..."
                                                        className="w-32 bg-white border border-dashed border-neutral-200 rounded-xl px-4 py-2 text-xs font-medium outline-none transition-all focus:border-solid focus:border-blue-500 focus:w-48"
                                                        onKeyDown={(e: any) => {
                                                            if (e.key === 'Enter') {
                                                                e.preventDefault()
                                                                const val = e.target.value.trim()
                                                                if (val) {
                                                                    const newOptions = [...(field.value as any[] || [])]
                                                                    if (!newOptions[i].values.includes(val)) {
                                                                        newOptions[i].values.push(val)
                                                                        field.onChange(newOptions)
                                                                    }
                                                                    e.target.value = ''
                                                                }
                                                            }
                                                        }}
                                                        onBlur={(e) => {
                                                            const val = e.target.value.trim()
                                                            if (val) {
                                                                const newOptions = [...(field.value as any[] || [])]
                                                                // Prevent duplicates
                                                                if (!newOptions[i].values.includes(val)) {
                                                                    newOptions[i].values.push(val)
                                                                    field.onChange(newOptions)
                                                                }
                                                                e.target.value = ''
                                                            }
                                                        }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const input = document.getElementById(`variant-input-${i}`) as HTMLInputElement
                                                            if (input) {
                                                                const val = input.value.trim()
                                                                if (val) {
                                                                    const newOptions = [...(field.value as any[] || [])]
                                                                    if (!newOptions[i].values.includes(val)) {
                                                                        newOptions[i].values.push(val)
                                                                        field.onChange(newOptions)
                                                                    }
                                                                    input.value = ''
                                                                    input.focus()
                                                                }
                                                            }
                                                        }}
                                                        className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-400 hover:bg-blue-50 hover:text-blue-600 transition-all opacity-0 group-hover:opacity-100"
                                                        title="Add Value"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => field.onChange([...(field.value || []), { name: '', values: [] }])}
                                        className="w-full py-5 border-2 border-dashed border-neutral-100 rounded-3xl text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50/30 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" /> Add Option Type
                                    </button>
                                </div>
                            )}
                        />
                    </div>

                    {/* VARIANT TABLE */}
                    <div className="space-y-8 pt-8 border-t border-neutral-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label className="text-[11px] uppercase tracking-widest text-neutral-400 font-black mb-1">Generated Variants</Label>
                                <p className="text-[10px] text-neutral-500 font-bold uppercase">Pricing and inventory per combination</p>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-[10px] font-bold uppercase tracking-wide border border-green-100">
                                <RefreshCw className="w-3 h-3" />
                                Auto-sync active
                            </div>
                        </div>

                        <div className="bg-white border border-neutral-100 rounded-[32px] overflow-hidden">
                            <table className="w-full border-collapse">
                                <thead className="bg-neutral-50/50 border-b border-neutral-100">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-[9px] font-black text-neutral-400 uppercase tracking-widest">Variant</th>
                                        <th className="px-6 py-4 text-left text-[9px] font-black text-neutral-400 uppercase tracking-widest">Price</th>
                                        <th className="px-6 py-4 text-left text-[9px] font-black text-neutral-400 uppercase tracking-widest">Inventory</th>
                                        <th className="px-6 py-4 text-left text-[9px] font-black text-neutral-400 uppercase tracking-widest">Location</th>
                                        <th className="px-6 py-4 text-left text-[9px] font-black text-neutral-400 uppercase tracking-widest">SKU</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {variants.map((v, idx) => (
                                        <tr key={idx} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/30 transition-colors">
                                            <td className="px-6 py-5">
                                                <span className="text-[11px] font-black text-neutral-900 uppercase tracking-tight">{v.title}</span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="relative">
                                                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[9px] font-black text-neutral-400">₹</span>
                                                    <input
                                                        type="number"
                                                        value={v.price}
                                                        onChange={e => {
                                                            const newVal = [...variants];
                                                            newVal[idx].price = Number(e.target.value);
                                                            setValue('variants', newVal);
                                                        }}
                                                        className="w-24 bg-transparent border border-neutral-200 rounded-lg pl-12 pr-2 py-1.5 text-xs font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <input
                                                    type="number"
                                                    value={v.inventory}
                                                    onChange={e => {
                                                        const newVal = [...variants];
                                                        newVal[idx].inventory = Number(e.target.value);
                                                        setValue('variants', newVal);
                                                    }}
                                                    className="w-20 bg-transparent border border-neutral-200 rounded-lg px-2 py-1.5 text-xs font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                                                />
                                            </td>
                                            <td className="px-6 py-5">
                                                <input
                                                    value={v.location}
                                                    onChange={e => {
                                                        const newVal = [...variants];
                                                        newVal[idx].location = e.target.value;
                                                        setValue('variants', newVal);
                                                    }}
                                                    placeholder="Warehouse-A"
                                                    className="w-28 bg-transparent border border-neutral-200 rounded-lg px-2 py-1.5 text-xs font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                                                />
                                            </td>
                                            <td className="px-6 py-5">
                                                <input
                                                    value={v.sku}
                                                    onChange={e => {
                                                        const newVal = [...variants];
                                                        newVal[idx].sku = e.target.value;
                                                        setValue('variants', newVal);
                                                    }}
                                                    placeholder="SKU-123"
                                                    className="w-24 bg-transparent border border-neutral-200 rounded-lg px-3 py-1.5 text-[10px] font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all uppercase placeholder:normal-case"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                    {variants.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center">
                                                <p className="text-xs font-bold text-neutral-300 uppercase tracking-widest italic">No variants generated yet</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </Card>
    )
}

export function CrossSellSelector() {
    const { watch, setValue, control } = useFormContext<ProductFormData>()
    const params = useParams()
    const [searchTerm, setSearchTerm] = React.useState('')
    const [allProducts, setAllProducts] = React.useState<any[]>([])
    const [loading, setLoading] = React.useState(false)

    React.useEffect(() => {
        const load = async () => {
            setLoading(true)

            // 1. Determine Store ID
            let storeId = ''
            if (params.id && params.id !== 'new') {
                const { data: currentProd } = await supabaseBrowser
                    .from('products')
                    .select('store_id')
                    .eq('id', params.id)
                    .single()
                storeId = currentProd?.store_id
            } else {
                // New product -> use active store credential
                const { getActiveStoreIdClient } = await import('@/lib/getActiveStore.client')
                storeId = getActiveStoreIdClient() || ''
            }

            if (!storeId) {
                setLoading(false)
                return
            }

            // 2. Fetch Candidates from SAME STORE only
            const { data, error: productError } = await supabaseBrowser
                .from('products')
                .select('id, title, price, images')
                .eq('store_id', storeId)
                .neq('id', params.id) // Exclude self
                .eq('status', 'published') // Only published

            if (productError) {
                console.error('--- Product Load Failure ---', productError)
            }
            if (data) setAllProducts(data)
            setLoading(false)
        }
        load()
    }, [params.id])

    return (
        <Controller
            control={control}
            name="bundle_settings.cross_sell_ids"
            render={({ field }) => {
                const selectedIds = (field.value as string[]) || []

                const toggle = (id: string) => {
                    const current = [...(selectedIds as string[])]
                    const idx = current.indexOf(id)
                    if (idx > -1) current.splice(idx, 1)
                    else current.push(id)
                    field.onChange(current)
                }

                return (
                    <div className="space-y-6">
                        <div className="relative group">
                            <input
                                placeholder="Search products to cross-sell..."
                                className="w-full bg-white border border-neutral-200 rounded-2xl px-4 py-3 text-sm font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-neutral-300"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto p-2 scrollbar-hide">
                            {allProducts
                                .filter(p => !searchTerm || p.title.toLowerCase().includes(searchTerm.toLowerCase()))
                                .map(product => {
                                    const isSelected = (selectedIds as string[]).includes(product.id)
                                    const img = product.image_url || product.images?.[0]
                                    return (
                                        <button
                                            key={product.id}
                                            type="button"
                                            onClick={() => toggle(product.id)}
                                            className={`flex items-center gap-4 p-4 rounded-2xl border transition-all text-left group ${isSelected ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white border-neutral-100 hover:border-blue-200 hover:bg-neutral-50'}`}
                                        >
                                            <div className="w-12 h-12 rounded-xl bg-neutral-100 overflow-hidden flex-shrink-0 border border-neutral-50/10">
                                                {img && <img src={img} alt="" className="w-full h-full object-cover" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-[11px] font-black uppercase tracking-tight truncate ${isSelected ? 'text-white' : 'text-neutral-900 group-hover:text-blue-600'}`}>
                                                    {product.title}
                                                </p>
                                                <p className={`text-[10px] font-bold ${isSelected ? 'text-blue-100' : 'text-neutral-400'}`}>
                                                    ₹{product.price}
                                                </p>
                                            </div>
                                            {isSelected && (
                                                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                                                    <Plus className="w-3 h-3 text-white rotate-45" />
                                                </div>
                                            )}
                                        </button>
                                    )
                                })}
                        </div>

                        {allProducts.length === 0 && !loading && (
                            <div className="p-12 border border-dashed rounded-[32px] text-center">
                                <p className="text-xs font-bold text-neutral-300 uppercase tracking-widest italic">No other products found</p>
                            </div>
                        )}
                    </div>
                )
            }}
        />
    )
}

export function ShippingSection({ isOpen, onToggle }: { isOpen?: boolean; onToggle?: () => void }) {
    const { control, register } = useFormContext<ProductFormData>()

    return (
        <Card
            title="Shipping & Delivery"
            subtitle="Configure delivery estimates"
            icon={Truck}
            isOpen={isOpen}
            onToggle={onToggle}
        >
            <div className="flex items-center justify-between p-6 bg-blue-50/50 rounded-[28px] border border-blue-100">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                        <Truck className="w-5 h-5" />
                    </div>
                    <div>
                        <Label className="mb-0 text-blue-900">Show Estimated Delivery</Label>
                        <p className="text-[10px] text-blue-600/70 font-bold uppercase tracking-wide">
                            Display "Get it by [Date]" on product page
                        </p>
                    </div>
                </div>
                <Controller
                    control={control}
                    name="show_estimated_delivery"
                    render={({ field }) => (
                        <Switch
                            checked={!!field.value}
                            onCheckedChange={field.onChange}
                        />
                    )}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <Field label="Physical Weight (grams)">
                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-2">Used for Partial COD shipping rates</p>
                    <div className="relative group">
                        <input
                            {...register('weight_grams', { valueAsNumber: true })}
                            type="number"
                            className="w-full bg-white border border-slate-300 rounded-2xl px-5 py-4 text-sm font-black focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm"
                            placeholder="e.g. 500"
                        />
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-slate-300">g</div>
                    </div>
                </Field>
            </div>

            <p className="mt-8 text-[10px] text-neutral-400 font-bold uppercase tracking-widest text-center italic">
                * Delivery dates are calculated using global store settings based on handling & transit time.
            </p>
        </Card>
    )
}
