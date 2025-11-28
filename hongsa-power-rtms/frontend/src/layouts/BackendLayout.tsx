import { useState } from "react"
import { Outlet } from "react-router"
import Sidebar from "@/components/Sidebar"
import TopBar from "@/components/TopBar"

function BackendLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden relative">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />

        {/* Page Content Scrollable Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default BackendLayout