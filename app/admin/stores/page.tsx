'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { TableSkeleton } from '../components/AdminSkeletons'

type Store = {
  id: string
  name: string
  store_code?: string | null
  domain?: string | null
}

export default function StoresPage() {
  const router = useRouter()
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStores()
  }, [])

  const loadStores = async () => {
    setLoading(true)

    // 1. Get current user
    const { data: { user } } = await supabaseBrowser.auth.getUser()
    if (!user) {
      setLoading(false)
      return
    }

    // 2. Fetch stores where the user is an owner/admin via store_roles OR owner_id
    // To do this reliably with Supabase we can fetch roles first, or just query stores directly and let RLS handle it if RLS is set up,
    // but the most reliable way without auth context issues is to query store_roles.
    const { data: roles } = await supabaseBrowser
      .from('store_roles')
      .select('store_id, stores(id, name, store_code, domain)')
      .eq('user_id', user.id)

    // Fallback: also fetch stores where owner_id is set
    const { data: directStores } = await supabaseBrowser
      .from('stores')
      .select('id, name, store_code, domain')
      .eq('owner_id', user.id)

    if (!roles && !directStores) {
      console.error('Failed to load stores')
      setLoading(false)
      return
    }

    const uniqueStores = new Map()
    roles?.forEach((r: any) => {
      if (r.stores) {
        uniqueStores.set(r.stores.id, r.stores)
      }
    })
    directStores?.forEach((s: any) => {
      uniqueStores.set(s.id, s)
    })

    const data = Array.from(uniqueStores.values())

    setStores(data || [])
    setLoading(false)
  }

  const selectStore = (storeId: string) => {
    localStorage.setItem('easy_active_store_id', storeId)
    document.cookie = `easy_active_store_id=${storeId}; path=/; SameSite=Lax`
    router.push('/admin/products')
  }

  if (loading) {
    return (
      <div className="p-6 space-y-4 max-w-4xl">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6" />
        <TableSkeleton rows={3} cols={4} />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Stores</h1>

        <button
          onClick={() => router.push('/admin/stores/new')}
          className="px-4 py-2 bg-black text-white rounded text-sm"
        >
          Create store
        </button>
      </div>

      {/* TABLE */}
      <table className="w-full border text-sm bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th className="border px-3 py-2 text-left">Name</th>
            <th className="border px-3 py-2">Code</th>
            <th className="border px-3 py-2">Domain</th>
            <th className="border px-3 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {stores.map(store => (
            <tr key={store.id}>
              <td className="border px-3 py-2">{store.name}</td>
              <td className="border px-3 py-2">
                {store.store_code || '—'}
              </td>
              <td className="border px-3 py-2">
                {store.domain || '—'}
              </td>
              <td className="border px-3 py-2 text-right">
                <button
                  onClick={() => selectStore(store.id)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Manage
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
