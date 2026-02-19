'use client'

import { useState, useEffect } from 'react'
import { Truck, Check, Package, FileText } from 'lucide-react'

interface ShippingSettings {
    handling_time_min: number;
    handling_time_max: number;
    transit_time_min: number;
    transit_time_max: number;
    is_edd_enabled: boolean;
    free_shipping_threshold?: number;
    edd_mode?: 'detailed' | 'compact';
}

interface EstimatedDeliveryProps {
    settings?: ShippingSettings;
}

export function EstimatedDelivery({ settings }: EstimatedDeliveryProps) {
    // Determine view mode (Default to Detailed)
    const isCompact = settings?.edd_mode === 'compact'
    const [dates, setDates] = useState<{
        estimate: string;
        orderedDate: string;
        shippedDate: string;
        deliveryStart: string;
        deliveryEnd: string;
    } | null>(null)

    // If explicitly disabled in global settings, don't render
    if (settings?.is_edd_enabled === false) {
        return null
    }

    useEffect(() => {
        const calculateDates = () => {
            const today = new Date()
            const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' }

            // Default values
            const handlingMin = settings?.handling_time_min ?? 1
            const handlingMax = settings?.handling_time_max ?? 2
            const transitMin = settings?.transit_time_min ?? 4
            const transitMax = settings?.transit_time_max ?? 7

            // Helper to add days
            const addDays = (date: Date, days: number) => {
                const res = new Date(date)
                res.setDate(res.getDate() + days)
                return res
            }

            // Calculation Logic
            const shippedDateObj = addDays(today, handlingMax)
            const deliveryMinObj = addDays(today, handlingMin + transitMin)
            const deliveryMaxObj = addDays(today, handlingMax + transitMax)

            setDates({
                estimate: `${deliveryMinObj.toLocaleDateString('en-IN', options)} - ${deliveryMaxObj.toLocaleDateString('en-IN', options)}`,
                orderedDate: today.toLocaleDateString('en-IN', options),
                shippedDate: shippedDateObj.toLocaleDateString('en-IN', options),
                deliveryStart: deliveryMinObj.toLocaleDateString('en-IN', options),
                deliveryEnd: deliveryMaxObj.toLocaleDateString('en-IN', options)
            })
        }

        calculateDates()
    }, [settings])

    if (!dates) return null

    // Dynamic Free Shipping Text
    const freeShippingText = settings?.free_shipping_threshold !== undefined && settings.free_shipping_threshold > 0
        ? `Free Delivery on orders above ₹${settings.free_shipping_threshold}`
        : "Free Delivery on all orders today"

    return isCompact ? (
        <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-100 mt-4 animate-in fade-in duration-500">
            <div className="flex items-start gap-3">
                <div className="p-1.5 bg-white border border-neutral-200 rounded-md shadow-sm">
                    <Truck className="w-4 h-4 text-neutral-900" />
                </div>
                <div>
                    <p className="text-sm font-bold text-neutral-900 leading-tight">
                        Order now to get it by <span className="text-green-600">{dates.estimate}</span>
                    </p>
                    <p className="text-[10px] text-neutral-500 mt-1 font-medium flex items-center gap-1">
                        <Check className="w-3 h-3 text-green-500" />
                        {freeShippingText}
                    </p>
                </div>
            </div>
        </div>
    ) : (
        <div className="bg-white rounded-xl p-5 border border-neutral-100 shadow-sm mt-4 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex items-center justify-center gap-2 mb-6 bg-red-50 py-2 rounded-lg border border-red-100">
                <Package className="w-4 h-4 text-red-500" />
                <span className="text-xs font-bold text-neutral-800">
                    Estimated Delivery <span className="text-neutral-900">{dates.estimate}</span>
                </span>
            </div>

            {/* Visual Timeline */}
            <div className="relative px-2">
                {/* Connecting Line */}
                <div className="absolute top-[16px] left-8 right-8 h-1 bg-neutral-100 rounded-full"></div>

                <div className="relative flex justify-between text-center">
                    {/* Step 1: Ordered */}
                    <div className="flex flex-col items-center gap-2 z-10 w-20">
                        <div className="w-8 h-8 rounded-full bg-yellow-100 border border-yellow-200 flex items-center justify-center shadow-sm">
                            <FileText className="w-4 h-4 text-neutral-800" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wide">Ordered</span>
                            <span className="text-xs font-black text-neutral-900">{dates.orderedDate}</span>
                        </div>
                    </div>

                    {/* Step 2: Shipped */}
                    <div className="flex flex-col items-center gap-2 z-10 w-20">
                        <div className="w-8 h-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center shadow-sm">
                            <Truck className="w-4 h-4 text-neutral-400" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide">Ships</span>
                            <span className="text-xs font-bold text-neutral-500">{dates.shippedDate}</span>
                        </div>
                    </div>

                    {/* Step 3: Delivery */}
                    <div className="flex flex-col items-center gap-2 z-10 w-20">
                        <div className="w-8 h-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center shadow-sm">
                            <Package className="w-4 h-4 text-neutral-400" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide">Delivery</span>
                            <span className="text-xs font-bold text-neutral-500 leading-tight">{dates.deliveryEnd}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-5 pt-3 border-t border-neutral-100/50 text-center">
                <p className="text-[10px] text-neutral-400 font-medium inline-flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-green-500" />
                    {freeShippingText}
                </p>
            </div>
        </div>
    )
}
