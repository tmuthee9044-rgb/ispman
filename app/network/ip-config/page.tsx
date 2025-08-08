"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  Network,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Globe,
  Router,
  Users,
  Server,
  Activity,
  Eye,
  AlertCircle,
  Filter,
} from "lucide-react"
import type { IPSubnet, IPAllocation } from "@/types"
import AddSubnetModal from "@/components/add-subnet-modal"
import EditSubnetModal from "@/components/edit-subnet-modal"
import AllocateIPModal from "@/components/allocate-ip-modal"

// Mock data with router assignments and customer details
const mockRouters = [
  { id: 1, name: "Main Gateway Router", ip: "192.168.1.1", status: "online" as const },
  { id: 2, name: "Secondary Router", ip: "192.168.2.1", status: "online" as const },
  { id: 3, name: "Guest Network Router", ip: "192.168.100.1", status: "offline" as const },
]

const mockSubnets: (IPSubnet & {
  router_id?: number
  router_name?: string
  router_status?: string
  customers_count: number
  active_customers: number
  customer_details: Array<{
    id: number
    name: string
    ip: string
    status: "active" | "inactive" | "suspended"
    service_plan: string
    last_seen: string
  }>
})[] = [
  {
    id: 1,
    name: "Main Network",
    network: "192.168.1.0",
    cidr: 24,
    type: "ipv4",
    gateway: "192.168.1.1",
    dns_primary: "8.8.8.8",
    dns_secondary: "8.8.4.4",
    dhcp_enabled: true,
    dhcp_start: "192.168.1.100",
    dhcp_end: "192.168.1.200",
    vlan_id: 10,
    description: "Primary customer network",
    total_ips: 254,
    used_ips: 156,
    available_ips: 98,
    status: "active",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
    router_id: 1,
    router_name: "Main Gateway Router",
    router_status: "online",
    customers_count: 45,
    active_customers: 42,
    customer_details: [
      {
        id: 1,
        name: "John Smith",
        ip: "192.168.1.101",
        status: "active",
        service_plan: "Premium 100Mbps",
        last_seen: "2 minutes ago",
      },
      {
        id: 2,
        name: "Jane Doe",
        ip: "192.168.1.102",
        status: "active",
        service_plan: "Standard 50Mbps",
        last_seen: "5 minutes ago",
      },
      {
        id: 3,
        name: "Bob Wilson",
        ip: "192.168.1.103",
        status: "suspended",
        service_plan: "Basic 25Mbps",
        last_seen: "2 hours ago",
      },
      {
        id: 4,
        name: "Alice Johnson",
        ip: "192.168.1.104",
        status: "active",
        service_plan: "Premium 100Mbps",
        last_seen: "1 minute ago",
      },
      {
        id: 5,
        name: "Mike Brown",
        ip: "192.168.1.105",
        status: "inactive",
        service_plan: "Standard 50Mbps",
        last_seen: "1 day ago",
      },
    ],
  },
  {
    id: 2,
    name: "Guest Network",
    network: "192.168.100.0",
    cidr: 24,
    type: "ipv4",
    gateway: "192.168.100.1",
    dns_primary: "1.1.1.1",
    dns_secondary: "1.0.0.1",
    dhcp_enabled: true,
    dhcp_start: "192.168.100.50",
    dhcp_end: "192.168.100.150",
    vlan_id: 20,
    description: "Guest access network",
    total_ips: 254,
    used_ips: 45,
    available_ips: 209,
    status: "active",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
    router_id: 3,
    router_name: "Guest Network Router",
    router_status: "offline",
    customers_count: 12,
    active_customers: 8,
    customer_details: [
      {
        id: 6,
        name: "Guest User 1",
        ip: "192.168.100.51",
        status: "active",
        service_plan: "Guest Access",
        last_seen: "10 minutes ago",
      },
      {
        id: 7,
        name: "Guest User 2",
        ip: "192.168.100.52",
        status: "active",
        service_plan: "Guest Access",
        last_seen: "15 minutes ago",
      },
    ],
  },
  {
    id: 3,
    name: "Business Network",
    network: "10.0.0.0",
    cidr: 16,
    type: "ipv4",
    gateway: "10.0.0.1",
    dns_primary: "8.8.8.8",
    dns_secondary: "8.8.4.4",
    dhcp_enabled: false,
    description: "Business customer network",
    total_ips: 65534,
    used_ips: 1250,
    available_ips: 64284,
    status: "active",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
    router_id: null,
    router_name: "Unassigned",
    router_status: "unassigned",
    customers_count: 89,
    active_customers: 85,
    customer_details: [
      {
        id: 8,
        name: "TechCorp Ltd",
        ip: "10.0.1.10",
        status: "active",
        service_plan: "Business 500Mbps",
        last_seen: "30 seconds ago",
      },
      {
        id: 9,
        name: "StartupXYZ",
        ip: "10.0.1.11",
        status: "active",
        service_plan: "Business 200Mbps",
        last_seen: "1 minute ago",
      },
    ],
  },
  {
    id: 4,
    name: "IPv6 Main",
    network: "2001:db8::",
    cidr: 64,
    type: "ipv6",
    gateway: "2001:db8::1",
    dns_primary: "2001:4860:4860::8888",
    dns_secondary: "2001:4860:4860::8844",
    dhcp_enabled: false,
    description: "IPv6 primary network",
    total_ips: 18446744073709551616,
    used_ips: 1250,
    available_ips: 18446744073709550366,
    status: "active",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
    router_id: null,
    router_name: "Unassigned",
    router_status: "unassigned",
    customers_count: 23,
    active_customers: 20,
    customer_details: [
      {
        id: 10,
        name: "Future Corp",
        ip: "2001:db8::10",
        status: "active",
        service_plan: "IPv6 Premium",
        last_seen: "5 minutes ago",
      },
      {
        id: 11,
        name: "NextGen Ltd",
        ip: "2001:db8::11",
        status: "active",
        service_plan: "IPv6 Standard",
        last_seen: "3 minutes ago",
      },
    ],
  },
]

