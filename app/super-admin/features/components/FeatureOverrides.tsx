'use client'

import React, { useEffect, useState } from 'react'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { Store, Search, Filter, ShieldAlert, X } from 'lucide-react'
import { toast } from 'sonner'

interface FeatureOverride {
    id: string
    name: string
    is_enabled: boolean
    store_id: string
    stores: {
        name: string
    }
}

interface FeatureFlag {
    name: string
}

export function FeatureOverrides() {
    const [overrides, setOverrides] = useState<FeatureOverride[]>([])
    const [availableFlags, setAvailableFlags] = useState<FeatureFlag[]>([])
    const [stores, setStores] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [showNew, setShowNew] = useState(false)
    const [newOverride, setNewOverride] = useState({ name: '', store_id: '', is_enabled: true })

    const fetchData = async () => {
        const [oRes, fRes, sRes] = await Promise.all([
            supabaseBrowser.from('feature_flags').select('*, stores(name)').not('store_id', 'is', null),
            supabaseBrowser.from('feature_flags').select('name').is('store_id', null),
            supabaseBrowser.from('stores').select('id, name').limit(100)
        ])

        setOverrides(oRes.data || [])
        setAvailableFlags(fRes.data || [])
        setStores(sRes.data || [])
        setLoading(false)
    }

    useEffect(() => {
        fetchData()
    }, [])

    const deleteOverride = async (id: string) => {
        const { error } = await supabaseBrowser.from('feature_flags').delete().eq('id', id)
        if (error) toast.error('Failed to remove override')
        else {
            setOverrides(overrides.filter(o => o.id !== id))
            toast.success('Override removed')
        }
    }

    const createOverride = async () => {
        if (!newOverride.name || !newOverride.store_id) return toast.error('Selection required')

        const { error } = await supabaseBrowser.from('feature_flags').insert([newOverride])
        if (error) toast.error('Failed to add override')
        else {
            toast.success('Store override active')
            setShowNew(showNew)
            fetchData()
        }
    }

    return (
        <div className="bg-white border border-neutral-200 rounded-[2.5rem] shadow-sm overflow-hidden group hover:border-neutral-300 transition-colors">
            <div className="px-10 py-8 border-b border-neutral-50 flex items-center justify-between bg-neutral-50/30">
                <div>
                    <h2 className="text-xl font-black text-neutral-900 flex items-center gap-3">
                        <ShieldAlert className="w-6 h-6 text-neutral-400" />
                        Provisioned Overrides
                    </h2>
                    <p className="text-xs text-neutral-400 font-medium mt-1">Store-specific clearance levels</p>
                </div>
                <button
                    onClick={() => setShowNew(true)}
                    className="text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-black border border-neutral-200 px-4 py-2 rounded-xl bg-white shadow-sm"
                >
                    Provision Override
                </button>
            </div>

            {showNew && (
                <div className="p-10 bg-black text-white">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Select Feature</label>
                            <select
                                value={newOverride.name}
                                onChange={e => setNewOverride({ ...newOverride, name: e.target.value })}
                                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
                            >
                                <option value="">Select Feature...</option>
                                {availableFlags.map(f => <option key={f.name} value={f.name} className="bg-black">{f.name}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Select Store</label>
                            <select
                                value={newOverride.store_id}
                                onChange={e => setNewOverride({ ...newOverride, store_id: e.target.value })}
                                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
                            >
                                <option value="">Select Store...</option>
                                {stores.map(s => <option key={s.id} value={s.id} className="bg-black">{s.name}</option>)}
                            </select>
                        </div>
                        <div className="flex items-end gap-3">
                            <button
                                onClick={createOverride}
                                className="flex-1 bg-white text-black h-[50px] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-neutral-200"
                            >
                                Deploy Override
                            </button>
                            <button
                                onClick={() => setShowNew(false)}
                                className="w-[50px] h-[50px] flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-xl transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-[10px] text-neutral-400 font-black uppercase tracking-[0.2em] bg-neutral-50/50">
                        <tr>
                            <th className="px-10 py-5">Override Identifier</th>
                            <th className="px-10 py-5">Target Node</th>
                            <th className="px-10 py-5">Protocol Status</th>
                            <th className="px-10 py-5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-50">
                        {overrides.map((o) => (
                            <tr key={o.id} className="hover:bg-neutral-50/50 transition-colors group">
                                <td className="px-10 py-6">
                                    <div className="font-black text-neutral-900 group-hover:text-black transition-colors">{o.name}</div>
                                </td>
                                <td className="px-10 py-6">
                                    <div className="flex items-center gap-2">
                                        <Store className="w-3 h-3 text-neutral-400" />
                                        <span className="text-xs font-bold text-neutral-700">{o.stores?.name}</span>
                                    </div>
                                </td>
                                <td className="px-10 py-6">
                                    <span className={`px-2.5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider shadow-sm border ${o.is_enabled
                                        ? 'bg-green-50 text-green-700 border-green-100'
                                        : 'bg-red-50 text-red-700 border-red-100'
                                        }`}>
                                        {o.is_enabled ? 'Explicitly Enabled' : 'Explicitly Disabled'}
                                    </span>
                                </td>
                                <td className="px-10 py-6 text-right">
                                    <button
                                        onClick={() => deleteOverride(o.id)}
                                        className="text-[9px] font-black uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors"
                                    >
                                        Decommission
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
