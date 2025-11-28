import { Activity, Bell, Zap } from "lucide-react"
import { useEffect, useState } from "react"
import { Area, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts"
import axios from "axios"

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  forecast: {
    label: "Forecast Load",
    color: "var(--chart-1)",
  },
  actual: {
    label: "Actual Load",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

interface DashboardStats {
  actualMW: number;
  forecastMW: number;
  diffPercent: number;
  lastUpdate: string | null;
}

interface ChartDataItem {
  time: string;
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

const Dashboard = () => {
  const [statsData, setStatsData] = useState<DashboardStats>({
    actualMW: 0,
    forecastMW: 0,
    diffPercent: 0,
    lastUpdate: null
  });

  const [chartData, setChartData] = useState<ProcessedChartData[]>([]);

  useEffect(() => {
    document.title = "Dashboard | Hongsa Power RTMS"

    const processChartData = (data: ChartResponse) => {
      // Create a map for 24 hours (00:00 - 23:00)
      const timeMap = new Map<string, ProcessedChartData>();
  
      // Initialize with empty slots if needed, or just build from data
      // Let's build 00:00 to 23:00
      for (let i = 0; i < 24; i++) {
        const timeKey = `${i.toString().padStart(2, '0')}:00`;
        timeMap.set(timeKey, { time: timeKey, forecast: null, actual: null });
      }
  
      // Fill Forecasts (Time is "hh:mm:ss")
      data.forecasts.forEach((item) => {
        const timeKey = item.time.substring(0, 5); // "00:00:00" -> "00:00"
        if (timeMap.has(timeKey)) {
          const entry = timeMap.get(timeKey)!;
          entry.forecast = item.mw;
        }
      });
  
      // Fill Actuals (Time is ISO DateTime)
      data.actuals.forEach((item) => {
        const date = new Date(item.time);
        const timeKey = `${date.getHours().toString().padStart(2, '0')}:00`; 
        
        if (timeMap.has(timeKey)) {
          const entry = timeMap.get(timeKey)!;
          entry.actual = item.mw;
        }
      });
  
      const processed = Array.from(timeMap.values());
      setChartData(processed);
    };

    const fetchData = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
  
        // 1. Get Stats
        const statsRes = await axios.get("http://localhost:5000/api/Monitor/dashboard-stats", { headers });
        setStatsData(statsRes.data);
  
        // 2. Get Chart Data
        const chartRes = await axios.get(`http://localhost:5000/api/Monitor/chart-data?date=${today}`, { headers });
        
        processChartData(chartRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [])

  // Stats Display
  const stats = [
    {
      label: "Actual Load",
      value: `${statsData.actualMW.toFixed(2)} MW`,
      change: "Real-time",
      icon: Activity,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      label: "Forecast Load",
      value: `${statsData.forecastMW.toFixed(2)} MW`,
      change: "Target",
      icon: Zap,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "% Difference",
      value: `${statsData.diffPercent.toFixed(2)}%`,
      change: statsData.diffPercent > 5 ? "Critical" : "Normal",
      icon: Bell,
      color: statsData.diffPercent > 5 ? "text-red-600" : "text-slate-600",
      bg: statsData.diffPercent > 5 ? "bg-red-100" : "bg-slate-100",
      isAlert: statsData.diffPercent > 5,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">
          Real-Time Monitoring
        </h1>
        <div className="flex items-center space-x-2 text-sm text-slate-500">
          <span>Last updated:</span>
          <span className="font-medium text-slate-700">
            {statsData.lastUpdate ? new Date(statsData.lastUpdate).toLocaleString() : "-"}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`p-6 bg-white rounded-xl shadow-sm border ${
              stat.isAlert ? "border-red-200 bg-red-50/50" : "border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              {stat.isAlert && (
                <span className="px-2 py-1 text-xs font-bold text-red-600 bg-red-100 rounded-full animate-pulse">
                  ALERT
                </span>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <h3
                className={`text-3xl font-bold mt-1 ${
                  stat.isAlert ? "text-red-700" : "text-slate-800"
                }`}
              >
                {stat.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Main Chart Area */}
      <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-800">
            Load Trend (24 Hours)
          </h2>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-chart-2 mr-2"></span>
              Actual
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-chart-1 mr-2"></span>
              Forecast
            </div>
          </div>
        </div>

        <div className="h-[400px] w-full">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ComposedChart data={chartData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="time"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                domain={[0, 'auto']} 
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                dataKey="forecast"
                type="monotone"
                fill="var(--color-forecast)"
                fillOpacity={0.2}
                stroke="var(--color-forecast)"
                strokeWidth={2}
              />
              <Line
                dataKey="actual"
                type="monotone"
                stroke="var(--color-actual)"
                strokeWidth={3}
                dot={false}
              />
            </ComposedChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  )
}

export default Dashboard