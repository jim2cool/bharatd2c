'use client'

import { supabaseBrowser } from '../../lib/supabase-browser'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    await supabaseBrowser.auth.signOut()
    router.push('/')
  }

  return (
    <button
      onClick={handleLogout}
      className="bg-black text-white px-4 py-2 rounded"
    >
      Logout
    </button>
  )
}
