import { Link, useLocation } from 'react-router'
import { 
  LayoutDashboard, 
  CalendarDays, 
  FileCheck2, 
  Activity, 
  FileBarChart, 
  Settings, 
  Zap,
  X
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const location = useLocation()
  
  // Get Role from LocalStorage
  const getUserRole = () => {
    const storedRoles = localStorage.getItem("roles")
    if (storedRoles) {
      try {
        const roles = JSON.parse(storedRoles)
        if (Array.isArray(roles) && roles.includes("Admin")) {
          return "Admin"
        }
      } catch (e) {
        console.error("Error parsing roles", e)
      }
    }
    return "User"
  }

  const userRole = getUserRole() 

  // Menu Configuration
  const menuItems = [
    { 
      category: "Monitoring",
      items: [
        { name: 'Dashboard', path: '/backend/dashboard', icon: LayoutDashboard },
        { name: 'Simulation Input', path: '/backend/simulation', icon: Activity },
      ]
    },
    { 
      category: "Planning & Forecast",
      items: [
        { name: 'Submit Plan', path: '/backend/planning', icon: CalendarDays },
        { name: 'Approval', path: '/backend/approval', icon: FileCheck2, badge: '3' }, // Badge example
      ]
    },
    { 
      category: "Reports",
      items: [
        { name: 'Monthly Report', path: '/backend/reports', icon: FileBarChart },
      ]
    },
    { 
      category: "System",
      items: [
        { name: 'User Management', path: '/backend/users', icon: Settings },
      ]
    }
  ]

  // Filter Menu based on Role
  const filteredMenuItems = menuItems.map(group => {
    const filteredItems = group.items.filter(item => {
      if (userRole === "User") {
        // User เห็นแค่ Dashboard และ Submit Plan
        return ["Dashboard", "Submit Plan"].includes(item.name)
      }
      if (userRole === "Admin") {
        // Admin เห็นทุกอย่าง ยกเว้น Submit Plan
        return item.name !== "Submit Plan"
      }
      return true
    })
    return { ...group, items: filteredItems }
  }).filter(group => group.items.length > 0)

  const isActive = (path: string) => location.pathname === path

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 z-20 bg-black/50 transition-opacity lg:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 left-0 z-30 h-screen w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-800">
          <Link to="/backend/dashboard" className="flex items-center gap-2 font-bold text-xl tracking-wide">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span>Hongsa <span className="text-blue-400">RTMS</span></span>
          </Link>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Menu Area */}
        <div className="h-[calc(100vh-64px)] overflow-y-auto py-4 px-3 space-y-6 scrollbar-thin scrollbar-thumb-slate-700">
          {filteredMenuItems.map((group, idx) => (
            <div key={idx}>
              <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                {group.category}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)} // Close on mobile click
                    className={`flex items-center justify-between rounded-md px-4 py-2 text-md font-medium transition-colors ${
                      isActive(item.path)
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={18} />
                      {item.name}
                    </div>
                    {item.badge && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>
    </>
  )
}

export default Sidebar