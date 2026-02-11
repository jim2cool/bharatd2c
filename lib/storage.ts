import { S3Client } from "@aws-sdk/client-s3";

const S3_ENDPOINT = process.env.HETZNER_S3_ENDPOINT || "https://fsn1.your-objectstorage.com";
const S3_REGION = "fsn1"; // Hetzner default

export const s3Client = new S3Client({
    region: S3_REGION,
    endpoint: S3_ENDPOINT,
    credentials: {
        accessKeyId: process.env.HETZNER_S3_ACCESS_KEY!,
        secretAccessKey: process.env.HETZNER_S3_SECRET_KEY!,
    },
    forcePathStyle: true, // Required for some S3-compatible providers
});

export const BUCKET_NAME = process.env.HETZNER_S3_BUCKET!;
export const PUBLIC_BASE_URL = process.env.HETZNER_PUBLIC_BASE_URL!;
