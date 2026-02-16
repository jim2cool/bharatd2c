# 🧠 BHARAT D2C PLATFORM — SECOND BRAIN

> **Role:** Active Knowledge Layer for AI Agents (Antigravity, Claude Code, etc.)
> **Sync Status:** 2026-02-15 11:55
> **Primary Goal:** Enable seamless handover when Antigravity credits are exhausted.

---

## ⚡ QUICK START FOR NEW AGENT
1. **Ingest Vision:** Read `VISION.md` first. This is the single source of truth for strategy, tone, and architecture.
2. **Setup Environment:** Use `scripts/dev-https.ps1` for development.
3. **Performance Tip:** If the system hangs, run `scripts/stop-dev.ps1` and clear the `.next` folder.

---

## 🏗️ ARCHITECTURAL ANCHORS
- **Name:** Easy D2C (formerly Bharat D2C)
- **Tech Stack:** Next.js (App Router), Supabase, Tailwind CSS, shadcn/ui.
- **Vision:** "Built to sell. Priced to start." Native growth systems replace Shopify Apps.
- **Tone:** Smart. Cheeky. Confident. Challenger.

---

## 📍 CURRENT PROJECT PULSE (ACTIVE WORK)
### 1. Admin Page Development
- **File:** `app/admin/page.tsx`
- **State:** Implementing an AI-first onboarding checklist for new sellers.
- **Logic:** If a store has no products, show the "AI Daily Pulse" summary and onboarding steps.

### 2. Super Admin "Nexus Hub"
- **File:** `app/super-admin/page.tsx`
- **Focus:** Multi-tenant telemetry and Supabase usage monitoring.

---

## 🛠️ KNOWN GOTCHAS & RESOLUTIONS
- **System Hangs:** The project has ~45k files. Periodic indexing can cause hangs.
  - **Fix:** Clear `.next` and `node_modules/.cache` frequently.
  - **Tool:** `scripts/stop-dev.ps1` to kill stale node processes.
- **HTTPS Requirements:** PayU and other integrations require HTTPS locally.
  - **Tool:** `scripts/dev-https.ps1` (uses Caddy as a reverse proxy).

---

## 📋 ROADMAP (IMMEDIATE NEXT STEPS)
- [ ] Finalize the "AI Generator" flow in the admin.
- [ ] Connect real Supabase telemetry to the Super Admin usage dashboard.
- [ ] Audit the mobile sticky CTA against the North Star conversion clustering.

---

## 🔗 KEY FILES TO WATCH
- `lib/supabase-browser.ts`: Canonical Supabase client.
- `lib/getActiveStore.client.ts`: Strategy for resolving multi-tenant stores.
- `app/admin/components/OnboardingChecklist.tsx`: Current active UI component.
