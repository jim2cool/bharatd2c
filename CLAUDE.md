# CLAUDE.md — Easy D2C Platform

> Multi-tenant D2C commerce platform for India's long tail sellers.
> "Built to sell. Priced to start."

## Tech Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Database & Auth:** Supabase (PostgreSQL + Auth + Storage + RLS)
- **Styling:** Tailwind CSS 4 (`@import` syntax, no tailwind.config.js), shadcn/ui (New York variant)
- **Colors:** OKLCH color space, CSS custom properties via `ThemeProvider`
- **Editor:** Tiptap (WYSIWYG rich text)
- **Forms:** react-hook-form + zod
- **Payments:** PayU (requires HTTPS locally)
- **Storage:** AWS S3 (Hetzner endpoint)
- **Logistics:** Nimbus API wrapper
- **Icons:** lucide-react

## Quick Commands

```bash
npm run dev              # Standard dev server
npm run dev:https        # HTTPS via Caddy (needed for PayU)
npm run build            # Production build
npm run lint             # ESLint
scripts/stop-dev.ps1     # Kill stale node processes
```

## Project Structure

```
app/
  (storefront)/           # Public store pages (route group)
    products/[slug]/      # PDP with conversion cluster components
    cart/                 # Cart page
    collections/          # Collection listings
    track-order/          # Order tracking
  admin/                  # Store owner dashboard
    products/             # Product CRUD + AI generation
    orders/               # Order management
    settings/             # Store settings (appearance, general)
    marketing/            # Marketing tools
    logistics/            # Shipping integration
    discounts/            # Discount management
  super-admin/            # Platform-level admin
  api/                    # API routes (REST, route.ts handlers)
  checkout/               # Checkout flow
  theme/easy-base/        # Default theme layout (Header, Footer, AnnouncementBar)
  auth/ login/            # Authentication pages
  onboarding/             # New store onboarding

components/
  ui/                     # shadcn primitives
  admin/                  # Admin-specific components
  themes/                 # Theme-aware components
  sections/               # Reusable page sections
  marketing/              # Marketing components

lib/
  supabase-server.ts      # Server-side Supabase client
  supabase-browser.ts     # Client-side Supabase client
  supabase-admin.ts       # Service role client (admin ops)
  getActiveStore.ts       # Multi-tenant store resolution (server)
  getActiveStore.client.ts # Store resolution (client, localStorage)
  cart.ts                 # Cart logic (localStorage-based)
  pdp-adapter.ts          # Product data transformer for PDP
  payu/                   # Payment gateway integration
  logistics/nimbus.ts     # Shipping API wrapper
  dropshipping/supplier.ts  # Dropshipping integration
  themes/                 # Theme utilities

hooks/
  useFeature.ts           # Feature flag hook

middleware.ts             # Multi-tenant routing, auth guards, maintenance mode
```

## Architecture Patterns

### Multi-Tenancy
- Domain/subdomain-based resolution in `middleware.ts`
- Headers: `x-store-slug`, `x-is-platform-root`
- Cookie fallback: `easy_active_store_id`
- Server: `getActiveStoreId()` reads headers then Supabase
- Client: `getActiveStoreIdClient()` reads localStorage

### Authentication
- Supabase Auth with SSR (`@supabase/ssr`)
- OTP-based phone auth (`app/api/otp/`)
- Middleware guards `/admin` and `/super-admin` routes
- Super-admin impersonation support

### PDP Conversion Clusters
Product pages use a structured cluster architecture:
`Hero → Highlights → Conversion → Proof → Content → AOV`
Each cluster is a folder under `app/(storefront)/products/[slug]/components/`.

### Cart & Checkout
- Cart: localStorage key `d2c_cart`, event-driven via `window.dispatchEvent("cart-updated")`
- Buy Now: SessionStorage for direct checkout bypass
- Orders: Format `<STORECODE>-<MMYY>-<SEQ>`, COD rate-limited (max 2 pending)

### Theme System
- `theme_config` JSON in `stores` table
- `ThemeProvider` injects CSS variables at runtime
- Industry presets (fashion, beauty, etc.)
- Customizable: colors, corners, buttons, spacing, typography

### Feature Flags
- `useFeature(name, storeId)` hook
- Backed by `feature_flags` table (store-specific or global)

## Database (Supabase + RLS)

Key tables: `stores`, `products`, `product_variants`, `orders`, `order_items`, `customers`, `collections`, `pages`, `feature_flags`, `platform_settings`

Products use JSON columns for: `urgency_settings`, `bundle_settings`, `theme_config`, `meta`.

## Conventions

- **Path alias:** `@/*` maps to project root
- **Server Components** for data fetching; Client Components for interactivity
- **No global state library** — React state + localStorage + events
- **API routes:** RESTful `route.ts` with POST/GET handlers, zod validation
- **Supabase queries:** Direct `.from()` calls, no ORM layer
- **Styling:** Tailwind utility-first, no CSS modules. Design tokens in `globals.css`
- **Components:** shadcn/ui primitives in `components/ui/`, page-specific components colocated in route folders

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

## Gotchas

- **System hangs:** ~45k files cause indexing slowdowns. Clear `.next` and `node_modules/.cache`.
- **HTTPS required:** PayU needs HTTPS. Use `npm run dev:https` (Caddy reverse proxy).
- **Stale processes:** Run `scripts/stop-dev.ps1` to kill orphan node processes.
- **Tailwind v4:** No `tailwind.config.js`. Config lives in `globals.css` via `@import`.

## Reference Documents

- `VISION.md` — Strategic intent and product pillars
- `BRAIN.md` — Active knowledge layer and current project pulse
- `DESIGN.md` — Design system tokens and identity
- `AI_ONBOARDING.md` — Agent handover prompt

## Skills

### SEO
- `/seo-orchestrator` — Comprehensive SEO analysis with parallel subagent delegation
- `/seo-technical-audit` — Full website SEO audit with crawling, business type detection, and health scoring
- `/seo-content-strategy` — Content quality and E-E-A-T analysis with AI citation readiness
- `/seo-geo-local` — Generative Engine Optimization for AI Overviews, ChatGPT web search, Perplexity
- `/seo-programmatic` — SEO-optimized pages at scale using templates, locations, comparisons
- `/seo-schema-markup` — Schema.org structured data implementation and fixes

### Marketing
- `/mkt-copywriting` — Conversion copywriting using AIDA and PAS frameworks
- `/mkt-copy-editing` — Advanced copy editing via the "Seven Sweeps" framework
- `/mkt-email-marketing` — Email sequences, drip campaigns, and newsletter strategy
- `/mkt-linkedin-strategy` — LinkedIn authority building and high-engagement content
- `/mkt-case-study-creator` — Convert customer wins into persuasive case studies
- `/mkt-idea-generator` — High-velocity marketing ideas categorized by budget, effort, impact
- `/reddit-market-insights` — Market research via Reddit for pain points and competitor analysis

### Strategy
- `/strat-positioning-basics` — Brand positioning, market differentiation, customer targeting
- `/strat-psychology-triggers` — Behavioral economics and psychological triggers for conversion

### Design & Utilities
- `/ui-design-md-architect` — Synthesize semantic design systems into DESIGN.md
- `/util-enhance-prompt-engineer` — Prompt engineering enhancement utility
