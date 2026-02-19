'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getActiveStoreIdClient } from '@/lib/getActiveStore.client'
import { getStoreBaseUrl } from '@/lib/getStoreUrl'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { Globe, ExternalLink, CheckCircle2, Sparkles, Circle, ArrowRight } from 'lucide-react'

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

    type Step = {
        id: string
        title: string
        description: string
        action: string
        time: string
        href: string
        completed: boolean
        isMagic?: boolean
    }

    const steps: Step[] = [
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
        <div className="max-w-6xl mx-auto py-16 px-6 lg:px-12 bg-[#FAFAF9] rounded-[4rem] border border-neutral-200/60 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] mt-8">
            <div className="flex flex-col xl:flex-row gap-16">
                {/* LEFT SIDE: GOAL & PROGRESS */}
                <div className="xl:w-1/3 space-y-12">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-black/10">
                            <Sparkles className="w-3 h-3 text-blue-400" />
                            Fast-Track Launch
                        </div>
                        <h1 className="text-5xl font-black text-neutral-900 tracking-tighter leading-[0.9]">
                            Your shop is nearly <span className="text-blue-600">alive.</span>
                        </h1>
                        <p className="text-neutral-500 font-medium text-lg leading-relaxed">
                            We've automated the heavy lifting. Complete these final nodes to activate your global commerce instance.
                        </p>
                    </div>

                    <div className="p-8 bg-white border border-neutral-100 rounded-[2.5rem] shadow-sm space-y-6 relative overflow-hidden group hover:shadow-xl transition-all duration-500">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-colors" />
                        <div className="flex items-end justify-between">
                            <div className="text-6xl font-black text-neutral-900 tracking-tighter">{progress}%</div>
                            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest pb-2">Launch Readiness</div>
                        </div>
                        <div className="w-full h-3 bg-neutral-100 rounded-full overflow-hidden shadow-inner">
                            <div
                                className="h-full bg-black transition-all duration-1000 ease-in-out relative"
                                style={{ width: `${progress}%` }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                            </div>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                            <p className="text-[11px] font-black text-neutral-900 uppercase tracking-widest leading-none">
                                {completedCount} <span className="text-neutral-300">of</span> {steps.length} <span className="text-neutral-400 ml-1">Nodes Active</span>
                            </p>
                            {progress === 100 && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                        </div>
                    </div>

                    {storeUrl && (
                        <div className="p-6 bg-neutral-900 rounded-[2rem] text-white shadow-2xl relative group overflow-hidden">
                            <div className="absolute bottom-0 right-0 w-24 h-24 bg-blue-500/20 blur-2xl -mb-12 -mr-12" />
                            <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-3">Staging Link</p>
                            <a
                                href={storeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-bold flex items-center gap-2 group-hover:text-blue-400 transition-colors"
                            >
                                < Globe className="w-4 h-4 text-blue-500" />
                                {storeUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                            </a>
                        </div>
                    )}
                </div>

                {/* RIGHT SIDE: STEPS */}
                <div className="xl:w-2/3">
                    <div className="grid grid-cols-1 gap-6">
                        {steps.map((step, i) => (
                            <div
                                key={step.id}
                                onClick={() => !step.completed && router.push(step.href)}
                                className={`group relative p-8 rounded-[2.5rem] border transition-all duration-500 cursor-pointer overflow-hidden ${step.completed
                                    ? 'bg-neutral-50/50 border-neutral-100 grayscale opacity-60'
                                    : 'bg-white border-neutral-200 hover:border-black hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] hover:-translate-y-1'
                                    }`}
                            >
                                <div className="flex items-start gap-8">
                                    <div className="relative flex-shrink-0 pt-1">
                                        {step.completed ? (
                                            <div className="h-14 w-14 bg-black rounded-2xl flex items-center justify-center shadow-lg">
                                                <CheckCircle2 className="w-7 h-7 text-white" />
                                            </div>
                                        ) : (
                                            <div className={`h-14 w-14 rounded-2xl border-2 flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-sm ${step.isMagic
                                                ? 'border-blue-500 bg-blue-50 text-blue-600'
                                                : 'border-neutral-200 bg-neutral-50 text-neutral-400 group-hover:border-black group-hover:text-black'
                                                }`}>
                                                {step.isMagic ? <Sparkles className="w-7 h-7 animate-pulse" /> : <div className="text-lg font-black">{i + 1}</div>}
                                            </div>
                                        )}
                                        {step.isMagic && !step.completed && (
                                            <div className="absolute -top-3 -right-3 px-2 py-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-[8px] font-black text-white rounded-full uppercase tracking-tighter shadow-lg">AI MAGIC</div>
                                        )}
                                    </div>

                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-3">
                                            <h3 className={`text-2xl font-black tracking-tight ${step.completed ? 'text-neutral-400' : 'text-neutral-900 group-hover:text-black'}`}>
                                                {step.title}
                                            </h3>
                                            {!step.completed && (
                                                <div className="px-2.5 py-1 bg-neutral-50 border border-neutral-100 rounded-lg text-[9px] font-black uppercase tracking-widest text-neutral-400 group-hover:text-neutral-900 group-hover:border-neutral-300 transition-colors">
                                                    {step.time}
                                                </div>
                                            )}
                                        </div>
                                        <p className={`text-sm font-medium leading-relaxed max-w-lg ${step.completed ? 'text-neutral-300' : 'text-neutral-500 group-hover:text-neutral-600'}`}>
                                            {step.description}
                                        </p>
                                    </div>

                                    <div className="hidden md:flex flex-shrink-0 items-center justify-center self-center transition-all duration-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-2">
                                        <ArrowRight className={`w-6 h-6 ${step.isMagic ? 'text-blue-600' : 'text-black'}`} />
                                    </div>
                                </div>

                                {/* PROGRESS INDICATOR ON CARD */}
                                {step.isMagic && !step.completed && (
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500/10 overflow-hidden">
                                        <div className="h-full bg-blue-500 w-1/3 animate-[shimmer_2s_infinite]" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
