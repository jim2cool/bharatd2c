'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '../../lib/supabase-browser'
import LogoutButton from './logout-button'

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabaseBrowser.auth.getSession()

      if (!session) {
        router.replace('/')
      } else {
        setEmail(session.user.email ?? null)
        setLoading(false)
      }
    }

    checkSession()
  }, [router])

  if (loading) {
    return (
      <main className="p-6">
        <p>Checking authentication…</p>
      </main>
    )
  }

  return (
    <main className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
		<a
			href="/admin/store"
			className="inline-block mb-4 bg-black text-white px-4 py-2 rounded"
		>
		Create Store
		</a>
		<a
			href="/admin/orders"
			className="inline-block mb-4 ml-2 bg-black text-white px-4 py-2 rounded"
		>
			Orders
		</a>

        <LogoutButton />
      </div>

      <p className="text-gray-600">
        You are logged in as <strong>{email}</strong>
      </p>
    </main>
  )
}
