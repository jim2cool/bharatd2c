# 📘 EASY D2C — CORE SYSTEM ARCHITECTURE DOCUMENTATION

**Version**: 1.0  
**Status**: Authoritative Core Specification  
**Applies To**: Rendering Engine, Onboarding Engine, Component Registry, Preset System

---

## 1️⃣ SYSTEM PHILOSOPHY

Easy D2C is not a theme builder. It is a **Conversion Architecture Engine**.

The system is based on four strictly separated layers:
1. **Commerce Architecture** (Structural Core)
2. **Seller Modifier** (Behavioral Layer)
3. **Category Modifier** (Content Bias Layer)
4. **Style Preset** (Design Token Layer)

### Core Principle
- **Structure** is immutable.
- **Behavior** is adjustable.
- **Expression** is token-based.
- **Lower layers** must never mutate upper layers.

---

## 2️⃣ COMMERCE ARCHITECTURES (Public: “Themes”)

Internally called `CommerceArchitecture`. Each architecture defines a structural schema. Schemas must be declarative and not duplicated per preset.

### 2.1 Product Engine
**Purpose**: High-intensity PDP-led conversion structure.

**Required Structural Zones (PDP)**:
- ├── Gallery Zone
- ├── Conversion Zone
- │     ├── Title
- │     ├── Reviews
- │     ├── Highlights
- │     ├── Offer Cluster
- │     ├── Variant Selector
- │     ├── Quantity / Qty Breaks
- │     ├── EDD Block
- │     ├── CTA Block
- │     ├── Trust Visual
- │     ├── Trust Bar
- ├── Description Zone
- ├── Social Proof Zone
- ├── Cross-Sell Zone

**Invariants**:
- Offer Cluster must remain grouped.
- CTA Block must exist.
- Sticky CTA must exist on mobile.
- Reviews must appear above Offer Cluster.
- Trust must appear below CTA.

### 2.2 Story-First
**Purpose**: Brand narrative-led commerce.

**Structural Zones (PDP)**:
- Gallery
- Title
- Reviews
- Price
- Variant
- CTA
- Story Section
- Features
- FAQ
- Testimonials

### 2.3 Catalog-First
**Purpose**: Multi-product browsing structure.

**Invariants**:
- Filter system mandatory.
- Navigation must support multi-category.
- Grid-first logic enforced.

---

## 3️⃣ SELLER MODIFIER

Adjusts conversion intensity only.

**Available seller types**:
- Beginner
- Testing Products
- Growing Brand
- Established Brand

**Allowed Parameter Adjustments**:
- `urgencyLevel`: low | medium | high
- `socialProofWeight`: light | medium | heavy
- `trustDensity`: light | medium | heavy
- `ctaProminence`: balanced | dominant
- `densityScale`: compact | balanced | airy
- `codBias`: boolean

**Forbidden**:
- Zone reordering
- CTA removal
- Offer cluster separation
- Sticky behavior removal

---

## 9️⃣ ACCESS POLICY

The system is **fully unlocked from the beginning**. All features, horizontal modules, and architectural capabilities defined in this specification are available to all store owners immediately upon creation.

- No progressive feature gates.
- No "premium-only" architectural zones.
- All vertical-specific modules (Size Guides, Ingredient Blocks, etc.) are available for manual activation regardless of the initial category selection.

**Limitation**: While all modules are available, users are still prevented from violating structural zones or DOM reordering that breaks conversion invariants.

---

## 4️⃣ CATEGORY MODIFIER

Mandatory during onboarding. Each category must activate required modules.

**Available category types**:
- Fashion & Apparel
- Beauty & Personal Care
- Electronics & Gadgets
- Home & Kitchen
- Health & Fitness
- Spiritual & Lifestyle
- Furniture & Large Items
- Food & Consumables
- Dropshipping (Direct from Supplier)
- Multi-Category Store

### 4.1 Category → Required Component Mapping

| Category | Required Modules |
| :--- | :--- |
| **Fashion & Apparel** | Size Grid Selector, Size Guide Modal, 4:5 Image Ratio, Fabric Details, Care Instructions, Swatch Variants, Exchange Trust Messaging |
| **Beauty & Personal Care** | Ingredient Block, How-To-Use Section, Before/After Slider, Safety Badge, FAQ Expanded by Default |
| **Electronics & Gadgets** | Specs Table, Comparison Toggle, Warranty Badge, EMI Block, Feature Icon Grid |
| **Home & Kitchen** | Dimensions Block, Installation Guide, Demo Gallery, Delivery Emphasis Block |
| **Health & Fitness** | Dosage Instructions, Certification Badge, Subscription Option, FSSAI Display |
| **Spiritual & Lifestyle** | Meaning/Benefits Section, Ritual Guide, Authenticity Block, Emotional Story Block |
| **Furniture & Large Items** | Dimension Visual, Delivery Timeline, Installation Info, Financing Option |
| **Food & Consumables** | Nutritional Table, Shelf Life Display, Ingredients Block, Storage Instructions, FSSAI Compliance |
| **Dropshipping** | Stock Counter (Scarcity), Shipping Timeline, Real-time Sales Pulse, Direct Trust Badges |
| **Multi-Category Store** | Mega Menu, Advanced Filters, Category Banners, Collection Logic |

