"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Router,
  Power,
  Settings,
  RefreshCw,
  Plus,
  Search,
  Filter,
  Activity,
  AlertTriangle,
  Thermometer,
  Clock,
  Users,
  Signal,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Sample router data with enhanced information
const routers = [
  {
    id: "RTR-001",
    name: "Main Gateway Router",
    model: "Cisco ISR 4331",
    ipAddress: "192.168.1.1",
    location: "Server Room A",
    status: "online",
    uptime: "45 days, 12 hours",
    bandwidth: { used: 75, total: 100 },
    connectedDevices: 245,
    temperature: 42,
    lastUpdate: "2024-02-15 14:30",
    signalStrength: 95,
    firmwareVersion: "16.12.04",
    manufacturer: "Cisco",
  },
  {
    id: "RTR-002",
    name: "Backup Router",
    model: "Mikrotik RB4011",
    ipAddress: "192.168.1.2",
    location: "Server Room B",
    status: "online",
    uptime: "30 days, 8 hours",
    bandwidth: { used: 45, total: 100 },
    connectedDevices: 156,
    temperature: 38,
    lastUpdate: "2024-02-15 14:29",
    signalStrength: 88,
    firmwareVersion: "7.8",
    manufacturer: "Mikrotik",
  },
  {
    id: "RTR-003",
    name: "Distribution Router 1",
    model: "Ubiquiti EdgeRouter",
    ipAddress: "192.168.2.1",
    location: "Building C",
    status: "warning",
    uptime: "15 days, 3 hours",
    bandwidth: { used: 85, total: 100 },
    connectedDevices: 89,
    temperature: 55,
    lastUpdate: "2024-02-15 14:25",
    signalStrength: 72,
    firmwareVersion: "2.0.9",
    manufacturer: "Ubiquiti",
  },
  {
    id: "RTR-004",
    name: "Access Router 1",
    model: "TP-Link Archer AX73",
    ipAddress: "192.168.3.1",
    location: "Office Floor 1",
    status: "offline",
    uptime: "0 days, 0 hours",
    bandwidth: { used: 0, total: 100 },
    connectedDevices: 0,
    temperature: 25,
    lastUpdate: "2024-02-15 12:15",
    signalStrength: 0,
    firmwareVersion: "1.2.3",
    manufacturer: "TP-Link",
  },
  {
    id: "RTR-005",
    name: "Access Router 2",
    model: "Netgear Nighthawk",
    ipAddress: "192.168.4.1",
    location: "Office Floor 2",
    status: "online",
    uptime: "22 days, 16 hours",
    bandwidth: { used: 60, total: 100 },
    connectedDevices: 67,
    temperature: 41,
    lastUpdate: "2024-02-15 14:28",
    signalStrength: 91,
    firmwareVersion: "1.0.4.84",
    manufacturer: "Netgear",
  },
]

