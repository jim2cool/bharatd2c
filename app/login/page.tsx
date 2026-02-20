'use client'

import { useState } from 'react'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Chrome } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGoogleLogin = async () => {
    const { error } = await supabaseBrowser.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) setError(error.message)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

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
      // Just redirect to /admin and let the dashboard handle store selection/onboarding check
      console.log('Login: Successful auth, redirecting to /admin')
      router.push('/admin')
    } catch (err) {
      console.error('Login: Redirection error:', err)
      router.push('/onboarding')
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Admin Login</h1>
          <p className="text-slate-500 mt-2">Manage your D2C brand</p>
        </div>

        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full h-12 gap-3 font-semibold border-slate-200 hover:bg-slate-50 rounded-xl"
            onClick={handleGoogleLogin}
          >
            <Chrome className="w-5 h-5 text-red-500" />
            Continue with Google
          </Button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4 text-slate-400 text-xs font-bold uppercase tracking-wider">or</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
              <input
                type="email"
                placeholder="you@brand.com"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-medium focus:ring-2 focus:ring-slate-900 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-medium focus:ring-2 focus:ring-slate-900 outline-none transition-all"
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm font-medium text-center bg-red-50 py-2 rounded-lg">{error}</p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-500 font-medium">
            Don't have an account?{' '}
            <button
              onClick={() => router.push('/signup')}
              className="text-slate-900 font-bold hover:underline"
            >
              Start Free Trial
            </button>
          </p>
        </div>
      </div>
    </main>
  )
}
