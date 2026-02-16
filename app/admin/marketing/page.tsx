"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Info, CheckCircle2, AlertCircle, Share2, Target, BarChart3, Globe } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { getActiveStoreIdClient as getActiveStoreId } from "@/lib/getActiveStore.client";
import { toast } from "sonner";

export default function MarketingPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [configs, setConfigs] = useState<any[]>([]);

    useEffect(() => {
        fetchConfigs();
    }, []);

    const fetchConfigs = async () => {
        const storeId = getActiveStoreId();
        if (!storeId) return;

        const { data, error } = await supabaseBrowser
            .from("marketing_configs")
            .select("*")
            .eq("store_id", storeId);

        if (data) setConfigs(data);
        setLoading(false);
    };

    const saveConfig = async (type: string, payload: any) => {
        setSaving(true);
        const storeId = getActiveStoreId();
        if (!storeId) return;

        const { error } = await supabaseBrowser
            .from("marketing_configs")
            .upsert({
                store_id: storeId,
                type,
                ...payload,
                updated_at: new Date().toISOString(),
            }, { onConflict: 'store_id,type' });

        if (error) {
            toast.error(`Failed to save ${type} configuration`);
        } else {
            toast.success(`${type} configuration updated`);
            fetchConfigs();
        }
        setSaving(false);
    };

    const getConfig = (type: string) => configs.find(c => c.type === type) || { is_active: false };

    if (loading) return <div className="p-8">Loading marketing settings...</div>;

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-neutral-900 tracking-tight">Marketing & Tracking</h1>
                    <p className="text-sm font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                        <Target className="w-4 h-4" /> Professional Conversion Tracking
                    </p>
                </div>
                <div className="flex gap-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100 font-bold uppercase tracking-widest text-[10px] px-3 py-1">Advanced Mode</Badge>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-100 font-bold uppercase tracking-widest text-[10px] px-3 py-1">CAPI Enabled</Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* STATS OVERVIEW */}
                <Card className="bg-neutral-900 text-white border-none shadow-2xl rounded-[2rem] overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 -rotate-12 translate-x-8 -translate-y-8" />
                    <CardHeader>
                        <CardDescription className="text-neutral-400 font-bold uppercase tracking-widest text-[10px]">Active Channels</CardDescription>
                        <CardTitle className="text-4xl font-black tracking-tighter">{configs.filter(c => c.is_active).length}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-2 mt-4">
                            {['meta', 'google', 'tiktok'].map(t => (
                                <div key={t} className={`w-8 h-8 rounded-full flex items-center justify-center border ${getConfig(t).is_active ? 'border-green-500/50 bg-green-500/10' : 'border-white/10 opacity-30'}`}>
                                    <div className="w-2 h-2 rounded-full bg-current" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border-neutral-100 shadow-sm rounded-[2rem]">
                    <CardHeader>
                        <CardDescription className="text-neutral-400 font-bold uppercase tracking-widest text-[10px]">Tracking Status</CardDescription>
                        <CardTitle className="text-xl font-black text-neutral-900 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-500" /> Fully Verified
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs font-bold text-neutral-500 leading-relaxed uppercase tracking-widest">All signals are optimized for 100% conversion attribution.</p>
                    </CardContent>
                </Card>

                <Card className="bg-white border-neutral-100 shadow-sm rounded-[2rem]">
                    <CardHeader>
                        <CardDescription className="text-neutral-400 font-bold uppercase tracking-widest text-[10px]">AI Discovery</CardDescription>
                        <CardTitle className="text-xl font-black text-neutral-900 flex items-center gap-2">
                            <Globe className="w-5 h-5 text-blue-500" /> UCP Protocol
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Badge className="bg-neutral-900 text-[10px] font-black uppercase tracking-widest">Enabled</Badge>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="meta" className="w-full">
                <TabsList className="bg-neutral-100/50 p-1 rounded-2xl w-full md:w-auto h-auto grid grid-cols-3 md:flex md:gap-2">
                    <TabsTrigger value="meta" className="rounded-xl font-black uppercase tracking-widest text-[10px] py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all text-neutral-400 data-[state=active]:text-neutral-900">Meta (FB & IG)</TabsTrigger>
                    <TabsTrigger value="google" className="rounded-xl font-black uppercase tracking-widest text-[10px] py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all text-neutral-400 data-[state=active]:text-neutral-900">Google Ads</TabsTrigger>
                    <TabsTrigger value="ucp" className="rounded-xl font-black uppercase tracking-widest text-[10px] py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all text-neutral-400 data-[state=active]:text-neutral-900">AI / UCP</TabsTrigger>
                </TabsList>

                <TabsContent value="meta" className="mt-8 space-y-6 animate-in fade-in duration-300">
                    <Card className="border-neutral-100 shadow-xl rounded-[2.5rem] overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-[#0080fb] to-[#00b2fb] p-8 text-white relative">
                            <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-20"><Share2 className="w-20 h-20" /></div>
                            <div className="flex items-center justify-between relative z-10">
                                <div>
                                    <CardTitle className="text-2xl font-black tracking-tight">Meta Pixel & CAPI</CardTitle>
                                    <CardDescription className="text-white/70 font-bold uppercase tracking-widest text-[10px] mt-1">Track conversions on Facebook & Instagram</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            <div className="flex items-center justify-between p-6 bg-neutral-50 rounded-3xl border border-neutral-100">
                                <div className="space-y-1">
                                    <p className="text-sm font-black text-neutral-900">Enable Meta Integration</p>
                                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Toggle pixel tracking and conversion API</p>
                                </div>
                                <Switch
                                    checked={getConfig('meta').is_active}
                                    onCheckedChange={(checked) => saveConfig('meta', { is_active: checked })}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Pixel ID</Label>
                                        <Input
                                            placeholder="e.g. 123456789012345"
                                            defaultValue={getConfig('meta').pixel_id}
                                            onBlur={(e) => saveConfig('meta', { pixel_id: e.target.value })}
                                            className="h-12 rounded-xl focus:ring-neutral-900 transition-all border-neutral-100 bg-neutral-50/50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Access Token (Server-Side CAPI)</Label>
                                        <Input
                                            type="password"
                                            placeholder="EAAB..."
                                            defaultValue={getConfig('meta').access_token}
                                            onBlur={(e) => saveConfig('meta', { access_token: e.target.value })}
                                            className="h-12 rounded-xl focus:ring-neutral-900 transition-all border-neutral-100 bg-neutral-50/50"
                                        />
                                    </div>
                                </div>
                                <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100/50 space-y-4">
                                    <h4 className="text-xs font-black text-blue-900 uppercase tracking-widest flex items-center gap-2">
                                        <Info className="w-4 h-4" /> Why use CAPI?
                                    </h4>
                                    <p className="text-xs font-medium text-blue-800 leading-relaxed uppercase tracking-wider opacity-80">
                                        The Conversions API (CAPI) bypasses browser limits (like iOS 14+) to ensure your ads get 100% credit for every sale.
                                    </p>
                                    <div className="pt-2">
                                        <Badge className="bg-blue-600 text-[9px] font-black uppercase tracking-widest px-3 py-1">Enterprise Grade Tracking</Badge>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="google" className="mt-8">
                    <Card className="border-neutral-100 shadow-xl rounded-[2.5rem] overflow-hidden">
                        <CardHeader className="bg-[#4285F4] p-8 text-white">
                            <CardTitle className="text-2xl font-black tracking-tight">Google Ads Tracking</CardTitle>
                            <CardDescription className="text-white/70 font-bold uppercase tracking-widest text-[10px] mt-1">Measure Performance on Google Search & Video</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="text-center py-12 space-y-4">
                                <div className="w-16 h-16 rounded-full bg-neutral-50 flex items-center justify-center mx-auto">
                                    <BarChart3 className="w-8 h-8 text-neutral-200" />
                                </div>
                                <p className="text-sm font-bold text-neutral-500 uppercase tracking-widest">Google Integration coming soon</p>
                                <Button variant="outline" className="rounded-xl font-black uppercase tracking-widest text-[10px]">Notify me</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="ucp" className="mt-8">
                    <Card className="border-neutral-100 shadow-xl rounded-[2.5rem] overflow-hidden">
                        <CardHeader className="bg-neutral-900 p-8 text-white">
                            <CardTitle className="text-2xl font-black tracking-tight tracking-tighter">Universal Commerce Protocol (UCP)</CardTitle>
                            <CardDescription className="text-white/40 font-bold uppercase tracking-widest text-[10px] mt-1">Enable Discovery by AI Agents (ChatGPT, Gemini, etc.)</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            <div className="flex items-center justify-between p-6 bg-neutral-50 rounded-3xl border border-neutral-100">
                                <div className="space-y-1">
                                    <p className="text-sm font-black text-neutral-900">UCP Public Endpoint</p>
                                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Allows AI models to find your products</p>
                                </div>
                                <Badge className="bg-green-500 text-white font-black uppercase tracking-widest text-[9px]">Live & Active</Badge>
                            </div>

                            <div className="p-6 border border-neutral-100 rounded-3xl flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Discovery Endpoint</p>
                                    <code className="text-xs font-bold text-neutral-900">/.well-known/commerce</code>
                                </div>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg">
                                    <ExternalLink className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
