import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import sharp from 'sharp'

const s3 = new S3Client({
  endpoint: process.env.HETZNER_S3_ENDPOINT,
  region: 'eu-central-1',
  credentials: {
    accessKeyId: process.env.HETZNER_S3_ACCESS_KEY!,
    secretAccessKey: process.env.HETZNER_S3_SECRET_KEY!,
  },
})

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()

    const file = formData.get('file') as File | null
    const productId = formData.get('productId') as string
    const productTitle = formData.get('productTitle') as string
    const index = formData.get('index') as string

    if (!file || !productId || !productTitle) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    // 🔒 Sharp processing (wrapped safely)
    const webp = await sharp(buffer)
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer()

    const slug = productTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const filename =
      index === '0'
        ? `${slug}-hero.webp`
        : `${slug}-${index}.webp`

    const key = `${productId}/${filename}`

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.HETZNER_S3_BUCKET!,
        Key: key,
        Body: webp,
        ContentType: 'image/webp',
      })
    )

    const url = `${process.env.HETZNER_PUBLIC_BASE_URL}/${key}`

    return NextResponse.json({ url })
  } catch (err: any) {
    console.error('UPLOAD ERROR:', err)

    return NextResponse.json(
      {
        error: 'Image upload failed',
        details: err?.message || String(err),
      },
      { status: 500 }
    )
  }
}
