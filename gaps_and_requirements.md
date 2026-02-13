# Bharat D2C Platform: Gaps & Requirements Report

## 1. Executive Summary
The platform has a strong foundation for multi-tenancy and store management. However, several critical areas require attention to bridge the gap between a technical prototype and a production-ready Shopify alternative.

---

## 2. Technical Debt & Defects

### Admin Panel (Seller Journey)
- **Form Robustness**: While `react-hook-form` refactoring is underway, complex fields like "Collections" and "Themes" still use legacy state patterns that are prone to "frozen input" bugs.
- **Image Management**: Current image uploads lack optimization (WebP conversion, resizing) and redundancy checks. 
- **Bulk Import**: The bulk import tool is functional but lacks error logging for partial failures (e.g., if 10/100 products fail).

### Storefront (Buyer Journey)
- **Security (RLS)**: Public access to `stores` and `products` tables was initially missing. Ongoing monitoring of RLS policies is required to prevent data leaks or access blocks (406 errors).
- **Performance**: The storefront lack server-side caching for product data, which may lead to high Supabase query costs under load.

---

## 3. UI/UX Gaps

### Platform (Super-Admin)
- **Analytics Visualization**: Currently only counts are displayed. Real-time graphs for revenue, active stores, and user growth are needed.
- **Support Workflow**: No built-in way for super-admins to "Impersonate" a seller for troubleshooting.
- **Global Settings**: Features like Global Maintenance Mode and Global Support Email are currently placeholders.

### Storefront
- **Checkout Experience**: The checkout flow is basic and lacks conversion-driving features like "Express Checkout" (Apple Pay/Google Pay/Link).
- **Localization**: Pricing and currency handling are currently hardcoded to INR. Support for multi-currency is required for global sellers.

---

## 4. Infrastructure Requirements

### Security
- **WAF Integration**: Protection against DDoS and scraping is needed as the platform scales.
- **Audit Logs**: No tracking of who changed what in the Super-Admin or Store-Admin panels.

### Scalability
- **Image CDN**: Move from direct Hetzner/ObjectStorage URLs to a CDN (e.g., BunnyCDN or Cloudflare Images) for faster global loading.
- **Database Optimization**: Missing indexes on `products.collection_slug` and `orders.store_id` will cause slow queries as datasets grow.

---

## 5. Recommended Next Steps (High Priority)
1.  **Refactor remaining Admin forms** to ensure consistent UI behavior.
2.  **Implement Real-time Analytics** for Super-Admins.
3.  **Setup Image CDN** with automated resizing.
4.  **Add Order Management** features for Sellers (Order list, Fulfillment toggle).
