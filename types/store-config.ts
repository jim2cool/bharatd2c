import { CommerceArchitecture, CategoryType, StylePreset, SellerModifier } from "./architecture";

export interface StoreConfig {
    // Core Identifiers
    store_id: string;
    store_name: string;
    slug: string | null;
    custom_domain: string | null;
    subscription_plan: string;

    // Status & Integration
    gateway_status: string;
    whatsapp_status: string;
    cod_enabled: boolean;
    rto_automation_enabled: boolean;

    // Intelligence Architecture
    commerce_architecture: CommerceArchitecture;
    config_mode: 'intelligence' | 'legacy' | 'profile_only'; // B1 fix: profile_only added

    // Design Tokens (Intelligence Layer)
    style_preset: string | null;
    mood_card: string | null;
    mood_card_selected: string | null; // Added for Phase 10 consistency
    heading_font: string | null;
    body_font: string | null;
    accent_font: string | null;
    primary_colour: string | null;
    secondary_colour: string | null;
    background_colour: string | null;
    surface_colour: string | null;
    cta_colour: string | null;
    cta_text_colour: string | null;
    cta_style: string | null;
    border_radius_button: string | null;
    border_radius_card: string | null;
    border_radius_image: string | null;
    shadow_intensity: string | null;
    shadow_style: string | null;
    motion_profile: string | null;
    motion_enter_duration: string | null;
    motion_easing: string | null;
    motion_scale_tap: string | null;
    density_multiplier: string | null;
    spacing_scale: string | null;
    image_ratio_pdp: string | null;
    image_style: string | null;
    content_tone: string | null;
    urgency_visual_style: string | null;
    trust_badge_style: string | null;
    dark_mode_available: boolean;
    section_gap: string | null;
    component_gap: string | null;
    component_gap_light: string | null;

    // PDP Intelligence
    urgency_level: SellerModifier['urgencyLevel'];
    trust_density: SellerModifier['trustDensity'];
    cta_prominence: SellerModifier['ctaProminence'];
    density_scale: SellerModifier['densityScale'];
    cod_bias: boolean;
    primary_category: CategoryType | string;

    pdp_component_sequence: string[];
    above_fold_components: string[];
    active_components_all: string[];
    suppressed_components: string[];
    resolved_active_components: string[]; // C5 fix: final computed list after overrides + intelligence
    component_weights: Record<string, number>;
    category_mandatory_components: string[];

    // Behavioral Layer
    urgency_mechanic: string | null;
    cta_behaviour: string | null;
    cod_badge_placement: string | null;
    above_fold_lead: string | null;
    first_impression_arch: string | null;
    social_proof_placement: string | null;
    trust_signal_placement: string | null;
    active_pages: string[];

    // Seller Context
    archetype_name: string | null;
    archetype_cluster: string | null;
    primary_hesitation: string | null;
    customer_hesitations: string[];
    buyer_identity: string[];
    maturity_score: string | null;
    persuasion_sequence_id: string | null;
    traffic_sources: string[];

    // Business Rules
    cod_disabled_above: number | null;
    prepaid_enabled: boolean;
    prepaid_discount_type: 'percentage' | 'flat' | null;
    prepaid_discount_value: number | null;

    // System Meta
    guardrails_passed: boolean;
    needs_recompute: boolean;
    computed_at: string;
    has_search: boolean; // G6: from ob_ux_rules via view

    // G5: Extended Design Tokens (second JOIN to ob_design_tokens in vw_store_config_resolved)
    bg_hero: string | null;
    bg_secondary: string | null;
    text_on_dark: string | null;
    border_colour: string | null;
    border_dark: string | null;
    accent_gold: string | null;
    border_radius_badge: string | null;
    shadow_hover: string | null;
    shadow_cta: string | null;
    star_colour: string | null;
    urgency_bg: string | null;
    urgency_text: string | null;
    callout_bg: string | null;
    callout_border: string | null;
    badge_bg: string | null;
    badge_text: string | null;
    hero_radius: string | null;
    motion_duration: string | null;
    text_primary_colour: string | null;
    text_secondary_colour: string | null;
    shimmer_base: string | null;
    shimmer_highlight: string | null;

    // Legacy Fallback (Actual theme_config blob)
    legacy_theme_config: any;
}
