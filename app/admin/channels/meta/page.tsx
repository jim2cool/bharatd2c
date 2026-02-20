"use client"

import { useState, useEffect } from "react"
import { supabaseBrowser } from "@/lib/supabase-browser"
import { Save, CheckCircle, AlertCircle, Link as LinkIcon, Download } from "lucide-react"

export default function MetaChannelPage() {
    const supabase = supabaseBrowser
    const [storeId, setStoreId] = useState<string | null>(null)
    const [domain, setDomain] = useState<string>("")
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle")

    const [isActive, setIsActive] = useState(false)
    const [pixelId, setPixelId] = useState("")
    const [capiToken, setCapiToken] = useState("")

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

            // 2. Load Meta Config
            const { data: config } = await supabase
                .from('sales_channels_config')
                .select('*')
                .eq('store_id', sid)
                .single()

            if (config) {
                setIsActive(config.meta_is_active)
                setPixelId(config.meta_pixel_id || "")
                setCapiToken(config.meta_capi_token || "")
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
                meta_is_active: isActive,
                meta_pixel_id: pixelId,
                meta_capi_token: capiToken,
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
    const catalogUrl = `https://${domain}/api/feeds/${storeId}/meta-catalog.xml`

    if (isLoading) return <div className="p-8 text-gray-500">Loading channel settings...</div>

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Meta (Facebook & Instagram)</h1>
                    <p className="text-gray-500 mt-1">Connect your store to Meta to run ads and sync your product catalog.</p>
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
                        <p className="text-sm text-gray-500">Enable advanced tracking bridging Browser and Server signals.</p>
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Pixel ID</label>
                                <input
                                    type="text"
                                    value={pixelId}
                                    onChange={(e) => setPixelId(e.target.value)}
                                    placeholder="e.g. 102938475610293"
                                    className="w-full px-4 py-2 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                                />
                                <p className="text-xs text-gray-500 mt-2">Tracks basic browsing actions on your storefront.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Conversions API Token</label>
                                <textarea
                                    value={capiToken}
                                    onChange={(e) => setCapiToken(e.target.value)}
                                    placeholder="Paste your System User Access Token..."
                                    className="w-full px-4 py-2 bg-gray-50 border rounded-lg h-24 font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                                />
                                <p className="text-xs text-gray-500 mt-2">Required to bypass Ad-Blockers and iOS 14 restrictions.</p>
                            </div>
                        </div>

                        {/* Instructions */}
                        <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-5">
                            <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-blue-600" />
                                Guided Setup
                            </h3>
                            <ol className="text-sm text-blue-800 space-y-3 ml-4 list-decimal marker:text-blue-400">
                                <li>Go to <strong>Meta Business Manager</strong> &gt; Data Sources.</li>
                                <li>Copy your 15-digit Pixel ID.</li>
                                <li>Navigate to the <strong>Settings</strong> tab of your Pixel.</li>
                                <li>Scroll down to Conversions API and click <strong>Generate access token</strong>.</li>
                                <li>Paste both values here and save.</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>

            {/* Catalog Sync Card */}
            <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b">
                    <h2 className="text-lg font-semibold text-gray-900">Product Catalog Sync</h2>
                    <p className="text-sm text-gray-500 mt-1">Automatically sync your products to Facebook Shops and Instagram.</p>
                </div>

                <div className="p-6">
                    {isSubdomain ? (
                        <div className="flex gap-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                            <div>
                                <h4 className="text-sm font-medium text-amber-900">Custom Domain Required</h4>
                                <p className="text-sm text-amber-700 mt-1">
                                    Meta requires you to verify your domain before creating a shop. You are currently using a free subdomain (<code>{domain}</code>) which cannot be verified by Meta.
                                </p>
                                <button className="mt-3 text-sm font-medium text-amber-800 underline hover:text-amber-900">
                                    Connect Custom Domain &rarr;
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-sm text-gray-600">
                                Copy this URL and paste it into Meta Commerce Manager under <strong>Data Sources &gt; Data Feed</strong>. Set it to update daily.
                            </p>

                            <div className="flex gap-2">
                                <input
                                    readOnly
                                    value={catalogUrl}
                                    className="flex-1 bg-gray-50 border rounded-lg px-4 text-sm text-gray-600 font-mono"
                                />
                                <button
                                    onClick={() => navigator.clipboard.writeText(catalogUrl)}
                                    className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm font-medium flex items-center gap-2"
                                >
                                    <LinkIcon className="w-4 h-4" /> Copy
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

        </div>
    )
}
