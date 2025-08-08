"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Globe, Plus, Wifi, Users, Edit, Eye, Settings } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { BarChart3 } from "lucide-react"

export default function ServicesPage() {
  const [addPlanOpen, setAddPlanOpen] = useState(false)
  const { toast } = useToast()

  const servicePlans = [
    {
      id: 1,
      name: "Basic Plan",
      speed: "10/5 Mbps",
      price: 29.99,
      customers: 450,
      active: true,
      description: "Perfect for light browsing and email",
    },
    {
      id: 2,
      name: "Standard Plan",
      speed: "50/25 Mbps",
      price: 49.99,
      customers: 1200,
      active: true,
      description: "Great for streaming and working from home",
    },
    {
      id: 3,
      name: "Premium Plan",
      speed: "100/50 Mbps",
      price: 79.99,
      customers: 890,
      active: true,
      description: "Ideal for heavy usage and gaming",
    },
    {
      id: 4,
      name: "Business Plan",
      speed: "200/100 Mbps",
      price: 149.99,
      customers: 307,
      active: true,
      description: "Enterprise-grade connectivity",
    },
    {
      id: 5,
      name: "Student Plan",
      speed: "25/10 Mbps",
      price: 19.99,
      customers: 156,
      active: false,
      description: "Affordable plan for students",
    },
  ]

  const handleAddPlan = () => {
    toast({
      title: "Service Plan Added",
      description: "New service plan has been created successfully.",
    })
    setAddPlanOpen(false)
  }

  const handlePlanAction = (planId: number, action: string) => {
    toast({
      title: `Plan ${action}`,
      description: `Service plan has been ${action.toLowerCase()}.`,
    })
  }

  const handleToggleStatus = (planId: number, currentStatus: boolean) => {
    const newStatus = currentStatus ? "deactivated" : "activated"
    toast({
      title: `Plan ${newStatus}`,
      description: `Service plan has been ${newStatus}.`,
    })
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight">Service Plans</h2>
        <div className="flex space-x-2">
          <Button variant="outline" asChild className="w-full sm:w-auto bg-transparent">
            <Link href="/services/compare">
              <BarChart3 className="mr-2 h-4 w-4" />
              Compare Plans
            </Link>
          </Button>
          <Dialog open={addPlanOpen} onOpenChange={setAddPlanOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Add Plan
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Service Plan</DialogTitle>
                <DialogDescription>Create a new internet service plan</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="plan-name">Plan Name</Label>
                  <Input id="plan-name" placeholder="Enter plan name" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="download-speed">Download Speed (Mbps)</Label>
                    <Input id="download-speed" type="number" placeholder="100" />
                  </div>
                  <div>
                    <Label htmlFor="upload-speed">Upload Speed (Mbps)</Label>
                    <Input id="upload-speed" type="number" placeholder="50" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="price">Monthly Price ($)</Label>
                  <Input id="price" type="number" step="0.01" placeholder="79.99" />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Plan description" rows={3} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddPlanOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddPlan}>Add Plan</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Plans</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{servicePlans.length}</div>
            <p className="text-xs text-muted-foreground">{servicePlans.filter((p) => p.active).length} active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {servicePlans.reduce((sum, plan) => sum + plan.customers, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Across all plans</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Popular</CardTitle>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Standard</div>
            <p className="text-xs text-muted-foreground">1,200 subscribers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Revenue/Plan</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$67.49</div>
            <p className="text-xs text-muted-foreground">Monthly average</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Service Plans</CardTitle>
          <CardDescription>Manage internet service plans and pricing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plan Name</TableHead>
                  <TableHead>Speed (Down/Up)</TableHead>
                  <TableHead>Monthly Price</TableHead>
                  <TableHead className="hidden sm:table-cell">Active Customers</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {servicePlans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium">{plan.name}</TableCell>
                    <TableCell>{plan.speed}</TableCell>
                    <TableCell>${plan.price}</TableCell>
                    <TableCell className="hidden sm:table-cell">{plan.customers}</TableCell>
                    <TableCell>
                      <Badge variant={plan.active ? "default" : "secondary"}>
                        {plan.active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm" onClick={() => handlePlanAction(plan.id, "Viewed")}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handlePlanAction(plan.id, "Edited")}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleToggleStatus(plan.id, plan.active)}>
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Plan Performance</CardTitle>
            <CardDescription>Revenue by service plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {servicePlans
                .filter((plan) => plan.active)
                .map((plan) => (
                  <div key={plan.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{plan.name}</p>
                      <p className="text-sm text-muted-foreground">{plan.customers} customers</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${plan.price}</p>
                      <p className="text-sm text-muted-foreground">
                        ${(plan.price * plan.customers).toLocaleString()}/mo
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usage Statistics</CardTitle>
            <CardDescription>Bandwidth usage by plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Basic Plan</span>
                <span className="font-medium">45% avg usage</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Standard Plan</span>
                <span className="font-medium">67% avg usage</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Premium Plan</span>
                <span className="font-medium">78% avg usage</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Business Plan</span>
                <span className="font-medium">89% avg usage</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
