"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  DollarSign,
  Wifi,
  AlertTriangle,
  TrendingUp,
  Server,
  Activity,
  Download,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react"

interface DashboardData {
  metrics: {
    users: { value: number; change: string; trend: string }
    revenue: { value: number; change: string; trend: string }
    bandwidth: { value: number; change: string; trend: string }
    alerts: { value: number; change: string; trend: string }
  }
  networkStatus: { online: number; offline: number; total: number }
  invoiceStats: { count: number; amount: number }
  recentActivity: Array<{
    id: number
    status: string
    message: string
    details: string
    time: string
    category: string
  }>
}

interface RevenueData {
  month: string
  value: number
  height: string
  growth: string
}

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isCheckingHealth, setIsCheckingHealth] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [revenueData, setRevenueData] = useState<RevenueData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [metricsResponse, revenueResponse] = await Promise.all([
          fetch("/api/dashboard/metrics"),
          fetch("/api/dashboard/revenue"),
        ])

        if (metricsResponse.ok) {
          const metricsData = await metricsResponse.json()
          setDashboardData(metricsData.data)
        }

        if (revenueResponse.ok) {
          const revenueData = await revenueResponse.json()
          setRevenueData(revenueData.data)
        }
      } catch (error) {
        console.error("[v0] Failed to fetch dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const metrics = dashboardData
    ? [
        {
          title: "Users",
          value: dashboardData.metrics.users.value.toLocaleString(),
          percentage: Number.parseInt(dashboardData.metrics.users.change.replace(/[+%]/g, "")),
          trend: dashboardData.metrics.users.trend,
          change: dashboardData.metrics.users.change,
          icon: Users,
          color: "from-green-500 to-green-400",
          bgColor: "bg-green-500",
          iconColor: "text-white",
        },
        {
          title: "Revenue",
          value: `KSh ${dashboardData.metrics.revenue.value.toLocaleString()}`,
          percentage: Number.parseInt(dashboardData.metrics.revenue.change.replace(/[+%]/g, "")),
          trend: dashboardData.metrics.revenue.trend,
          change: dashboardData.metrics.revenue.change,
          icon: DollarSign,
          color: "from-blue-500 to-blue-400",
          bgColor: "bg-blue-500",
          iconColor: "text-white",
        },
        {
          title: "Bandwidth",
          value: `${dashboardData.metrics.bandwidth.value}%`,
          percentage: Number.parseInt(dashboardData.metrics.bandwidth.change.replace(/[+%-]/g, "")),
          trend: dashboardData.metrics.bandwidth.trend,
          change: dashboardData.metrics.bandwidth.change,
          icon: Wifi,
          color: "from-red-500 to-red-400",
          bgColor: "bg-red-500",
          iconColor: "text-white",
        },
        {
          title: "Alerts",
          value: dashboardData.metrics.alerts.value.toString(),
          percentage: Number.parseInt(dashboardData.metrics.alerts.change.replace(/[+%]/g, "")),
          trend: dashboardData.metrics.alerts.trend,
          change: dashboardData.metrics.alerts.change,
          icon: AlertTriangle,
          color: "from-yellow-500 to-yellow-400",
          bgColor: "bg-yellow-500",
          iconColor: "text-white",
        },
      ]
    : []

  const handleSystemHealth = async () => {
    setIsCheckingHealth(true)
    try {
      const response = await fetch("/api/database-health-check")
      const data = await response.json()

      if (response.ok) {
        alert(
          `System Health Score: ${data.overallScore}/100\n\nDatabase: ${data.connectivity.status}\nTables: ${data.tables.existing}/${data.tables.expected}\nConnections: ${data.connectivity.activeConnections}`,
        )
      } else {
        alert("System health check failed. Please try again.")
      }
    } catch (error) {
      console.error("[v0] System health check error:", error)
      alert("Error checking system health. Please try again.")
    } finally {
      setIsCheckingHealth(false)
    }
  }

  const handleExportReport = async () => {
    setIsExporting(true)
    try {
      const response = await fetch("/api/export-all-data")

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `isp-system-report-${new Date().toISOString().split("T")[0]}.json`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        alert("System report exported successfully!")
      } else {
        alert("Export failed. Please try again.")
      }
    } catch (error) {
      console.error("[v0] Export error:", error)
      alert("Error exporting report. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4 text-blue-500" />
    }
  }

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Activity className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading dashboard data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-3 sm:space-y-4 p-2 sm:p-4 md:p-6 lg:p-8 pt-4 sm:pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div className="space-y-1 sm:space-y-2">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ISP Management Dashboard
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-muted-foreground space-y-1 sm:space-y-0">
            <p className="text-sm sm:text-base">Welcome back! Here's what's happening with your network today.</p>
            <div className="flex items-center space-x-2">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="font-mono text-xs sm:text-sm">
                {currentTime.toLocaleTimeString("en-KE", {
                  timeZone: "Africa/Nairobi",
                  hour12: false,
                })}{" "}
                EAT
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <Button
            variant="outline"
            className="bg-transparent text-xs sm:text-sm"
            onClick={handleSystemHealth}
            disabled={isCheckingHealth}
          >
            <Activity className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            {isCheckingHealth ? "Checking..." : "System Health"}
          </Button>
          <Button
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-xs sm:text-sm"
            onClick={handleExportReport}
            disabled={isExporting}
          >
            <Download className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            {isExporting ? "Exporting..." : "Export Report"}
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <Card
              key={index}
              className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-5 group-hover:opacity-10 transition-opacity`}
              />
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 opacity-10">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-current" />
              </div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">{metric.title}</CardTitle>
                <div
                  className={`p-1.5 sm:p-2 rounded-full ${metric.bgColor} group-hover:scale-110 transition-transform`}
                >
                  <Icon className={`h-3 w-3 sm:h-4 sm:w-4 ${metric.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold">{metric.value}</div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-muted-foreground flex items-center">
                    <TrendingUp
                      className={`h-2 w-2 sm:h-3 sm:w-3 mr-1 ${metric.trend === "up" ? "text-green-500" : "text-red-500"} ${metric.trend === "down" ? "rotate-180" : ""}`}
                    />
                    <span className="hidden sm:inline">{metric.change}</span>
                    <span className="sm:hidden">
                      {metric.trend === "up" ? "+" : ""}
                      {Math.abs(metric.percentage)}%
                    </span>
                  </p>
                  <div className="text-xs font-medium">{Math.abs(metric.percentage)}%</div>
                </div>
                <Progress value={Math.min(Math.abs(metric.percentage) * 5, 100)} className="mt-2 h-1" />
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-7">
        {/* Revenue Chart */}
        <Card className="lg:col-span-4 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
              <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              Revenue Overview
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Monthly revenue trends and growth analysis</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[200px] sm:h-[300px] flex items-end justify-between gap-1 sm:gap-2 px-2 sm:px-4">
              {revenueData.map((data, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-md hover:from-blue-600 hover:to-blue-500 transition-all duration-300 cursor-pointer relative group"
                    style={{ height: data.height }}
                  >
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      <div className="font-medium">KSh {(data.value / 1000000).toFixed(1)}M</div>
                      <div className="text-green-400">{data.growth}</div>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground mt-1 sm:mt-2">{data.month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Recent Activity */}
        <Card className="lg:col-span-3 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              Recent Activity
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Latest system activities and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 sm:space-y-3 max-h-[300px] overflow-y-auto">
              {dashboardData?.recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-muted"
                >
                  <div className="mt-0.5 flex-shrink-0">{getStatusIcon(activity.status)}</div>
                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs sm:text-sm font-medium leading-none truncate">{activity.message}</p>
                      <Badge variant="outline" className="text-xs flex-shrink-0">
                        {activity.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{activity.details}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Network Infrastructure</CardTitle>
            <Server className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">
              {dashboardData?.networkStatus.online || 0} / {dashboardData?.networkStatus.total || 0}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-2 space-y-1 sm:space-y-0">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                  Online: {dashboardData?.networkStatus.online || 0}
                </Badge>
                <Badge variant="destructive" className="text-xs">
                  Offline: {dashboardData?.networkStatus.offline || 0}
                </Badge>
              </div>
            </div>
            <Progress
              value={
                dashboardData?.networkStatus.total
                  ? (dashboardData.networkStatus.online / dashboardData.networkStatus.total) * 100
                  : 0
              }
              className="mt-2 h-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {dashboardData?.networkStatus.total
                ? Math.round((dashboardData.networkStatus.online / dashboardData.networkStatus.total) * 100)
                : 0}
              % operational
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Outstanding Invoices</CardTitle>
            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{dashboardData?.invoiceStats.count || 0}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              Total: KSh {dashboardData?.invoiceStats.amount.toLocaleString() || 0}
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-red-600">Overdue: {dashboardData?.invoiceStats.count || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Bandwidth Utilization</CardTitle>
            <Activity className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">78%</div>
            <Progress value={78} className="mt-2 h-2" />
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-1 space-y-1 sm:space-y-0">
              <p className="text-xs text-muted-foreground">Peak: 89% at 8 PM</p>
              <p className="text-xs text-muted-foreground">Avg: 65%</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Customer Growth</CardTitle>
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-green-600">+12.5%</div>
            <p className="text-xs sm:text-sm text-muted-foreground">This month: +342 customers</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-green-600">New: 398</span>
              <span className="text-xs text-red-600">Churned: 56</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
