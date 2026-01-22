'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '../../../lib/supabase-browser'

export default function CreateStorePage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [domain, setDomain] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCreate = async () => {
    setLoading(true)
    setError(null)

    const { error } = await supabaseBrowser.from('stores').insert({
      name,
      domain,
      cod_enabled: true,
      cod_confirmation_enabled: false,
      buy_now_only_default: true,
    })

    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      router.push('/admin')
    }
  }

  return (
    <main className="p-6 max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Create Store</h1>

      <input
        placeholder="Store name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border p-2 mb-3 text-black"
      />

      <input
        placeholder="Primary domain (e.g. example.com)"
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
        className="w-full border p-2 mb-3 text-black"
      />

      {error && <p className="text-red-600 mb-3">{error}</p>}

      <button
        onClick={handleCreate}
        disabled={loading || !name}
        className="bg-black text-white px-4 py-2"
      >
        {loading ? 'Creating…' : 'Create Store'}
      </button>
    </main>
  )
}

