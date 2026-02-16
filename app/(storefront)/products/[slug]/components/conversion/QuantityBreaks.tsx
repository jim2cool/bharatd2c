'use client'

import { Tag } from 'lucide-react'

interface QuantityBreaksProps {
    currentQty: number
    price: number
    onQtySelect: (qty: number) => void
}

export function QuantityBreaks({ currentQty, price, onQtySelect }: QuantityBreaksProps) {
    const tiers = [
        { qty: 1, label: 'Single', discount: 0, badge: null },
        { qty: 2, label: 'Buy 2', discount: 10, badge: 'Save 10%' },
        { qty: 3, label: 'Buy 3+', discount: 15, badge: 'Save 15%' },
    ]

    return (
        <div className="space-y-3 mt-4">
            <div className="flex items-center gap-2 px-1">
                <Tag className="w-3 h-3 text-indigo-600" />
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Limited Offer: Quantity Breaks</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
                {tiers.map((tier) => {
                    const isSelected = tier.qty === 3 ? currentQty >= 3 : currentQty === tier.qty
                    const discountedPrice = Math.round(price * (1 - tier.discount / 100))

                    return (
                        <button
                            key={tier.qty}
                            onClick={() => onQtySelect(tier.qty)}
                            className={`relative flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${isSelected
                                    ? 'border-neutral-900 bg-neutral-900 text-white shadow-md'
                                    : 'border-neutral-100 bg-neutral-50 text-neutral-600 hover:border-neutral-200'
                                }`}
                        >
                            {tier.badge && (
                                <span className={`absolute -top-2 px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-tighter shadow-sm ${isSelected ? 'bg-indigo-500 text-white' : 'bg-indigo-100 text-indigo-600'
                                    }`}>
                                    {tier.badge}
                                </span>
                            )}
                            <span className="text-[10px] font-bold uppercase mb-1">{tier.label}</span>
                            <span className={`text-xs font-black ${isSelected ? 'text-white' : 'text-neutral-900'}`}>
                                ₹{discountedPrice}
                            </span>
                            <span className="text-[8px] opacity-60">/unit</span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
