**EASY D2C**

Engineering Specification

Document 3 of 3 Â· Version 1.0 Â· February 2026

> Last updated: 2026-03-02 — Onboarding transitioned to English-only, Icon-led flow.
| **Audience**                   | **Covers**                     |
|                                |                                |
| New team developers            | Database architecture Â· Bridge |
|                                | function                       |
| External agencies &            |                                |
| contractors                    | Override layer Â· RTO Engine Â·  |
|                                | Page system                    |
+--------------------------------+--------------------------------+

*Confidential --- Internal Engineering Documentation*

**1. Architecture Overview**

Easy D2C is India\'s first Conversion Architecture Engine --- a platform
that builds individualised D2C stores from a single multi-input
onboarding, with zero design or coding work from the seller. This
document is the complete technical reference for the platform\'s
intelligence layer, database structure, and rendering pipeline.

**1.1 The Six-Layer Stack**

Every store rendered on the platform is the output of six concentric
layers applied in sequence. Understanding this stack is the prerequisite
for working on any part of the codebase.

  --------------------------------------------------------------------------
  **Layer**   **Name**        **What it controls**
  ----------- --------------- ----------------------------------------------
  **1**       Commerce        Structural pattern of the store:
              Architecture    product_engine, story_first, or catalog_first

  **2**       Intelligence    78 archetypes Ã— 57 persuasion sequences Ã— 97
              Layer           activation rules â†’ component decisions

  **3**       Seller Modifier urgency_level, trust_density, cta_prominence,
                              density_scale, cod_bias per store

  **4**       Category        15 product categories, each with mandatory
              Modifier        components and compliance requirements

  **5**       Mood Card       18 design presets (renamed to English industry parlance),
                              each a complete design token set (50+ tokens)
                              injected as CSS variables.

  **6**       Seller Override Final layer --- seller-initiated
                              customisations that survive intelligence
                              recompute
  --------------------------------------------------------------------------

**1.2 Data Flow from Onboarding to Render**

The rendering pipeline is strictly unidirectional. Data flows downward;
the renderer never writes back.

+-----------------------------------------------------------------+
| Seller completes onboarding (15 questions, 7 inputs)            |
|                                                                 |
| â”‚                                                               |
|                                                                 |
| â–¼                                                               |
|                                                                 |
| ob_seller_profiles â† single source of truth per store           |
|                                                                 |
| â”‚                                                               |
|                                                                 |
| â–¼ (trigger: trg_invalidate_render_config sets                   |
| needs_recompute=true)                                           |
|                                                                 |
| compute_store_render_config(store_id) â† bridge function         |
|                                                                 |
| â”‚                                                               |
|                                                                 |
| â–¼ (reads: cr_activation_rules, cr_archetype_overrides,          |
|                                                                 |
| cr_category_requirements, ob_persuasion_sequences)              |
|                                                                 |
| re_store_render_config â† materialised render config             |
|                                                                 |
| â”‚                                                               |
|                                                                 |
| â–¼                                                               |
|                                                                 |
| vw_store_config â† joins render config + design tokens + seller  |
| overrides                                                       |
|                                                                 |
| â”‚                                                               |
|                                                                 |
| â–¼                                                               |
|                                                                 |
| vw_store_config_resolved â† final view renderer reads            |
|                                                                 |
| â”‚                                                               |
|                                                                 |
| â–¼                                                               |
|                                                                 |
| Next.js renderer â†’ store page                                   |
+-----------------------------------------------------------------+

+-----------------------------------------------------------------+
| **Page Initialization Flow**                                    |
|                                                                 |
| After onboarding completes, `initialise_store_pages()`          |
| is called. This generates the initial page schema, including    |
| calling `getDefaultHomepageSections()` to map the selected      |
| `homepage_template_key` into `pg_store_pages.homepage_sections`.|
+-----------------------------------------------------------------+

+-----------------------------------------------------------------+
| **Renderer Rule**                                               |
|                                                                 |
| The renderer reads ONLY from vw_store_config_resolved. It never |
| directly reads ob_seller_profiles, re_store_render_config, or   |
| any cr\_\* table. This is a hard architectural constraint.      |
+-----------------------------------------------------------------+

**1.3 Database Prefix Convention**

All tables are namespaced by prefix, which maps directly to their
functional domain.

  ---------------------------------------------------------------------------
  **Prefix**   **Domain**     **Tables**
  ------------ -------------- -----------------------------------------------
  **ob\_**     Onboarding     ob_seller_profiles, ob_seller_archetypes,
                              ob_product_categories, ob_onboarding_questions,
                              ob_persuasion_sequences, ob_design_tokens,
                              ob_ux_rules, ob_first_impression_rules,
                              ob_market_context_rules,
                              ob_asset_reality_rules,
                              ob_content_seeds_schema, ob_content_schema

  **cr\_**     Component      cr_components, cr_component_pages,
               Registry       cr_activation_rules, cr_dimension_rules,
                              cr_archetype_overrides,
                              cr_category_requirements,
                              cr_component_overrides, cr_page_zones

  **re\_**     Render Config  re_store_render_config, re_seller_overrides

  **pg\_**     Page System    pg_store_pages, pg_homepage_block_types
  ---------------------------------------------------------------------------

**2. Database Architecture**

The database is PostgreSQL 17 hosted on Supabase (project: d2c-core,
region: ap-south-1). All production tables have Row Level Security (RLS)
enabled. This section documents every table in the intelligence and
rendering pipeline. Appendix A contains full CREATE TABLE SQL for each
table.

**2.1 Core Store Table**

**stores**

The root entity. Every other table references stores.id. Contains both
operational fields (COD settings, payment, shipping) and legacy
theme_config for backward compatibility.

  ----------------------------------------------------------------------------
  **Column**                   **Type**       **Notes**
  ---------------------------- -------------- --------------------------------
  **id**                       uuid (PK)      gen_random_uuid(), referenced by
                                              all other tables

  **slug**                     text (unique)  URL slug for store ---
                                              /stores/{slug}

  **custom_domain**            text (unique)  Verified custom domain

  **subscription_plan**        text           free \| pro \| enterprise.
                                              Default: free

  **cod_enabled**              boolean        Platform-level COD toggle.
                                              Default: true

  **cod_disabled_above**       integer        Block COD for orders above this
                                              amount (â‚¹)

  **prepaid_enabled**          boolean        Master switch for prepaid
                                              discount offers

  **prepaid_discount_type**    text           flat \| percentage

  **prepaid_discount_value**   numeric        Discount magnitude

  **prepaid_stacking_logic**   text           highest_only \| stack_all

  **gateway_status**           text           verified \| pending \|
                                              not_configured

  **whatsapp_status**          text           connected \| pending \|
                                              not_connected

  **rto_automation_enabled**   boolean        Activates RTO scoring trigger on
                                              orders. Default: true

  **theme_config**             jsonb          Legacy config blob. Preserved
                                              for backward compatibility ---
                                              vw_store_config reads
                                              COALESCE(intelligence,
                                              theme_config)

  **timezone**                 text           Store timezone. Default:
                                              Asia/Kolkata. Used by RTO
                                              night-order signal *(DB-verified 2026-02-28)*

  **country**                  text           ISO 2-letter country code. 
                                              Default: IN *(DB-verified 2026-02-28)*

  **owner_id**                 uuid (FK)      References profiles.id
  ----------------------------------------------------------------------------

**2.2 Onboarding Tables (ob\_)**

**ob_seller_profiles**

The most important table in the system. One row per store. This is the
complete structured output of the 7-input onboarding flow. Every
intelligence decision downstream is computed from this table. The bridge
function reads it; the rendering pipeline is entirely derived from it.

+-----------------------------------------------------------------+
| **Critical Field: primary_hesitation**                          |
|                                                                 |
| The single most strategically important field. Populated from   |
| Q6.3 (buyer hesitation). This field determines the entire PDP   |
| persuasion sequence. If this field is null, the system falls    |
| back to the expert sequence --- no personalisation occurs.      |
+-----------------------------------------------------------------+

  ------------------------------------------------------------------------------------------------------------
  **Column**                          **Type**       **Notes**
  ----------------------------------- -------------- ---------------------------------------------------------
  **store_id**                        uuid (PK/FK)   One-to-one with stores. ON DELETE CASCADE

  **archetype_id**                    bigint (FK)    References ob_seller_archetypes.id

  **archetype_name**                  text           Denormalised archetype name for fast joins

  **archetype_cluster**               text           Cluster of 78 archetypes: craft_maker, digital_native,
                                                     dropshipper, etc.

  **archetype_confidence_pct**        integer        Match confidence 0--100

  **primary_category**                text           Exact category name matching
                                                     cr_category_requirements.category

  **commerce_architecture**           text           product_engine \| story_first \| catalog_first

  **urgency_level**                   text           none \| low \| medium \| high --- drives urgency
                                                     component selection *(DB-verified 2026-02-26:
                                                     live values are `low`, `medium`, `high`; `none` is
                                                     valid type value but not yet written to live rows)*

  **trust_density**                   text           light \| medium \| heavy --- controls trust signal
                                                     volume *(DB-verified 2026-02-26: live values are
                                                     `heavy` and `medium`; spec previously said
                                                     `minimal|moderate|heavy` which was incorrect)*

  **cta_prominence**                  text           balanced \| dominant *(DB-verified 2026-02-26:
                                                     live values are `balanced` and `dominant`; spec
                                                     previously said `soft|standard|aggressive` which
                                                     was incorrect)*

  **density_scale**                   text           spacious \| balanced \| compact

  **cod_bias**                        boolean        True if seller expects majority COD orders

  **primary_hesitation**              text           Top buyer hesitation from Q6.3. Anchor of persuasion
                                                     system

  **customer_hesitations**            text\[\]       All hesitations selected by seller

  **buyer_identity**                  text\[\]       Who the buyer is --- gift_giver, problem_solver,
                                                     aspirational, etc.

  **traffic_sources**                 text\[\]       instagram \| facebook \| google \| whatsapp \| influencer
                                                     \| organic

  **first_impression_architecture**   text           Derived: evidence_first \| trust_first \| visual_first \|
                                                     value_first \| story_first

  **persuasion_sequence_id**          text           FK â†’ ob_persuasion_sequences.id. The CRO output.

  **maturity_score**                  numeric        Computed:
                                                     (Q3.1Ã—0.40)+(Q3.2Ã—0.35)+(Q3.3Ã—0.25)+archetype_modifier.
                                                     Range 1.0--5.0

  **mood_card_selected**              text           FK â†’ ob_design_tokens.mood_card_name

  **has_logo**                        boolean        Asset reality: logo available

  **has_product_photos**              boolean        Asset reality: product photography available

  **has_video**                       boolean        Asset reality: video content available

  **has_professional_photography**    boolean        Professional product photography (vs. phone photos)

  **has_reviews**                     boolean        Real reviews exist

  **review_count**                    integer        Number of existing reviews

  **has_certifications**              boolean        Product certifications exist (drives regulatory component
                                                     activation)

  **ux_page_list**                    text\[\]       Pages to create: derived from ob_ux_rules

  **homepage_template_key**           text           Selected homepage template shortcode

  **content_seeds**                   jsonb          Personalised dummy content generated at onboarding
                                                     (brand_name, hero_headline, brand_story_short, etc.)
                                                     including CATEGORY_HERO_IMAGES.

  **site_complexity_tier**            integer        UX complexity tier 1--5

  **onboarding_completed_at**         timestamptz    When onboarding was finalised --- null means incomplete

  **needs_recompute**                 boolean        Set true by trigger when profile changes
  ------------------------------------------------------------------------------------------------------------

**ob_seller_archetypes**

