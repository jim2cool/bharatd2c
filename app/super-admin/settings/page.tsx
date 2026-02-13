"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { Save, ShieldAlert, Globe, Server, Mail, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

type PlatformSetting = {
    key: string;
    value: any;
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════

export default function PlatformSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState<Record<string, any>>({
        maintenance_mode: false,
        registration_enabled: true,
        support_email: "support@bharatd2c.com",
        main_domain: "bharatd2c.com",
        cname_target: "ingress.bharatd2c.com"
    });

    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data, error } = await supabaseBrowser
                    .from("platform_settings")
                    .select("key, value");

                if (!error && data) {
                    const mapped = data.reduce((acc, curr) => ({
                        ...acc,
                        [curr.key]: curr.value
                    }), {});
                    setSettings(prev => ({ ...prev, ...mapped }));
                }
            } catch (e) {
                console.warn("Could not fetch platform settings, using defaults.");
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const handleChange = (key: string, value: any) => {
        setSettings(prev => ({ ...prev, [key]: value }));
        setHasChanges(true);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Since we can only update individual rows, we'll loop or use a rpc
            const updates = Object.entries(settings).map(([key, value]) =>
                supabaseBrowser.from("platform_settings").upsert({ key, value })
            );

            const results = await Promise.all(updates);
            const errors = results.filter(r => r.error);

            if (errors.length > 0) {
                console.error("Errors saving settings:", errors);
                toast.error("Some settings failed to save. Verify DB permissions.");
            } else {
                toast.success("All settings saved successfully");
                setHasChanges(false);
            }
        } catch (e) {
            toast.error("Failed to connect to platform settings");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-neutral-300" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-8 px-4 space-y-10">
            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-neutral-100 pb-8">
                <div>
                    <h1 className="text-4xl font-black text-neutral-900 tracking-tight">Platform Governance</h1>
                    <p className="text-neutral-500 mt-1 font-medium">Control global behavior and infrastructure targets</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving || !hasChanges}
                    className="flex items-center gap-2 px-8 py-3 bg-black text-white font-bold rounded-xl hover:bg-neutral-800 disabled:opacity-30 transition-all shadow-xl hover:shadow-2xl active:scale-95"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {saving ? "Saving..." : "Save Configuration"}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-12 space-y-8">

                    {/* CRITICAL CONTROLS */}
                    <section className="bg-white border-2 border-red-50 p-8 rounded-[2rem] shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <ShieldAlert className="w-32 h-32 text-red-600" />
                        </div>
                        <h2 className="text-xl font-black text-red-900 mb-6 flex items-center gap-2">
                            <ShieldAlert className="w-5 h-5" />
                            Emergency & Policy Controls
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                            <ControlBlock
                                label="Platform Maintenance Mode"
                                description="Redirects all marketplace and admin traffic to a maintenance page. Super-Admins still have access."
                                icon={Server}
                                checked={settings.maintenance_mode}
                                onChange={(val: boolean) => handleChange("maintenance_mode", val)}
                                activeColor="bg-red-600"
                            />
                            <ControlBlock
                                label="Seller Self-Registration"
                                description="Enable or disable the onboarding flow for new store owners. Current stores remain active."
                                icon={Globe}
                                checked={settings.registration_enabled}
                                onChange={(val: boolean) => handleChange("registration_enabled", val)}
                                activeColor="bg-black"
                            />
                        </div>
                    </section>

                    {/* INFRASTRUCTURE & DOMAINS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <section className="bg-white p-8 rounded-[2rem] border border-neutral-200 shadow-sm relative overflow-hidden group">
                            <h2 className="text-xl font-black text-neutral-800 mb-6 flex items-center gap-2">
                                <Globe className="w-5 h-5 text-blue-500" />
                                Domain Infrastructure
                            </h2>
                            <div className="space-y-6">
                                <InputBlock
                                    label="Primary Marketplace Domain"
                                    description="Used for main storefront landing and core routing"
                                    value={settings.main_domain}
                                    onChange={(val: string) => handleChange("main_domain", val)}
                                    placeholder="bharatd2c.com"
                                />
                                <InputBlock
                                    label="Custom Domain CNAME Target"
                                    description="Value sellers should point their DNS to"
                                    value={settings.cname_target}
                                    onChange={(val: string) => handleChange("cname_target", val)}
                                    placeholder="ingress.bharatd2c.com"
                                />
                            </div>
                        </section>

                        <section className="bg-white p-8 rounded-[2rem] border border-neutral-200 shadow-sm relative overflow-hidden group">
                            <h2 className="text-xl font-black text-neutral-800 mb-6 flex items-center gap-2">
                                <Mail className="w-5 h-5 text-purple-500" />
                                Support & Comms
                            </h2>
                            <div className="space-y-6">
                                <InputBlock
                                    label="Global Support Email"
                                    description="Primary contact address for platform-wide issues"
                                    value={settings.support_email}
                                    onChange={(val: string) => handleChange("support_email", val)}
                                    placeholder="support@bharatd2c.com"
                                />
                                <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 mt-4">
                                    <div className="flex gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0" />
                                        <div className="text-[11px] text-purple-900 font-bold leading-relaxed">
                                            PLATFORM STATUS: Healthy
                                            <div className="font-medium opacity-70 mt-1 uppercase tracking-widest italic">All systems operational in Region fsn1</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                </div>
            </div>
        </div>
    );
}

function ControlBlock({ label, description, icon: Icon, checked, onChange, activeColor }: any) {
    return (
        <div className="flex items-start justify-between p-6 bg-white border border-neutral-100 rounded-3xl hover:border-neutral-200 transition-all group">
            <div className="space-y-2 max-w-[80%]">
                <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-neutral-400 group-hover:text-black transition-colors" />
                    <span className="text-sm font-black text-neutral-900 tracking-tight">{label}</span>
                </div>
                <p className="text-xs text-neutral-500 font-medium leading-relaxed">{description}</p>
            </div>
            <button
                type="button"
                onClick={() => onChange(!checked)}
                className={`w-12 h-6 rounded-full transition-all relative shrink-0 ${checked ? activeColor : "bg-neutral-100"}`}
            >
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${checked ? "translate-x-6" : "translate-x-0"}`} />
            </button>
        </div>
    );
}

function InputBlock({ label, description, value, onChange, placeholder }: any) {
    return (
        <div className="space-y-2">
            <div className="flex items-baseline justify-between">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">{label}</label>
            </div>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full px-5 py-3 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-black outline-none transition-all"
            />
            <p className="text-[10px] text-neutral-400 font-medium ml-1 italic">{description}</p>
        </div>
    );
}
