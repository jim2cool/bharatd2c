'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase-browser'

// Helper to slugify store name
function slugify(text: string) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-')   // Replace multiple - with single -
}

export default function OnboardingPage() {
    const router = useRouter()
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
    const [step, setStep] = useState(1)
    const [storeName, setStoreName] = useState('')
    const [storeSlug, setStoreSlug] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabaseBrowser.auth.getUser()
            if (!user) {
                setIsAuthenticated(false)
                return
            }

            // Guard: Super Admins should not be here
            const { data: profile } = await supabaseBrowser
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single()

            if (profile?.role === 'super_admin') {
                router.push('/super-admin')
                return
            }

            setIsAuthenticated(true)
        }
        checkAuth()
    }, [router])

    const handleCreateStore = async () => {
        setLoading(true)
        setError(null)

        try {
            const { data: { user } } = await supabaseBrowser.auth.getUser()
            if (!user) throw new Error('Not authenticated')

            // 1. Check existing profile
            const { data: existingProfile } = await supabaseBrowser
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single()

            const newRole = existingProfile?.role === 'super_admin' ? 'super_admin' : 'store_owner'

            const { error: profileError } = await supabaseBrowser
                .from('profiles')
                .upsert({
                    id: user.id,
                    email: user.email,
                    role: newRole
                }, { onConflict: 'id' })

            if (profileError) throw profileError

            // 2. Create Store
            const { data: store, error: storeError } = await supabaseBrowser
                .from('stores')
                .insert({
                    name: storeName,
                    slug: storeSlug,
                    owner_id: user.id,
                    subscription_plan: 'free',
                    theme_config: {},
                    is_active: true
                })
                .select()
                .single()

            if (storeError) {
                if (storeError.code === '23505') {
                    throw new Error('Store URL is already taken. Please choose another.')
                }
                throw storeError
            }

            // 3. Update Profile with store_id
            await supabaseBrowser
                .from('profiles')
                .update({ store_id: store.id })
                .eq('id', user.id)

            // 4. Redirect
            router.push('/admin')

        } catch (err: any) {
            console.error(err)
            setError(err.message || 'Failed to create store')
        } finally {
            setLoading(false)
        }
    }

    if (isAuthenticated === false) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-sm w-full text-center">
                    <h2 className="text-xl font-bold mb-4">You're not logged in</h2>
                    <p className="text-gray-600 mb-6">Please sign in to your account to continue setting up your store.</p>
                    <button
                        onClick={() => router.push('/login')}
                        className="w-full bg-black text-white py-2 rounded-md font-medium"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        )
    }

    if (isAuthenticated === null) return null

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Welcome to Bharat D2C
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Let's verify your details and set up your store.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {error && (
                        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-6">
                        <div>
                            <label htmlFor="storeName" className="block text-sm font-medium text-gray-700">
                                Store Name
                            </label>
                            <div className="mt-1">
                                <input
                                    id="storeName"
                                    name="storeName"
                                    type="text"
                                    required
                                    value={storeName}
                                    onChange={(e) => {
                                        setStoreName(e.target.value)
                                        setStoreSlug(slugify(e.target.value))
                                    }}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                                    placeholder="e.g. My Awesome Brand"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="storeSlug" className="block text-sm font-medium text-gray-700">
                                Store URL
                            </label>
                            <div className="mt-1 flex rounded-md shadow-sm">
                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                                    https://
                                </span>
                                <input
                                    id="storeSlug"
                                    name="storeSlug"
                                    type="text"
                                    required
                                    value={storeSlug}
                                    onChange={(e) => setStoreSlug(slugify(e.target.value))}
                                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-black focus:border-black sm:text-sm"
                                />
                                <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                                    .platform.com
                                </span>
                            </div>
                        </div>

                        <div>
                            <button
                                onClick={handleCreateStore}
                                disabled={loading || !storeName || !storeSlug}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Creating Store...' : 'Create My Store'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
