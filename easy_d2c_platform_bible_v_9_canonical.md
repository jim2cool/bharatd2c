# Bharat D2C Platform Bible — Version 9 (Canonical)

> **Status:** Foundational • Reconciliatory • Vision-aligned
>
> **Purpose of v9:** Capture *everything learned*, lock the platform’s true USP, align all implementation to the PDP North Star, and provide a single, ready reference for architecture, file system, and data schema. This is the last *foundational* Bible before scale.

---

## How to Read This Document

- **This Bible is the single source of truth for implementation.**
- **The PDP North Star** (separate document) is the single source of truth for *selling & conversion philosophy*.
- If there is ever a conflict:
  - **North Star defines *what* must be achieved**
  - **This Bible defines *how* we implement it**
- Any change that violates a locked doctrine **must update this Bible AND the GitHub repo together**.

---

# SECTION A — PLATFORM IDENTITY & NON‑NEGOTIABLE DOCTRINES

## A1. What Bharat Is

Bharat is **not**:
- a website builder
- a theme marketplace
- an app-store ecosystem

Bharat **is**:
- an **India‑first selling system** for first‑time and early D2C sellers
- a platform where **the website must never be the reason a seller fails**
- a system where **conversion logic is platform‑owned, not seller‑owned**

> Seller promise: *“This setup is sales‑focused by default. You only worry about ads.”*

---

## A2. India‑First Seller Reality (Locked)

Bharat is designed for the real constraints of Indian D2C:
- COD dependence and RTO risk
- Return anxiety
- Low technical confidence
- Low margins
- Ad‑driven traffic

These constraints are **inputs to system design**, not edge cases.

---

## A3. The Seller Anxiety Problem (Locked Insight)

Seller anxiety historically comes from:
- too many choices
- too many apps
- conflicting “best practices”
- no sure‑shot default

Bharat’s response:
- opinionated defaults
- pre‑installed native systems
- minimal configuration

---

## A4. PDP Conversion North Star (Authoritative Reference)

Bharat maintains a separate, vision‑locked document:

**“Bharat PDP — Ultimate Conversion Package (North Star)”**

Governance:
- North Star defines the canonical PDP buyer flow and conversion clusters
- This Bible tracks *implementation against it*
- PDP flow, hierarchy, and conversion logic are **not seller‑configurable**

---

# SECTION B — PLATFORM ARCHITECTURE & OWNERSHIP

## B1. Backend Source of Truth (Locked)

- **Supabase** is the backend source of truth
- All business data flows through Supabase
- No secondary shadow databases

---

## B2. Frontend Architecture (Locked)

- Next.js App Router
- Server‑first rendering (SSR / ISR where applicable)
- Client components used intentionally

---

## B3. Separation of Concerns (Critical Doctrine)

The platform is explicitly split into:

1. **Conversion System**
   - PDP flow
   - Trust, urgency, offers, AOV
   - Defined by the North Star

2. **Presentation Layer (Bharat Base)**
   - Visual language
   - Components
   - Layout and spacing

Presentation may evolve. Conversion logic does not.

---

# SECTION C — BHARAT BASE (DEFAULT PRESENTATION LAYER)

## C1. What Bharat Base Is (Locked)

Bharat Base is:
- the default skin
- the default component system
- the default UX patterns
- the default layout language

It ships **automatically** for all stores.

---

## C2. What Bharat Base Is NOT

- not optional
- not seller‑swappable
- not conversion‑defining

---

## C3. Future Themes / Skins (Hard Lock)

Future themes may:
- change colors
- change typography
- change spacing

They may **never** change:
- PDP flow
- conversion clusters
- trust / urgency placement
- offer behavior

---

# SECTION D — PDP SYSTEM (IMPLEMENTATION VIEW)

## D1. Historical Learning (Preserved)

Early PDP work treated PDP as:
- a page
- a collection of sections

This led to:
- UI churn
- duplicated responsibilities
- confusion between layout and conversion

This learning is preserved as scar tissue.

---

## D2. Current Reality (Locked)

