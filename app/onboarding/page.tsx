'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { Shirt, Sparkles, Monitor, Home, Package, Stethoscope, Zap } from 'lucide-react'
import { verticalMapping, VerticalType } from '@/lib/themes/vertical-mapping'

// Helper to slugify store name
function slugify(text: string) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-')   // Replace multiple - with single -
}

// Reserved slugs that cannot be claimed
const RESERVED_SLUGS = new Set([
    'admin', 'api', 'www', 'app', 'auth', 'login', 'signup', 'register',
    'super-admin', 'checkout', 'cart', 'onboarding', 'maintenance',
    'static', 'assets', 'public', 'private', 'help', 'support',
    'billing', 'settings', 'dashboard', 'store', 'stores',
    'easy-d2c', 'easyd2c', 'bharat-d2c', 'bharatd2c',
    'cdn', 'status', 'track', 'account', 'orders', 'legal',
    'terms', 'privacy', 'refund', 'contact', 'about', 'blog',
    'news', 'press', 'careers', 'jobs', 'dev', 'developer',
    'docs', 'documentation', 'test', 'demo', 'staging', 'prod',
    'production', 'mail', 'email', 'mx', 'smtp', 'pop', 'imap',
    'webmail', 'secure', 'vpn', 'portal', 'client', 'customer',
    'partner', 'affiliate', 'agent', 'support', 'helpdesk',
    'knowledgebase', 'kb', 'faq', 'forum', 'community',
])