export default function RoutersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedRouter, setSelectedRouter] = useState<(typeof routers)[0] | null>(null)
  const { toast } = useToast()

  const filteredRouters = routers.filter((router) => {
    const matchesSearch =
      router.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      router.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      router.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      router.ipAddress.includes(searchTerm)

    const matchesStatus = filterStatus === "all" || router.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const onlineRouters = routers.filter((r) => r.status === "online").length
  const offlineRouters = routers.filter((r) => r.status === "offline").length
  const warningRouters = routers.filter((r) => r.status === "warning").length
  const totalDevices = routers.reduce((sum, router) => sum + router.connectedDevices, 0)
  const avgBandwidth = Math.round(routers.reduce((sum, router) => sum + router.bandwidth.used, 0) / routers.length)

  const handleRestart = (routerId: string, routerName: string) => {
    toast({
      title: "Router Restart Initiated",
      description: `Restarting ${routerName} (${routerId})`,
    })
  }

  const handlePowerToggle = (routerId: string, routerName: string, currentStatus: string) => {
    const action = currentStatus === "offline" ? "Power On" : "Power Off"
    toast({
      title: `${action} Initiated`,
      description: `${action} command sent to ${routerName} (${routerId})`,
    })
  }

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
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case "offline":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      default:
        return <Router className="h-4 w-4" />
    }
  }

  const getTemperatureColor = (temp: number) => {
    if (temp > 50) return "text-red-600"
    if (temp > 40) return "text-yellow-600"
    return "text-green-600"
  }

  const getBandwidthColor = (usage: number) => {
    if (usage > 80) return "text-red-600"
    if (usage > 60) return "text-yellow-600"
    return "text-green-600"
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

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex items-center space-x-2">
          <Link href="/network">
            <Button variant="ghost" size="sm" className="hover:bg-gray-100">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Network
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Router Management</h1>
            <p className="text-muted-foreground">Monitor, configure, and manage your network infrastructure</p>
          </div>
        </div>
        <Link href="/network/add">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Router
          </Button>
        </Link>
      </div>

      {/* Enhanced Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Online Routers</CardTitle>
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{onlineRouters}</div>
            <p className="text-xs text-green-600 mt-1">
              {Math.round((onlineRouters / routers.length) * 100)}% operational
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 bg-gradient-to-r from-red-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Offline Routers</CardTitle>
            <XCircle className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{offlineRouters}</div>
            <p className="text-xs text-red-600 mt-1">Require immediate attention</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500 bg-gradient-to-r from-yellow-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Warnings</CardTitle>
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{warningRouters}</div>
            <p className="text-xs text-yellow-600 mt-1">Performance issues detected</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Connected Devices</CardTitle>
            <Users className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{totalDevices.toLocaleString()}</div>
            <p className="text-xs text-blue-600 mt-1">Across all routers</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Bandwidth</CardTitle>
            <Activity className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{avgBandwidth}%</div>
            <div className="mt-2">
              <Progress value={avgBandwidth} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, model, location, or IP address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-[180px] bg-white border-gray-200">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="online">Online</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Enhanced Routers Table */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="bg-gray-50 border-b border-gray-200">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Network Infrastructure ({filteredRouters.length} routers)
          </CardTitle>
          <CardDescription className="text-gray-600">
            Monitor status, performance metrics, and manage router configurations
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 border-b border-gray-200">
                  <TableHead className="font-semibold text-gray-700 pl-6">Router Details</TableHead>
                  <TableHead className="font-semibold text-gray-700">Status & Health</TableHead>
                  <TableHead className="font-semibold text-gray-700">Performance</TableHead>
                  <TableHead className="font-semibold text-gray-700 hidden lg:table-cell">Network Info</TableHead>
                  <TableHead className="font-semibold text-gray-700 hidden xl:table-cell">System Info</TableHead>
                  <TableHead className="font-semibold text-gray-700 w-32">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRouters.map((router, index) => (
                  <TableRow
                    key={router.id}
                    className={`hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-25"}`}
                  >
                    <TableCell className="pl-6">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold text-lg">
                            {getManufacturerIcon(router.manufacturer)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900">{router.name}</div>
                          <div className="text-sm text-gray-500">{router.model}</div>
                          <div className="text-sm text-gray-500 font-mono">{router.ipAddress}</div>
                          <div className="text-xs text-gray-400">{router.location}</div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(router.status)}
                          <Badge className={`${getStatusColor(router.status)} border font-medium`}>
                            {router.status}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Thermometer className="h-3 w-3" />
                          <span className={getTemperatureColor(router.temperature)}>{router.temperature}°C</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Signal className="h-3 w-3" />
                          <span className="text-gray-600">{router.signalStrength}%</span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Bandwidth</span>
                            <span className={`font-medium ${getBandwidthColor(router.bandwidth.used)}`}>
                              {router.bandwidth.used}%
                            </span>
                          </div>
                          <Progress value={router.bandwidth.used} className="h-2" />
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Users className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-600">{router.connectedDevices} devices</span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="hidden lg:table-cell">
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-600">Uptime: {router.uptime}</span>
                        </div>
                        <div className="text-xs text-gray-500">Last update: {router.lastUpdate}</div>
                      </div>
                    </TableCell>

                    <TableCell className="hidden xl:table-cell">
                      <div className="space-y-1 text-xs">
                        <div className="text-gray-600">Firmware: {router.firmwareVersion}</div>
                        <div className="text-gray-500">{router.manufacturer}</div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col space-y-1">
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRestart(router.id, router.name)}
                            disabled={router.status === "offline"}
                            className="flex-1 text-xs"
                          >
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Restart
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePowerToggle(router.id, router.name, router.status)}
                            className="flex-1 text-xs"
                          >
                            <Power className="h-3 w-3 mr-1" />
                            {router.status === "offline" ? "On" : "Off"}
                          </Button>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedRouter(router)}
                              className="w-full text-xs"
                            >
                              <Settings className="h-3 w-3 mr-1" />
                              Configure
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Router Configuration</DialogTitle>
                              <DialogDescription>Configure settings for {selectedRouter?.name}</DialogDescription>
                            </DialogHeader>
                            {selectedRouter && (
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="router-name">Router Name</Label>
                                  <Input id="router-name" defaultValue={selectedRouter.name} />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="ip-address">IP Address</Label>
                                  <Input id="ip-address" defaultValue={selectedRouter.ipAddress} />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="location">Location</Label>
                                  <Input id="location" defaultValue={selectedRouter.location} />
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Switch id="dhcp" defaultChecked />
                                  <Label htmlFor="dhcp">Enable DHCP</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Switch id="firewall" defaultChecked />
                                  <Label htmlFor="firewall">Enable Firewall</Label>
                                </div>
                                <div className="flex justify-end space-x-2">
                                  <Button variant="outline">Cancel</Button>
                                  <Button className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredRouters.length === 0 && (
            <div className="text-center py-12">
              <Router className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No routers found</h3>
              <p className="text-gray-500 mb-6">No routers match your current search criteria.</p>
              <Link href="/network/add">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Router
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
