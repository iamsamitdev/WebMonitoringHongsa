import { Download, Filter } from "lucide-react"
import { useEffect } from "react"

const Reports = () => {
  useEffect(() => {
    document.title = "Monthly Report | Hongsa Power RTMS"
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Monthly Report</h1>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 shadow-sm">
          <Download className="w-4 h-4 mr-2" /> Export CSV
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-700">Filter:</span>
        </div>
        <select className="border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500">
          <option>August</option>
          <option>September</option>
        </select>
        <select className="border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500">
          <option>2025</option>
          <option>2024</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                Time
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">
                Forecast (MW)
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">
                Actual (MW)
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">
                % Diff
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {[1, 2, 3].map((i) => (
              <tr key={i}>
                <td className="px-6 py-4 text-sm text-slate-900">
                  09-Aug-2025
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">0{i}:00</td>
                <td className="px-6 py-4 text-sm text-right text-slate-700">
                  65.00
                </td>
                <td className="px-6 py-4 text-sm text-right text-slate-700">
                  75.00
                </td>
                <td className="px-6 py-4 text-sm text-right text-red-600 font-medium">
                  15.3%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 text-center text-sm text-slate-500">
          Displaying 3 of 100 records
        </div>
      </div>
    </div>
  )
}

export default Reports