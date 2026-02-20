'use client'

import { useEffect, useState } from 'react'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { getActiveStoreIdClient } from '@/lib/getActiveStore.client'

type Store = {
  id: string
  name: string
}

import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Check } from 'lucide-react'

export default function StoreSwitcher() {
  const [stores, setStores] = useState<Store[]>([])
  const [active, setActive] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    async function loadStores() {
      const { data: { user } } = await supabaseBrowser.auth.getUser()
      if (!user) return

      const [{ data: roles }, { data: directStores }] = await Promise.all([
        supabaseBrowser.from('store_roles').select('store_id, stores(id, name)').eq('user_id', user.id),
        supabaseBrowser.from('stores').select('id, name').eq('owner_id', user.id).order('created_at')
      ])

      const uniqueStores = new Map()
      roles?.forEach((r: any) => r.stores && uniqueStores.set(r.stores.id, r.stores))
      directStores?.forEach((s: any) => uniqueStores.set(s.id, s))

      const list = Array.from(uniqueStores.values())
      setStores(list)

      if (list.length === 0) return
      const existing = getActiveStoreIdClient()
      const isValid = existing && list.some(s => s.id === existing)
      if (!isValid) {
        localStorage.setItem('easy_active_store_id', list[0].id)
        setActive(list[0].id)
      } else {
        setActive(existing)
      }
    }
    loadStores()
  }, [])

  if (stores.length === 0) return null

  const switchStore = (storeId: string) => {
    localStorage.setItem('easy_active_store_id', storeId)
    setActive(storeId)
    setIsOpen(false)
    window.location.href = '/admin'
  }

  const activeStore = stores.find(s => s.id === active)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex items-center justify-between
          text-[11px] font-bold uppercase tracking-[0.1em]
          border border-slate-200 rounded-xl
          pl-5 pr-4 py-2.5 bg-white
          hover:bg-neutral-50 hover:border-slate-300 transition-all
          w-full sm:w-[220px]
          shadow-sm
          active:scale-[0.98]
        "
      >
        <span className="truncate mr-2 text-neutral-600">{activeStore?.name || 'Select Store'}</span>
        <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="
                absolute right-0 top-full mt-2 z-50
                w-full sm:w-[240px] bg-white border border-slate-200
                rounded-2xl shadow-xl shadow-slate-200/50
                overflow-hidden p-1.5
              "
            >
              <div className="p-3 border-b border-slate-50 mb-1">
                <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Switch Store</p>
              </div>
              <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                {stores.map(store => (
                  <button
                    key={store.id}
                    onClick={() => switchStore(store.id)}
                    className={`
                      w-full flex items-center justify-between px-4 py-3 rounded-xl
                      text-[11px] font-bold uppercase tracking-wider text-left
                      transition-all duration-200 group
                      ${active === store.id ? 'bg-blue-50 text-blue-600' : 'hover:bg-neutral-50 text-neutral-600'}
                    `}
                  >
                    <span className="truncate">{store.name}</span>
                    {active === store.id && <Check className="w-3.5 h-3.5" />}
                    {active !== store.id && (
                      <div className="w-1.5 h-1.5 rounded-full bg-neutral-200 group-hover:bg-blue-400 transition-colors" />
                    )}
                  </button>
                ))}
              </div>
              <div className="p-2 mt-2 border-t border-neutral-100">
                <button
                  onClick={() => window.location.href = '/admin/stores'}
                  className="w-full py-2.5 text-[10px] font-black uppercase text-center text-neutral-400 hover:text-neutral-900 transition-colors"
                >
                  Manage All Stores
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
