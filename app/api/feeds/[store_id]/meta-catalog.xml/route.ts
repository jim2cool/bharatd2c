import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Escape special characters for XML compliance
const escapeXml = (unsafe: string) => {
    if (!unsafe) return ""
    return unsafe.replace(/[<>&'"]/g, (c) => {
        switch (c) {
            case "<": return "&lt;"
            case ">": return "&gt;"
            case "&": return "&amp;"
            case "'": return "&apos;"
            case '"': return "&quot;"
            default: return c
        }
    })
}

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ store_id: string }> }
) {
    try {
        const { store_id: storeId } = await params

        // 1. Fetch Store Profile to get their custom domain URL
        const { data: store, error: storeError } = await supabase
            .from("stores")
            .select("custom_domain")
            .eq("id", storeId)
            .single()

        if (storeError || !store) {
            return new NextResponse("Store Not Found", { status: 404 })
        }

        // domain constraints: Meta requires a real domain, not our internal subdomain for catalogs.
        // If the seller hasn't set up a custom domain yet, we don't block the feed generation, 
        // but the Admin UI will warn them that Meta might reject the URLs.
        const baseUrl = store.custom_domain ? `https://${store.custom_domain}` : `https://${storeId}.easyd2c.com`

        // 2. Fetch Published Products with their variants and images
        const { data: products, error: productError } = await supabase
            .from("products")
            .select(`
        id,
        title,
        description,
        handle,
        price,
        compare_at_price,
        category,
        product_images ( image_url, sort_order ),
        product_variants ( inventory )
      `)
            .eq("store_id", storeId)
            .eq("status", "published")

        if (productError) {
            return new NextResponse("Error fetching products", { status: 500 })
        }

        // 3. Construct the RSS/XML Feed
        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Easy D2C Catalog - Store ${storeId}</title>
    <link>${baseUrl}</link>
    <description>Product feed for Meta Commerce Manager</description>`

        products.forEach((product) => {
            const primaryImage = product.product_images?.find((img) => img.sort_order === 0)?.image_url
                || product.product_images?.[0]?.image_url
                || ""

            const totalInventory = product.product_variants?.reduce((sum, v) => sum + (v.inventory || 0), 0) || 0
            const availability = totalInventory > 0 ? "in stock" : "out of stock"

            xml += `
    <item>
      <g:id>${escapeXml(product.id)}</g:id>
      <g:title>${escapeXml(product.title)}</g:title>
      <g:description>${escapeXml(product.description || product.title)}</g:description>
      <g:link>${baseUrl}/products/${escapeXml(product.handle)}</g:link>
      <g:image_link>${escapeXml(primaryImage)}</g:image_link>
      <g:brand>Custom Brand</g:brand>
      <g:condition>new</g:condition>
      <g:availability>${availability}</g:availability>
      <g:price>${product.price} INR</g:price>`

            if (product.compare_at_price && product.compare_at_price > product.price) {
                xml += `
      <g:sale_price>${product.price} INR</g:sale_price>
      <g:price>${product.compare_at_price} INR</g:price>`
            }

            if (product.category) {
                xml += `
      <g:google_product_category>${escapeXml(product.category)}</g:google_product_category>`
            }

            xml += `
    </item>`
        })

        xml += `
  </channel>
</rss>`

        // 4. Return as XML
        return new NextResponse(xml, {
            status: 200,
            headers: {
                "Content-Type": "text/xml",
                "Cache-Control": "public, max-age=3600", // Cache feed for 1 hour
            }
        })

    } catch (err) {
        console.error("Meta Feed Generation Error:", err)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
