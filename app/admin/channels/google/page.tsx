"use client"

import { useState, useEffect } from "react"
import { supabaseBrowser } from "@/lib/supabase-browser"
import { Save, CheckCircle, AlertCircle, Link as LinkIcon } from "lucide-react"

export default function GoogleChannelPage() {
    const supabase = supabaseBrowser
    const [storeId, setStoreId] = useState<string | null>(null)
    const [domain, setDomain] = useState<string>("")
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle")

    const [isActive, setIsActive] = useState(false)
    const [ga4Id, setGa4Id] = useState("")
    const [apiSecret, setApiSecret] = useState("")

    useEffect(() => {
        async function loadData() {
            // 1. Get current store
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data: storeRole } = await supabase
                .from('store_roles')
                .select('store_id, stores(custom_domain, subdomain)')
                .eq('user_id', user.id)
                .single()

            if (!storeRole) return

            const sid = storeRole.store_id
            setStoreId(sid)

            const sData = storeRole.stores as any
            setDomain(sData?.custom_domain || `${sData?.subdomain}.easyd2c.com`)

            // 2. Load Google Config
            const { data: config } = await supabase
                .from('sales_channels_config')
                .select('*')
                .eq('store_id', sid)
                .single()

            if (config) {
                setIsActive(config.google_is_active)
                setGa4Id(config.ga4_measurement_id || "")
                // We're conceptually re-using the capi token field for GA4 Secret to save db columns in V1
                setApiSecret(config.meta_capi_token || "")
            }

            setIsLoading(false)
        }

        loadData()
    }, [supabase])

    const handleSave = async () => {
        if (!storeId) return
        setIsSaving(true)
        setSaveStatus("idle")

        const { error } = await supabase
            .from('sales_channels_config')
            .upsert({
                store_id: storeId,
                google_is_active: isActive,
                ga4_measurement_id: ga4Id,
                // meta_capi_token: apiSecret, // Deliberately NOT saving this if it overwrites Meta. 
                // NOTE: In a true V1.1 we need a dedicated `ga4_api_secret` column. 
                // For this V1.0 UI, we just save the GA4 ID and enable tracking.
            }, { onConflict: 'store_id' })

        setIsSaving(false)
        if (error) {
            console.error(error)
            setSaveStatus("error")
        } else {
            setSaveStatus("success")
            setTimeout(() => setSaveStatus("idle"), 3000)
        }
    }

    const isSubdomain = domain.includes("easyd2c.com")
    // Note: We haven't built the google-catalog.xml feed yet, but laying the foundation.
    const catalogUrl = `https://${domain}/api/feeds/${storeId}/google-catalog.xml`

    if (isLoading) return <div className="p-8 text-gray-500">Loading channel settings...</div>

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Google (Ads, Analytics, Merchant)</h1>
                    <p className="text-gray-500 mt-1">Connect your store to Google to run Shopping Ads and track performance.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm disabled:opacity-50 transition-all"
                >
                    {isSaving ? <span className="animate-spin border-2 border-white/20 border-t-white rounded-full w-4 h-4" /> : <Save className="w-4 h-4" />}
                    {saveStatus === "success" ? "Saved!" : "Save Changes"}
                </button>
            </div>

            {/* Main Connection Card */}
            <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b bg-gray-50/50 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Connection Status</h2>
                        <p className="text-sm text-gray-500">Enable Google Analytics (GA4) traffic and commerce tracking.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>

                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* Inputs */}
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">GA4 Measurement ID</label>
                                <input
                                    type="text"
                                    value={ga4Id}
                                    onChange={(e) => setGa4Id(e.target.value)}
                                    placeholder="e.g. G-XW12345ABC"
                                    className="w-full px-4 py-2 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                                />
                                <p className="text-xs text-gray-500 mt-2">Find this in your Google Analytics Data Streams.</p>
                            </div>

                        </div>

                        {/* Instructions */}
                        <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-5">
                            <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-blue-600" />
                                Guided Setup
                            </h3>
                            <ol className="text-sm text-blue-800 space-y-3 ml-4 list-decimal marker:text-blue-400">
                                <li>Go to <strong>Google Analytics</strong> &gt; Admin.</li>
                                <li>Click on <strong>Data collection and modification</strong> &gt; Data Streams.</li>
                                <li>Select your web stream.</li>
                                <li>Copy the <strong>Measurement ID</strong> that starts with "G-".</li>
                                <li>Paste it here and save. You are now tracking all events!</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>

            {/* Catalog Sync Card */}
            <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b">
                    <h2 className="text-lg font-semibold text-gray-900">Google Merchant Center Feed (Preview)</h2>
                    <p className="text-sm text-gray-500 mt-1">Automatically sync your products for Google Shopping Ads.</p>
                </div>

                <div className="p-6">
                    {isSubdomain ? (
                        <div className="flex gap-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                            <div>
                                <h4 className="text-sm font-medium text-amber-900">Custom Domain Required</h4>
                                <p className="text-sm text-amber-700 mt-1">
                                    Google Merchant Center requires domain verification. You are currently using a free subdomain (<code>{domain}</code>) which cannot be verified by Google.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-sm text-gray-600">
                                This feature requires the Merchant Center XML Feed Generator to be built out in the upcoming infrastructure update.
                            </p>
                        </div>
                    )}
                </div>
            </div>

        </div>
    )
}
