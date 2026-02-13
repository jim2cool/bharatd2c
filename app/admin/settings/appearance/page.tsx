"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { getActiveStoreIdClient } from "@/lib/getActiveStore.client";
import { useRouter } from "next/navigation";
import { ChevronDown, Check, Palette, Type, Layout, Sparkles, Save, RotateCcw } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

// ═══════════════════════════════════════════════════════════════════════════
// TYPES & SCHEMA
// ═══════════════════════════════════════════════════════════════════════════

const configSchema = z.object({
    presetId: z.string().optional(),
    colors: z.object({
        primary: z.string(),
        secondary: z.string(),
        accent: z.string(),
        background: z.string(),
        surface: z.string(),
        text: z.string(),
    }),
    corners: z.object({
        buttons: z.enum(["sharp", "subtle", "rounded", "pill"]),
        cards: z.enum(["sharp", "subtle", "rounded"]),
        inputs: z.enum(["sharp", "subtle", "rounded"]),
        images: z.enum(["sharp", "subtle", "rounded", "circle"]),
        badges: z.enum(["sharp", "subtle", "pill"]),
        selectors: z.enum(["sharp", "subtle", "rounded"]),
    }),
    buttons: z.object({
        primaryStyle: z.enum(["solid", "gradient", "glow"]),
        secondaryStyle: z.enum(["outline", "ghost", "subtle"]),
        shadow: z.enum(["none", "subtle", "elevated"]),
    }),
    spacing: z.object({
        sectionGap: z.enum(["tight", "default", "spacious"]),
        cardGap: z.enum(["tight", "default", "relaxed"]),
    }),
    typography: z.object({
        headingFont: z.string(),
        bodyFont: z.string(),
        scale: z.enum(["compact", "default", "large"]),
        lineHeight: z.enum(["tight", "default", "spacious"]),
        paragraphGap: z.enum(["compact", "default", "loose"]),
    }),
});

