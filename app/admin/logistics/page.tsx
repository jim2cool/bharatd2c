'use client'

import { getActiveStoreIdClient } from "@/lib/getActiveStore.client"

import { useState, useEffect } from 'react'
import { Truck, Package, Globe, ExternalLink, ShieldCheck, Save, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { supabaseBrowser } from "@/lib/supabase-browser"
import { toast } from "sonner"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

// Schema
const shippingSettingsSchema = z.object({
    is_edd_enabled: z.boolean(),
    edd_mode: z.enum(['detailed', 'compact']),
    handling_time_min: z.coerce.number().min(0, "Min 0 days"),
    handling_time_max: z.coerce.number().min(0, "Min 0 days"),
    transit_time_min: z.coerce.number().min(0, "Min 0 days"),
    transit_time_max: z.coerce.number().min(0, "Min 0 days"),
    free_shipping_threshold: z.coerce.number().min(0, "Cannot be negative"),
})

type ShippingSettingsFormValues = z.infer<typeof shippingSettingsSchema>

export default function LogisticsPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const supabase = supabaseBrowser

    const form = useForm<any>({
        resolver: zodResolver(shippingSettingsSchema),
        defaultValues: {
            is_edd_enabled: true,
            edd_mode: 'detailed',
            handling_time_min: 1,
            handling_time_max: 2,
            transit_time_min: 4,
            transit_time_max: 7,
            free_shipping_threshold: 499,
        },
    })

    // Fetch Settings
    useEffect(() => {
        const fetchSettings = async () => {
            setLoading(true)
            const storeId = getActiveStoreIdClient()
            if (!storeId) return

            const { data, error } = await supabase
                .from('shipping_settings')
                .select('*')
                .eq('store_id', storeId)
                .single()

            if (data) {
                form.reset({
                    is_edd_enabled: data.is_edd_enabled,
                    edd_mode: data.edd_mode || 'detailed',
                    handling_time_min: data.handling_time_min,
                    handling_time_max: data.handling_time_max,
                    transit_time_min: data.transit_time_min,
                    transit_time_max: data.transit_time_max,
                    free_shipping_threshold: data.free_shipping_threshold,
                })
            }
            setLoading(false)
        }

        fetchSettings()
    }, [form])

    const onSubmit = async (values: ShippingSettingsFormValues) => {
        setSaving(true)
        try {
            const storeId = getActiveStoreIdClient()
            if (!storeId) {
                toast.error("Store ID not found")
                return
            }

            const { error } = await supabase
                .from('shipping_settings')
                .upsert({
                    store_id: storeId,
                    ...values
                })

            if (error) throw error

            toast.success("Details saved successfully")
        } catch (error) {
            console.error('Error saving settings:', error)
            toast.error("Failed to save settings")
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-20">
            <header className="flex items-end justify-between border-b pb-6">
                <div>
                    <h1 className="text-3xl font-black text-neutral-900 tracking-tight">Logistics</h1>
                    <p className="text-neutral-500 text-sm font-medium mt-1">Manage shipping rules and courier integrations.</p>
                </div>
            </header>

            {/* SHIPPING RULES SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <section className="bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                <Globe className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-neutral-900">Estimated Delivery Rules</h3>
                                <p className="text-xs text-neutral-500 font-medium">Configure how delivery dates are calculated on the storefront.</p>
                            </div>
                        </div>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                                <FormField
                                    control={form.control}
                                    name="is_edd_enabled"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base font-bold">Enable Estimated Delivery</FormLabel>
                                                <FormDescription className="text-xs">
                                                    Show the "Get it by [Date]" estimation on product pages.
                                                </FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="edd_mode"
                                    render={({ field }) => (
                                        <FormItem className="space-y-3">
                                            <FormLabel className="text-base font-bold">Display Style</FormLabel>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                                >
                                                    <FormItem>
                                                        <FormControl>
                                                            <RadioGroupItem value="detailed" className="peer sr-only" />
                                                        </FormControl>
                                                        <FormLabel className="flex flex-col items-center justify-between rounded-md border-2 border-neutral-100 bg-white p-4 hover:bg-neutral-50 peer-data-[state=checked]:border-neutral-900 [&:has([data-state=checked])]:border-neutral-900 cursor-pointer transition-all">
                                                            <div className="mb-2 rounded-md bg-neutral-100 p-2 text-neutral-900">
                                                                <Package className="h-6 w-6" />
                                                            </div>
                                                            <div className="text-center space-y-1">
                                                                <span className="text-sm font-bold text-neutral-900">Detailed Timeline</span>
                                                                <p className="text-[10px] text-neutral-500 font-medium">Shows Ordered, Shipped, Delivered steps.</p>
                                                            </div>
                                                        </FormLabel>
                                                    </FormItem>
                                                    <FormItem>
                                                        <FormControl>
                                                            <RadioGroupItem value="compact" className="peer sr-only" />
                                                        </FormControl>
                                                        <FormLabel className="flex flex-col items-center justify-between rounded-md border-2 border-neutral-100 bg-white p-4 hover:bg-neutral-50 peer-data-[state=checked]:border-neutral-900 [&:has([data-state=checked])]:border-neutral-900 cursor-pointer transition-all">
                                                            <div className="mb-2 rounded-md bg-neutral-100 p-2 text-neutral-900">
                                                                <Truck className="h-6 w-6" />
                                                            </div>
                                                            <div className="text-center space-y-1">
                                                                <span className="text-sm font-bold text-neutral-900">Compact Text</span>
                                                                <p className="text-[10px] text-neutral-500 font-medium">Simple "Get it by Date" one-liner.</p>
                                                            </div>
                                                        </FormLabel>
                                                    </FormItem>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-bold text-neutral-800">Handling Time (Days)</h4>
                                        <div className="flex gap-4">
                                            <FormField
                                                control={form.control}
                                                name="handling_time_min"
                                                render={({ field }) => (
                                                    <FormItem className="flex-1">
                                                        <FormLabel className="text-xs uppercase font-bold text-neutral-500">Min</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="handling_time_max"
                                                render={({ field }) => (
                                                    <FormItem className="flex-1">
                                                        <FormLabel className="text-xs uppercase font-bold text-neutral-500">Max</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-sm font-bold text-neutral-800">Transit Time (Days)</h4>
                                        <div className="flex gap-4">
                                            <FormField
                                                control={form.control}
                                                name="transit_time_min"
                                                render={({ field }) => (
                                                    <FormItem className="flex-1">
                                                        <FormLabel className="text-xs uppercase font-bold text-neutral-500">Min</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="transit_time_max"
                                                render={({ field }) => (
                                                    <FormItem className="flex-1">
                                                        <FormLabel className="text-xs uppercase font-bold text-neutral-500">Max</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <FormField
                                    control={form.control}
                                    name="free_shipping_threshold"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold">Free Shipping Threshold (₹)</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} />
                                            </FormControl>
                                            <FormDescription className="text-xs">
                                                Orders above this amount will show "Free Shipping" on the timeline.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" disabled={saving} className="w-full md:w-auto bg-neutral-900 font-bold">
                                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                    Save Settings
                                </Button>
                            </form>
                        </Form>
                    </section>
                </div>

                {/* INTEGRATIONS - Right Column */}
                <div className="space-y-6">
                    <h3 className="text-sm font-black text-neutral-400 uppercase tracking-widest px-1">Integrations</h3>

                    {/* NIMBUS POST */}
                    <div className="bg-white rounded-2xl border border-neutral-100 p-6 group relative overflow-hidden transition-all hover:shadow-md hover:border-blue-100">
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:rotate-12 transition-transform duration-500">
                            <Truck className="w-24 h-24" />
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                                <Package className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-neutral-900 mt-1">Nimbus Post</h3>
                                <div className="flex items-center gap-1">
                                    <ShieldCheck className="w-3 h-3 text-green-500" />
                                    <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">Official Partner</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-xs font-medium text-neutral-500 leading-relaxed mb-4">
                            India's most trusted logistics aggregator. Access BlueDart, Delhivery, and Xpressbees.
                        </p>
                        <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-[9px] font-black rounded uppercase tracking-widest">Coming Soon</span>
                            <button className="text-[10px] font-bold uppercase tracking-wide text-blue-600 flex items-center gap-1 hover:underline">
                                Learn More <ExternalLink className="w-3 h-3" />
                            </button>
                        </div>
                    </div>

                    {/* SHIPROCKET */}
                    <div className="bg-white rounded-2xl border border-neutral-100 p-6 group relative overflow-hidden opacity-60 grayscale filter">
                        <div className="absolute top-0 right-0 p-6 opacity-5">
                            <Truck className="w-24 h-24" />
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-neutral-400">
                                <Package className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-neutral-900 mt-1">Shiprocket</h3>
                                <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">Planned</span>
                            </div>
                        </div>
                        <p className="text-xs font-medium text-neutral-400 leading-relaxed">
                            Integrate Shiprocket for pan-India presence.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
