"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { getActiveStoreIdClient } from "@/lib/getActiveStore.client";
import { Key, ShieldCheck, KeyRound, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function GatewayCredentials() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [config, setConfig] = useState({
        provider: 'razorpay',
        api_key: '',
        api_secret: '',
        environment: 'production'
    });

    useEffect(() => {
        const load = async () => {
            const storeId = getActiveStoreIdClient();
            if (!storeId) return;

            const { data, error } = await supabaseBrowser
                .from('store_payment_configs')
                .select('*')
                .eq('store_id', storeId)
                .eq('provider', 'razorpay')
                .maybeSingle();

            if (data) {
                setConfig({
                    provider: data.provider,
                    api_key: data.api_key,
                    api_secret: data.api_secret || '',
                    environment: data.environment
                });
            }
            setLoading(false);
        };
        load();
    }, []);

    const save = async () => {
        setSaving(true);
        const storeId = getActiveStoreIdClient();
        if (!storeId) return;

        if (!config.api_key || !config.api_secret) {
            toast.error("API Key and Secret are required");
            setSaving(false);
            return;
        }

        const { error } = await supabaseBrowser
            .from('store_payment_configs')
            .upsert({
                store_id: storeId,
                provider: config.provider,
                api_key: config.api_key,
                api_secret: config.api_secret,
                environment: config.environment,
                is_active: true
            }, { onConflict: 'store_id,provider' });

        setSaving(false);
        if (error) {
            toast.error("Failed to save credentials");
            console.error(error);
        } else {
            toast.success("Payment credentials saved successfully");
        }
    };

    if (loading) return <div className="p-8 border border-neutral-200 rounded-2xl animate-pulse h-48 mt-8 bg-neutral-50" />;

    return (
        <div className="p-8 rounded-[32px] border border-blue-100 bg-white mt-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-neutral-900 text-white shadow-lg">
                        <Key className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Payment Gateway Credentials</h3>
                        <p className="text-xs text-slate-500 font-medium">Configure your Razorpay or Cashfree API keys required for prepaid checkouts.</p>
                    </div>
                </div>
                <Button onClick={save} disabled={saving} size="sm" className="bg-black text-white hover:bg-neutral-800 rounded-xl px-6">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ShieldCheck className="w-4 h-4 mr-2" />}
                    {saving ? "Saving..." : "Save Keys"}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-neutral-100">
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Provider</label>
                    <select
                        value={config.provider}
                        onChange={(e) => setConfig({ ...config, provider: e.target.value })}
                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-bold text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all shadow-sm"
                    >
                        <option value="razorpay">Razorpay</option>
                        <option value="cashfree">Cashfree</option>
                        <option value="payu">PayU</option>
                    </select>
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Environment</label>
                    <select
                        value={config.environment}
                        onChange={(e) => setConfig({ ...config, environment: e.target.value })}
                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-bold text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all shadow-sm"
                    >
                        <option value="production">Production (Live)</option>
                        <option value="sandbox">Sandbox (Test)</option>
                    </select>
                </div>

                <div className="space-y-3 md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">API Key / Key ID</label>
                    <div className="relative">
                        <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        <input
                            type="text"
                            value={config.api_key}
                            onChange={(e) => setConfig({ ...config, api_key: e.target.value })}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-neutral-200 rounded-xl font-bold text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all shadow-sm"
                            placeholder="rzp_live_xxxxxxxxxxxxxx"
                        />
                    </div>
                </div>

                <div className="space-y-3 md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">API Secret / Key Secret</label>
                    <div className="relative">
                        <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        <input
                            type="password"
                            value={config.api_secret}
                            onChange={(e) => setConfig({ ...config, api_secret: e.target.value })}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-neutral-200 rounded-xl font-bold text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all shadow-sm"
                            placeholder="••••••••••••••••••••••••••••"
                        />
                    </div>
                </div>
            </div>

            <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl">
                <p className="text-xs text-orange-800 font-medium">
                    Keys are stored securely and encrypted in transit. Ensure you paste the correct keys for the selected environment.
                </p>
            </div>
        </div>
    );
}
