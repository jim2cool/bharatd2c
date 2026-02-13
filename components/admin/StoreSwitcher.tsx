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
    async function loadStores() {
      // Get current user
      const { data: { user } } = await supabaseBrowser.auth.getUser()
      if (!user) return

      // Load stores owned by this user
      const { data, error } = await supabaseBrowser
        .from('stores')
        .select('id, name')
        .eq('owner_id', user.id)
        .order('created_at')

      if (error) {
        console.error('Failed to load stores:', error)
        return
      }

      const list = data || []
      setStores(list)

      if (list.length === 0) return

      const existing = getActiveStoreIdClient()

      // 🔑 AUTO-HEAL: if no active store or existing one is not in the list, pick first
      const isValid = existing && list.some(s => s.id === existing)
      if (!isValid) {
        localStorage.setItem('bharat_active_store_id', list[0].id)
        setActive(list[0].id)
      } else {
        setActive(existing)
      }
    }

    loadStores()
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