export default function OnboardingPage() {
    const router = useRouter()
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
    const [step, setStep] = useState(1)
    const [storeName, setStoreName] = useState('')
    const [storeSlug, setStoreSlug] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabaseBrowser.auth.getUser()
            if (!user) {
                setIsAuthenticated(false)
                return
            }

            // Guard: Super Admins should not be here
            const { data: profile } = await supabaseBrowser
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single()

            if (profile?.role === 'super_admin') {
                router.push('/super-admin')
                return
            }

            setIsAuthenticated(true)
        }
        checkAuth()
    }, [router])


    const [category, setCategory] = useState<VerticalType>('default')

    const CATEGORIES = [
        { id: 'fashion' as VerticalType, label: 'Fashion & Apparel', icon: <Shirt className="w-6 h-6" /> },
        { id: 'beauty' as VerticalType, label: 'Beauty & Wellness', icon: <Sparkles className="w-6 h-6" /> },
        { id: 'tech' as VerticalType, label: 'Electronics & Tech', icon: <Monitor className="w-6 h-6" /> },
        { id: 'health' as VerticalType, label: 'Health & Supplements', icon: <Stethoscope className="w-6 h-6" /> },
        { id: 'dropshipping' as VerticalType, label: 'Trending / Dropshipping', icon: <Zap className="w-6 h-6" /> },
        { id: 'default' as VerticalType, label: 'Other / General', icon: <Package className="w-6 h-6" /> },
    ]

    const handleCreateStore = async () => {
        setLoading(true)
        setError(null)

        // Validate slug is not reserved
        if (RESERVED_SLUGS.has(storeSlug)) {
            setError('This URL is reserved. Please choose a different store URL.')
            setLoading(false)
            return
        }

        // Validate slug length
        if (storeSlug.length < 3) {
            setError('Store URL must be at least 3 characters long.')
            setLoading(false)
            return
        }

        try {
            const { data: { user } } = await supabaseBrowser.auth.getUser()
            if (!user) throw new Error('Not authenticated')

            // 1. Check existing profile
            const { data: existingProfile } = await supabaseBrowser
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single()

            const newRole = existingProfile?.role === 'super_admin' ? 'super_admin' : 'store_owner'

            const { error: profileError } = await supabaseBrowser
                .from('profiles')
                .upsert({
                    id: user.id,
                    email: user.email,
                    role: newRole
                }, { onConflict: 'id' })

            if (profileError) throw profileError

            // 2. Identify the preset config
            const preset = verticalMapping[category] || verticalMapping['default']

            // 3. Create Store with full theme_config based on category
            const { data: store, error: storeError } = await supabaseBrowser
                .from('stores')
                .insert({
                    name: storeName,
                    slug: storeSlug,
                    owner_id: user.id,
                    subscription_plan: 'free',
                    theme_config: {
                        ...preset.theme_config,
                        category, // Keep the category for future mapping updates
                        cro_strategy: preset.cro_strategy // Inject CRO strategy into config
                    },
                    is_active: true
                })
                .select()
                .single()

            if (storeError) {
                if (storeError.code === '23505') {
                    throw new Error('Store URL is already taken. Please choose another.')
                }
                throw storeError
            }

            // 3. Update Profile with store_id
            await supabaseBrowser
                .from('profiles')
                .update({ store_id: store.id })
                .eq('id', user.id)

            // 4. Set Active Store Context for Client
            localStorage.setItem('easy_active_store_id', store.id)
            document.cookie = `easy_active_store_id=${store.id}; path=/; SameSite=Lax; Secure; max-age=${60 * 60 * 24 * 365}`

            // 5. Redirect to Setup for Seeding
            router.push('/admin/setup')

        } catch (err: any) {
            console.error(err)
            setError(err.message || 'Failed to create store')
        } finally {
            setLoading(false)
        }
    }

    if (isAuthenticated === false) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-4">
                <div className="p-8 max-w-sm w-full text-center">
                    <h2 className="text-2xl font-black mb-4 tracking-tight">Access Denied</h2>
                    <p className="text-slate-500 mb-6 font-medium">Please sign in to your founder account to continue.</p>
                    <button
                        onClick={() => router.push('/login')}
                        className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        )
    }

    if (isAuthenticated === null) return null

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-6">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white font-black text-xl mb-6 shadow-xl">
                    E
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                    {step === 1 ? "Name your empire" : "Select your industry"}
                </h2>
                <p className="mt-3 text-sm text-slate-500 font-medium">
                    {step === 1
                        ? "Every great brand starts with a name."
                        : "We'll tailor your dashboard based on what you sell."}
                </p>

                <div className="mt-8 flex justify-center gap-2">
                    <div className={`h-1.5 w-12 rounded-full transition-all ${step === 1 ? 'bg-slate-900' : 'bg-slate-200'}`} />
                    <div className={`h-1.5 w-12 rounded-full transition-all ${step === 2 ? 'bg-slate-900' : 'bg-slate-200'}`} />
                </div>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-10 px-8 shadow-2xl shadow-slate-200/50 rounded-[2.5rem] border border-slate-100">
                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-bold animate-in fade-in slide-in-from-top-1">
                            {error}
                        </div>
                    )}

                    {step === 1 ? (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                                    Store Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={storeName}
                                    onChange={(e) => {
                                        setStoreName(e.target.value)
                                        setStoreSlug(slugify(e.target.value))
                                    }}
                                    className="block w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-slate-900 outline-none transition-all placeholder:text-slate-300"
                                    placeholder="e.g. Lumina Fashion"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                                    Store URL
                                </label>
                                <div className="flex bg-slate-50 rounded-2xl overflow-hidden group focus-within:ring-2 focus-within:ring-slate-900 transition-all">
                                    <input
                                        type="text"
                                        required
                                        value={storeSlug}
                                        onChange={(e) => setStoreSlug(slugify(e.target.value))}
                                        className="flex-1 px-5 py-4 bg-transparent border-none text-sm font-bold outline-none"
                                    />
                                    <span className="px-4 py-4 bg-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                                        .easy-d2c.com
                                    </span>
                                </div>
                                {storeSlug && RESERVED_SLUGS.has(storeSlug) && (
                                    <p className="text-xs text-red-500 font-medium mt-2 ml-1">This URL is reserved. Please choose another.</p>
                                )}
                                {storeSlug && storeSlug.length > 0 && storeSlug.length < 3 && (
                                    <p className="text-xs text-red-500 font-medium mt-2 ml-1">URL must be at least 3 characters.</p>
                                )}
                            </div>

                            <button
                                onClick={() => setStep(2)}
                                disabled={!storeName || !storeSlug || storeSlug.length < 3 || RESERVED_SLUGS.has(storeSlug)}
                                className="w-full flex justify-center py-4 px-4 bg-slate-900 text-white rounded-2xl shadow-xl shadow-slate-200 text-sm font-black hover:bg-slate-800 focus:outline-none transition-all disabled:opacity-50 disabled:translate-y-0 hover:-translate-y-0.5 active:translate-y-0"
                            >
                                Continue To Next Step
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 gap-3">
                                {CATEGORIES.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setCategory(cat.id)}
                                        className={`flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${category === cat.id ? 'border-slate-900 bg-slate-50 shadow-md' : 'border-slate-50 hover:border-slate-200 bg-white'}`}
                                    >
                                        <span className="text-slate-500">{cat.icon}</span>
                                        <span className="text-sm font-bold text-slate-900">{cat.label}</span>
                                        {category === cat.id && (
                                            <div className="ml-auto w-5 h-5 bg-slate-900 rounded-full flex items-center justify-center">
                                                <div className="w-2 h-2 bg-white rounded-full" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setStep(1)}
                                    className="flex-1 py-4 px-4 bg-white border border-slate-200 text-slate-900 rounded-2xl text-sm font-bold hover:bg-slate-50 transition-all"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleCreateStore}
                                    disabled={loading || !category}
                                    className="flex-[2] flex justify-center py-4 px-4 bg-slate-900 text-white rounded-2xl shadow-xl shadow-slate-200 text-sm font-black hover:bg-slate-800 transition-all disabled:opacity-50"
                                >
                                    {loading ? 'Launching Empire...' : 'Create My Store'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