type ThemeConfig = z.infer<typeof configSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// PRESETS
// ═══════════════════════════════════════════════════════════════════════════
const PRESETS: any[] = [
    {
        id: "modern",
        presetId: "modern",
        name: "Modern Minimalist",
        description: "Clean lines, subtle corners",
        colors: { primary: "#111111", secondary: "#333333", accent: "#e26a00", background: "#ffffff", surface: "#f9f9f9", text: "#111111" },
        corners: { buttons: "subtle", cards: "subtle", inputs: "subtle", images: "subtle", badges: "pill", selectors: "subtle" },
        buttons: { primaryStyle: "solid", secondaryStyle: "outline", shadow: "subtle" },
        spacing: { sectionGap: "default", cardGap: "default" },
        typography: { headingFont: "Inter", bodyFont: "Inter", scale: "default", lineHeight: "default", paragraphGap: "default" },
    },
    {
        id: "nature",
        presetId: "nature",
        name: "Nature & Organic",
        description: "Earthy tones, soft corners",
        colors: { primary: "#2f4f4f", secondary: "#5f7f7f", accent: "#8fbc8f", background: "#fdfbf7", surface: "#f5f2eb", text: "#2f3f2f" },
        corners: { buttons: "rounded", cards: "rounded", inputs: "rounded", images: "rounded", badges: "pill", selectors: "rounded" },
        buttons: { primaryStyle: "solid", secondaryStyle: "outline", shadow: "none" },
        spacing: { sectionGap: "spacious", cardGap: "relaxed" },
        typography: { headingFont: "Outfit", bodyFont: "DM Sans", scale: "default", lineHeight: "spacious", paragraphGap: "loose" },
    },
    {
        id: "luxury",
        presetId: "luxury",
        name: "Luxury Premium",
        description: "Sharp edges, gold accents",
        colors: { primary: "#0f172a", secondary: "#1e293b", accent: "#d4af37", background: "#fafafa", surface: "#ffffff", text: "#0f172a" },
        corners: { buttons: "sharp", cards: "sharp", inputs: "sharp", images: "sharp", badges: "subtle", selectors: "sharp" },
        buttons: { primaryStyle: "solid", secondaryStyle: "outline", shadow: "elevated" },
        spacing: { sectionGap: "spacious", cardGap: "default" },
        typography: { headingFont: "Playfair Display", bodyFont: "Inter", scale: "default", lineHeight: "spacious", paragraphGap: "default" },
    },
    {
        id: "friendly",
        presetId: "friendly",
        name: "Soft & Friendly",
        description: "Pill buttons, rounded everything",
        colors: { primary: "#7c3aed", secondary: "#a78bfa", accent: "#f59e0b", background: "#ffffff", surface: "#faf5ff", text: "#1f2937" },
        corners: { buttons: "pill", cards: "rounded", inputs: "rounded", images: "rounded", badges: "pill", selectors: "rounded" },
        buttons: { primaryStyle: "solid", secondaryStyle: "ghost", shadow: "subtle" },
        spacing: { sectionGap: "default", cardGap: "relaxed" },
        typography: { headingFont: "Poppins", bodyFont: "Poppins", scale: "large", lineHeight: "default", paragraphGap: "default" },
    },
    {
        id: "editorial",
        presetId: "editorial",
        name: "Bold Editorial",
        description: "Sharp cards, pill CTAs",
        colors: { primary: "#dc2626", secondary: "#1f2937", accent: "#f59e0b", background: "#ffffff", surface: "#f3f4f6", text: "#111827" },
        corners: { buttons: "pill", cards: "sharp", inputs: "subtle", images: "sharp", badges: "pill", selectors: "subtle" },
        buttons: { primaryStyle: "solid", secondaryStyle: "outline", shadow: "elevated" },
        spacing: { sectionGap: "tight", cardGap: "tight" },
        typography: { headingFont: "Space Grotesk", bodyFont: "Inter", scale: "default", lineHeight: "tight", paragraphGap: "compact" },
    },
    {
        id: "tech",
        presetId: "tech",
        name: "Tech Blue",
        description: "Professional SaaS look",
        colors: { primary: "#2563eb", secondary: "#3b82f6", accent: "#06b6d4", background: "#f8fafc", surface: "#ffffff", text: "#0f172a" },
        corners: { buttons: "subtle", cards: "subtle", inputs: "subtle", images: "subtle", badges: "pill", selectors: "subtle" },
        buttons: { primaryStyle: "solid", secondaryStyle: "outline", shadow: "subtle" },
        spacing: { sectionGap: "default", cardGap: "default" },
        typography: { headingFont: "Inter", bodyFont: "Inter", scale: "default", lineHeight: "default", paragraphGap: "default" },
    },
];

const DEFAULT_CONFIG: ThemeConfig = {
    presetId: "modern",
    colors: PRESETS[0].colors,
    corners: PRESETS[0].corners,
    buttons: PRESETS[0].buttons,
    spacing: PRESETS[0].spacing,
    typography: PRESETS[0].typography,
};

const FONT_OPTIONS = [
    { value: "Inter", label: "Inter (Modern)" },
    { value: "Poppins", label: "Poppins (Friendly)" },
    { value: "Playfair Display", label: "Playfair (Elegant)" },
    { value: "Space Grotesk", label: "Space Grotesk (Tech)" },
    { value: "DM Sans", label: "DM Sans (Clean)" },
    { value: "Outfit", label: "Outfit (Contemporary)" },
];

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

