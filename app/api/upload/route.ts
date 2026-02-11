import { NextRequest, NextResponse } from "next/server";
import { s3Client, BUCKET_NAME, PUBLIC_BASE_URL } from "@/lib/storage";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const productId = formData.get("productId") as string;
        const productTitle = formData.get("productTitle") as string;
        const index = formData.get("index") as string;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Validate File Type
        if (!file.type.startsWith("image/")) {
            return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
        }

        // Convert to Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Optimize: Resize & Convert to WebP
        const webpBuffer = await sharp(buffer)
            .resize({ width: 1600, withoutEnlargement: true })
            .webp({ quality: 80 })
            .toBuffer();

        // Generate Filename based on Product Title
        // e.g. [slug]-hero.webp or [slug]-[index].webp
        let filename = `image-${Date.now()}.webp`; // Fallback
        let folder = productId; // Default

        if (productTitle && index) {
            const slug = productTitle
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");

            filename = index === "0"
                ? `${slug}-hero.webp`
                : `${slug}-${index}.webp`;

            folder = slug; // Use slug as folder
        }

        // Manual Folder Override (Media Manager)
        const customFolder = formData.get("folder") as string;
        if (customFolder) {
            folder = customFolder;
        }

        // Construct S3 Key
        const key = folder ? `${folder}/${filename}` : filename;

        // Upload to S3
        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
            Body: webpBuffer,
            ContentType: "image/webp",
            ACL: "public-read",
        });

        await s3Client.send(command);

        // Construct Public URL
        const url = `${PUBLIC_BASE_URL}/${key}`;

        return NextResponse.json({
            success: true,
            url,
            filename
        });

    } catch (error) {
        console.error("Upload Error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