- PDP = **implementation surface of the PDP Ultimate Conversion Package**
- PDP flow is dictated by the North Star
- Sellers do not rearrange PDP logic

---

## D3. PDP‑Basic (Foundational LP)

- PDP‑Basic is the default landing page
- Implements all core conversion clusters
- Visual evolution is allowed
- Structural deviation is not

---

## D4. PDP Implementation Status (v9)

- Conversion clusters: **Defined & locked**
- UI: **Under active refinement using Bharat Base + shadcn**
- Native systems: **Phased rollout**

Any deviation requires a Bible update.

---

# SECTION E — NATIVE GROWTH SYSTEMS (APP REPLACEMENT STRATEGY)

## E1. Philosophy (Locked USP)

Bharat replaces Shopify apps with **native systems**.

- No widgets
- No embeds
- No app marketplace

---

## E2. Canonical Native Systems (Referenced)

The following systems are **pre‑installed**:
- Trust system
- Reviews system
- Urgency & scarcity engine
- Discounts & offers
- Bundles & AOV boosters
- Popups & nudges
- SEO & structured data

Details live in the PDP North Star.

---

# SECTION F — ADMIN PHILOSOPHY & SCOPE

## F1. What Admin Allows

- Business intent inputs
- High‑level toggles (offers on/off, bundles on/off)

---

## F2. What Admin Explicitly Does NOT Allow

- Section reordering
- App‑style configuration
- CRO tinkering

Admin protects sellers from over‑configuration.

---

# SECTION G — EXECUTION PHASES & LOCKS

## G1. Locked

- Bharat Base as default
- PDP North Star authority
- Platform‑owned conversion logic

---

## G2. Phased

- CRO experiments
- AI content generation
- Advanced analytics
- Vertical‑specific tuning

---

# SECTION H — SCAR TISSUE & LEARNINGS (PRESERVED)

> This section exists to **retain institutional memory**. Nothing here is aspirational. These are *things we learned the hard way* and must never forget.

## H1. PDP Refactor Lessons (Critical)

**What happened:**
- PDP was initially implemented as a page composed of independent sections
- Each section tried to own conversion responsibility
- Resulted in duplication (price, trust, CTA appearing multiple times)

**Learning:**
- PDP sections cannot be independent
- Conversion elements are psychologically coupled

**Locked Insight:**
> PDP must be built as **conversion clusters**, not modular sections.

---

## H2. Sections vs Clusters (Foundational Insight)

**False assumption (early):**
- Sections = reusable building blocks

**Reality discovered:**
- Sections fracture responsibility
- Clusters align with buyer psychology

**Canonical Clusters (locked):**
1. Hero (recognition)
2. Highlights (value clarity)
3. Conversion (price + trust + CTA)
4. Proof (reviews)
5. Content (rationalisation)

Sections may exist internally, but **clusters own outcomes**.

---

## H3. UI-First Thinking Pitfall

**Mistake made:**
- Early focus on layout, spacing, polish
- Assumed better UI = better conversion

**Outcome:**
- Repeated rework
- No convergence on "correct" PDP

**Learning:**
> Conversion logic must be locked **before** UI polish.

This directly led to the creation of the **PDP Ultimate Conversion Package (North Star)**.

---

## H4. App Replacement Realisation

**Early mindset:**
- Replicate Shopify flexibility

**Reality:**
- App ecosystems create anxiety, cost, and fragility

**Locked Decision:**
> Bharat will replace apps with **native systems**, not extensibility points.

This applies to:
- Trust
- Reviews
- Urgency
- Discounts & offers
- Bundles & AOV
- SEO & schema

---

## H5. Seller-Controlled Layouts Are Harmful

**Observed issue:**
- Sellers rearranging sections based on advice
- No consistency across stores

**Learning:**
> Sellers should control **business intent**, not **conversion mechanics**.

This directly informed:
- Admin scope restrictions
- Platform-owned PDP flow

---

## H6. Why Bharat Base Had to Become Canonical

**Problem:**
- Treating Bharat Base as "just a theme" allowed drift

