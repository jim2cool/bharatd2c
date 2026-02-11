import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function SuperAdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    // 1. Get User
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // 2. Get Profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    // Strict Role Check AND Email Override for Bootstrapping
    const isSuperAdmin = profile?.role === 'super_admin' || user.email === 'shashwat@e4a.in'

    if (!isSuperAdmin) {
        redirect('/admin?error=unauthorized')
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* SIDEBAR */}
            <aside className="w-64 bg-black text-white p-6">
                <div className="mb-8">
                    <h1 className="text-xl font-bold">Bharat D2C</h1>
                    <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Super Admin</p>
                </div>

                <nav className="space-y-2">
                    <NavLink href="/super-admin">Dashboard</NavLink>
                    <NavLink href="/super-admin/stores">All Stores</NavLink>
                    <NavLink href="/super-admin/users">Users</NavLink>
                    <NavLink href="/super-admin/billing">Billing & Plans</NavLink>
                    <NavLink href="/super-admin/settings">Platform Settings</NavLink>
                </nav>

                <div className="mt-auto pt-8 border-t border-gray-800">
                    <Link href="/admin" className="block text-sm text-gray-400 hover:text-white">
                        Switch to Store View
                    </Link>
                </div>
            </aside>

            {/* CONTENT */}
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="block py-2 px-3 rounded hover:bg-gray-800 transition-colors text-sm font-medium"
        >
            {children}
        </Link>
    )
}