const mockAllocations: IPAllocation[] = [
  {
    id: 1,
    subnet_id: 1,
    ip_address: "192.168.1.10",
    mac_address: "00:11:22:33:44:55",
    hostname: "router-main",
    device_type: "router",
    status: "allocated",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    id: 2,
    subnet_id: 1,
    ip_address: "192.168.1.150",
    mac_address: "aa:bb:cc:dd:ee:ff",
    hostname: "customer-device-001",
    customer_id: 1,
    device_type: "customer",
    status: "allocated",
    lease_expires: "2024-01-22T10:00:00Z",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
]

export default function IPConfigPage() {
  const [selectedRouter, setSelectedRouter] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [expandedSubnet, setExpandedSubnet] = useState<number | null>(null)

  const ipv4Subnets = mockSubnets.filter((s) => s.type === "ipv4")
  const ipv6Subnets = mockSubnets.filter((s) => s.type === "ipv6")

  // Filter subnets based on selected router and status
  const getFilteredSubnets = (subnets: typeof mockSubnets) => {
    return subnets.filter((subnet) => {
      const routerMatch =
        selectedRouter === "all" ||
        (selectedRouter === "unassigned" && !subnet.router_id) ||
        subnet.router_id?.toString() === selectedRouter

      const statusMatch = selectedStatus === "all" || subnet.status === selectedStatus

      return routerMatch && statusMatch
    })
  }

  const totalSubnets = mockSubnets.length
  const activeSubnets = mockSubnets.filter((s) => s.status === "active").length
  const totalAllocations = mockAllocations.length
  const unassignedSubnets = mockSubnets.filter((s) => !s.router_id).length
  const totalCustomers = mockSubnets.reduce((sum, subnet) => sum + subnet.customers_count, 0)
  const activeCustomers = mockSubnets.reduce((sum, subnet) => sum + subnet.active_customers, 0)

  const getRouterStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "text-green-600"
      case "offline":
        return "text-red-600"
      case "unassigned":
        return "text-yellow-600"
      default:
        return "text-gray-600"
    }
  }

  const getCustomerStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600"
      case "suspended":
        return "text-yellow-600"
      case "inactive":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  function SubnetCard({ subnet }: { subnet: (typeof mockSubnets)[0] }) {
    const utilizationPercentage = (subnet.used_ips / subnet.total_ips) * 100
    const isExpanded = expandedSubnet === subnet.id

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center space-x-2">
            <Network className="h-4 w-4" />
            <CardTitle className="text-sm font-medium">{subnet.name}</CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => setExpandedSubnet(isExpanded ? null : subnet.id)}>
                <Eye className="mr-2 h-4 w-4" />
                {isExpanded ? "Hide Details" : "View Details"}
              </DropdownMenuItem>
              <EditSubnetModal subnet={subnet}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
              </EditSubnetModal>
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Network</span>
              <Badge variant={subnet.type === "ipv4" ? "default" : "secondary"}>
                {subnet.network}/{subnet.cidr}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Router</span>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    subnet.router_status === "online"
                      ? "bg-green-500"
                      : subnet.router_status === "offline"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                  }`}
                />
                <span className={`text-sm font-medium ${getRouterStatusColor(subnet.router_status || "")}`}>
                  {subnet.router_name}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Gateway</span>
              <span className="text-sm font-mono">{subnet.gateway}</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">IP Utilization</span>
                <span className="text-sm font-medium">
                  {subnet.used_ips}/{subnet.total_ips > 1000000 ? "∞" : subnet.total_ips}
                </span>
              </div>
              <Progress value={utilizationPercentage} className="h-2" />
              <div className="text-xs text-muted-foreground">{utilizationPercentage.toFixed(1)}% used</div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Customers</span>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {subnet.active_customers}/{subnet.customers_count}
                </span>
                <Badge variant="outline" className="text-xs">
                  {subnet.active_customers} active
                </Badge>
              </div>
            </div>

            {subnet.dhcp_enabled && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">DHCP Pool</span>
                <span className="text-xs font-mono">
                  {subnet.dhcp_start} - {subnet.dhcp_end}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge variant={subnet.status === "active" ? "default" : "secondary"}>{subnet.status}</Badge>
            </div>

            {/* Expanded Customer Details */}
            {isExpanded && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium">Customer Allocations</h4>
                  <Badge variant="outline">{subnet.customer_details.length} shown</Badge>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {subnet.customer_details.map((customer) => (
                    <div key={customer.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            customer.status === "active"
                              ? "bg-green-500"
                              : customer.status === "suspended"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                        />
                        <span className="font-medium">{customer.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-mono">{customer.ip}</div>
                        <div className="text-muted-foreground">{customer.last_seen}</div>
                      </div>
                    </div>
                  ))}
                </div>
                {subnet.customers_count > subnet.customer_details.length && (
                  <div className="text-xs text-muted-foreground text-center mt-2">
                    +{subnet.customers_count - subnet.customer_details.length} more customers
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  function AllocationTable({ allocations }: { allocations: IPAllocation[] }) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>IP Address</TableHead>
            <TableHead>MAC Address</TableHead>
            <TableHead>Hostname</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Lease Expires</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allocations.map((allocation) => (
            <TableRow key={allocation.id}>
              <TableCell className="font-mono">{allocation.ip_address}</TableCell>
              <TableCell className="font-mono">{allocation.mac_address || "-"}</TableCell>
              <TableCell>{allocation.hostname || "-"}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-1">
                  {allocation.device_type === "router" && <Router className="h-3 w-3" />}
                  {allocation.device_type === "customer" && <Users className="h-3 w-3" />}
                  {allocation.device_type === "server" && <Server className="h-3 w-3" />}
                  {allocation.device_type === "other" && <Activity className="h-3 w-3" />}
                  <span className="capitalize">{allocation.device_type}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={allocation.status === "allocated" ? "default" : "secondary"}>{allocation.status}</Badge>
              </TableCell>
              <TableCell>
                {allocation.lease_expires ? new Date(allocation.lease_expires).toLocaleDateString() : "-"}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Release
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">IP Configuration</h2>
        <div className="flex items-center space-x-2">
          <AllocateIPModal subnets={mockSubnets}>
            <Button variant="outline">
              <Globe className="mr-2 h-4 w-4" />
              Allocate IP
            </Button>
          </AllocateIPModal>
          <AddSubnetModal>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Subnet
            </Button>
          </AddSubnetModal>
        </div>
      </div>

      {/* Enhanced Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subnets</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubnets}</div>
            <p className="text-xs text-muted-foreground">{activeSubnets} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">IP Allocations</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAllocations}</div>
            <p className="text-xs text-muted-foreground">Active assignments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">{activeCustomers} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unassigned Subnets</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unassignedSubnets}</div>
            <p className="text-xs text-muted-foreground">Need router assignment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Utilization</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">Across all subnets</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Label className="text-sm font-medium">Filters:</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Label htmlFor="router-filter" className="text-sm">
              Router:
            </Label>
            <Select value={selectedRouter} onValueChange={setSelectedRouter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Routers</SelectItem>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {mockRouters.map((router) => (
                  <SelectItem key={router.id} value={router.id.toString()}>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-2 h-2 rounded-full ${router.status === "online" ? "bg-green-500" : "bg-red-500"}`}
                      />
                      <span>{router.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Label htmlFor="status-filter" className="text-sm">
              Status:
            </Label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(selectedRouter !== "all" || selectedStatus !== "all") && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedRouter("all")
                setSelectedStatus("all")
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      </Card>

      {/* Unassigned Subnets Alert */}
      {unassignedSubnets > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <div className="flex-1">
                <h3 className="font-medium text-yellow-800">Unassigned Subnets Detected</h3>
                <p className="text-sm text-yellow-700">
                  {unassignedSubnets} subnet(s) are not assigned to any router. Customers in these subnets may
                  experience connectivity issues.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open("/network/add", "_blank")}
                className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
              >
                <Router className="mr-2 h-4 w-4" />
                Add Router
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="subnets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="subnets">Subnets & Router Assignment</TabsTrigger>
          <TabsTrigger value="allocations">IP Allocations</TabsTrigger>
          <TabsTrigger value="customers">Customer Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="subnets" className="space-y-4">
          <Tabs defaultValue="ipv4" className="space-y-4">
            <TabsList>
              <TabsTrigger value="ipv4">IPv4 Subnets</TabsTrigger>
              <TabsTrigger value="ipv6">IPv6 Subnets</TabsTrigger>
            </TabsList>

            <TabsContent value="ipv4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {getFilteredSubnets(ipv4Subnets).map((subnet) => (
                  <SubnetCard key={subnet.id} subnet={subnet} />
                ))}
              </div>
              {getFilteredSubnets(ipv4Subnets).length === 0 && (
                <Card className="p-8 text-center">
                  <div className="text-muted-foreground">
                    <Network className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="font-medium mb-2">No IPv4 subnets found</h3>
                    <p className="text-sm">No subnets match the current filter criteria.</p>
                  </div>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="ipv6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {getFilteredSubnets(ipv6Subnets).map((subnet) => (
                  <SubnetCard key={subnet.id} subnet={subnet} />
                ))}
              </div>
              {getFilteredSubnets(ipv6Subnets).length === 0 && (
                <Card className="p-8 text-center">
                  <div className="text-muted-foreground">
                    <Network className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="font-medium mb-2">No IPv6 subnets found</h3>
                    <p className="text-sm">No subnets match the current filter criteria.</p>
                  </div>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="allocations">
          <Card>
            <CardHeader>
              <CardTitle>IP Allocations</CardTitle>
              <CardDescription>Manage IP address assignments across all subnets</CardDescription>
            </CardHeader>
            <CardContent>
              <AllocationTable allocations={mockAllocations} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle>Customer Distribution by Subnet</CardTitle>
              <CardDescription>Overview of customer allocations and their status across all subnets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockSubnets.map((subnet) => (
                  <div key={subnet.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Network className="h-5 w-5 text-blue-600" />
                        <div>
                          <h3 className="font-medium">{subnet.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {subnet.network}/{subnet.cidr}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              subnet.router_status === "online"
                                ? "bg-green-500"
                                : subnet.router_status === "offline"
                                  ? "bg-red-500"
                                  : "bg-yellow-500"
                            }`}
                          />
                          <span>{subnet.router_name}</span>
                        </div>
                        <Badge variant="outline">{subnet.customers_count} customers</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center p-3 bg-green-50 rounded">
                        <div className="text-2xl font-bold text-green-600">{subnet.active_customers}</div>
                        <div className="text-green-700">Active</div>
                      </div>
                      <div className="text-center p-3 bg-yellow-50 rounded">
                        <div className="text-2xl font-bold text-yellow-600">
                          {subnet.customers_count - subnet.active_customers}
                        </div>
                        <div className="text-yellow-700">Inactive/Suspended</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded">
                        <div className="text-2xl font-bold text-blue-600">{subnet.used_ips}</div>
                        <div className="text-blue-700">IPs Used</div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Customer Activity Rate</span>
                        <span>{((subnet.active_customers / subnet.customers_count) * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={(subnet.active_customers / subnet.customers_count) * 100} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
