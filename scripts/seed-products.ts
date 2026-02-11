import { createClient } from "@supabase/supabase-js";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const HETZNER_S3_ENDPOINT = process.env.HETZNER_S3_ENDPOINT || "https://fsn1.your-objectstorage.com";
const HETZNER_S3_ACCESS_KEY = process.env.HETZNER_S3_ACCESS_KEY!;
const HETZNER_S3_SECRET_KEY = process.env.HETZNER_S3_SECRET_KEY!;
const HETZNER_S3_BUCKET = process.env.HETZNER_S3_BUCKET!;
const HETZNER_PUBLIC_BASE_URL = process.env.HETZNER_PUBLIC_BASE_URL!;

const SOURCE_DIR = "C:\\Work\\Marketplace\\Images";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const s3 = new S3Client({
    endpoint: HETZNER_S3_ENDPOINT,
    region: "fsn1",
    credentials: {
        accessKeyId: HETZNER_S3_ACCESS_KEY,
        secretAccessKey: HETZNER_S3_SECRET_KEY,
    },
    forcePathStyle: true,
});

// DATA MAPPING
const PRODUCT_DATA: Record<string, { price: number; cogs: number; category: string; description: string }> = {
    "Bottle": {
        price: 499,
        cogs: 150,
        category: "Home & Kitchen",
        description: "Premium insulated water bottle. Keeps drinks cold for 24 hours and hot for 12 hours. Durable stainless steel construction."
    },
    "Color Changing Bluetooth Lamp + Bluetooth Speakers": {
        price: 1299,
        cogs: 450,
        category: "Electronics",
        description: "Smart bedside lamp with integrated Bluetooth speaker. Touch control color changing modes and high-quality audio output."
    },
    "Feihong Shaver": {
        price: 899,
        cogs: 300,
        category: "Personal Care",
        description: "Compact and powerful portable shaver. Perfect for travel with USB charging and precision blades."
    },
    "Flawless Facial Hair Remover for Women": {
        price: 699,
        cogs: 200,
        category: "Personal Care",
        description: "Gentle and painless facial hair remover. Hypoallergenic design suitable for all skin types. Discrete and portable."
    },
    "Folding Washign Machine": {
        price: 2499,
        cogs: 1200,
        category: "Home Appliances",
        description: "Portable folding washing machine. Ideal for small loads like socks, underwear, and baby clothes. Great for travel and dorms."
    },
    "Mini Shaver": {
        price: 599,
        cogs: 180,
        category: "Personal Care",
        description: "Ultra-compact mini shaver. Fits in your pocket. Type-C charging and washable head."
    },
    "PANDA LIGHT": {
        price: 399,
        cogs: 120,
        category: "Home Decor",
        description: "Cute Panda night light. Soft silicone material, tap to change colors. USB rechargeable battery."
    },
    "Selfie Light": {
        price: 299,
        cogs: 80,
        category: "Electronics",
        description: "Clip-on selfie ring light for phones. 3 brightness levels for perfect selfies anywhere."
    },
    "Selfie Ring Light with Stand": {
        price: 1499,
        cogs: 500,
        category: "Electronics",
        description: "Professional ring light with tripod stand. Adjustable height and color temperature. Includes phone holder."
    },
    "Shoe Washing Bag": {
        price: 199,
        cogs: 50,
        category: "Home & Kitchen",
        description: "Protective mesh laundry bag for shoes. Prevents damage to shoes and machine during wash cycle."
    },
    "Ultrapods Max Bluetooth 5.3 earbuds LED Display toUCH cONTROL": {
        price: 999,
        cogs: 350,
        category: "Electronics",
        description: "True Wireless Earbuds with Bluetooth 5.3. LED battery display, touch controls, and immersive sound quality."
    },
    "Ultraviolet Insect Killer": {
        price: 799,
        cogs: 250,
        category: "Home Appliances",
        description: "Effective UV mosquito and insect killer lamp. Chemical-free and safe for home use. USB powered."
    },
    "Video Making Kit": {
        price: 1999,
        cogs: 700,
        category: "Electronics",
        description: "Complete vlogging kit with microphone, LED light, phone holder, and tripod. Everything you need to start creating content."
    }
};

