import LogoutButton from './logout-button'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Bar */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-gray-800">
        <h1 className="font-bold text-lg">D2C Admin</h1>
        <LogoutButton />
      </header>

      {/* Navigation */}
      <nav className="flex gap-6 px-6 py-3 border-b border-gray-800 text-sm">
  <a
    href="/admin"
    className="hover:underline font-medium"
  >
    Dashboard
  </a>

  <a
    href="/admin/orders"
    className="hover:underline"
  >
    Orders
  </a>

  <a
    href="/admin/products"
    className="hover:underline"
  >
    Products
  </a>
</nav>


      {/* Page Content */}
      <main className="px-6 py-4">{children}</main>
    </div>
  )
}
