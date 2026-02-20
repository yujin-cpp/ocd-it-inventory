import { Link, useLocation } from "react-router-dom"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "@/context/ThemeContext"
import { Moon, Sun } from "lucide-react"


export default function Sidebar() {
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()

  const links = [
    { name: "Dashboard", path: "/" },
    { name: "Inventory", path: "/inventory" },
    { name: "Add Item", path: "/inventory/add" },
  ]

  return (
    <aside className="w-64 h-screen flex flex-col bg-sidebar text-sidebar-foreground shadow-md">
      
      {/* Logo / Company Section */}
      <div className="h-20 flex items-center justify-center border-b border-border px-4">
        <h1 className="text-lg font-bold tracking-wide text-center">
          One Dev Core IT
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-3 p-6">
        {links.map(link => (
          <Link
            key={link.path}
            to={link.path}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              location.pathname === link.path
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            {link.name}
          </Link>
        ))}
      </nav>

      

    </aside>
  )
}