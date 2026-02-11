'use client'

import { useState } from 'react'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'

import { autoConfirmUser } from '@/app/actions/auth'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSignUp, setIsSignUp] = useState(false)

  const handleAuth = async () => {
    setLoading(true)
    setError(null)

    if (isSignUp) {
      // 1. Sign Up
      const { data, error: signUpError } = await supabaseBrowser.auth.signUp({
        email,
        password,
      })

      if (signUpError) {
        setLoading(false)
        setError(signUpError.message)
        return
      }

      // 2. Auto Confirm if needed
      if (!data?.session && data?.user) {
        const { success, error: confirmError } = await autoConfirmUser(data.user.id)

        if (!success) {
          setLoading(false)
          setError('Failed to auto-confirm account: ' + confirmError)
          return
        }

        // 3. Sign In (since we now have a confirmed account but no session yet)
        const { error: signInError } = await supabaseBrowser.auth.signInWithPassword({
          email,
          password,
        })

        if (signInError) {
          setLoading(false)
          setError(signInError.message)
          return
        }
      }

      router.push('/onboarding')
    } else {
      const { data, error: signInError } = await supabaseBrowser.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setLoading(false)
        setError(signInError.message)
        return
      }

      try {
        // 1. Check if user has ANY stores
        const { data: stores } = await supabaseBrowser
          .from('stores')
          .select('id')
          .eq('owner_id', data.user.id)
          .limit(1)

        if (stores && stores.length > 0) {
          // User already has a store, go to admin
          const activeStoreId = localStorage.getItem('bharat_active_store_id')
          if (!activeStoreId) {
            localStorage.setItem('bharat_active_store_id', stores[0].id)
            document.cookie = `bharat_active_store_id=${stores[0].id}; path=/; SameSite=Lax`
          }
          router.push('/admin')
        } else {
          // No stores yet, go to onboarding
          router.push('/onboarding')
        }
      } catch (err) {
        console.error('Login: Redirection error:', err)
        router.push('/onboarding')
      }
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-sm bg-white p-6 rounded shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-black text-center">
          {isSignUp ? 'Create Account' : 'Admin Login'}
        </h1>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded text-black focus:outline-none focus:border-black transition-colors"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded text-black focus:outline-none focus:border-black transition-colors"
          />
        </div>

        {error && (
          <p className="text-red-600 text-sm mt-4 text-center">{error}</p>
        )}

        <button
          onClick={handleAuth}
          disabled={loading}
          className="w-full bg-black text-white font-medium py-3 rounded mt-6 hover:bg-gray-900 transition-colors disabled:opacity-70"
        >
          {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
        </button>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError(null)
            }}
            className="text-sm text-gray-600 hover:text-black hover:underline"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </main>
  )
}