---

## 5️⃣ STYLE PRESETS (Design Token Layer)

**Standard Presets**:
- **Minimal**: standard sans, clean radius, soft shadows.
- **Bold**: `Anton` (Heavy Display), sharp radius, high contrast.
- **Organic**: `Playfair Display` (Serif) / Soft Sans, pill radius, earth tones.
- **Tech**: `JetBrains Mono`, dark mode, neon accents, grid lines.
- **Premium**: `Playfair Display`, elegant serif, soft elevation.
- **Feminine**: `Dancing Script` (Cursive), pastel palettes, soft motion.
- **Gen-Z**: `Anton` / Expressive type, brutalist touches, high motion.
- **Marketplace**: Functional sans, dense information, high utility.

**Allowed Token Scope**:
- Color Tokens
- Typography Tokens (Heading, Body, Heavy, Cursive, Mono)
- Radius Scale
- Elevation Scale
- Shadow Intensity
- Motion Profile
- Density Multiplier

**Forbidden**:
- Changing layout schema
- Reordering DOM
- Removing modules
- Modifying mobile stacking

---

## 6️⃣ LAYER 5: "ALIVE" ENGINE (MOTION)

**Purpose**: High-performance, physics-based motion primitives to enhance perceived quality without compromising TBT (Total Blocking Time).

**Core Components**:
- **InteractionProvider**: Manages global motion preferences (Reduced Motion) and device capabilities.
- **Motion Primitives**:
    - `FadeIn`: Staggered entry for lists and clusters.
    - `ScaleTap`: Tactile feedback for interactive elements (0.95 scale).
    - `Magnetic`: Cursor awareness for primary CTAs.
    - `Parallax`: Depth cues for hero sections and media galleries.
    - `Shimmer`: Attention-guiding effects for high-priority actions.

**Invariants**:
- Motion must respect `prefers-reduced-motion`.
- Layout transitions (`layoutId`) must be scoped to avoid global reflows.
- Heavy animations (shaders, canvas) must be lazy-loaded.

---

## 7️⃣ LAYER 6: "ADAPTIVE" ENGINE (INTELLIGENCE)

**Purpose**: Real-time behavioral adaptation to maximize conversion probability.

**Core Components**:
- **SignalStore**: Tracks user signals (velocity, idle time, rage clicks, scroll depth) in a lightweight, ref-based store.
- **SmartPrompts**: Adaptive UI nudges (Free Shipping, Support, Scarcity) triggers by specific behavioral signals.
- **BehavioralContext**: Broadcasts user intent (High Intent, Browser, Bouncer) to the rest of the app.

**Logic**:
- **High Velocity** → Trigger "Fast Checkout" / "Buy Now".
- **High Dwell / Scroll** → Trigger "Social Proof" / "Reviews".
- **Exit Intent / Idle** → Trigger "Scarcity" / "Discount".

---

## 8️⃣ RENDERING ENGINE FLOW

1. **Onboarding Input** → Create StoreConfig
2. **Load Commerce Architecture Schema**
3. **Apply Seller Modifier**
4. **Apply Category Modifier** (Bind Required Modules)
5. **Inject Design Tokens** (Style Preset)
6. **Apply Density & Motion**
7. **Structural Validation (Guardrails)**
8. **Render DOM**

---

## 9️⃣ STRUCTURAL GUARDRAILS (NON-NEGOTIABLE)

The system **must assert**:
- CTA exists
- Offer cluster remains grouped
- Sticky CTA active (Product Engine)
- Above-the-fold contains: Title, Reviews, Offer Cluster, CTA
- Required category modules render
- Presets do not alter hierarchy

Violations must throw error or block render.

---

## 🔟 ARCHITECTURAL RED FLAG CHECKLIST

Before merging changes, validate:
- ❌ Are presets affecting structure?
- ❌ Is layout duplicated per preset?
- ❌ Are modules hardcoded inside pages?
- ❌ Is mobile logic duplicated?
- ❌ Are categories modifying zone order?

---

**FINAL DECLARATION**
Easy D2C must remain: **Schema-driven**, **Deterministic**, **Layer-separated**, **Mobile-first enforced**, **Conversion-protected**.
