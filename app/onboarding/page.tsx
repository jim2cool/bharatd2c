'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase-browser'
import {
    ChevronRight,
    ChevronLeft,
    Store,
    Globe,
    Zap,
    Target,
    TrendingUp,
    Hammer,
    Building2,
    ShoppingCart,
    Instagram,
    MessageSquare,
    Search,
    Megaphone,
    Share2,
    Mail,
    CircleHelp,
    Package,
    Gift,
    Home,
    Smartphone,
    Heart,
    Flame,
    Armchair,
    Utensils,
    Truck,
    Layers,
    User,
    Diamond,
    Palette,
    Dog,
    Baby,
    Notebook,
    Car,
    Dumbbell,
    Leaf,
    Monitor,
    Calendar,
    RotateCcw,
    Stethoscope,
    Briefcase,
    ShieldCheck,
    Clock,
    RefreshCw,
    Ruler,
    Sparkles,
    FlaskConical,
    CheckCircle2,
    Rocket,
    Circle,
    Wallet,
    Crown,
    Star,
    Users,
    Compass,
    MessageSquareText,
    Banknote
} from 'lucide-react'
import { DEFAULT_CONFIG } from '@/components/ThemeProvider'

// Helper to slugify store name
function slugify(text: string) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
}

// Icon Mapping Helper
function getIconForValue(value: string) {
    const iconMap: Record<string, any> = {
        // Archetypes
        maker: Hammer,
        established_biz: Building2,
        reseller: ShoppingCart,
        social_seller: Instagram,
        marketplace: Layers,
        dropshipper: Truck,
        new_brand: Zap,
        passion_knowledge: Target,
        family_biz: Home,
        nri_exporter: Globe,

        // Categories
        fashion: User,
        beauty: Sparkles,
        electronics: Smartphone,
        home: Home,
        health: Heart,
        spiritual: Flame,
        furniture: Armchair,
        food: Utensils,
        jewellery: Diamond,
        art: Palette,
        pets: Dog,
        baby: Baby,
        stationery: Notebook,
        automotive: Car,
        sports: Dumbbell,
        gardening: Leaf,
        digital: Monitor,
        experience: Calendar,
        renewed: RotateCcw,
        consultation: Briefcase,
        multi: Package,
        dropshipping: Truck,
        marketplace_node: Layers,
        b2b: Building2,

        // Maturity/Revenue
        not_started: Clock,
        testing: FlaskConical,
        regular: TrendingUp,
        consistent: CheckCircle2,
        scaling: Rocket,
        nothing: Circle,
        under_50k: TrendingUp,
        '50k_2l': TrendingUp,

        // Goals
        side_income: Wallet,
        full_time: Briefcase,
        serious_scale: Rocket,
        already_serious: Crown,

        // Intent
        max_orders: ShoppingCart,
        build_brand: Star,
        own_customers: Users,
        look_professional: ShieldCheck,
        repeat_customers: RefreshCw,
        reach_new: Compass,
        tell_story: MessageSquareText,
        save_commission: Banknote,
        gifting_focus: Gift,
        wholesale_retail: Building2,

        // Traffic
        instagram_facebook: Instagram,
        whatsapp: MessageSquare,
        google_search: Search,
        paid_ads: Megaphone,
        marketplace_redirect: Layers,
        word_of_mouth: Share2,
        email_sms: Mail,
        unsure: CircleHelp
    }

    return iconMap[value] || Package
}

