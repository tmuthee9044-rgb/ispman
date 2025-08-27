"use client"

import { useState, useEffect } from "react"
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
import { useToast } from "@/hooks/use-toast"

function SubnetCard({ subnet, onDelete }: { subnet: IPSubnet; onDelete: (id: number) => void }) {
  const utilizationPercentage = subnet.total_ips > 0 ? (subnet.used_ips / subnet.total_ips) * 100 : 0
  const { toast } = useToast()

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/subnets/${subnet.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        onDelete(subnet.id)
        toast({
          title: "Subnet deleted",
          description: "The subnet has been successfully deleted.",
        })
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to delete subnet",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete subnet",
        variant: "destructive",
      })
    }
  }

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
            <DropdownMenuItem className="text-red-600" onClick={handleDelete}>
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
  const [subnets, setSubnets] = useState<IPSubnet[]>([])
  const [allocations, setAllocations] = useState<IPAllocation[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subnetsResponse, allocationsResponse] = await Promise.all([
          fetch("/api/subnets"),
          fetch("/api/ip-allocations"),
        ])

        if (subnetsResponse.ok) {
          const subnetsData = await subnetsResponse.json()
          setSubnets(subnetsData)
        }

        if (allocationsResponse.ok) {
          const allocationsData = await allocationsResponse.json()
          setAllocations(allocationsData)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load network data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [toast])

  const handleSubnetDeleted = (deletedId: number) => {
    setSubnets(subnets.filter((subnet) => subnet.id !== deletedId))
  }

  const handleSubnetAdded = (newSubnet: IPSubnet) => {
    setSubnets([newSubnet, ...subnets])
  }

  const handleSubnetUpdated = (updatedSubnet: IPSubnet) => {
    setSubnets(subnets.map((subnet) => (subnet.id === updatedSubnet.id ? updatedSubnet : subnet)))
  }

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-4 pt-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading network configuration...</p>
          </div>
        </div>
      </div>
    )
  }

  const ipv4Subnets = subnets.filter((s) => s.type === "ipv4")
  const ipv6Subnets = subnets.filter((s) => s.type === "ipv6")

  const totalSubnets = subnets.length
  const activeSubnets = subnets.filter((s) => s.status === "active").length
  const totalAllocations = allocations.length

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">IP Configuration</h2>
        <div className="flex items-center space-x-2">
          <AllocateIPModal subnets={subnets}>
            <Button variant="outline">
              <Globe className="mr-2 h-4 w-4" />
              Allocate IP
            </Button>
          </AllocateIPModal>
          <AddSubnetModal onSubnetAdded={handleSubnetAdded}>
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
            <div className="text-2xl font-bold">
              {subnets.length > 0
                ? Math.round(
                    subnets.reduce((acc, subnet) => acc + (subnet.used_ips / subnet.total_ips) * 100, 0) /
                      subnets.length,
                  )
                : 0}
              %
            </div>
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
                  <SubnetCard key={subnet.id} subnet={subnet} onDelete={handleSubnetDeleted} />
                ))}
                {ipv4Subnets.length === 0 && (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    No IPv4 subnets configured. Click "Add Subnet" to create one.
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="ipv6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {ipv6Subnets.map((subnet) => (
                  <SubnetCard key={subnet.id} subnet={subnet} onDelete={handleSubnetDeleted} />
                ))}
                {ipv6Subnets.length === 0 && (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    No IPv6 subnets configured. Click "Add Subnet" to create one.
                  </div>
                )}
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
              {allocations.length > 0 ? (
                <AllocationTable allocations={allocations} />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No IP allocations found. Allocate IPs to customers to see them here.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