async function main() {
    console.log("🚀 Starting Enhanced Seed Process...");

    // 0. Get Store ID
    console.log("Fetching 'Demo Store'...");
    const { data: stores, error: storeError } = await supabase
        .from("stores")
        .select("id")
        .eq("name", "Demo Store") // Target specific store
        .limit(1);

    if (storeError || !stores || stores.length === 0) {
        console.error("❌ 'Demo Store' not found. Please create it first.");
        return;
    }
    const storeId = stores[0].id;
    console.log(`✅ Using Store ID: ${storeId}`);

    // 1. Delete all existing products and dependent data
    console.log("Clearing existing data...");
    const { error: deleteItemsError } = await supabase.from("order_items").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (deleteItemsError) console.error("Error clearing order_items:", deleteItemsError);

    const { error: deleteOrdersError } = await supabase.from("orders").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (deleteOrdersError) console.error("Error clearing orders:", deleteOrdersError);

    const { error: deleteError } = await supabase.from("products").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (deleteError) {
        console.error("Error deleting products:", deleteError);
        return;
    }
    console.log("✅ Cleared database.");

    // 2. Read Source Directory
    const folders = fs.readdirSync(SOURCE_DIR).filter(f => fs.statSync(path.join(SOURCE_DIR, f)).isDirectory());
    console.log(`Found ${folders.length} products to import.`);

    for (const folderName of folders) {
        console.log(`\nProcessing: ${folderName}`);
        const folderPath = path.join(SOURCE_DIR, folderName);

        // Get mapped data or defaults
        const mapping = PRODUCT_DATA[folderName] || {
            price: 999,
            cogs: 400,
            category: "Uncategorized",
            description: `<p>${folderName} - High quality product.</p>`
        };

        const title = folderName.trim();
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

        // Create Product in DB
        const { data: product, error: createError } = await supabase
            .from("products")
            .insert({
                store_id: storeId, // CRITICAL FIX
                title: title,
                price: mapping.price,
                cogs: mapping.cogs,
                status: "published",
                slug: slug,
                content_markup: mapping.description, // Mapped to correct column
                images: [],
                mrp: Math.round(mapping.price * 1.5), // Mock comparison price
                inventory_count: 50, // Mock inventory
                collection_slug: [mapping.category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")]
            })
            .select()
            .single();

        if (createError) {
            console.error(`Failed to create product ${title}:`, createError);
            continue;
        }

        const productId = product.id;
        console.log(`Created Product ID: ${productId}`);

        // Process Images
        const files = fs.readdirSync(folderPath).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
        const uploadedUrls: string[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const filePath = path.join(folderPath, file);
            const buffer = fs.readFileSync(filePath);

            // Convert to WebP
            const webpBuffer = await sharp(buffer)
                .resize({ width: 1600, withoutEnlargement: true })
                .webp({ quality: 80 })
                .toBuffer();

            const filename = i === 0
                ? `${slug}-hero.webp`
                : `${slug}-${i}.webp`;

            // Ensure folder logic matches API route
            const key = `${slug}/${filename}`;

            console.log(`Uploading ${filename}...`);

            try {
                await s3.send(new PutObjectCommand({
                    Bucket: HETZNER_S3_BUCKET,
                    Key: key,
                    Body: webpBuffer,
                    ContentType: "image/webp",
                    ACL: "public-read",
                }));
                uploadedUrls.push(`${HETZNER_PUBLIC_BASE_URL}/${key}`);
            } catch (e) {
                console.error(`Failed to upload ${filename}`, e);
            }
        }

        // Update Product with Images
        await supabase
            .from("products")
            .update({ images: uploadedUrls })
            .eq("id", productId);

        console.log(`✅ Updated ${title} with ${uploadedUrls.length} images.`);

        // Cleanup: Delete source folder if requested/preferred to save space
        // As per user instruction to avoid redundant files
        try {
            console.log(`Cleaning up source folder: ${folderPath}`);
            fs.rmSync(folderPath, { recursive: true, force: true });
        } catch (cleanupErr) {
            console.error(`Failed to cleanup source folder ${folderName}`, cleanupErr);
        }
    }

    console.log("\n✅ Seeding Complete!");
}

main().catch(console.error);
