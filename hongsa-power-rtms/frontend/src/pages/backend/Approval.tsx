import { Check, X, Clock, User as UserIcon } from "lucide-react"
import { useEffect } from "react"

const Approval = () => {
  useEffect(() => {
    document.title = "Approval | Hongsa Power RTMS"
  }, [])

  // Mock Request Data
  const requests = [
    {
      id: 101,
      user: "Somchai Eng.",
      date: "09-Aug-2025",
      rev: 1,
      status: "Pending",
    },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Pending Approvals</h1>

      {/* Request Card */}
      {requests.map((req) => (
        <div
          key={req.id}
          className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-slate-600">
                <UserIcon className="w-4 h-4 mr-1 text-slate-400" /> {req.user}
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <Clock className="w-4 h-4 mr-1 text-slate-400" /> {req.date}{" "}
                (Rev {req.rev})
              </div>
            </div>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full uppercase">
              {req.status}
            </span>
          </div>

          {/* Content Table */}
          <div className="p-6">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-100">
                  <th className="pb-3 font-medium">Time Period</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">System Calc. (MW)</th>
                  <th className="pb-3 font-medium w-40">Final MW (Edit)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-4">00:00 - 08:00</td>
                  <td>Run Continuous</td>
                  <td className="text-slate-500">
                    120.00{" "}
                    <span className="text-xs text-slate-400">(Max Load)</span>
                  </td>
                  <td>
                    <input
                      type="number"
                      defaultValue="120.00"
                      className="w-full px-2 py-1 border border-slate-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="py-4">08:00 - 24:00</td>
                  <td>Not Run</td>
                  <td className="text-slate-500">
                    0.50{" "}
                    <span className="text-xs text-slate-400">(Default)</span>
                  </td>
                  <td>
                    <input
                      type="number"
                      defaultValue="0.50"
                      className="w-full px-2 py-1 border border-slate-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Actions */}
            <div className="mt-8 flex justify-end space-x-3">
              <button className="flex items-center px-4 py-2 border border-red-200 text-red-700 rounded-lg hover:bg-red-50 transition-colors">
                <X className="w-4 h-4 mr-2" /> Return
              </button>
              <button className="flex items-center px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-sm transition-colors">
                <Check className="w-4 h-4 mr-2" /> Approve & Forecast
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Approval