**Resolution:**
- Bharat Base elevated to **default presentation layer**
- Themes relegated to cosmetic skins

This prevents future erosion of conversion discipline.

---

This section is intentionally candid. These lessons are **non-negotiable memory**.

---

# SECTION I — WHAT BHARAT WILL NEVER BECOME

- App marketplace
- Page builder
- Theme store race
- Configuration‑heavy platform

---

# SECTION J — FILE SYSTEM REFERENCE (v9 SNAPSHOT)

> **Authoritative snapshot. Any change requires Bible + GitHub update.**

```
app/
├── (storefront)/
│   ├── products/[slug]/page.tsx
│   ├── collections/[slug]/page.tsx
│   ├── cart/
│   ├── checkout/
│   └── order-success/
│
├── admin/
│   ├── page.tsx
│   ├── products/
│   ├── orders/
│   ├── stores/
│   └── upload-product-image/
│
├── theme/
│   └── easy-base/
│       ├── pdp/
│       │   ├── PDPBasic.tsx
│       │   ├── PDPResolver.tsx
│       │   ├── sections/
│       │   └── components/
│       ├── shared/
│       └── tokens/
│
├── api/
│   ├── orders/create
│   └── admin/
│
lib/
├── supabase-browser.ts
├── supabase-server.ts
├── getActiveStore.client.ts
└── getActiveStore.server.ts
```

---

# SECTION K — SUPABASE SCHEMA REFERENCE (v9 SNAPSHOT)

> **Note:** This reflects current known usage. Any schema change requires Bible + GitHub update.

### Core Tables

- `stores`
  - id
  - name
  - status

- `products`
  - id
  - store_id
  - title
  - slug
  - price / selling_price (variant‑aware)
  - mrp
  - content_markup
  - pdp_template

- `product_variants`
  - id
  - product_id
  - price
  - mrp
  - inventory

- `orders`
  - id
  - store_id
  - status
  - total_amount
  - created_at

- `order_items`
  - order_id
  - product_id
  - variant_id
  - qty
  - price

(Reviews, trust, urgency tables are **planned** and must be added explicitly when implemented.)

---

# FINAL GOVERNANCE RULE (VERY IMPORTANT)

If any of the following change:
- PDP flow
- Conversion logic ownership
- Bharat Base defaults
- File structure
- Supabase schema

👉 **The Bible must be updated AND the GitHub repo must be updated in the same session.**

No silent drift allowed.

---

**End of Bible v9 (Canonical)**



---

# SECTION L — SYSTEM ANATOMY (AUTHORITATIVE, DETAILED)

> This section defines the **exact anatomy of the Bharat system**. It exists to prevent future ambiguity, over-engineering, or philosophical drift.

---

## L1. Conceptual Stack (Top → Bottom)

1. **North Star (Conversion Truth)**
   - Buyer psychology
   - Conversion clusters
   - Outcome ownership

2. **Platform Doctrine (Bible)**
   - What is allowed
   - What is forbidden
   - What is owned by platform vs seller

3. **System Anatomy (This Section)**
   - Sections, components, modules
   - Reordering rules
   - Page ownership rules

4. **Presentation Layer (Bharat Base)**
   - Visual tokens
   - Components
   - Skins

---

## L2. PDP Anatomy (Canonical)

### L2.1 Conversion Clusters (Non‑Negotiable Order)

These clusters are **locked in order** and **cannot be reordered**.

1. Hero (Recognition)
2. Highlights (Value Clarity)
3. ConversionBlock (Decision)
4. Proof (Anxiety Reduction)
5. Content (Rationalisation)

This order is dictated by buyer psychology and validated D2C patterns.

---

### L2.2 Sections (Controlled Flexibility)

Sections are **implementation units inside clusters**.

Rules:
- Sections may be reordered **within the same cluster only**
- Sections may not move across clusters
- Sections may be toggled on/off by platform rules or seller intent

Example:
- Multiple trust rows inside ConversionBlock
- Multiple proof layouts inside Proof cluster

This answers your question: **yes, limited reordering is allowed — but safely bounded**.

