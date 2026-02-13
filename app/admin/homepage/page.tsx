"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { getActiveStoreIdClient } from "@/lib/getActiveStore.client";
import { useRouter } from "next/navigation";
import {
    Plus,
    Trash2,
    ChevronUp,
    ChevronDown,
    Save,
    Layout,
    Image as ImageIcon,
    Type,
    MessageSquare,
    ShieldCheck,
    MousePointer2,
    Eye,
    Settings2,
    Grid
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getStoreBaseUrl } from "@/lib/getStoreUrl";

const SECTION_TYPES = [
    { type: "hero", label: "Hero Banner", icon: ImageIcon, defaultData: { slides: [{ image: "/hero.jpg", title: "New Collection", subtitle: "Coming soon", cta: "Shop Now", link: "/products" }] } },
    { type: "marquee", label: "Scrolling Marquee", icon: MousePointer2, defaultData: { items: ["Fast Shipping", "Secure Payment", "24/7 Support"] } },
    { type: "featured_collection", label: "Featured Collection", icon: Grid, defaultData: { title: "Featured Products", description: "Our best sellers" } },
    { type: "image_with_text", label: "Image with Text", icon: Layout, defaultData: { title: "Brand Story", text: "Something about us...", image: "/hero2.jpg", reverse: false } },
    { type: "testimonials", label: "Testimonials", icon: MessageSquare, defaultData: { title: "What customers say", subtitle: "Join 1000+ happy shoppers", testimonials: [] } },
    { type: "trust_bar", label: "Trust Bar", icon: ShieldCheck, defaultData: { items: [] } },
];

