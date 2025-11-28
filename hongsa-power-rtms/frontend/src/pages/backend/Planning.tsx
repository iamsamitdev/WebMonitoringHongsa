import { useEffect, useState } from "react"
import { Plus, Trash2, Save, Calendar, Clock, AlertCircle, CheckCircle2, XCircle } from "lucide-react"
import { toast } from "sonner"
import { 
    getForecastConfig, 
    submitForecastPlan, 
    getMyForecastHistory,
    type MachineStatusConfig,
    type ForecastRequest
} from "@/services/apiForecast"

const Planning = () => {
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0])
  const [statusOptions, setStatusOptions] = useState<MachineStatusConfig[]>([])
  const [rows, setRows] = useState([
    { start: "00:00", end: "01:00", statusID: 1 },
  ])
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<ForecastRequest[]>([])

  useEffect(() => {
    document.title = "Submit Plan | Hongsa Power RTMS"
    fetchConfig()
    fetchHistory()
  }, [])

  const fetchConfig = async () => {
    try {
      const data = await getForecastConfig()
      // data.machineStatus is the array
      if (data.machineStatus && Array.isArray(data.machineStatus)) {
        setStatusOptions(data.machineStatus)
        // Update default statusID for existing rows if needed
        if (data.machineStatus.length > 0) {
           setRows(prev => prev.map(r => ({ ...r, statusID: data.machineStatus[0].statusID })))
        }
      }
    } catch (error) {
      console.error("Failed to fetch config", error)
      toast.error("Failed to load machine status options")
    }
  }

  const fetchHistory = async () => {
      try {
          const data = await getMyForecastHistory()
          setHistory(data)
      } catch (error) {
          console.error(error)
      }
  }

  const addRow = () => {
    const defaultStatus = statusOptions.length > 0 ? statusOptions[0].statusID : 1
    // Auto increment time logic (optional, but nice)
    const lastRow = rows[rows.length - 1]
    let nextStart = "00:00"
    let nextEnd = "01:00"
    
    if (lastRow) {
        nextStart = lastRow.end
        // Add 1 hour
        const [h] = lastRow.end.split(':').map(Number)
        const nextH = (h + 1) % 24
        nextEnd = `${nextH.toString().padStart(2, '0')}:00`
    }

    setRows([...rows, { start: nextStart, end: nextEnd, statusID: defaultStatus }])
  }

  const removeRow = (index: number) => {
    setRows(rows.filter((_, i) => i !== index))
  }

  const updateRow = (index: number, field: keyof typeof rows[0], value: string | number) => {
    setRows(prev => {
        const newRows = [...prev]
        newRows[index] = { ...newRows[index], [field]: value }
        return newRows
    })
  }

  const handleSubmit = async () => {
    if (!targetDate) {
        toast.error("Please select a target date")
        return
    }
    
    setLoading(true)
    try {
        const payload = {
            targetDate: targetDate,
            items: rows.map(r => ({
                startTime: r.start, // "00:00" -> TimeSpan parseable
                endTime: r.end,
                statusID: Number(r.statusID)
            }))
        }
        
        const result = await submitForecastPlan(payload)
        toast.success("Plan submitted successfully", {
            description: `Revision: ${result.revision}`
        })
        fetchHistory() // Refresh history
    } catch (error) {
        console.error(error)
        toast.error("Failed to submit plan")
    } finally {
        setLoading(false)
    }
  }

  // Filter history for selected date
  const selectedDateHistory = history.filter(h => h.targetDate.startsWith(targetDate))

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
            -
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
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
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
                      value={row.start}
                      onChange={(e) => updateRow(idx, 'start', e.target.value)}
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
                      value={row.end}
                      onChange={(e) => updateRow(idx, 'end', e.target.value)}
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
                        value={row.statusID}
                        onChange={(e) => updateRow(idx, 'statusID', Number(e.target.value))}
                        className="block w-full border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-md p-2"
                    >
                      {statusOptions.map(opt => (
                          <option key={opt.statusID} value={opt.statusID}>
                              {opt.statusName}
                          </option>
                      ))}
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
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" /> 
            {loading ? "Submitting..." : "Submit Plan"}
          </button>
        </div>
      </div>

      {/* History Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-800">Submission History ({targetDate})</h2>
        
        {selectedDateHistory.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-300 text-slate-500">
                No submissions found for this date.
            </div>
        ) : (
            <div className="space-y-4">
                {selectedDateHistory.map((req) => (
                    <div key={req.requestID} className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                                <span className="font-mono font-bold text-slate-700">Rev {req.revisionNo}</span>
                                <span className="text-xs text-slate-500 flex items-center">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {new Date(req.submittedDate).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex items-center space-x-3">
                                {req.requestStatus === 'Pending' && (
                                    <span className="flex items-center text-yellow-600 text-xs font-bold uppercase bg-yellow-50 px-2 py-1 rounded-full border border-yellow-200">
                                        <AlertCircle className="w-3 h-3 mr-1" /> Pending
                                    </span>
                                )}
                                {req.requestStatus === 'Approved' && (
                                    <span className="flex items-center text-emerald-600 text-xs font-bold uppercase bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200">
                                        <CheckCircle2 className="w-3 h-3 mr-1" /> Approved
                                    </span>
                                )}
                                {req.requestStatus === 'Returned' && (
                                    <span className="flex items-center text-red-600 text-xs font-bold uppercase bg-red-50 px-2 py-1 rounded-full border border-red-200">
                                        <XCircle className="w-3 h-3 mr-1" /> Returned
                                    </span>
                                )}
                            </div>
                        </div>
                        
                        {req.requestStatus === 'Returned' && req.adminComment && (
                            <div className="px-4 py-2 bg-red-50 border-b border-red-100 text-sm text-red-700">
                                <strong>Admin Comment:</strong> {req.adminComment}
                            </div>
                        )}

                        <div className="p-4">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="text-left text-slate-500 border-b border-slate-100">
                                        <th className="pb-2 font-medium">Time</th>
                                        <th className="pb-2 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {req.items?.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="py-2 text-slate-600">{item.startTime.substring(0, 5)} - {item.endTime.substring(0, 5)}</td>
                                            <td className="py-2 font-medium text-slate-800">{item.statusConfig?.statusName || item.statusID}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  )
}

export default Planning