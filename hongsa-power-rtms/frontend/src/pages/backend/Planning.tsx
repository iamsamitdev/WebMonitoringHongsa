import { useEffect, useState } from "react"
import { Plus, Trash2, Save, Calendar } from "lucide-react"

const Planning = () => {
  useEffect(() => {
    document.title = "Submit Plan | Hongsa Power RTMS"
  }, [])

  const [rows, setRows] = useState([
    { start: "00:00", end: "01:00", status: "Run Continuous" },
  ])

  const addRow = () => {
    setRows([...rows, { start: "00:00", end: "01:00", status: "Run Continuous" }])
  }

  const removeRow = (index: number) => {
    setRows(rows.filter((_, i) => i !== index))
  }

  // Generate time options for every hour
  const timeOptions = Array.from({ length: 25 }, (_, i) => {
    const hour = i.toString().padStart(2, '0')
    return `${hour}:00`
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">
          Submit Machine Plan
        </h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-slate-600">Revision:</span>
          <span className="px-2 py-1 bg-slate-100 rounded text-xs font-mono font-bold">
            0
          </span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        {/* Date Selection */}
        <div className="mb-8 max-w-xs">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Target Date
          </label>
          <div className="relative">
            <input
              type="date"
              className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* Dynamic Table */}
        <div className="overflow-hidden border border-slate-200 rounded-lg mb-6">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Start Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  End Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Machine Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {rows.map((row, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-4">
                    <select
                      defaultValue={row.start}
                      className="block w-full border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-md p-2"
                    >
                      {timeOptions.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      defaultValue={row.end}
                      className="block w-full border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-md p-2"
                    >
                      {timeOptions.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <select className="block w-full border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-md p-2">
                      <option>Run Continuous</option>
                      <option>Not Run / Standby</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => removeRow(idx)}
                      className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Actions */}
        <div className="flex justify-between">
          <button
            onClick={addRow}
            className="flex items-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Period
          </button>
          <button className="flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm">
            <Save className="w-4 h-4 mr-2" /> Submit Plan
          </button>
        </div>
      </div>
    </div>
  )
}

export default Planning