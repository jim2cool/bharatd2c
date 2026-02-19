"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ShieldAlert, CreditCard, ShoppingCart, Banknote, Save } from "lucide-react";

export default function GlobalSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        cod_enabled: true,
        prepaid_enabled: true,
        cart_button_enabled: true
    });

    useEffect(() => {
        const load = async () => {
            const { data } = await supabaseBrowser
                .from('platform_settings')
                .select('*')
                .eq('id', 1)
                .single();

            if (data) {
                setSettings({
                    cod_enabled: data.cod_enabled,
                    prepaid_enabled: data.prepaid_enabled,
                    cart_button_enabled: data.cart_button_enabled
                });
            }
            setLoading(false);
        };
        load();
    }, []);

    const save = async () => {
        setSaving(true);
        const { error } = await supabaseBrowser
            .from('platform_settings')
            .upsert({
                id: 1,
                ...settings
            });

        setSaving(false);
        if (error) toast.error("Failed to update platform settings");
        else toast.success("Platform settings updated");
    };

    const ToggleCard = ({ label, field, icon: Icon, description }: any) => (
        <div className="flex items-center justify-between p-6 bg-white rounded-2xl border border-neutral-200 shadow-sm">
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${settings[field] ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-neutral-900">{label}</h3>
                    <p className="text-sm text-neutral-500">{description}</p>
                </div>
            </div>
            <Switch
                checked={settings[field]}
                onCheckedChange={(val) => setSettings({ ...settings, [field]: val })}
                className="scale-125"
            />
        </div>
    );

    if (loading) return <div className="p-10 text-center">Loading settings...</div>;

    return (
        <div className="max-w-4xl mx-auto py-12 px-6">
            <div className="flex items-center justify-between mb-12 border-b border-neutral-200 pb-8">
                <div>
                    <h1 className="text-4xl font-black text-neutral-900 tracking-tight mb-2">Platform Control</h1>
                    <p className="text-neutral-500 font-medium text-lg">Master switches for global feature availability</p>
                </div>
                <Button onClick={save} disabled={saving} size="lg" className="bg-black text-white px-8 h-14 text-lg rounded-xl">
                    {saving ? "Saving..." : "Save Config"}
                </Button>
            </div>

            <div className="space-y-6">
                <div className="p-6 bg-red-50 rounded-2xl border border-red-100 flex gap-4 items-start mb-8">
                    <ShieldAlert className="w-6 h-6 text-red-600 mt-1" />
                    <div>
                        <h3 className="text-lg font-bold text-red-900">Critical Zone</h3>
                        <p className="text-red-700 leading-relaxed">
                            Disabling a feature here will forcefully disable it for <strong>ALL STORES</strong> immediately, regardless of their individual settings.
                            Use with caution.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <ToggleCard
                        label="Global Prepaid Gateway"
                        field="prepaid_enabled"
                        icon={CreditCard}
                        description="Master switch for online payments across the platform."
                    />
                    <ToggleCard
                        label="Global Cash on Delivery"
                        field="cod_enabled"
                        icon={Banknote}
                        description="Master switch for loose cash handling services."
                    />
                    <ToggleCard
                        label="Global Cart Workflow"
                        field="cart_button_enabled"
                        icon={ShoppingCart}
                        description="Master switch for Add to Cart functionality."
                    />
                </div>
            </div>
        </div>
    );
}
