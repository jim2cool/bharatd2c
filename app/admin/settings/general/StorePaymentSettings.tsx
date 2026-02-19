"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { getActiveStoreIdClient } from "@/lib/getActiveStore.client";
import { CreditCard, Banknote, ShoppingCart, Percent, AlertCircle, Zap, ArrowUpFromLine } from "lucide-react"; // Import AlertCircle
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function StorePaymentSettings() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState<any>({
        cod_enabled: true,
        prepaid_enabled: true,
        cart_button_enabled: true,
        prepaid_discount_type: 'flat',
        prepaid_discount_value: 0
    });
    const [platformSettings, setPlatformSettings] = useState<any>({
        cod_enabled: true,
        prepaid_enabled: true,
        cart_button_enabled: true
    });

    useEffect(() => {
        const load = async () => {
            const storeId = getActiveStoreIdClient();
            if (!storeId) return;

            // 1. Fetch Platform Settings
            const { data: platform } = await supabaseBrowser
                .from('platform_settings')
                .select('*')
                .eq('id', 1)
                .single();

            if (platform) setPlatformSettings(platform);

            // 2. Fetch Store Settings
            const { data: store } = await supabaseBrowser
                .from('stores')
                .select('cod_enabled, prepaid_enabled, cart_button_enabled, prepaid_discount_type, prepaid_discount_value')
                .eq('id', storeId)
                .single();

            if (store) {
                setSettings({
                    cod_enabled: store.cod_enabled ?? true,
                    prepaid_enabled: store.prepaid_enabled ?? true,
                    cart_button_enabled: store.cart_button_enabled ?? true,
                    prepaid_discount_type: store.prepaid_discount_type || 'flat',
                    prepaid_discount_value: store.prepaid_discount_value || 0
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

        const { error } = await supabaseBrowser
            .from('stores')
            .update({
                cod_enabled: settings.cod_enabled,
                prepaid_enabled: settings.prepaid_enabled,
                cart_button_enabled: settings.cart_button_enabled,
                prepaid_discount_type: settings.prepaid_discount_type,
                prepaid_discount_value: Number(settings.prepaid_discount_value)
            })
            .eq('id', storeId);

        setSaving(false);
        if (error) toast.error("Failed to save payment settings");
        else toast.success("Payment settings updated");
    };

    if (loading) return <div className="p-8 bg-white border border-neutral-200 rounded-2xl animate-pulse h-64" />;

    const ToggleRow = ({ label, field, icon: Icon, description }: any) => {
        const isPlatformDisabled = !platformSettings[field];
        return (
            <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${settings[field] ? 'bg-blue-100 text-blue-600' : 'bg-neutral-200 text-neutral-400'}`}>
                        <Icon className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-sm font-bold text-neutral-900">{label}</div>
                        <div className="text-xs text-neutral-500 font-medium">{description}</div>
                        {isPlatformDisabled && (
                            <div className="flex items-center gap-1 mt-1 text-[10px] text-red-500 font-bold uppercase tracking-wide">
                                <AlertCircle className="w-3 h-3" /> Disabled by Platform
                            </div>
                        )}
                    </div>
                </div>
                <Switch
                    checked={settings[field]}
                    onCheckedChange={(val) => setSettings({ ...settings, [field]: val })}
                    disabled={isPlatformDisabled}
                />
            </div>
        );
    };

    return (
        <section className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-neutral-100 rounded-lg">
                        <CreditCard className="w-5 h-5 text-neutral-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-neutral-800">Payment & Checkout</h2>
                        <p className="text-xs text-neutral-500 font-medium">Configure store-wide default payment methods</p>
                    </div>
                </div>
                <Button onClick={save} disabled={saving} size="sm">
                    {saving ? "Saving..." : "Save Configuration"}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ToggleRow
                    label="Cash on Delivery (COD)"
                    field="cod_enabled"
                    icon={Banknote}
                    description="Allow customers to pay upon delivery"
                />
                <ToggleRow
                    label="Prepaid Checkout"
                    field="prepaid_enabled"
                    icon={CreditCard}
                    description="Accept online payments (UPI, Cards)"
                />
                <ToggleRow
                    label="Add to Cart"
                    field="cart_button_enabled"
                    icon={ShoppingCart}
                    description="Enable shopping cart workflow"
                />
            </div>

            {/* PREPAID DISCOUNT CONFIG (NOW MOVED TO DISCOUNTS PAGE) */}
            {settings.prepaid_enabled && (
                <div className="p-6 bg-orange-50/50 rounded-[28px] border border-orange-100 space-y-4 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-5 h-5 text-orange-600" />
                        <h3 className="text-sm font-bold text-orange-900 uppercase tracking-wide">Prepaid Incentive Rules</h3>
                    </div>

                    <p className="text-xs text-neutral-500 font-medium leading-relaxed">
                        Prepaid discounts are now managed centrally in the <strong>Discounts & Promos</strong> page. You can set store-wide, collection-wise, or product-specific rules there.
                    </p>

                    <Button
                        onClick={() => window.location.href = '/admin/discounts'}
                        variant="outline"
                        className="bg-white border-orange-200 text-orange-700 hover:bg-orange-100 hover:text-orange-900 font-bold uppercase tracking-wide text-xs h-10 px-6 rounded-xl"
                    >
                        Manage Prepaid Rules <ArrowUpFromLine className="ml-2 w-3 h-3 rotate-45" />
                    </Button>
                </div>
            )}
        </section>
    );
}
