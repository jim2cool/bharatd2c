"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
    Plus,
    Trash2,
    Zap,
    Layers,
    ArrowUpFromLine,
    Search,
    Check,
    X,
    Briefcase,
    Info
} from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { getActiveStoreIdClient as getActiveStoreId } from "@/lib/getActiveStore.client";
import { toast } from "sonner";
import { PrepaidConfig, PrepaidScope, DiscountType, StackingLogic } from "@/lib/types/prepaid";
import { savePrepaidRule, deletePrepaidRule } from "../actions";

export function PrepaidRulesSection() {
    const [rules, setRules] = useState<PrepaidConfig[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [stackingLogic, setStackingLogic] = useState<StackingLogic>('highest_only');

    // Form State
    const [formData, setFormData] = useState<{
        scope: PrepaidScope;
        scope_id: string | null;
        type: DiscountType;
        value: number | "";
        min_order_value: number | "";
    }>({
        scope: 'store',
        scope_id: null,
        type: 'flat',
        value: "",
        min_order_value: ""
    });

    // Search/Select state for Collection/Product scope
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [searching, setSearching] = useState(false);
    const [selectedItemName, setSelectedItemName] = useState<string | null>(null);

    useEffect(() => {
        fetchRules();
        fetchStoreSettings();
    }, []);

    const fetchRules = async () => {
        const storeId = getActiveStoreId();
        if (!storeId) return;

        // DEBUG: Verify table existence
        const check = await supabaseBrowser.from('prepaid_configs').select('id').limit(1);
        if (check.error) {
            console.error("CRITICAL TABLE ERROR: ", check.error);
            toast.error("Database table missing or inaccessible. Please run migration.");
            return;
        }

        const { data } = await supabaseBrowser
            .from('prepaid_configs')
            .select('*')
            .eq('store_id', storeId)
            .order('created_at', { ascending: false });

        if (data) setRules(data as any);
        setLoading(false);
    };

    const fetchStoreSettings = async () => {
        const storeId = getActiveStoreId();
        if (!storeId) return;
        const { data } = await supabaseBrowser
            .from('stores')
            .select('prepaid_stacking_logic')
            .eq('id', storeId)
            .single();

        if (data) setStackingLogic(data.prepaid_stacking_logic as StackingLogic || 'highest_only');
    }

    const updateStackingLogic = async (logic: StackingLogic) => {
        const storeId = getActiveStoreId();
        const { error } = await supabaseBrowser
            .from('stores')
            .update({ prepaid_stacking_logic: logic })
            .eq('id', storeId);

        if (error) toast.error("Failed to update logic");
        else {
            setStackingLogic(logic);
            toast.success("Stacking logic updated");
        }
    }

    const handleSearch = async (term: string) => {
        setSearchTerm(term);
        if (term.length < 2) return;
        setSearching(true);
        const storeId = getActiveStoreId();

        const table = formData.scope === 'collection' ? 'collections' : 'products';
        const { data } = await supabaseBrowser
            .from(table)
            .select('id, title')
            .eq('store_id', storeId)
            .ilike('title', `%${term}%`)
            .limit(5);

        setSearchResults(data || []);
        setSearching(false);
    }

    const saveRule = async () => {
        const val = Number(formData.value);
        const minOrder = Number(formData.min_order_value);

        if (!val || val <= 0) {
            toast.error("Value must be greater than 0");
            return;
        }
        if (formData.scope !== 'store' && !formData.scope_id) {
            toast.error(`Please select a ${formData.scope}`);
            return;
        }

        const storeId = getActiveStoreId();

        if (!storeId) {
            toast.error("Store ID not found. Please refresh.");
            console.error("Store ID matches active store check failed");
            return;
        }

        const payload = {
            store_id: storeId,
            scope: formData.scope,
            scope_id: formData.scope_id,
            type: formData.type,
            value: val,
            min_order_value: minOrder || 0
        };

        const result = await savePrepaidRule(payload);

        if (result.error) {
            console.error("Save Rule Error:", result.error);
            toast.error(`Failed to save: ${result.error}`);
        } else {
            toast.success("Rule created!");
            setFormData({ scope: 'store', scope_id: null, type: 'flat', value: "", min_order_value: "" });
            setSelectedItemName(null);
            setShowForm(false);
            fetchRules();
        }
    }

    const deleteRule = async (id: string) => {
        if (!confirm("Delete this rule?")) return;

        const result = await deletePrepaidRule(id);
        if (result.error) {
            toast.error("Failed to delete rule");
        } else {
            fetchRules();
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-black text-neutral-900 flex items-center gap-2">
                        <Zap className="w-6 h-6 text-orange-500 fill-orange-500" />
                        Prepaid Incentives
                    </h2>
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mt-1">
                        Reward customers for paying online
                    </p>
                </div>

                {/* Stacking Logic Toggle */}
                <div className="flex items-center gap-3 bg-white p-2 pr-4 rounded-xl border border-neutral-200 shadow-sm">
                    <div className="flex gap-2 items-center bg-white p-2 rounded-xl border border-neutral-100 shadow-sm relative group cursor-help">
                        <Layers className="w-4 h-4 text-neutral-400" />
                        <select
                            value={stackingLogic}
                            onChange={(e) => updateStackingLogic(e.target.value as StackingLogic)}
                            className="text-xs font-bold text-neutral-900 bg-transparent outline-none cursor-pointer pr-8"
                        >
                            <option value="highest_only">Highest Wins (Recommended)</option>
                            <option value="stack">Stack All Discounts</option>
                        </select>
                        <div className="absolute top-full right-0 mt-2 w-64 bg-white p-4 rounded-xl border border-neutral-100 shadow-xl z-50 opacity-0 group-hover:opacity-100 pointer-events-none transition-all">
                            <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-neutral-900 mb-2">
                                <Info className="w-3 h-3 text-blue-500" />
                                How it works
                            </h4>
                            <p className="text-[11px] text-neutral-500 leading-relaxed">
                                {stackingLogic === 'highest_only'
                                    ? "If a product qualifies for multiple rules (e.g. Store + Collection), only the single highest discount is applied."
                                    : "If a product qualifies for multiple rules, ALL discounts are added together. Use with caution!"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rule Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Add New Card */}
                <button
                    onClick={() => setShowForm(true)}
                    className="flex flex-col items-center justify-center p-8 rounded-[2rem] border-2 border-dashed border-neutral-200 hover:border-orange-300 hover:bg-orange-50/30 transition-all group min-h-[200px]"
                >
                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Plus className="w-6 h-6 text-orange-600" />
                    </div>
                    <span className="text-sm font-bold text-neutral-600 uppercase tracking-wide">Add New Rule</span>
                </button>

                {/* Active Rules */}
                {rules.map(rule => (
                    <Card key={rule.id} className="rounded-[2rem] border-neutral-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                        <div className={`absolute top-0 right-0 w-16 h-16 ${rule.is_active ? 'bg-green-50' : 'bg-neutral-50'} rotate-45 translate-x-8 -translate-y-8`} />
                        <CardHeader className="p-6 pb-2">
                            <div className="flex justify-between items-start mb-2">
                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${rule.scope === 'store' ? 'bg-purple-100 text-purple-700' :
                                    rule.scope === 'collection' ? 'bg-blue-100 text-blue-700' :
                                        'bg-orange-100 text-orange-700'
                                    }`}>
                                    {rule.scope} Scope
                                </span>
                                <button onClick={() => deleteRule(rule.id)} className="text-neutral-300 hover:text-red-500 transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <CardTitle className="text-2xl font-black text-neutral-900">
                                {rule.type === 'percentage' ? `${rule.value}% OFF` : `₹${rule.value} OFF`}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 pt-2">
                            <p className="text-xs font-bold text-neutral-500 mb-4 truncate">
                                {rule.scope === 'store' ? 'Applies to all products' :
                                    rule.scope_id ? `Specific ${rule.scope}` : 'Unknown Item'}
                            </p>
                            {rule.min_order_value ? (
                                <div className="inline-flex items-center gap-1 px-2 py-1 bg-neutral-50 rounded-lg text-[10px] font-bold text-neutral-400 uppercase tracking-wide">
                                    Min Order: ₹{rule.min_order_value}
                                </div>
                            ) : (
                                <span className="text-[10px] font-bold text-neutral-300 uppercase tracking-wide">No Minimum</span>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Create Rule Modal / Drawer (Inline for now) */}
            {showForm && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
                    <Card className="w-full max-w-lg rounded-[2.5rem] shadow-2xl animate-in zoom-in-95">
                        <CardHeader className="p-8 pb-4 border-b border-neutral-50">
                            <CardTitle className="text-xl font-black text-neutral-900">New Prepaid Rule</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            {/* Scope Selector */}
                            <div className="grid grid-cols-3 gap-2 bg-neutral-50 p-1 rounded-xl">
                                {['store', 'collection', 'product'].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => {
                                            setFormData({ ...formData, scope: s as any, scope_id: null });
                                            setSelectedItemName(null);
                                            setSearchTerm("");
                                        }}
                                        className={`py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${formData.scope === s ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-400 hover:text-neutral-600'
                                            }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>

                            {/* Scope Helper Text */}
                            <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100 flex gap-3 items-start">
                                <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                                <p className="text-xs text-blue-800 leading-relaxed">
                                    {formData.scope === 'store' && <span className="font-bold">Applies to everything.</span>}
                                    {formData.scope === 'collection' && <span className="font-bold">Applies to a collection.</span>}
                                    {formData.scope === 'product' && <span className="font-bold">Applies to a specific product.</span>}
                                    <span className="block mt-1 text-[10px] text-blue-600">
                                        {formData.scope === 'store' && "Every product in your store will get this discount automatically."}
                                        {formData.scope === 'collection' && "Only products inside the selected collection will receive this discount."}
                                        {formData.scope === 'product' && "Select a single product below to apply this discount."}
                                    </span>
                                </p>
                            </div>

                            {/* Item Selector (if not store) */}
                            {formData.scope !== 'store' && (
                                <div className="space-y-2 relative">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Select {formData.scope}</Label>
                                    {selectedItemName ? (
                                        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-100 rounded-xl">
                                            <span className="text-sm font-bold text-green-800">{selectedItemName}</span>
                                            <button onClick={() => { setSelectedItemName(null); setFormData({ ...formData, scope_id: null }) }}>
                                                <X className="w-4 h-4 text-green-600" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <Search className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
                                            <Input
                                                placeholder={`Search Active ${formData.scope}s...`}
                                                className="pl-9 bg-neutral-50/50"
                                                value={searchTerm}
                                                onChange={(e) => handleSearch(e.target.value)}
                                            />
                                            {/* Results Dropdown */}
                                            {searchResults.length > 0 && (
                                                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-neutral-100 p-2 z-10">
                                                    {searchResults.map(res => (
                                                        <button
                                                            key={res.id}
                                                            onClick={() => {
                                                                setFormData({ ...formData, scope_id: res.id });
                                                                setSelectedItemName(res.title);
                                                                setSearchResults([]);
                                                                setSearchTerm("");
                                                            }}
                                                            className="w-full text-left p-2 hover:bg-neutral-50 rounded-lg text-sm font-medium transition-colors"
                                                        >
                                                            {res.title}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Value & Type */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Value</Label>
                                    <Input
                                        type="number"
                                        value={formData.value}
                                        onChange={(e) => setFormData({ ...formData, value: e.target.value === "" ? "" : parseFloat(e.target.value) })}
                                        className="font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Type</Label>
                                    <select
                                        className="w-full h-10 px-3 rounded-md border border-neutral-200 bg-white text-sm"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                                    >
                                        <option value="flat">Flat Amount (₹)</option>
                                        <option value="percentage">Percentage (%)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Min Order Value (Optional)</Label>
                                <Input
                                    type="number"
                                    value={formData.min_order_value}
                                    onChange={(e) => setFormData({ ...formData, min_order_value: e.target.value === "" ? "" : parseFloat(e.target.value) })}
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button variant="ghost" onClick={() => setShowForm(false)} className="flex-1">Cancel</Button>
                                <Button onClick={saveRule} className="flex-1 bg-neutral-900 text-white">Save Rule</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
