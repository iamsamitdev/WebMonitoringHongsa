import { Activity, Bell, Zap } from "lucide-react"
import { useEffect, useState } from "react"
import { Area, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts"

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

const Dashboard = () => {
  const [data, setData] = useState(() => {
    return Array.from({ length: 24 }, (_, i) => ({
      time: `${i.toString().padStart(2, '0')}:00`,
      forecast: 80 + 20 * Math.sin((i / 24) * 2 * Math.PI),
      actual: 80 + Math.random() * 20 - 10,
    }))
  })

  useEffect(() => {
    document.title = "Dashboard | Hongsa Power RTMS"
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prevData) => {
        const lastItem = prevData[prevData.length - 1]
        const lastTimeHour = parseInt(lastItem.time.split(":")[0])
        const nextTimeHour = (lastTimeHour + 1) % 24
        const nextTime = `${nextTimeHour.toString().padStart(2, '0')}:00`

        // Simulate new values based on the last one to keep it smooth
        // Forecast stays the same (or cycles from the beginning if we want to keep the shape, 
        // but here we just want it static for the 24h window. 
        // However, since we are shifting time, we need to decide what the "new" forecast is.
        // If we want a static 24h forecast that doesn't change, we shouldn't be shifting the array.
        // But the requirement was "chart changes every 1 second".
        // If we want "Forecast doesn't change every second", maybe we mean the forecast curve is fixed 
        // and only actual updates?
        
        // Let's assume the user wants the Forecast line to be stable while Actual line updates.
        // To achieve "Forecast doesn't change every second" in a moving window, 
        // we usually just pick the forecast for the *next* hour from a pre-defined set.
        // For simplicity, let's just generate a new forecast that is consistent with a pattern 
        // or just keep the last one.
        
        // Let's make forecast follow a simple sine wave pattern based on time to look "static" relative to time of day
        const hour = nextTimeHour;
        const newForecast = 80 + 20 * Math.sin((hour / 24) * 2 * Math.PI);

        let newActual = lastItem.actual + (Math.random() * 10 - 5)
        newActual = Math.max(50, Math.min(118, newActual))

        const newItem = {
          time: nextTime,
          forecast: newForecast,
          actual: newActual,
        }

        // Remove first item and add new item
        return [...prevData.slice(1), newItem]
      })
    }, 1000) // Update every 1 second

    return () => clearInterval(interval)
  }, [])

  // Mock Data
  const stats = [
    {
      label: "Actual Load",
      value: `${data[data.length - 1].actual.toFixed(1)} MW`,
      change: "+12.0%",
      icon: Activity,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      label: "Forecast Load",
      value: `${data[data.length - 1].forecast.toFixed(1)} MW`,
      change: "+2.5%",
      icon: Zap,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "% Difference",
      value: `${Math.abs(((data[data.length - 1].actual - data[data.length - 1].forecast) / data[data.length - 1].forecast) * 100).toFixed(1)}%`,
      change: "Critical",
      icon: Bell,
      color: "text-red-600",
      bg: "bg-red-100",
      isAlert: true,
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
            {new Date().toLocaleString()}
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
            <ComposedChart data={data}>
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
                domain={[0, 140]}
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