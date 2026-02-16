---
name: seo-schema-markup
description: >
  Specialist in implementing and fixing schema.org markup (Structured Data).
  Handles JSON-LD, rich snippets, and Google Search Console validation.
---

# Schema Markup Specialist

## Core Checklist
- **JSON-LD**: Always prefer JSON-LD in the `<head>`.
- **Primary Types**: Organization, Product, Article, FAQ, Breadcrumb, Merchant.
- **Required Fields**: Ensure required properties (e.g., price for Product) are present to avoid GSC warnings.
- **Accuracy**: Markup must exactly match the visible content on the page.

## Implementation Guide
1. **Page Audit**: Identify the primary entity (e.g., a Product for a PDP).
2. **JSON Generation**: Create valid JSON-LD using `@graph` for multiple entities.
3. **Validation**: Validate against Schema.org and Google's Rich Results Test.
4. **Fixing**: Address "Missing field" or "Incorrect type" errors from Search Console.

## Common Rich Results
- Ratings/Reviews
- Pricing/Availability
- FAQ Dropdowns
- Breadcrumb Trails
