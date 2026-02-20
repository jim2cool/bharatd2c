"use client"

import { Timer, Zap, Package } from "lucide-react"
import { useEffect, useState } from "react"

interface UrgencyBarProps {
    settings?: {
        enabled: boolean
        type: 'timer' | 'stock' | 'text' | 'countdown' | 'low_stock' | 'recent_view'
        text?: string
        timer?: number
        stock?: number
        viewers?: number
        config?: {
            minutes?: number
            stock?: number;
            viewers?: number;
        };
    }
}

export function UrgencyBar({ settings }: UrgencyBarProps) {
    const [timeLeft, setTimeLeft] = useState<string>("")

    // Default Fallback
    const defaultConfig = {
        enabled: false, // Default off if no settings
        type: 'text',
        text: 'Selling Fast!'
    }

    const config = (settings || defaultConfig) as {
        enabled: boolean
        type: 'timer' | 'stock' | 'text' | 'countdown' | 'low_stock' | 'recent_view'
        text?: string
        timer?: number
        stock?: number
        viewers?: number
        config?: {
            minutes?: number
            stock?: number;
            viewers?: number;
        };
    }

    // Determine active type (normalize legacy vs new)
    const activeType = config.type === 'countdown' ? 'timer' :
        config.type === 'low_stock' ? 'stock' :
            config.type === 'recent_view' ? 'viewers' : config.type

    // If disabled, don't render (User Request: "switch urgencybar on and off")
    if (!config.enabled) return null

    // Helper to get nested or flat value
    const getMinutes = () => config.config?.minutes || config.timer || 10
    const getStock = () => config.config?.stock || config.stock || 5
    const getViewers = () => config.config?.viewers || 15

    // Timer Logic
    useEffect(() => {
        if (activeType === 'timer') {
            const minutes = getMinutes()
            const duration = minutes * 60; // seconds
            let timer = duration

            // Initial Set
            const setTime = (t: number) => {
                const m = Math.floor(t / 60)
                const s = t % 60
                setTimeLeft(`${m < 10 ? "0" + m : m}:${s < 10 ? "0" + s : s}`)
            }
            setTime(timer)

            const interval = setInterval(() => {
                if (--timer < 0) {
                    timer = duration
                }
                setTime(timer)
            }, 1000)

            return () => clearInterval(interval)
        }
    }, [activeType, config])


    return (
        <div className="flex items-center gap-2 mb-3 bg-[var(--color-accent-soft)] text-[var(--color-accent)] px-3 py-2 rounded-sm text-xs font-bold uppercase tracking-wide border border-[var(--color-accent)]/10">
            {activeType === 'timer' && (
                <>
                    <Timer className="h-3.5 w-3.5 animate-pulse" />
                    <span>Offer ends in {timeLeft || "00:00"}</span>
                </>
            )}

            {activeType === 'stock' && (
                <>
                    <Package className="h-3.5 w-3.5" />
                    <span>Only {getStock()} units left!</span>
                </>
            )}

            {activeType === 'viewers' && (
                <>
                    <Zap className="h-3.5 w-3.5 fill-current animate-pulse" />
                    <span>{getViewers()} people are viewing this right now</span>
                </>
            )}

            {activeType === 'text' && (
                <>
                    <Zap className="h-3.5 w-3.5 fill-current" />
                    <span>{config.text || "Selling Fast!"}</span>
                </>
            )}
        </div>
    )
}