---

## L3. Components vs Modules (Hard Boundary)

### Components
- Purely visual
- Stateless or local state only
- Never own business logic

Examples:
- Price display
- Star rating
- Badge
- Button

### Modules
- Logic‑bearing
- Platform‑owned
- Can span sections

Examples:
- Pricing engine
- Trust engine
- Urgency engine
- Bundle engine

> **Rule:** Components render. Modules decide.

---

## L4. Wireframe Rules (Textual, Authoritative)

Wireframes are **implicit**, not designer‑owned.

Rules:
- ConversionBlock is always visually contiguous
- CTA never appears without trust
- Price never appears without context (savings / offer)
- Sticky CTA mirrors ConversionBlock, not duplicates logic

These rules prevent layout drift.

---

## L5. Pages — Ownership & Flexibility

### PDP
- Platform‑owned
- Seller cannot freely design
- Only intent‑level toggles apply

### Other Pages (Collections, Static, Landing)

Yes — **users may build pages**, but with constraints:

Allowed:
- Pre‑defined page templates
- Section toggles
- Content editing

Not allowed:
- Arbitrary page builders
- Drag‑drop chaos
- Conversion logic override

This keeps flexibility without re‑introducing anxiety.

---

## L6. Themes, Skins & Tokens (Final Model)

- **Bharat Base** = default system skin
- **Themes** = cosmetic overlays
- **Tokens** = colors, spacing, typography

Tokens are the **only** customization surface.

---

## L7. Verticals (Overlay Model)

Verticals do **not** change structure.
They change **defaults and emphasis**.

Examples:
- Dropshipping → Highlights + Proof earlier
- High AOV → Trust + Proof heavier
- COD‑heavy → COD reassurance everywhere

Verticals are **configuration profiles**, not templates.

---

# SECTION M — PRICING PHILOSOPHY & REASON TO WIN

## M1. Core Reason to Win (Locked)

**Ultimate Conversion Package × Ultra‑Low Cost**

Bharat wins by:
- Collapsing 10–20 Shopify apps into native systems
- Eliminating recurring SaaS spend
- Delivering conversion by default

---

## M2. Pricing Doctrine

- ₹199 base plan philosophy
- Cost must never scale with complexity
- Conversion capability is not a premium upsell

---

## M3. What Is Monetised (Later)

- Scale
- Advanced analytics
- AI workflows
- Enterprise needs

Conversion fundamentals remain accessible.

---

# SECTION N — SCHEMA & FILE SYSTEM GOVERNANCE

## N1. Living Document Rule

This Bible is a **living document**.

If any of the following change:
- File structure
- Supabase schema
- Conversion ownership
- Pricing doctrine

Then:
1. Bible must be updated
2. GitHub repo must be updated
3. Change must be explicitly logged

---

## N2. Verification Method

- File structure verified via repo
- Supabase schema verified via SQL / migrations
- Manual memory is insufficient.

## N3. Change Logging & Versioning Discipline

Every structural change must be explicitly recorded.

What qualifies as a structural change

File / folder additions, deletions, or moves

Supabase table or column changes

PDP flow or cluster changes

Pricing doctrine changes

Admin capability changes

Mandatory steps when a structural change occurs

Update Bible (new version or addendum)

Update GitHub repository

Mention the change explicitly in the Bible under:

“What changed”

“Why it changed”

“What is now locked”

No undocumented evolution is allowed.

## N4. GitHub as Recoverable Snapshot

The GitHub main branch must always represent a fully recoverable system state.

Rules:

No half-working commits

No experimental hacks merged into main

Features are committed only when:

Visually complete and

Functionally stable and

Aligned with Bible doctrine

If context is lost:

Restore from main

Resume using the latest Bible version

## N5. Supabase as Single Data Truth

Supabase is the only authoritative data source.

Rules:

No duplicate business logic in frontend

No shadow schemas

No implicit columns

Every new table or column must be:

Justified in the Bible

Mapped to a platform system

Versioned intentionally

## SECTION O — EXECUTION GUARANTEES & SAFETY RAILS
## O1. Scope Control Rule

