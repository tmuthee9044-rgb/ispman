"use client"

import { useState } from "react"
import { ArrowLeft, Router, Wifi, Power, Settings, RefreshCw, Plus, Search, Filter, Activity, AlertTriangle, Eye, Edit, Trash2, PowerOff, MoreHorizontal } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

// Sample router data
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
  },
]

export default function RoutersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
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
          title: "Edit Configuration",
          description: `Opening configuration for ${routerName} (${routerId})`,
        })
        break
      case "restart":
        toast({
          title: "Router Restart Initiated",
          description: `Restarting ${routerName} (${routerId})`,
        })
        break
      case "shutdown":
        toast({
          title: "Shutdown Initiated",
          description: `Shutting down ${routerName} (${routerId})`,
        })
        break
      case "power-on":
        toast({
          title: "Power On Initiated",
          description: `Powering on ${routerName} (${routerId})`,
        })
        break
      case "delete":
        toast({
          title: "Router Removal",
          description: `Removing ${routerName} (${routerId}) from network`,
          variant: "destructive",
        })
        break
      default:
        break
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "default"
      case "offline":
        return "destructive"
      case "warning":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <Activity className="h-4 w-4 text-green-600" />
      case "offline":
        return <Power className="h-4 w-4 text-red-600" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      default:
        return <Router className="h-4 w-4" />
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <Link href="/network">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Network
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Router Management</h2>
            <p className="text-muted-foreground">Monitor and manage network routers</p>
          </div>
        </div>
        <Link href="/network/add">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Router
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Online Routers</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{onlineRouters}</div>
            <p className="text-xs text-muted-foreground">out of {routers.length} total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offline Routers</CardTitle>
            <Power className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{offlineRouters}</div>
            <p className="text-xs text-muted-foreground">require attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warnings</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{warningRouters}</div>
            <p className="text-xs text-muted-foreground">need monitoring</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connected Devices</CardTitle>
            <Wifi className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDevices}</div>
            <p className="text-xs text-muted-foreground">across all routers</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search routers by name, model, location, or IP..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="online">Online</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Routers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Network Routers ({filteredRouters.length})</CardTitle>
          <CardDescription>Monitor status, performance, and manage router configurations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Router</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Bandwidth</TableHead>
                  <TableHead className="hidden lg:table-cell">Devices</TableHead>
                  <TableHead className="hidden lg:table-cell">Temperature</TableHead>
                  <TableHead className="hidden xl:table-cell">Uptime</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRouters.map((router) => (
                  <TableRow key={router.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{router.name}</div>
                        <div className="text-sm text-muted-foreground">{router.model}</div>
                        <div className="text-sm text-muted-foreground">{router.ipAddress}</div>
                        <div className="text-sm text-muted-foreground">{router.location}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(router.status)}
                        <Badge variant={getStatusColor(router.status)}>{router.status}</Badge>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{router.bandwidth.used}%</span>
                          <span>{router.bandwidth.total} Mbps</span>
                        </div>
                        <Progress value={router.bandwidth.used} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">{router.connectedDevices}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <span className={router.temperature > 50 ? "text-red-600" : "text-green-600"}>
                        {router.temperature}°C
                      </span>
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">{router.uptime}</TableCell>
                    <TableCell>
                      <div className="flex flex-col sm:flex-row gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRouterAction("restart", router.id, router.name)}
                          disabled={router.status === "offline"}
                        >
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Restart
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRouterAction(router.status === "offline" ? "power-on" : "shutdown", router.id, router.name)}
                        >
                          <Power className="h-3 w-3 mr-1" />
                          {router.status === "offline" ? "On" : "Off"}
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Settings className="h-3 w-3 mr-1" />
                              More
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleRouterAction("view", router.id, router.name)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRouterAction("edit", router.id, router.name)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Configuration
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleRouterAction("restart", router.id, router.name)}>
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Restart
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
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleRouterAction("delete", router.id, router.name)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
