'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getActiveStoreIdClient } from '@/lib/getActiveStore.client'
import { getStoreBaseUrl } from '@/lib/getStoreUrl'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { Globe, ExternalLink } from 'lucide-react'

export type ChecklistState = {
    hasProducts: boolean
    hasDomain: boolean
    hasTheme: boolean
    hasPages: boolean
    hasShipping: boolean
}

export function OnboardingChecklist({ checklist }: { checklist: ChecklistState }) {
    const router = useRouter()
    const [storeUrl, setStoreUrl] = useState('')

    useEffect(() => {
        const fetchUrl = async () => {
            const id = getActiveStoreIdClient()
            if (id) {
                const url = await getStoreBaseUrl(supabaseBrowser)
                setStoreUrl(url)
            }
        }
        fetchUrl()
    }, [])

    const steps = [
        {
            id: 'hasProducts',
            title: 'Generate products with AI',
            description: 'Save hours by generating high-converting product listings from just a link or image.',
            action: 'Generate with AI',
            time: '2 mins',
            href: '/admin/products/generate',
            completed: checklist.hasProducts,
            isMagic: true
        },
        {
            id: 'hasPages',
            title: 'Review store policies',
            description: 'We\'ve pre-filled standard legal pages to save you time. Just check and personalize.',
            action: 'Edit Pages',
            time: '2 mins',
            href: '/admin/pages',
            completed: checklist.hasPages
        },
        {
            id: 'hasTheme',
            title: 'Customize store appearance',
            description: 'Adjust colors and layouts to match your brand identity.',
            action: 'Customize Theme',
            time: '3 mins',
            href: '/admin/settings/appearance',
            completed: checklist.hasTheme
        },
        {
            id: 'hasDomain',
            title: 'Connect a custom domain',
            description: 'Make your store professional with a custom domain (e.g. yourbrand.com).',
            action: 'Configure Domain',
            time: '2 mins',
            href: '/admin/settings/domains',
            completed: checklist.hasDomain
        }
    ]

    const completedCount = steps.filter(s => s.completed).length
    const progress = Math.round((completedCount / steps.length) * 100)

    if (completedCount === steps.length) return null

    return (
        <div className="max-w-5xl mx-auto py-12 px-6">
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
                <div className="p-10 md:p-14 border-b border-slate-50 bg-gradient-to-br from-white to-slate-50/50">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                </span>
                                Store Launchpad
                            </div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Build your empire.</h1>
                            <p className="text-slate-500 font-medium">Complete these {steps.length} steps to launch your boutique.</p>

                            {storeUrl && (
                                <div className="mt-6 flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-2xl w-fit group">
                                    <div className="h-8 w-8 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                        <Globe className="w-4 h-4 text-blue-500" />
                                    </div>
                                    <div className="pr-4">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Your Live Storefront</p>
                                        <a
                                            href={storeUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs font-bold text-slate-900 hover:text-blue-600 flex items-center gap-1.5 transition-colors"
                                        >
                                            {storeUrl.replace(/^https?:\/\//, '')}
                                            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="text-right">
                            <div className="text-4xl font-black text-slate-900 mb-2">{progress}%</div>
                            <div className="w-48 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-slate-900 transition-all duration-1000 ease-out"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-3">{completedCount} of {steps.length} Tasks Finished</p>
                        </div>
                    </div>
                </div>

                <div className="divide-y divide-slate-50">
                    {steps.map((step) => (
                        <div
                            key={step.id}
                            className={`flex flex-col md:flex-row items-center gap-8 p-10 md:p-14 transition-all ${step.completed ? 'bg-slate-50/30 opacity-60' : 'bg-white hover:bg-slate-50/50'}`}
                        >
                            <div className="flex-shrink-0">
                                {step.completed ? (
                                    <div className="h-16 w-16 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg shadow-green-100">
                                        <CheckCircle2 className="w-8 h-8 text-white" />
                                    </div>
                                ) : (
                                    <div className={`h-16 w-16 bg-white border-2 rounded-2xl flex items-center justify-center font-black text-2xl relative ${step.isMagic ? 'border-blue-200 text-blue-600 shadow-xl shadow-blue-50/50 group-hover:scale-110 transition-transform duration-500' : 'border-slate-100 text-slate-200'}`}>
                                        {step.isMagic ? (
                                            <>
                                                <Sparkles className="w-8 h-8" />
                                                <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-blue-600 text-[8px] text-white rounded-full uppercase tracking-tighter">AI</div>
                                            </>
                                        ) : (
                                            <Circle className="w-8 h-8" />
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                                    <h3 className={`text-xl font-black ${step.completed ? 'text-slate-400 line-through' : 'text-slate-900'} ${step.isMagic && !step.completed ? 'text-blue-600' : ''}`}>
                                        {step.title}
                                    </h3>
                                    {!step.completed && (
                                        <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold rounded-md w-fit mx-auto md:mx-0 ${step.isMagic ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                                            {step.time}
                                        </span>
                                    )}
                                </div>
                                <p className="text-slate-500 font-medium leading-relaxed max-w-xl">
                                    {step.description}
                                </p>
                            </div>
                            {!step.completed && (
                                <Link
                                    href={step.href}
                                    className={`flex-shrink-0 px-8 py-4 rounded-2xl text-sm font-black transition-all shadow-xl flex items-center gap-3 hover:translate-x-1 ${step.isMagic ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200'}`}
                                >
                                    {step.action} <ArrowRight className="w-4 h-4" />
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
