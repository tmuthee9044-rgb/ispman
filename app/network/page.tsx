"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { Router, Activity, Clock, Plus, Search, Filter, MoreHorizontal, Settings, Power, RefreshCw, AlertTriangle, CheckCircle, Signal, Globe, Shield, Zap, Eye, Edit, Trash2, PowerOff } from 'lucide-react'

export default function NetworkPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const { toast } = useToast()
  const router = useRouter()

  // Mock router data
  const routers = [
    {
      id: "R001",
      name: "Main Gateway",
      location: "Data Center",
      status: "online",
      connections: 450,
      uptime: "99.9%",
      ip: "192.168.1.1",
      model: "EdgeRouter Pro",
      load: 45,
      lastSeen: "2024-01-15 14:30:00",
    },
    {
      id: "R002",
      name: "Sector A Router",
      location: "Residential Area",
      status: "online",
      connections: 320,
      uptime: "99.5%",
      ip: "192.168.1.2",
      model: "MikroTik hEX",
      load: 62,
      lastSeen: "2024-01-15 14:29:45",
    },
    {
      id: "R003",
      name: "Business Hub",
      location: "Commercial District",
      status: "warning",
      connections: 180,
      uptime: "98.2%",
      ip: "192.168.1.3",
      model: "Ubiquiti Dream Machine",
      load: 78,
      lastSeen: "2024-01-15 14:25:12",
    },
    {
      id: "R004",
      name: "Backup Router",
      location: "Data Center",
      status: "offline",
      connections: 0,
      uptime: "0%",
      ip: "192.168.1.4",
      model: "EdgeRouter Lite",
      load: 0,
      lastSeen: "2024-01-14 09:15:30",
    },
    {
      id: "R005",
      name: "School Network",
      location: "Education Zone",
      status: "online",
      connections: 95,
      uptime: "99.1%",
      ip: "192.168.1.5",
      model: "TP-Link Archer",
      load: 34,
      lastSeen: "2024-01-15 14:28:20",
    },
  ]

  const handleRouterAction = (action: string, routerId: string, routerName: string) => {
    switch (action) {
      case "view":
        toast({
          title: "Router Details",
          description: `Viewing details for ${routerName} (${routerId})`,
        })
        break
      case "edit":
        toast({
          title: "Edit Router",
          description: `Opening configuration for ${routerName} (${routerId})`,
        })
        break
      case "restart":
        toast({
          title: "Router Restart",
          description: `Restarting ${routerName} (${routerId})`,
        })
        break
      case "shutdown":
        toast({
          title: "Router Shutdown",
          description: `Shutting down ${routerName} (${routerId})`,
        })
        break
      case "power-on":
        toast({
          title: "Router Power On",
          description: `Powering on ${routerName} (${routerId})`,
        })
        break
      case "delete":
        toast({
          title: "Router Deletion",
          description: `Removing ${routerName} (${routerId}) from network`,
          variant: "destructive",
        })
        break
      default:
        break
    }
  }

  const handleSettingsClick = () => {
    router.push("/settings")
  }

  const handleViewMonitoring = () => {
    router.push("/network/monitoring")
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "offline":
        return <Power className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "online":
        return <Badge className="bg-green-100 text-green-800">Online</Badge>
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>
      case "offline":
        return <Badge className="bg-red-100 text-red-800">Offline</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getLoadColor = (load: number) => {
    if (load >= 80) return "text-red-600"
    if (load >= 60) return "text-yellow-600"
    return "text-green-600"
  }

  const filteredRouters = routers.filter((router) => {
    const matchesSearch =
      router.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      router.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      router.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || router.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalRouters = routers.length
  const onlineRouters = routers.filter((r) => r.status === "online").length
  const totalConnections = routers.reduce((sum, router) => sum + router.connections, 0)
  const avgUptime = routers.reduce((sum, router) => sum + Number.parseFloat(router.uptime), 0) / routers.length

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Network Management</h2>
          <p className="text-muted-foreground">Monitor and manage your network infrastructure</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleSettingsClick}>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Link href="/network/add">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Router
            </Button>
          </Link>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Routers</CardTitle>
            <Router className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRouters}</div>
            <p className="text-xs text-muted-foreground">
              {onlineRouters} online, {totalRouters - onlineRouters} offline
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Connections</CardTitle>
            <Signal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalConnections.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bandwidth Usage</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: "85%" }}></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network Uptime</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgUptime.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Network Management Tabs */}
      <Tabs defaultValue="routers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="routers">Routers</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="routers" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Router Management</CardTitle>
                  <CardDescription>Monitor and manage network routers</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search routers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-64"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Router ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Connections</TableHead>
                    <TableHead>Uptime</TableHead>
                    <TableHead>Load</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRouters.map((router) => (
                    <TableRow key={router.id}>
                      <TableCell className="font-medium">{router.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(router.status)}
                          <span>{router.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{router.location}</TableCell>
                      <TableCell>{getStatusBadge(router.status)}</TableCell>
                      <TableCell>{router.connections}</TableCell>
                      <TableCell>{router.uptime}</TableCell>
                      <TableCell>
                        <span className={getLoadColor(router.load)}>{router.load}%</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleRouterAction("edit", router.id, router.name)}
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleRouterAction("restart", router.id, router.name)}
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleRouterAction("view", router.id, router.name)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleRouterAction("edit", router.id, router.name)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Configuration
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleRouterAction("restart", router.id, router.name)}>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Restart Router
                              </DropdownMenuItem>
                              {router.status === "online" ? (
                                <DropdownMenuItem onClick={() => handleRouterAction("shutdown", router.id, router.name)}>
                                  <PowerOff className="mr-2 h-4 w-4" />
                                  Shutdown
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem onClick={() => handleRouterAction("power-on", router.id, router.name)}>
                                  <Power className="mr-2 h-4 w-4" />
                                  Power On
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem 
                                onClick={() => handleRouterAction("delete", router.id, router.name)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Remove Router
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Network Monitoring</CardTitle>
              <CardDescription>Real-time network performance monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Network Monitoring Dashboard</h3>
                <p className="text-muted-foreground mb-4">Real-time monitoring tools and analytics</p>
                <Button onClick={handleViewMonitoring}>
                  <Zap className="h-4 w-4 mr-2" />
                  View Live Monitoring
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
