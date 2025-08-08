"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Router, Activity, Settings, Plus, RefreshCw, Eye, Edit, Trash2, Wifi, Signal, Users, Network, AlertCircle, CheckCircle, XCircle } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

// Mock data for OLT devices
const oltDevices = [
  {
    id: "OLT-001",
    name: "OLT-001",
    ip: "192.168.1.100",
    status: "online",
    model: "Huawei MA5608T",
    location: "Main Office",
    total_ports: 128,
    active_onus: 24,
    uptime: "99.9%",
    last_seen: "2024-01-15T10:30:00Z"
  },
  {
    id: "OLT-002", 
    name: "OLT-002",
    ip: "192.168.1.101",
    status: "online",
    model: "ZTE C320",
    location: "Branch Office",
    total_ports: 64,
    active_onus: 18,
    uptime: "98.5%",
    last_seen: "2024-01-15T10:25:00Z"
  },
  {
    id: "OLT-003",
    name: "OLT-003", 
    ip: "192.168.1.102",
    status: "offline",
    model: "Huawei MA5800",
    location: "Remote Site",
    total_ports: 256,
    active_onus: 0,
    uptime: "0%",
    last_seen: "2024-01-14T15:20:00Z"
  }
]

// Mock data for ONUs
const onuDevices = [
  {
    id: 1,
    serial: "HWTC12345678",
    customer_name: "John Doe",
    customer_id: 1001,
    olt_id: "OLT-001",
    port: "1/1/1",
    status: "online",
    signal_strength: -18.5,
    distance: 1.2,
    service_plan: "Premium 100Mbps",
    last_seen: "2024-01-15T10:30:00Z"
  },
  {
    id: 2,
    serial: "HWTC87654321",
    customer_name: "Jane Smith", 
    customer_id: 1002,
    olt_id: "OLT-001",
    port: "1/1/2",
    status: "online",
    signal_strength: -20.1,
    distance: 2.8,
    service_plan: "Basic 50Mbps",
    last_seen: "2024-01-15T10:28:00Z"
  },
  {
    id: 3,
    serial: "ZTEC11223344",
    customer_name: "Bob Johnson",
    customer_id: 1003, 
    olt_id: "OLT-002",
    port: "1/2/1",
    status: "offline",
    signal_strength: null,
    distance: null,
    service_plan: "Standard 75Mbps",
    last_seen: "2024-01-14T18:45:00Z"
  }
]