function Accordion({ title, icon: Icon, children, defaultOpen = false }: { title: string; icon: any; children: React.ReactNode; defaultOpen?: boolean; }) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="border border-neutral-200 rounded-xl overflow-hidden bg-white shadow-sm transition-all mb-4">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-neutral-600" />
                    </div>
                    <span className="font-bold text-neutral-800">{title}</span>
                </div>
                <ChevronDown className={`w-5 h-5 text-neutral-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
            </button>
            {open && <div className="p-5 pt-2 border-t border-neutral-100 animate-in slide-in-from-top-2 duration-300">{children}</div>}
        </div>
    );
}

function CornerSelector({ value, onChange, options = ["sharp", "subtle", "rounded", "pill"] }: { value: string; onChange: (val: any) => void; options?: string[]; }) {
    const labels: Record<string, string> = { sharp: "Sharp", subtle: "Subtle", rounded: "Rounded", pill: "Pill", circle: "Circle" };
    const radii: Record<string, string> = { sharp: "0px", subtle: "0.5rem", rounded: "1rem", pill: "9999px", circle: "50%" };
    return (
        <div className="flex gap-2 flex-wrap">
            {options.map((opt) => (
                <button
                    key={opt}
                    type="button"
                    onClick={() => onChange(opt)}
                    className={`px-4 py-2 text-xs border font-bold transition-all ${value === opt ? "bg-black text-white border-black shadow-md scale-105" : "bg-white text-neutral-600 border-neutral-200 hover:border-black hover:text-black"}`}
                    style={{ borderRadius: radii[opt] }}
                >
                    {labels[opt]}
                </button>
            ))}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════

export default function AppearancePage() {
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
    } = useForm<ThemeConfig>({
        resolver: zodResolver(configSchema),
        defaultValues: DEFAULT_CONFIG
    });

    const config = watch();

    useEffect(() => {
        const fetchStore = async () => {
            const id = getActiveStoreIdClient();
            if (!id) return;
            setStoreId(id);
            const { data } = await supabaseBrowser.from("stores").select("theme_config").eq("id", id).single();
            if (data?.theme_config && Object.keys(data.theme_config).length > 0) {
                reset({ ...DEFAULT_CONFIG, ...data.theme_config });
            }
            setLoading(false);
        };
        fetchStore();
    }, [reset]);

    const onSave = async (data: ThemeConfig) => {
        if (!storeId) return;
        setSaving(true);
        const { error } = await supabaseBrowser.from("stores").update({ theme_config: data }).eq("id", storeId);
        setSaving(false);
        if (error) {
            toast.error("Failed to save theme settings");
        } else {
            toast.success("Theme settings saved");
            router.refresh();
        }
    };

    const applyPreset = (presetId: string) => {
        const preset = PRESETS.find((p) => p.id === presetId);
        if (preset) {
            reset({ ...config, ...preset, presetId });
        }
    };

    if (loading) return <div className="p-8 text-center bg-white min-h-[400px] flex items-center justify-center">Loading settings...</div>;

    return (
        <form onSubmit={handleSubmit(onSave)} className="max-w-6xl mx-auto py-8 px-4 pb-24">
            <div className="flex items-center justify-between mb-10 border-b border-neutral-100 pb-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Appearance</h1>
                    <p className="text-neutral-500 mt-1 font-medium italic">Define your store's visual identity</p>
                </div>
                <div className="flex items-center gap-4">
                    {isDirty && <span className="text-xs text-orange-600 font-bold bg-orange-50 px-3 py-1 rounded-full border border-orange-100">Pending Changes</span>}
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-8 py-3 bg-black text-white font-bold rounded-xl hover:bg-neutral-800 disabled:opacity-50 transition-all shadow-xl hover:shadow-2xl active:scale-95"
                    >
                        {saving ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-7 space-y-8">
                    <section className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Sparkles className="w-24 h-24" />
                        </div>
                        <h2 className="text-xl font-extrabold text-neutral-800 mb-2">Style Presets</h2>
                        <p className="text-sm text-neutral-500 mb-6 font-medium">Jumpstart your design with curated collections</p>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                            {PRESETS.map((preset) => (
                                <button
                                    key={preset.id}
                                    type="button"
                                    onClick={() => applyPreset(preset.id)}
                                    className={`relative flex flex-col items-start gap-3 p-4 rounded-2xl border-2 text-left transition-all hover:shadow-lg ${config.presetId === preset.id ? "border-black bg-neutral-50 shadow-md" : "border-neutral-100 hover:border-neutral-300 bg-white"}`}
                                >
                                    {config.presetId === preset.id && <div className="absolute top-3 right-3 bg-black text-white p-1 rounded-full"><Check className="w-3 h-3" /></div>}
                                    <div className="flex -space-x-2">
                                        <div className="w-6 h-6 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: preset.colors.primary }} />
                                        <div className="w-6 h-6 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: preset.colors.accent }} />
                                        <div className="w-6 h-6 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: preset.colors.background }} />
                                    </div>
                                    <div>
                                        <span className="text-sm font-extrabold text-neutral-900 block leading-tight">{preset.name}</span>
                                        <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">{preset.description}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm">
                        <h2 className="text-xl font-extrabold text-neutral-800 mb-2">Core Branding</h2>
                        <p className="text-sm text-neutral-500 mb-8 font-medium">Your signature colors and typography</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-neutral-700 mb-3 ml-1">Brand Color (Primary)</label>
                                    <div className="flex items-center gap-4 bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                                        <input type="color" value={config.colors.primary} onChange={(e) => setValue("colors.primary", e.target.value, { shouldDirty: true })} className="h-10 w-16 rounded-lg pointer cursor-pointer border-none bg-transparent" />
                                        <span className="text-sm font-mono font-bold text-neutral-800 uppercase tracking-widest">{config.colors.primary}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-neutral-700 mb-3 ml-1">Accent Highlighting</label>
                                    <div className="flex items-center gap-4 bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                                        <input type="color" value={config.colors.accent} onChange={(e) => setValue("colors.accent", e.target.value, { shouldDirty: true })} className="h-10 w-16 rounded-lg pointer cursor-pointer border-none bg-transparent" />
                                        <span className="text-sm font-mono font-bold text-neutral-800 uppercase tracking-widest">{config.colors.accent}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-neutral-700 mb-3 ml-1">Typography Style</label>
                                    <select
                                        value={config.typography.headingFont}
                                        onChange={(e) => setValue("typography.headingFont", e.target.value, { shouldDirty: true })}
                                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-black outline-none transition-all"
                                    >
                                        {FONT_OPTIONS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-neutral-700 mb-3 ml-1">Layout Spacing</label>
                                    <div className="flex gap-2 bg-neutral-50 p-1.5 rounded-xl border border-neutral-100">
                                        {(["tight", "default", "spacious"] as const).map((s) => (
                                            <button
                                                key={s}
                                                type="button"
                                                onClick={() => setValue("spacing.sectionGap", s, { shouldDirty: true })}
                                                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all capitalize ${config.spacing.sectionGap === s ? "bg-white text-black shadow-sm" : "text-neutral-500 hover:text-neutral-800"}`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="space-y-4 pt-4 border-t border-neutral-100">
                        <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest ml-1">Advanced Controls</h3>
                        <Accordion title="Color Palette Detail" icon={Palette}>
                            <div className="grid grid-cols-2 gap-6 py-4">
                                {Object.entries(config.colors).map(([key, value]) => (
                                    <div key={key}>
                                        <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-wider mb-2 ml-1">{key}</label>
                                        <div className="flex items-center gap-3 bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
                                            <input type="color" value={value} onChange={(e) => setValue(`colors.${key}` as any, e.target.value, { shouldDirty: true })} className="h-8 w-12 rounded cursor-pointer border-none bg-transparent" />
                                            <span className="text-xs font-mono font-bold text-neutral-600 uppercase">{value}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Accordion>

                        <Accordion title="Corners & Radius" icon={Layout}>
                            <div className="space-y-6 py-4">
                                {Object.entries(config.corners).map(([key, value]) => (
                                    <div key={key}>
                                        <label className="block text-sm font-bold text-neutral-800 mb-3 capitalize">{key} Shapes</label>
                                        <CornerSelector value={value} onChange={(v) => setValue(`corners.${key}` as any, v, { shouldDirty: true })} options={key === "cards" || key === "inputs" || key === "images" || key === "selectors" ? ["sharp", "subtle", "rounded"] : ["sharp", "subtle", "rounded", "pill"]} />
                                    </div>
                                ))}
                            </div>
                        </Accordion>
                    </div>
                </div>

                <div className="lg:col-span-5 relative">
                    <div className="sticky top-6">
                        <h2 className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-4 ml-1">Live Storefront Preview</h2>
                        <div
                            className="border border-neutral-200 shadow-2xl rounded-[2.5rem] overflow-hidden bg-white p-3 ring-8 ring-neutral-100"
                            style={{ fontFamily: config.typography.bodyFont, backgroundColor: config.colors.background }}
                        >
                            <div className="rounded-[2rem] overflow-hidden border border-neutral-100 h-[700px] flex flex-col">
                                <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between" style={{ backgroundColor: config.colors.surface }}>
                                    <span className="font-black text-xl tracking-tighter" style={{ fontFamily: config.typography.headingFont, color: config.colors.text }}>LUMINA</span>
                                    <div className="flex items-center gap-4">
                                        <div className="w-5 h-5 rounded-full border border-neutral-200" style={{ color: config.colors.text }} />
                                        <div className="w-5 h-5 rounded-full border border-neutral-200" style={{ color: config.colors.text }} />
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto bg-white" style={{ backgroundColor: config.colors.background }}>
                                    <div className="px-6 py-12 text-center" style={{ gap: config.typography.paragraphGap === "compact" ? "0.75rem" : "1.5rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
                                        <div className="px-3 py-1 bg-neutral-100 text-[10px] font-black tracking-widest rounded-full uppercase mb-2 inline-block mx-auto" style={{ color: config.colors.accent }}>Seasonal Collection</div>
                                        <h3 className="text-4xl font-extrabold tracking-tight leading-none" style={{ fontFamily: config.typography.headingFont, color: config.colors.text, fontSize: config.typography.scale === "large" ? "3rem" : config.typography.scale === "compact" ? "2.25rem" : "2.75rem" }}>Ethereal Summer</h3>
                                        <p className="text-sm font-medium leading-relaxed max-w-xs mx-auto opacity-70" style={{ color: config.colors.text }}>Experience the intersection of traditional craft and modern silhouettes.</p>
                                        <div className="mt-4">
                                            <button
                                                type="button"
                                                className={`px-8 py-4 text-xs font-black uppercase tracking-widest transition-all ${config.buttons.primaryStyle === "glow" ? "shadow-[0_0_20px_rgba(0,0,0,0.1)]" : ""}`}
                                                style={{
                                                    backgroundColor: config.colors.primary,
                                                    color: "#fff",
                                                    borderRadius: config.corners.buttons === "sharp" ? "0px" : config.corners.buttons === "subtle" ? "0.75rem" : config.corners.buttons === "rounded" ? "1.5rem" : "9999px",
                                                    boxShadow: config.buttons.shadow === "none" ? "none" : config.buttons.shadow === "subtle" ? "0 4px 12px rgba(0,0,0,0.1)" : "0 10px 25px rgba(0,0,0,0.15)",
                                                }}
                                            >
                                                Explore Shop
                                            </button>
                                        </div>
                                    </div>

                                    <div className="px-6 py-8 grid grid-cols-2 gap-4">
                                        {[1, 2].map(i => (
                                            <div key={i} className="group cursor-pointer">
                                                <div className="aspect-[3/4] bg-neutral-50 mb-4 overflow-hidden"
                                                    style={{
                                                        borderRadius: config.corners.images === "sharp" ? "0px" : config.corners.images === "subtle" ? "1rem" : "1.5rem"
                                                    }}>
                                                    <div className="w-full h-full bg-neutral-200 group-hover:scale-110 transition-transform duration-500" />
                                                </div>
                                                <div className="text-[10px] font-black tracking-widest mb-1 opacity-50 uppercase" style={{ color: config.colors.text }}>New Drop</div>
                                                <div className="text-xs font-bold" style={{ color: config.colors.text }}>Aura Pendant {i}</div>
                                                <div className="text-[10px] font-bold mt-1" style={{ color: config.colors.accent }}>₹3,499</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
