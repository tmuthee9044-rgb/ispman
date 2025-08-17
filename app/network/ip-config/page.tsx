"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Network, Plus, MoreHorizontal, Edit, Trash2, Globe, Router, Users, Server, Activity } from "lucide-react"
import type { IPSubnet, IPAllocation } from "@/types"
import AddSubnetModal from "@/components/add-subnet-modal"
import EditSubnetModal from "@/components/edit-subnet-modal"
import AllocateIPModal from "@/components/allocate-ip-modal"

// Mock data - replace with actual database queries
const mockSubnets: IPSubnet[] = [
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
  },
  {
    id: 3,
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

function SubnetCard({ subnet }: { subnet: IPSubnet }) {
  const utilizationPercentage = (subnet.used_ips / subnet.total_ips) * 100

  return (
    <Card>
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
            <span className="text-sm text-muted-foreground">Gateway</span>
            <span className="text-sm font-mono">{subnet.gateway}</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Utilization</span>
              <span className="text-sm font-medium">
                {subnet.used_ips}/{subnet.total_ips > 1000000 ? "∞" : subnet.total_ips}
              </span>
            </div>
            <Progress value={utilizationPercentage} className="h-2" />
            <div className="text-xs text-muted-foreground">{utilizationPercentage.toFixed(1)}% used</div>
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

export default function IPConfigPage() {
  const ipv4Subnets = mockSubnets.filter((s) => s.type === "ipv4")
  const ipv6Subnets = mockSubnets.filter((s) => s.type === "ipv6")

  const totalSubnets = mockSubnets.length
  const activeSubnets = mockSubnets.filter((s) => s.status === "active").length
  const totalAllocations = mockAllocations.length

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

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-3">
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
            <CardTitle className="text-sm font-medium">Utilization</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">Average across all subnets</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="subnets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="subnets">Subnets</TabsTrigger>
          <TabsTrigger value="allocations">IP Allocations</TabsTrigger>
        </TabsList>

        <TabsContent value="subnets" className="space-y-4">
          <Tabs defaultValue="ipv4" className="space-y-4">
            <TabsList>
              <TabsTrigger value="ipv4">IPv4 Subnets</TabsTrigger>
              <TabsTrigger value="ipv6">IPv6 Subnets</TabsTrigger>
            </TabsList>

            <TabsContent value="ipv4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {ipv4Subnets.map((subnet) => (
                  <SubnetCard key={subnet.id} subnet={subnet} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="ipv6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {ipv6Subnets.map((subnet) => (
                  <SubnetCard key={subnet.id} subnet={subnet} />
                ))}
              </div>
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
      </Tabs>
    </div>
  )
}
