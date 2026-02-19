import { Link, useLocation } from 'react-router-dom'

export default function Sidebar() {
  const location = useLocation()
  const links = [
    { name: 'Dashboard', path: '/' },
    { name: 'Inventory', path: '/inventory' },
    { name: 'Add Item', path: '/inventory/add' },
  ]

  return (
    <aside className="w-64 bg-white h-screen shadow-md p-6">
      <nav className="flex flex-col gap-4">
        {links.map(link => (
          <Link
            key={link.path}
            to={link.path}
            className={`px-3 py-2 rounded-md font-medium ${
              location.pathname === link.path ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