Only one surface may be worked on at a time:

PDP

Admin

Checkout

Onboarding

Payments

Inventory

Analytics

Cross-surface work requires explicit intent and documentation.

## O2. No Trial-and-Error Loops

When errors occur:

Identify root cause

Fix once

Confirm fix

Move on

Repeated guessing is treated as a failure mode.

## O3. Default Assumptions (Locked)

Unless explicitly overridden:

All storefront queries filter status = 'published'

Supabase is backend source of truth

Bharat Base is default theme

Target user = first-time Indian D2C seller

## O4. Backward Compatibility Bias

Changes must prefer:

Migration over breakage

Explicit deprecation over silent removal

Safety over speed

## SECTION P — FUTURE EXTENSIONS (NON-BINDING)

This section records ideas, not commitments.

Examples:

AI-generated PDP content

Auto image enhancement

Smart bundle creation

Vertical-specific intelligence

CRO experimentation engine

These are:

Not active

Not promised

Not foundational

Implementation requires explicit Bible update.

## SECTION Q — FINAL LOCK STATEMENT

This document represents the canonical foundation of the Bharat D2C Platform as of Bible v9.

Any work done after this point must:

Align with this document

Align with the PDP North Star

Update both documentation and code together

If unsure:

Pause

Ask

Do not assume

END OF BIBLE v9 (CANONICAL)

## 📘 BIBLE ADDENDUM V9.1 — ULTIMATE PDP DEVELOPMENT CHECKLIST & PHASE MAP

Applies to: Bharat Base Theme → PDP
North Star: Bharat PDP – Ultimate Conversion Package
Status: Phase 1 (Foundation) — IN PROGRESS, NOT LOCKED

🎯 ULTIMATE PDP GOAL (LOCKED)

The Ultimate PDP is not a page.
It is a schema-driven conversion engine that:

Is mobile-first

Is Shopify-grade, not marketplace-style

Uses backend schema as source of truth

Supports:

COD & Prepaid

Urgency

AOV expansion

Bundles & combos

Is theme-controlled, not hardcoded

🧱 PDP BUILD PHASES (CANONICAL)
PHASE 0 — SCHEMA READINESS

No UI work without this

Checklist:

 Products schema audited

 Variants schema audited

 Stores schema audited

 Existing usable fields identified

 Gaps identified (offers, prepaid, bundles)

Status: ✅ COMPLETE

PHASE 1 — FOUNDATION (LAYOUT + CORE FLOW)

Make it render correctly on desktop & mobile

Phase 1 Scope

Layout shell

Image gallery

Pricing block

Core CTAs

Mobile responsiveness

Phase 1 Checklist

Layout

 Desktop 2-column layout

 Mobile single-column layout

 Visual rhythm & spacing finalised ❌

 Theme spacing tokens enforced ❌

Image Gallery

 Desktop thumbnails

 Mobile swipe

 Mobile dots + arrows fully polished ❌

 Gallery feels Shopify-grade ❌

Pricing

 Price + MRP wired

 Correct ₹ hierarchy ❌

 Discount % visual balance ❌

 “Inclusive of all taxes” label ❌

 Savings clarity (“You save ₹X”) ❌

Ratings

 Rating value wired

 Exact decimal star rendering (4.3 ≠ 4) ❌

 Consistent star UI ❌

CTAs (Critical)

Desktop:

 Add to Cart

 Order Now – COD

 Buy Now – Pay Online (inactive)

Mobile:

 Condensed single-row CTA ❌

 Add to Cart = icon button ❌

 COD + Pay Online = equal buttons ❌

 Sticky CTA appears only after scroll ❌

Button Logic

 Add to Cart reliably works ❌

 Order Now COD wired correctly ❌

 Pay Online visible when enabled ❌

Phase 1 Status

⚠️ IN PROGRESS — NOT LOCKED

PHASE 2 — CONVERSION INTELLIGENCE

Make the PDP persuade

Checklist:

 Urgency cluster

Low stock

“Selling fast”

 AOV cluster