export default function SmartOLTPage() {
  const { toast } = useToast()
  const [selectedTab, setSelectedTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(false)

  const handleSyncData = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
    toast({
      title: "Data synchronized",
      description: "OLT and ONU data has been updated successfully.",
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "offline":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "online":
        return <Badge className="bg-green-100 text-green-800">online</Badge>
      case "offline":
        return <Badge className="bg-red-100 text-red-800">offline</Badge>
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">unknown</Badge>
    }
  }

  const totalOLTs = oltDevices.length
  const onlineOLTs = oltDevices.filter(olt => olt.status === "online").length
  const totalONUs = onuDevices.length
  const activeONUs = onuDevices.filter(onu => onu.status === "online").length
  const networkHealth = Math.round((onlineOLTs / totalOLTs) * 100)

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">SmartOLT Management</h2>
          <p className="text-muted-foreground">Manage OLT devices and ONU configurations</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            onClick={handleSyncData}
            disabled={isLoading}
          >
            {isLoading ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Sync Data
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add OLT
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total OLTs</CardTitle>
            <Router className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOLTs}</div>
            <p className="text-xs text-muted-foreground">
              {onlineOLTs} online
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active ONUs</CardTitle>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeONUs}</div>
            <p className="text-xs text-muted-foreground">
              {totalONUs} total ONUs
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{networkHealth}%</div>
            <p className="text-xs text-muted-foreground">
              Overall network status
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Status</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Connected</div>
            <p className="text-xs text-muted-foreground">
              Last sync: 2 min ago
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="olt-devices">OLT Devices</TabsTrigger>
          <TabsTrigger value="onu-management">ONU Management</TabsTrigger>
          <TabsTrigger value="api-settings">API Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>OLT Status Overview</CardTitle>
                <CardDescription>Current status of all OLT devices</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {oltDevices.map((olt) => (
                  <div key={olt.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(olt.status)}
                      <div>
                        <p className="font-medium">{olt.name}</p>
                        <p className="text-sm text-muted-foreground">{olt.ip}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(olt.status)}
                      <p className="text-sm text-muted-foreground mt-1">
                        {olt.active_onus}/{olt.total_ports} ONUs
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Network performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>OLT Utilization</span>
                    <span>65%</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>ONU Registration Rate</span>
                    <span>92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Network Stability</span>
                    <span>98%</span>
                  </div>
                  <Progress value={98} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="olt-devices" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>OLT Devices</CardTitle>
                <CardDescription>Manage your OLT device inventory</CardDescription>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add OLT Device
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Device</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>ONUs</TableHead>
                    <TableHead>Uptime</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {oltDevices.map((olt) => (
                    <TableRow key={olt.id}>
                      <TableCell className="font-medium">{olt.name}</TableCell>
                      <TableCell className="font-mono text-sm">{olt.ip}</TableCell>
                      <TableCell>{olt.model}</TableCell>
                      <TableCell>{olt.location}</TableCell>
                      <TableCell>{getStatusBadge(olt.status)}</TableCell>
                      <TableCell>
                        {olt.active_onus}/{olt.total_ports}
                      </TableCell>
                      <TableCell>{olt.uptime}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="onu-management" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>ONU Management</CardTitle>
              <CardDescription>Monitor and manage customer ONUs</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Serial Number</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>OLT/Port</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Signal</TableHead>
                    <TableHead>Distance</TableHead>
                    <TableHead>Service Plan</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {onuDevices.map((onu) => (
                    <TableRow key={onu.id}>
                      <TableCell className="font-mono text-sm">{onu.serial}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{onu.customer_name}</div>
                          <div className="text-sm text-muted-foreground">ID: {onu.customer_id}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{onu.olt_id}</div>
                          <div className="text-sm text-muted-foreground">{onu.port}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(onu.status)}</TableCell>
                      <TableCell>
                        {onu.signal_strength ? (
                          <span className={`font-mono text-sm ${onu.signal_strength > -20 ? 'text-green-600' : 'text-yellow-600'}`}>
                            {onu.signal_strength} dBm
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {onu.distance ? `${onu.distance} km` : "-"}
                      </TableCell>
                      <TableCell>{onu.service_plan}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api-settings" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>API Configuration</CardTitle>
                <CardDescription>Configure SmartOLT API connection settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-endpoint">API Endpoint</Label>
                  <Input
                    id="api-endpoint"
                    placeholder="https://api.smartolt.example.com"
                    defaultValue="https://api.smartolt.example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <Input
                    id="api-key"
                    type="password"
                    placeholder="Enter API key"
                    defaultValue="sk-1234567890abcdef"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sync-interval">Sync Interval (minutes)</Label>
                  <Select defaultValue="5">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 minute</SelectItem>
                      <SelectItem value="5">5 minutes</SelectItem>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="auto-sync" defaultChecked />
                  <Label htmlFor="auto-sync">Enable automatic synchronization</Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Connection Status</CardTitle>
                <CardDescription>Current API connection status and logs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Connected</span>
                </div>
                <div className="space-y-2">
                  <Label>Last Sync</Label>
                  <p className="text-sm text-muted-foreground">2024-01-15 10:30:00</p>
                </div>
                <div className="space-y-2">
                  <Label>Next Sync</Label>
                  <p className="text-sm text-muted-foreground">2024-01-15 10:35:00</p>
                </div>
                <div className="space-y-2">
                  <Label>Connection Log</Label>
                  <Textarea
                    readOnly
                    rows={6}
                    className="font-mono text-xs"
                    defaultValue={`[2024-01-15 10:30:00] Connected to SmartOLT API
[2024-01-15 10:30:01] Syncing OLT devices...
[2024-01-15 10:30:02] Found 3 OLT devices
[2024-01-15 10:30:03] Syncing ONU devices...
[2024-01-15 10:30:04] Found 3 ONU devices
[2024-01-15 10:30:05] Sync completed successfully`}
                  />
                </div>
                <Button variant="outline" className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Test Connection
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
