"use client";

import { useState, useEffect } from "react";
import { getActiveStoreIdClient } from "@/lib/getActiveStore.client";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { PRESET_REGISTRY } from "@/lib/architecture/presets";
import { getDummyAssets } from "@/lib/intelligence/dummyContent";
import { toast } from "sonner";
import { Loader2, Beaker, ExternalLink, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const ALL_CATEGORIES = [
    'fashion', 'beauty', 'electronics', 'home', 'health', 'spiritual', 'furniture', 'food',
    'dropshipping', 'marketplace', 'multi', 'jewellery', 'art', 'pets', 'baby', 'stationery',
    'automotive', 'sports', 'gardening', 'b2b', 'digital', 'experience', 'renewed', 'consultation'
];

const ALL_MOODS = Object.keys(PRESET_REGISTRY);

export default function MasterTestingPage() {
    const [storeId, setStoreId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState<string>('fashion');
    const [selectedMood, setSelectedMood] = useState<string>('minimal');

    useEffect(() => {
        const fetchCurrentState = async () => {
            const sid = getActiveStoreIdClient();
            if (!sid) return;
            setStoreId(sid);

            const { data } = await supabaseBrowser
                .from('ob_seller_profiles')
                .select('primary_category, design_token_preset')
                .eq('store_id', sid)
                .single();

            if (data) {
                if (data.primary_category) setSelectedCategory(data.primary_category);
                if (data.design_token_preset) setSelectedMood(data.design_token_preset);
            }
            setLoading(false);
        };
        fetchCurrentState();
    }, []);

    const applyVariation = async () => {
        if (!storeId) return;
        setSaving(true);
        try {
            // 1. Update Profile
            const { error: updateError } = await supabaseBrowser
                .from('ob_seller_profiles')
                .update({
                    primary_category: selectedCategory,
                    design_token_preset: selectedMood,
                    commerce_architecture: 'b2c' // default safe
                })
                .eq('store_id', storeId);

            if (updateError) throw updateError;

            // 2. Recompute Render Config
            const { error: rpcError } = await supabaseBrowser.rpc('compute_store_render_config', { p_store_id: storeId });

            if (rpcError) throw rpcError;

            toast.success("Intelligence layer recomputed! Open your storefront to see the changes.");

        } catch (error: any) {
            console.error("Failed to apply variation:", error);
            toast.error(error.message || "Failed to update configuration");
        } finally {
            setSaving(false);
        }
    };

    const seedVariation = async () => {
        if (!storeId) return;
        setSaving(true);
        try {
            const response = await fetch('/api/admin/generate-content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    storeId,
                    storeName: "Test Store",
                    category: selectedCategory
                })
            });
            const result = await response.json();
            if (result.error) throw new Error(result.error);

            toast.success("Magic Moment seeded with 4+ products and images!");
        } catch (error: any) {
            console.error("Failed to seed variation:", error);
            toast.error(error.message || "Failed to seed content");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-8 flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Loading test harness...</div>;
    }

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-neutral-900 rounded-xl">
                    <Beaker className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-neutral-900">V3 Visual Consistency Testing</h1>
                    <p className="text-neutral-500">Master harness for QA on the intelligence layer (Moods & Categories).</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Category Selection */}
                <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
                    <h2 className="font-bold text-lg">1. Product Category ({ALL_CATEGORIES.length})</h2>
                    <p className="text-sm text-neutral-500">Dictates dummy content, images, and architecture injection.</p>
                    <div className="grid grid-cols-2 gap-2 h-96 overflow-y-auto pr-2 custom-scrollbar">
                        {ALL_CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-3 rounded-xl border-2 text-left text-sm font-medium transition-all ${selectedCategory === cat
                                    ? 'border-blue-600 bg-blue-50 text-blue-900'
                                    : 'border-neutral-100 hover:border-neutral-300'
                                    }`}
                            >
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Mood Selection */}
                <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
                    <h2 className="font-bold text-lg">2. Mood Card ({ALL_MOODS.length})</h2>
                    <p className="text-sm text-neutral-500">Dictates V3 CSS variables, colors, typography, borders and shadows.</p>
                    <div className="grid grid-cols-2 gap-2 h-96 overflow-y-auto pr-2 custom-scrollbar">
                        {ALL_MOODS.map(mood => {
                            const preset = PRESET_REGISTRY[mood];
                            return (
                                <button
                                    key={mood}
                                    onClick={() => setSelectedMood(mood)}
                                    className={`px-4 py-3 rounded-xl border-2 text-left transition-all ${selectedMood === mood
                                        ? 'border-blue-600 bg-blue-50'
                                        : 'border-neutral-100 hover:border-neutral-300'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-6 h-6 rounded-full border border-black/10 flex-shrink-0"
                                            style={{ backgroundColor: preset.colors.primary }}
                                        />
                                        <div>
                                            <div className="text-sm font-medium text-neutral-900">{preset.id}</div>
                                            <div className="text-[10px] text-neutral-500 uppercase tracking-wider">{mood}</div>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex items-center justify-between">
                <div>
                    <h3 className="font-bold">Current Target Profile</h3>
                    <p className="text-sm text-neutral-500">
                        {selectedCategory.toUpperCase()}  ×  {selectedMood.toUpperCase()}
                    </p>
                </div>
                <div className="flex gap-4">
                    <Button
                        size="lg"
                        onClick={applyVariation}
                        disabled={saving}
                        className="bg-neutral-900 text-white hover:bg-neutral-800"
                    >
                        {saving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Apply Variation & Compile"}
                    </Button>
                    <Button
                        size="lg"
                        variant="secondary"
                        onClick={seedVariation}
                        disabled={saving}
                    >
                        {saving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <><Wand2 className="w-4 h-4 mr-2" /> Seed Magic Moment</>}
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                        <a href="/" target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-2" /> Open Store
                        </a>
                    </Button>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #e5e5e5;
                    border-radius: 20px;
                }
            `}</style>
        </div>
    );
}
