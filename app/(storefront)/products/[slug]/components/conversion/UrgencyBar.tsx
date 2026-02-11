import { Timer, Zap, Package } from "lucide-react"
import { useEffect, useState } from "react"

interface UrgencyBarProps {
    settings?: {
        enabled: boolean
        type: 'timer' | 'stock' | 'text'
        text?: string
        timer?: number
        stock?: number
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
        type: 'timer' | 'stock' | 'text'
        text?: string
        timer?: number
        stock?: number
    }

    // If disabled, don't render (User Request: "switch urgencybar on and off")
    if (!config.enabled) return null

    // Timer Logic
    useEffect(() => {
        if (config.type === 'timer' && config.timer) {
            const duration = config.timer * 60; // seconds
            let timer = duration, minutes, seconds;

            const interval = setInterval(() => {
                minutes = parseInt((timer / 60).toString(), 10)
                seconds = parseInt((timer % 60).toString(), 10)

                minutes = minutes < 10 ? "0" + minutes : minutes
                seconds = seconds < 10 ? "0" + seconds : seconds

                setTimeLeft(minutes + ":" + seconds)

                if (--timer < 0) {
                    timer = duration
                }
            }, 1000)

            return () => clearInterval(interval)
        }
    }, [config.type, config.timer])


    return (
        <div className="flex items-center gap-2 mb-3 bg-[var(--color-accent-soft)] text-[var(--color-accent)] px-3 py-2 rounded-sm text-xs font-bold uppercase tracking-wide border border-[var(--color-accent)]/10">
            {config.type === 'timer' && (
                <>
                    <Timer className="h-3.5 w-3.5 animate-pulse" />
                    <span>Offer ends in {timeLeft || "00:00"}</span>
                </>
            )}

            {config.type === 'stock' && (
                <>
                    <Package className="h-3.5 w-3.5" />
                    <span>Only {config.stock || 5} units left!</span>
                </>
            )}

            {config.type === 'text' && (
                <>
                    <Zap className="h-3.5 w-3.5 fill-current" />
                    <span>{config.text || "Selling Fast!"}</span>
                </>
            )}
        </div>
    )
}
