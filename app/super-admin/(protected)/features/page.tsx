'use client'

import React, { useEffect, useState } from 'react'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { Control, ToggleLeft, ToggleRight, Plus, Rocket, Settings2, Info } from 'lucide-react'
import { toast } from 'sonner'
import { FeatureOverrides } from './components/FeatureOverrides'

interface FeatureFlag {
    id: string
    name: string
    description: string
    is_enabled: boolean
    created_at: string
}

export default function FeaturesPage() {
    const [flags, setFlags] = useState<FeatureFlag[]>([])
    const [loading, setLoading] = useState(true)
    const [showNewForm, setShowNewForm] = useState(false)
    const [newFlag, setNewFlag] = useState({ name: '', description: '', is_enabled: false })

    const fetchFlags = async () => {
        const { data, error } = await supabaseBrowser
            .from('feature_flags')
            .select('*')
            .is('store_id', null) // Global flags only
            .order('name')

        if (error) {
            toast.error('Failed to fetch features')
        } else {
            setFlags(data || [])
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchFlags()
    }, [])

    const toggleFlag = async (flag: FeatureFlag) => {
        const { error } = await supabaseBrowser
            .from('feature_flags')
            .update({ is_enabled: !flag.is_enabled })
            .eq('id', flag.id)

        if (error) {
            toast.error('Failed to update feature')
        } else {
            setFlags(flags.map(f => f.id === flag.id ? { ...f, is_enabled: !f.is_enabled } : f))
            toast.success(`${flag.name} ${!flag.is_enabled ? 'enabled' : 'disabled'}`)
        }
    }

    const createFlag = async () => {
        if (!newFlag.name) return toast.error('Name is required')

        const { error } = await supabaseBrowser
            .from('feature_flags')
            .insert([newFlag])

        if (error) {
            toast.error('Failed to create flag')
        } else {
            toast.success('Feature flag created')
            setShowNewForm(false)
            setNewFlag({ name: '', description: '', is_enabled: false })
            fetchFlags()
        }
    }

    return (
        <div className="min-h-screen bg-[#FAFAF9] selection:bg-black selection:text-white">
            <div className="max-w-[1200px] mx-auto py-12 px-6 space-y-12">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-2xl rotate-3 hover:rotate-0 transition-transform cursor-pointer">
                                <Rocket className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-[10px] font-black bg-black/5 px-2.5 py-1 rounded-full uppercase tracking-[0.2em] text-black">Control Panel</span>
                        </div>
                        <h1 className="text-5xl font-black text-neutral-900 tracking-tighter pt-4 text-nowrap">Platform Controls</h1>
                        <p className="text-neutral-500 font-medium text-lg max-w-md">Manage feature releases and store-level overrides with absolute precision.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* GLOBAL FLAGS */}
                    <div className="lg:col-span-12 bg-white border border-neutral-200 rounded-[2.5rem] shadow-sm overflow-hidden group hover:border-neutral-300 transition-colors">
                        <div className="px-10 py-8 border-b border-neutral-50 flex items-center justify-between bg-neutral-50/30">
                            <div>
                                <h2 className="text-xl font-black text-neutral-900 flex items-center gap-3 text-nowrap">
                                    <Settings2 className="w-6 h-6 text-neutral-400" />
                                    Global Feature Matrix
                                </h2>
                                <p className="text-xs text-neutral-400 font-medium mt-1">Status of core platform capabilities</p>
                            </div>
                            <button
                                onClick={() => setShowNewForm(true)}
                                className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform"
                            >
                                <Plus className="w-3 h-3" />
                                Provision New Flag
                            </button>
                        </div>

                        {showNewForm && (
                            <div className="p-10 bg-neutral-50 border-b border-neutral-200 animate-in fade-in slide-in-from-top-4 duration-300">
                                <div className="max-w-xl space-y-6">
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Flag Name (Unique ID)</label>
                                            <input
                                                value={newFlag.name}
                                                onChange={e => setNewFlag({ ...newFlag, name: e.target.value.toLowerCase().replace(/ /g, '_') })}
                                                placeholder="e.g. beta_checkout"
                                                className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Description</label>
                                            <textarea
                                                value={newFlag.description}
                                                onChange={e => setNewFlag({ ...newFlag, description: e.target.value })}
                                                placeholder="What does this feature control?"
                                                className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black outline-none transition-all resize-none h-24"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={createFlag}
                                            className="bg-black text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest"
                                        >
                                            Commit Change
                                        </button>
                                        <button
                                            onClick={() => setShowNewForm(false)}
                                            className="text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-black"
                                        >
                                            Abort
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="divide-y divide-neutral-50">
                            {flags.map((flag) => (
                                <div key={flag.id} className="px-10 py-8 flex items-center justify-between hover:bg-neutral-50/50 transition-colors group">
                                    <div className="flex-1 min-w-0 pr-8">
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="font-black text-neutral-900 group-hover:text-black transition-colors">{flag.name}</span>
                                            <div className={`w-1.5 h-1.5 rounded-full ${flag.is_enabled ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)] animate-pulse' : 'bg-neutral-300'}`} />
                                        </div>
                                        <p className="text-xs text-neutral-500 font-medium leading-relaxed">{flag.description}</p>
                                    </div>
                                    <button
                                        onClick={() => toggleFlag(flag)}
                                        className={`flex items-center gap-2 p-1 rounded-2xl transition-all duration-500 ${flag.is_enabled ? 'bg-black' : 'bg-neutral-200'}`}
                                    >
                                        <div className={`p-2 rounded-xl bg-white shadow-xl transition-all duration-500 ${flag.is_enabled ? 'translate-x-12' : 'translate-x-0'}`}>
                                            {flag.is_enabled ? <ToggleRight className="w-4 h-4 text-black" /> : <ToggleLeft className="w-4 h-4 text-neutral-400" />}
                                        </div>
                                        <span className={`px-4 text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${flag.is_enabled ? '-translate-x-8 text-white' : 'text-neutral-500'}`}>
                                            {flag.is_enabled ? 'Active' : 'Offline'}
                                        </span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* STORE-SPECIFIC OVERRIDES */}
                    <div className="lg:col-span-12">
                        <FeatureOverrides />
                    </div>
                </div>

            </div>
        </div>
    )
}
