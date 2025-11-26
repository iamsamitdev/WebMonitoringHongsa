import { Outlet } from "react-router"
import { Zap, Activity, Server, CheckCircle2 } from "lucide-react"

function AuthLayout() {
  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2">
      
      {/* Left Column: Visuals & Info */}
      <div className="relative hidden lg:flex flex-col justify-between bg-slate-900 p-10 text-white overflow-hidden">
        
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
           <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 100 L0 50 Q50 0 100 50 L100 100 Z" fill="url(#gradient)" />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
           </svg>
        </div>

        {/* Logo Area */}
        <div className="relative z-10 flex items-center space-x-2">
          <div className="h-8 w-8 bg-blue-600 rounded flex items-center justify-center">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-wide">Hongsa Power <span className="text-blue-400">RTMS</span></span>
        </div>

        {/* Central Graphic: Abstract Dashboard */}
        <div className="relative z-10 flex flex-col items-center justify-center grow">
          <div className="w-full max-w-md bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-6 shadow-2xl animate-in zoom-in-95 duration-700">
            {/* Fake Header */}
            <div className="flex items-center justify-between mb-6 border-b border-slate-700 pb-4">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-emerald-500" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs text-emerald-400 font-mono">SYSTEM ONLINE</span>
              </div>
            </div>

            {/* Fake Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
               <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                  <div className="flex items-center text-slate-400 mb-2">
                    <Activity className="h-4 w-4 mr-2" />
                    <span className="text-xs">Current Load</span>
                  </div>
                  <div className="text-2xl font-bold text-white">120 <span className="text-sm text-slate-500 font-normal">MW</span></div>
                  <div className="w-full bg-slate-700 h-1 mt-3 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full w-[70%]" />
                  </div>
               </div>
               <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                  <div className="flex items-center text-slate-400 mb-2">
                    <Server className="h-4 w-4 mr-2" />
                    <span className="text-xs">Forecast Accuracy</span>
                  </div>
                  <div className="text-2xl font-bold text-emerald-400">98.5%</div>
                  <div className="flex items-center mt-2 text-xs text-slate-500">
                    <CheckCircle2 className="h-3 w-3 mr-1 text-emerald-500" /> Optimal
                  </div>
               </div>
            </div>

             {/* Fake Graph */}
             <div className="h-24 w-full bg-slate-900/30 rounded border border-slate-700/50 flex items-end p-2 space-x-1">
                {[40, 65, 50, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((h, i) => (
                  <div 
                    key={i} 
                    className="flex-1 bg-linear-to-t from-blue-900 to-blue-500 rounded-sm opacity-80 hover:opacity-100 transition-all"
                    style={{ height: `${h}%` }}
                  />
                ))}
             </div>
          </div>
        </div>

        {/* Footer Text */}
        <div className="relative z-10">
          <blockquote className="space-y-2">
            <p className="text-lg font-medium leading-relaxed">
              "ระบบ Real-time Machine Status ช่วยให้เราวางแผนการผลิตไฟฟ้าได้อย่างแม่นยำ ลดความผิดพลาด และเพิ่มประสิทธิภาพสูงสุดให้กับโรงไฟฟ้าหงสา"
            </p>
            <footer className="text-sm text-slate-400 font-medium">
              — ฝ่ายวางแผนและควบคุมการผลิต
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Right Column: Forms */}
      <div className="flex items-center justify-center p-8 bg-white relative">
        {/* Mobile Logo (Visible only on small screens) */}
        <div className="absolute top-8 left-8 lg:hidden flex items-center space-x-2">
           <div className="h-8 w-8 bg-blue-600 rounded flex items-center justify-center">
            <Zap className="h-5 w-5 text-white" />
          </div>
           <span className="text-xl font-bold tracking-wide text-slate-900">Hongsa RTMS</span>
        </div>

        <div className="w-full max-w-[380px] space-y-6">
          <Outlet />

          <div className="mt-8 text-center text-xs text-slate-400">
            &copy; 2025 Hongsa Power Company. All rights reserved. <br/>
            Secured by Hongsa RTMS System v1.0
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
