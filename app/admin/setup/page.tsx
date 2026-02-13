'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { getActiveStoreIdClient } from '@/lib/getActiveStore.client'
import { getStoreBaseUrl } from '@/lib/getStoreUrl'
import { Sparkles, Check, Loader2, Globe, ArrowRight, LayoutDashboard } from 'lucide-react'

export default function SetupPage() {
    const router = useRouter()
    const [status, setStatus] = useState<'loading' | 'seeding' | 'finishing'>('loading')
    const [progress, setProgress] = useState(0)
    const [message, setMessage] = useState('Initializing your empire...')
    const [storeUrl, setStoreUrl] = useState('')

    useEffect(() => {
        const runSetup = async () => {
            const storeId = getActiveStoreIdClient()
            if (!storeId) {
                router.replace('/onboarding')
                return
            }

            try {
                // 1. Get Store Category
                setStatus('seeding')
                setMessage('Curating your brand identity...')
                const { data: store } = await supabaseBrowser
                    .from('stores')
                    .select('theme_config')
                    .eq('id', storeId)
                    .single()

                const category = store?.theme_config?.category || 'other'
                const preset = CATEGORY_PRESETS[category] || CATEGORY_PRESETS['other']

                // 2. Apply Theme Preset
                setProgress(30)
                await new Promise(r => setTimeout(r, 800))
                setMessage('Applying premium design tokens...')

                await supabaseBrowser
                    .from('stores')
                    .update({ theme_config: preset })
                    .eq('id', storeId)

                // 2b. Fetch Store URL for display
                const url = await getStoreBaseUrl(supabaseBrowser)
                setStoreUrl(url)

                // 3. (Optional) Could seed demo products here if needed
                setProgress(70)
                setMessage('Polishing your storefront...')
                await new Promise(r => setTimeout(r, 1000))

                setProgress(100)
                setStatus('finishing')
                setMessage('Your empire is ready.')
            } catch (err) {
                console.error('Setup failed', err)
                router.push('/admin') // Fallback to dashboard
            }
        }

        runSetup()
    }, [router])

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
            <div className="max-w-md w-full">
                <div className="relative mb-12">
                    <div className="absolute inset-0 bg-blue-100 rounded-full blur-3xl opacity-30 animate-pulse" />
                    <div className="relative h-24 w-24 bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-slate-200">
                        {status === 'finishing' ? (
                            <Check className="w-10 h-10 text-white animate-in zoom-in duration-500" />
                        ) : (
                            <Sparkles className="w-10 h-10 text-white animate-pulse" />
                        )}
                    </div>
                </div>

                <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-4">
                    {status === 'finishing' ? "Welcome home." : "Preparing your store"}
                </h1>

                <p className="text-slate-500 font-medium mb-10 h-6">
                    {message}
                </p>

                <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden mb-4">
                    <div
                        className="h-full bg-slate-900 transition-all duration-700 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                    <span>{progress}% Complete</span>
                    <div className="flex items-center gap-1.5">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Live Sync
                    </div>
                </div>

                {status === 'finishing' && (
                    <div className="mt-12 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-both delay-500">
                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 mb-8">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Your Live Storefront</p>
                            <div className="flex items-center justify-center gap-2 text-slate-900 font-bold mb-4">
                                <Globe className="w-4 h-4 text-blue-500" />
                                {storeUrl.replace(/^https?:\/\//, '')}
                            </div>
                            <a
                                href={storeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-900 rounded-2xl text-xs font-black shadow-sm hover:bg-slate-50 transition-all"
                            >
                                Visit Store <ArrowRight className="w-3.5 h-3.5" />
                            </a>
                        </div>

                        <button
                            onClick={() => router.push('/admin')}
                            className="w-full flex justify-center items-center gap-2 py-4 px-4 bg-slate-900 text-white rounded-2xl shadow-xl shadow-slate-200 text-sm font-black hover:bg-slate-800 focus:outline-none transition-all hover:-translate-y-0.5"
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            Go To Dashboard
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
