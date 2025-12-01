import { useEffect, useState, useCallback } from "react"
import { Activity, Bell, Zap, RefreshCw, AlertTriangle } from "lucide-react"
import { Area, CartesianGrid, ComposedChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import axios from "axios"
import { useNavigate } from "react-router" // เพิ่มเพื่อ Redirect กรณี Token หมดอายุ

// --- Interfaces ---
interface DashboardStats {
  actualMW: number;
  forecastMW: number;
  diffPercent: number;
  lastUpdate: string | null;
}

interface ChartDataItem {
  time: string; // C# sends TimeSpan as "hh:mm:ss" or DateTime as ISO String
  mw: number;
}

interface ChartResponse {
  forecasts: ChartDataItem[];
  actuals: ChartDataItem[];
}

interface ProcessedChartData {
  time: string;
  forecast: number | null;
  actual: number | null;
}

// --- Main Component ---
const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [statsData, setStatsData] = useState<DashboardStats>({
    actualMW: 0,
    forecastMW: 0,
    diffPercent: 0,
    lastUpdate: null
  });

  const [chartData, setChartData] = useState<ProcessedChartData[]>([]);

  // ฟังก์ชันสำหรับแปลงข้อมูลกราฟ
  const processChartData = useCallback((data: ChartResponse) => {
    // 1. สร้างโครงเปล่าๆ 24 ชั่วโมง (00:00 - 23:00) เพื่อให้แกน X สวยงามเสมอ
    const timeMap = new Map<string, ProcessedChartData>();
    for (let i = 0; i < 24; i++) {
      const timeKey = `${i.toString().padStart(2, '0')}:00`;
      timeMap.set(timeKey, { time: timeKey, forecast: null, actual: null });
    }

    // 2. Map Forecast (มาจาก C# TimeSpan: "10:00:00")
    data.forecasts.forEach((item) => {
      // ตัดเอาแค่ 5 ตัวแรก ("10:00")
      const timeKey = item.time.substring(0, 5); 
      if (timeMap.has(timeKey)) {
        timeMap.get(timeKey)!.forecast = item.mw;
      }
    });

    // 3. Map Actuals (มาจาก C# DateTime: "2025-11-30T15:35:41...")
    data.actuals.forEach((item) => {
      const date = new Date(item.time);
      // ปัดเศษลงเป็นชั่วโมง (เช่น 15:35 -> 15:00) เพื่อให้ Plot ลงจุดเดียวกันได้
      const timeKey = `${date.getHours().toString().padStart(2, '0')}:00`;
      
      if (timeMap.has(timeKey)) {
        // บันทึกค่าล่าสุดของชั่วโมงนั้น
        timeMap.get(timeKey)!.actual = item.mw;
      }
    });

    setChartData(Array.from(timeMap.values()));
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const today = new Date().toISOString().split('T')[0];
      const token = localStorage.getItem("token");
      
      // ถ้าไม่มี Token ให้ดีดออกไป Login
      if (!token) {
        navigate("/login");
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      const baseUrl = "http://localhost:5000/api"; // ควรย้ายไป Environment Variable

      // ยิง API พร้อมกัน 2 ตัวเพื่อความเร็ว
      const [statsRes, chartRes] = await Promise.all([
        axios.get<DashboardStats>(`${baseUrl}/Monitor/dashboard-stats`, { headers }),
        axios.get<ChartResponse>(`${baseUrl}/Monitor/chart-data?date=${today}`, { headers })
      ]);

      setStatsData(statsRes.data);
      processChartData(chartRes.data);
    } catch (err: unknown) {
      console.error("Dashboard Error:", err);
      if (axios.isAxiosError(err) && (err.response?.status === 401 || err.response?.status === 403)) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setError("ไม่สามารถเชื่อมต่อกับ Server ได้ กรุณาลองใหม่อีกครั้ง");
      }
    } finally {
      setIsLoading(false);
    }
  }, [navigate, processChartData]);

  // Initial Load & Polling
  useEffect(() => {
    document.title = "Dashboard | Hongsa Power RTMS";
    fetchData();

    const interval = setInterval(fetchData, 60000); // อัปเดตทุก 1 นาที (ตาม Requirement)
    return () => clearInterval(interval);
  }, [fetchData]);

  // --- Display Logic ---
  const isCritical = Math.abs(statsData.diffPercent) >= 30; // เกณฑ์ 30% ตาม Requirement

  const statsCards = [
    {
      label: "Actual Load",
      value: `${statsData.actualMW.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MW`,
      subtext: "Real-time from Sensors",
      icon: Activity,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
      borderColor: "border-slate-200",
      valueColor: "text-emerald-600"
    },
    {
      label: "Forecast Load",
      value: `${statsData.forecastMW.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MW`,
      subtext: "Planned Target",
      icon: Zap,
      color: "text-blue-600",
      bg: "bg-blue-100",
      borderColor: "border-slate-200",
      valueColor: "text-blue-600"
    },
    {
      label: "% Difference",
      value: `${statsData.diffPercent > 0 ? '+' : ''}${statsData.diffPercent.toFixed(2)}%`,
      subtext: isCritical 
        ? (statsData.diffPercent > 0 ? "Over Forecast (>30%)" : "Under Forecast (<-30%)") 
        : "Within Range",
      icon: isCritical ? AlertTriangle : Bell,
      color: isCritical 
        ? (statsData.diffPercent > 0 ? "text-red-600" : "text-orange-600") 
        : "text-slate-600",
      bg: isCritical ? "bg-red-100" : "bg-slate-100",
      borderColor: isCritical ? "border-red-200" : "border-slate-200",
      isAlert: isCritical,
      valueColor: statsData.diffPercent > 0 
        ? "text-emerald-600" 
        : statsData.diffPercent < 0 
          ? "text-red-600" 
          : "text-slate-800"
    },
  ];

  if (error) {
    return (
      <div className="flex h-96 flex-col items-center justify-center space-y-4 rounded-xl border border-red-200 bg-red-50 p-8 text-center">
        <AlertTriangle className="h-12 w-12 text-red-500" />
        <h3 className="text-lg font-bold text-red-700">เกิดข้อผิดพลาดในการโหลดข้อมูล</h3>
        <p className="text-red-600">{error}</p>
        <button onClick={fetchData} className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700">
          ลองใหม่อีกครั้ง
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-slate-500">Monitoring & Forecasting Status</p>
        </div>
        <div className="flex items-center space-x-2 text-xs md:text-sm text-slate-500 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
          <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Last updated:</span>
          <span className="font-mono font-medium text-slate-700">
            {statsData.lastUpdate 
              ? new Date(statsData.lastUpdate).toLocaleString('th-TH') 
              : "Waiting for data..."}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsCards.map((stat, index) => (
          <div
            key={index}
            className={`p-6 bg-white rounded-xl shadow-sm border transition-all hover:shadow-md ${stat.borderColor}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              {stat.isAlert && (
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              {isLoading ? (
                <div className="h-8 w-24 bg-slate-100 animate-pulse rounded mt-1" />
              ) : (
                <h3 className={`text-3xl font-bold mt-1 tracking-tight ${stat.valueColor}`}>
                  {stat.value}
                </h3>
              )}
              <p className={`text-xs mt-1 ${stat.isAlert ? "text-red-500 font-medium" : "text-slate-400"}`}>
                {stat.subtext}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Chart Area */}
      <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Load Trend (24 Hours)</h2>
            <p className="text-xs text-slate-500">Comparing Forecast vs Actual Load</p>
          </div>
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-emerald-500 mr-2 shadow-sm"></span>
              <span className="text-slate-600 font-medium">Actual</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-blue-500 mr-2 shadow-sm"></span>
              <span className="text-slate-600 font-medium">Forecast</span>
            </div>
          </div>
        </div>

        <div className="h-[400px] w-full">
          {isLoading ? (
            <div className="h-full w-full bg-slate-50 animate-pulse rounded-lg flex items-center justify-center text-slate-400">
              Loading Chart Data...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="time" 
                  tickLine={false} 
                  axisLine={false} 
                  tickMargin={10} 
                  stroke="#64748b" 
                  fontSize={12}
                />
                <YAxis 
                  tickLine={false} 
                  axisLine={false} 
                  tickMargin={10} 
                  stroke="#64748b" 
                  fontSize={12}
                  unit=" MW"
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '13px', fontWeight: 500 }}
                  labelStyle={{ color: '#64748b', marginBottom: '0.5rem', fontSize: '12px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="forecast" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorForecast)" 
                  activeDot={{ r: 6 }}
                  name="Forecast Load"
                />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#10b981" 
                  strokeWidth={3} 
                  dot={false}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  name="Actual Load"
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard