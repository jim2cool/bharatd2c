import { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Globe,
    ImageIcon,
    FileText,
    ExternalLink,
    CheckCircle2,
    Loader2,
    ArrowRight,
    Save,
    Maximize2,
    Minimize2
} from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm, FormProvider } from 'react-hook-form'
import { ProductFormData } from '../../[id]/useProductEditor'
import { CoreSection, PricingSection, ContentSection, SEOSection, ConversionSection } from '../../components/FormSections'

interface SidePreviewProps {
    step: 'urls' | 'extracting' | 'review' | 'generating' | 'final'
    urls: string[]
    extractedData: any
    setExtractedData: (data: any) => void
    finalContent: any
}

export default function SidePreview({
    step,
    urls,
    extractedData,
    setExtractedData,
    finalContent
}: SidePreviewProps) {
    const router = useRouter()
    const [isSaving, setIsSaving] = useState(false)
    const [isExpanded, setIsExpanded] = useState(false)

    const methods = useForm<ProductFormData>({
        defaultValues: {
            title: '',
            status: 'draft',
            price: 0,
            mrp: 0,
            cogs: 0,
            qty: 100,
            location: 'Warehouse',
            highlights: [],
            content_markup: '',
            images: [],
            testimonials: [],
            bundle_settings: { enabled: true },
            urgency_settings: { enabled: false, type: 'text' },
            cod_enabled: true,
            prepaid_discount_type: 'flat',
        }
    })

    const { handleSubmit, reset, watch, setValue } = methods

    // Sync AI content to form
    useEffect(() => {
        if (finalContent) {
            reset({
                title: finalContent.hero.title || '',
                status: 'draft',
                price: typeof finalContent.hero.price === 'string' ? parseFloat(finalContent.hero.price.replace(/[^0-9.]/g, '')) : finalContent.hero.price || 0,
                mrp: (extractedData?.pricing?.cogs ? parseFloat(extractedData.pricing.cogs) * 1.5 : 0) || 0,
                cogs: parseFloat(extractedData?.pricing?.cogs || '0'),
                qty: 100,
                location: 'Warehouse',
                highlights: finalContent.listing.bullets || [],
                content_markup: finalContent.listing.shortDescription || '',
                images: extractedData?.images || [],
                testimonials: [],
                bundle_settings: { enabled: true },
                urgency_settings: { enabled: false, type: 'text' },
                cod_enabled: true,
                prepaid_discount_type: 'flat',
            })
        }
    }, [finalContent, extractedData, reset])

    const handleSaveAndEdit = async (data: ProductFormData) => {
        setIsSaving(true)
        setIsExpanded(true) // Trigger transition

        try {
            // Map form data to actual submission (handling S3 uploads is done in route.ts)
            const response = await fetch('/api/admin/products/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: {
                        hero: { title: data.title, price: data.price },
                        listing: { shortDescription: data.content_markup, bullets: data.highlights }
                    },
                    specs: extractedData?.specs || {}, // Keep original specs for backup
                    images: data.images, // Use form images
                    pricing: { cogs: data.cogs }
                })
            })

            if (!response.ok) {
                const errData = await response.json()
                throw new Error(errData.message || 'Save failed')
            }

            const { productId } = await response.json()
            toast.success('Product created successfully!', {
                description: 'Finalizing setup...',
                icon: <CheckCircle2 className="w-4 h-4 text-green-500" />
            })

            // Check if we started from onboarding flow to redirect back to dashboard
            const params = new URLSearchParams(window.location.search)
            const isOnboarding = params.get('onboarding') === 'true'

            // Short delay to allow expansion animation to feel natural before nav
            setTimeout(() => {
                if (isOnboarding) {
                    router.push('/admin') // Redirect back to Dashboard to see progress
                } else {
                    router.push(`/admin/products/${productId}`)
                }
            }, 600)

        } catch (error: any) {
            console.error('Save error:', error)
            setIsExpanded(false)
            toast.error('Failed to create product', {
                description: error.message || 'Please check your connection and try again.'
            })
            setIsSaving(false)
        }
    }

    const getProxiedUrl = (url: string) => {
        if (!url) return ''
        if (url.startsWith('http') && (url.includes('amazon') || url.includes('media') || url.includes('shopify'))) {
            return `/api/proxy/image?url=${encodeURIComponent(url)}`
        }
        return url
    }

    if (step === 'urls') {
        return (
            <div className="flex flex-col items-center justify-center h-full p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center">
                    <Globe className="w-8 h-8 text-neutral-400" />
                </div>
                <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-neutral-800">No Data Yet</h3>
                    <p className="text-xs text-neutral-500 font-medium mt-1">Paste URLs in the chat to start generating content.</p>
                </div>
            </div>
        )
    }

    return (
        <motion.div
            layout
            className={`flex flex-col h-full bg-white z-50 transition-all duration-700 ease-in-out overflow-hidden ${isExpanded ? 'fixed inset-0 !w-screen !h-screen rounded-none' : 'relative w-full rounded-[2rem]'
                }`}
        >
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-white shadow-sm z-10">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                        <Save className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                            Preview & Edit
                        </h3>
                        <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-tight">AI Generated Draft</p>
                    </div>
                </div>

                {step === 'final' && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-2 hover:bg-neutral-50 rounded-xl transition-all"
                    >
                        {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </button>
                )}
            </div>

            <FormProvider {...methods}>
                <ScrollArea className="flex-1">
                    <div className={`p-8 space-y-12 ${isExpanded ? 'max-w-6xl mx-auto' : ''}`}>

                        {step === 'final' && finalContent ? (
                            <div className="grid grid-cols-1 gap-10">
                                <CoreSection />
                                <PricingSection />
                                <ContentSection />
                                <SEOSection />
                                <ConversionSection />
                            </div>
                        ) : (
                            <Tabs defaultValue="specs" className="flex flex-col h-full">
                                <TabsList className="grid grid-cols-3 bg-neutral-100/50 rounded-[1.5rem] p-1.5 h-14 mb-8">
                                    <TabsTrigger value="specs" className="rounded-xl text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-lg">
                                        <FileText className="w-3.5 h-3.5 mr-2" />
                                        Specs
                                    </TabsTrigger>
                                    <TabsTrigger value="images" className="rounded-xl text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-lg">
                                        <ImageIcon className="w-3.5 h-3.5 mr-2" />
                                        Images
                                    </TabsTrigger>
                                    <TabsTrigger value="sources" className="rounded-xl text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-lg">
                                        <Globe className="w-3.5 h-3.5 mr-2" />
                                        Sources
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="specs" className="mt-0 space-y-6">
                                    {extractedData?.specs ? (
                                        <div className="space-y-6">
                                            {Object.entries(extractedData.specs).map(([key, value]) => (
                                                <div key={key} className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1 block">{key}</label>
                                                    <p className="text-sm font-bold text-neutral-900">{value as string}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <LoadingPlaceholder label="Crawling specs..." />
                                    )}
                                </TabsContent>

                                <TabsContent value="images" className="mt-0">
                                    {extractedData?.images ? (
                                        <div className="grid grid-cols-2 gap-4">
                                            {extractedData.images.map((img: string, i: number) => (
                                                <div key={i} className="group relative aspect-square rounded-2xl overflow-hidden border border-neutral-100 bg-white hover:border-blue-200 transition-all">
                                                    <Image
                                                        src={getProxiedUrl(img)}
                                                        alt={`Extracted ${i}`}
                                                        fill
                                                        className="object-cover group-hover:scale-110 transition-transform"
                                                        unoptimized
                                                    />
                                                    <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all">
                                                        <CheckCircle2 className="w-3 h-3 text-white" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <LoadingPlaceholder label="Fetching media..." />
                                    )}
                                </TabsContent>

                                <TabsContent value="sources" className="mt-0 space-y-3">
                                    {urls.map((url, i) => (
                                        <div key={i} className="flex items-center justify-between p-5 rounded-3xl border border-neutral-100 bg-white shadow-sm">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                                    <Globe className="w-4 h-4 text-blue-600" />
                                                </div>
                                                <span className="text-xs font-bold truncate text-neutral-600">{url}</span>
                                            </div>
                                            <a href={url} target="_blank" rel="noreferrer" className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-50 transition-all">
                                                <ExternalLink className="w-3.5 h-3.5 text-neutral-400 hover:text-neutral-900" />
                                            </a>
                                        </div>
                                    ))}
                                </TabsContent>
                            </Tabs>
                        )}
                    </div>
                </ScrollArea>

                {step === 'final' && (
                    <div className="p-8 border-t border-neutral-100 bg-white sticky bottom-0 z-20 shadow-[0_-12px_40px_rgba(0,0,0,0.06)]">
                        <button
                            onClick={handleSubmit(handleSaveAndEdit)}
                            disabled={isSaving}
                            className={`w-full rounded-2xl h-16 gap-3 transition-all flex items-center justify-center font-black uppercase tracking-[0.1em] text-xs ${isSaving
                                ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-100 hover:-translate-y-1'
                                }`}
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Creating Product...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Create Product & Edit
                                    <ArrowRight className="w-5 h-5 ml-1" />
                                </>
                            )}
                        </button>
                    </div>
                )}
            </FormProvider>
        </motion.div>
    )
}

function LoadingPlaceholder({ label }: { label: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 animate-pulse">{label}</span>
        </div>
    )
}
