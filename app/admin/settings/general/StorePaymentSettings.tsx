"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { getActiveStoreIdClient } from "@/lib/getActiveStore.client";
import { CreditCard, Banknote, ShoppingCart, Percent, AlertCircle, Zap, ArrowUpFromLine, MessageSquare } from "lucide-react";
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
        gateway_status: 'not_configured',
        whatsapp_status: 'not_connected',
        prepaid_discount_type: 'flat',
        prepaid_discount_value: 0,
        partial_cod_config: {
            enabled: false,
            method: 'percentage',
            percentage_value: 10,
            shipping_rates: {
                "0_500": 60,
                "501_1000": 90,
                "1001_1500": 120,
                "1501_plus": 180
            }
        }
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
                .select('cod_enabled, prepaid_enabled, cart_button_enabled, prepaid_discount_type, prepaid_discount_value, gateway_status, whatsapp_status, partial_cod_config')
                .eq('id', storeId)
                .single();

            if (store) {
                setSettings({
                    cod_enabled: store.cod_enabled ?? true,
                    prepaid_enabled: store.prepaid_enabled ?? true,
                    cart_button_enabled: store.cart_button_enabled ?? true,
                    prepaid_discount_type: store.prepaid_discount_type || 'flat',
                    prepaid_discount_value: store.prepaid_discount_value || 0,
                    gateway_status: store.gateway_status || 'not_configured',
                    whatsapp_status: store.whatsapp_status || 'not_connected',
                    partial_cod_config: store.partial_cod_config || {
                        enabled: false,
                        method: 'percentage',
                        percentage_value: 10,
                        shipping_rates: {
                            "0_500": 60,
                            "501_1000": 90,
                            "1001_1500": 120,
                            "1501_plus": 180
                        }
                    }
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
                prepaid_discount_value: Number(settings.prepaid_discount_value),
                gateway_status: settings.gateway_status,
                whatsapp_status: settings.whatsapp_status,
                partial_cod_config: settings.partial_cod_config
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
            <div className={`flex items-center justify-between p-4 rounded-xl border transition-all ${settings[field] ? 'bg-blue-50/30 border-blue-100' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${settings[field] ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                        <Icon className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-sm font-bold text-slate-900">{label}</div>
                        <div className="text-xs text-slate-500 font-medium">{description}</div>
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

            {/* PARTIAL COD CONFIGURATION (Phase 26) */}
            <div className={`p-8 rounded-[32px] border transition-all ${settings.partial_cod_config?.enabled ? 'bg-indigo-50/30 border-indigo-100' : 'bg-slate-50/50 border-slate-200'}`}>
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${settings.partial_cod_config?.enabled ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-200 text-slate-500'}`}>
                            <Banknote className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Standard Partial COD</h3>
                            <p className="text-xs text-slate-500 font-medium">Require upfront payment for all COD orders to reduce RTO</p>
                        </div>
                    </div>
                    <Switch
                        checked={settings.partial_cod_config?.enabled}
                        onCheckedChange={(val) => setSettings({
                            ...settings,
                            partial_cod_config: { ...settings.partial_cod_config, enabled: val }
                        })}
                    />
                </div>

                {settings.partial_cod_config?.enabled && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-top-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Calculation Method</label>
                                <div className="flex p-1 bg-white border border-slate-200 rounded-xl">
                                    <button
                                        type="button"
                                        onClick={() => setSettings({
                                            ...settings,
                                            partial_cod_config: { ...settings.partial_cod_config, method: 'percentage' }
                                        })}
                                        className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold transition-all ${settings.partial_cod_config.method === 'percentage' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                                    >
                                        Percentage (%)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSettings({
                                            ...settings,
                                            partial_cod_config: { ...settings.partial_cod_config, method: 'shipping_rate' }
                                        })}
                                        className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold transition-all ${settings.partial_cod_config.method === 'shipping_rate' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                                    >
                                        Shipping Rate
                                    </button>
                                </div>
                            </div>

                            {settings.partial_cod_config.method === 'percentage' ? (
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Requirement Percentage</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={settings.partial_cod_config.percentage_value}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                partial_cod_config: { ...settings.partial_cod_config, percentage_value: Number(e.target.value) }
                                            })}
                                            className="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-xl font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-slate-300">%</div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Weight-based Brackets (₹)</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { key: '0_500', label: '0-500g' },
                                            { key: '501_1000', label: '501-1000g' },
                                            { key: '1001_1500', label: '1001-1.5kg' },
                                            { key: '1501_plus', label: '1.5kg+' }
                                        ].map((bracket) => (
                                            <div key={bracket.key} className="space-y-2">
                                                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{bracket.label}</div>
                                                <div className="relative">
                                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</div>
                                                    <input
                                                        type="number"
                                                        value={settings.partial_cod_config.shipping_rates[bracket.key]}
                                                        onChange={(e) => {
                                                            const newRates = { ...settings.partial_cod_config.shipping_rates, [bracket.key]: Number(e.target.value) };
                                                            setSettings({
                                                                ...settings,
                                                                partial_cod_config: { ...settings.partial_cod_config, shipping_rates: newRates }
                                                            });
                                                        }}
                                                        className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-black focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* RTO CAPABILITY SIMULATION (Phase 27) */}
            <div className="p-8 rounded-[32px] border border-blue-100 bg-blue-50/20 space-y-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
                        <Zap className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">RTO Capability Resolver</h3>
                        <p className="text-xs text-slate-500 font-medium">Simulate connection status to test RTO engine intervention routing</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-blue-600">Payment Gateway Status</label>
                        <select
                            value={settings.gateway_status}
                            onChange={(e) => setSettings({ ...settings, gateway_status: e.target.value })}
                            className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl font-bold text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all shadow-sm"
                        >
                            <option value="not_configured">Not Configured (No Prepaid/Partial)</option>
                            <option value="pending">Pending Verification</option>
                            <option value="verified">Verified (Full Support)</option>
                        </select>
                        <p className="text-[9px] text-blue-400 font-bold uppercase tracking-tight px-1 italic">Required for STATE A and STATE B</p>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-blue-600">WhatsApp Business API</label>
                        <select
                            value={settings.whatsapp_status}
                            onChange={(e) => setSettings({ ...settings, whatsapp_status: e.target.value })}
                            className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl font-bold text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all shadow-sm"
                        >
                            <option value="not_connected">Not Connected (No Confirmations)</option>
                            <option value="pending">Pending Connection</option>
                            <option value="connected">Connected (Full Support)</option>
                        </select>
                        <p className="text-[9px] text-blue-400 font-bold uppercase tracking-tight px-1 italic">Required for STATE A and STATE C</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
