"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Layout, Zap, Palette, MousePointer2, Save } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { getActiveStoreIdClient } from "@/lib/getActiveStore.client";
import { ThemeConfig, DEFAULT_CONFIG } from "@/components/ThemeProvider";

// Components
import { StructureSection } from "./components/StructureSection";
import { IntelligenceSection } from "./components/IntelligenceSection";
import { StyleSection } from "./components/StyleSection";
import { MotionSection } from "./components/MotionSection";
import { ThemePreview } from "./components/ThemePreview";
import { configSchema } from "./components/schema";

export default function AppearancePage() {
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'structure' | 'intelligence' | 'style' | 'motion'>('structure');
    const supabase = supabaseBrowser;

    const form = useForm<ThemeConfig>({
        resolver: zodResolver(configSchema),
        defaultValues: DEFAULT_CONFIG,
    });

    const { reset, handleSubmit, watch, formState: { isDirty } } = form;

    // Load initial data
    useEffect(() => {
        async function loadSettings() {
            try {
                const storeId = getActiveStoreIdClient();
                if (!storeId) {
                    setLoading(false);
                    return;
                }

                const { data, error } = await supabase
                    .from('stores')
                    .select('theme_config')
                    .eq('id', storeId)
                    .single();

                if (error) throw error;

                if (data?.theme_config) {
                    // Merge with default config
                    reset({ ...DEFAULT_CONFIG, ...data.theme_config });
                }
            } catch (err) {
                console.error("Failed to load theme settings:", err);
                toast.error("Failed to load settings");
            } finally {
                setLoading(false);
            }
        }
        loadSettings();
    }, [reset]);

    const onSave = async (values: ThemeConfig) => {
        try {
            const storeId = getActiveStoreIdClient();
            if (!storeId) throw new Error("No active store");

            // 1. Save full theme_config blob (preserves legacy config + provides source data for recompute)
            const { error } = await supabase
                .from('stores')
                .update({ theme_config: values })
                .eq('id', storeId);

            if (error) throw error;

            // 2. Sync intelligence behavioural fields directly to ob_seller_profiles
            //    (vw_store_config reads these from ob_seller_profiles, NOT from theme_config)
            if (values.seller) {
                await supabase.from('ob_seller_profiles').upsert({
                    store_id: storeId,
                    urgency_level: values.seller.urgencyLevel,
                    social_proof_weight: values.seller.socialProofWeight,
                    cta_prominence: values.seller.ctaProminence,
                }, { onConflict: 'store_id' });
            }

            // 3. Trigger recompute so vw_store_config reflects the new values for PDP intelligence mode
            await supabase.rpc('compute_store_render_config', { p_store_id: storeId });

            toast.success("Theme updated — storefront is refreshing");
            reset(values);
        } catch (err) {
            console.error("Error saving theme:", err);
            toast.error("Failed to save changes");
        }
    };

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
            </div>
        );
    }

    return (
        <FormProvider {...form}>
            <form onSubmit={handleSubmit(onSave)} className="max-w-7xl mx-auto py-8 px-4 pb-24">
                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-neutral-900 tracking-tight">Appearance & Theme</h1>
                        <p className="text-neutral-500 mt-1">Customize your storefront's visual architecture and intelligence.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => reset()}
                            className="px-4 py-2 text-sm font-bold text-neutral-600 hover:text-neutral-900"
                            disabled={!isDirty}
                        >
                            Discard
                        </button>
                        <button
                            type="submit"
                            disabled={!isDirty}
                            className="flex items-center gap-2 px-6 py-2 bg-black text-white rounded-lg font-bold shadow-lg hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <Save className="w-4 h-4" />
                            Save Changes
                        </button>
                    </div>
                </div>

                {/* TABS */}
                <div className="mb-8 border-b border-neutral-200">
                    <div className="flex gap-8 overflow-x-auto">
                        <button
                            type="button"
                            onClick={() => setActiveTab('structure')}
                            className={`pb-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'structure' ? "border-black text-black" : "border-transparent text-neutral-400 hover:text-neutral-600"}`}
                        >
                            <Layout className="w-4 h-4" />
                            Structure
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('intelligence')}
                            className={`pb-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'intelligence' ? "border-black text-black" : "border-transparent text-neutral-400 hover:text-neutral-600"}`}
                        >
                            <Zap className="w-4 h-4" />
                            Intelligence
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('style')}
                            className={`pb-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'style' ? "border-black text-black" : "border-transparent text-neutral-400 hover:text-neutral-600"}`}
                        >
                            <Palette className="w-4 h-4" />
                            Style
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('motion')}
                            className={`pb-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'motion' ? "border-black text-black" : "border-transparent text-neutral-400 hover:text-neutral-600"}`}
                        >
                            <MousePointer2 className="w-4 h-4" />
                            Alive Engine
                        </button>
                    </div>
                </div>

                {/* CONTENT GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* LEFT COLUMN: SETTINGS */}
                    <div className="lg:col-span-7 space-y-8">
                        {activeTab === 'structure' && <StructureSection />}
                        {activeTab === 'intelligence' && <IntelligenceSection />}
                        {activeTab === 'style' && <StyleSection />}
                        {activeTab === 'motion' && <MotionSection />}
                    </div>

                    {/* RIGHT COLUMN: PREVIEW */}
                    <div className="lg:col-span-5 relative hidden lg:block">
                        <ThemePreview />
                    </div>
                </div>
            </form>
        </FormProvider>
    );
}