export default function HomepageEditor() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [storeId, setStoreId] = useState<string | null>(null);
    const [sections, setSections] = useState<any[]>([]);
    const [storeUrl, setStoreUrl] = useState("");

    useEffect(() => {
        const init = async () => {
            const id = getActiveStoreIdClient();
            if (!id) return;
            setStoreId(id);

            const { data: store } = await supabaseBrowser
                .from("stores")
                .select("theme_config")
                .eq("id", id)
                .single();

            if (store?.theme_config?.homepage_sections) {
                setSections(store.theme_config.homepage_sections);
            } else {
                // Default initial sections
                setSections([
                    { type: "hero", data: SECTION_TYPES[0].defaultData },
                    { type: "marquee", data: SECTION_TYPES[1].defaultData },
                    { type: "featured_collection", data: SECTION_TYPES[2].defaultData },
                ]);
            }

            const url = await getStoreBaseUrl(supabaseBrowser);
            setStoreUrl(url);
            setLoading(false);
        };
        init();
    }, []);

    const saveSections = async () => {
        if (!storeId) return;
        setSaving(true);

        const { data: store } = await supabaseBrowser
            .from("stores")
            .select("theme_config")
            .eq("id", storeId)
            .single();

        const themeConfig = store?.theme_config || {};
        const newConfig = { ...themeConfig, homepage_sections: sections };

        const { error } = await supabaseBrowser
            .from("stores")
            .update({ theme_config: newConfig })
            .eq("id", storeId);

        setSaving(false);
        if (error) {
            toast.error("Failed to save homepage");
        } else {
            toast.success("Homepage design saved!");
        }
    };

    const addSection = (type: string) => {
        const typeInfo = SECTION_TYPES.find(t => t.type === type);
        if (!typeInfo) return;
        setSections([...sections, { type, data: typeInfo.defaultData }]);
    };

    const removeSection = (index: number) => {
        const newSections = [...sections];
        newSections.splice(index, 1);
        setSections(newSections);
    };

    const moveSection = (index: number, direction: "up" | "down") => {
        if (direction === "up" && index === 0) return;
        if (direction === "down" && index === sections.length - 1) return;

        const newSections = [...sections];
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
        setSections(newSections);
    };

    const updateSectionData = (index: number, newData: any) => {
        const newSections = [...sections];
        newSections[index].data = { ...newSections[index].data, ...newData };
        setSections(newSections);
    };

    if (loading) return <div className="p-8 text-center">Loading editor...</div>;

    return (
        <div className="max-w-6xl mx-auto py-8 px-4 pb-24">
            <div className="flex items-center justify-between mb-8 border-b border-neutral-100 pb-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Homepage Design</h1>
                    <p className="text-neutral-500 mt-1 font-medium italic">Craft your store's first impression</p>
                </div>
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        onClick={() => window.open(storeUrl, "_blank")}
                        className="gap-2"
                    >
                        <Eye className="w-4 h-4" />
                        Live Preview
                    </Button>
                    <Button
                        onClick={saveSections}
                        disabled={saving}
                        className="bg-black text-white hover:bg-neutral-800 gap-2 px-8"
                    >
                        {saving ? "Saving..." : <><Save className="w-4 h-4" /> Save Design</>}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Editor Sidebar */}
                <div className="lg:col-span-12 xl:col-span-4 space-y-6">
                    <section className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
                        <h2 className="text-sm font-black text-neutral-400 uppercase tracking-widest mb-6">Store Sections</h2>

                        <div className="space-y-3">
                            {sections.map((section, idx) => (
                                <div key={idx} className="group flex items-center gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-100 hover:border-neutral-300 transition-all">
                                    <div className="flex flex-col gap-1">
                                        <button onClick={() => moveSection(idx, "up")} className="p-1 hover:bg-white rounded transition-colors disabled:opacity-30" disabled={idx === 0}>
                                            <ChevronUp className="w-3 h-3 text-neutral-500" />
                                        </button>
                                        <button onClick={() => moveSection(idx, "down")} className="p-1 hover:bg-white rounded transition-colors disabled:opacity-30" disabled={idx === sections.length - 1}>
                                            <ChevronDown className="w-3 h-3 text-neutral-500" />
                                        </button>
                                    </div>
                                    <div className="flex-1">
                                        <span className="text-sm font-bold text-neutral-700 capitalize">{section.type.replace(/_/g, " ")}</span>
                                    </div>
                                    <button onClick={() => removeSection(idx)} className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-6 border-t border-neutral-100">
                            <h3 className="text-xs font-bold text-neutral-500 mb-4 px-1">Add New Section</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {SECTION_TYPES.map((type) => (
                                    <button
                                        key={type.type}
                                        onClick={() => addSection(type.type)}
                                        className="flex items-center gap-2 p-3 text-left text-xs font-bold bg-white border border-neutral-100 rounded-xl hover:border-black hover:bg-neutral-50 transition-all"
                                    >
                                        <type.icon className="w-4 h-4 text-neutral-400" />
                                        {type.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>

                {/* Content Editor */}
                <div className="lg:col-span-12 xl:col-span-8 space-y-8">
                    {sections.length === 0 && (
                        <div className="text-center py-20 bg-neutral-50 rounded-3xl border-2 border-dashed border-neutral-200">
                            <Layout className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                            <p className="text-neutral-500 font-medium">Your homepage is empty. Add a section to get started.</p>
                        </div>
                    )}

                    {sections.map((section, idx) => (
                        <div key={idx} className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-2 bg-neutral-100 rounded-xl">
                                    {(() => {
                                        const Icon = SECTION_TYPES.find(t => t.type === section.type)?.icon;
                                        return Icon ? <Icon className="w-5 h-5 text-neutral-600" /> : null;
                                    })()}
                                </div>
                                <h3 className="text-lg font-black text-neutral-900 capitalize">{section.type.replace(/_/g, " ")} Section</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {section.type === "hero" && (
                                    <>
                                        <div className="space-y-4">
                                            <label className="block text-xs font-black text-neutral-400 uppercase tracking-widest">Main Title</label>
                                            <input
                                                type="text"
                                                value={section.data.slides[0].title}
                                                onChange={(e) => {
                                                    const slides = [...section.data.slides];
                                                    slides[0].title = e.target.value;
                                                    updateSectionData(idx, { slides });
                                                }}
                                                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl font-bold focus:ring-2 focus:ring-black outline-none"
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="block text-xs font-black text-neutral-400 uppercase tracking-widest">Sub-text</label>
                                            <input
                                                type="text"
                                                value={section.data.slides[0].subtitle}
                                                onChange={(e) => {
                                                    const slides = [...section.data.slides];
                                                    slides[0].subtitle = e.target.value;
                                                    updateSectionData(idx, { slides });
                                                }}
                                                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl font-bold focus:ring-2 focus:ring-black outline-none"
                                            />
                                        </div>
                                    </>
                                )}

                                {section.type === "marquee" && (
                                    <div className="col-span-2 space-y-4">
                                        <label className="block text-xs font-black text-neutral-400 uppercase tracking-widest">Marquee Text (separate by comma)</label>
                                        <textarea
                                            value={section.data.items.join(", ")}
                                            onChange={(e) => updateSectionData(idx, { items: e.target.value.split(",").map(i => i.trim()) })}
                                            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl font-bold focus:ring-2 focus:ring-black outline-none min-h-[100px]"
                                        />
                                    </div>
                                )}

                                {section.type === "featured_collection" && (
                                    <>
                                        <div className="space-y-4">
                                            <label className="block text-xs font-black text-neutral-400 uppercase tracking-widest">Section Title</label>
                                            <input
                                                type="text"
                                                value={section.data.title}
                                                onChange={(e) => updateSectionData(idx, { title: e.target.value })}
                                                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl font-bold focus:ring-2 focus:ring-black outline-none"
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="block text-xs font-black text-neutral-400 uppercase tracking-widest">Description</label>
                                            <input
                                                type="text"
                                                value={section.data.description}
                                                onChange={(e) => updateSectionData(idx, { description: e.target.value })}
                                                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl font-bold focus:ring-2 focus:ring-black outline-none"
                                            />
                                        </div>
                                    </>
                                )}

                                {section.type === "image_with_text" && (
                                    <>
                                        <div className="space-y-4">
                                            <label className="block text-xs font-black text-neutral-400 uppercase tracking-widest">Title</label>
                                            <input
                                                type="text"
                                                value={section.data.title}
                                                onChange={(e) => updateSectionData(idx, { title: e.target.value })}
                                                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl font-bold focus:ring-2 focus:ring-black outline-none"
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="block text-xs font-black text-neutral-400 uppercase tracking-widest">Layout</label>
                                            <Button
                                                variant="secondary"
                                                className="w-full justify-start font-bold"
                                                onClick={() => updateSectionData(idx, { reverse: !section.data.reverse })}
                                            >
                                                {section.data.reverse ? "Image on Right" : "Image on Left"}
                                            </Button>
                                        </div>
                                        <div className="col-span-2 space-y-4">
                                            <label className="block text-xs font-black text-neutral-400 uppercase tracking-widest">Body Text</label>
                                            <textarea
                                                value={section.data.text}
                                                onChange={(e) => updateSectionData(idx, { text: e.target.value })}
                                                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl font-bold focus:ring-2 focus:ring-black outline-none min-h-[120px]"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
