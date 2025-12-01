import { Download, Filter, FileText } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { exportMonthlyReport } from "@/services/apiReport"

const Reports = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    document.title = "Monthly Report | Hongsa Power RTMS"
  }, [])

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const response = await exportMonthlyReport(selectedMonth, selectedYear)
      
      // สร้าง Blob URL เพื่อดาวน์โหลดไฟล์
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      
      // ตั้งชื่อไฟล์ (ดึงจาก Header หรือตั้งเอง)
      const contentDisposition = response.headers['content-disposition']
      let fileName = `Report_${selectedYear}_${selectedMonth}.csv`
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/)
        if (fileNameMatch && fileNameMatch.length === 2)
          fileName = fileNameMatch[1]
      }
      
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      toast.success("Export report successfully")
    } catch (error) {
      console.error("Export failed:", error)
      toast.error("Failed to export report")
    } finally {
      setIsExporting(false)
    }
  }

  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ]

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Monthly Report</h1>
        <button 
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className={`w-4 h-4 mr-2 ${isExporting ? 'animate-bounce' : ''}`} /> 
          {isExporting ? "Exporting..." : "Export CSV"}
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-700">Filter:</span>
        </div>
        <select 
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className="border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
        >
          {months.map((m) => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>
        <select 
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
        >
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* Note: Table data is not yet connected to API as ReportController only supports Export */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col items-center justify-center p-12 text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900">Report Data</h3>
        <p className="text-slate-500 max-w-sm mt-2">
            Please use the <strong>Export CSV</strong> button above to download the detailed report for {months.find(m => m.value === selectedMonth)?.label} {selectedYear}.
        </p>
      </div>
    </div>
  )
}

export default Reports