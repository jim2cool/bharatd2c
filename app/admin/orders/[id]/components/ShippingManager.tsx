'use client'

import { useState } from 'react'
import { Truck, ChevronRight, CheckCircle2, AlertCircle, Info } from 'lucide-react'
import { toast } from 'sonner'

const PARTNERS = [
    { id: 'delhivery', name: 'Delhivery Surface', eta: '3-5 Days', price: 48, status: 'ready' },
    { id: 'bluedart', name: 'BlueDart Express', eta: '1-2 Days', price: 82, status: 'ready' },
    { id: 'ecom', name: 'Ecom Express', eta: '4-6 Days', price: 42, status: 'maintenance' },
]

export default function ShippingManager({ order, onUpdate }: { order: any, onUpdate: () => void }) {
    const [selectedPartner, setSelectedPartner] = useState<string | null>(null)
    const [booking, setBooking] = useState(false)
    const [booked, setBooked] = useState(!!order.meta?.tracking_number)

    const handleBook = async () => {
        if (!selectedPartner) return
        setBooking(true)

        // Simulate API call to logistics aggregator (e.g., NimbusPost/Shiprocket)
        await new Promise(r => setTimeout(r, 2000))

        const trackingNumber = `EZ-${Math.floor(10000000 + Math.random() * 90000000)}`
        const carrier = PARTNERS.find(p => p.id === selectedPartner)?.name

        const { error } = await (window as any).supabaseBrowser
            .from('orders')
            .update({
                meta: {
                    ...order.meta,
                    carrier,
                    tracking_number: trackingNumber,
                    fulfillment_status: 'fulfilled',
                    booked_at: new Date().toISOString()
                }
            })
            .eq('id', order.id)

        if (error) {
            toast.error('Booking failed')
        } else {
            toast.success('Shipment Booked Successfully!')
            setBooked(true)
            onUpdate()
        }
        setBooking(false)
    }

    if (booked) {
        return (
            <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-green-900 uppercase tracking-tight">Shipment Booked</h3>
                        <p className="text-[10px] text-green-700 font-bold uppercase tracking-widest">{order.meta?.carrier}</p>
                    </div>
                </div>

                <div className="bg-white/50 rounded-lg p-3 border border-green-100 text-[11px] font-medium space-y-1.5 text-green-800">
                    <div className="flex justify-between">
                        <span className="opacity-70">Tracking ID:</span>
                        <span className="font-bold font-mono text-[12px]">{order.meta?.tracking_number}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="opacity-70">Manifest Status:</span>
                        <span className="bg-green-200 px-1.5 py-0.5 rounded text-[8px] font-black uppercase">Pending Pickup</span>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-neutral-800 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-indigo-500" />
                    Book ShippingPartner
                </h2>
                <div className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-black uppercase tracking-widest">
                    Smart Choice
                </div>
            </div>

            <div className="space-y-3 mb-5">
                {PARTNERS.map(partner => (
                    <button
                        key={partner.id}
                        onClick={() => partner.status === 'ready' && setSelectedPartner(partner.id)}
                        disabled={partner.status === 'maintenance'}
                        className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group
              ${selectedPartner === partner.id
                                ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                                : 'border-slate-100 hover:border-slate-200 bg-white'
                            }
              ${partner.status === 'maintenance' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-2.5 h-2.5 rounded-full ${selectedPartner === partner.id ? 'bg-blue-600 animate-pulse' : 'bg-slate-200 group-hover:bg-slate-300'}`} />
                            <div>
                                <div className="text-sm font-bold text-slate-900">{partner.name}</div>
                                <div className="text-[10px] text-slate-500 font-medium uppercase tracking-tight">ETA: {partner.eta}</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-black text-slate-900">₹{partner.price}</div>
                            {partner.status === 'maintenance' && (
                                <div className="text-[8px] font-black text-red-500 uppercase tracking-tighter">Unavailable</div>
                            )}
                        </div>
                    </button>
                ))}
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 mb-5 flex gap-3">
                <Info className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <p className="text-[10px] text-amber-800 leading-relaxed font-medium">
                    Shipping rates are estimated based on product weight (500g) and destination ({order.meta?.city}). Official rate may vary slightly.
                </p>
            </div>

            <button
                onClick={handleBook}
                disabled={!selectedPartner || booking}
                className={`w-full py-3 rounded-xl text-sm font-black transition-all shadow-lg flex items-center justify-center gap-2
          ${!selectedPartner || booking
                        ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed shadow-none'
                        : 'bg-black text-white hover:bg-neutral-900 active:scale-95 shadow-neutral-200'
                    }
        `}
            >
                {booking ? (
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        <span>Generating AWB...</span>
                    </div>
                ) : (
                    <>
                        <span>Confirm & Book Shipment</span>
                        <ChevronRight className="w-4 h-4" />
                    </>
                )}
            </button>

            <p className="text-[9px] text-neutral-400 text-center mt-4 font-medium uppercase tracking-widest">
                Powered by SmartShip Aggregator
            </p>
        </div>
    )
}
