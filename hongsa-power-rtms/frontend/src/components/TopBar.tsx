import { useState } from 'react'
import {useNavigate } from 'react-router'
import { 
  Settings, 
  LogOut, 
  Menu, 
  Bell, 
  User, 
  ChevronDown,
} from 'lucide-react'

interface TopBarProps {
  onMenuClick: () => void
}

const TopBar = ({ onMenuClick }: TopBarProps) => {
  const navigate = useNavigate()
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  // Get User from LocalStorage
  const username = localStorage.getItem("username") || "User"
  const firstName = localStorage.getItem("firstName")
  const lastName = localStorage.getItem("lastName")
  
  const displayName = (firstName && lastName) ? `${firstName} ${lastName}` : username

  const storedRoles = localStorage.getItem("roles")
  let role = "User"
  if (storedRoles) {
      try {
          const roles = JSON.parse(storedRoles)
          if (Array.isArray(roles) && roles.includes("Admin")) role = "Admin"
      } catch (e) {
        console.error(e)
      }
  }

  const user = {
    name: displayName,
    role: role,
    email: `${username}@hongsapower.com`
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("roles")
    localStorage.removeItem("username")
    localStorage.removeItem("firstName")
    localStorage.removeItem("lastName")
    navigate('/auth/login')
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between bg-white px-4 shadow-sm border-b border-slate-200 lg:px-6">
      {/* Left: Mobile Menu Trigger & Breadcrumb Mock */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="rounded-md p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          <Menu size={24} />
        </button>
        <h2 className="hidden text-lg font-semibold text-slate-800 sm:block">
          Backend Management
        </h2>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100 transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white"></span>
        </button>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-3 hover:bg-slate-50 transition-all"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600">
              <User size={18} />
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-md font-medium text-slate-700 leading-none">{user.name}</p>
              <p className="text-sm text-slate-500 leading-none mt-1">{user.role}</p>
            </div>
            <ChevronDown size={16} className="text-slate-400" />
          </button>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsProfileOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md border border-slate-100 bg-white p-1 shadow-lg ring-opacity-5 z-20 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <p className="text-md font-medium text-slate-900">{user.name}</p>
                  <p className="text-sm text-slate-500 truncate">{user.email}</p>
                </div>
                <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-md text-slate-700 hover:bg-slate-100">
                  <Settings size={16} /> Account Settings
                </button>
                <button 
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-md text-red-600 hover:bg-red-50"
                >
                  <LogOut size={16} /> Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default TopBar