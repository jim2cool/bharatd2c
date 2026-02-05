'use client'

import { useRef } from 'react'

export default function ProductImagesBlock({
  images,
  setImages,
  productId,
  productTitle,
}: {
  images: string[]
  setImages: (imgs: string[]) => void
  productId: string
  productTitle: string
}) {
  const dragIndex = useRef<number | null>(null)

  const onDragStart = (i: number) => {
    dragIndex.current = i
  }

  const onDrop = (i: number) => {
    if (dragIndex.current === null) return
    const copy = [...images]
    const [moved] = copy.splice(dragIndex.current, 1)
    copy.splice(i, 0, moved)
    setImages(copy)
    dragIndex.current = null
  }

  const uploadImage = async (file: File) => {
    const form = new FormData()
    form.append('file', file)
    form.append('productId', productId)
    form.append('productTitle', productTitle)
    form.append('index', String(images.length))

    const res = await fetch('/api/admin/upload-product-image', {
      method: 'POST',
      body: form,
    })

    const data = await res.json()
    if (data.url) setImages([...images, data.url])
  }

  return (
    <section className="bg-white border rounded p-6">
      <h2 className="font-semibold mb-4">Product images</h2>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {images.map((img, i) => (
          <div
            key={i}
            draggable
            onDragStart={() => onDragStart(i)}
            onDragOver={e => e.preventDefault()}
            onDrop={() => onDrop(i)}
            className="border rounded p-2 cursor-move"
          >
            <img
              src={img}
              className="aspect-square object-cover rounded"
            />
            {i === 0 && (
              <div className="text-xs text-center mt-1 text-green-600">
                Hero image
              </div>
            )}
            <button
              onClick={() =>
                setImages(images.filter((_, idx) => idx !== i))
              }
              className="text-xs underline mt-1"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={e => {
          if (e.target.files?.[0]) uploadImage(e.target.files[0])
        }}
      />
    </section>
  )
}
