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

  const createStore = async () => {
    if (!name.trim()) {
      setError('Store name is required')
      return
    }

    setLoading(true)
    setError(null)

    const { data, error } = await supabaseBrowser
      .from('stores')
      .insert({
        name,
        store_code: code || null,
      })
      .select()
      .single()

    setLoading(false)

    if (error || !data) {
      setError('Failed to create store')
      return
    }

    // auto-select new store
    document.cookie = `easy_active_store_id=${data.id}; path=/; SameSite=Lax`

    router.push(`/admin/stores/${data.id}`)
  }

  return (
    <div className="max-w-xl p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Create store</h1>

      {error && (
        <div className="text-sm text-red-600">{error}</div>
      )}

      <div>
        <label className="text-sm font-medium">Store name</label>
        <input
          className="w-full border rounded px-3 py-2 mt-1"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm font-medium">Store code (optional)</label>
        <input
          className="w-full border rounded px-3 py-2 mt-1"
          value={code}
          onChange={e => setCode(e.target.value)}
        />
      </div>

      <button
        onClick={createStore}
        title="Create Easy Store"
        disabled={loading}
        className="px-4 py-2 bg-black text-white rounded"
      >
        {loading ? 'Creating…' : 'Create store'}
      </button>
    </div>
  )
}
