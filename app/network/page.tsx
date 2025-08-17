"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Router,
  Activity,
  Shield,
  Plus,
  Settings,
  TrendingUp,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Globe,
  Network,
  Eye,
  RefreshCw,
  Thermometer,
  Users,
  Search,
  Filter,
  Gauge,
  Cpu,
  HardDrive,
  AlertCircle,
  ArrowUpRight,
  MonitorSpeaker,
  GitBranch,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function NetworkPage() {
  const [selectedRouter, setSelectedRouter] = useState<string | null>(null)
  const [addRouterOpen, setAddRouterOpen] = useState(false)
  const [timeRange, setTimeRange] = useState("24h")
  const [predictionRange, setPredictionRange] = useState("30d")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [topologyView, setTopologyView] = useState("logical")
  const { toast } = useToast()

  const networkStats = {
    totalRouters: 12,
    activeConnections: 1247,
    bandwidth: 85,
    uptime: 99.8,
    totalTraffic: 2847.5, // GB
    peakTraffic: 3200,
    avgLatency: 12,
    packetLoss: 0.1,
    activeAlerts: 3,
    criticalAlerts: 1,
  }

  const routers = [
    {
      id: "R001",
      name: "Main Gateway",
      location: "Data Center",
      status: "online",
      connections: 450,
      uptime: 99.9,
      ip: "192.168.1.1",
      maxBandwidth: 1000,
      currentBandwidth: 750,
      growthRate: 12.5,
      peakUsage: 890,
      avgUsage: 650,
      temperature: 42,
      cpuUsage: 35,
      memoryUsage: 68,
      diskUsage: 45,
      manufacturer: "Cisco",
      model: "ISR 4331",
      firmwareVersion: "16.12.04",
      lastUpdate: "2024-02-15 14:30",
      signalStrength: 95,
      powerConsumption: 180, // watts
      ports: { total: 24, used: 18, available: 6 },
      vlan: [10, 20, 30],
      routing: "BGP, OSPF",
      security: "Firewall, VPN",
    },
    {
      id: "R002",
      name: "Sector A Router",
      location: "Residential Area",
      status: "online",
      connections: 320,
      uptime: 99.5,
      ip: "192.168.1.2",
      maxBandwidth: 500,
      currentBandwidth: 380,
      growthRate: 8.3,
      peakUsage: 420,
      avgUsage: 320,
      temperature: 38,
      cpuUsage: 28,
      memoryUsage: 52,
      diskUsage: 32,
      manufacturer: "Mikrotik",
      model: "RB4011",
      firmwareVersion: "7.8",
      lastUpdate: "2024-02-15 14:29",
      signalStrength: 88,
      powerConsumption: 95,
      ports: { total: 16, used: 12, available: 4 },
      vlan: [10, 40],
      routing: "OSPF",
      security: "Firewall",
    },
    {
      id: "R003",
      name: "Business Hub",
      location: "Commercial District",
      status: "warning",
      connections: 180,
      uptime: 98.2,
      ip: "192.168.1.3",
      maxBandwidth: 800,
      currentBandwidth: 720,
      growthRate: 15.2,
      peakUsage: 780,
      avgUsage: 580,
      temperature: 55,
      cpuUsage: 78,
      memoryUsage: 85,
      diskUsage: 67,
      manufacturer: "Ubiquiti",
      model: "EdgeRouter",
      firmwareVersion: "2.0.9",
      lastUpdate: "2024-02-15 14:25",
      signalStrength: 72,
      powerConsumption: 120,
      ports: { total: 8, used: 7, available: 1 },
      vlan: [10, 20, 50],
      routing: "BGP",
      security: "Firewall, IDS",
    },
  ]

  const filteredRouters = routers.filter((router) => {
    const matchesSearch =
      router.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      router.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      router.ip.includes(searchTerm) ||
      router.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || router.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const onlineRouters = routers.filter((r) => r.status === "online").length
  const offlineRouters = routers.filter((r) => r.status === "offline").length
  const warningRouters = routers.filter((r) => r.status === "warning").length

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "text-green-700 bg-green-50 border-green-200"
      case "offline":
        return "text-red-700 bg-red-50 border-red-200"
      case "warning":
        return "text-yellow-700 bg-yellow-50 border-yellow-200"
      default:
        return "text-gray-700 bg-gray-50 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "offline":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      default:
        return <Router className="h-4 w-4" />
    }
  }

  const getManufacturerIcon = (manufacturer: string) => {
    const icons: Record<string, string> = {
      Cisco: "🔷",
      Mikrotik: "🔶",
      Ubiquiti: "⚪",
      "TP-Link": "🔵",
      Netgear: "🟡",
    }
    return icons[manufacturer] || "🔘"
  }

  const getTemperatureColor = (temp: number) => {
    if (temp > 50) return "text-red-600"
    if (temp > 40) return "text-yellow-600"
    return "text-green-600"
  }

  const getUsageColor = (usage: number) => {
    if (usage > 80) return "text-red-600"
    if (usage > 60) return "text-yellow-600"
    return "text-green-600"
  }

  const handleRouterAction = (action: string, routerId: string, routerName: string) => {
    toast({
      title: `${action} Initiated`,
      description: `${action} command sent to ${routerName} (${routerId})`,
    })
  }

  const RouterUtilizationCard = ({ router }: { router: (typeof routers)[0] }) => {
    const utilizationPercentage = (router.currentBandwidth / router.maxBandwidth) * 100

    return (
      <Card className={`${router.status === "warning" ? "border-yellow-200 bg-yellow-50/30" : ""}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-blue-100 text-blue-700 text-sm font-semibold">
                  {getManufacturerIcon(router.manufacturer)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-sm">{router.name}</CardTitle>
                <CardDescription className="text-xs">{router.location}</CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              {getStatusIcon(router.status)}
              <Badge className={`${getStatusColor(router.status)} text-xs`}>{router.status}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Bandwidth Usage</span>
              <span className={`font-medium ${getUsageColor(utilizationPercentage)}`}>
                {utilizationPercentage.toFixed(1)}%
              </span>
            </div>
            <Progress value={utilizationPercentage} className="h-2" />
            <div className="text-xs text-muted-foreground mt-1">
              {router.currentBandwidth}MB / {router.maxBandwidth}MB
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center space-x-1">
              <Users className="h-3 w-3 text-gray-400" />
              <span>{router.connections} devices</span>
            </div>
            <div className="flex items-center space-x-1">
              <Thermometer className="h-3 w-3 text-gray-400" />
              <span className={getTemperatureColor(router.temperature)}>{router.temperature}°C</span>
            </div>
            <div className="flex items-center space-x-1">
              <Cpu className="h-3 w-3 text-gray-400" />
              <span className={getUsageColor(router.cpuUsage)}>CPU {router.cpuUsage}%</span>
            </div>
            <div className="flex items-center space-x-1">
              <HardDrive className="h-3 w-3 text-gray-400" />
              <span className={getUsageColor(router.memoryUsage)}>RAM {router.memoryUsage}%</span>
            </div>
          </div>

          <div className="flex space-x-1">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleRouterAction("Restart", router.id, router.name)}
              disabled={router.status === "offline"}
              className="flex-1 text-xs h-7"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Restart
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedRouter(router.id)}
              className="flex-1 text-xs h-7"
            >
              <Settings className="h-3 w-3 mr-1" />
              Config
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Network Infrastructure Management</h1>
          <p className="text-muted-foreground">
            Monitor, analyze, and optimize your network infrastructure with real-time insights
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <Button variant="outline" className="bg-white border-gray-200">
            <MonitorSpeaker className="mr-2 h-4 w-4" />
            Network Diagnostics
          </Button>
          <Button variant="outline" asChild className="bg-white border-gray-200">
            <Link href="/network/routers">
              <Router className="mr-2 h-4 w-4" />
              Router Management
            </Link>
          </Button>
          <Button variant="outline" asChild className="bg-white border-gray-200">
            <Link href="/network/ip-config">
              <Globe className="mr-2 h-4 w-4" />
              IP Configuration
            </Link>
          </Button>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/network/add">
              <Plus className="mr-2 h-4 w-4" />
              Add Device
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Network Health</CardTitle>
            <Shield className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{networkStats.uptime}%</div>
            <div className="flex items-center mt-1 text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              99.9% SLA target
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Devices</CardTitle>
            <Router className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {onlineRouters}/{networkStats.totalRouters}
            </div>
            <div className="flex items-center mt-1 text-xs text-blue-600">
              <CheckCircle className="h-3 w-3 mr-1" />
              {Math.round((onlineRouters / networkStats.totalRouters) * 100)}% operational
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Traffic</CardTitle>
            <Activity className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{networkStats.totalTraffic} GB</div>
            <div className="flex items-center mt-1 text-xs text-purple-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              Peak: {networkStats.peakTraffic} GB
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 bg-gradient-to-r from-orange-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Connections</CardTitle>
            <Users className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{networkStats.activeConnections.toLocaleString()}</div>
            <div className="flex items-center mt-1 text-xs text-orange-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +12% from yesterday
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-cyan-500 bg-gradient-to-r from-cyan-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Latency</CardTitle>
            <Gauge className="h-5 w-5 text-cyan-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{networkStats.avgLatency}ms</div>
            <div className="flex items-center mt-1 text-xs text-cyan-600">
              <CheckCircle className="h-3 w-3 mr-1" />
              Excellent performance
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 bg-gradient-to-r from-red-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Alerts</CardTitle>
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{networkStats.activeAlerts}</div>
            <div className="flex items-center mt-1 text-xs text-red-600">
              <AlertCircle className="h-3 w-3 mr-1" />
              {networkStats.criticalAlerts} critical
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="routers" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100">
          <TabsTrigger value="routers" className="data-[state=active]:bg-white">
            Router Management
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="data-[state=active]:bg-white">
            Real-time Monitoring
          </TabsTrigger>
          <TabsTrigger value="topology" className="data-[state=active]:bg-white">
            Network Topology
          </TabsTrigger>
        </TabsList>

        <TabsContent value="routers" className="space-y-4">
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900">Router Infrastructure</CardTitle>
                  <CardDescription className="text-gray-600">
                    Manage and monitor all network routers and access points
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" asChild>
                    <Link href="/network/routers">
                      <Eye className="mr-2 h-4 w-4" />
                      Detailed View
                    </Link>
                  </Button>
                  <Button asChild className="bg-blue-600 hover:bg-blue-700">
                    <Link href="/network/add">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Router
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mt-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search routers by name, location, or IP..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white border-gray-200"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-40 bg-white border-gray-200">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid gap-4 p-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredRouters.map((router) => (
                  <RouterUtilizationCard key={router.id} router={router} />
                ))}
              </div>

              {filteredRouters.length === 0 && (
                <div className="text-center py-12">
                  <Router className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No routers found</h3>
                  <p className="text-gray-500 mb-6">No routers match your current search criteria.</p>
                  <Button asChild className="bg-blue-600 hover:bg-blue-700">
                    <Link href="/network/add">
                      <Plus className="mr-2 h-4 w-4" />
                      Add First Router
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Real-time Network Monitoring</span>
              </CardTitle>
              <CardDescription>Live performance metrics and bandwidth utilization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Real-time Monitoring Dashboard</h3>
                <p className="text-gray-500">Live charts and metrics will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="topology" className="space-y-4">
          <Card className="h-96">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <GitBranch className="h-5 w-5" />
                  <span>Network Topology</span>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Select value={topologyView} onValueChange={setTopologyView}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="logical">Logical View</SelectItem>
                      <SelectItem value="physical">Physical View</SelectItem>
                      <SelectItem value="geographic">Geographic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative h-full">
              <div className="absolute inset-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <Network className="h-12 w-12 text-gray-400 mx-auto" />
                  <div className="text-sm font-medium text-gray-600">Interactive Network Topology</div>
                  <div className="text-xs text-gray-500">
                    Drag and drop to rearrange • Click nodes for details • Real-time status updates
                  </div>
                  <div className="flex justify-center space-x-4 mt-4">
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-xs">Online</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-xs">Warning</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-xs">Offline</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
