"use client";

import { useState, useEffect } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { Zap, ShieldAlert, ShieldCheck, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export function AutomationToggle({ storeId }: { storeId: string }) {
    const [enabled, setEnabled] = useState(true);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const load = async () => {
            const { data } = await supabaseBrowser
                .from('stores')
                .select('rto_automation_enabled')
                .eq('id', storeId)
                .single();

            if (data) setEnabled(data.rto_automation_enabled ?? true);
            setLoading(false);
        };
        if (storeId) load();
    }, [storeId]);

    const handleToggle = async (val: boolean) => {
        setSaving(true);
        const { error } = await supabaseBrowser
            .from('stores')
            .update({ rto_automation_enabled: val })
            .eq('id', storeId);

        if (error) {
            toast.error("Failed to update RTO settings");
        } else {
            setEnabled(val);
            toast.success(val ? "Automated RTO Protection Enabled" : "RTO Audit Mode Enabled");
        }
        setSaving(false);
    };

    if (loading) return <div className="h-24 bg-white rounded-3xl border border-slate-100 animate-pulse" />;

    return (
        <div className={`p-6 rounded-[2rem] border-2 transition-all ${enabled ? 'bg-blue-600 border-blue-400 text-white shadow-xl shadow-blue-100' : 'bg-white border-slate-100 text-slate-900 shadow-sm'}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${enabled ? 'bg-white/10' : 'bg-slate-50'}`}>
                        {enabled ? <ShieldCheck className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6 text-slate-400" />}
                    </div>
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-tight">
                            {enabled ? 'Full Protection Active' : 'Intelligence Audit Mode'}
                        </h3>
                        <p className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${enabled ? 'text-blue-100' : 'text-slate-400'}`}>
                            {enabled ? 'System blocks high-risk COD automatically' : 'Logging risk signals without customer friction'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {saving && <Loader2 className="w-4 h-4 animate-spin opacity-50" />}
                    <Switch
                        checked={enabled}
                        onCheckedChange={handleToggle}
                        disabled={saving}
                        className={enabled ? 'data-[state=checked]:bg-white' : ''}
                    />
                </div>
            </div>
        </div>
    );
}
