'use client'

import { useRef } from 'react'
import { Testimonial } from './useProductEditor'

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
    <section className="bg-white border rounded p-6">
      <h2 className="font-semibold mb-1">Customer testimonials</h2>
      <p className="text-sm text-gray-500 mb-4">
        Social proof shown on the product page.
      </p>

      {testimonials.map((t, i) => (
        <div
          key={i}
          draggable
          onDragStart={() => onDragStart(i)}
          onDragOver={e => e.preventDefault()}
          onDrop={() => onDrop(i)}
          className="border rounded p-4 mb-4 bg-gray-50 cursor-move"
        >
          {/* Quote */}
          <label className="block mb-3">
            <span className="text-sm font-medium">Quote</span>
            <textarea
              className="w-full border rounded px-3 py-2 mt-1"
              rows={3}
              value={t.quote}
              onChange={e => {
                const copy = [...testimonials]
                copy[i].quote = e.target.value
                setTestimonials(copy)
              }}
            />
          </label>

          {/* Name + Location */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <label>
              <span className="text-sm font-medium">Name</span>
              <input
                className="border rounded px-3 py-2 w-full mt-1"
                value={t.name}
                onChange={e => {
                  const copy = [...testimonials]
                  copy[i].name = e.target.value
                  setTestimonials(copy)
                }}
              />
            </label>

            <label>
              <span className="text-sm font-medium">Location</span>
              <input
                className="border rounded px-3 py-2 w-full mt-1"
                value={t.location || ''}
                onChange={e => {
                  const copy = [...testimonials]
                  copy[i].location = e.target.value
                  setTestimonials(copy)
                }}
              />
            </label>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2">
              <span className="text-sm font-medium">Rating</span>
              <input
                type="number"
                min={1}
                max={5}
                className="border rounded px-3 py-2 w-24"
                value={t.rating}
                onChange={e => {
                  const copy = [...testimonials]
                  copy[i].rating = Number(e.target.value)
                  setTestimonials(copy)
                }}
              />
            </label>

            <div className="flex items-center gap-4 text-sm">
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={t.hidden || false}
                  onChange={e => {
                    const copy = [...testimonials]
                    copy[i].hidden = e.target.checked
                    setTestimonials(copy)
                  }}
                />
                Hidden
              </label>

              <button
                onClick={() =>
                  setTestimonials(
                    testimonials.filter((_, idx) => idx !== i)
                  )
                }
                className="text-red-600 underline"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={() =>
          setTestimonials([
            ...testimonials,
            { quote: '', name: '', rating: 5 },
          ])
        }
        className="text-sm underline"
      >
        + Add testimonial
      </button>
    </section>
  )
}