Free shipping threshold

Progress bar

 Prepaid incentive logic

 Schema-driven offers

Status: ❌ NOT STARTED

PHASE 3 — OFFERS, BUNDLES & COMBOS

Increase order value

Checklist:

 Bundle schema

 Combo pricing UI

 “Frequently bought together”

 Quantity-based discounts

Status: ❌ NOT STARTED

PHASE 4 — CONTENT & TRUST

Reduce doubt

Checklist:

 Trust badge strip (icons)

 Shipping / returns reassurance

 Testimonials polish

 FAQ accordion (H2 → accordion)

 “Loved by customers” section

Status: ❌ NOT STARTED

PHASE 5 — POLISH & THEME CONTROL

Make it feel premium

Checklist:

 Consistent spacing scale

 Iconography standardised

 Microcopy tuned

 Animation restraint

 Theme overrides documented

Status: ❌ NOT STARTED

🧩 PDP FILE RESPONSIBILITY MAP (LOCKED)

PDPLayout.tsx
Layout, spacing, sticky behavior

PDPResolver.tsx
Data wiring, variant resolution, cluster order

ImageGallery.tsx
Media UX (desktop vs mobile)

HeroBlock.tsx
Title, rating, pricing intro

ConversionBlock.tsx
Price, CTAs, urgency, AOV, offers

cart.ts
Cart integrity (must not silently fail)

📍 CURRENT POSITION (EXPLICIT)

We are in PHASE 1 — FOUNDATION

Layout exists but not locked

Mobile CTA system broken

Pricing hierarchy weak

Button logic inconsistent

Phase 2+ features not started

👉 Do NOT move to Phase 2 until Phase 1 is fully locked.

🚨 GOVERNANCE NOTE (IMPORTANT)

Once Phase 1 is locked:

PDP layout structure becomes non-negotiable

All future work happens inside clusters

Bible & GitHub must be updated together

No silent drift allowed.


## Yes — **we absolutely should add a separate, explicit schema addendum**.
This is important for **future safety, onboarding, and zero rework**.

Below is a **SECOND ADDENDUM** you should append **after** the PDP checklist addendum in **Bible v9**.

---

# 📘 **BIBLE ADDENDUM V9.2 — PDP SCHEMA EXTENSIONS & CONVERSION DATA MODEL**

> **Purpose:**
> Document all PDP-related schema that exists, was extended, or is planned
> Ensure PDP remains **schema-driven, not UI-driven**
> Prevent silent coupling between UI and assumptions

---

## 🎯 PRINCIPLES (LOCKED)

* PDP **must not invent data**
* PDP **must gracefully degrade** if schema data is missing
* UI clusters **read schema**, never hardcode logic
* New schema is added **only when conversion logic demands it**

---

## 1️⃣ CONFIRMED EXISTING SCHEMA (IN USE)

### 🟩 `products` (core PDP entity)

Used directly by PDP:

* `id`
* `store_id`
* `title`
* `slug`
* `price`
* `mrp`
* `images[]`
* `highlights[]`
* `content_markup`
* `rating`
* `review_count`
* `testimonials (jsonb)`
* `cod_allowed`
* `buy_now_only`
* `qty`
* `location`
* `seo_title`
* `seo_description`

**Status:** ✅ Stable, PDP already consumes these

---

### 🟩 `product_variants`

* `id`
* `product_id`
* `title`
* `price`
* `mrp`
* `inventory`
* `is_default`
* `status`

**PDP rule**

* PDPResolver selects default variant
* Inventory-driven urgency reads from here

**Status:** ✅ Stable

---

### 🟩 `stores`

* `id`
* `slug`
* `domain`
* `cod_enabled`
* `buy_now_only_default`
* `active_theme_id`

**PDP rule**

* Store-level defaults override product where applicable

**Status:** ✅ Stable

---

## 2️⃣ PDP SCHEMA EXTENSIONS (APPROVED / REQUIRED)

These were **identified during PDP Phase 1** as unavoidable.

---

### 🆕 A. Prepaid / Payment Offers

