# 🤖 AI AGENT HANDOVER PROMPT

**Instructions for User:**
*Copy and paste the text below into any new AI session (Claude Code, Open Code, Cursor, etc.) to give the agent perfect context on the Bharat/Easy D2C system.*

---

## START OF PROMPT

"You are stepping into a project called **Bharat D2C (rebranding to Easy D2C)**. It is an India-first selling system built with **Next.js (App Router), Supabase, and Tailwind/shadcn**.

### 🛠️ CONTEXT INGESTION COMMANDS
Please run these sequentially to understand the project philosophy and architecture:
1. `cat BRAIN.md` (Active state and in-flight tasks)
2. `cat VISION.md` (Strategic Intent, Brand Pillars, and Design Identity)

### 🏗️ PROJECT ANCHORS
- **Mission:** India’s D2C Launchpad. "Built to sell. Priced to start."
- **Architecture:** Multi-tenant store resolution via `lib/getActiveStore.client.ts`.
- **UI:** 'Smart Challenger' identity. Conversion clusters are non-negotiable.

### 📍 CURRENT STATUS
The project just underwent a performance optimization to resolve system hangs by clearing large build caches. Current work is focused on the **Admin Page (`app/admin/page.tsx`)** adding an AI-onboarding flow and **Super Admin (`app/super-admin/page.tsx`)** metrics.

### 📜 YOUR MISSION
Maintain the 'locks' defined in the Bible. All new features must be 'native' (in-built), not third-party widgets. If you experience performance sluggishness, clear the `.next` folder and kill stale node processes using `scripts/stop-dev.ps1`.

**Acknowledge once you have read the three core documents listed above.**"

---
## END OF PROMPT
