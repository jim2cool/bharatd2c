"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { getActiveStoreIdClient } from "@/lib/getActiveStore.client";
import { useRouter } from "next/navigation";
import { ChevronDown, Check, Palette, Type, Layout, Sparkles } from "lucide-react";

// ═══════════════════════════════════════════════════════════════════════════
// TYPES - Match ThemeProvider schema
// ═══════════════════════════════════════════════════════════════════════════
type ThemeConfig = {
    presetId?: string;
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        surface: string;
        text: string;
    };
    corners: {
        buttons: "sharp" | "subtle" | "rounded" | "pill";
        cards: "sharp" | "subtle" | "rounded";
        inputs: "sharp" | "subtle" | "rounded";
        images: "sharp" | "subtle" | "rounded" | "circle";
        badges: "sharp" | "subtle" | "pill";
        selectors: "sharp" | "subtle" | "rounded";
    };
    buttons: {
        primaryStyle: "solid" | "gradient" | "glow";
        secondaryStyle: "outline" | "ghost" | "subtle";
        shadow: "none" | "subtle" | "elevated";
    };
    spacing: {
        sectionGap: "tight" | "default" | "spacious";
        cardGap: "tight" | "default" | "relaxed";
    };
    typography: {
        headingFont: string;
        bodyFont: string;
        scale: "compact" | "default" | "large";
        lineHeight: "tight" | "default" | "spacious";
        paragraphGap: "compact" | "default" | "loose";
    };
};

// ═══════════════════════════════════════════════════════════════════════════
// PRESETS - Curated styles that set coherent defaults
// ═══════════════════════════════════════════════════════════════════════════
const PRESETS = [
    {
        id: "modern",
        name: "Modern Minimalist",
        description: "Clean lines, subtle corners",
        colors: { primary: "#111111", secondary: "#333333", accent: "#e26a00", background: "#ffffff", surface: "#f9f9f9", text: "#111111" },
        corners: { buttons: "subtle" as const, cards: "subtle" as const, inputs: "subtle" as const, images: "subtle" as const, badges: "pill" as const, selectors: "subtle" as const },
        buttons: { primaryStyle: "solid" as const, secondaryStyle: "outline" as const, shadow: "subtle" as const },
        spacing: { sectionGap: "default" as const, cardGap: "default" as const },
        typography: { headingFont: "Inter", bodyFont: "Inter", scale: "default" as const, lineHeight: "default" as const, paragraphGap: "default" as const },
    },
    {
        id: "nature",
        name: "Nature & Organic",
        description: "Earthy tones, soft corners",
        colors: { primary: "#2f4f4f", secondary: "#5f7f7f", accent: "#8fbc8f", background: "#fdfbf7", surface: "#f5f2eb", text: "#2f3f2f" },
        corners: { buttons: "rounded" as const, cards: "rounded" as const, inputs: "rounded" as const, images: "rounded" as const, badges: "pill" as const, selectors: "rounded" as const },
        buttons: { primaryStyle: "solid" as const, secondaryStyle: "outline" as const, shadow: "none" as const },
        spacing: { sectionGap: "spacious" as const, cardGap: "relaxed" as const },
        typography: { headingFont: "Outfit", bodyFont: "DM Sans", scale: "default" as const, lineHeight: "spacious" as const, paragraphGap: "loose" as const },
    },
    {
        id: "luxury",
        name: "Luxury Premium",
        description: "Sharp edges, gold accents",
        colors: { primary: "#0f172a", secondary: "#1e293b", accent: "#d4af37", background: "#fafafa", surface: "#ffffff", text: "#0f172a" },
        corners: { buttons: "sharp" as const, cards: "sharp" as const, inputs: "sharp" as const, images: "sharp" as const, badges: "subtle" as const, selectors: "sharp" as const },
        buttons: { primaryStyle: "solid" as const, secondaryStyle: "outline" as const, shadow: "elevated" as const },
        spacing: { sectionGap: "spacious" as const, cardGap: "default" as const },
        typography: { headingFont: "Playfair Display", bodyFont: "Inter", scale: "default" as const, lineHeight: "spacious" as const, paragraphGap: "default" as const },
    },
    {
        id: "friendly",
        name: "Soft & Friendly",
        description: "Pill buttons, rounded everything",
        colors: { primary: "#7c3aed", secondary: "#a78bfa", accent: "#f59e0b", background: "#ffffff", surface: "#faf5ff", text: "#1f2937" },
        corners: { buttons: "pill" as const, cards: "rounded" as const, inputs: "rounded" as const, images: "rounded" as const, badges: "pill" as const, selectors: "rounded" as const },
        buttons: { primaryStyle: "solid" as const, secondaryStyle: "ghost" as const, shadow: "subtle" as const },
        spacing: { sectionGap: "default" as const, cardGap: "relaxed" as const },
        typography: { headingFont: "Poppins", bodyFont: "Poppins", scale: "large" as const, lineHeight: "default" as const, paragraphGap: "default" as const },
    },
    {
        id: "editorial",
        name: "Bold Editorial",
        description: "Sharp cards, pill CTAs",
        colors: { primary: "#dc2626", secondary: "#1f2937", accent: "#f59e0b", background: "#ffffff", surface: "#f3f4f6", text: "#111827" },
        corners: { buttons: "pill" as const, cards: "sharp" as const, inputs: "subtle" as const, images: "sharp" as const, badges: "pill" as const, selectors: "subtle" as const },
        buttons: { primaryStyle: "solid" as const, secondaryStyle: "outline" as const, shadow: "elevated" as const },
        spacing: { sectionGap: "tight" as const, cardGap: "tight" as const },
        typography: { headingFont: "Space Grotesk", bodyFont: "Inter", scale: "default" as const, lineHeight: "tight" as const, paragraphGap: "compact" as const },
    },
    {
        id: "tech",
        name: "Tech Blue",
        description: "Professional SaaS look",
        colors: { primary: "#2563eb", secondary: "#3b82f6", accent: "#06b6d4", background: "#f8fafc", surface: "#ffffff", text: "#0f172a" },
        corners: { buttons: "subtle" as const, cards: "subtle" as const, inputs: "subtle" as const, images: "subtle" as const, badges: "pill" as const, selectors: "subtle" as const },
        buttons: { primaryStyle: "solid" as const, secondaryStyle: "outline" as const, shadow: "subtle" as const },
        spacing: { sectionGap: "default" as const, cardGap: "default" as const },
        typography: { headingFont: "Inter", bodyFont: "Inter", scale: "default" as const, lineHeight: "default" as const, paragraphGap: "default" as const },
    },
];

