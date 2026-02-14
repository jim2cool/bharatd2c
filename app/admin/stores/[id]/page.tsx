'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { getActiveStoreIdClient } from '@/lib/getActiveStore.client'


type Store = {
  id: string
  name: string
  store_code: string | null
  domain: string | null
  is_active: boolean
  cod_enabled: boolean
  buy_now_only_default: boolean
  created_at: string
}

export default function StoreSettingsPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()

  const [store, setStore] = useState<Store | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /* -------------------------------------------------
     SYNC ROUTE STORE → ACTIVE STORE (CRITICAL)
  ------------------------------------------------- */
  useEffect(() => {
    if (!id) {
      router.replace('/admin/stores')
      return
    }
    localStorage.setItem('easy_active_store_id', id)
  }, [id, router])

  /* -------------------------------------------------
     LOAD STORE
  ------------------------------------------------- */
  useEffect(() => {
    if (!id) return

    setLoading(true)
    setError(null)

    supabaseBrowser
      .from('stores')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          console.error('LOAD STORE ERROR', error)
          setError('Failed to load store')
          setLoading(false)
          return
        }

        setStore({
          ...data,
          is_active: !!data.is_active,
          cod_enabled: !!data.cod_enabled,
          buy_now_only: !!data.buy_now_only,
        })
        setLoading(false)
      })
  }, [id])

  /* -------------------------------------------------
     SAVE
  ------------------------------------------------- */
  const save = async () => {
    if (!store) return

    setSaving(true)
    setError(null)

    const { error } = await supabaseBrowser
      .from('stores')
      .update({
        name: store.name,
        domain: store.domain,
        is_active: store.is_active,
        cod_enabled: store.cod_enabled,
        buy_now_only_default: store.buy_now_only_default,
      })
      .eq('id', store.id)

    if (error) {
      console.error('SAVE STORE ERROR', error)
      setError('Failed to save changes')
      setSaving(false)
      return
    }

    setSaving(false)
  }

  /* -------------------------------------------------
     GUARDS
  ------------------------------------------------- */
  if (loading) {
    return <div className="p-6">Loading store settings…</div>
  }

  if (!store) {
    return (
      <div className="p-6 text-red-600">
        Failed to load store. Check store ID or permissions.
      </div>
    )
  }

  const activeStoreId = getActiveStoreIdClient()
  const isCurrentStore = activeStoreId === store.id

  /* -------------------------------------------------
     UI
  ------------------------------------------------- */
  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Store settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage store identity and operations.
        </p>
      </div>

      {error && (
        <div className="border border-red-200 bg-red-50 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* IDENTITY */}
      <Section title="Store identity">
        <Field label="Store name">
          <input
            className="border rounded px-3 py-2 w-full"
            value={store.name}
            onChange={e => setStore({ ...store, name: e.target.value })}
          />
        </Field>

        <Field label="Store code">
          <input
            className="border rounded px-3 py-2 w-full bg-gray-50"
            value={store.store_code || ''}
            disabled
          />
        </Field>

        <Field label="Domain">
          <input
            className="border rounded px-3 py-2 w-full"
            placeholder="example.com"
            value={store.domain || ''}
            onChange={e =>
              setStore({ ...store, domain: e.target.value })
            }
          />
          <p className="text-xs text-gray-500 mt-1">
            Used for custom domain mapping and storefront routing.
          </p>
        </Field>
      </Section>

      {/* OPERATIONS */}
      <Section title="Operations">
        <Toggle
          label="Store active"
          hint={
            isCurrentStore
              ? 'You cannot deactivate the currently active store'
              : undefined
          }
          checked={!!store.is_active}
          disabled={isCurrentStore}
          onChange={v => setStore({ ...store, is_active: v })}
        />

        <Toggle
          label="Cash on Delivery (COD)"
          checked={!!store.cod_enabled}
          onChange={v => setStore({ ...store, cod_enabled: v })}
        />

        <Toggle
          label="Buy Now only mode"
          hint="Disables cart and forces instant checkout"
          checked={!!store.buy_now_only_default}
          onChange={v =>
            setStore({ ...store, buy_now_only_default: v })
          }
        />
      </Section>

      {/* META */}
      <Section title="Store metadata">
        <Meta label="Store ID" value={store.id} />
        <Meta
          label="Created"
          value={new Date(store.created_at).toLocaleString('en-IN')}
        />
      </Section>

      {/* SAVE */}
      <div className="pt-4">
        <button
          onClick={save}
          disabled={saving}
          className="px-6 py-2 bg-black text-white rounded"
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </div>
  )
}

/* -------------------------------------------------
   UI HELPERS
------------------------------------------------- */

function Section({ title, children }: any) {
  return (
    <section className="bg-white border rounded p-6 space-y-4">
      <h2 className="font-medium">{title}</h2>
      {children}
    </section>
  )
}

function Field({ label, children }: any) {
  return (
    <label className="block">
      <div className="text-sm font-medium mb-1">{label}</div>
      {children}
    </label>
  )
}

function Toggle({
  label,
  hint,
  checked,
  onChange,
  disabled,
}: {
  label: string
  hint?: string
  checked: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
}) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-4 py-2 border-b last:border-b-0">
      <div>
        <div className="text-sm font-medium">{label}</div>
        {hint && <div className="text-xs text-gray-500">{hint}</div>}
      </div>

      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={e => onChange(e.target.checked)}
        className="h-4 w-4 accent-black disabled:opacity-50"
      />
    </div>
  )
}

function Meta({ label, value }: any) {
  return (
    <div className="text-sm">
      <span className="text-gray-500">{label}:</span>{' '}
      <span className="font-mono">{value}</span>
    </div>
  )
}
