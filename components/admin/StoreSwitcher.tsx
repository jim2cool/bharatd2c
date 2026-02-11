'use client'

import { useEffect, useState } from 'react'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { getActiveStoreIdClient } from '@/lib/getActiveStore.client'

type Store = {
  id: string
  name: string
}

export default function StoreSwitcher() {
  const [stores, setStores] = useState<Store[]>([])
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    // Load stores
    supabaseBrowser
      .from('stores')
      .select('id, name')
      .order('created_at')
      .then(({ data }) => {
        const list = data || []
        setStores(list)

        if (list.length === 0) return

        const existing = getActiveStoreIdClient()

        // 🔑 AUTO-HEAL: if no active store, pick first
        if (!existing) {
          localStorage.setItem('bharat_active_store_id', list[0].id)
          setActive(list[0].id)
        } else {
          setActive(existing)
        }
      })
  }, [])

  if (stores.length === 0) return null

  const switchStore = (storeId: string) => {
    localStorage.setItem('bharat_active_store_id', storeId)
    setActive(storeId)

    // Hard reload context
    window.location.href = '/admin/products'
  }

  return (
    <select
      value={active ?? ''}
      onChange={e => switchStore(e.target.value)}
      className="
        text-sm
        border
        rounded-md
        px-3
        py-1.5
        bg-white
        hover:border-gray-400
        focus:outline-none
        focus:ring-1
        focus:ring-black
        cursor-pointer
      "
    >
      {stores.map(store => (
        <option key={store.id} value={store.id}>
          {store.name}
        </option>
      ))}
    </select>
  )
}
