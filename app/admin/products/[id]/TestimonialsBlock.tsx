import { useRef } from 'react'
import { Testimonial } from './useProductEditor'
import { Star, Trash2, GripVertical, Plus, MessageSquare, EyeOff, Eye } from 'lucide-react'

export default function TestimonialsBlock({
  testimonials,
  setTestimonials,
}: {
  testimonials: Testimonial[]
  setTestimonials: (t: Testimonial[]) => void
}) {
  const dragIndex = useRef<number | null>(null)

  const onDragStart = (i: number) => {
    dragIndex.current = i
  }

  const onDrop = (i: number) => {
    if (dragIndex.current === null) return
    const copy = [...testimonials]
    const [moved] = copy.splice(dragIndex.current, 1)
    copy.splice(i, 0, moved)
    setTestimonials(copy)
    dragIndex.current = null
  }

  return (
    <div className="bg-white border border-neutral-100 rounded-[32px] p-8 space-y-8 overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-black text-neutral-900 uppercase tracking-tight flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-orange-500" />
            Customer Testimonials
          </h2>
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-1">Social proof displayed on the storefront</p>
        </div>
        <button
          type="button"
          onClick={() =>
            setTestimonials([
              ...testimonials,
              { quote: '', name: '', rating: 5 },
            ])
          }
          className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 transition-all shadow-lg shadow-neutral-200"
        >
          <Plus className="w-3.5 h-3.5" />
          New Review
        </button>
      </div>

      <div className="space-y-4">
        {testimonials.map((t, i) => (
          <div
            key={i}
            draggable
            onDragStart={() => onDragStart(i)}
            onDragOver={e => e.preventDefault()}
            onDrop={() => onDrop(i)}
            className="group p-6 bg-neutral-50/50 rounded-3xl border border-neutral-100 transition-all hover:bg-white hover:border-blue-100 hover:shadow-sm flex gap-4"
          >
            <div className="flex flex-col items-center gap-2 cursor-move opacity-30 group-hover:opacity-100 transition-opacity">
              <GripVertical className="w-4 h-4 text-neutral-400" />
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => {
                        const copy = [...testimonials]
                        copy[i].rating = star
                        setTestimonials(copy)
                      }}
                      className={`transition-all ${star <= t.rating ? 'text-orange-400 scale-110' : 'text-neutral-200 hover:text-orange-200'}`}
                    >
                      <Star className={`w-3 h-3 ${star <= t.rating ? 'fill-current' : ''}`} />
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const copy = [...testimonials]
                      copy[i].hidden = !t.hidden
                      setTestimonials(copy)
                    }}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${t.hidden ? 'bg-neutral-100 text-neutral-400' : 'bg-blue-50 text-blue-600'}`}
                    title={t.hidden ? 'Show Review' : 'Hide Review'}
                  >
                    {t.hidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setTestimonials(
                        testimonials.filter((_, idx) => idx !== i)
                      )
                    }
                    className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <textarea
                className="w-full bg-transparent text-sm font-medium text-neutral-600 placeholder:text-neutral-300 outline-none resize-none"
                rows={2}
                value={t.quote}
                placeholder="Customer's feedback..."
                onChange={e => {
                  const copy = [...testimonials]
                  copy[i].quote = e.target.value
                  setTestimonials(copy)
                }}
              />

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-100">
                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Customer Name</span>
                  <input
                    className="w-full bg-transparent text-xs font-black text-neutral-900 outline-none"
                    value={t.name}
                    placeholder="e.g. Rahul S."
                    onChange={e => {
                      const copy = [...testimonials]
                      copy[i].name = e.target.value
                      setTestimonials(copy)
                    }}
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Location</span>
                  <input
                    className="w-full bg-transparent text-xs font-black text-neutral-900 outline-none"
                    value={t.location || ''}
                    placeholder="e.g. Mumbai"
                    onChange={e => {
                      const copy = [...testimonials]
                      copy[i].location = e.target.value
                      setTestimonials(copy)
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {testimonials.length === 0 && (
          <div className="py-12 border-2 border-dashed border-neutral-50 rounded-[32px] text-center">
            <p className="text-xs font-bold text-neutral-300 uppercase tracking-widest italic">No testimonials added yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
