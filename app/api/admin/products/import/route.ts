import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";

// Init Supabase Admin (Service Role)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Init S3
const s3 = new S3Client({
    endpoint: process.env.HETZNER_S3_ENDPOINT,
    region: "fsn1",
    credentials: {
        accessKeyId: process.env.HETZNER_S3_ACCESS_KEY!,
        secretAccessKey: process.env.HETZNER_S3_SECRET_KEY!,
    },
    forcePathStyle: true,
});

const BUCKET = process.env.HETZNER_S3_BUCKET!;
const PUBLIC_BASE = process.env.HETZNER_PUBLIC_BASE_URL!;

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { products, storeId } = body;

        if (!storeId) {
            return NextResponse.json({ error: "Store ID is required" }, { status: 400 });
        }

        const stats = { success: 0, failed: 0, logs: [] as string[] };

        for (const p of products) {
            try {
                // 1. Prepare Base Data
                const slug = p.slug || p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now();

                // Insert Product
                const { data: product, error: insertError } = await supabase
                    .from("products")
                    .insert({
                        store_id: storeId,
                        title: p.title,
                        slug: slug,
                        status: p.status || "draft",
                        price: p.price,
                        mrp: p.mrp,
                        cogs: p.cogs,
                        qty: p.qty,
                        location: p.location,
                        content_markup: p.description,
                        seo_title: p.seo_title,
                        seo_description: p.seo_description,
                        cod_enabled: p.cod_enabled,
                        rating: p.rating,
                        review_count: p.review_count,
                        highlights: p.highlights,
                        collection_slug: p.collection_slug,
                        images: [] // Will update later
                    })
                    .select()
                    .single();

                if (insertError) {
                    throw new Error(`DB Insert Failed: ${insertError.message}`);
                }

                stats.success++;
                stats.logs.push(`[ROW ${products.indexOf(p) + 1}] ✅ Created: ${p.title}`);

                // 2. Process Images
                const finalImages = [];
                if (p.images && p.images.length > 0) {
                    for (let i = 0; i < p.images.length; i++) {
                        const url = p.images[i];
                        if (!url) continue;

                        try {
                            const response = await fetch(url);
                            if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

                            const buffer = await response.arrayBuffer();

                            // Resize & Convert
                            const processedBuffer = await sharp(Buffer.from(buffer))
                                .resize({ width: 1600, withoutEnlargement: true })
                                .webp({ quality: 80 })
                                .toBuffer();

                            const filename = i === 0 ? `${slug}-hero.webp` : `${slug}-${i}.webp`;
                            const key = `${slug}/${filename}`;

                            // Upload
                            await s3.send(new PutObjectCommand({
                                Bucket: BUCKET,
                                Key: key,
                                Body: processedBuffer,
                                ContentType: "image/webp",
                                ACL: "public-read",
                            }));

                            finalImages.push(`${PUBLIC_BASE}/${key}`);
                            stats.logs.push(`  - Image ${i + 1} processed & optimized`);

                            // DELETE ORIGINAL if it matches our bucket
                            if (url.startsWith(PUBLIC_BASE)) {
                                try {
                                    const sourceKey = url.replace(`${PUBLIC_BASE}/`, "");
                                    await s3.send(new DeleteObjectCommand({
                                        Bucket: BUCKET,
                                        Key: sourceKey
                                    }));
                                    stats.logs.push(`  - Redundant source file purged`);
                                } catch (delErr) {
                                    console.warn("Source cleanup failed:", delErr);
                                }
                            }

                        } catch (imgErr: any) {
                            stats.logs.push(`  ❌ Image ${i + 1} failed (${url.substring(0, 30)}...): ${imgErr.message}`);
                            finalImages.push(url); // Fallback to original
                        }
                    }

                    // Update Product with processed images
                    await supabase
                        .from("products")
                        .update({ images: finalImages })
                        .eq("id", product.id);
                }

            } catch (err: any) {
                stats.failed++;
                stats.logs.push(`[ROW ${products.indexOf(p) + 1}] ❌ FAILED "${p.title}": ${err.message}`);
            }
        }

        return NextResponse.json(stats);

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
