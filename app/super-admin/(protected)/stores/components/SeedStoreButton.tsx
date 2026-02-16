'use client'

import { useState } from 'react'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { toast } from 'sonner'
import { FlaskConical, Loader2 } from 'lucide-react'

export default function SeedStoreButton({ storeId }: { storeId: string }) {
    const [loading, setLoading] = useState(false)

    const handleSeed = async () => {
        if (!confirm('This will inject 10 mock orders into this store. Continue?')) return

        setLoading(true)
        try {
            const { data, error } = await supabaseBrowser.functions.invoke('seed-mock-data', {
                body: { store_id: storeId, order_count: 10 }
            })

            if (error) throw error

            toast.success('Store Seeded Successfully!', {
                description: `Generated ${data.count} mock orders across the last 14 days.`
            })
        } catch (err: any) {
            console.error('Seeding failed:', err)
            toast.error('Seeding Failed', {
                description: err.message || 'Check platform permissions or Edge Function status.'
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            onClick={handleSeed}
            disabled={loading}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all
        ${loading
                    ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 shadow-sm active:scale-95'
                }`}
            title="Seed Mock Data (Orders & Customers)"
        >
            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <FlaskConical className="w-3 h-3" />}
            {loading ? 'Seeding...' : 'Seed'}
        </button>
    )
}