78 archetypes across 10 clusters. Each archetype has 12 scoring
dimensions. The archetype is the primary identity of the seller --- it
determines which of the 63 archetype override rules fire during
compute_store_render_config().

  -------------------------------------------------------------------------------
  **Column**                      **Type**       **Notes**
  ------------------------------- -------------- --------------------------------
  **id**                          bigint (PK)    Identity generated, always

  **archetype_name**              text (unique)  Canonical archetype name

  **cluster_number**              integer        1--10 cluster index

  **cluster_name**                text           craft_maker \| digital_native \|
                                                 dropshipper \| institutional \|
                                                 etc.

  **trust_deficit_at_entry**      text           Low \| Medium \| High \| Very
                                                 High

  **business_maturity_typical**   text           Typical maturity band for this
                                                 archetype

  **cod_dependency_likely**       boolean        Whether this archetype typically
                                                 relies on COD

  **storytelling_asset**          text           What story asset this archetype
                                                 typically possesses

  **is_v11_parked**               boolean        Parked for v1.1 rollout ---
                                                 excluded from current scoring
  -------------------------------------------------------------------------------

**ob_product_categories**

24 product categories (Updated 2026-02-27), each with 13 scoring dimensions. 

| Group | Categories |
| :--- | :--- |
| **Physical (Core)** | Fashion & Apparel, Beauty & Personal Care, Electronics & Gadgets, Home & Kitchen, Health & Fitness, Spiritual & Lifestyle, Furniture & Large Items, Food & Consumables. |
| **Physical (Expansion)**| Jewellery & Accessories, Art & Craft, Pet Products, Baby & Kids, Stationery & Office, Automotive, Sports/Fitness, Gardening. |
| **Operational/Bridge**| Dropshipping, Multi-Category Store, Marketplace Reseller, Industrial / B2B. |
| **Future/Digital** | **Digital Goods (E-books/Presets)**, **Experience Commerce (Tickets/Bookings)**, **Circular/Renewed (Pre-owned)**, **Consultation-Led (High-Ticket)**. |

**ob_persuasion_sequences**

57 rows --- every combination of primary_hesitation Ã— archetype_cluster
that produces a unique PDP component sequence. This is the CRO output
layer (Stage 3 of the causal chain). The bridge function reads this
table to populate re_store_render_config.pdp_component_sequence.

  ----------------------------------------------------------------------------------
  **Column**                  **Type**       **Notes**
  --------------------------- -------------- ---------------------------------------
  **id**                      text (PK)      Format: PS\_{hesitation}\_{cluster} or
                                             PS\_{n:03d}

  **primary_hesitation**      text           Matches
                                             ob_seller_profiles.primary_hesitation

  **archetype_cluster**       text           Matches
                                             ob_seller_profiles.archetype_cluster

  **pdp_sequence**            text\[\]       Ordered array of component role IDs.
                                             Position 1 = topmost on PDP

  **above_fold_components**   text\[\]       Strict subset of pdp_sequence that must
                                             render above fold

  **component_weights**       jsonb          {component_id: integer 1--10}. Higher =
                                             more visual prominence

  **urgency_mechanic**        text           timer \| stock_counter \| social_pulse
                                             \| none

  **above_fold_lead**         text           The dominant above-fold element type

  **narrative_arc**           text           human-readable description of the
                                             persuasion arc for this sequence

  **cta_behaviour**           text           sticky \| inline \| floating \| dual

  **cod_badge_placement**     text           above_fold \| near_cta \| trust_zone
  ----------------------------------------------------------------------------------

**ob_design_tokens**

18 rows (Renamed 2026-02-27) — one per mood card. 

| Professional Name | Internal Legacy Key / Indian Reference |
| :--- | :--- |
| **Minimal** | Saaf Suthra |
| **Bold** | Dhamaka |
| **Heritage** | Dil Se Desi |
| **Luxury** | Shaahi |
| **Organic** | Swasth aur Sachcha |
| **Fresh** | Taza aur Mast |
| **Professional** | Gyaan aur Bharosa |
| **Serene** | Rooh aur Riwaz |
| **Gourmet** | Rasoi aur Pyaar |
| **Sleek** | Tech aur Takneek |
| **Zen** | Aatman |
| **Vibrant** | Utsav |
| **Playful** | Bachpan |
| **Industrial** | Kala aur Karigari |
| **Urban** | Gully |
| **Earth** | Kisan |
| **Clinical** | Vigyan |
| **Quiet Luxury** | Adhunik Luxury |

  ---------------------------------------------------------------------------
  **Column**                  **Type**       **Notes**
  --------------------------- -------------- --------------------------------
  **mood_card_name**          text (PK)      Canonical key: dhamaka, gen_z,
                                             shaahi, saaf_suthra,
                                             dil_se_desi, etc.

  **heading_font**            text           Google Fonts family name for
                                             display/heading text

  **body_font**               text           Google Fonts family name for
                                             body text

  **primary_colour**          text           CSS hex --- primary brand colour

  **accent_colour**           text           CSS hex --- secondary accent

  **cta_colour**              text           CSS hex --- CTA button
                                             background

  **cta_text_colour**         text           CSS hex --- CTA button label
                                             colour

  **border_radius_button**    text           CSS value --- button corner
                                             radius

  **border_radius_card**      text           CSS value --- card corner radius

  **shadow_style**            text           none \| soft \| medium \|
                                             dramatic

  **motion_enter_duration**   text           CSS duration --- component
                                             entrance animation

  **motion_easing**           text           CSS easing --- entrance easing
                                             curve

  **motion_scale_tap**        text           CSS scale --- tap feedback scale
                                             transform

  **spacing_scale**           text           compact \| balanced \| generous

  **image_ratio_pdp**         text           CSS ratio for product image on
                                             PDP: 1/1, 4/5, 9/16

  **opacity_hover**           numeric        Opacity on hover: 0 to 1

  **scale_hover**             numeric        Scale on hover: 1.0 to 1.1

  **shadow_active**           text           CSS shadow on active/click

  **border_focus**            text           CSS border on focus/active

  **icon_set**                text           Icon family name bridged to Mood
                                             Card

  **icon_weight**             text           Icon stroke weight (e.g., 400)

  **icon_style**              text           Icon style: outline | solid |
                                             duotone
  **--border-width-input**      border_width_input      Form input border thickness
  **--border-width-card**       border_width_card       Card/Container border thickness
  **--focus-ring-colour**       focus_ring_colour       Accessibility ring colour
  **--focus-ring-style**        focus_ring_style        Solid | dashed | dotted
                                             PDP: 1/1, 4/5, 9/16

  **urgency_visual_style**    text           subtle \| moderate \| aggressive

  **trust_badge_style**       text           minimal \| standard \| prominent

  **shimmer_base**            text           CSS colour for loading skeleton
                                             base

  **shimmer_highlight**       text           CSS colour for loading skeleton
                                             sweep animation

  **opacity_hover**           numeric        Opacity on hover: 0 to 1

  **scale_hover**             numeric        Scale on hover: 1.0 to 1.1

  **shadow_active**           text           CSS shadow on active/click

  **border_focus**            text           CSS border on focus/active

  **icon_set**                text           Icon family name bridged to Mood 
                                             Card

  **icon_weight**             text           Icon stroke weight (e.g., 400)

  **icon_style**              text           Icon style: outline | solid | 
                                             duotone

  **border_width_input**      text           Border width for form inputs

  **border_width_card**       text           Border width for layout cards

  **focus_ring_colour**       text           CSS colour for accessibility focus 
                                             rings

  **focus_ring_style**        text           Focus ring style: solid | dashed

  **archetype_best_fit**      text\[\]       Which archetypes this mood card
                                             naturally suits

  **category_best_fit**       text\[\]       Which product categories this
                                             mood card is optimal for
  ---------------------------------------------------------------------------

**ob_ux_rules**

14 rows --- maturity score range Ã— commerce architecture â†’ UX blueprint.
Determines page list, navigation type, catalogue architecture, and
feature depth per store.

  ----------------------------------------------------------------------------
  **Column**                   **Type**       **Notes**
  ---------------------------- -------------- --------------------------------
  **id**                       text (PK)      Rule identifier, referenced by
                                              pg_store_pages.ux_rule_id

  **maturity_score_min**       numeric        Lower bound (inclusive) of
                                              maturity score range

  **maturity_score_max**       numeric        Upper bound (inclusive) of
                                              maturity score range

  **commerce_architecture**    text           product_engine \| story_first \|
                                              catalog_first

  **mandatory_pages**          text\[\]       Pages that must be created at
                                              store init

  **optional_pages**           text\[\]       Pages created as drafts ---
                                              seller activates

  **suppressed_pages**         text\[\]       Pages explicitly unavailable for
                                              this profile

  **navigation_type**          text           minimal \| standard \| full

  **navigation_items_max**     integer        Maximum nav items for this tier

  **has_search**               boolean        Search bar available

  **catalogue_architecture**   text           single_product \| focused \|
                                              full_catalogue

  **collection_support**       boolean        Collections feature enabled

  **filter_support**           boolean        Product filtering enabled

  **cro_suite**                text           basic \| standard \| advanced
  ----------------------------------------------------------------------------

**2.3 Component Registry Tables (cr\_)**

**cr_components**

The master registry of 110 UI components. Every renderable UI building
block --- from product titles to urgency timers --- exists as a row
here. The governance_level field is the most operationally important:
LOCKED components cannot be overridden by any mechanism.

  ----------------------------------------------------------------------
  **Column**             **Type**       **Notes**
  ---------------------- -------------- --------------------------------
  **component_id**       text (PK)      Format: COMP\_{page}\_{NNN}.
                                        E.g. COMP_PDP_001, COMP_HOME_002

  **component_name**     text           Human-readable name

  **component_group**    text           Functional group: trust \|
                                        urgency \| social_proof \|
                                        navigation \| etc.

  **primary_page**       text           pdp \| home \| collection \|
                                        cart \| global

  **zone**               text           Zone within page --- references
                                        cr_page_zones.id

  **governance_level**   text           LOCKED \| FLEXIBLE \| OPTIONAL.
                                        LOCKED = immutable at render
                                        time

  **science_locked**     boolean        If true, treated as LOCKED
                                        regardless of governance_level

  **default_state**      text           ACTIVE \| INACTIVE. Starting
                                        state before rules fire

  **mobile_mandatory**   boolean        If true, system ADVISES_AGAINST
                                        suppression on mobile

  **notes**              text           Internal rationale notes
  ----------------------------------------------------------------------

**cr_activation_rules**

97 rules --- IF condition THEN activate/suppress component. Rules fire
in rule_id order during compute_store_render_config(). A condition is: a
field on ob_seller_profiles meets a value threshold. Rules are
category-agnostic --- they fire on seller identity signals.

  ---------------------------------------------------------------------------
  **Column**                  **Type**       **Notes**
  --------------------------- -------------- --------------------------------
  **rule_id**                 text (PK)      Canonical rule ID: AR\_{NNN}

  **component_id**            text (FK)      Which component this rule
                                             targets

  **activation_input_type**   text           Which ob_seller_profiles field
                                             to read: product_category,
                                             seller_archetype.cluster,
                                             customer_hesitation,
                                             commerce_architecture,
                                             business_maturity,
                                             seller_modifier.codBias,
                                             review_count, asset_reality.\*

  **activation_operator**     text           EQ \| IN \| GT \| LT \| CONTAINS

  **activation_value**        text           Threshold value (string).
                                             Comma-separated for IN operator

  **activation_logic**        text           AND \| OR --- how multiple
                                             conditions combine

  **result_action**           text           ACTIVATE \| REQUIRE \| SUPPRESS

  **result_weight**           text           Optional integer weight
                                             adjustment applied to
                                             component_weights

  **notes**                   text           Rationale for this rule
  ---------------------------------------------------------------------------

**cr_archetype_overrides**

63 rows --- archetype or cluster-specific component behaviour overrides.
These fire after activation rules in the bridge function, keyed by
archetype_name or archetype_cluster. This is what makes a Dropshipper
store look fundamentally different from a Traditional Artisan store
selling in the same category.

  -----------------------------------------------------------------------------
  **Column**                 **Type**       **Notes**
  -------------------------- -------------- -----------------------------------
  **override_id**            text (PK)      Format: AO\_{NNN}

  **archetype_or_cluster**   text           Exact match against
                                            ob_seller_profiles.archetype_name
                                            OR archetype_cluster

  **component_id**           text (FK)      Target component

  **dimension_affected**     text           Which dimension this override
                                            changes: activation \| weight \|
                                            visibility \| copy_tone

  **override_action**        text           ACTIVATE \| SUPPRESS \| WEIGHT_UP
                                            \| WEIGHT_DOWN \| REQUIRE

  **override_value**         text           Value applied. For WEIGHT_UP/DOWN:
                                            +2 or -2 from current weight

  **rationale**              text           Why this archetype needs this
                                            deviation from the default
  -----------------------------------------------------------------------------

