import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export default async function UsersPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Basic Role Check (Safety)
    if (!user) redirect('/login')

    const { data: users } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-black">Users & Roles</h1>
                {/* Placeholder for Invite Modal trigger */}
                <button className="px-4 py-2 bg-black text-white rounded text-sm font-medium">
                    + Invite Admin
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 font-medium text-gray-500">Email</th>
                            <th className="px-6 py-3 font-medium text-gray-500">Role</th>
                            <th className="px-6 py-3 font-medium text-gray-500">Store ID</th>
                            <th className="px-6 py-3 font-medium text-gray-500">Joined</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y text-gray-900">
                        {users?.map((user: any) => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium">{user.email}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium capitalize ${user.role === 'super_admin' ? 'bg-purple-100 text-purple-700' :
                                        user.role === 'store_owner' ? 'bg-blue-50 text-blue-700' :
                                            'bg-gray-100 text-gray-700'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500 text-xs font-mono">{user.store_id || '-'}</td>
                                <td className="px-6 py-4 text-gray-500">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                        {(!users || users.length === 0) && (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
