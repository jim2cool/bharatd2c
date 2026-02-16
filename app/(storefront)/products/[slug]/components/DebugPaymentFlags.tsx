'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, AlertCircle } from 'lucide-react'

export function DebugPaymentFlags({
    product,
    store,
    platform
}: {
    product: any
    store: any
    platform: any
}) {
    const [isOpen, setIsOpen] = useState(false)

    if (!product) return null

    // Replicate Logic
    const useStore = product.use_store_payment_settings !== false
    const localCod = useStore ? store?.cod_enabled : product.cod_enabled
    const localPrepaid = useStore ? store?.prepaid_enabled : product.prepaid_enabled
    const localCart = useStore ? store?.cart_button_enabled : product.cart_button_enabled

    const finalCod = platform.cod_enabled && (localCod ?? true)
    const finalPrepaid = platform.prepaid_enabled && (localPrepaid ?? true)
    const finalCart = platform.cart_button_enabled && (localCart ?? true)

    return (
        <div className="fixed bottom-4 right-4 z-[9999] font-mono text-xs">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-foreground text-primary-foreground px-4 py-2 rounded-t-lg flex items-center gap-2 shadow-lg hover:bg-neutral-800 transition-colors"
            >
                <AlertCircle className="w-4 h-4 text-yellow-400" />
                Payment Debugger
                {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>

            {isOpen && (
                <div className="bg-card border border-black p-4 rounded-tl-lg shadow-2xl w-[320px] max-h-[80vh] overflow-auto text-foreground">
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-bold underline mb-1">Final Resolution</h3>
                            <div className="grid grid-cols-2 gap-2">
                                <div>COD:</div>
                                <div className={finalCod ? 'text-green-600 font-bold' : 'text-destructive font-bold'}>{String(finalCod)}</div>
                                <div>Prepaid:</div>
                                <div className={finalPrepaid ? 'text-green-600 font-bold' : 'text-destructive font-bold'}>{String(finalPrepaid)}</div>
                                <div>Cart:</div>
                                <div className={finalCart ? 'text-green-600 font-bold' : 'text-destructive font-bold'}>{String(finalCart)}</div>
                            </div>
                        </div>

                        <div className="border-t pt-2">
                            <h3 className="font-bold underline mb-1">Logic Trace</h3>
                            <div className="space-y-1">
                                <div className="flex justify-between">
                                    <span>Use Store Defaults?</span>
                                    <span className={useStore ? 'text-primary' : 'text-orange-600'}>{String(useStore)}</span>
                                </div>
                                <div className="text-[10px] text-muted-foreground mb-2">DB Value: {String(product.use_store_payment_settings)}</div>

                                <h4 className="font-bold text-[10px] uppercase text-muted-foreground mt-2">1. Local Level (Product/Store)</h4>
                                <div className="grid grid-cols-3 gap-1 text-[10px]">
                                    <div className="font-bold">Type</div>
                                    <div className="font-bold center">Store</div>
                                    <div className="font-bold center">Prod</div>

                                    <div>COD</div>
                                    <div>{String(store?.cod_enabled)}</div>
                                    <div>{String(product.cod_enabled)}</div>

                                    <div>Prepaid</div>
                                    <div>{String(store?.prepaid_enabled)}</div>
                                    <div>{String(product.prepaid_enabled)}</div>

                                    <div>Cart</div>
                                    <div>{String(store?.cart_button_enabled)}</div>
                                    <div>{String(product.cart_button_enabled)}</div>
                                </div>

                                <h4 className="font-bold text-[10px] uppercase text-muted-foreground mt-2">2. Global Gate (Platform)</h4>
                                <div className="text-[10px]">
                                    <div>COD: {String(platform.cod_enabled)}</div>
                                    <div>Prepaid: {String(platform.prepaid_enabled)}</div>
                                    <div>Cart: {String(platform.cart_button_enabled)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
