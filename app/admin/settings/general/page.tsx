"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { getActiveStoreIdClient } from "@/lib/getActiveStore.client";
import { useRouter } from "next/navigation";
import { Save, RotateCcw, Building2, Image as ImageIcon, Info, Share2, Instagram, Facebook, Twitter, MessageCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const storeSchema = z.object({
    name: z.string().min(1, "Store name is required"),
    logo_url: z.string().optional().nullable(),
    about: z.string().optional().nullable(),
    social_links: z.object({
        instagram: z.string().optional(),
        facebook: z.string().optional(),
        twitter: z.string().optional(),
        whatsapp: z.string().optional(),
    }),
});

type StoreData = z.infer<typeof storeSchema>;

export default function GeneralSettingsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [storeId, setStoreId] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { isDirty },
    } = useForm<StoreData>({
        resolver: zodResolver(storeSchema),
        defaultValues: {
            name: "",
            logo_url: "",
            about: "",
            social_links: {
                instagram: "",
                facebook: "",
                twitter: "",
                whatsapp: "",
            }
        }
    });

    useEffect(() => {
        const fetchStore = async () => {
            const id = getActiveStoreIdClient();
            if (!id) return;
            setStoreId(id);
            const { data, error } = await supabaseBrowser
                .from("stores")
                .select("name, logo_url, about, social_links")
                .eq("id", id)
                .single();

            if (data) {
                reset({
                    name: data.name || "",
                    logo_url: data.logo_url || "",
                    about: data.about || "",
                    social_links: {
                        instagram: data.social_links?.instagram || "",
                        facebook: data.social_links?.facebook || "",
                        twitter: data.social_links?.twitter || "",
                        whatsapp: data.social_links?.whatsapp || "",
                    }
                });
            }
            setLoading(false);
        };
        fetchStore();
    }, [reset]);

    const onSave = async (data: StoreData) => {
        if (!storeId) return;
        setSaving(true);
        const { error } = await supabaseBrowser
            .from("stores")
            .update({
                name: data.name,
                logo_url: data.logo_url,
                about: data.about,
                social_links: data.social_links
            })
            .eq("id", storeId);

        setSaving(false);
        if (error) {
            toast.error("Failed to save store settings");
        } else {
            toast.success("Store settings saved successfully");
            router.refresh();
        }
    };

    if (loading) return <div className="p-8 text-center bg-white min-h-[400px] flex items-center justify-center">Loading settings...</div>;

    return (
        <form onSubmit={handleSubmit(onSave)} className="max-w-4xl mx-auto py-8 px-4 pb-24">
            <div className="flex items-center justify-between mb-10 border-b border-neutral-100 pb-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Store Information</h1>
                    <p className="text-neutral-500 mt-1 font-medium">Manage your brand's core identity and social presence</p>
                </div>
                <div className="flex items-center gap-4">
                    {isDirty && <span className="text-xs text-orange-600 font-bold bg-orange-50 px-3 py-1 rounded-full border border-orange-100">Unsaved Changes</span>}
                    <Button
                        type="submit"
                        disabled={saving}
                        className="bg-black text-white hover:bg-neutral-800 gap-2 px-8 py-6 rounded-xl shadow-xl transition-all active:scale-95"
                    >
                        {saving ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {saving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </div>

            <div className="space-y-8">
                {/* Basic Info */}
                <section className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-neutral-100 rounded-lg">
                            <Building2 className="w-5 h-5 text-neutral-600" />
                        </div>
                        <h2 className="text-lg font-bold text-neutral-800">Basic Details</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-neutral-400 uppercase tracking-widest ml-1">Store Name</label>
                            <input
                                {...register("name")}
                                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl font-bold focus:ring-2 focus:ring-black outline-none transition-all"
                                placeholder="Enter your store name"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-neutral-400 uppercase tracking-widest ml-1">Logo URL (Preview)</label>
                            <div className="flex gap-4 items-start">
                                <div className="flex-1 space-y-2">
                                    <input
                                        {...register("logo_url")}
                                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl font-bold focus:ring-2 focus:ring-black outline-none transition-all"
                                        placeholder="https://example.com/logo.png"
                                    />
                                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-tight">Direct link to your logo image. File upload coming soon.</p>
                                </div>
                                <div className="w-24 h-24 rounded-xl border border-neutral-100 bg-neutral-50 flex items-center justify-center p-2 overflow-hidden">
                                    {watch("logo_url") ? (
                                        <img src={watch("logo_url") || ""} alt="Logo Preview" className="max-w-full max-h-full object-contain" />
                                    ) : (
                                        <ImageIcon className="w-8 h-8 text-neutral-200" />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-neutral-100 rounded-lg">
                            <Info className="w-5 h-5 text-neutral-600" />
                        </div>
                        <h2 className="text-lg font-bold text-neutral-800">About the Store</h2>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-neutral-400 uppercase tracking-widest ml-1">Store Description</label>
                        <textarea
                            {...register("about")}
                            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl font-medium focus:ring-2 focus:ring-black outline-none transition-all min-h-[160px]"
                            placeholder="Tell your customers about your brand..."
                        />
                    </div>
                </section>

                {/* Social Handles */}
                <section className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-neutral-100 rounded-lg">
                            <Share2 className="w-5 h-5 text-neutral-600" />
                        </div>
                        <h2 className="text-lg font-bold text-neutral-800">Social Handles</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-black text-neutral-400 uppercase tracking-widest ml-1">
                                <Instagram className="w-3 h-3" /> Instagram
                            </label>
                            <input
                                {...register("social_links.instagram")}
                                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl font-bold focus:ring-2 focus:ring-black outline-none transition-all"
                                placeholder="instagram.com/yourhandle"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-black text-neutral-400 uppercase tracking-widest ml-1">
                                <Facebook className="w-3 h-3" /> Facebook
                            </label>
                            <input
                                {...register("social_links.facebook")}
                                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl font-bold focus:ring-2 focus:ring-black outline-none transition-all"
                                placeholder="facebook.com/yourpage"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-black text-neutral-400 uppercase tracking-widest ml-1">
                                <Twitter className="w-3 h-3" /> Twitter / X
                            </label>
                            <input
                                {...register("social_links.twitter")}
                                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl font-bold focus:ring-2 focus:ring-black outline-none transition-all"
                                placeholder="twitter.com/yourhandle"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-black text-neutral-400 uppercase tracking-widest ml-1">
                                <MessageCircle className="w-3 h-3" /> WhatsApp
                            </label>
                            <input
                                {...register("social_links.whatsapp")}
                                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl font-bold focus:ring-2 focus:ring-black outline-none transition-all"
                                placeholder="+91 00000 00000"
                            />
                        </div>
                    </div>
                </section>
            </div>
        </form>
    );
}
