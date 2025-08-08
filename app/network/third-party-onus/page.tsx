"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { Router, Plus, Search, Filter, MoreHorizontal, Settings, Power, RefreshCw, AlertTriangle, CheckCircle, Signal, Activity, Eye, Edit, Trash2, PowerOff, Cable, Zap, MonitorSpeaker, HardDrive, Network, Wifi, Globe, Shield, Terminal } from 'lucide-react'

interface ThirdPartyONU {
  id: string
  customer_name: string
  brand: "huawei" | "zte" | "fiberhome" | "other"
  model: string
  serial_number: string
  mac_address: string
  management_ip: string
  management_protocol: "tr069" | "snmp" | "telnet" | "ssh" | "web"
  status: "online" | "offline" | "unreachable" | "maintenance"
  firmware_version: string
  wifi_ssid: string
  wifi_password: string
  wifi_channel: number
  wifi_security: string
  service_plan: string
  last_seen: string
  signal_strength: number
  uptime: string
  location: string
  notes: string
}

export default function ThirdPartyONUsPage() {
  const [onus, setOnus] = useState<ThirdPartyONU[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [brandFilter, setBrandFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedONU, setSelectedONU] = useState<ThirdPartyONU | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showWiFiModal, setShowWiFiModal] = useState(false)
  const [showTR069Modal, setShowTR069Modal] = useState(false)
  const { toast } = useToast()

  // Mock data for third-party ONUs
  const mockONUs: ThirdPartyONU[] = [
    {
      id: "ONU_TP001",
      customer_name: "Alice Johnson",
      brand: "huawei",
      model: "HG8245H",
      serial_number: "HWT21234567",
      mac_address: "00:25:9E:12:34:56",
      management_ip: "192.168.1.150",
      management_protocol: "tr069",
      status: "online",
      firmware_version: "V3R017C10S115",
      wifi_ssid: "Alice_Home_WiFi",
      wifi_password: "alice2024secure",
      wifi_channel: 6,
      wifi_security: "WPA2-PSK",
      service_plan: "Premium 100Mbps",
      last_seen: "2024-01-15 14:30:00",
      signal_strength: -19,
      uptime: "15 days, 8 hours",
      location: "Residential Area A",
      notes: "Customer requested WiFi password change last week",
    },
    {
      id: "ONU_TP002",
      customer_name: "David Chen",
      brand: "zte",
      model: "F660",
      serial_number: "ZTEG87654321",
      mac_address: "00:1E:2A:87:65:43",
      management_ip: "192.168.1.151",
      management_protocol: "snmp",
      status: "online",
      firmware_version: "V8.0.10P7N1",
      wifi_ssid: "Chen_Family",
      wifi_password: "chen123456",
      wifi_channel: 11,
      wifi_security: "WPA3-PSK",
      service_plan: "Standard 50Mbps",
      last_seen: "2024-01-15 14:28:45",
      signal_strength: -22,
      uptime: "8 days, 12 hours",
      location: "Business District",
      notes: "Upgraded to WPA3 security last month",
    },
    {
      id: "ONU_TP003",
      customer_name: "Maria Rodriguez",
      brand: "fiberhome",
      model: "AN5506-04-F",
      serial_number: "FHTT11223344",
      mac_address: "00:0F:E2:11:22:33",
      management_ip: "192.168.1.152",
      management_protocol: "web",
      status: "offline",
      firmware_version: "RP2613",
      wifi_ssid: "Rodriguez_WiFi",
      wifi_password: "maria2024",
      wifi_channel: 1,
      wifi_security: "WPA2-PSK",
      service_plan: "Basic 25Mbps",
      last_seen: "2024-01-14 22:15:30",
      signal_strength: 0,
      uptime: "0 days, 0 hours",
      location: "Suburban Area",
      notes: "Customer reported connectivity issues yesterday",
    },
    {
      id: "ONU_TP004",
      customer_name: "Robert Kim",
      brand: "huawei",
      model: "HG8310M",
      serial_number: "HWT98765432",
      mac_address: "00:25:9E:98:76:54",
      management_ip: "192.168.1.153",
      management_protocol: "tr069",
      status: "unreachable",
      firmware_version: "V3R017C00S124",
      wifi_ssid: "Kim_Network",
      wifi_password: "robert2024wifi",
      wifi_channel: 9,
      wifi_security: "WPA2-PSK",
      service_plan: "Premium 100Mbps",
      last_seen: "2024-01-15 10:45:00",
      signal_strength: -25,
      uptime: "3 days, 5 hours",
      location: "Commercial Zone",
      notes: "TR-069 connection issues, needs manual configuration",
    },
  ]

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setOnus(mockONUs)
      setLoading(false)
    }, 1000)
  }, [])

  const handleONUAction = (action: string, onu: ThirdPartyONU) => {
    switch (action) {
      case "view":
        setSelectedONU(onu)
        setShowDetailsModal(true)
        break
      case "configure_wifi":
        setSelectedONU(onu)
        setShowWiFiModal(true)
        break
      case "tr069_config":
        setSelectedONU(onu)
        setShowTR069Modal(true)
        break
      case "reboot":
        toast({
          title: "ONU Reboot",
          description: `Rebooting ${onu.brand.toUpperCase()} ONU for ${onu.customer_name}`,
        })
        break
      case "factory_reset":
        toast({
          title: "Factory Reset",
          description: `Factory reset initiated for ${onu.customer_name}'s ONU`,
          variant: "destructive",
        })
        break
      case "firmware_update":
        toast({
          title: "Firmware Update",
          description: `Firmware update started for ${onu.customer_name}'s ONU`,
        })
        break
      case "delete":
        toast({
          title: "ONU Removed",
          description: `${onu.customer_name}'s ONU has been removed from management`,
          variant: "destructive",
        })
        break
    }
  }

  const getBrandIcon = (brand: string) => {
    switch (brand) {
      case "huawei":
        return <Router className="h-4 w-4 text-red-500" />
      case "zte":
        return <Router className="h-4 w-4 text-blue-500" />
      case "fiberhome":
        return <Router className="h-4 w-4 text-green-500" />
      default:
        return <Router className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "offline":
        return <Power className="h-4 w-4 text-red-500" />
      case "unreachable":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case "maintenance":
        return <Settings className="h-4 w-4 text-yellow-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "online":
        return <Badge className="bg-green-100 text-green-800">Online</Badge>
      case "offline":
        return <Badge className="bg-red-100 text-red-800">Offline</Badge>
      case "unreachable":
        return <Badge className="bg-orange-100 text-orange-800">Unreachable</Badge>
      case "maintenance":
        return <Badge className="bg-yellow-100 text-yellow-800">Maintenance</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getProtocolBadge = (protocol: string) => {
    const colors = {
      tr069: "bg-blue-100 text-blue-800",
      snmp: "bg-purple-100 text-purple-800",
      telnet: "bg-gray-100 text-gray-800",
      ssh: "bg-green-100 text-green-800",
      web: "bg-orange-100 text-orange-800",
    }
    return <Badge className={colors[protocol as keyof typeof colors]}>{protocol.toUpperCase()}</Badge>
  }

  const getSignalColor = (signal: number) => {
    if (signal >= -20) return "text-green-600"
    if (signal >= -25) return "text-yellow-600"
    return "text-red-600"
  }

  const filteredONUs = onus.filter((onu) => {
    const matchesSearch = onu.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         onu.serial_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         onu.management_ip.includes(searchTerm) ||
                         onu.model.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesBrand = brandFilter === "all" || onu.brand === brandFilter
    const matchesStatus = statusFilter === "all" || onu.status === statusFilter
    return matchesSearch && matchesBrand && matchesStatus
  })

  if (loading) {
    return <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">Loading Third Party ONUs...</div>
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Third Party ONUs</h2>
          <p className="text-muted-foreground">Manage Huawei, ZTE, Fiberhome and other fiber routers via TR-069, SNMP, and management interfaces</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Terminal className="h-4 w-4 mr-2" />
            Bulk Config
          </Button>
          <Button size="sm" onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add ONU
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total ONUs</CardTitle>
            <Router className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{onus.length}</div>
            <p className="text-xs text-muted-foreground">
              {onus.filter(o => o.status === "online").length} online
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Huawei Devices</CardTitle>
            <Router className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{onus.filter(o => o.brand === "huawei").length}</div>
            <p className="text-xs text-muted-foreground">TR-069 managed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ZTE Devices</CardTitle>
            <Router className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{onus.filter(o => o.brand === "zte").length}</div>
            <p className="text-xs text-muted-foreground">SNMP managed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fiberhome Devices</CardTitle>
            <Router className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{onus.filter(o => o.brand === "fiberhome").length}</div>
            <p className="text-xs text-muted-foreground">Web managed</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="devices" className="space-y-4">
        <TabsList>
          <TabsTrigger value="devices">Device Management</TabsTrigger>
          <TabsTrigger value="wifi">WiFi Configuration</TabsTrigger>
          <TabsTrigger value="protocols">Protocol Settings</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="devices" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Third Party ONU Management</CardTitle>
                  <CardDescription>Configure and manage non-SmartOLT fiber routers</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search ONUs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-64"
                    />
                  </div>
                  <Select value={brandFilter} onValueChange={setBrandFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Brands</SelectItem>
                      <SelectItem value="huawei">Huawei</SelectItem>
                      <SelectItem value="zte">ZTE</SelectItem>
                      <SelectItem value="fiberhome">Fiberhome</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                      <SelectItem value="unreachable">Unreachable</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Brand/Model</TableHead>
                    <TableHead>Management IP</TableHead>
                    <TableHead>Protocol</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Signal</TableHead>
                    <TableHead>WiFi SSID</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredONUs.map((onu) => (
                    <TableRow key={onu.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(onu.status)}
                          <div>
                            <div className="font-medium">{onu.customer_name}</div>
                            <div className="text-sm text-muted-foreground">{onu.serial_number}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getBrandIcon(onu.brand)}
                          <div>
                            <div className="font-medium capitalize">{onu.brand}</div>
                            <div className="text-sm text-muted-foreground">{onu.model}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{onu.management_ip}</TableCell>
                      <TableCell>{getProtocolBadge(onu.management_protocol)}</TableCell>
                      <TableCell>{getStatusBadge(onu.status)}</TableCell>
                      <TableCell>
                        {onu.signal_strength !== 0 ? (
                          <span className={getSignalColor(onu.signal_strength)}>
                            {onu.signal_strength}dBm
                          </span>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>{onu.wifi_ssid}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleONUAction("view", onu)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleONUAction("configure_wifi", onu)}
                          >
                            <Wifi className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleONUAction("view", onu)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleONUAction("configure_wifi", onu)}>
                                <Wifi className="mr-2 h-4 w-4" />
                                Configure WiFi
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleONUAction("tr069_config", onu)}>
                                <Terminal className="mr-2 h-4 w-4" />
                                TR-069 Config
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleONUAction("reboot", onu)}>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Reboot Device
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleONUAction("firmware_update", onu)}>
                                <HardDrive className="mr-2 h-4 w-4" />
                                Update Firmware
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleONUAction("factory_reset", onu)}
                                className="text-orange-600"
                              >
                                <PowerOff className="mr-2 h-4 w-4" />
                                Factory Reset
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleONUAction("delete", onu)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Remove Device
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

        <TabsContent value="wifi" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>WiFi Management</CardTitle>
                <CardDescription>Bulk WiFi configuration for customer devices</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Default WiFi Security</Label>
                  <Select defaultValue="wpa2">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wpa2">WPA2-PSK</SelectItem>
                      <SelectItem value="wpa3">WPA3-PSK</SelectItem>
                      <SelectItem value="mixed">WPA2/WPA3 Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Default WiFi Channel</Label>
                  <Select defaultValue="auto">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto</SelectItem>
                      <SelectItem value="1">Channel 1</SelectItem>
                      <SelectItem value="6">Channel 6</SelectItem>
                      <SelectItem value="11">Channel 11</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full">
                  <Wifi className="h-4 w-4 mr-2" />
                  Apply to All Devices
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>WiFi Statistics</CardTitle>
                <CardDescription>Current WiFi configuration overview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>WPA2 Devices</span>
                  <span className="font-bold">{onus.filter(o => o.wifi_security === "WPA2-PSK").length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>WPA3 Devices</span>
                  <span className="font-bold">{onus.filter(o => o.wifi_security === "WPA3-PSK").length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Channel 6 Usage</span>
                  <span className="font-bold">{onus.filter(o => o.wifi_channel === 6).length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Average Signal</span>
                  <span className="font-bold text-green-600">
                    {Math.round(onus.filter(o => o.signal_strength !== 0).reduce((sum, o) => sum + o.signal_strength, 0) / onus.filter(o => o.signal_strength !== 0).length)}dBm
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="protocols" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>TR-069 Configuration</CardTitle>
                <CardDescription>Auto Configuration Server settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>ACS URL</Label>
                  <Input defaultValue="http://acs.techconnect.co.ke:7547" />
                </div>
                <div className="space-y-2">
                  <Label>ACS Username</Label>
                  <Input defaultValue="acs_admin" />
                </div>
                <div className="space-y-2">
                  <Label>ACS Password</Label>
                  <Input type="password" defaultValue="********" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Auto-provision</span>
                  <Badge variant="default">Enabled</Badge>
                </div>
                <Button className="w-full">
                  <Terminal className="h-4 w-4 mr-2" />
                  Update TR-069 Config
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>SNMP Configuration</CardTitle>
                <CardDescription>SNMP monitoring settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>SNMP Version</Label>
                  <Select defaultValue="v2c">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="v1">SNMPv1</SelectItem>
                      <SelectItem value="v2c">SNMPv2c</SelectItem>
                      <SelectItem value="v3">SNMPv3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Community String</Label>
                  <Input defaultValue="public" />
                </div>
                <div className="space-y-2">
                  <Label>SNMP Port</Label>
                  <Input defaultValue="161" />
                </div>
                <Button className="w-full">
                  <Network className="h-4 w-4 mr-2" />
                  Update SNMP Config
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Web Management</CardTitle>
                <CardDescription>HTTP/HTTPS access settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Default Username</Label>
                  <Input defaultValue="admin" />
                </div>
                <div className="space-y-2">
                  <Label>Default Password</Label>
                  <Input type="password" defaultValue="admin" />
                </div>
                <div className="space-y-2">
                  <Label>Management Port</Label>
                  <Input defaultValue="80" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">HTTPS Enabled</span>
                  <Badge variant="secondary">Disabled</Badge>
                </div>
                <Button className="w-full">
                  <Globe className="h-4 w-4 mr-2" />
                  Update Web Config
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Device Health</CardTitle>
                <CardDescription>Real-time monitoring status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Online Devices</span>
                  <span className="font-bold text-green-600">{onus.filter(o => o.status === "online").length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Offline Devices</span>
                  <span className="font-bold text-red-600">{onus.filter(o => o.status === "offline").length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Unreachable Devices</span>
                  <span className="font-bold text-orange-600">{onus.filter(o => o.status === "unreachable").length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Average Uptime</span>
                  <span className="font-bold">12.5 days</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Recent Alerts</CardTitle>
                <CardDescription>Latest device notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  <span className="text-sm">TR-069 connection failed for Robert Kim</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Power className="h-4 w-4 text-red-500" />
                  <span className="text-sm">Maria Rodriguez ONU went offline</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">WiFi configuration updated for Alice Johnson</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Settings className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Firmware update completed for David Chen</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Device Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Device Details - {selectedONU?.customer_name}</DialogTitle>
            <DialogDescription>Complete device information and configuration</DialogDescription>
          </DialogHeader>
          {selectedONU && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Brand/Model</Label>
                  <div className="font-medium capitalize">{selectedONU.brand} {selectedONU.model}</div>
                </div>
                <div>
                  <Label>Serial Number</Label>
                  <div className="font-mono text-sm">{selectedONU.serial_number}</div>
                </div>
                <div>
                  <Label>MAC Address</Label>
                  <div className="font-mono text-sm">{selectedONU.mac_address}</div>
                </div>
                <div>
                  <Label>Management IP</Label>
                  <div className="font-medium">{selectedONU.management_ip}</div>
                </div>
                <div>
                  <Label>Protocol</Label>
                  <div>{getProtocolBadge(selectedONU.management_protocol)}</div>
                </div>
                <div>
                  <Label>Status</Label>
                  <div>{getStatusBadge(selectedONU.status)}</div>
                </div>
                <div>
                  <Label>Firmware Version</Label>
                  <div className="font-medium">{selectedONU.firmware_version}</div>
                </div>
                <div>
                  <Label>Signal Strength</Label>
                  <div className={`font-medium ${getSignalColor(selectedONU.signal_strength)}`}>
                    {selectedONU.signal_strength !== 0 ? `${selectedONU.signal_strength} dBm` : "N/A"}
                  </div>
                </div>
                <div>
                  <Label>Service Plan</Label>
                  <div className="font-medium">{selectedONU.service_plan}</div>
                </div>
                <div>
                  <Label>Uptime</Label>
                  <div className="font-medium">{selectedONU.uptime}</div>
                </div>
              </div>
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">WiFi Configuration</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>WiFi SSID</Label>
                    <div className="font-medium">{selectedONU.wifi_ssid}</div>
                  </div>
                  <div>
                    <Label>WiFi Security</Label>
                    <div className="font-medium">{selectedONU.wifi_security}</div>
                  </div>
                  <div>
                    <Label>WiFi Channel</Label>
                    <div className="font-medium">Channel {selectedONU.wifi_channel}</div>
                  </div>
                  <div>
                    <Label>WiFi Password</Label>
                    <div className="font-mono text-sm">••••••••••</div>
                  </div>
                </div>
              </div>
              {selectedONU.notes && (
                <div className="border-t pt-4">
                  <Label>Notes</Label>
                  <div className="text-sm text-muted-foreground mt-1">{selectedONU.notes}</div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsModal(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setShowDetailsModal(false)
              if (selectedONU) {
                setShowWiFiModal(true)
              }
            }}>
              Configure WiFi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* WiFi Configuration Modal */}
      <Dialog open={showWiFiModal} onOpenChange={setShowWiFiModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>WiFi Configuration - {selectedONU?.customer_name}</DialogTitle>
            <DialogDescription>Update WiFi settings for customer device</DialogDescription>
          </DialogHeader>
          {selectedONU && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="wifi_ssid">WiFi SSID</Label>
                <Input id="wifi_ssid" defaultValue={selectedONU.wifi_ssid} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wifi_password">WiFi Password</Label>
                <Input id="wifi_password" type="password" defaultValue={selectedONU.wifi_password} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wifi_security">Security Type</Label>
                <Select defaultValue={selectedONU.wifi_security.toLowerCase().replace('-psk', '')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wpa2">WPA2-PSK</SelectItem>
                    <SelectItem value="wpa3">WPA3-PSK</SelectItem>
                    <SelectItem value="mixed">WPA2/WPA3 Mixed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="wifi_channel">WiFi Channel</Label>
                <Select defaultValue={selectedONU.wifi_channel.toString()}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto</SelectItem>
                    <SelectItem value="1">Channel 1</SelectItem>
                    <SelectItem value="6">Channel 6</SelectItem>
                    <SelectItem value="11">Channel 11</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowWiFiModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              toast({
                title: "WiFi Updated",
                description: `WiFi settings updated for ${selectedONU?.customer_name}`,
              })
              setShowWiFiModal(false)
            }}>
              Update WiFi Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* TR-069 Configuration Modal */}
      <Dialog open={showTR069Modal} onOpenChange={setShowTR069Modal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>TR-069 Configuration - {selectedONU?.customer_name}</DialogTitle>
            <DialogDescription>Configure TR-069 parameters for remote management</DialogDescription>
          </DialogHeader>
          {selectedONU && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="acs_url">ACS URL</Label>
                  <Input id="acs_url" defaultValue="http://acs.techconnect.co.ke:7547" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="acs_username">ACS Username</Label>
                  <Input id="acs_username" defaultValue="acs_admin" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="acs_password">ACS Password</Label>
                  <Input id="acs_password" type="password" defaultValue="********" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="connection_request_url">Connection Request URL</Label>
                  <Input id="connection_request_url" defaultValue={`http://${selectedONU.management_ip}:7547`} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="periodic_inform">Periodic Inform Interval</Label>
                  <Select defaultValue="300">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="60">1 minute</SelectItem>
                      <SelectItem value="300">5 minutes</SelectItem>
                      <SelectItem value="900">15 minutes</SelectItem>
                      <SelectItem value="3600">1 hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="connection_request_username">CR Username</Label>
                  <Input id="connection_request_username" defaultValue="admin" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="parameter_key">Parameter Key</Label>
                <Input id="parameter_key" placeholder="Optional parameter key" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTR069Modal(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              toast({
                title: "TR-069 Updated",
                description: `TR-069 configuration updated for ${selectedONU?.customer_name}`,
              })
              setShowTR069Modal(false)
            }}>
              Update TR-069 Config
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add ONU Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Third Party ONU</DialogTitle>
            <DialogDescription>Register a new fiber router for management</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customer_name">Customer Name</Label>
                <Input id="customer_name" placeholder="Enter customer name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="huawei">Huawei</SelectItem>
                    <SelectItem value="zte">ZTE</SelectItem>
                    <SelectItem value="fiberhome">Fiberhome</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input id="model" placeholder="Device model" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="serial_number">Serial Number</Label>
                <Input id="serial_number" placeholder="Device serial number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mac_address">MAC Address</Label>
                <Input id="mac_address" placeholder="00:11:22:33:44:55" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="management_ip">Management IP</Label>
                <Input id="management_ip" placeholder="192.168.1.x" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="management_protocol">Management Protocol</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select protocol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tr069">TR-069</SelectItem>
                    <SelectItem value="snmp">SNMP</SelectItem>
                    <SelectItem value="web">Web Interface</SelectItem>
                    <SelectItem value="telnet">Telnet</SelectItem>
                    <SelectItem value="ssh">SSH</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="service_plan">Service Plan</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic 25Mbps</SelectItem>
                    <SelectItem value="standard">Standard 50Mbps</SelectItem>
                    <SelectItem value="premium">Premium 100Mbps</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" placeholder="Customer location" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" placeholder="Additional notes or configuration details" rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              toast({
                title: "ONU Added",
                description: "Third party ONU has been added for management",
              })
              setShowAddModal(false)
            }}>
              Add ONU
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
