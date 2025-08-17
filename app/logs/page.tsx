"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Activity,
  Download,
  RefreshCw,
  Search,
  AlertTriangle,
  Info,
  AlertCircle,
  CheckCircle,
  Shield,
  Lock,
  Router,
  Users,
  Settings,
  Eye,
  Server,
  Smartphone,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface LogEntry {
  id: string
  timestamp: string
  level: "INFO" | "WARNING" | "ERROR" | "SUCCESS"
  source: string
  category: string
  message: string
  ip_address?: string
  user_id?: string
  details?: any
}

const mockLogs: LogEntry[] = [
  {
    id: "1",
    timestamp: "2024-01-15 14:30:25",
    level: "INFO",
    source: "OpenVPN",
    category: "openvpn",
    message: "Client connected successfully",
    ip_address: "192.168.1.100",
    user_id: "user123",
    details: { client_ip: "10.8.0.2", duration: "00:45:30" },
  },
  {
    id: "2",
    timestamp: "2024-01-15 14:25:12",
    level: "SUCCESS",
    source: "M-Pesa",
    category: "mpesa",
    message: "Payment received: KES 2,500",
    ip_address: "192.168.1.50",
    details: { transaction_id: "QA12345678", customer_id: "1234", amount: 2500 },
  },
  {
    id: "3",
    timestamp: "2024-01-15 14:20:45",
    level: "WARNING",
    source: "RADIUS",
    category: "radius",
    message: "Authentication timeout for user",
    ip_address: "192.168.1.3",
    user_id: "user456",
    details: { timeout_duration: "30s", retry_count: 3 },
  },
  {
    id: "4",
    timestamp: "2024-01-15 14:15:30",
    level: "ERROR",
    source: "Router-001",
    category: "router",
    message: "High CPU usage detected: 95%",
    ip_address: "192.168.1.1",
    details: { cpu_usage: 95, memory_usage: 78, uptime: "15d 4h 30m" },
  },
  {
    id: "5",
    timestamp: "2024-01-15 14:10:15",
    level: "INFO",
    source: "System",
    category: "system",
    message: "Database backup completed successfully",
    details: { backup_size: "2.5GB", duration: "00:15:30" },
  },
  {
    id: "6",
    timestamp: "2024-01-15 14:05:00",
    level: "INFO",
    source: "Admin Portal",
    category: "admin",
    message: "Admin user logged in",
    ip_address: "192.168.1.25",
    user_id: "admin",
    details: { session_id: "sess_abc123", browser: "Chrome 120.0" },
  },
  {
    id: "7",
    timestamp: "2024-01-15 14:00:45",
    level: "INFO",
    source: "Customer Portal",
    category: "user",
    message: "Customer viewed billing statement",
    ip_address: "41.90.64.15",
    user_id: "customer789",
    details: { customer_id: "789", statement_month: "December 2023" },
  },
  {
    id: "8",
    timestamp: "2024-01-15 13:55:30",
    level: "WARNING",
    source: "OpenVPN",
    category: "openvpn",
    message: "Client disconnected unexpectedly",
    ip_address: "192.168.1.100",
    user_id: "user123",
    details: { session_duration: "01:30:45", reason: "network_error" },
  },
]

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>(mockLogs)
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>(mockLogs)
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [levelFilter, setLevelFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)

  const stats = {
    total: logs.length,
    errors: logs.filter((log) => log.level === "ERROR").length,
    warnings: logs.filter((log) => log.level === "WARNING").length,
    info: logs.filter((log) => log.level === "INFO" || log.level === "SUCCESS").length,
  }

  const categoryStats = {
    openvpn: logs.filter((log) => log.category === "openvpn").length,
    radius: logs.filter((log) => log.category === "radius").length,
    mpesa: logs.filter((log) => log.category === "mpesa").length,
    router: logs.filter((log) => log.category === "router").length,
    system: logs.filter((log) => log.category === "system").length,
    admin: logs.filter((log) => log.category === "admin").length,
    user: logs.filter((log) => log.category === "user").length,
  }

  useEffect(() => {
    let filtered = logs

    // Filter by tab/category
    if (activeTab !== "all") {
      filtered = filtered.filter((log) => log.category === activeTab)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (log) =>
          log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.ip_address?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by level
    if (levelFilter !== "all") {
      filtered = filtered.filter((log) => log.level === levelFilter)
    }

    setFilteredLogs(filtered)
  }, [logs, activeTab, searchTerm, levelFilter])

  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Logs refreshed",
        description: "Latest log entries have been loaded.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh logs. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = () => {
    const csvContent = [
      ["Timestamp", "Level", "Source", "Category", "Message", "IP Address", "User ID"],
      ...filteredLogs.map((log) => [
        log.timestamp,
        log.level,
        log.source,
        log.category,
        log.message,
        log.ip_address || "",
        log.user_id || "",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `system-logs-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: "Export completed",
      description: "Logs have been exported to CSV file.",
    })
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "ERROR":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "WARNING":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "SUCCESS":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "openvpn":
        return <Lock className="h-4 w-4" />
      case "radius":
        return <Shield className="h-4 w-4" />
      case "mpesa":
        return <Smartphone className="h-4 w-4" />
      case "router":
        return <Router className="h-4 w-4" />
      case "system":
        return <Server className="h-4 w-4" />
      case "admin":
        return <Settings className="h-4 w-4" />
      case "user":
        return <Users className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">System Logs</h2>
          <p className="text-muted-foreground">Monitor OpenVPN, RADIUS, M-Pesa, and system activities</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export Logs
          </Button>
          <Button onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            {isLoading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Errors</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.errors}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warnings</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.warnings}</div>
            <p className="text-xs text-muted-foreground">Monitor closely</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Info</CardTitle>
            <Info className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.info}</div>
            <p className="text-xs text-muted-foreground">Normal operations</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Logs</CardTitle>
          <CardDescription>Search and filter system logs by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search logs..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Label htmlFor="level-filter">Level</Label>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="ERROR">Error</SelectItem>
                  <SelectItem value="WARNING">Warning</SelectItem>
                  <SelectItem value="INFO">Info</SelectItem>
                  <SelectItem value="SUCCESS">Success</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Log Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="all">All Logs</TabsTrigger>
          <TabsTrigger value="openvpn">
            <Lock className="mr-1 h-3 w-3" />
            OpenVPN ({categoryStats.openvpn})
          </TabsTrigger>
          <TabsTrigger value="radius">
            <Shield className="mr-1 h-3 w-3" />
            RADIUS ({categoryStats.radius})
          </TabsTrigger>
          <TabsTrigger value="mpesa">
            <Smartphone className="mr-1 h-3 w-3" />
            M-Pesa ({categoryStats.mpesa})
          </TabsTrigger>
          <TabsTrigger value="router">
            <Router className="mr-1 h-3 w-3" />
            Router ({categoryStats.router})
          </TabsTrigger>
          <TabsTrigger value="system">
            <Server className="mr-1 h-3 w-3" />
            System ({categoryStats.system})
          </TabsTrigger>
          <TabsTrigger value="admin">
            <Settings className="mr-1 h-3 w-3" />
            Admin ({categoryStats.admin})
          </TabsTrigger>
          <TabsTrigger value="user">
            <Users className="mr-1 h-3 w-3" />
            User ({categoryStats.user})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {getCategoryIcon(activeTab)}
                <span>
                  {activeTab === "all"
                    ? "All System Logs"
                    : activeTab === "openvpn"
                      ? "OpenVPN Logs"
                      : activeTab === "radius"
                        ? "RADIUS Logs"
                        : activeTab === "mpesa"
                          ? "M-Pesa Transaction Logs"
                          : activeTab === "router"
                            ? "Router Logs"
                            : activeTab === "system"
                              ? "System Logs"
                              : activeTab === "admin"
                                ? "Admin Activity Logs"
                                : "User Activity Logs"}
                </span>
              </CardTitle>
              <CardDescription>
                {activeTab === "all"
                  ? "Real-time system activity and events"
                  : activeTab === "openvpn"
                    ? "VPN connection events and authentication logs"
                    : activeTab === "radius"
                      ? "RADIUS authentication and accounting logs"
                      : activeTab === "mpesa"
                        ? "M-Pesa payment transactions and callbacks"
                        : activeTab === "router"
                          ? "Network device status and performance logs"
                          : activeTab === "system"
                            ? "System health, backups, and maintenance logs"
                            : activeTab === "admin"
                              ? "Administrator actions and configuration changes"
                              : "Customer portal activities and interactions"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Timestamp</TableHead>
                      <TableHead className="w-[100px]">Level</TableHead>
                      <TableHead className="w-[120px]">Source</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead className="w-[140px]">IP Address</TableHead>
                      <TableHead className="w-[50px]">Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No logs found matching your criteria
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {getLevelIcon(log.level)}
                              <Badge
                                variant={
                                  log.level === "ERROR"
                                    ? "destructive"
                                    : log.level === "WARNING"
                                      ? "secondary"
                                      : log.level === "SUCCESS"
                                        ? "default"
                                        : "outline"
                                }
                                className="text-xs"
                              >
                                {log.level}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {getCategoryIcon(log.category)}
                              <span className="text-sm">{log.source}</span>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-md">
                            <div className="truncate" title={log.message}>
                              {log.message}
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-sm">{log.ip_address || "-"}</TableCell>
                          <TableCell>
                            {log.details && (
                              <Button variant="ghost" size="sm">
                                <Eye className="h-3 w-3" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
