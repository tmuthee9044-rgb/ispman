"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, Calendar, Activity } from "lucide-react"

interface UsageChartProps {
  customerId: number
}

interface UsageData {
  date: string
  download: number
  upload: number
  total: number
}

export function UsageChart({ customerId }: UsageChartProps) {
  const [timeRange, setTimeRange] = useState("7days")
  const [usageData, setUsageData] = useState<UsageData[]>([])

  // Generate mock usage data
  useEffect(() => {
    const generateUsageData = (days: number): UsageData[] => {
      const data: UsageData[] = []
      const now = new Date()

      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(date.getDate() - i)

        const download = Math.random() * 15 + 5 // 5-20 GB
        const upload = Math.random() * 3 + 1 // 1-4 GB

        data.push({
          date: date.toISOString().split("T")[0],
          download: Math.round(download * 100) / 100,
          upload: Math.round(upload * 100) / 100,
          total: Math.round((download + upload) * 100) / 100,
        })
      }

      return data
    }

    const days = timeRange === "7days" ? 7 : timeRange === "30days" ? 30 : 90
    setUsageData(generateUsageData(days))
  }, [timeRange])

  const totalUsage = usageData.reduce((sum, data) => sum + data.total, 0)
  const avgDailyUsage = totalUsage / usageData.length
  const maxUsage = Math.max(...usageData.map((data) => data.total))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Data Usage Analytics</h3>
          <p className="text-sm text-muted-foreground">Customer #{customerId} usage patterns and statistics</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">7 Days</SelectItem>
            <SelectItem value="30days">30 Days</SelectItem>
            <SelectItem value="90days">90 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <BarChart3 className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <div className="text-xl font-bold">{totalUsage.toFixed(1)} GB</div>
            <div className="text-xs text-muted-foreground">Total Usage</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <div className="text-xl font-bold">{avgDailyUsage.toFixed(1)} GB</div>
            <div className="text-xs text-muted-foreground">Daily Average</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="w-6 h-6 text-purple-500 mx-auto mb-2" />
            <div className="text-xl font-bold">{maxUsage.toFixed(1)} GB</div>
            <div className="text-xs text-muted-foreground">Peak Day</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Activity className="w-6 h-6 text-orange-500 mx-auto mb-2" />
            <div className="text-xl font-bold">
              <Badge className="bg-green-100 text-green-800">Normal</Badge>
            </div>
            <div className="text-xs text-muted-foreground">Usage Pattern</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Usage Chart</CardTitle>
          <CardDescription>Daily data consumption breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-between gap-2">
            {usageData.map((data, index) => (
              <div key={index} className="flex flex-col items-center gap-1 flex-1">
                <div className="text-xs text-muted-foreground mb-1">{data.total.toFixed(1)}</div>
                <div className="flex flex-col w-full max-w-[20px]">
                  <div
                    className="bg-blue-500 rounded-t"
                    style={{
                      height: `${(data.download / maxUsage) * 200}px`,
                      minHeight: "2px",
                    }}
                    title={`Download: ${data.download} GB`}
                  />
                  <div
                    className="bg-green-500 rounded-b"
                    style={{
                      height: `${(data.upload / maxUsage) * 200}px`,
                      minHeight: "2px",
                    }}
                    title={`Upload: ${data.upload} GB`}
                  />
                </div>
                <div className="text-xs text-muted-foreground mt-1 rotate-45 origin-left">
                  {new Date(data.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Download</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Upload</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