const DEFAULT_CONFIG: ThemeConfig = {
    presetId: "modern",
    ...PRESETS[0],
};

// Font options
const FONT_OPTIONS = [
    { value: "Inter", label: "Inter (Modern)" },
    { value: "Poppins", label: "Poppins (Friendly)" },
    { value: "Playfair Display", label: "Playfair (Elegant)" },
    { value: "Space Grotesk", label: "Space Grotesk (Tech)" },
    { value: "DM Sans", label: "DM Sans (Clean)" },
    { value: "Outfit", label: "Outfit (Contemporary)" },
];

// ═══════════════════════════════════════════════════════════════════════════
// ACCORDION COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
function Accordion({
    title,
    icon: Icon,
    children,
    defaultOpen = false,
}: {
    title: string;
    icon: React.ElementType;
    children: React.ReactNode;
    defaultOpen?: boolean;
}) {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-gray-500" />
                    <span className="font-medium text-gray-900">{title}</span>
                </div>
                <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
                />
            </button>
            {open && <div className="p-4 pt-0 border-t border-gray-100">{children}</div>}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// CORNER SELECTOR COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
function CornerSelector({
    value,
    onChange,
    options = ["sharp", "subtle", "rounded", "pill"],
}: {
    value: string;
    onChange: (val: string) => void;
    options?: string[];
}) {
    const labels: Record<string, string> = {
        sharp: "Sharp",
        subtle: "Subtle",
        rounded: "Rounded",
        pill: "Pill",
        circle: "Circle",
    };

    const radii: Record<string, string> = {
        sharp: "0px",
        subtle: "0.375rem",
        rounded: "0.75rem",
        pill: "9999px",
        circle: "50%",
    };

    return (
        <div className="flex gap-2 flex-wrap">
            {options.map((opt) => (
                <button
                    key={opt}
                    onClick={() => onChange(opt)}
                    className={`px-3 py-1.5 text-sm border font-medium transition-all ${value === opt
                        ? "bg-black text-white border-black"
                        : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                        }`}
                    style={{ borderRadius: radii[opt] }}
                >
                    {labels[opt]}
                </button>
            ))}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
export default function AppearancePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [storeId, setStoreId] = useState<string | null>(null);
    const [config, setConfig] = useState<ThemeConfig>(DEFAULT_CONFIG);

    // Load initial data
    useEffect(() => {
        const fetchStore = async () => {
            const id = getActiveStoreIdClient();
            if (!id) return;
            setStoreId(id);

            const { data } = await supabaseBrowser
                .from("stores")
                .select("theme_config")
                .eq("id", id)
                .single();

            if (data?.theme_config && Object.keys(data.theme_config).length > 0) {
                // Deep merge with defaults
                setConfig({ ...DEFAULT_CONFIG, ...data.theme_config });
            }
            setLoading(false);
        };

        fetchStore();
    }, []);

    const handleSave = async () => {
        if (!storeId) return;
        setSaving(true);

        const { error } = await supabaseBrowser
            .from("stores")
            .update({ theme_config: config })
            .eq("id", storeId);

        setSaving(false);
        if (error) {
            alert("Failed to save theme settings");
        } else {
            router.refresh();
        }
    };

    const applyPreset = (presetId: string) => {
        const preset = PRESETS.find((p) => p.id === presetId);
        if (preset) {
            setConfig((prev) => ({
                ...prev,
                presetId,
                colors: preset.colors,
                corners: preset.corners,
                buttons: preset.buttons,
                spacing: preset.spacing,
                typography: preset.typography,
            }));
        }
    };

    const updateColors = (key: keyof ThemeConfig["colors"], value: string) => {
        setConfig((prev) => ({
            ...prev,
            colors: { ...prev.colors, [key]: value },
            presetId: undefined,
        }));
    };

    const updateCorners = (key: keyof ThemeConfig["corners"], value: string) => {
        setConfig((prev) => ({
            ...prev,
            corners: { ...prev.corners, [key]: value },
            presetId: undefined,
        }));
    };

    const updateButtons = (key: keyof ThemeConfig["buttons"], value: string) => {
        setConfig((prev) => ({
            ...prev,
            buttons: { ...prev.buttons, [key]: value },
            presetId: undefined,
        }));
    };

    const updateSpacing = (key: keyof ThemeConfig["spacing"], value: string) => {
        setConfig((prev) => ({
            ...prev,
            spacing: { ...prev.spacing, [key]: value },
            presetId: undefined,
        }));
    };

    const updateTypography = (key: keyof ThemeConfig["typography"], value: string) => {
        setConfig((prev) => ({
            ...prev,
            typography: { ...prev.typography, [key]: value },
        }));
    };

    if (loading) return <div className="p-8">Loading settings...</div>;

    return (
        <div className="max-w-5xl mx-auto py-8 px-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Appearance</h1>
                    <p className="text-gray-500 mt-1">
                        Customize your store's look and feel to match your brand.
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2.5 bg-black text-white font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
                >
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* ═══════════════════════════════════════════════════════════════
                    LEFT COLUMN: Controls
                    ═══════════════════════════════════════════════════════════════ */}
                <div className="lg:col-span-2 space-y-6">

                    {/* ─────────────────────────────────────────────────────────────
                        SECTION 1: Presets (Quick Start)
                        ───────────────────────────────────────────────────────────── */}
                    <section className="bg-white p-6 rounded-xl border border-gray-200">
                        <h2 className="text-lg font-semibold mb-1">Start with a Style</h2>
                        <p className="text-sm text-gray-500 mb-4">Choose a preset to get started quickly</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {PRESETS.map((preset) => (
                                <button
                                    key={preset.id}
                                    onClick={() => applyPreset(preset.id)}
                                    className={`relative flex flex-col items-start gap-2 p-4 rounded-lg border-2 text-left transition-all ${config.presetId === preset.id
                                        ? "border-black bg-gray-50"
                                        : "border-gray-100 hover:bg-gray-50 hover:border-gray-200"
                                        }`}
                                >
                                    {config.presetId === preset.id && (
                                        <Check className="absolute top-2 right-2 w-4 h-4" />
                                    )}
                                    <div className="flex gap-1">
                                        <div
                                            className="w-5 h-5 rounded-full border border-black/10 shadow-sm"
                                            style={{ backgroundColor: preset.colors.primary }}
                                        />
                                        <div
                                            className="w-5 h-5 rounded-full border border-black/10 shadow-sm -ml-1.5"
                                            style={{ backgroundColor: preset.colors.accent }}
                                        />
                                        <div
                                            className="w-5 h-5 rounded-full border border-black/10 shadow-sm -ml-1.5"
                                            style={{ backgroundColor: preset.colors.background }}
                                        />
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium block">{preset.name}</span>
                                        <span className="text-xs text-gray-500">{preset.description}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* ─────────────────────────────────────────────────────────────
                        SECTION 2: Essential Settings (6 settings for beginners)
                        ───────────────────────────────────────────────────────────── */}
                    <section className="bg-white p-6 rounded-xl border border-gray-200">
                        <h2 className="text-lg font-semibold mb-1">Essential Settings</h2>
                        <p className="text-sm text-gray-500 mb-6">The most important customizations</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* 1. Primary Color */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Primary Brand Color
                                </label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={config.colors.primary}
                                        onChange={(e) => updateColors("primary", e.target.value)}
                                        className="h-10 w-16 rounded border border-gray-300 cursor-pointer"
                                    />
                                    <span className="text-sm text-gray-500 uppercase font-mono">
                                        {config.colors.primary}
                                    </span>
                                </div>
                            </div>

                            {/* 2. Accent Color */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Accent Color
                                </label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={config.colors.accent}
                                        onChange={(e) => updateColors("accent", e.target.value)}
                                        className="h-10 w-16 rounded border border-gray-300 cursor-pointer"
                                    />
                                    <span className="text-sm text-gray-500 uppercase font-mono">
                                        {config.colors.accent}
                                    </span>
                                </div>
                            </div>

                            {/* 3. Button Corners */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Button Style
                                </label>
                                <CornerSelector
                                    value={config.corners.buttons}
                                    onChange={(v) => updateCorners("buttons", v)}
                                    options={["sharp", "subtle", "rounded", "pill"]}
                                />
                            </div>

                            {/* 4. Card Corners */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Card Style
                                </label>
                                <CornerSelector
                                    value={config.corners.cards}
                                    onChange={(v) => updateCorners("cards", v)}
                                    options={["sharp", "subtle", "rounded"]}
                                />
                            </div>

                            {/* 5. Heading Font */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Heading Font
                                </label>
                                <select
                                    value={config.typography.headingFont}
                                    onChange={(e) => updateTypography("headingFont", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                >
                                    {FONT_OPTIONS.map((f) => (
                                        <option key={f.value} value={f.value}>{f.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* 6. Section Spacing */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Section Spacing
                                </label>
                                <div className="flex gap-2">
                                    {(["tight", "default", "spacious"] as const).map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => updateSpacing("sectionGap", s)}
                                            className={`px-4 py-2 text-sm border font-medium rounded-lg transition-all capitalize ${config.spacing.sectionGap === s
                                                ? "bg-black text-white border-black"
                                                : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                                                }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ─────────────────────────────────────────────────────────────
                        SECTION 3: Advanced Settings (Accordions for power users)
                        ───────────────────────────────────────────────────────────── */}
                    <div className="space-y-3">
                        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                            Advanced Customization
                        </h2>

                        {/* Colors Accordion */}
                        <Accordion title="All Colors" icon={Palette}>
                            <div className="grid grid-cols-2 gap-4 pt-4">
                                {Object.entries(config.colors).map(([key, value]) => (
                                    <div key={key}>
                                        <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                                            {key.replace(/([A-Z])/g, " $1")}
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="color"
                                                value={value}
                                                onChange={(e) => updateColors(key as keyof ThemeConfig["colors"], e.target.value)}
                                                className="h-9 w-14 rounded border border-gray-300 cursor-pointer"
                                            />
                                            <span className="text-xs text-gray-500 uppercase font-mono">{value}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Accordion>

                        {/* Component Corners Accordion */}
                        <Accordion title="Component Corners" icon={Layout}>
                            <div className="space-y-4 pt-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Buttons</label>
                                    <CornerSelector value={config.corners.buttons} onChange={(v) => updateCorners("buttons", v)} options={["sharp", "subtle", "rounded", "pill"]} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Cards</label>
                                    <CornerSelector value={config.corners.cards} onChange={(v) => updateCorners("cards", v)} options={["sharp", "subtle", "rounded"]} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Form Inputs</label>
                                    <CornerSelector value={config.corners.inputs} onChange={(v) => updateCorners("inputs", v)} options={["sharp", "subtle", "rounded"]} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
                                    <CornerSelector value={config.corners.images} onChange={(v) => updateCorners("images", v)} options={["sharp", "subtle", "rounded"]} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Badges & Labels</label>
                                    <CornerSelector value={config.corners.badges} onChange={(v) => updateCorners("badges", v)} options={["sharp", "subtle", "pill"]} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantity/Variant Selectors</label>
                                    <CornerSelector value={config.corners.selectors} onChange={(v) => updateCorners("selectors", v)} options={["sharp", "subtle", "rounded"]} />
                                </div>
                            </div>
                        </Accordion>

                        {/* Button Styling Accordion */}
                        <Accordion title="Button Effects" icon={Sparkles}>
                            <div className="space-y-4 pt-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Primary Button Style</label>
                                    <div className="flex gap-2">
                                        {(["solid", "gradient", "glow"] as const).map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => updateButtons("primaryStyle", s)}
                                                className={`px-4 py-2 text-sm border font-medium rounded-lg transition-all capitalize ${config.buttons.primaryStyle === s
                                                    ? "bg-black text-white border-black"
                                                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                                                    }`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Button Style</label>
                                    <div className="flex gap-2">
                                        {(["outline", "ghost", "subtle"] as const).map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => updateButtons("secondaryStyle", s)}
                                                className={`px-4 py-2 text-sm border font-medium rounded-lg transition-all capitalize ${config.buttons.secondaryStyle === s
                                                    ? "bg-black text-white border-black"
                                                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                                                    }`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Button Shadow</label>
                                    <div className="flex gap-2">
                                        {(["none", "subtle", "elevated"] as const).map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => updateButtons("shadow", s)}
                                                className={`px-4 py-2 text-sm border font-medium rounded-lg transition-all capitalize ${config.buttons.shadow === s
                                                    ? "bg-black text-white border-black"
                                                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                                                    }`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Accordion>

                        {/* Typography Accordion */}
                        <Accordion title="Typography" icon={Type}>
                            <div className="space-y-4 pt-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Heading Font</label>
                                    <select
                                        value={config.typography.headingFont}
                                        onChange={(e) => updateTypography("headingFont", e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    >
                                        {FONT_OPTIONS.map((f) => (
                                            <option key={f.value} value={f.value}>{f.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Body Font</label>
                                    <select
                                        value={config.typography.bodyFont}
                                        onChange={(e) => updateTypography("bodyFont", e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    >
                                        {FONT_OPTIONS.map((f) => (
                                            <option key={f.value} value={f.value}>{f.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Font Size Scale</label>
                                    <div className="flex gap-2">
                                        {(["compact", "default", "large"] as const).map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => updateTypography("scale", s)}
                                                className={`px-4 py-2 text-sm border font-medium rounded-lg transition-all capitalize ${config.typography.scale === s
                                                    ? "bg-black text-white border-black"
                                                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                                                    }`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Text Tightness</label>
                                    <div className="flex gap-2">
                                        {(["tight", "default", "spacious"] as const).map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => updateTypography("lineHeight", s)}
                                                className={`px-4 py-2 text-sm border font-medium rounded-lg transition-all capitalize ${config.typography.lineHeight === s
                                                    ? "bg-black text-white border-black"
                                                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                                                    }`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Paragraph Spacing</label>
                                    <div className="flex gap-2">
                                        {(["compact", "default", "loose"] as const).map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => updateTypography("paragraphGap", s)}
                                                className={`px-4 py-2 text-sm border font-medium rounded-lg transition-all capitalize ${config.typography.paragraphGap === s
                                                    ? "bg-black text-white border-black"
                                                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                                                    }`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Accordion>
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════════════════════
                    RIGHT COLUMN: Live Preview
                    ═══════════════════════════════════════════════════════════════ */}
                <div className="lg:col-span-1">
                    <div className="sticky top-6">
                        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                            Live Preview
                        </h2>

                        <div
                            className="border border-gray-200 shadow-xl rounded-2xl overflow-hidden"
                            style={{
                                fontFamily: config.typography.bodyFont,
                                backgroundColor: config.colors.background,
                                lineHeight: config.typography.lineHeight === "tight" ? "1.25" : config.typography.lineHeight === "spacious" ? "1.75" : "1.5",
                            }}
                        >
                            {/* Simulated Header */}
                            <div className="border-b px-4 py-3 flex items-center justify-between" style={{ backgroundColor: config.colors.surface }}>
                                <span className="font-bold text-lg" style={{ fontFamily: config.typography.headingFont, color: config.colors.text }}>Brand</span>
                                <div className="flex gap-3 text-xs font-medium" style={{ color: config.colors.text }}>
                                    <span>Shop</span>
                                    <span>About</span>
                                </div>
                            </div>

                            {/* Hero Area */}
                            <div className="px-4 py-8 text-center" style={{ gap: config.typography.paragraphGap === "compact" ? "0.5rem" : config.typography.paragraphGap === "loose" ? "1.5rem" : "1rem", display: "flex", flexDirection: "column" }}>
                                <h3 className="text-xl font-bold" style={{ fontFamily: config.typography.headingFont, color: config.colors.text }}>
                                    New Arrivals
                                </h3>
                                <p className="text-sm" style={{ color: config.colors.text, opacity: 0.6 }}>
                                    Experience premium quality with our latest curation. Designed for those who appreciate fine details.
                                </p>
                                <div>
                                    <button
                                        className="px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
                                        style={{
                                            backgroundColor: config.colors.primary,
                                            color: "#fff",
                                            borderRadius: config.corners.buttons === "sharp" ? "0px" : config.corners.buttons === "subtle" ? "0.375rem" : config.corners.buttons === "rounded" ? "0.75rem" : "9999px",
                                            boxShadow: config.buttons.shadow === "none" ? "none" : config.buttons.shadow === "subtle" ? "0 2px 8px rgba(0,0,0,0.1)" : "0 4px 14px rgba(0,0,0,0.15)",
                                        }}
                                    >
                                        Shop Now
                                    </button>
                                </div>
                            </div>

                            {/* Product Card */}
                            <div className="p-4 border-t" style={{ backgroundColor: config.colors.surface }}>
                                <div
                                    className="p-3 shadow-sm border border-gray-100"
                                    style={{
                                        backgroundColor: config.colors.background,
                                        borderRadius: config.corners.cards === "sharp" ? "0px" : config.corners.cards === "subtle" ? "0.5rem" : "1rem",
                                    }}
                                >
                                    <div
                                        className="h-24 bg-gray-100 mb-3"
                                        style={{
                                            borderRadius: config.corners.images === "sharp" ? "0px" : config.corners.images === "subtle" ? "0.375rem" : "0.75rem",
                                        }}
                                    />
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="text-sm font-medium" style={{ color: config.colors.text }}>Classic T-Shirt</div>
                                        <span
                                            className="text-xs font-medium px-2 py-0.5"
                                            style={{
                                                backgroundColor: config.colors.accent,
                                                color: "#fff",
                                                borderRadius: config.corners.badges === "sharp" ? "0px" : config.corners.badges === "subtle" ? "0.25rem" : "9999px",
                                            }}
                                        >
                                            Sale
                                        </span>
                                    </div>
                                    <div className="text-xs mb-3" style={{ color: config.colors.text, opacity: 0.6 }}>₹999</div>
                                    <button
                                        className="w-full py-2 text-xs font-medium border transition-colors"
                                        style={{
                                            borderColor: config.colors.primary,
                                            color: config.colors.primary,
                                            borderRadius: config.corners.buttons === "sharp" ? "0px" : config.corners.buttons === "subtle" ? "0.375rem" : config.corners.buttons === "rounded" ? "0.75rem" : "9999px",
                                        }}
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>

                            {/* Quantity Selector Preview */}
                            <div className="px-4 py-3 border-t" style={{ backgroundColor: config.colors.background }}>
                                <div className="text-xs font-medium mb-2" style={{ color: config.colors.text }}>Quantity</div>
                                <div className="flex gap-2">
                                    <button
                                        className="px-3 py-1.5 text-sm border-2 font-medium"
                                        style={{
                                            borderColor: config.colors.primary,
                                            backgroundColor: config.colors.primary,
                                            color: "#fff",
                                            borderRadius: config.corners.selectors === "sharp" ? "0px" : config.corners.selectors === "subtle" ? "0.375rem" : "0.75rem",
                                        }}
                                    >
                                        1
                                    </button>
                                    <button
                                        className="px-3 py-1.5 text-sm border font-medium"
                                        style={{
                                            borderColor: "#e5e5e5",
                                            color: config.colors.text,
                                            borderRadius: config.corners.selectors === "sharp" ? "0px" : config.corners.selectors === "subtle" ? "0.375rem" : "0.75rem",
                                        }}
                                    >
                                        2
                                    </button>
                                    <button
                                        className="px-3 py-1.5 text-sm border font-medium"
                                        style={{
                                            borderColor: "#e5e5e5",
                                            color: config.colors.text,
                                            borderRadius: config.corners.selectors === "sharp" ? "0px" : config.corners.selectors === "subtle" ? "0.375rem" : "0.75rem",
                                        }}
                                    >
                                        3
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
