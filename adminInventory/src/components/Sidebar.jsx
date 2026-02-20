import { Link, useLocation } from 'react-router-dom'
import o from '../assets/CORE Logo (O).png'

export default function Sidebar() {
  const location = useLocation()

  const links = [
    { name: 'Dashboard', path: '/' },
    { name: 'Inventory', path: '/inventory' },
  ]

  return (
    <aside className="w-64 bg-white h-screen border-r border-gray-200 p-6">
      
      {/* Logo / Title */}
      <div className="flex items-center gap-2 mb-8">
        <h1 className="h-6 text-2xl font-semibold text-[#8D8F92] flex items-center gap-0 ml-1">
          B<img src={o} alt="Logo" className="h-7 w-auto mx-0.5"/>DEGA
        </h1>
      </div>

      <nav className="flex flex-col gap-2">
        {links.map(link => {

          const isActive = location.pathname === link.path

          return (
            <Link
              key={link.path}
              to={link.path}
              className={`
                px-4 py-2 rounded-md font-medium transition
                ${isActive 
                  ? 'bg-[#A31F35] text-white' 
                  : 'text-black hover:bg-[#0000000D]'
                }
              `}
            >
              {link.name}
            </Link>
          )
        })}
      </nav>

    </aside>
  )
}