**cr_category_requirements**

71 rows --- mandatory or recommended components per product category.
These fire last in the bridge function (after activation rules and
archetype overrides). MANDATORY requirements can override suppression
from prior steps --- they guarantee category compliance.

  ----------------------------------------------------------------------------
  **Column**              **Type**       **Notes**
  ----------------------- -------------- -------------------------------------
  **id**                  bigint (PK)    Identity generated

  **category**            text           Exact match against
                                         ob_seller_profiles.primary_category

  **component_id**        text (FK)      Component that this category requires

  **requirement_level**   text           MANDATORY \| RECOMMENDED \| OPTIONAL

  **position_in_zone**    text           Suggested positioning within zone

  **compliance_driver**   text           Why this is required: legal \| trust
                                         \| conversion \| category_norm

  **notes**               text           Category-specific context for this
                                         requirement
  ----------------------------------------------------------------------------

**2.4 Render Config Tables (re\_)**

**re_store_render_config**

One row per store. The materialised output of
compute_store_render_config(). The renderer reads this table (via the
view) --- never re-runs rules at render time. Invalidated
(needs_recompute=true) by trigger when ob_seller_profiles changes.

  -----------------------------------------------------------------------------------
  **Column**                          **Type**       **Notes**
  ----------------------------------- -------------- --------------------------------
  **store_id**                        uuid (PK/FK)   One-to-one with stores

  **commerce_architecture**           text           product_engine \| story_first \|
                                                     catalog_first

  **urgency_level**                   text           Seller modifier: none \| low \|
                                                     medium \| high

  **trust_density**                   text           Seller modifier: light \|
                                                     medium \| heavy

  **cta_prominence**                  text           Seller modifier: balanced \|
                                                     dominant

  **density_scale**                   text           Seller modifier: spacious \|
                                                     balanced \| compact

  **cod_bias**                        boolean        COD-dominant store flag

  **design_token_preset**             text           Mood card key â†’ ob_design_tokens
                                                     lookup

  **mood_card_selected**              text           Same as design_token_preset ---
                                                     explicit field for clarity

  **pdp_component_sequence**          text\[\]       Ordered component IDs for PDP.
                                                     From persuasion sequence or
                                                     expert fallback

  **above_fold_components**           text\[\]       Components that must render
                                                     above fold. Guardrail-enforced

  **active_components_all**           text\[\]       All components active for this
                                                     store after all rules fire

  **suppressed_components**           text\[\]       Components suppressed --- not
                                                     rendered

  **component_weights**               jsonb          {component_id: weight_1_to_10}.
                                                     Drives visual prominence

  **urgency_mechanic**                text           timer \| stock_counter \|
                                                     social_pulse \| none

  **cta_behaviour**                   text           sticky \| inline \| floating \|
                                                     dual

  **cod_badge_placement**             text           above_fold \| near_cta \|
                                                     trust_zone

  **above_fold_lead**                 text           Primary above-fold element type

  **first_impression_arch**           text           evidence_first \| trust_first \|
                                                     visual_first \| value_first \|
                                                     story_first

  **social_proof_placement**          text           Placement zone for social proof
                                                     components

  **trust_signal_placement**          text           Placement zone for trust signal
                                                     components

  **active_pages**                    text\[\]       Pages built for this store ---
                                                     from ob_ux_rules

  **category_mandatory_components**   text\[\]       Components added via category
                                                     requirements (for audit)

  **guardrails_passed**               boolean        True if all structural
                                                     guardrails satisfied
                                                     post-computation

  **guardrail_violations**            text\[\]       List of violations encountered
                                                     (non-blocking --- system
                                                     self-heals)

  **persuasion_sequence_id**          text           Reference to
                                                     ob_persuasion_sequences row used

  **computed_at**                     timestamptz    When
                                                     compute_store_render_config()
                                                     last ran

  **needs_recompute**                 boolean        True if profile changed since
                                                     last compute. Renderer should
                                                     warn if true

  **homepage_template_key**           text           Selected homepage template
                                                     shortcode

  **homepage_section_sequence**       text\[\]       Ordered homepage section IDs
  -----------------------------------------------------------------------------------

**re_seller_overrides**

Seller-initiated customisations to the intelligence layer. Sits on top
of re_store_render_config. The latest active override per (store_id,
component_id) wins. Overrides survive intelligence recompute --- they
are never auto-cleared when needs_recompute fires.

  ---------------------------------------------------------------------------
  **Column**                  **Type**       **Notes**
  --------------------------- -------------- --------------------------------
  **id**                      uuid (PK)      gen_random_uuid()

  **store_id**                uuid (FK)      References stores.id

  **component_id**            text           Which component is being
                                             overridden

  **override_type**           text           ACTIVATE \| SUPPRESS \| REORDER
                                             \| RESET

  **zone_position**           integer        For REORDER: desired position
                                             within zone

  **system_recommendation**   text           AGREES \| CAUTION \|
                                             ADVISES_AGAINST --- from
                                             fn_get_override_opinion()

  **system_reason**           text           Human-readable explanation of
                                             system recommendation

  **actioned_at**             timestamptz    When override was created

  **actioned_by**             uuid (FK)      User who made the change ---
                                             references profiles.id

  **is_active**               boolean        Only latest active override per
                                             (store_id, component_id) applies
  ---------------------------------------------------------------------------

+-----------------------------------------------------------------+
| **Override Lifecycle**                                          |
|                                                                 |
| BEFORE INSERT trigger trg_deactivate_prior_overrides            |
| deactivates all prior active overrides for the same (store_id,  |
| component_id) before the new one is inserted. This ensures only |
| one active override exists per component per store at any time. |
|                                                                 |
| RESET override_type deactivates all prior overrides, returning  |
| the component to intelligence-computed state.                   |
+-----------------------------------------------------------------+

**2.5 Page System Tables (pg\_)**

**pg_store_pages**