> Needed to support:
> “Pay Online & Save ₹X / Y%”

#### Option 1 — Minimal (inline on product)

```sql
ALTER TABLE products
ADD COLUMN prepaid_enabled boolean default false,
ADD COLUMN prepaid_discount_type text check (prepaid_discount_type in ('flat','percent')),
ADD COLUMN prepaid_discount_value numeric,
ADD COLUMN prepaid_offer_text text;
```

**Usage**

* PDP shows prepaid CTA only if `prepaid_enabled = true`
* Offer text rendered below Pay Online button

---

#### Option 2 — Scalable (recommended)

```sql
CREATE TABLE product_offers (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null,
  product_id uuid,
  offer_type text check (
    offer_type in ('prepaid','urgency','aov','bundle')
  ) not null,
  label text,
  discount_type text check (discount_type in ('flat','percent')),
  discount_value numeric,
  is_active boolean default true,
  created_at timestamp default now()
);
```

**Rules**

* `product_id = null` → store-wide offer
* PDP reads offers by `offer_type`
* Future-proof for experiments

**Status:** 🔶 Planned, not yet implemented

---

## 3️⃣ URGENCY SIGNALS (SCHEMA-BACKED)

> PDP must never hardcode urgency copy

### Derived urgency (no new schema)

* From `product_variants.inventory`
* From `products.qty`

### Optional explicit urgency

```sql
ALTER TABLE products
ADD COLUMN urgency_text text;
```

Examples:

* “Only 7 left in stock”
* “Selling fast — limited availability”

**Status:** 🔶 Optional, recommended

---

## 4️⃣ AOV / FREE SHIPPING LOGIC

> Required for PDP Phase 2

```sql
ALTER TABLE stores
ADD COLUMN free_shipping_threshold numeric default 0;
```

Optional override:

```sql
ALTER TABLE products
ADD COLUMN free_shipping_threshold numeric;
```

**Usage**

* PDP shows progress bar
* “Add ₹X more to unlock free shipping”

**Status:** 🔶 Planned

---

## 5️⃣ BUNDLES & COMBOS (PHASE 3)

```sql
CREATE TABLE product_bundles (
  id uuid primary key default gen_random_uuid(),
  primary_product_id uuid not null,
  bundled_product_id uuid not null,
  discount_type text check (discount_type in ('flat','percent')),
  discount_value numeric,
  created_at timestamp default now()
);
```

**Usage**

* PDP “Frequently Bought Together”
* Combo pricing UI

**Status:** ❌ Not implemented

---

## 6️⃣ RATINGS & REVIEWS (VISUAL RULES)

* Rating is **decimal-accurate**

  * 4.3 = 4 full stars + partial
* PDP **does not round**
* Review count purely informational

**Schema:** Already exists
**Implementation:** ❌ Pending fix

---

## 7️⃣ PDP GRACEFUL DEGRADATION RULES (LOCKED)

If data is missing:

| Missing Data     | PDP Behavior         |
| ---------------- | -------------------- |
| No prepaid offer | Hide Pay Online CTA  |
| No urgency       | Hide urgency cluster |
| No highlights    | Skip highlights      |
| No testimonials  | Skip section         |
| No variants      | PDPEmpty             |
| No store context | PDPEmpty             |

---

## 8️⃣ CURRENT SCHEMA STATUS SUMMARY

| Area                | Status        |
| ------------------- | ------------- |
| Core product schema | ✅ Complete    |
| Variants            | ✅ Complete    |
| Store defaults      | ✅ Complete    |
| Prepaid offers      | 🔶 Planned    |
| Urgency text        | 🔶 Optional   |
| AOV / shipping      | 🔶 Planned    |
| Bundles             | ❌ Not started |

---

## 📍 HOW THIS AFFECTS EXECUTION

* **Phase 1** → Can complete without new schema
* **Phase 2** → Requires prepaid + urgency + AOV schema
* **Phase 3** → Requires bundle schema

Schema must be finalized **before** UI work in each phase.


## BIBLE ADDENDUM V9.3 — Working with Antigravity-Generated Frontend Code

