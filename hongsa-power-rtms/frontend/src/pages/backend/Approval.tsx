import { useEffect, useState } from "react"
import { Check, X, Clock, User as UserIcon, ChevronDown, ChevronUp, CheckCircle2, XCircle } from "lucide-react"
import { toast } from "sonner"
import { 
    getPendingForecasts, 
    getForecastPreview, 
    approveForecastPlan, 
    returnForecastPlan,
    getAllForecastHistory,
    type ForecastRequest,
    type PreviewItem 
} from "@/services/apiForecast"

// Sub-component for individual request card
const ApprovalCard = ({ request, onProcessed }: { request: ForecastRequest, onProcessed: () => void }) => {
    const [items, setItems] = useState<PreviewItem[]>([])
    const [loading, setLoading] = useState(false)
    const [expanded, setExpanded] = useState(false)
    const [finalValues, setFinalValues] = useState<Record<string, number>>({}) // Key: startTime, Value: finalMW

    const fetchDetails = async () => {
        setLoading(true)
        try {
            const data = await getForecastPreview(request.requestID)
            setItems(data)
            // Initialize final values with calculated values
            const initialFinals: Record<string, number> = {}
            data.forEach(item => {
                initialFinals[item.startTime] = item.calculatedMW
            })
            setFinalValues(initialFinals)
        } catch (error) {
            console.error(error)
            toast.error("Failed to load preview details")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (expanded && items.length === 0) {
            fetchDetails()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [expanded])

    const handleApprove = async () => {
        try {
            const payload = {
                requestID: request.requestID,
                items: items.map(item => ({
                    startTime: item.startTime,
                    endTime: item.endTime,
                    finalLoadMW: finalValues[item.startTime] ?? item.calculatedMW
                }))
            }
            await approveForecastPlan(payload)
            toast.success("Plan approved successfully")
            onProcessed()
        } catch (error) {
            console.error(error)
            toast.error("Failed to approve plan")
        }
    }

    const handleReturn = async () => {
        // Simple prompt for comment for now
        const comment = prompt("Enter return reason:")
        if (!comment) return

        try {
            await returnForecastPlan({ requestID: request.requestID, comment })
            toast.success("Plan returned")
            onProcessed()
        } catch (error) {
            console.error(error)
            toast.error("Failed to return plan")
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
             {/* Header - Click to expand */}
             <div 
                className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => setExpanded(!expanded)}
             >
                <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm text-slate-600">
                        <UserIcon className="w-4 h-4 mr-1 text-slate-400" /> 
                        {request.submitter?.firstName} {request.submitter?.lastName} ({request.submitter?.userName})
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                        <Clock className="w-4 h-4 mr-1 text-slate-400" /> 
                        {new Date(request.targetDate).toLocaleDateString()} (Rev {request.revisionNo})
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full uppercase">
                        {request.requestStatus}
                    </span>
                    {expanded ? <ChevronUp size={18} className="text-slate-400"/> : <ChevronDown size={18} className="text-slate-400"/>}
                </div>
             </div>

             {/* Content */}
             {expanded && (
                 <div className="p-6">
                    {loading ? (
                        <div className="text-center py-4 text-slate-500">Loading details...</div>
                    ) : (
                        <>
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
                                    {items.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="py-4">{item.startTime} - {item.endTime}</td>
                                            <td>{item.statusName}</td>
                                            <td className="text-slate-500">
                                                {item.calculatedMW && item.calculatedMW.toFixed(2)}{" "}
                                                <span className="text-xs text-slate-400">({item.sourceLogic})</span>
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    value={finalValues[item.startTime] ?? ''}
                                                    onChange={(e) => setFinalValues({...finalValues, [item.startTime]: parseFloat(e.target.value)})}
                                                    className="w-full px-2 py-1 border border-slate-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="mt-8 flex justify-end space-x-3">
                                <button 
                                    onClick={handleReturn}
                                    className="flex items-center px-4 py-2 border border-red-200 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                                >
                                    <X className="w-4 h-4 mr-2" /> Return
                                </button>
                                <button 
                                    onClick={handleApprove}
                                    className="flex items-center px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-sm transition-colors"
                                >
                                    <Check className="w-4 h-4 mr-2" /> Approve & Forecast
                                </button>
                            </div>
                        </>
                    )}
                 </div>
             )}
        </div>
    )
}

const Approval = () => {
    const [requests, setRequests] = useState<ForecastRequest[]>([])
    const [history, setHistory] = useState<ForecastRequest[]>([])

    const fetchRequests = async () => {
        try {
            const data = await getPendingForecasts()
            setRequests(data)
        } catch (error) {
            console.error(error)
            toast.error("Failed to load pending requests")
        }
    }

    const fetchHistory = async () => {
        try {
            const data = await getAllForecastHistory()
            // Filter out Pending ones as they are already shown above
            setHistory(data.filter(r => r.requestStatus !== 'Pending'))
        } catch (error) {
            console.error(error)
        }
    }

    const refreshAll = () => {
        fetchRequests()
        fetchHistory()
    }

    useEffect(() => {
        document.title = "Admin Approval | Hongsa Power RTMS"
        refreshAll()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="space-y-8">
            <section className="space-y-4">
                <h1 className="text-2xl font-bold text-slate-800">Pending Approvals</h1>
                {requests.length === 0 && <p className="text-slate-500 italic">No pending requests.</p>}
                {requests.map(req => (
                    <ApprovalCard key={req.requestID} request={req} onProcessed={refreshAll} />
                ))}
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-bold text-slate-800 border-t border-slate-200 pt-6">Approval History</h2>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="min-w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3 text-left font-medium text-slate-500">Date</th>
                                <th className="px-6 py-3 text-left font-medium text-slate-500">Submitter</th>
                                <th className="px-6 py-3 text-left font-medium text-slate-500">Rev</th>
                                <th className="px-6 py-3 text-left font-medium text-slate-500">Status</th>
                                <th className="px-6 py-3 text-left font-medium text-slate-500">Action Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {history.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500 italic">No history found.</td>
                                </tr>
                            ) : (
                                history.map(req => (
                                    <tr key={req.requestID} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-700">
                                            {new Date(req.targetDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {req.submitter?.firstName} {req.submitter?.lastName}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {req.revisionNo}
                                        </td>
                                        <td className="px-6 py-4">
                                            {req.requestStatus === 'Approved' && (
                                                <span className="inline-flex items-center text-emerald-600 text-xs font-bold uppercase bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200">
                                                    <CheckCircle2 className="w-3 h-3 mr-1" /> Approved
                                                </span>
                                            )}
                                            {req.requestStatus === 'Returned' && (
                                                <span className="inline-flex items-center text-red-600 text-xs font-bold uppercase bg-red-50 px-2 py-1 rounded-full border border-red-200">
                                                    <XCircle className="w-3 h-3 mr-1" /> Returned
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 text-xs">
                                            {/* Assuming we have reviewedDate or similar, using submittedDate for now if not available in interface */}
                                            {new Date(req.submittedDate).toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    )
}

export default Approval
