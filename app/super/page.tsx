'use client'

import { useState } from 'react'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'

export default function SuperLoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleLogin = async () => {
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

        // Strict Role Check for Super Admin
        try {
            const { data: profile } = await supabaseBrowser
                .from('profiles')
                .select('role')
                .eq('id', data.user.id)
                .single()

            // Allow if role is super_admin OR specific email override
            const isSuperAdmin = profile?.role === 'super_admin' || data.user.email === 'shashwat@e4a.in'

            if (isSuperAdmin) {
                router.push('/super-admin')
            } else {
                setError('Access Denied. You do not have Super Admin privileges.')
                await supabaseBrowser.auth.signOut()
                setLoading(false)
            }
        } catch (err) {
            console.error('Super Login: Role verify error:', err)
            setError('Failed to verify role.')
            await supabaseBrowser.auth.signOut()
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
            <div className="w-full max-w-sm bg-gray-900 p-8 rounded-xl shadow-2xl border border-gray-800">
                <div className="mb-8 text-center">
                    <div className="inline-block p-3 bg-blue-600/10 rounded-full mb-4">
                        <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        Platform Console
                    </h1>
                    <p className="text-gray-500 text-sm mt-2 font-medium">Restricted Personnel Only</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1.5 ml-1">ADMIN EMAIL</label>
                        <input
                            type="email"
                            placeholder="admin@platform.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black border border-gray-800 p-3.5 rounded-lg text-white placeholder:text-gray-700 focus:outline-none focus:border-blue-500 transition-all duration-200 shadow-inner"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1.5 ml-1">KEY CODE</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black border border-gray-800 p-3.5 rounded-lg text-white placeholder:text-gray-700 focus:outline-none focus:border-blue-500 transition-all duration-200 shadow-inner"
                        />
                    </div>
                </div>

                {error && (
                    <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center font-medium animate-pulse">
                        {error}
                    </div>
                )}

                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-lg mt-8 shadow-lg shadow-blue-900/20 active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Validating Credentials...
                        </span>
                    ) : 'Initialize Session'}
                </button>

                <div className="mt-8 pt-6 border-t border-gray-800 text-center">
                    <p className="text-gray-600 text-[11px] font-medium uppercase tracking-tighter">
                        Powered by Bharat D2C Engine v2.0
                    </p>
                </div>
            </div>
        </main>
    )
}
