import { useEffect, useState } from "react"
import { Send, RefreshCw } from "lucide-react"

const Simulation = () => {
  useEffect(() => {
    document.title = "Simulation | Hongsa Power RTMS"
  }, [])

  const [load, setLoad] = useState("")

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    alert(`Simulated Load: ${load} MW Sent!`)
    setLoad("")
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <RefreshCw className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">
          Simulation Input
        </h2>
        <p className="text-slate-500 text-sm mb-6">
          ป้อนค่า Load จริง (MW) เพื่อจำลองสถานการณ์และทดสอบระบบแจ้งเตือน
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="sr-only">Actual Load (MW)</label>
            <div className="relative">
              <input
                type="number"
                value={load}
                onChange={(e) => setLoad(e.target.value)}
                placeholder="Enter Load (e.g., 75.5)"
                className="w-full text-center text-2xl font-bold p-4 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:ring-0 outline-none transition-colors"
                required
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                MW
              </span>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center justify-center space-x-2 transition-transform active:scale-95"
          >
            <Send className="w-4 h-4" />
            <span>Send Data</span>
          </button>
        </form>
      </div>
    </div>
  )
}

export default Simulation