export default function OnboardingPage() {
    const router = useRouter()
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
    const [user, setUser] = useState<any>(null)

    // Store Info
    const [storeName, setStoreName] = useState('')
    const [storeSlug, setStoreSlug] = useState('')

    // Questions State
    const [questions, setQuestions] = useState<any[]>([])
    const [currentStepIndex, setCurrentStepIndex] = useState(-1) // -1 is Store Info step
    const [answers, setAnswers] = useState<Record<string, any>>({})

    const [loading, setLoading] = useState(false)
    const [fetchingQuestions, setFetchingQuestions] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabaseBrowser.auth.getUser()
            if (!user) {
                setIsAuthenticated(false)
                return
            }
            setUser(user)
            setIsAuthenticated(true)
            fetchQuestions()
        }
        checkAuth()
    }, [])

    const fetchQuestions = async () => {
        try {
            const { data, error } = await supabaseBrowser
                .from('ob_onboarding_questions')
                .select('*')
                .order('input_number', { ascending: true })

            if (error) throw error

            // Re-order slightly to ensure Q2_1 comes before Q2_2, etc. (they share input_number=2)
            const sorted = data.sort((a, b) => {
                if (a.input_number === b.input_number) {
                    return a.question_id.localeCompare(b.question_id)
                }
                return a.input_number - b.input_number
            })
            setQuestions(sorted)
        } catch (err: any) {
            console.error(err)
            setError("Failed to load onboarding questions.")
        } finally {
            setFetchingQuestions(false)
        }
    }

    const currentQuestion = useMemo(() => {
        if (currentStepIndex >= 0 && currentStepIndex < questions.length) {
            return questions[currentStepIndex]
        }
        return null
    }, [currentStepIndex, questions])

    const currentOptions = useMemo(() => {
        if (!currentQuestion) return []

        // Handle conditional options (like Q2_2 which depends on Q2_1)
        if (currentQuestion.question_type === 'conditional' && Array.isArray(currentQuestion.options) && currentQuestion.options.length > 0 && currentQuestion.options[0].parent) {
            // Find parent answer. Usually it's the previous question's answer in the same category
            // e.g., Q2_2 depends on Q2_1. Both might be named 'Product Type'
            const parentAnswer = answers['Q2_1']
            if (parentAnswer) {
                const group = currentQuestion.options.find((opt: any) => opt.parent === parentAnswer)
                return group ? group.options : []
            }
        }
        return currentQuestion.options || []
    }, [currentQuestion, answers])

    const handleSelectOption = (value: string) => {
        if (!currentQuestion) return

        if (currentQuestion.answer_format === 'multi_select') {
            const currentAnswers = Array.isArray(answers[currentQuestion.question_id])
                ? answers[currentQuestion.question_id]
                : []

            const newAnswers = currentAnswers.includes(value)
                ? currentAnswers.filter((v: string) => v !== value)
                : [...currentAnswers, value]

            setAnswers(prev => ({
                ...prev,
                [currentQuestion.question_id]: newAnswers
            }))
        } else {
            setAnswers(prev => ({
                ...prev,
                [currentQuestion.question_id]: value
            }))
            // Auto advance for single select
            setTimeout(() => {
                handleNext()
            }, 300)
        }
    }

    const handleNext = () => {
        // Validation: ensure at least one option is selected for multi_select
        if (currentQuestion?.answer_format === 'multi_select') {
            const currentAnswers = answers[currentQuestion.question_id]
            if (!Array.isArray(currentAnswers) || currentAnswers.length === 0) {
                setError("Please select at least one option to continue.")
                return
            }
            setError(null)
        }

        if (currentStepIndex < questions.length - 1) {
            setCurrentStepIndex(prev => prev + 1)
        } else {
            handleComplete()
        }
    }

    const handleBack = () => {
        if (currentStepIndex >= 0) {
            setCurrentStepIndex(prev => prev - 1)
        }
    }

    const handleComplete = async () => {
        setLoading(true)
        setError(null)

        try {
            if (!user) throw new Error('Not authenticated')

            // 1. Ensure Profile Exists (Fixes the stores_owner_id_fkey constraint)
            const { error: profileCheckError } = await supabaseBrowser.from('profiles').upsert({
                id: user.id,
                email: user.email,
                role: 'store_owner'
            })
            if (profileCheckError) throw profileCheckError

            // 2. Insert Store
            const theme_config = {
                ...DEFAULT_CONFIG,
                // Default style preset
                style: { ...DEFAULT_CONFIG.style, id: 'Minimal' }
            }

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

            // 3. Derive Authoritative Fields from Answers
            // See EasyD2C_Architecture_Evolution_Handoff.md

            // Q1_1 What's your deal -> archetype_cluster mapping heuristic
            const q1_1 = answers['Q1_1'] || 'reseller'
            let archetype_cluster = 'digital_native'
            if (q1_1 === 'maker' || q1_1 === 'family_biz') archetype_cluster = 'craft_maker'
            else if (q1_1 === 'passion_knowledge') archetype_cluster = 'knowledge_expert'
            else if (q1_1 === 'dropshipper') archetype_cluster = 'dropshipper'
            else if (q1_1 === 'established_biz') archetype_cluster = 'established_operator'

            // Q2_1 Category
            const primary_category = answers['Q2_1'] || 'multi'

            // Q2_3 Product count -> commerce_architecture
            const product_count = answers['Q2_3'] || '4_20'
            const q4_1 = answers['Q4_1'] || 'max_orders' // Intent

            let commerce_architecture = 'product_engine'
            if (product_count === '100_plus') {
                commerce_architecture = 'catalog_first'
            } else if (q4_1 === 'tell_story' || q4_1 === 'build_brand') {
                commerce_architecture = 'story_first'
            }

            // Q4_2 Mood card
            const mood_card_selected = answers['Q4_2'] || 'Minimal'
            const expression_profile = mood_card_selected
            const design_token_preset = mood_card_selected

            // Q6_3 Hesitation
            const primary_hesitation = answers['Q6_3'] || 'unknown_brand'

            // Derive urgency and trust density
            const urgency_level = commerce_architecture === 'product_engine' ? 'high' : 'medium'
            const trust_density = primary_hesitation.includes('trust') || primary_hesitation === 'unknown_brand' ? 'heavy' : 'medium'
            const cta_prominence = commerce_architecture === 'story_first' ? 'balanced' : 'dominant'
            const density_scale = 'balanced'
            const cod_bias = primary_hesitation === 'cod_barrier'

            // 4. Fetch optimal persuasion sequence from engine
            let persuasion_sequence_id = null

            // Primary lookup
            const { data: psPrimary } = await supabaseBrowser
                .from('ob_persuasion_sequences')
                .select('id')
                .eq('primary_hesitation', primary_hesitation)
                .eq('archetype_cluster', archetype_cluster)
                .limit(1)
                .maybeSingle()

            if (psPrimary) {
                persuasion_sequence_id = psPrimary.id
            } else {
                // Fallback lookup
                const { data: psFallback } = await supabaseBrowser
                    .from('ob_persuasion_sequences')
                    .select('id')
                    .eq('primary_hesitation', primary_hesitation)
                    .order('archetype_cluster', { ascending: false })
                    .limit(1)
                    .maybeSingle()

                if (psFallback) persuasion_sequence_id = psFallback.id
            }

            // Q2_5 Variations
            const variant_types = Array.isArray(answers['Q2_5']) ? answers['Q2_5'] : [answers['Q2_5'] || 'none']
            const has_variants = variant_types.length > 0 && !variant_types.includes('none')

            // 5. Insert Intelligence Profile
            const { error: profileError } = await supabaseBrowser
                .from('ob_seller_profiles')
                .insert({
                    store_id: store.id,
                    archetype_name: 'New Seller Profile',
                    archetype_cluster,
                    archetype_confidence_pct: 85,
                    primary_category,
                    commerce_architecture,
                    expression_profile,
                    urgency_level,
                    trust_density,
                    cta_prominence,
                    density_scale,
                    cod_bias,
                    has_variants,
                    variant_types,
                    buyer_identity: [answers['Q6_1'] || 'self_buyer'],
                    purchase_motivations: Array.isArray(answers['Q6_2']) ? answers['Q6_2'] : [answers['Q6_2'] || 'quality'],
                    customer_hesitations: [primary_hesitation],
                    primary_hesitation,
                    traffic_sources: Array.isArray(answers['Q6_4']) ? answers['Q6_4'] : [answers['Q6_4'] || 'unsure'],
                    first_impression_architecture: 'visual_first',
                    persuasion_sequence_id,
                    design_token_preset,
                    mood_card_selected,
                    maturity_score: 3.0,
                    site_complexity_tier: product_count === '100_plus' ? 3 : (product_count === '1_3' ? 1 : 2),
                    ux_page_list: ['home', 'product', 'category'],
                    onboarding_version: '1.0',
                    raw_answers: answers
                });

            if (profileError) {
                console.error('Error creating seller profile:', profileError);
            }

            // 6. Trigger Store Render Config Computation
            // This is the core engine function as per architecture handoff
            const { error: rpcError } = await supabaseBrowser.rpc('compute_store_render_config', { p_store_id: store.id });
            if (rpcError) {
                console.error("RPC Error:", rpcError);
            }

            // 7. Seed Dummy Content for Magic Moment preview - Integrated AI Generation
            try {
                const aiRes = await fetch('/api/admin/generate-content', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        storeId: store.id,
                        storeName: storeName,
                        category: primary_category
                    })
                });
                const aiData = await aiRes.json();

                if (!aiRes.ok || !aiData.success) {
                    throw new Error('AI Generation failed or skipped');
                }
            } catch (aiErr) {
                console.warn('AI generation skipped, using fallback seeds:', aiErr);
                // Ensure site does not look empty on first view
                await supabaseBrowser.from('ob_seller_profiles')
                    .update({
                        content_seeds: {
                            brand_name: storeName,
                            product_name: primary_category === 'fashion' ? 'Signature Collection' : 'Premium Range',
                        }
                    })
                    .eq('store_id', store.id);
            }

            // 8. Set active store cookies and proceed
            localStorage.setItem('easy_active_store_id', store.id)
            document.cookie = `easy_active_store_id=${store.id}; path=/; SameSite=Lax; Secure; max-age=${60 * 60 * 24 * 365}`

            router.push('/admin/setup')
        } catch (err: any) {
            setError(err.message || 'Failed to complete onboarding')
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

    if (isAuthenticated === null || fetchingQuestions) {
        return (
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    // Step -1: Store Name & Slug
    if (currentStepIndex === -1) {
        return (
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6 selection:bg-blue-100">
                <div className="w-full max-w-[480px]">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-neutral-900 text-white rounded-[1.25rem] font-black text-2xl shadow-xl shadow-neutral-200 mb-8 border-4 border-white">
                            E
                        </div>
                        <h1 className="text-4xl font-black text-neutral-900 tracking-tight mb-3">
                            Create your store
                        </h1>
                        <p className="text-sm text-neutral-400 font-medium tracking-wide">
                            What are we building today?
                        </p>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-neutral-200/50 border border-neutral-100">
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

                        <div className="mt-10 flex gap-3">
                            <button
                                onClick={handleNext}
                                disabled={!storeName || storeSlug.length < 3}
                                className="flex-1 h-14 bg-neutral-900 text-white rounded-2xl font-black text-sm hover:bg-neutral-800 transition-all shadow-xl shadow-neutral-200/50 flex items-center justify-center gap-2 group disabled:opacity-50"
                            >
                                Continue
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const currentPercent = ((currentStepIndex + 1) / questions.length) * 100

    return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6 selection:bg-blue-100">
            <div className="w-full max-w-[560px]">
                {/* Header */}
                <div className="text-center mb-10 mt-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-neutral-900 text-white rounded-[1rem] font-black text-xl shadow-xl shadow-neutral-200 mb-6 border-4 border-white">
                        {currentQuestion?.input_number || 'E'}
                    </div>
                    <h1 className="text-3xl font-black text-neutral-900 tracking-tight mb-2">
                        {currentQuestion?.question_english}
                    </h1>
                    <p className="text-sm text-neutral-400 font-medium tracking-wide">
                        {currentQuestion?.input_name}
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="flex gap-2 mb-8 px-6">
                    <div className="h-1.5 w-full bg-neutral-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-neutral-900 transition-all duration-500 ease-out"
                            style={{ width: `${currentPercent}%` }}
                        />
                    </div>
                </div>

                {/* Card Container */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-neutral-200/50 border border-neutral-100 relative overflow-hidden">
                    {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-xs font-black uppercase tracking-wider animate-shake">{error}</div>}

                    {/* Step Card */}
                    <div className="min-h-[300px] flex flex-col pt-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        {currentOptions.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center">
                                <p className="text-neutral-500 font-medium mb-4">No specific options for this selection.</p>
                                <button
                                    onClick={() => {
                                        setAnswers(prev => ({ ...prev, [currentQuestion?.question_id as string]: 'skip' }))
                                        handleNext()
                                    }}
                                    className="px-6 py-3 bg-neutral-100 rounded-full text-sm font-bold hover:bg-neutral-200"
                                >
                                    Skip Component
                                </button>
                            </div>
                        ) : (
                            <div className={`grid gap-3 ${currentOptions.length > 6 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                                {currentOptions.map((opt: any, idx: number) => {
                                    const currentValues = answers[currentQuestion?.question_id as string]
                                    const isSelected = Array.isArray(currentValues)
                                        ? currentValues.includes(opt.value)
                                        : currentValues === opt.value

                                    // Visual layout rules
                                    const hasDesc = !!opt.desc
                                    const hasSub = !!opt.sub
                                    const hasEnglish = !!opt.english

                                    if (hasDesc) {
                                        // Mood card style or detailed style
                                        return (
                                            <button
                                                key={opt.value + idx}
                                                onClick={() => handleSelectOption(opt.value)}
                                                className={`flex flex-col gap-2 p-5 rounded-2xl border-2 text-left transition-all ${isSelected ? 'border-neutral-900 bg-neutral-50 ring-4 ring-neutral-900/5' : 'border-neutral-50 hover:border-neutral-100 bg-white'}`}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <h4 className="text-sm font-black text-neutral-900 leading-tight">{opt.label}</h4>
                                                    {isSelected && <CheckCircle2 className="w-4 h-4 text-neutral-900" />}
                                                </div>
                                                {hasEnglish && <span className="text-xs text-blue-600 font-semibold">{opt.english}</span>}
                                                <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed font-medium line-clamp-2">{opt.desc}</p>
                                            </button>
                                        )
                                    }

                                    return (
                                        <button
                                            key={opt.value + idx}
                                            onClick={() => handleSelectOption(opt.value)}
                                            className={`flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${isSelected ? 'border-neutral-900 bg-neutral-50 ring-4 ring-neutral-900/5' : 'border-neutral-50 hover:border-neutral-100 bg-white'}`}
                                        >
                                            <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center transition-colors ${isSelected ? 'bg-neutral-900 text-white' : 'bg-neutral-50 text-neutral-900 group-hover:bg-neutral-100'}`}>
                                                {(() => {
                                                    const Icon = getIconForValue(opt.value)
                                                    return <Icon className="w-5 h-5" />
                                                })()}
                                            </div>
                                            <div className="flex-1">
                                                {hasSub && <span className="text-[10px] uppercase font-black tracking-widest text-neutral-400 block mb-0.5">{opt.sub}</span>}
                                                <h4 className="text-[13px] font-black text-neutral-900 leading-tight">{opt.label}</h4>
                                                {hasEnglish && <p className="text-[11px] text-neutral-500 mt-0.5 font-medium">{opt.english}</p>}
                                            </div>
                                            {isSelected && <CheckCircle2 className="w-5 h-5 text-neutral-900" />}
                                        </button>
                                    )
                                })}
                            </div>
                        )}
                    </div>

                    {/* Navigation */}
                    <div className="mt-8 flex gap-3">
                        <button
                            onClick={handleBack}
                            className="h-14 w-14 flex shrink-0 items-center justify-center bg-neutral-50 rounded-2xl hover:bg-neutral-100 transition-colors text-neutral-400"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>

                        <button
                            onClick={handleNext}
                            disabled={loading || (currentQuestion?.answer_format === 'multi_select'
                                ? (!Array.isArray(answers[currentQuestion?.question_id as string]) || answers[currentQuestion?.question_id as string].length === 0)
                                : !answers[currentQuestion?.question_id as string])}
                            className={`flex-1 h-14 bg-neutral-900 text-white rounded-2xl font-black text-sm hover:bg-neutral-800 transition-all shadow-xl shadow-neutral-200/50 flex items-center justify-center gap-2 group disabled:opacity-50`}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Initialising...
                                </span>
                            ) : (
                                <>
                                    {currentStepIndex === questions.length - 1 ? "Launch Your Store" : (currentQuestion?.answer_format === 'multi_select' ? "Confirm & Continue" : "Continue")}
                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <p className="text-center mt-10 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-300">
                    &copy; 2026 Easy D2C Platform &bull; Made with High Conversion in mind
                </p>
            </div>
        </div>
    )
}
