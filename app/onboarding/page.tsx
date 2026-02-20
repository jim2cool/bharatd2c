'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase-browser'
import {
    Shirt, Sparkles, Monitor, Home, Package, Stethoscope, Zap,
    Layout, Layers, ShoppingCart, Palette, ChevronRight, ChevronLeft,
    CheckCircle2, Store, Globe
} from 'lucide-react'
import { verticalMapping, VerticalType } from '@/lib/themes/vertical-mapping'
import { CommerceArchitecture, CategoryType, StylePreset } from '@/types/architecture'
import { DEFAULT_CONFIG } from '@/components/ThemeProvider'
import { toast } from 'sonner'

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

    // Step 1: Brand
    const [storeName, setStoreName] = useState('')
    const [storeSlug, setStoreSlug] = useState('')

    // Step 2: Architecture
    const [architecture, setArchitecture] = useState<CommerceArchitecture>('product-engine')

    // Step 3: Industry
    const [category, setCategory] = useState<CategoryType>('fashion')

    // Step 4: Style
    const [stylePreset, setStylePreset] = useState<string>('performance-cro')

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabaseBrowser.auth.getUser()
            if (!user) {
                setIsAuthenticated(false)
                return
            }
            setIsAuthenticated(true)
        }
        checkAuth()
    }, [])

    const ARCHITECTURES = [
        {
            id: 'product-engine' as CommerceArchitecture,
            label: 'Product Engine',
            description: 'High-conversion, tech-forward, and fast.',
            icon: <Zap className="w-5 h-5 text-blue-500" />
        },
        {
            id: 'story-first' as CommerceArchitecture,
            label: 'Story First',
            description: 'Focus on branding, lifestyle, and editorial content.',
            icon: <Sparkles className="w-5 h-5 text-purple-500" />
        },
        {
            id: 'catalog-first' as CommerceArchitecture,
            label: 'Catalog First',
            description: 'Structured for multi-category marketplaces.',
            icon: <Layout className="w-5 h-5 text-emerald-500" />
        },
    ]

    const CATEGORIES = [
        { id: 'fashion' as CategoryType, label: 'Fashion & Apparel', icon: <Shirt className="w-5 h-5" /> },
        { id: 'beauty' as CategoryType, label: 'Beauty & Wellness', icon: <Sparkles className="w-5 h-5" /> },
        { id: 'electronics' as CategoryType, label: 'Electronics & Tech', icon: <Monitor className="w-5 h-5" /> },
        { id: 'home' as CategoryType, label: 'Home & Decor', icon: <Home className="w-5 h-5" /> },
        { id: 'dropshipping' as CategoryType, label: 'Trending Dropshipping', icon: <Zap className="w-5 h-5" /> },
        { id: 'marketplace' as CategoryType, label: 'Marketplace', icon: <ShoppingCart className="w-5 h-5" /> },
    ]

    const STYLES = [
        { id: 'performance-cro', label: 'Performance CRO', description: 'Clean, trust-focused blue and white.', background: 'bg-blue-600' },
        { id: 'minimal-editorial', label: 'Minimal / Luxury', description: 'Elegant serifs and airy spacing.', background: 'bg-neutral-900' },
        { id: 'bold-modern', label: 'Bold Modern', description: 'High contrast and vibrant accents.', background: 'bg-orange-500' },
    ]

    const handleCreateStore = async () => {
        setLoading(true)
        setError(null)

        try {
            const { data: { user } } = await supabaseBrowser.auth.getUser()
            if (!user) throw new Error('Not authenticated')

            // 1. Identify preset (Temporary mapping for seed)
            const legacyVertical = (category === 'electronics' ? 'tech' : category === 'home' ? 'default' : category) as VerticalType;
            const preset = verticalMapping[legacyVertical] || verticalMapping['default']

            // 2. Build 4-Layer Config
            const theme_config = {
                ...DEFAULT_CONFIG,
                architecture,
                seller: {
                    ...DEFAULT_CONFIG.seller,
                    urgencyLevel: architecture === 'product-engine' ? 'high' : 'medium',
                    socialProofWeight: 'medium',
                    trustDensity: architecture === 'product-engine' ? 'heavy' : 'medium',
                },
                category: {
                    category,
                    requiredModules: [],
                    optionalModules: [],
                    imageRatio: category === 'fashion' ? '4:5' : '1:1',
                    variantSelectorType: category === 'fashion' ? 'swatch' : 'dropdown'
                },
                // Apply visual style override here based on selection
                // (In a real scenario, we'd lookup the actual preset object)
                style: {
                    ...DEFAULT_CONFIG.style,
                    id: stylePreset.includes('minimal') ? 'minimal' : 'marketplace',
                },
                // Backward Compatibility fields
                category_legacy: category
            }

            // 3. Insert Store
            const { data: store, error: storeError } = await supabaseBrowser
                .from('stores')
                .insert({
                    name: storeName,
                    slug: storeSlug,
                    owner_id: user.id,
                    subscription_plan: 'free',
                    theme_config,
                    is_active: true
                })
                .select()
                .single()

            if (storeError) {
                if (storeError.code === '23505') throw new Error('Store URL taken. Choose another.')
                throw storeError
            }

            // 4. Finalize Profile
            await supabaseBrowser.from('profiles').update({ store_id: store.id, role: 'store_owner' }).eq('id', user.id)
            localStorage.setItem('easy_active_store_id', store.id)
            document.cookie = `easy_active_store_id=${store.id}; path=/; SameSite=Lax; Secure; max-age=${60 * 60 * 24 * 365}`

            router.push('/admin/setup')
        } catch (err: any) {
            setError(err.message || 'Failed to create store')
        } finally {
            setLoading(false)
        }
    }

    if (isAuthenticated === false) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-4">
                <div className="text-center">
                    <h2 className="text-2xl font-black mb-4">Access Denied</h2>
                    <button onClick={() => router.push('/login')} className="px-8 py-3 bg-neutral-900 text-white rounded-xl font-bold">Login</button>
                </div>
            </div>
        )
    }

    if (isAuthenticated === null) return null

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Store Name</label>
                            <div className="relative group">
                                <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="text"
                                    value={storeName}
                                    onChange={(e) => { setStoreName(e.target.value); setStoreSlug(slugify(e.target.value)) }}
                                    className="w-full pl-12 pr-4 py-4 bg-neutral-50 rounded-2xl text-sm font-bold border-2 border-transparent focus:border-blue-500/10 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all"
                                    placeholder="e.g. Lumina Collective"
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Store URL</label>
                            <div className="relative group">
                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300 group-focus-within:text-blue-500 transition-colors" />
                                <div className="flex items-center w-full bg-neutral-50 rounded-2xl border-2 border-transparent focus-within:border-blue-500/10 focus-within:ring-4 focus-within:ring-blue-500/5 transition-all">
                                    <input
                                        type="text"
                                        value={storeSlug}
                                        onChange={(e) => setStoreSlug(slugify(e.target.value))}
                                        className="flex-1 pl-12 pr-2 py-4 bg-transparent text-sm font-bold outline-none"
                                    />
                                    <span className="pr-4 py-4 text-[10px] font-black text-neutral-400 uppercase">.easy-d2c.com</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            case 2:
                return (
                    <div className="grid grid-cols-1 gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {ARCHITECTURES.map((arch) => (
                            <button
                                key={arch.id}
                                onClick={() => setArchitecture(arch.id)}
                                className={`flex items-start gap-4 p-5 rounded-2xl border-2 text-left transition-all ${architecture === arch.id ? 'border-blue-500 bg-blue-50/50 shadow-sm' : 'border-neutral-50 hover:border-neutral-100 bg-white'}`}
                            >
                                <div className={`mt-0.5 p-2 rounded-lg ${architecture === arch.id ? 'bg-blue-500 text-white' : 'bg-neutral-100'}`}>
                                    {arch.icon}
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-black text-neutral-900 leading-tight">{arch.label}</h4>
                                    <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed font-medium">{arch.description}</p>
                                </div>
                                {architecture === arch.id && <CheckCircle2 className="w-5 h-5 text-blue-500" />}
                            </button>
                        ))}
                    </div>
                )
            case 3:
                return (
                    <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setCategory(cat.id)}
                                className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all ${category === cat.id ? 'border-neutral-900 bg-neutral-50' : 'border-neutral-50 hover:border-neutral-100 bg-white'}`}
                            >
                                <div className={`p-3 rounded-full ${category === cat.id ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-400'}`}>
                                    {cat.icon}
                                </div>
                                <span className="text-xs font-black text-neutral-900 text-center">{cat.label}</span>
                            </button>
                        ))}
                    </div>
                )
            case 4:
                return (
                    <div className="grid grid-cols-1 gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {STYLES.map((style) => (
                            <button
                                key={style.id}
                                onClick={() => setStylePreset(style.id)}
                                className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${stylePreset === style.id ? 'border-neutral-900 bg-neutral-50' : 'border-neutral-50 hover:border-neutral-100 bg-white'}`}
                            >
                                <div className={`w-12 h-12 rounded-xl shrink-0 ${style.background} shadow-inner opacity-80`} />
                                <div className="text-left flex-1">
                                    <h4 className="text-sm font-black text-neutral-900">{style.label}</h4>
                                    <p className="text-[10px] text-neutral-400 font-medium">{style.description}</p>
                                </div>
                                {stylePreset === style.id && <CheckCircle2 className="w-5 h-5 text-neutral-900" />}
                            </button>
                        ))}
                    </div>
                )
        }
    }

    return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6 selection:bg-blue-100">
            <div className="w-full max-w-[480px]">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-neutral-900 text-white rounded-[1.25rem] font-black text-2xl shadow-xl shadow-neutral-200 mb-8 border-4 border-white">
                        E
                    </div>
                    <h1 className="text-4xl font-black text-neutral-900 tracking-tight mb-3">
                        {step === 1 ? "Start your vision" : step === 2 ? "Choose architecture" : step === 3 ? "Define industry" : "Pick your vibe"}
                    </h1>
                    <p className="text-sm text-neutral-400 font-medium tracking-wide">
                        {step === 1 ? "The foundation of every empire starts here." : "This determines how your products will be presented."}
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="flex gap-2 mb-10 px-12">
                    {[1, 2, 3, 4].map(s => (
                        <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= s ? 'bg-neutral-900' : 'bg-neutral-200'}`} />
                    ))}
                </div>

                {/* Card Container */}
                <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-neutral-200/50 border border-neutral-100 relative overflow-hidden">
                    {/* Error Banner */}
                    {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-xs font-black uppercase tracking-wider animate-shake">{error}</div>}

                    {/* Step Card */}
                    <div className="min-h-[280px] flex flex-col pt-2">
                        {renderStepContent()}
                    </div>

                    {/* Navigation */}
                    <div className="mt-10 flex gap-3">
                        {step > 1 && (
                            <button
                                onClick={() => setStep(step - 1)}
                                className="h-14 w-14 flex items-center justify-center bg-neutral-50 rounded-2xl hover:bg-neutral-100 transition-colors text-neutral-400"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                        )}
                        <button
                            onClick={() => {
                                if (step === 4) handleCreateStore()
                                else setStep(step + 1)
                            }}
                            disabled={loading || (step === 1 && (!storeName || !storeSlug || storeSlug.length < 3))}
                            className="flex-1 h-14 bg-neutral-900 text-white rounded-2xl font-black text-sm hover:bg-neutral-800 transition-all shadow-xl shadow-neutral-200/50 flex items-center justify-center gap-2 group disabled:opacity-50"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Launching...
                                </span>
                            ) : (
                                <>
                                    {step === 4 ? "Build My Dream" : "Next Movement"}
                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Footer Meta */}
                <p className="text-center mt-12 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-300">
                    &copy; 2026 Easy D2C Platform &bull; Made with High Conversion in mind
                </p>
            </div>
        </div>
    )
}
