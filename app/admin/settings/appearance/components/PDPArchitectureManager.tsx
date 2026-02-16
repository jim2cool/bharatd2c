"use client";

import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import {
    GripVertical,
    Eye,
    EyeOff,
    AlertCircle,
    CheckCircle2,
    AlertTriangle,
    Info,
    RotateCcw,
    Save,
    Loader2
} from "lucide-react";
import { Reorder, AnimatePresence, motion } from "framer-motion";
import { ThemeConfig } from "@/components/ThemeProvider";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { getActiveStoreIdClient } from "@/lib/getActiveStore.client";
import { useOverrideOpinion, OverrideOpinion } from "./useOverrideOpinion";
import { toast } from "sonner";

interface ComponentEntry {
    id: string;
    name: string;
    family: string;
    is_system: boolean;
    is_active: boolean;
    governance: string;
    opinion?: OverrideOpinion;
}

export function PDPArchitectureManager() {
    const storeId = getActiveStoreIdClient();
    const { getOpinion } = useOverrideOpinion();
    const [components, setComponents] = useState<ComponentEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const loadArchitecture = async () => {
        if (!storeId) return;
        setLoading(true);
        try {
            // 1. Get the current resolved config to see sequence and active status
            const { data: config, error: configError } = await supabaseBrowser
                .from('vw_store_config_resolved')
                .select('*')
                .eq('store_id', storeId)
                .single();

            if (configError) throw configError;

            // 2. Get all components for metadata (name, family, governance)
            const { data: allComponents, error: compError } = await supabaseBrowser
                .from('cr_components')
                .select('component_id, component_name, group_name, governance_level');

            if (compError) throw compError;

            // 3. Map into a sequence list
            // We use the pdp_component_sequence if it exists, else we build from active_components_all
            const sequence = config.pdp_component_sequence || [];
            const activeAll = config.resolved_active_components || [];

            // Components in sequence
            const mapped: ComponentEntry[] = sequence.map((compId: string) => {
                const meta = allComponents.find(c => c.component_id === compId);
                return {
                    id: compId,
                    name: meta?.component_name || compId,
                    family: meta?.group_name || 'unknown',
                    is_system: true,
                    is_active: activeAll.includes(compId),
                    governance: meta?.governance_level || 'GOVERNED'
                };
            });

            // Add active components not in sequence (if any)
            activeAll.forEach((compId: string) => {
                if (!mapped.find(m => m.id === compId)) {
                    const meta = allComponents.find(c => c.component_id === compId);
                    mapped.push({
                        id: compId,
                        name: meta?.component_name || compId,
                        family: meta?.group_name || 'unknown',
                        is_system: false,
                        is_active: true,
                        governance: meta?.governance_level || 'GOVERNED'
                    });
                }
            });

            setComponents(mapped);
        } catch (err) {
            console.error("Failed to load architecture:", err);
            toast.error("Failed to load PDP architecture");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadArchitecture();
    }, [storeId]);

    const handleReorder = (newOrder: ComponentEntry[]) => {
        setComponents(newOrder);
        // We could fetch opinions here for the bulk reorder, but reordering is usually CAUTION
    };

    const toggleComponent = async (id: string) => {
        const component = components.find(c => c.id === id);
        if (!component) return;

        const newActive = !component.is_active;
        const type = newActive ? 'ACTIVATE' : 'SUPPRESS';

        // Fetch real-time opinion before applying
        const opinion = await getOpinion(storeId!, id, type);

        if (opinion?.recommendation === 'BLOCKED') {
            toast.error(opinion.reason);
            return;
        }

        setComponents(prev => prev.map(c =>
            c.id === id ? { ...c, is_active: newActive, opinion: opinion || undefined } : c
        ));
    };

    const saveChanges = async () => {
        setSaving(true);
        try {
            // Transform into re_seller_overrides table format
            const overrides = components.map((c, index) => ({
                store_id: storeId,
                component_id: c.id,
                override_type: c.is_active ? 'ACTIVATE' : 'SUPPRESS',
                zone_position: index,
                system_recommendation: c.opinion?.recommendation || 'AGREES',
                is_active: c.is_active
            }));

            // Upsert to re_seller_overrides (canonical override table — NOT cr_component_overrides which is legacy)
            const { error } = await supabaseBrowser
                .from('re_seller_overrides')
                .upsert(overrides, { onConflict: 'store_id,component_id' });

            if (error) throw error;

            // Trigger recompute with correct parameter name
            await supabaseBrowser.rpc('compute_store_render_config', { p_store_id: storeId });

            toast.success("PDP Architecture saved and recomputed");
            loadArchitecture(); // Refresh list
        } catch (err) {
            console.error("Error saving overrides:", err);
            toast.error("Failed to save changes");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-neutral-300" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-black text-neutral-400 uppercase tracking-widest">PDP Persuasion Sequence</h3>
                    <p className="text-xs text-neutral-500 mt-1">Drag to reorder components. Toggle to activate/suppress.</p>
                </div>
                <button
                    onClick={saveChanges}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-bold shadow-sm hover:bg-black disabled:opacity-50"
                >
                    {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                    Save Sequence
                </button>
            </div>

            <Reorder.Group axis="y" values={components} onReorder={handleReorder} className="space-y-3">
                {components.map((component) => (
                    <Reorder.Item
                        key={component.id}
                        value={component}
                        className={`group relative flex items-center gap-4 p-4 bg-white border rounded-2xl transition-all ${!component.is_active ? 'opacity-60 bg-neutral-50 border-neutral-100' : 'border-neutral-200 shadow-sm hover:border-neutral-300'
                            }`}
                    >
                        {/* Drag Handle */}
                        <div className="cursor-grab active:cursor-grabbing text-neutral-300 group-hover:text-neutral-500 transition-colors">
                            <GripVertical className="w-5 h-5" />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-black text-neutral-900 truncate">{component.name}</span>
                                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-tight px-1.5 py-0.5 bg-neutral-100 rounded">
                                    {component.family}
                                </span>
                                {component.governance === 'LOCKED' && (
                                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-tight flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" /> Core
                                    </span>
                                )}
                            </div>
                            <div className="text-[10px] text-neutral-400 font-mono mt-0.5 uppercase">{component.id}</div>
                        </div>

                        {/* System Opinions / Badge */}
                        <AnimatePresence>
                            {component.opinion && (
                                <motion.div
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`flex items-center gap-2 px-2 py-1 rounded-lg border text-[10px] font-bold ${component.opinion.recommendation === 'AGREES' ? 'bg-green-50 text-green-700 border-green-100' :
                                        component.opinion.recommendation === 'CAUTION' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                            'bg-red-50 text-red-700 border-red-100'
                                        }`}
                                >
                                    {component.opinion.recommendation === 'AGREES' && <CheckCircle2 className="w-3 h-3" />}
                                    {component.opinion.recommendation === 'CAUTION' && <AlertTriangle className="w-3 h-3" />}
                                    {component.opinion.recommendation === 'ADVISES_AGAINST' && <AlertCircle className="w-3 h-3" />}
                                    <span className="max-w-[120px] truncate">{component.opinion.recommendation}</span>

                                    {/* Tooltip Simulation or Simple Text */}
                                    <div className="absolute bottom-full right-0 mb-2 invisible group-hover:visible w-64 p-3 bg-neutral-900 text-white text-[11px] rounded-xl shadow-2xl z-50 font-medium leading-relaxed">
                                        <div className="font-bold text-xs mb-1 flex items-center gap-2 text-neutral-400">
                                            <Info className="w-3 h-3" /> System Intelligence
                                        </div>
                                        {component.opinion.reason}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => toggleComponent(component.id)}
                                className={`p-2 rounded-lg transition-colors ${component.is_active
                                    ? 'text-neutral-900 hover:bg-neutral-100'
                                    : 'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100'
                                    }`}
                                title={component.is_active ? "Suppress Component" : "Activate Component"}
                            >
                                {component.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </button>
                        </div>
                    </Reorder.Item>
                ))}
            </Reorder.Group>

            <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100 border-dashed">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg border border-neutral-200 shadow-sm">
                        <RotateCcw className="w-4 h-4 text-neutral-400" />
                    </div>
                    <div>
                        <div className="text-xs font-bold text-neutral-900">Reset to Intelligence Default</div>
                        <div className="text-[10px] text-neutral-500 font-medium">Remove all custom overrides and revert to the system's persuasion sequence.</div>
                    </div>
                    <button
                        type="button"
                        className="ml-auto text-xs font-bold text-neutral-400 hover:text-neutral-900"
                    >
                        Reset
                    </button>
                </div>
            </div>
        </div>
    );
}
