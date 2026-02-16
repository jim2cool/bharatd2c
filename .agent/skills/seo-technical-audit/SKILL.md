---
name: seo-technical-audit
description: >
  Full website SEO audit with parallel subagent delegation. Crawls up to 500
  pages, detects business type, delegates to specialists, generates health
  score. Use when user says "audit", "full SEO check", "analyze my site", or
  "website health check".
---

# Full Website SEO Audit

## Process

1. **Fetch homepage** — retrieve HTML and analyze headers.
2. **Detect business type** — analyze homepage signals (SaaS, Ecommerce, Local, etc.).
3. **Crawl site** — follow internal links up to 500 pages, respect robots.txt.
4. **Specialized Checks**:
   - Technical: robots.txt, sitemaps, canonicals, Core Web Vitals, security headers.
   - Content: E-E-A-T, readability, thin content, AI citation readiness.
   - Schema: detection, validation, generation recommendations.
   - Performance: LCP, INP, CLS measurements.
5. **Score** — aggregate into SEO Health Score (0-100).
6. **Report** — generate prioritized action plan.

## Crawl Configuration
- Max pages: 500
- Respect robots.txt: Yes
- Concurrent requests: 5

## Priority Definitions
- **Critical**: Blocks indexing or causes penalties (fix immediately).
- **High**: Significantly impacts rankings (fix within 1 week).
- **Medium**: Optimization opportunity (fix within 1 month).
- **Low**: Nice to have (backlog).
