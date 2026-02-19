"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Plus,
    Ticket,
    Trash2,
    Calendar,
    Percent,
    IndianRupee,
    TrendingDown,
    Search,
    ChevronRight,
    ArrowUpRight,
    Info
} from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { getActiveStoreIdClient as getActiveStoreId } from "@/lib/getActiveStore.client";
import { toast } from "sonner";
import { PrepaidRulesSection } from "./components/PrepaidRulesSection";
import { saveDiscount, toggleDiscountStatus, deleteDiscountServer, getDiscounts } from "./actions";

export default function DiscountsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [discounts, setDiscounts] = useState<any[]>([]);
    const [showNewForm, setShowNewForm] = useState(false);

    // New Discount Form State
    const [formData, setFormData] = useState({
        code: "",
        type: "percentage",
        value: 0,
        min_order_amount: 0,
        expires_at: "",
        usage_limit: "",
    });

    useEffect(() => {
        fetchDiscounts();
    }, []);

    const fetchDiscounts = async () => {
        const storeId = getActiveStoreId();
        if (!storeId) return;

        setLoading(true);
        const result = await getDiscounts(storeId);

        if (result.success && result.data) {
            setDiscounts(result.data);
        } else {
            console.error("Failed to fetch discounts via Server Action");
            toast.error("Could not load discounts");
        }
        setLoading(false);
    };

    const handleCreate = async () => {
        if (!formData.code || formData.value <= 0) {
            toast.error("Please fill in code and value");
            return;
        }

        setSaving(true);
        const storeId = getActiveStoreId();

        const payload = {
            store_id: storeId,
            code: formData.code.toUpperCase(),
            type: formData.type,
            value: formData.value,
            min_order_amount: formData.min_order_amount || 0,
            expires_at: formData.expires_at || null,
            usage_limit: formData.usage_limit ? parseInt(formData.usage_limit as string) : null,
            is_active: true
        };

        const result = await saveDiscount(payload);

        if (result.error) {
            toast.error(`Failed to create discount: ${result.error}`);
        } else {
            toast.success("Discount created successfully");
            setFormData({
                code: "",
                type: "percentage",
                value: 0,
                min_order_amount: 0,
                expires_at: "",
                usage_limit: "",
            });
            setShowNewForm(false);
            fetchDiscounts();
        }
        setSaving(false);
    };

    const toggleStatus = async (id: string, current: boolean) => {
        const result = await toggleDiscountStatus(id, !current);
        if (result.error) toast.error("Update failed");
        else fetchDiscounts();
    };

    const deleteDiscount = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        const result = await deleteDiscountServer(id);

        if (result.error) toast.error("Delete failed");
        else fetchDiscounts();
    };

    if (loading) return <div className="p-8">Loading discounts...</div>;

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4">
            {/* PREPAID RULES SECTION */}
            <div className="mb-12 border-b border-neutral-100 pb-12">
                <PrepaidRulesSection />
            </div>

            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-neutral-900 tracking-tight">Discounts & Promos</h1>
                    <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                        <TrendingDown className="w-4 h-4" /> Drive conversions with coupons
                    </p>
                </div>
                <Button
                    onClick={() => setShowNewForm(!showNewForm)}
                    className="bg-neutral-900 text-white rounded-2xl h-12 px-6 font-black uppercase tracking-widest text-[10px] hover:bg-neutral-800 shadow-xl transition-all flex items-center gap-2"
                >
                    {showNewForm ? <ChevronRight className="w-4 h-4 rotate-90" /> : <Plus className="w-4 h-4" />}
                    {showNewForm ? "Cancel" : "Create Discount"}
                </Button>
            </div>

            {/* ADVISORY: Quantity Breaks (P8) */}
            <div className="bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100 flex flex-col md:flex-row items-center gap-6 animate-in slide-in-from-right-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <Info className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-center md:text-left flex-1">
                    <h3 className="text-xs font-black text-blue-900 uppercase tracking-wider flex items-center justify-center md:justify-start gap-2">
                        Quantity Breaks Management
                    </h3>
                    <p className="text-[10px] font-bold text-blue-500 tracking-tight leading-relaxed mt-1">
                        Bulk discounts and tiered pricing are configured at the <span className="text-blue-700">Individual Product</span> level.
                        Go to Products &gt; Edit &gt; Quantity Breaks to manage these.
                    </p>
                </div>
                <Button
                    variant="outline"
                    className="border-blue-100 text-blue-600 hover:bg-blue-100/50 rounded-xl h-9 text-[9px] font-black uppercase tracking-widest px-4"
                    onClick={() => window.location.href = '/admin/products'}
                >
                    Manage Products
                </Button>
            </div>

            {/* NEW DISCOUNT FORM */}
            {showNewForm && (
                <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden animate-in zoom-in-95 duration-200">
                    <CardHeader className="bg-neutral-50 border-b border-neutral-100 p-8">
                        <CardTitle className="text-xl font-black text-neutral-900">New Promo Code</CardTitle>
                        <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mt-1">Configure your discount rules</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Discount Code</Label>
                                    <Input
                                        placeholder="e.g. WELCOME10"
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                        className="h-12 rounded-xl border-neutral-100 bg-neutral-50/50 focus:ring-neutral-900 uppercase font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Discount Type</Label>
                                    <div className="flex gap-2 p-1 bg-neutral-50 rounded-xl border border-neutral-100">
                                        <button
                                            onClick={() => setFormData({ ...formData, type: 'percentage' })}
                                            className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${formData.type === 'percentage' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-400 hover:text-neutral-600'}`}
                                        >
                                            Percentage
                                        </button>
                                        <button
                                            onClick={() => setFormData({ ...formData, type: 'fixed_amount' })}
                                            className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${formData.type === 'fixed_amount' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-400 hover:text-neutral-600'}`}
                                        >
                                            Fixed Amount
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Discount Value</Label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                            {formData.type === 'percentage' ? <Percent className="w-4 h-4 text-neutral-400" /> : <IndianRupee className="w-4 h-4 text-neutral-400" />}
                                        </div>
                                        <Input
                                            type="number"
                                            value={formData.value}
                                            onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })}
                                            className="h-12 pl-12 rounded-xl border-neutral-100 bg-neutral-50/50 focus:ring-neutral-900 font-bold"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Min Order Amount (₹)</Label>
                                    <Input
                                        type="number"
                                        value={formData.min_order_amount}
                                        onChange={(e) => setFormData({ ...formData, min_order_amount: parseFloat(e.target.value) })}
                                        className="h-12 rounded-xl border-neutral-100 bg-neutral-50/50 focus:ring-neutral-900 font-bold"
                                    />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Expiration Date (Optional)</Label>
                                    <Input
                                        type="date"
                                        value={formData.expires_at}
                                        onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                                        className="h-12 rounded-xl border-neutral-100 bg-neutral-50/50 focus:ring-neutral-900 font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Usage Limit (Optional)</Label>
                                    <Input
                                        type="number"
                                        placeholder="No limit"
                                        value={formData.usage_limit}
                                        onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                                        className="h-12 rounded-xl border-neutral-100 bg-neutral-50/50 focus:ring-neutral-900 font-bold"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 flex justify-end gap-3 pt-8 border-t border-neutral-50">
                            <Button variant="ghost" onClick={() => setShowNewForm(false)} className="rounded-xl font-bold uppercase tracking-widest text-[10px]">Discard</Button>
                            <Button
                                onClick={handleCreate}
                                disabled={saving}
                                className="bg-neutral-900 text-white rounded-xl px-8 h-12 font-black uppercase tracking-widest text-[10px] hover:shadow-xl transition-all"
                            >
                                {saving ? "Creating..." : "Save Discount"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* DISCOUNTS LIST */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {discounts.length === 0 && !showNewForm && (
                    <div className="col-span-full py-20 text-center space-y-4 bg-white rounded-[2.5rem] border border-dashed border-neutral-200">
                        <div className="w-16 h-16 rounded-full bg-neutral-50 flex items-center justify-center mx-auto text-neutral-300">
                            <Ticket className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-neutral-500 uppercase tracking-widest">No active discounts</p>
                            <p className="text-[10px] text-neutral-400 font-bold mt-1">Create your first coupon to boost sales.</p>
                        </div>
                    </div>
                )}

                {discounts.map((discount) => (
                    <Card key={discount.id} className="border-neutral-100 shadow-sm rounded-[2rem] hover:shadow-xl transition-all group relative overflow-hidden bg-white">
                        <div className={`absolute top-0 right-0 w-16 h-16 ${discount.is_active ? 'bg-green-50' : 'bg-neutral-50'} rotate-45 translate-x-8 -translate-y-8`} />
                        <CardHeader className="p-8 pb-4">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-neutral-50 rounded-2xl group-hover:bg-neutral-100 transition-colors">
                                    <Ticket className="w-6 h-6 text-neutral-900" />
                                </div>
                                <Badge variant="outline" className={`font-black uppercase tracking-widest text-[9px] px-3 py-1 ${discount.is_active ? 'bg-green-50 text-green-600 border-green-100' : 'bg-neutral-50 text-neutral-400 border-neutral-100'}`}>
                                    {discount.is_active ? 'Active' : 'Paused'}
                                </Badge>
                            </div>
                            <CardTitle className="text-2xl font-black text-neutral-900 tracking-tight uppercase flex items-center gap-2">
                                {discount.code}
                                <ArrowUpRight className="w-4 h-4 text-neutral-200 group-hover:text-neutral-400 transition-colors" />
                            </CardTitle>
                            <CardDescription className="text-sm font-black text-neutral-900 mt-2">
                                {discount.type === 'percentage' ? `${discount.value}% OFF` : `₹${discount.value} OFF`}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 space-y-6">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-400 bg-neutral-50/50 p-3 rounded-xl border border-neutral-100/50">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span className="uppercase tracking-widest">
                                        {discount.expires_at ? `Exp: ${new Date(discount.expires_at).toLocaleDateString()}` : "Never Expires"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-400 bg-neutral-50/50 p-3 rounded-xl border border-neutral-100/50">
                                    < IndianRupee className="w-3.5 h-3.5" />
                                    <span className="uppercase tracking-widest">
                                        Min Order: ₹{discount.min_order_amount}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-neutral-50 gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => toggleStatus(discount.id, discount.is_active)}
                                    className="flex-1 rounded-xl h-10 text-[9px] font-black uppercase tracking-widest border-neutral-100 hover:bg-neutral-50"
                                >
                                    {discount.is_active ? "Pause" : "Enable"}
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() => deleteDiscount(discount.id)}
                                    className="w-10 h-10 p-0 rounded-xl text-neutral-300 hover:text-red-500 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
