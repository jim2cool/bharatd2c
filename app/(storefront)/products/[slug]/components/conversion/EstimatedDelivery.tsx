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
        <div className="p-4 border mt-4 animate-in fade-in duration-500"
            style={{ background: 'var(--callout-bg)', borderColor: 'var(--callout-border)', borderRadius: 'var(--radius-card)' }}>
            <div className="flex items-start gap-3">
                <div className="p-1.5 border shadow-sm" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)', borderRadius: 'var(--radius-input)' }}>
                    <Truck className="w-4 h-4" style={{ color: 'var(--text-primary)' }} />
                </div>
                <div>
                    <p className="text-sm font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>
                        Order now to get it by <span style={{ color: 'var(--primary)' }}>{dates.estimate}</span>
                    </p>
                    <p className="text-[10px] mt-1 font-medium flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                        <Check className="w-3 h-3" style={{ color: 'var(--primary)' }} />
                        {freeShippingText}
                    </p>
                </div>
            </div>
        </div>
    ) : (
        <div className="p-5 border shadow-[var(--shadow-card)] mt-4 animate-in fade-in duration-700"
            style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)', borderRadius: 'var(--radius-card)' }}>
            {/* Header */}
            <div className="flex items-center justify-center gap-2 mb-6 py-2 border"
                style={{ background: 'var(--callout-bg)', borderColor: 'var(--callout-border)', borderRadius: 'var(--radius-input)' }}>
                <Package className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Estimated Delivery <span style={{ color: 'var(--primary)' }}>{dates.estimate}</span>
                </span>
            </div>

            {/* Visual Timeline */}
            <div className="relative px-2">
                {/* Connecting Line */}
                <div className="absolute top-[16px] left-8 right-8 h-1" style={{ background: 'var(--border)', borderRadius: 'var(--radius-badge)' }}></div>

                <div className="relative flex justify-between text-center">
                    {/* Step 1: Ordered — active (primary tint) */}
                    <div className="flex flex-col items-center gap-2 z-10 w-20">
                        <div className="w-8 h-8 flex items-center justify-center shadow-sm border"
                            style={{ background: 'var(--callout-bg)', borderColor: 'var(--primary)', borderRadius: 'var(--radius-badge)' }}>
                            <FileText className="w-4 h-4" style={{ color: 'var(--text-primary)' }} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>Ordered</span>
                            <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{dates.orderedDate}</span>
                        </div>
                    </div>

                    {/* Step 2: Shipped — pending */}
                    <div className="flex flex-col items-center gap-2 z-10 w-20">
                        <div className="w-8 h-8 flex items-center justify-center shadow-sm border"
                            style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)', borderRadius: 'var(--radius-badge)' }}>
                            <Truck className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>Ships</span>
                            <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>{dates.shippedDate}</span>
                        </div>
                    </div>

                    {/* Step 3: Delivery */}
                    <div className="flex flex-col items-center gap-2 z-10 w-20">
                        <div className="w-8 h-8 flex items-center justify-center shadow-sm border"
                            style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)', borderRadius: 'var(--radius-badge)' }}>
                            <Package className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>Delivery</span>
                            <span className="text-xs font-semibold leading-tight" style={{ color: 'var(--text-secondary)' }}>{dates.deliveryEnd}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-5 pt-3 text-center" style={{ borderTop: '1px solid var(--border)' }}>
                <p className="text-[10px] font-medium inline-flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                    <Check className="w-3 h-3" style={{ color: 'var(--primary)' }} />
                    {freeShippingText}
                </p>
            </div>
        </div>
    )
}
