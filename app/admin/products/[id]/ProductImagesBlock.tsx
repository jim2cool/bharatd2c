import { useRef, useState } from 'react'
import { Image as ImageIcon, Trash2, GripVertical, Upload, Star, Plus } from 'lucide-react'
import { PhotographyPrompt } from './components/PhotographyPrompt'

export default function ProductImagesBlock({
  images,
  setImages,
  productId,
  productTitle,
  moodCard = "Minimal",
  category = "fashion",
}: {
  images: { url: string; tier: 'tier1' | 'tier2' | 'tier3' }[]
  setImages: (imgs: { url: string; tier: 'tier1' | 'tier2' | 'tier3' }[] | any) => void
  productId: string
  productTitle: string
  moodCard?: string
  category?: string
}) {
  const dragIndex = useRef<number | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const MAX_IMAGES = 5

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

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    if (images.length + files.length > MAX_IMAGES) {
      alert(`Optimization Limit: You can only have a maximum of ${MAX_IMAGES} images to ensure <2s page loads.`)
      return
    }

    setIsUploading(true)
    const newItems: { url: string; tier: 'tier1' | 'tier2' | 'tier3' }[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const form = new FormData()
      form.append('file', file)
      form.append('productId', productId)
      form.append('productTitle', productTitle)
      form.append('index', String(images.length + newItems.length))

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: form,
        })
        const data = await res.json()
        if (data.url) {
          newItems.push({
            url: data.url,
            tier: 'tier1' // Default to high quality
          })
        }
      } catch (err) {
        console.error("Upload failed for file:", file.name, err)
      }
    }

    setImages([...images, ...newItems])
    setIsUploading(false)
  }

  const updateTier = (index: number, tier: 'tier1' | 'tier2' | 'tier3') => {
    const copy = [...images]
    copy[index] = { ...copy[index], tier }
    setImages(copy)
  }

  const hasWeakImage = images.some(img => img.tier === 'tier3')

  return (
    <div className="bg-white border border-neutral-100 rounded-[32px] p-8 space-y-8 overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-black text-neutral-900 uppercase tracking-tight flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-blue-500" />
            Product Gallery
          </h2>
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-1">
            Drag to reorder • Mark low-quality images for "Damage Control"
          </p>
        </div>

        {images.length < MAX_IMAGES && (
          <label className={`cursor-pointer group ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={e => handleUpload(e.target.files)}
            />
            <div className="flex items-center gap-2 px-4 py-2 bg-neutral-50 rounded-xl border border-neutral-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-all">
              {isUploading ? (
                <div className="w-3.5 h-3.5 border-2 border-neutral-300 border-t-blue-600 rounded-full animate-spin" />
              ) : (
                <Upload className="w-3.5 h-3.5 text-neutral-400 group-hover:text-blue-600" />
              )}
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 group-hover:text-blue-600">
                {isUploading ? 'Uploading...' : 'Upload Images'}
              </span>
            </div>
          </label>
        )}
      </div>

      <PhotographyPrompt moodCard={moodCard} category={category} hasWeakImage={hasWeakImage} />

      <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50 flex gap-3 items-start">
        <Star className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
        <p className="text-[11px] font-bold text-blue-900 leading-relaxed uppercase tracking-tight">
          <span className="text-blue-600">CRO Best Practice:</span> Limit your gallery to 5 high-impact shots. If an image is weak, set it to "Tier 3" so the platform can apply compensatory styling.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {images.map((img, i) => (
          <div
            key={i}
            draggable
            onDragStart={() => onDragStart(i)}
            onDragOver={e => e.preventDefault()}
            onDrop={() => onDrop(i)}
            className={`group relative aspect-square rounded-2xl border-2 overflow-hidden cursor-move transition-all ${i === 0 ? 'border-blue-500 shadow-lg shadow-blue-50' : img.tier === 'tier3' ? 'border-amber-300' : 'border-neutral-50 hover:border-blue-200'}`}
          >
            <img src={img.url} className={`w-full h-full ${img.tier === 'tier3' ? 'object-contain p-4 bg-neutral-50' : 'object-cover'}`} alt="" />

            <div className="absolute inset-0 bg-neutral-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 p-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                  className="w-8 h-8 rounded-lg bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="w-8 h-8 rounded-lg bg-white text-neutral-900 flex items-center justify-center shadow-lg pointer-events-none">
                  <GripVertical className="w-4 h-4" />
                </div>
              </div>

              {/* Tier Selector */}
              <div className="w-full flex flex-col gap-1 mt-auto">
                <p className="text-[8px] font-black text-white/70 uppercase tracking-widest text-center mb-1">Quality Tier</p>
                <div className="flex bg-black/40 p-1 rounded-lg gap-1 border border-white/10">
                  {(['tier1', 'tier2', 'tier3'] as const).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateTier(i, t);
                      }}
                      className={`flex-1 py-1 rounded text-[8px] font-black uppercase transition-all ${img.tier === t ? 'bg-white text-black' : 'text-white/40 hover:text-white hover:bg-white/10'}`}
                    >
                      {t === 'tier1' ? 'T1' : t === 'tier2' ? 'T2' : 'T3'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {i === 0 && (
              <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-blue-500 text-white rounded-md flex items-center gap-1 shadow-lg z-10">
                <Star className="w-2.5 h-2.5 fill-current" />
                <span className="text-[7px] font-black uppercase tracking-widest">Main</span>
              </div>
            )}

            {img.tier === 'tier3' && (
              <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-amber-500 text-white rounded-md flex items-center gap-1 shadow-lg z-10">
                <span className="text-[7px] font-black uppercase tracking-widest">Weak</span>
              </div>
            )}
          </div>
        ))}

        {/* Loading Skeletons */}
        {isUploading && (
          <div className="aspect-square rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/30 flex flex-col items-center justify-center gap-2 animate-pulse">
            <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-blue-400">Processing...</span>
          </div>
        )}

        {/* Add Button (only if limit not reached) */}
        {!isUploading && images.length < MAX_IMAGES && (
          <label className="aspect-square rounded-2xl border-2 border-dashed border-neutral-100 hover:border-blue-300 hover:bg-blue-50/30 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer group">
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={e => handleUpload(e.target.files)}
            />
            <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-300 group-hover:bg-blue-100 group-hover:text-blue-600 transition-all">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400 group-hover:text-blue-600">Add Image</span>
          </label>
        )}
      </div>
    </div>
  )
}
