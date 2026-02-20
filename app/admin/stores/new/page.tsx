'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase-browser'

export default function NewStorePage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isAutoGenerating, setIsAutoGenerating] = useState(true)

  // Auto-generate store code from name
  const generateCode = (name: string) => {
    const clean = name.trim().replace(/[^a-zA-Z\s]/g, '')
    const words = clean.split(/\s+/).filter(Boolean)

    let generated = ''
    if (words.length >= 2) {
      // Take first letter of each word (up to 4)
      generated = words.map(w => w[0]).join('').slice(0, 4)
    } else if (words.length === 1) {
      // Take first 3-4 characters
      generated = words[0].slice(0, 3)
      if (words[0].length >= 4) generated = words[0].slice(0, 4)
    }

    return generated.toUpperCase()
  }

  const handleNameChange = (newName: string) => {
    setName(newName)
    if (isAutoGenerating) {
      setCode(generateCode(newName))
    }
  }

  const createStore = async () => {
    if (!name.trim()) {
      setError('Store name is required')
      return
    }

    if (!code.trim()) {
      setError('Store code is required for order numbering')
      return
    }

    setLoading(true)
    setError(null)

    const { data, error } = await supabaseBrowser
      .from('stores')
      .insert({
        name: name.trim(),
        store_code: code.trim().toUpperCase(),
      })
      .select()
      .single()

    setLoading(false)

    if (error || !data) {
      console.error('CREATE STORE ERROR', error)
      setError(error?.message || 'Failed to create store')
      return
    }

    // auto-select new store
    document.cookie = `easy_active_store_id=${data.id}; path=/; SameSite=Lax`

    router.push(`/admin/stores/${data.id}`)
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-6 space-y-8">
      <h1 className="text-3xl font-black text-slate-900 tracking-tight">Create your store</h1>

      {error && (
        <div className="text-sm text-red-600 font-bold p-3 bg-red-50 rounded-xl border border-red-100">{error}</div>
      )}

      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Store name</label>
        <input
          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300 shadow-sm"
          value={name}
          onChange={e => handleNameChange(e.target.value)}
          placeholder="e.g. My Premium Store"
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Store code (Required)</label>
        <input
          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300 shadow-sm uppercase"
          value={code}
          onChange={e => {
            setCode(e.target.value)
            setIsAutoGenerating(false) // Disable auto-gen when user interacts
          }}
          placeholder="e.g. MYSTORE"
        />
        <p className="text-[9px] text-slate-400 font-medium">Used as prefix for order numbers. e.g. {code || 'CODE'}-0226-000001</p>
      </div>

      <button
        onClick={createStore}
        disabled={loading}
        className="w-full bg-slate-900 text-white hover:bg-black py-4 rounded-xl font-black text-sm uppercase tracking-widest shadow-lg transition-all active:scale-[0.98] disabled:opacity-50"
      >
        {loading ? 'Initializing Store…' : 'Create store'}
      </button>
    </div>
  )
}
