"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Activity, Wifi, Server, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Clock, Zap } from 'lucide-react'

export default function NetworkMonitoringPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("24h")

  // Mock monitoring data
  const networkStats = {
    totalBandwidth: 10000, // Mbps
    usedBandwidth: 7500,
    activeConnections: 1247,
    packetsPerSecond: 15420,
    latency: 12.5,
    uptime: 99.8,
  }

  const routerMetrics = [
    {
      id: "RTR-001",
      name: "Main Gateway",
      status: "online",
      cpu: 45,
      memory: 62,
      bandwidth: 75,
      temperature: 42,
      connections: 245,
    },
    {
      id: "RTR-002",
      name: "Backup Router",
      status: "online",
      cpu: 32,
      memory: 48,
      bandwidth: 45,
      temperature: 38,
      connections: 156,
    },
    {
      id: "RTR-003",
      name: "Distribution Router",
      status: "warning",
      cpu: 78,
      memory: 85,
      bandwidth: 85,
      temperature: 55,
      connections: 89,
    },
  ]

  const alerts = [
    {
      id: 1,
      type: "warning",
      message: "High CPU usage on Distribution Router (78%)",
      timestamp: "2024-02-15 14:25:00",
      router: "RTR-003",
    },
    {
      id: 2,
      type: "info",
      message: "Backup Router came online",
      timestamp: "2024-02-15 13:45:00",
      router: "RTR-002",
    },
    {
      id: 3,
      type: "warning",
      message: "High temperature detected on Distribution Router (55°C)",
      timestamp: "2024-02-15 13:20:00",
      router: "RTR-003",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "offline":
        return <Activity className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "error":
        return <Activity className="h-4 w-4 text-red-500" />
      case "info":
        return <CheckCircle className="h-4 w-4 text-blue-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <Link href="/network">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Network
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Network Monitoring</h2>
            <p className="text-muted-foreground">Real-time network performance and health monitoring</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Zap className="h-4 w-4 mr-2" />
            Auto Refresh
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bandwidth Usage</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((networkStats.usedBandwidth / networkStats.totalBandwidth) * 100).toFixed(1)}%
            </div>
            <div className="mt-2">
              <Progress value={(networkStats.usedBandwidth / networkStats.totalBandwidth) * 100} className="h-2" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {networkStats.usedBandwidth} / {networkStats.totalBandwidth} Mbps
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Connections</CardTitle>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{networkStats.activeConnections.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% from yesterday
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network Latency</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{networkStats.latency}ms</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingDown className="h-3 w-3 mr-1" />
              -2ms from average
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network Uptime</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{networkStats.uptime}%</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Monitoring Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="routers">Router Metrics</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="traffic">Traffic Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Network Performance</CardTitle>
                <CardDescription>Real-time network performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Bandwidth Utilization</span>
                    <span>{((networkStats.usedBandwidth / networkStats.totalBandwidth) * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={(networkStats.usedBandwidth / networkStats.totalBandwidth) * 100} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Packets per Second</span>
                    <span>{networkStats.packetsPerSecond.toLocaleString()}</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Average Latency</span>
                    <span>{networkStats.latency}ms</span>
                  </div>
                  <Progress value={25} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>Overall network infrastructure health</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Network Status</span>
                  <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Active Routers</span>
                  <span className="text-sm font-medium">3/4 Online</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Critical Alerts</span>
                  <span className="text-sm font-medium">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Warning Alerts</span>
                  <span className="text-sm font-medium">2</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="routers" className="space-y-4">
          <div className="grid gap-4">
            {routerMetrics.map((router) => (
              <Card key={router.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(router.status)}
                      <CardTitle className="text-lg">{router.name}</CardTitle>
                      <Badge variant="outline">{router.id}</Badge>
                    </div>
                    <Badge variant={router.status === "online" ? "default" : "secondary"}>
                      {router.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>CPU Usage</span>
                        <span>{router.cpu}%</span>
                      </div>
                      <Progress value={router.cpu} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Memory</span>
                        <span>{router.memory}%</span>
                      </div>
                      <Progress value={router.memory} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Bandwidth</span>
                        <span>{router.bandwidth}%</span>
                      </div>
                      <Progress value={router.bandwidth} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Temperature</span>
                        <span className={router.temperature > 50 ? "text-red-600" : "text-green-600"}>
                          {router.temperature}°C
                        </span>
                      </div>
                      <Progress value={(router.temperature / 80) * 100} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Connections</span>
                        <span>{router.connections}</span>
                      </div>
                      <Progress value={(router.connections / 300) * 100} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
              <CardDescription>Network alerts and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{alert.message}</p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <span>{alert.timestamp}</span>
                        <span>•</span>
                        <span>{alert.router}</span>
                      </div>
                    </div>
                    <Badge variant={alert.type === "warning" ? "secondary" : "default"}>
                      {alert.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Analysis</CardTitle>
              <CardDescription>Network traffic patterns and analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Traffic Analysis Dashboard</h3>
                <p className="text-muted-foreground mb-4">
                  Detailed traffic analysis and bandwidth utilization charts
                </p>
                <Button>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Detailed Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
