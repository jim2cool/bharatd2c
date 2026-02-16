---
description: how to keep the 3 authoritative documents in sync with the live codebase and database
---

# Authoritative Docs Maintenance Workflow

The three authoritative documents are the single source of truth for all engineering decisions:

- `public/Authoritative/EasyD2C_Engineering_Spec_v1.md`
- `public/Authoritative/EasyD2C_Platform_Brief_v1.md`
- `public/Authoritative/EasyD2C_Product_Design_Reference_v1.md`

**Rule**: Any time code or the database is changed in a way that contradicts one of these docs, the doc MUST be updated in the same session before the session ends.

---

## Trigger Checklist — When to Update the Docs

Run through this checklist at the end of any session that touches the following:

| Change Type | Which Doc(s) |
|---|---|
| New DB table or column added | Engineering Spec §2 |
| Column renamed or type changed | Engineering Spec §2 |
| `compute_store_render_config()` signature or logic changed | Engineering Spec §3 |
| New view column added to `vw_store_config_resolved` | Engineering Spec §4 |
| New override type added | Engineering Spec §5, PDR §6 |
| RTO signal or score band changed | Engineering Spec §6, Platform Brief §5 |
| New motion primitive added or removed | Engineering Spec §9, Platform Brief §4 |
| New mood card added | Engineering Spec §2.2, Platform Brief §4, PDR §7 |
| New product category added | Engineering Spec §2.2, Platform Brief §4, PDR §5 |
| New component added to registry | PDR §5 |
| Onboarding question changed | Engineering Spec §2.2, PDR §2 |
| Enum values changed in DB | Engineering Spec — relevant table section |
| New page or page governance level changed | Engineering Spec §7, PDR §10 |

---

## Step-by-Step Update Process

// turbo-all

1. **Identify the changed area**: Look at what was built or changed this session. Cross-reference the trigger checklist above.

2. **Query the live DB to confirm current state**: Before editing any doc, verify the actual DB state:
   ```sql
   -- Example: verify enum values for a column
   SELECT DISTINCT column_name FROM table_name;
   
   -- Example: verify function signature
   SELECT proname, pg_get_function_arguments(oid)
   FROM pg_proc WHERE proname = 'function_name';
   ```

3. **Find the exact line in the MD file**: Use grep or view_file_outline to locate the section to update. Do NOT edit by memory — always read the current content first.

4. **Make a targeted edit**: Use `replace_file_content` or `multi_replace_file_content` to make a surgical, minimal change. Add a `*(DB-verified YYYY-MM-DD)*` annotation when correcting a documented value to match the live DB.

5. **Cross-check the other two docs**: The same concept often appears in all three docs. Search all three before closing the session:
   ```
   grep -i "keyword" public/Authoritative/*.md
   ```

6. **Document the change in a session note**: Add a one-line entry at the top of the relevant doc's section:
   ```
   > Last updated: YYYY-MM-DD — [what changed]
   ```

---

## Corrections Made to Date

| Date | Doc | Section | What Was Wrong | What It Now Says |
|---|---|---|---|---|
| 2026-02-26 | Engineering Spec | §2.2 ob_seller_profiles | `trust_density: minimal\|moderate\|heavy` | `light\|medium\|heavy` (DB-verified) |
| 2026-02-26 | Engineering Spec | §2.4 re_store_render_config | `trust_density: minimal\|moderate\|heavy` | `light\|medium\|heavy` (DB-verified) |
| 2026-02-26 | Engineering Spec | §2.2 ob_seller_profiles | `cta_prominence: soft\|standard\|aggressive` | `balanced\|dominant` (DB-verified) |
| 2026-02-26 | Engineering Spec | §2.4 re_store_render_config | `cta_prominence: soft\|standard\|aggressive` | `balanced\|dominant` (DB-verified) |
| 2026-02-26 | Engineering Spec | §9.2 | "Five Motion Primitives" — missing Magnetic, Parallax | Updated to Seven, added Magnetic + Parallax |
| 2026-02-26 | Platform Brief | §4 Motion | "Five motion primitives" — missing SlideIn, StaggerGroup | Updated to Seven, added SlideIn + StaggerGroup |
| 2026-02-26 | Engineering Spec | §2.2 | `urgency_level` live DB values clarification | Added note that live values are low, medium, high |
| 2026-02-26 | Platform Brief | §5 | RTO 85-100 band missing `kill` UI label | Added Kill label and note about distinct black card UI |
| 2026-02-26 | Engineering Spec | §4 | `vw_store_config_resolved` missing extended tokens | Added note listing extended tokens and has_search |
| 2026-02-26 | Platform Brief & Eng Spec | Product Categories | Listed as 15 categories | Updated to 20 (added Jewellery, Art, Pets, Baby, Stationery) |
| 2026-02-28 | Engineering Spec | §2.1 stores | Missing `country` column | Added `country` column and DB-verified `timezone` usage |

---

## What NOT to Change

- Do NOT change the foundational architecture (6-layer stack, commerce architectures) without explicit product decision.
- Do NOT change LOCKED component lists without a full audit of `cr_components` + `science_locked = true`.
- Do NOT rename mood cards — they are DB primary keys.
- Do NOT change the RPC parameter name `p_store_id` — it is the live DB function signature.
- Do NOT remove the `re_seller_overrides` table spec — this is the canonical override table.
