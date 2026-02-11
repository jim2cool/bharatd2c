import { createClient } from '@/lib/supabase-server'

export default async function SuperAdminDashboard() {
    const supabase = await createClient()

    // Fetch Stores
    const { data: stores } = await supabase
        .from('stores')
        .select('*')
        .order('created_at', { ascending: false })

    // Fetch Users
    const { data: users } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-black border-b pb-4">Super Admin Dashboard</h1>

            {/* STORES SECTION */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-black">All Stores ({stores?.length || 0})</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                            <tr>
                                <th className="px-4 py-3">Store Name</th>
                                <th className="px-4 py-3">Code</th>
                                <th className="px-4 py-3">Domain</th>
                                <th className="px-4 py-3 text-right">Created</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {stores?.map((store) => (
                                <tr key={store.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-black">{store.name}</td>
                                    <td className="px-4 py-3 text-gray-600">{store.store_code}</td>
                                    <td className="px-4 py-3 text-blue-600">{store.custom_domain || '-'}</td>
                                    <td className="px-4 py-3 text-right text-gray-500">
                                        {new Date(store.created_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                            {(!stores || stores.length === 0) && (
                                <tr>
                                    <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                                        No stores found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* USERS SECTION */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-black">All Users ({users?.length || 0})</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                            <tr>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Role</th>
                                <th className="px-4 py-3">First Name</th>
                                <th className="px-4 py-3 text-right">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users?.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-black">{user.email}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'super_admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">{user.first_name || '-'}</td>
                                    <td className="px-4 py-3 text-right text-gray-500">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
