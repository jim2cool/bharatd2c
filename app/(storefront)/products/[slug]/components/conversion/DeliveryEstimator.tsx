'use client'

import { useState, useEffect } from 'react'
import { MapPin, Truck, Check, Loader2 } from 'lucide-react'

export function DeliveryEstimator() {
    const [pincode, setPincode] = useState('')
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')
    const [estimate, setEstimate] = useState<string | null>(null)

    useEffect(() => {
        const savedPin = localStorage.getItem('user_pincode')
        if (savedPin) {
            setPincode(savedPin)
            calculateEstimate(savedPin)
        }
    }, [])

    const calculateEstimate = (pin: string) => {
        setStatus('loading')

        // User requested fixed logic based on order date
        setTimeout(() => {
            const today = new Date()
            // Standardizing: 4 days for metros/fast, 7 days for others
            const isMetro = pin.startsWith('11') || pin.startsWith('40') || pin.startsWith('56') || pin.startsWith('60') || pin.startsWith('70')
            const minDays = isMetro ? 4 : 5
            const maxDays = isMetro ? 6 : 8

            const deliveryDateMin = new Date(today.getTime() + (minDays * 24 * 60 * 60 * 1000))
            const deliveryDateMax = new Date(today.getTime() + (maxDays * 24 * 60 * 60 * 1000))

            const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' }
            const dateStr = `${deliveryDateMin.toLocaleDateString('en-IN', options)} - ${deliveryDateMax.toLocaleDateString('en-IN', options)}`

            setEstimate(dateStr)
            setStatus('success')
        }, 800)
    }

    const handleCheck = () => {
        if (pincode.length === 6) {
            localStorage.setItem('user_pincode', pincode)
            calculateEstimate(pincode)
        }
    }

    return (
        <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100 mt-2">
            <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Delivery Check</span>
            </div>

            <div className="flex gap-2">
                <div className="relative flex-1">
                    <input
                        type="text"
                        maxLength={6}
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                        placeholder="Enter Pincode"
                        className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-sm font-bold focus:ring-1 focus:ring-black outline-none transition-all"
                    />
                    {status === 'success' && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600">
                            <Check className="w-4 h-4" />
                        </div>
                    )}
                </div>
                <button
                    onClick={handleCheck}
                    disabled={pincode.length !== 6 || status === 'loading'}
                    className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-black uppercase tracking-tighter hover:bg-black transition-all disabled:opacity-30"
                >
                    {status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Check'}
                </button>
            </div>

            {status === 'success' && estimate && (
                <div className="mt-3 flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                    <Truck className="w-4 h-4 text-green-600" />
                    <p className="text-xs font-bold text-neutral-800">
                        Get it by <span className="text-green-600">{estimate}</span>
                    </p>
                </div>
            )}

            <p className="text-[9px] text-neutral-400 mt-2 font-medium">
                Free Delivery on all orders today!
            </p>
        </div>
    )
}