(Non-canonical execution guide; becomes canonical only after code is merged)

Purpose of this Addendum

This addendum documents how the Bharat D2C Platform uses Google Antigravity for frontend UI generation, and how that output is reviewed, validated, and stitched into the platform backend.

This section does not declare PDP completion.
It exists to ensure repeatable execution and zero context loss across chats or team members.

Scope

Frontend only (PDP, Checkout, future storefront pages)

Antigravity is used only for UI code generation

Backend, schema, feeds, and commerce truth remain platform-owned

High-Level Workflow (Locked)

The platform follows a 3-step loop when using Antigravity:

Design & Structure Lock (Human-led)

Frontend Code Generation (Antigravity)

Review, Stitch & Promote (Human-led)

Antigravity is never allowed to:

decide layout hierarchy

invent UX patterns

define business logic

own schema or commerce truth

Step 1 — Before Using Antigravity (Mandatory)

Before running Antigravity, the following must be frozen:

Page structure (cluster order)

Conversion logic (COD-first, bundles, CTAs)

Mobile behavior (sticky CTA rules)

Folder structure

Engineering guardrails (TypeScript, shadcn, icons)

👉 These are supplied to Antigravity via a locked master prompt.

Step 2 — What Antigravity Is Expected to Output

Antigravity output is considered acceptable only if it includes:

A. Code Artifacts

Next.js App Router compatible code

TypeScript (no any)

shadcn/ui + Tailwind only

One component per PDP cluster

Centralized mockData.ts for placeholders

No backend calls

No schema injection

B. Structural Guarantees

Fixed cluster order

Deterministic DOM

Stable CTA elements

Mobile sticky CTA implemented via scroll state / intersection observer

Graceful empty-state handling

C. Folder Structure Compliance

Output must conform exactly to the agreed PDP folder structure.

If not → output is rejected and regenerated.

Step 3 — How Antigravity Output Is Reviewed (Critical)

When Antigravity code is shared in a new chat, review happens in this order:

1️⃣ Structural Audit (Non-Negotiable)

Cluster order matches North Star

Bundles placed correctly (above CTA)

COD is primary everywhere

Mobile and desktop share structure

2️⃣ Engineering Audit

Server vs Client component separation

No UI logic mixed with data

Types are explicit and reusable

No hardcoded business assumptions

3️⃣ UX / Conversion Audit

No dark patterns

No aggressive urgency

Pricing math clarity (₹ / unit)

Trust signals present but calm

Only after all three pass can code proceed.

Step 4 — Stitching Antigravity Code into Backend

Once frontend code passes review:

Mock data is replaced with backend props

Commerce truth (price, availability, reviews) comes from backend

Feature toggles are wired at container level

Schema & product feeds are not added here

Frontend remains pure presentation.

Step 5 — Promotion to Canonical Bible (When Allowed)

This addendum becomes canonical only when:

PDP frontend is merged into repo

Folder structure exists in GitHub

Conversion behavior is live and verified

At that point:

This addendum is promoted into the main Bible

PDP v1.5 status is updated

Antigravity becomes an approved frontend tool

Until then, this addendum is execution guidance only.

Important Platform Rule (Locked)

Antigravity generates UI.
The Bharat D2C Platform owns commerce truth.

This ensures compatibility with:

Schema (Phase 2)

OpenAI Product Feed

Agentic commerce protocols

Future AI-driven buying flows

How to Resume in a New Chat (Instruction)

When starting a new chat with Antigravity-generated code, always begin with:

“This code was generated via Antigravity using the Bharat PDP prompt.”

Share the full folder tree.

Share one cluster at a time (Hero → Conversion → etc.).

Ask for audit + stitch, not redesign.

END OF ADDENDUM
Final advice (founder to founder)

You did the right thing by not polluting the Bible with half-landed work.

This addendum gives you:

continuity

execution clarity

a clean restart point

When you have Antigravity output, drop it into a new chat and say:

“Audit Antigravity PDP output against North Star and stitch plan.”

We’ll pick up instantly, with zero rework.