All pages for all stores. Created by initialise_store_pages() after
onboarding completes. The governance field controls who can modify a
page.

  ------------------------------------------------------------------------------
  **Column**                     **Type**       **Notes**
  ------------------------------ -------------- --------------------------------
  **id**                         uuid (PK)      gen_random_uuid()

  **store_id**                   uuid (FK)      Parent store

  **page_type**                  text           home \| pdp \| collection \|
                                                about \| contact \| faq \|
                                                brand_story \| journal \|
                                                refund_policy \| privacy_policy
                                                \| shipping_policy \| terms \|
                                                seller_created

  **slug**                       text           URL slug. home = empty string
                                                (\'\')

  **status**                     text           draft \| published \| suppressed

  **governance**                 text           intelligence \| system_locked \|
                                                seller_created

  **is_mandatory**               boolean        Cannot be suppressed by seller

  **intelligence_recommended**   boolean        Was this page recommended by
                                                ob_ux_rules?

  **show_in_nav**                boolean        Include in navigation. Policy
                                                pages are false (footer only)

  **nav_position**               integer        Sort order in navigation

  **ux_rule_id**                 text (FK)      Which ob_ux_rules row created
                                                this page

  **homepage_sections**          jsonb          For home page: array of section
                                                block configs

  **seo_title**                  text           SEO title override

  **seo_description**            text           SEO description override
  ------------------------------------------------------------------------------

**pg_homepage_block_types**

14 block types defining what kinds of sections can appear on the
homepage. The suitable_for array restricts availability by commerce
architecture.

  -------------------------------------------------------------------------
  **Column**                **Type**       **Notes**
  ------------------------- -------------- --------------------------------
  **block_type**            text (PK)      Unique block type key

  **display_name**          text           Human-readable name shown in
                                           homepage builder

  **suitable_for**          text\[\]       Which commerce_architecture
                                           values support this block

  **intelligence_weight**   integer        How much the intelligence system
                                           favours this block (1--10)

  **can_have_multiple**     boolean        Can this block appear more than
                                           once on a homepage?

  **default_data**          jsonb          Default content/configuration
                                           for this block type
  -------------------------------------------------------------------------

**3. Bridge Function: compute_store_render_config()**

This is the core of the intelligence layer.
compute_store_render_config(p_store_id uuid) reads the seller\'s
onboarding profile and writes a fully computed render config to
re_store_render_config. It is the only function that writes to the
render config table.

**3.1 Function Signature**

+-----------------------------------------------------------------+
| compute_store_render_config(p_store_id uuid) RETURNS void       |
|                                                                 |
| Language: PL/pgSQL                                              |
|                                                                 |
| Called by: Application layer after onboarding completes, or     |
| when needs_recompute = true                                     |
|                                                                 |
| Reads: ob_seller_profiles, cr_components, cr_activation_rules,  |
|                                                                 |
| cr_archetype_overrides, cr_category_requirements,               |
| ob_persuasion_sequences                                         |
|                                                                 |
| Writes: re_store_render_config (UPSERT on store_id)             |
+-----------------------------------------------------------------+

**3.2 Computation Sequence**

The function executes in five distinct phases. The order is critical ---
later phases can override earlier ones.

**Phase 1: Initialise from Default States**

Read the seller profile. Initialise active_components by collecting all
components with default_state = \'ACTIVE\' from cr_components. This is
the baseline before any rules fire.

+-----------------------------------------------------------------+
| \-- PHASE 1: Load profile + initialise active component set     |
|                                                                 |
| SELECT \* INTO prof FROM ob_seller_profiles WHERE store_id =    |
| p_store_id;                                                     |
|                                                                 |
| SELECT array_agg(component_id) INTO v_active_components         |
|                                                                 |
| FROM cr_components WHERE default_state = \'ACTIVE\';            |
+-----------------------------------------------------------------+

**Phase 2: Fire Activation Rules (97 rules)**

Loop through cr_activation_rules in rule_id order. For each rule,
evaluate whether the condition matches the seller profile. If it fires:
ACTIVATE/REQUIRE adds the component to active, removes from suppressed;
SUPPRESS removes from active, adds to suppressed (unless LOCKED).

The supported input types are:

  -------------------------------------------------------------------------------------------------
  **activation_input_type**               **Profile field read**         **Supported operators**
  --------------------------------------- ------------------------------ --------------------------
  **product_category**                    prof.primary_category          EQ \| IN (comma-separated)

  **seller_archetype.cluster**            prof.archetype_cluster         EQ \| IN

  **seller_archetype**                    prof.archetype_name            EQ

  **customer_hesitation**                 prof.primary_hesitation OR     EQ \| CONTAINS
                                          customer_hesitations           

  **seller_modifier.codBias**             prof.cod_bias                  EQ (TRUE/FALSE)

  **seller_modifier.urgencyLevel**        prof.urgency_level             EQ

  **seller_modifier.trustDensity**        prof.trust_density             EQ

  **commerce_architecture**               prof.commerce_architecture     EQ

  **business_maturity**                   prof.maturity_score            GT \| LT \| EQ

  **seller_expression_profile**           prof.expression_profile        EQ

  **customer_type**                       prof.buyer_identity (array)    CONTAINS

  **asset_reality.before_after_images**   prof.has_before_after_images   EQ

  **asset_reality.social_feed**           prof.has_social_feed           EQ

  **review_count**                        prof.review_count              GT \| LT

  **seller_profile.certifications**       prof.has_certifications        EQ
  -------------------------------------------------------------------------------------------------

**Phase 3: Apply Archetype Overrides (63 rules)**

Query cr_archetype_overrides for rows matching either the seller\'s
archetype_name OR archetype_cluster. Archetype overrides can ACTIVATE,
SUPPRESS, WEIGHT_UP (+2), or WEIGHT_DOWN (-2) components. LOCKED
components cannot be suppressed here.

+-----------------------------------------------------------------+
| **Override Order**                                              |
|                                                                 |
| Archetype overrides fire AFTER activation rules. They can       |
| therefore un-suppress a component that activation rules         |
| suppressed, or suppress a component that was activated. This is |
| intentional --- archetype identity (who the seller is)          |
| overrules category rules (what they sell).                      |
+-----------------------------------------------------------------+

**Phase 4: Apply Category Requirements**

Query cr_category_requirements for the seller\'s primary_category.
MANDATORY requirements guarantee the component is active --- they
override prior suppression. RECOMMENDED requirements add the component
if not already present. Results are also collected into
v_category_mandatory for audit in the final config.

**Phase 5: Structural Guardrails**

After all rules fire, five structural guardrails are checked. If
violated, the system self-heals by adding the required component, and
records the violation in guardrail_violations. guardrails_passed is set
false for visibility. The store still renders --- violations are
non-blocking.

  --------------------------------------------------------------------
  **Guardrail**      **Component      **Condition**
                     required**       
  ------------------ ---------------- --------------------------------
  **CTA block must   COMP_PDP_015     Always
  exist**                             

  **Product Title    COMP_PDP_010     Always
  must exist**                        

  **Reviews Summary  COMP_PDP_011     Always
  must exist**                        

  **Price Display    COMP_PDP_012     Always
  must exist**                        

  **Sticky CTA on    COMP_PDP_016     commerce_architecture =
  product_engine**                    product_engine
  --------------------------------------------------------------------

**Phase 6: Build Expert Fallback Sequence**

If no persuasion sequence is assigned (persuasion_sequence_id is null),
the function builds an expert sequence from four structural layers.
These represent the canonical D2C conversion architecture for any
product.

  ------------------------------------------------------------------------
  **Layer**     **Components**            **Purpose**
  ------------- ------------------------- --------------------------------
  **Hooks**     COMP_PDP_001, 010, 011,   Above-fold hooks --- product
                012, 013, 014             identity and core trust signals

  **Proof**     COMP_PDP_021, 017, 053,   Evidence and social proof zone
                050                       

  **Context**   Category-specific (see    3 components selected by
                below)                    primary_category

  **Close**     COMP_PDP_015, 025, 055    CTA, related products, urgency
                                          close
  ------------------------------------------------------------------------

The category context layer selects three components specific to the
product category. Examples: Fashion â†’ size guide, fit visualiser,
reviews detail. Spiritual â†’ ritual guide, certification display, origin
story.

**Phase 7: UPSERT to re_store_render_config**

The function writes all computed values to re_store_render_config via
UPSERT (ON CONFLICT (store_id) DO UPDATE). The function prefers the
persuasion sequence from ob_persuasion_sequences if found, falling back
to the expert sequence. needs_recompute is set to false on successful
completion.

**3.3 Calling the Function**

The bridge function should be called from the application layer in two
scenarios:

1.  After onboarding completion --- when ob_seller_profiles is first
    created for a store

2.  When needs_recompute = true on re_store_render_config --- triggered
    automatically when ob_seller_profiles is updated

+-----------------------------------------------------------------+
| \-- Application layer call (from Next.js API route or server    |
| action)                                                         |
|                                                                 |
| const { error } = await                                         |
| supabase.rpc(\'compute_store_render_config\', {                 |
|                                                                 |
| p_store_id: store.id                                            |
|                                                                 |
| })                                                              |
|                                                                 |
| \-- Direct PostgreSQL call                                      |
|                                                                 |
| SELECT compute_store_render_config(\'\<store_uuid\>\');         |
+-----------------------------------------------------------------+

+-----------------------------------------------------------------+
| **When to Re-run**                                              |
|                                                                 |
| The trigger trg_invalidate_render_config (AFTER UPDATE on       |
| ob_seller_profiles) automatically sets needs_recompute=true.    |
| The application layer is responsible for detecting this flag    |
| and calling compute_store_render_config() asynchronously ---    |
| for example via a queue or a background job. Do not call it     |
| synchronously on each page render.                              |
+-----------------------------------------------------------------+

**4. Resolved View: vw_store_config_resolved**

This is the final read layer. The renderer reads from this view only ---
never directly from any underlying table. The view joins the
intelligence config, design tokens, seller overrides, and legacy
fallback into a single flat object per store.

**4.1 View Composition**

The view is a two-level JOIN. First, vw_store_config joins stores,
ob_seller_profiles, re_store_render_config, and ob_design_tokens. Then,
vw_store_config_resolved joins vw_store_config with ob_design_tokens a
second time for extended colour tokens, and applies seller overrides via
a subquery.

+-----------------------------------------------------------------+
| vw_store_config_resolved                                        |
|                                                                 |
| â”œâ”€â”€ vw_store_config                                             |
|                                                                 |
| â”‚ â”œâ”€â”€ stores s (operational: COD, prepaid, domain)              |
|                                                                 |
| â”‚ â”œâ”€â”€ ob_seller_profiles p (intelligence: hesitation,           |
| archetype)                                                      |
|                                                                 |
| â”‚ â”œâ”€â”€ re_store_render_config r (computed: component arrays,     |
| sequences)                                                      |
|                                                                 |
| â”‚ â””â”€â”€ ob_design_tokens dt (design tokens: fonts, colours,       |
| motion)                                                         |
|                                                                 |
| â””â”€â”€ ob_design_tokens dt (extended) (additional token columns:             |
| bg_hero, urgency_bg, badge_bg, text_on_dark, shimmer_base, etc.)        |
|                                                                         |
| â””â”€â”€ resolved_active_components (applies seller overrides via            |
| subquery)                                                               |
|                                                                         |
| *(Note 2026-02-26: The view also exposes has_search from ob_ux_rules,     |
| and config_mode from the stores table).*                                  |
+-------------------------------------------------------------------------+

**4.2 The resolved_active_components Column**

This is the most important computed column in the view. It applies
seller overrides (re_seller_overrides) on top of the
intelligence-computed active_components_all. The logic is:

3.  Start with active_components_all from the intelligence layer

4.  UNION with any ACTIVATE overrides from re_seller_overrides for this
    store

5.  Remove any components that have a SUPPRESS override (where is_locked
    = false)

+-----------------------------------------------------------------+
| \-- resolved_active_components subquery (from view definition)  |
|                                                                 |
| SELECT array_agg(DISTINCT comp ORDER BY comp)                   |
|                                                                 |
| FROM (                                                          |
|                                                                 |
| SELECT unnest(v.active_components_all) AS comp                  |
|                                                                 |
| UNION                                                           |
|                                                                 |
| SELECT cco.component_id FROM cr_component_overrides cco         |
|                                                                 |
| WHERE cco.store_id = v.store_id AND cco.override_type =         |
| \'ACTIVATE\'                                                    |
|                                                                 |
| ) combined                                                      |
|                                                                 |
| WHERE NOT (combined.comp IN (                                   |
|                                                                 |
| SELECT o.component_id FROM cr_component_overrides o             |
|                                                                 |
| WHERE o.store_id = v.store_id                                   |
|                                                                 |
| AND o.override_type = \'SUPPRESS\'                              |
|                                                                 |
| AND o.is_locked = false                                         |
|                                                                 |
| ))                                                              |
+-----------------------------------------------------------------+

**4.3 config_mode Field**

The view exposes a config_mode field that tells the renderer how
complete the intelligence config is for this store. Renderers should
check this field and fall back gracefully.

  --------------------------------------------------------------------------
  **config_mode**    **Condition**            **Renderer behaviour**
  ------------------ ------------------------ ------------------------------
  **intelligence**   Both                     Full intelligence rendering
                     re_store_render_config   --- use all component arrays,
                     AND ob_seller_profiles   sequences, weights
                     exist                    

  **profile_only**   ob_seller_profiles       Profile available but compute
                     exists but               not yet run --- trigger
                     re_store_render_config   compute, render with defaults
                     does not                 

  **legacy**         Neither table has a row  Fall back to
                     for this store           stores.theme_config jsonb for
                                              backward compatibility
  --------------------------------------------------------------------------

**4.4 Key Fields for the Renderer**

These are the fields the renderer accesses most frequently:

  ------------------------------------------------------------------------------------------
  **Field**                        **Source**               **Used for**
  -------------------------------- ------------------------ --------------------------------
  **resolved_active_components**   Computed in view         Which components to render ---
                                                            final answer after all overrides

  **pdp_component_sequence**       re_store_render_config   Order in which to render PDP
                                                            components

  **above_fold_components**        re_store_render_config   Which components must appear
                                                            above fold ---
                                                            guardrail-enforced

  **component_weights**            re_store_render_config   Visual weight/prominence per
                                                            component (1--10)

  **mood_card**                    Derived from             Which design token set to inject
                                   re_store_render_config   via ThemeProvider

  **All ob_design_tokens columns** ob_design_tokens JOIN    50+ CSS tokens injected by
                                                            ThemeProvider

  **urgency_mechanic**             re_store_render_config   Which urgency component variant
                                                            to render

  **cta_behaviour**                re_store_render_config   CTA rendering mode: sticky \|
                                                            inline \| floating \| dual

  **cod_bias**                     re_store_render_config   Whether to render COD-prominence
                                                            UI

  **active_pages**                 re_store_render_config   Navigation: which pages exist
                                                            for this store

  **needs_recompute**              re_store_render_config   If true, config may be stale ---
                                                            show admin warning
  ------------------------------------------------------------------------------------------

**5. Override Layer Architecture**

The override layer allows sellers to customise their store\'s component
configuration while the intelligence system retains its computed state.
Overrides and intelligence are kept strictly separate --- they live in
different tables and merge only in the view.

**5.1 Separation Guarantee**

Intelligence (re_store_render_config) and seller overrides
(re_seller_overrides) are stored in different tables. The view
vw_store_config_resolved merges them at read time. Recomputing the
intelligence layer (compute_store_render_config) never touches
re_seller_overrides. Seller overrides are permanent until the seller
explicitly resets them.

+-----------------------------------------------------------------+
| Intelligence recompute flow:                                    |
|                                                                 |
| ob_seller_profiles UPDATE                                       |
|                                                                 |
| â†’ trg_invalidate_render_config fires                            |
|                                                                 |
| â†’ re_store_render_config.needs_recompute = true                 |
|                                                                 |
| â†’ App calls compute_store_render_config()                       |
|                                                                 |
| â†’ re_store_render_config is OVERWRITTEN                         |
|                                                                 |
| â†’ re_seller_overrides is UNTOUCHED                              |
|                                                                 |
| Seller override flow:                                           |
|                                                                 |
| Seller clicks \"add/remove/reorder component\" in dashboard     |
|                                                                 |
| â†’ App calls fn_get_override_opinion() for recommendation        |
|                                                                 |
| â†’ App INSERTs into re_seller_overrides                          |
|                                                                 |
| â†’ trg_deactivate_prior_overrides fires (deactivates old         |
| override for same component)                                    |
|                                                                 |
| â†’ vw_store_config_resolved reflects change immediately          |
+-----------------------------------------------------------------+

**5.2 fn_get_override_opinion()**

Before inserting an override, the application calls
fn_get_override_opinion() to get the system\'s recommendation. This is
surfaced to the seller as a contextual advisory in the dashboard.

+-----------------------------------------------------------------+
| fn_get_override_opinion(                                        |
|                                                                 |
| p_store_id uuid,                                                |
|                                                                 |
| p_component_id text,                                            |
|                                                                 |
| p_override_type text \-- ACTIVATE \| SUPPRESS \| REORDER        |
|                                                                 |
| )                                                               |
|                                                                 |
| RETURNS TABLE(recommendation text, reason text, can_proceed     |
| boolean)                                                        |
+-----------------------------------------------------------------+

  --------------------------------------------------------------------------------
  **recommendation**    **Meaning**                              **can_proceed**
  --------------------- ---------------------------------------- -----------------
  **BLOCKED**           Component is LOCKED --- override         false
                        rejected at database level               

  **AGREES**            System concurs with seller\'s choice     true

  **CAUTION**           System has a concern but will allow the  true
                        override                                 

  **ADVISES_AGAINST**   System strongly recommends against this, true
                        but will allow it                        
  --------------------------------------------------------------------------------

The function checks, in order: governance level (BLOCKED if LOCKED),
mood card prohibitions (Shaahi, Dil Se Desi: no urgency components),
archetype misalignment (craft_maker: no urgency), category mandatory
(cannot suppress a MANDATORY component), mobile mandatory warnings.

**5.3 Trigger: fn_guard_locked_component_override()**

A BEFORE INSERT trigger (trg_guard_locked_override) on
re_seller_overrides that raises an exception if the target component has
governance_level = LOCKED or science_locked = true. This is the
database-level enforcement --- even if the application bypasses
fn_get_override_opinion(), LOCKED components cannot be overridden.

+-----------------------------------------------------------------+
| \-- Trigger fires on INSERT to re_seller_overrides              |
|                                                                 |
| \-- Raises exception if component is LOCKED:                    |
|                                                                 |
| \-- RAISE EXCEPTION \'Component % is LOCKED and cannot be       |
| overridden.\', NEW.component_id;                                |
+-----------------------------------------------------------------+

**5.4 Override Types**

  ---------------------------------------------------------------------------------
  **override_type**   **Effect**                   **Notes**
  ------------------- ---------------------------- --------------------------------
  **ACTIVATE**        Adds component to            Component will render even if
                      resolved_active_components   intelligence suppressed it

  **SUPPRESS**        Removes component from       Blocked for LOCKED components by
                      resolved_active_components   database trigger

  **REORDER**         Adjusts zone_position for    Used by drag-and-drop reordering
                      component within its zone    in dashboard

  **RESET**           Deactivates all prior        Returns component to pure
                      overrides for this component intelligence state
  ---------------------------------------------------------------------------------

**5.5 Override Precedence**

Within re_seller_overrides, the latest active override per (store_id,
component_id) wins. The trigger trg_deactivate_prior_overrides
deactivates all prior active overrides before inserting the new one ---
so only one active override exists per component at any time. The view
then applies all active overrides against the intelligence baseline.

**6. RTO Engine (Return-to-Origin Risk Scoring)**

The RTO Engine scores every incoming Cash-on-Delivery order for return
risk using a database trigger. The score determines which checkout
configuration the buyer sees --- partial prepaid gate, prepaid incentive
banner, or full COD access. Prepaid orders skip scoring entirely
(risk_level = \'low\').

**6.1 Trigger Architecture**

The trigger evaluate_cod_risk_on_order fires BEFORE INSERT on the orders
table. It computes a risk score, writes risk_level and all signal data
back into the order record, and returns the modified NEW record. The
order lands in the database already scored.

+-----------------------------------------------------------------+
| Trigger: trg_evaluate_cod_risk                                  |
|                                                                 |
| Fires: BEFORE INSERT on orders                                  |
|                                                                 |
| For: Each row                                                   |
|                                                                 |
| Only scores orders where payment_mode IN (\'COD\', \'cod\')     |
|                                                                 |
| Prepaid orders: risk_level = \'low\', return immediately        |
+-----------------------------------------------------------------+

**6.2 Score Bands and Action Matrix**

  ---------------------------------------------------------------------------------
  **Score**    **risk_level**   **Checkout      **Behaviour**
                                state**         
  ------------ ---------------- --------------- -----------------------------------
  **0--39**    low              State A ---     COD available with no friction. No
                                Full Access     intervention.

  **40--69**   medium           State B ---     COD available. Prepaid Incentive
                                Prepaid         Banner shown offering prepaid
                                Incentive       discount.

  **70--99**   high             State C ---     COD hidden by default. User must
                                Partial Prepaid tap \'Pay by COD\' to reveal.
                                Gate            Prepaid is prominently featured.

  **100**      kill             State D --- COD COD option removed entirely.
                                Blocked         Prepaid is only option.
                                                Non-reversible for this session.
  ---------------------------------------------------------------------------------

**6.3 Signal Scoring**

**Block A: Kill Pass Signals**

  -------------------------------------------------------------------
  **Signal**          **Score**      **Condition**
  ------------------- -------------- --------------------------------
  **2+ prior RTO      +100 (Kill     customers.bounce_count â‰¥ 2.
  bounces**           Pass)          Score immediately reaches 100,
                                     skip all other signals.

  **1 prior RTO       +50            customers.bounce_count = 1
  bounce**                           
  -------------------------------------------------------------------

**Block B: Base Signals**

  -------------------------------------------------------------------
  **Signal**          **Score**      **Condition**
  ------------------- -------------- --------------------------------
  **Difficult         +40            Pincode prefix in
  logistics state**                  rto_difficult_pincodes (J&K, NE
                                     states, Andaman). Fallback:
                                     delivery_state name match.

  **Fake or           +50            All-same digits, 1234567890,
  sequential phone**                 9876543210, or starts with 0 or
                                     1

  **Gibberish         +30            Name length \< 3, or name
  customer name**                    contains no vowels

  **Incomplete        +20            Address line \< 10 characters,
  address**                          or contains no digit (no
                                     house/building number)
  -------------------------------------------------------------------

**Block C: Extended Signals**

  -------------------------------------------------------------------
  **Signal**          **Score**      **Condition**
  ------------------- -------------- --------------------------------
  **Night order**     +15            Order placed 1am--4am in
                                     store\'s configured timezone
                                     (dynamic, not hardcoded IST)

  **COD value band    +20            Highest RTO band in Indian D2C
  â‚¹500--â‚¹1,499**                     by empirical data

  **COD value above   +25            High-value + COD = strong
  â‚¹2,000**                           abandonment signal

  **Same phone, 3+    +30            Velocity signal --- phone number
  COD orders in 30                   reuse pattern
  days**                             

  **Same device       +40            Fraud pattern. Requires
  fingerprint,                       device_fingerprint in
  different phones**                 orders.meta.
  -------------------------------------------------------------------

**Block D: Session Behaviour Modifier**

A pre-computed score passed in orders.meta.session_score by the
application layer. Positive values indicate risky session behaviour
(rapid scrolling, no hesitation, multiple orders). Negative values
indicate engaged, trusted behaviour. Added directly to the running
score. Can push the score below zero --- floor is 0.

**Block E: Category Risk Multiplier**

Applied last, after all additive signals. Multiplied against the running
score (rounded). Caps at 99 for non-kill-pass orders.

  -----------------------------------------------------------------------------
  **Category**       **Multiplier**   **Category**     **Multiplier**
  ------------------ ---------------- ---------------- ------------------------
  **dropshipping**   1.4Ã—             health / fitness 0.9Ã—

  **fashion /        1.3Ã—             food /           0.8Ã—
  apparel**                           consumables      

  **electronics**    1.2Ã—             spiritual /      1.0Ã—
                                      lifestyle /      
                                      other            

  **beauty**         1.1Ã—                              
  -----------------------------------------------------------------------------

**6.4 Score Transparency**

All scoring signals and the final score are written back into
orders.meta by the trigger, for full auditability. The store owner can
see exactly why a specific order received a particular risk level.

+-----------------------------------------------------------------+
| orders.meta after trigger:                                      |
|                                                                 |
| {                                                               |
|                                                                 |
| \"rto_score\": 72,                                              |
|                                                                 |
| \"rto_reasons\": \[\"Prior bounce on this phone number (+50)\", |
| \"Night order (+15)\"\],                                        |
|                                                                 |
| \"rto_multiplier\": 1.0,                                        |
|                                                                 |
| \"rto_scored_at\": \"2026-02-26T02:00:00Z\",                    |
|                                                                 |
| \"rto_trigger_ver\": \"bible_phase1_v3_dynamic_tz\"             |
|                                                                 |
| }                                                               |
+-----------------------------------------------------------------+

**6.5 Bounce Count Update**

When a COD order is confirmed as returned (RTO), the application layer
calls increment_bounce_count() or updates customers.bounce_count
directly. The last_bounce_at field is updated for recency weighting in
future scoring iterations. This creates a feedback loop: repeat bouncing
customers are automatically blocked from COD.

**6.6 Checkout Strip: Four Capability States**

The checkout strip component reads the risk_level from the order (or
from a pre-flight score during cart review) and renders one of four
states. The application must pass the score to the checkout strip before
order placement.

  --------------------------------------------------------------------------------
  **State**   **risk_level**   **COD       **Prepaid            **Discount shown**
                               visible**   behaviour**          
  ----------- ---------------- ----------- -------------------- ------------------
  **A**       low (0--39)      Yes         Available but not    No prepaid
                                           emphasised           discount highlight

  **B**       medium (40--69)  Yes         Prepaid Incentive    Prepaid discount
                                           Banner shown         amount displayed
                                                                prominently

  **C**       high (70--99)    Hidden (tap Partial Prepaid Gate Large discount CTA
                               to reveal)  --- prepaid is       to incentivise
                                           primary CTA          prepaid

  **D**       kill (100)       No          Prepaid only --- COD No discount needed
                                           option removed       --- no choice
                                                                available
  --------------------------------------------------------------------------------

**7. Page System**

The page system generates and governs all pages for a store based on the
seller\'s maturity score and commerce architecture. Pages are not blank
--- they are created with the correct status, navigation position,
governance, and section configuration.

**7.1 initialise_store_pages()**

Called once after onboarding completes. Reads the ob_ux_rules row
matching the seller\'s maturity score + commerce_architecture, then
creates pg_store_pages rows for all mandatory and optional pages.

+-----------------------------------------------------------------+
| initialise_store_pages(p_store_id uuid) RETURNS void            |
|                                                                 |
| Reads: ob_seller_profiles (maturity_score,                      |
| commerce_architecture)                                          |
|                                                                 |
| ob_ux_rules (mandatory_pages, optional_pages)                   |
|                                                                 |
| Writes: pg_store_pages (INSERT, ON CONFLICT DO NOTHING)         |
+-----------------------------------------------------------------+

Mandatory pages are created with status = \'published\'. Optional pages
are created with status = \'draft\'. Policy pages (refund_policy,
privacy_policy, shipping_policy, terms) are always seeded as published,
show_in_nav = false (footer only).

**7.2 Page Types and Governance**

  -----------------------------------------------------------------------------------------------
  **page_type**         **Governance**   **Mandatory**   **show_in_nav**   **Notes**
  --------------------- ---------------- --------------- ----------------- ----------------------
  **home**              intelligence     Yes             Yes (pos 1)       Slug = empty string
                                                                           \'\'

  **pdp**               N/A              N/A             N/A               Not a pg_store_pages
                                                                           page --- rendered
                                                                           dynamically per
                                                                           product

  **collection**        intelligence     Maturity â‰¥ 2    Yes (pos 2)       Slug = collections

  **about**             intelligence     Score â‰¥ 1.5     Yes (pos 3)       

  **brand_story**       intelligence     Varies          Yes (pos 3)       Story-first
                                                                           architecture always
                                                                           gets this

  **contact**           intelligence     Yes             Yes (pos 4)       

  **faq**               intelligence     Yes             Yes (pos 5)       

  **journal**           intelligence     Story-first     Yes (pos 3)       Replaces blog for
                                         only                              artisan archetype

  **refund_policy**     intelligence     Yes (always)    No (footer)       Legal requirement

  **privacy_policy**    intelligence     Yes (always)    No (footer)       Legal requirement

  **shipping_policy**   intelligence     Yes (always)    No (footer)       

  **terms**             intelligence     Yes (always)    No (footer)       Legal requirement

  **cart**              system_locked    Yes             No                Cannot be suppressed

  **checkout**          system_locked    Yes             No                Cannot be suppressed

  **seller_created**    seller_created   No              Seller choice     Custom pages created
                                                                           after launch
  -----------------------------------------------------------------------------------------------

**7.3 Navigation Generation**

Navigation is generated by querying pg_store_pages where show_in_nav =
true and status = \'published\', ordered by nav_position. The navigation
type (minimal \| standard \| full) is determined by ob_ux_rules and
constrains how many items appear.

+-----------------------------------------------------------------+
| \-- Query for navigation generation                             |
|                                                                 |
| SELECT title, slug, page_type, nav_position                     |
|                                                                 |
| FROM pg_store_pages                                             |
|                                                                 |
| WHERE store_id = \$1                                            |
|                                                                 |
| AND show_in_nav = true                                          |
|                                                                 |
| AND status = \'published\'                                      |
|                                                                 |
| ORDER BY nav_position ASC                                       |
|                                                                 |
| LIMIT \$nav_items_max; \-- from ob_ux_rules for this store      |
+-----------------------------------------------------------------+

**7.4 Homepage Template Selection**

The homepage template is determined during onboarding based on
commerce_architecture + archetype_cluster + mood card. The selected
template key is written to ob_seller_profiles.homepage_template_key and
copied to re_store_render_config.homepage_template_key during
compute_store_render_config().

The homepage section sequence
(re_store_render_config.homepage_section_sequence) is an ordered array
of block type keys from pg_homepage_block_types, weighted by
intelligence_weight and filtered by suitable_for (commerce
architecture). The renderer iterates this array to build the homepage.

**8. ThemeProvider: Design Token Injection**

The ThemeProvider is the bridge between the database design tokens and
the CSS rendered in the browser. It reads the resolved store config
(from vw_store_config_resolved), extracts all design token fields, and
injects them as CSS custom properties on the root element.

**8.1 Token Injection Pattern**

+-----------------------------------------------------------------------+
| // ThemeProvider --- simplified injection pattern                     |
|                                                                       |
| export function ThemeProvider({ config, children }) {                 |
|                                                                       |
| useEffect(() =\> {                                                    |
|                                                                       |
| const root = document.documentElement                                 |
|                                                                       |
| root.style.setProperty(\'\--colour-primary\', config.primary_colour)  |
|                                                                       |
| root.style.setProperty(\'\--colour-cta\', config.cta_colour)          |
|                                                                       |
| root.style.setProperty(\'\--colour-cta-text\',config.cta_text_colour) |
|                                                                       |
| root.style.setProperty(\'\--font-display\',                           |
| \`\${config.heading_font}, sans-serif\`)                              |
|                                                                       |
| root.style.setProperty(\'\--font-body\', \`\${config.body_font},      |
| sans-serif\`)                                                         |
|                                                                       |
| root.style.setProperty(\'\--radius-button\',                          |
| config.border_radius_button)                                          |
|                                                                       |
| root.style.setProperty(\'\--radius-card\', config.border_radius_card) |
|                                                                       |
| root.style.setProperty(\'\--radius-image\',                           |
| config.border_radius_image)                                           |
|                                                                       |
| root.style.setProperty(\'\--shadow\', config.shadow_style)            |
|                                                                       |
| root.style.setProperty(\'\--motion-enter\',                           |
| config.motion_enter_duration)                                         |
|                                                                       |
| root.style.setProperty(\'\--motion-ease\', config.motion_easing)      |
|                                                                       |
| root.style.setProperty(\'\--motion-tap\', config.motion_scale_tap)    |
|                                                                       |
| root.style.setProperty(\'\--shimmer-base\', config.shimmer_base)      |
|                                                                       |
| root.style.setProperty(\'\--shimmer-hi\', config.shimmer_highlight)   |
|                                                                       |
| // Micro-Interactions                                                 |
| root.style.setProperty('--opacity-hover', config.opacity_hover)       |
| root.style.setProperty('--scale-hover', config.scale_hover)           |
|                                                                       |
| // Iconography                                                        |
| root.style.setProperty('--icon-weight', config.icon_weight)           |
|                                                                       |
| // Interface Details                                                  |
| root.style.setProperty('--border-width-card',                         |
| config.border_width_card)                                             |
|                                                                       |
|                                                                       |
| // \... all 50+ tokens                                                |
|                                                                       |
| }, \[config.mood_card\])                                              |
|                                                                       |
| return children                                                       |
|                                                                       |
| }                                                                     |
+-----------------------------------------------------------------------+

**8.2 Complete Token List**

All fields from ob_design_tokens are injected as CSS custom properties.
The naming convention is \--{category}-{property}.

- **Typography:** `--font-display`, `--font-body`, `--font-scale-h-xl`, etc.
- **Colour:** `--colour-primary`, `--colour-accent`, `--colour-surface`, etc.
- **Radius:** `--radius-button`, `--radius-card`, `--radius-image`.
- **Shadow:** `--shadow-soft`, `--shadow-dramatic`, `--shadow-hover`.
- **Motion:** `--motion-enter`, `--motion-ease`, `--motion-tap`.
- **Micro-Interactions:** `--opacity-hover`, `--scale-hover`, `--shadow-active`.
- **Iconography:** `--icon-set`, `--icon-weight`, `--icon-style`.
- **Interface Details:** `--border-width-input`, `--border-width-card`, etc.

  ---------------------------------------------------------------------------------------
  **CSS Variable**               **Source field**        **Usage**
  ------------------------------ ----------------------- --------------------------------
  **\--colour-primary**          primary_colour          Brand primary --- headings,
                                                         icons, accents

  **\--colour-secondary**        secondary_colour        Secondary brand --- supporting
                                                         elements

  **\--colour-bg**               background_colour       Page background

  **\--colour-surface**          surface_colour          Card and component backgrounds

  **\--colour-cta**              cta_colour              CTA button background

  **\--colour-cta-text**         cta_text_colour         CTA button label

  **\--colour-accent-gold**      accent_gold             Premium highlight --- rating
                                                         stars, badges

  **\--colour-text-primary**     text_primary_colour     Primary body text

  **\--colour-text-secondary**   text_secondary_colour   Secondary text, captions

  **\--colour-urgency-bg**       urgency_bg              Urgency component background

  **\--colour-urgency-text**     urgency_text            Urgency component text

  **\--colour-border**           border_colour           Standard border

  **\--colour-star**             star_colour             Rating star fill colour

  **\--font-display**            heading_font            Display/heading typeface

  **\--font-body**               body_font               Body copy typeface

  **\--radius-button**           border_radius_button    Button corner radius

  **\--radius-card**             border_radius_card      Card corner radius

  **\--radius-image**            border_radius_image     Product image corner radius

  **\--radius-badge**            border_radius_badge     Badge corner radius

  **\--shadow-default**          shadow_style            Default component shadow

  **\--shadow-hover**            shadow_hover            Hover state shadow

  **\--shadow-cta**              shadow_cta              CTA button shadow

  **\--motion-enter**            motion_enter_duration   Component entrance animation
                                                         duration

  **\--motion-ease**             motion_easing           Animation easing curve

  **\--motion-tap**              motion_scale_tap        Touch/tap scale feedback

  **\--spacing-section**         section_gap             Between-section spacing

  **\--spacing-component**       component_gap           Between-component spacing within
                                                         section

  **\--spacing-light**           component_gap_light     Tighter component spacing
                                                         variant

  **\--shimmer-base**            shimmer_base            Loading skeleton base colour

  **\--shimmer-hi**              shimmer_highlight       Loading skeleton highlight
                                                         colour

  **image_ratio_pdp**         text           CSS ratio for product image on
                                             PDP: 1/1, 4/5, 9/16

  **opacity_hover**           numeric        Opacity on hover: 0 to 1

  **scale_hover**             numeric        Scale on hover: 1.0 to 1.1

  **shadow_active**           text           CSS shadow on active/click

  **border_focus**            text           CSS border on focus/active

  **icon_set**                text           Icon family name bridged to Mood
                                             Card

  **icon_weight**             text           Icon stroke weight (e.g., 400)

  **icon_style**              text           Icon style: outline | solid |
                                             duotone
  **--border-width-input**      border_width_input      Form input border thickness
  **--border-width-card**       border_width_card       Card/Container border thickness
  **--focus-ring-colour**       focus_ring_colour       Accessibility ring colour
  **--focus-ring-style**        focus_ring_style        Solid | dashed | dotted
  ---------------------------------------------------------------------------------------

**8.3 Mood Card Strip Pass**

The ThemeProvider must pass a \"strip test\" before rendering any page
component. The strip test ensures the injected tokens produce an
accessible, visually coherent result. Minimum requirements:

- CTA button: contrast ratio â‰¥ 4.5:1 between cta_colour and
  cta_text_colour

- Body text: contrast ratio â‰¥ 4.5:1 between text_primary_colour and
  background_colour

- All shimmer values: shimmer_base and shimmer_highlight must be valid
  CSS colour values

- Motion values: motion_enter_duration must be a valid CSS duration
  (e.g., 300ms)

If the strip test fails (null or invalid token), the ThemeProvider falls
back to the Saaf Suthra (clean/neutral) token set, which is the
guaranteed-safe fallback design system.

**9. Alive Engine: Motion & Animation**

The Alive Engine is the implementation layer for motion on the platform.
It wraps Framer Motion primitives with the design token system to
produce store-specific animations that respect the mood card\'s motion
profile and the device\'s reduced-motion preference.

**9.1 Design Principles**

- All motion is governed by the mood card\'s motion_profile: cinematic
  \| fluid \| subtle \| snappy \| none

- prefers-reduced-motion media query is respected --- all animations are
  disabled when set

- Motion does not block render --- it is layered on top of
  already-visible content (no motion-gated content)

- Seven primitive components cover all motion needs --- no ad-hoc
  animations elsewhere in the codebase

**9.2 Seven Motion Primitives**

**FadeIn**

Entrance animation for components entering the viewport. Opacity 0 â†’ 1,
optional translateY.

+-----------------------------------------------------------------+
| \<FadeIn delay={0.1} duration={config.motion_enter_duration}\>  |
|                                                                 |
| \<TrustBadge \... /\>                                           |
|                                                                 |
| \</FadeIn\>                                                     |
|                                                                 |
| Props:                                                          |
|                                                                 |
| delay: number (seconds) --- stagger delay for sequential        |
| elements                                                        |
|                                                                 |
| duration: string (CSS duration, from \--motion-enter)           |
|                                                                 |
| y: number (px) --- vertical translate on enter. Default: 16px   |
+-----------------------------------------------------------------+

**SlideIn**

Directional slide entrance for panels, drawers, and side-entering
elements.

+-----------------------------------------------------------------+
| \<SlideIn from=\"bottom\"                                       |
| duration={config.motion_enter_duration}\>                       |
|                                                                 |
| \<CheckoutStrip \... /\>                                        |
|                                                                 |
| \</SlideIn\>                                                    |
|                                                                 |
| Props:                                                          |
|                                                                 |
| from: \"bottom\" \| \"top\" \| \"left\" \| \"right\"            |
+-----------------------------------------------------------------+

**ScaleTap**

Touch feedback for interactive elements. Wraps any tappable element with
scale feedback on press.

+-----------------------------------------------------------------+
| \<ScaleTap scale={config.motion_scale_tap}\>                    |
|                                                                 |
| \<button\>Buy Now\</button\>                                    |
|                                                                 |
| \</ScaleTap\>                                                   |
|                                                                 |
| Props:                                                          |
|                                                                 |
| scale: string (CSS scale value, from \--motion-tap)             |
+-----------------------------------------------------------------+

**StaggerGroup**

Container that staggers entrance animations for a list of child
elements. Used for component grids, benefit lists, testimonial rows.

+-----------------------------------------------------------------+
| \<StaggerGroup stagger={0.08}\>                                 |
|                                                                 |
| {benefits.map(b =\> \<BenefitCard key={b.id} {\...b} /\>)}      |
|                                                                 |
| \</StaggerGroup\>                                               |
|                                                                 |
| Props:                                                          |
|                                                                 |
| stagger: number (seconds between each child\'s entrance)        |
+-----------------------------------------------------------------+

**Magnetic**

Cursor-aware CTA behaviour on desktop. The primary CTA element subtly
follows the pointer, making the store feel alive. Calibrated per mood
card --- barely perceptible on Shaahi, highly responsive on Dhamaka.

+-----------------------------------------------------------------+
| Props:                                                          |
|                                                                 |
| strength: number (0.0--1.0, from mood card calibration)         |
+-----------------------------------------------------------------+

**Parallax**

Depth scroll effect on hero images and gallery photography. Desktop
only. Most pronounced on Shaahi and Rasoi where photography is the
primary emotional instrument.

+-----------------------------------------------------------------+
| Props:                                                          |
|                                                                 |
| speed: number (0.0--1.0, from mood card calibration)            |
+-----------------------------------------------------------------+

**Shimmer**

Loading skeleton with sweep animation. Uses \--shimmer-base and
\--shimmer-hi CSS variables injected by ThemeProvider. Used for all
loading states.

+-----------------------------------------------------------------+
| \<Shimmer width=\"100%\" height={200}                           |
| borderRadius={config.border_radius_card} /\>                    |
|                                                                 |
| Props:                                                          |
|                                                                 |
| width: CSS width                                                |
|                                                                 |
| height: number (px)                                             |
|                                                                 |
| borderRadius: CSS value (from \--radius-card)                   |
+-----------------------------------------------------------------+

**9.3 Motion Profile â†’ Primitive Configuration**

  ------------------------------------------------------------------------------------------------
  **motion_profile**   **FadeIn     **SlideIn    **ScaleTap**   **StaggerGroup**   **Used by**
                       duration**   duration**                                     
  -------------------- ------------ ------------ -------------- ------------------ ---------------
  **cinematic**        600ms        500ms        0.94           0.12s              Shaahi, premium
                                                                                   archetypes

  **fluid**            400ms        350ms        0.96           0.08s              Gen Z, Taza ---
                                                                                   default for
                                                                                   most stores

  **subtle**           300ms        250ms        0.97           0.06s              Saaf Suthra,
                                                                                   Dil Se Desi

  **snappy**           200ms        180ms        0.92           0.04s              Dhamaka ---
                                                                                   urgency-heavy
                                                                                   stores

  **none**             0ms          0ms          1.0            0s                 Accessibility
                                                                                   fallback
  ------------------------------------------------------------------------------------------------


**9.5 InteractionProvider**

A context provider that wraps the store at the root level and exposes
the resolved motion configuration to all motion primitives. This
eliminates prop-drilling of motion config through every component.

+-----------------------------------------------------------------+
| // \_app.tsx or layout.tsx                                      |
|                                                                 |
| \<InteractionProvider config={resolvedStoreConfig}\>            |
|                                                                 |
| {children}                                                      |
|                                                                 |
| \</InteractionProvider\>                                        |
|                                                                 |
| // Inside any motion primitive                                  |
|                                                                 |
| const { motionProfile, reducedMotion } = useInteraction()       |
|                                                                 |
| if (reducedMotion \|\| motionProfile === \'none\') return       |
| children                                                        |
+-----------------------------------------------------------------+

**10. Image Quality Classification**

Product images are the highest-variance input in the Easy D2C system.
The platform handles images ranging from professional studio photography
to blurry phone photos with watermarks. The image quality system
classifies images and adjusts the rendering accordingly to prevent
low-quality images from degrading the store.

**10.1 Four Quality Tiers**

  ------------------------------------------------------------------------------------
  **Tier**   **Classification**   **Visual signals** **Renderer behaviour**
  ---------- -------------------- ------------------ ---------------------------------
  **S**      Studio               Clean background,  Full rendering --- all image
                                  professional       features enabled
                                  lighting, sharp    
                                  edges, consistent  
                                  angles             

  **A**      Good Product         Acceptable         Standard rendering --- minor
                                  background, decent auto-enhancement applied
                                  lighting, product  
                                  clearly visible    

  **B**      Acceptable           Busy background,   Damage control mode ---
                                  inconsistent       background blur applied,
                                  lighting, some     auto-crop to product, watermark
                                  blur, possible     zone masked
                                  watermark          

  **C**      Damaged              Heavy blur, text   Placeholder mode --- product
                                  overlay, extreme   category illustration shown,
                                  colour distortion, setup checklist item added to
                                  unusable for       prompt photo upload
                                  commerce           
  ------------------------------------------------------------------------------------

**10.2 Classification Signals**

Classification is performed at upload time. The following signals are
used:

- Resolution: below 600px on shortest edge = Tier C candidate

- Background uniformity: variance below threshold = likely studio (S)

- Sharpness score: Laplacian variance above threshold = A or better

- Text detection: visible text overlay = automatic Tier B or C penalty

- Aspect ratio: extreme ratios (e.g. 10:1) indicate screenshot or
  banner, not product photo

- Watermark detection: pattern-matched against known supplier watermarks
  (dropshipper asset reality)

**10.3 Asset Reality Integration**

The ob_asset_reality_rules table (47 rows) provides an 80% confidence
prediction of what asset quality level a given archetype Ã— maturity band
seller actually has --- before seeing any image. This prediction is used
to:

6.  Pre-configure the image render mode before image upload
    (damage_control_ready flag)

7.  Generate the setup checklist --- if predicted asset quality is B or
    C, \"Upload professional photos\" appears as a high-priority
    checklist item

8.  Set expectations in the onboarding UI for what photo quality the
    seller should aim for

+-----------------------------------------------------------------+
| \-- Asset reality rule lookup                                   |
|                                                                 |
| SELECT likely_has_asset, confidence_pct, component_behaviour,   |
| placeholder_strategy                                            |
|                                                                 |
| FROM ob_asset_reality_rules                                     |
|                                                                 |
| WHERE asset_type = \'product_photos\'                           |
|                                                                 |
| AND archetype_cluster = \$1                                     |
|                                                                 |
| AND \$2 BETWEEN COALESCE(maturity_score_min, 0) AND             |
| COALESCE(maturity_score_max, 99)                                |
|                                                                 |
| LIMIT 1;                                                        |
+-----------------------------------------------------------------+

**11. AI Content Generation**

The content generation system auto-populates component content slots
using seeds from the onboarding profile. Content generation is
archetype-seeded and category-tuned --- a jewellery store gets different
prompts than a supplement store, and a Craft Maker archetype gets
different copy than a Dropshipper.

**11.1 Content Seed â†’ Schema â†’ Component Flow**

+-----------------------------------------------------------------+
| Onboarding answers (ob_seller_profiles.content_seeds jsonb)     |
|                                                                 |
| â”‚                                                               |
|                                                                 |
| â–¼ matched by seed_field_id                                      |
|                                                                 |
| ob_content_seeds_schema (35 rows)                               |
|                                                                 |
| â”‚                                                               |
|                                                                 |
| â–¼ each seed field populates one or more component slots         |
|                                                                 |
| ob_content_schema (55 rows)                                     |
|                                                                 |
| â”‚                                                               |
|                                                                 |
| â–¼                                                               |
|                                                                 |
| Component content slots (rendered in store)                     |
+-----------------------------------------------------------------+

**11.2 ob_content_seeds_schema**

35 content seed field definitions. Each seed is either a direct
onboarding answer or an AI-generated string derived from other seeds.

  ----------------------------------------------------------------------------
  **Column**                   **Type**       **Notes**
  ---------------------------- -------------- --------------------------------
  **seed_field_id**            text (PK)      Canonical seed identifier:
                                              product_name, brand_story,
                                              key_benefit_1, etc.

  **seed_category**            text           product \| brand \| proof \|
                                              trust \| urgency \| delivery

  **derived_from**             text           Source: onboarding_q{N} \|
                                              ai_generated \| seller_input

  **auto_generated**           boolean        If true, AI generates this seed
                                              from other seeds

  **required_for_launch**      boolean        If true, missing seed blocks
                                              store publish

  **generation_prompt_hint**   text           Prompt fragment used when
                                              generating this seed via AI
  ----------------------------------------------------------------------------

**11.3 ob_content_schema**

55 rows defining every content slot across all content-bearing
components. The bridge between seeds and rendered text.

  -----------------------------------------------------------------------
  **Column**              **Type**       **Notes**
  ----------------------- -------------- --------------------------------
  **id**                  text (PK)      Component_id + slot_name
                                         composite

  **component_id**        text           Which component this slot
                                         belongs to

  **slot_name**           text           Slot identifier: headline,
                                         subheadline, cta_label,
                                         badge_text, etc.

  **slot_type**           text           text \| richtext \| image_url \|
                                         boolean \| array

  **max_chars**           integer        Character limit for this slot
                                         (null = unlimited)

  **seed_field_id**       text           Which content seed populates
                                         this slot

  **is_required**         boolean        If true, component will not
                                         render without this slot

  **is_auto_populated**   boolean        If true, system fills this
                                         without seller action

  **seller_editable**     boolean        If true, seller can override via
                                         dashboard

  **population_note**     text           Explanation of how/when this
                                         slot is filled
  -----------------------------------------------------------------------

**11.4 Archetype Content Seeding**

AI-generated content is seeded with archetype and category context. The
generation prompt for any slot is constructed as: \[slot_purpose\] +
\[archetype tone profile\] + \[category context\] + \[seed values\].
This ensures a Dhamaka mood card Dropshipper\'s headline copy sounds
different from a Dil Se Desi Traditional Artisan\'s headline copy ---
even for the same product.

+-----------------------------------------------------------------+
| **Content Generation Priority**                                 |
|                                                                 |
| Slots marked is_auto_populated = true are filled immediately    |
| after onboarding. Slots with required_for_launch = true block   |
| the store from publishing if empty. Seller-editable slots can   |
| be overridden at any time via the dashboard content editor.     |
+-----------------------------------------------------------------+

**12. Developer Delivery Checklists**

These checklists are required gates before any production deployment.

**12.1 New Store Launch Checklist**

Before a store goes live, verify:

9.  ob_seller_profiles row exists for store_id

10. compute_store_render_config() has been called ---
    re_store_render_config.needs_recompute = false

11. guardrails_passed = true OR guardrail_violations reviewed and
    accepted

12. initialise_store_pages() has been called --- pg_store_pages contains
    at minimum: home, contact, refund_policy, privacy_policy,
    shipping_policy, terms

13. Mood card tokens loaded --- vw_store_config_resolved.config_mode =
    \'intelligence\'

14. RTO automation enabled --- stores.rto_automation_enabled = true

15. At least one product exists and is status = \'published\'

16. stores.gateway_status = \'verified\' OR COD is the only payment
    method

17. ThemeProvider strip test passes for the assigned mood card

**12.2 New Component Entry Checklist**

When adding a new component to the registry:

18. Insert row into cr_components with correct component_id format
    (COMP\_{page}\_{NNN})

19. Insert row(s) into cr_component_pages for each page the component
    can appear on

20. Determine governance_level: default to OPTIONAL unless structural
    analysis confirms FLEXIBLE or LOCKED

21. Set default_state = ACTIVE only if the component should render for
    all stores by default

22. Set mobile_mandatory = true only if conversion analysis confirms
    suppressing it causes measurable mobile drop-off

23. Add activation rules to cr_activation_rules if the component should
    fire conditionally

24. Add archetype override rows to cr_archetype_overrides if the
    component should behave differently by seller identity

25. Add category requirement rows to cr_category_requirements if
    MANDATORY or RECOMMENDED for any category

26. Add content schema rows to ob_content_schema if the component has
    content slots

27. Add zone entry to cr_page_zones if a new zone is being created

28. Run compute_store_render_config() for a test store and verify
    component appears in active_components_all if expected

**12.3 Intelligence Recompute Checklist**

When making changes to the intelligence rules (activation rules,
archetype overrides, category requirements):

29. Test changes on a staging store before production

30. Run compute_store_render_config() on all active stores after rule
    changes

31. Verify guardrails_passed = true on all stores after recompute

32. Review stores where guardrail_violations changed --- investigate if
    unexpected

33. Check that no LOCKED component appears in suppressed_components for
    any store

34. Verify persuasion_sequence_id is populated for stores with complete
    profiles

**12.4 Database Migration Checklist**

When applying schema changes:

35. Never drop or rename columns in vw_store_config or
    vw_store_config_resolved without updating all renderer references

36. Never remove the store_id uniqueness constraint on
    re_store_render_config, ob_seller_profiles, or pg_store_pages

37. Test triggers after any DDL change: trg_evaluate_cod_risk,
    trg_invalidate_render_config, trg_deactivate_prior_overrides,
    trg_guard_locked_override

38. Verify RLS policies are applied to all new tables

39. Run advisors check after DDL: Supabase security and performance
    advisors

**12.5 Monitoring Queries**

Run these queries regularly to detect system health issues:

+-----------------------------------------------------------------+
| \-- Stores with stale render config (needs_recompute = true)    |
|                                                                 |
| SELECT store_id, computed_at, needs_recompute                   |
|                                                                 |
| FROM re_store_render_config                                     |
|                                                                 |
| WHERE needs_recompute = true;                                   |
|                                                                 |
| \-- Stores without ob_seller_profiles (onboarding incomplete)   |
|                                                                 |
| SELECT s.id, s.name, s.created_at                               |
|                                                                 |
| FROM stores s                                                   |
|                                                                 |
| LEFT JOIN ob_seller_profiles p ON p.store_id = s.id             |
|                                                                 |
| WHERE p.store_id IS NULL AND s.is_active = true;                |
|                                                                 |
| \-- Stores with guardrail violations                            |
|                                                                 |
| SELECT store_id, guardrail_violations, computed_at              |
|                                                                 |
| FROM re_store_render_config                                     |
|                                                                 |
| WHERE NOT guardrails_passed;                                    |
|                                                                 |
| \-- High-risk COD orders in last 24h                            |
|                                                                 |
| SELECT id, store_id, total_amount, risk_level,                  |
| meta-\>\'rto_score\' as score                                   |
|                                                                 |
| FROM orders                                                     |
|                                                                 |
| WHERE payment_mode = \'COD\'                                    |
|                                                                 |
| AND risk_level IN (\'high\', \'kill\')                          |
|                                                                 |
| AND created_at \> now() - interval \'24 hours\';                |
+-----------------------------------------------------------------+

**Appendix A: SQL Reference**

Full CREATE TABLE, CREATE FUNCTION, and CREATE TRIGGER statements for
all intelligence layer objects. These are derived from the live Supabase
production database (d2c-core, axtyxzpaoldblpiyfuep).

**A.1 Core Function: compute_store_render_config()**

Full function body --- see Section 3 for annotated walkthrough.

+-----------------------------------------------------------------+
| CREATE OR REPLACE FUNCTION                                      |
| public.compute_store_render_config(p_store_id uuid)             |
|                                                                 |
| RETURNS void LANGUAGE plpgsql AS \$\$                           |
|                                                                 |
| DECLARE                                                         |
|                                                                 |
| prof ob_seller_profiles%ROWTYPE;                                |
|                                                                 |
| pseq ob_persuasion_sequences%ROWTYPE;                           |
|                                                                 |
| v_active_components text\[\] := \'{}\';                         |
|                                                                 |
| v_suppressed_components text\[\] := \'{}\';                     |
|                                                                 |
| v_category_mandatory text\[\] := \'{}\';                        |
|                                                                 |
| v_component_weights jsonb := \'{}\';                            |
|                                                                 |
| v_guardrail_violations text\[\] := \'{}\';                      |
|                                                                 |
| v_guardrails_passed boolean := true;                            |
|                                                                 |
| r_rule RECORD;                                                  |
|                                                                 |
| v_rule_fires boolean;                                           |
|                                                                 |
| BEGIN                                                           |
|                                                                 |
| \-- Phase 1: Load profile                                       |
|                                                                 |
| SELECT \* INTO prof FROM ob_seller_profiles WHERE store_id =    |
| p_store_id;                                                     |
|                                                                 |
| IF NOT FOUND THEN                                               |
|                                                                 |
| RAISE EXCEPTION \'No ob_seller_profiles row found for store_id  |
| %\', p_store_id;                                                |
|                                                                 |
| END IF;                                                         |
|                                                                 |
| \-- Phase 2: Persuasion sequence lookup                         |
|                                                                 |
| IF prof.persuasion_sequence_id IS NOT NULL THEN                 |
|                                                                 |
| SELECT \* INTO pseq FROM ob_persuasion_sequences WHERE id =     |
| prof.persuasion_sequence_id;                                    |
|                                                                 |
| END IF;                                                         |
|                                                                 |
| \-- Phase 3: Initialise from default states                     |
|                                                                 |
| SELECT array_agg(component_id) INTO v_active_components         |
|                                                                 |
| FROM cr_components WHERE default_state = \'ACTIVE\';            |
|                                                                 |
| \-- Phase 4: Fire activation rules (abbreviated --- see         |
| production for full CASE)                                       |
|                                                                 |
| FOR r_rule IN SELECT \* FROM cr_activation_rules ORDER BY       |
| rule_id LOOP                                                    |
|                                                                 |
| \-- \[CASE statement evaluates each activation_input_type\]     |
|                                                                 |
| IF v_rule_fires THEN                                            |
|                                                                 |
| IF r_rule.result_action IN (\'ACTIVATE\',\'REQUIRE\') THEN      |
|                                                                 |
| v_active_components := v_active_components \|\|                 |
| r_rule.component_id;                                            |
|                                                                 |
| ELSIF r_rule.result_action = \'SUPPRESS\' THEN                  |
|                                                                 |
| v_suppressed_components := v_suppressed_components \|\|         |
| r_rule.component_id;                                            |
|                                                                 |
| v_active_components := array_remove(v_active_components,        |
| r_rule.component_id);                                           |
|                                                                 |
| END IF;                                                         |
|                                                                 |
| END IF;                                                         |
|                                                                 |
| END LOOP;                                                       |
|                                                                 |
| \-- Phase 5: Archetype overrides                                |
|                                                                 |
| \-- \[Loop over cr_archetype_overrides for archetype_name OR    |
| cluster\]                                                       |
|                                                                 |
| \-- Phase 6: Category requirements                              |
|                                                                 |
| \-- \[Loop over cr_category_requirements for primary_category\] |
|                                                                 |
| \-- Phase 7: Guardrails (self-healing)                          |
|                                                                 |
| IF NOT (v_active_components @\> ARRAY\[\'COMP_PDP_015\'\]) THEN |
|                                                                 |
| v_guardrail_violations := v_guardrail_violations \|\|           |
| \'VIOLATION: CTA block must exist\';                            |
|                                                                 |
| v_active_components := v_active_components \|\|                 |
| \'COMP_PDP_015\';                                               |
|                                                                 |
| END IF;                                                         |
|                                                                 |
| \-- Phase 8: UPSERT to re_store_render_config                   |
|                                                                 |
| INSERT INTO re_store_render_config ( \... ) VALUES ( \... )     |
|                                                                 |
| ON CONFLICT (store_id) DO UPDATE SET \... ;                     |
|                                                                 |
| END; \$\$;                                                      |
+-----------------------------------------------------------------+

**A.2 Trigger Definitions**

+-----------------------------------------------------------------+
| \-- Invalidate render config when seller profile changes        |
|                                                                 |
| CREATE TRIGGER trg_invalidate_render_config                     |
|                                                                 |
| AFTER UPDATE ON ob_seller_profiles                              |
|                                                                 |
| FOR EACH ROW EXECUTE FUNCTION invalidate_render_config();       |
|                                                                 |
| \-- RTO scoring on order insert                                 |
|                                                                 |
| CREATE TRIGGER trg_evaluate_cod_risk                            |
|                                                                 |
| BEFORE INSERT ON orders                                         |
|                                                                 |
| FOR EACH ROW EXECUTE FUNCTION evaluate_cod_risk_on_order();     |
|                                                                 |
| \-- Deactivate prior overrides before new override insert       |
|                                                                 |
| CREATE TRIGGER trg_deactivate_prior_overrides                   |
|                                                                 |
| BEFORE INSERT ON re_seller_overrides                            |
|                                                                 |
| FOR EACH ROW EXECUTE FUNCTION fn_deactivate_prior_overrides();  |
|                                                                 |
| \-- Block LOCKED component overrides                            |
|                                                                 |
| CREATE TRIGGER trg_guard_locked_override                        |
|                                                                 |
| BEFORE INSERT ON re_seller_overrides                            |
|                                                                 |
| FOR EACH ROW EXECUTE FUNCTION                                   |
| fn_guard_locked_component_override();                           |
+-----------------------------------------------------------------+

**A.3 View Definitions (abbreviated)**

+-----------------------------------------------------------------+
| \-- vw_store_config: joins stores, profiles, render config,     |
| design tokens                                                   |
|                                                                 |
| \-- Key COALESCE pattern for backward compatibility:            |
|                                                                 |
| COALESCE(r.commerce_architecture,                               |
|                                                                 |
| CASE (s.theme_config -\>\> \'architecture\')                    |
|                                                                 |
| WHEN \'product-engine\' THEN \'product_engine\'                 |
|                                                                 |
| WHEN \'story-first\' THEN \'story_first\'                       |
|                                                                 |
| WHEN \'catalog-first\' THEN \'catalog_first\'                   |
|                                                                 |
| ELSE \'product_engine\'                                         |
|                                                                 |
| END) AS commerce_architecture,                                  |
|                                                                 |
| \-- config_mode derivation:                                     |
|                                                                 |
| CASE                                                            |
|                                                                 |
| WHEN r.store_id IS NOT NULL AND p.store_id IS NOT NULL THEN     |
| \'intelligence\'                                                |
|                                                                 |
| WHEN p.store_id IS NOT NULL THEN \'profile_only\'               |
|                                                                 |
| ELSE \'legacy\'                                                 |
|                                                                 |
| END AS config_mode                                              |
|                                                                 |
| \-- vw_store_config_resolved: adds seller overrides and         |
| extended tokens                                                 |
|                                                                 |
| \-- resolved_active_components subquery applies                 |
| ACTIVATE/SUPPRESS overrides                                     |
|                                                                 |
| \-- from cr_component_overrides on top of intelligence baseline |
+-----------------------------------------------------------------+

**A.4 Key Table: re_store_render_config (abbreviated CREATE)**

+-----------------------------------------------------------------+
| CREATE TABLE public.re_store_render_config (                    |
|                                                                 |
| store_id uuid PRIMARY KEY REFERENCES stores(id),                |
|                                                                 |
| commerce_architecture text NOT NULL                             |
|                                                                 |
| CHECK (commerce_architecture IN                                 |
| (\'product_engine\',\'story_first\',\'catalog_first\')),        |
|                                                                 |
| pdp_component_sequence text\[\] NOT NULL DEFAULT \'{}\',        |
|                                                                 |
| above_fold_components text\[\] NOT NULL DEFAULT \'{}\',         |
|                                                                 |
| active_components_all text\[\] NOT NULL DEFAULT \'{}\',         |
|                                                                 |
| suppressed_components text\[\] NOT NULL DEFAULT \'{}\',         |
|                                                                 |
| component_weights jsonb NOT NULL DEFAULT \'{}\',                |
|                                                                 |
| guardrails_passed boolean DEFAULT false,                        |
|                                                                 |
| guardrail_violations text\[\] DEFAULT \'{}\',                   |
|                                                                 |
| needs_recompute boolean DEFAULT false,                          |
|                                                                 |
| computed_at timestamptz NOT NULL DEFAULT now()                  |
|                                                                 |
| );                                                              |
|                                                                 |
| ALTER TABLE re_store_render_config ENABLE ROW LEVEL SECURITY;   |
+-----------------------------------------------------------------+

**A.5 Key Table: re_seller_overrides (abbreviated CREATE)**

+-----------------------------------------------------------------+
| CREATE TABLE public.re_seller_overrides (                       |
|                                                                 |
| id uuid PRIMARY KEY DEFAULT gen_random_uuid(),                  |
|                                                                 |
| store_id uuid NOT NULL REFERENCES stores(id),                   |
|                                                                 |
| component_id text NOT NULL,                                     |
|                                                                 |
| override_type text NOT NULL                                     |
|                                                                 |
| CHECK (override_type IN                                         |
| (\'ACTIVATE\',\'SUPPRESS\',\'REORDER\',\'RESET\')),             |
|                                                                 |
| zone_position integer,                                          |
|                                                                 |
| system_recommendation text NOT NULL                             |
|                                                                 |
| CHECK (system_recommendation IN                                 |
| (\'AGREES\',\'CAUTION\',\'ADVISES_AGAINST\')),                  |
|                                                                 |
| system_reason text,                                             |
|                                                                 |
| actioned_at timestamptz NOT NULL DEFAULT now(),                 |
|                                                                 |
| actioned_by uuid REFERENCES profiles(id),                       |
|                                                                 |
| is_active boolean NOT NULL DEFAULT true                         |
|                                                                 |
| );                                                              |
|                                                                 |
| ALTER TABLE re_seller_overrides ENABLE ROW LEVEL SECURITY;      |
+-----------------------------------------------------------------+

