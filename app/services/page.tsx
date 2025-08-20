"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Globe,
  Plus,
  Users,
  Edit,
  Eye,
  Settings,
  BarChart3,
  DollarSign,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Calculator,
  TrendingUp,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getServicePlans, createServicePlan, updateServicePlan, deleteServicePlan } from "@/app/actions/service-actions"
import { formatCurrency, formatCurrencyCompact, TAX_RATES } from "@/lib/currency"

export default function ServicesPage() {
  const router = useRouter()
  const [addPlanOpen, setAddPlanOpen] = useState(false)
  const [editPlanOpen, setEditPlanOpen] = useState(false)
  const [pricingModalOpen, setPricingModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [servicePlans, setServicePlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fallbackServicePlans = [
    {
      id: 1,
      name: "Basic Home",
      speed: "10/5 Mbps",
      price: 2999,
      customers: 450,
      active: true,
      description: "Perfect for light browsing and email",
      fup_limit: 50,
      fup_speed: "2/1 Mbps",
      tax_rate: 16,
      setup_fee: 500,
      installation_fee: 1000,
      equipment_fee: 2500,
      category: "residential",
      contract_period: 12,
      early_termination_fee: 5000,
      features: ["Email Support", "Basic Firewall", "Fair Usage Policy"],
    },
    {
      id: 2,
      name: "Standard Home",
      speed: "25/10 Mbps",
      price: 4999,
      customers: 1200,
      active: true,
      description: "Great for streaming and working from home",
      fup_limit: 100,
      fup_speed: "5/2 Mbps",
      tax_rate: 16,
      setup_fee: 500,
      installation_fee: 1500,
      equipment_fee: 3500,
      category: "residential",
      contract_period: 12,
      early_termination_fee: 7500,
      features: ["24/7 Support", "Advanced Firewall", "Parental Controls", "100GB FUP"],
    },
    {
      id: 3,
      name: "Premium Home",
      speed: "50/25 Mbps",
      price: 7999,
      customers: 890,
      active: true,
      description: "Ideal for heavy usage and gaming",
      fup_limit: 200,
      fup_speed: "10/5 Mbps",
      tax_rate: 16,
      setup_fee: 0, // Waived
      installation_fee: 2000,
      equipment_fee: 5000,
      category: "residential",
      contract_period: 12,
      early_termination_fee: 10000,
      features: ["Priority Support", "Gaming Optimization", "Static IP Option", "200GB FUP"],
    },
    {
      id: 4,
      name: "Business Starter",
      speed: "100/50 Mbps",
      price: 14999,
      customers: 307,
      active: true,
      description: "Enterprise-grade connectivity for small business",
      fup_limit: null, // Unlimited
      fup_speed: null,
      tax_rate: 16,
      setup_fee: 0,
      installation_fee: 3000,
      equipment_fee: 8000,
      category: "business",
      contract_period: 24,
      early_termination_fee: 25000,
      features: ["SLA Guarantee", "Dedicated Support", "Static IP Included", "Unlimited Data"],
    },
    {
      id: 5,
      name: "Enterprise Pro",
      speed: "500/250 Mbps",
      price: 49999,
      customers: 89,
      active: true,
      description: "Maximum performance for large enterprises",
      fup_limit: null,
      fup_speed: null,
      tax_rate: 16,
      setup_fee: 0,
      installation_fee: 5000,
      equipment_fee: 15000,
      category: "enterprise",
      contract_period: 36,
      early_termination_fee: 75000,
      features: ["99.9% SLA", "24/7 Dedicated Support", "Multiple Static IPs", "Redundant Connection"],
    },
  ]

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const result = await getServicePlans()
        if (result.success && result.data && result.data.length > 0) {
          const dbPlans = result.data.map((plan: any) => ({
            id: plan.id,
            name: plan.name,
            speed:
              plan.download_speed && plan.upload_speed
                ? `${plan.download_speed}/${plan.upload_speed} Mbps`
                : plan.speed || "N/A",
            price: Number.parseFloat(plan.price) || 0,
            customers: plan.customer_count || 0,
            active: plan.status === "active",
            description: plan.description || "",
            fup_limit: plan.data_limit,
            fup_speed: plan.throttled_speed,
            tax_rate: 16,
            setup_fee: Number.parseFloat(plan.setup_fee) || 0,
            installation_fee: Number.parseFloat(plan.installation_fee) || 0,
            equipment_fee: Number.parseFloat(plan.equipment_fee) || 0,
            category: plan.category || "residential",
            contract_period: plan.contract_length || 12,
            early_termination_fee: Number.parseFloat(plan.early_termination_fee) || 0,
            features: plan.features ? JSON.parse(plan.features) : [],
          }))
          setServicePlans(dbPlans)
        } else {
          console.log("[v0] No database plans found, using fallback data")
          setServicePlans(fallbackServicePlans)
        }
      } catch (error) {
        console.error("Error loading plans:", error)
        setServicePlans(fallbackServicePlans)
      } finally {
        setLoading(false)
      }
    }
    loadPlans()
  }, [])

  const handleAddPlan = async (formData: FormData) => {
    try {
      const result = await createServicePlan(formData)
      if (result.success) {
        toast({
          title: "Service Plan Added",
          description: result.message || "New service plan has been created successfully.",
        })
        setAddPlanOpen(false)
        const updatedPlans = await getServicePlans()
        if (updatedPlans.success && updatedPlans.data) {
          const dbPlans = updatedPlans.data.map((plan: any) => ({
            id: plan.id,
            name: plan.name,
            speed:
              plan.download_speed && plan.upload_speed
                ? `${plan.download_speed}/${plan.upload_speed} Mbps`
                : plan.speed || "N/A",
            price: Number.parseFloat(plan.price) || 0,
            customers: plan.customer_count || 0,
            active: plan.status === "active",
            description: plan.description || "",
            fup_limit: plan.data_limit,
            fup_speed: plan.throttled_speed,
            tax_rate: 16,
            setup_fee: Number.parseFloat(plan.setup_fee) || 0,
            installation_fee: Number.parseFloat(plan.installation_fee) || 0,
            equipment_fee: Number.parseFloat(plan.equipment_fee) || 0,
            category: plan.category || "residential",
            contract_period: plan.contract_length || 12,
            early_termination_fee: Number.parseFloat(plan.early_termination_fee) || 0,
            features: plan.features ? JSON.parse(plan.features) : [],
          }))
          setServicePlans(dbPlans)
        }
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create service plan",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create service plan",
        variant: "destructive",
      })
    }
  }

  const handleEditPlan = async (formData: FormData) => {
    try {
      const result = await updateServicePlan(formData)
      if (result.success) {
        toast({
          title: "Service Plan Updated",
          description: result.message || "Service plan has been updated successfully.",
        })
        setEditPlanOpen(false)
        setSelectedPlan(null)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update service plan",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update service plan",
        variant: "destructive",
      })
    }
  }

  const handleToggleStatus = async (planId: number, currentStatus: boolean) => {
    console.log("[v0] Toggle status clicked for plan:", planId, "current status:", currentStatus)
    try {
      const newStatus = currentStatus ? "deactivated" : "activated"
      toast({
        title: `Plan ${newStatus}`,
        description: `Service plan has been ${newStatus}.`,
      })

      setServicePlans((prev) => prev.map((plan) => (plan.id === planId ? { ...plan, active: !currentStatus } : plan)))
    } catch (error) {
      console.log("[v0] Error toggling status:", error)
      toast({
        title: "Error",
        description: "Failed to update plan status",
        variant: "destructive",
      })
    }
  }

  const handleDeletePlan = async (planId: number) => {
    console.log("[v0] Delete plan clicked for plan:", planId)
    try {
      const result = await deleteServicePlan(planId)
      if (result.success) {
        toast({
          title: "Plan Deleted",
          description: result.message || "Service plan has been deleted.",
        })
        setServicePlans((prev) => prev.filter((plan) => plan.id !== planId))
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete service plan",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.log("[v0] Error deleting plan:", error)
      toast({
        title: "Error",
        description: "Failed to delete service plan",
        variant: "destructive",
      })
    }
  }

  const calculateTotalPrice = (plan: any) => {
    const basePrice = plan.price
    const taxAmount = basePrice * TAX_RATES.VAT
    return basePrice + taxAmount
  }

  const formatPrice = (amount: number) => {
    return formatCurrency(amount)
  }

  if (loading) {
    return (
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading service plans...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Service Plans</h2>
          <p className="text-muted-foreground">Manage internet service plans, pricing, and Fair Usage Policies</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" asChild className="w-full sm:w-auto bg-white">
            <Link href="/services/compare">
              <BarChart3 className="mr-2 h-4 w-4" />
              Compare Plans
            </Link>
          </Button>
          <Button variant="outline" onClick={() => setPricingModalOpen(true)} className="w-full sm:w-auto bg-white">
            <Calculator className="mr-2 h-4 w-4" />
            Pricing Calculator
          </Button>
          <Button asChild className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
            <Link href="/services/add">
              <Plus className="mr-2 h-4 w-4" />
              Add Plan
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Plans</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{servicePlans.length}</div>
            <p className="text-xs text-muted-foreground">{servicePlans.filter((p) => p.active).length} active</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
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
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrencyCompact(
                servicePlans.reduce((sum, plan) => sum + calculateTotalPrice(plan) * plan.customers, 0),
              )}{" "}
            </div>
            <p className="text-xs text-muted-foreground">Including 16% VAT</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Popular</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Standard</div>
            <p className="text-xs text-muted-foreground">1,200 subscribers</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Revenue/Plan</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KSh 12,749</div>
            <p className="text-xs text-muted-foreground">Monthly average</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="plans" className="space-y-4">
        <TabsList>
          <TabsTrigger value="plans">Service Plans</TabsTrigger>
          <TabsTrigger value="pricing">Pricing & Taxes</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="plans">
          <Card>
            <CardHeader>
              <CardTitle>Service Plans Overview</CardTitle>
              <CardDescription>Manage internet service plans with FUP policies and pricing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Plan Details</TableHead>
                      <TableHead>Speed & FUP</TableHead>
                      <TableHead>Pricing</TableHead>
                      <TableHead>Customers</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {servicePlans.map((plan) => (
                      <TableRow key={plan.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{plan.name}</div>
                            <div className="text-sm text-muted-foreground">{plan.description}</div>
                            <Badge variant="outline" className="mt-1 capitalize">
                              {plan.category}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              <Zap className="h-3 w-3" />
                              <span className="font-medium">{plan.speed}</span>
                            </div>
                            {plan.fup_limit ? (
                              <div className="text-xs text-muted-foreground">
                                <div>FUP: {plan.fup_limit}GB</div>
                                <div>Then: {plan.fup_speed}</div>
                              </div>
                            ) : (
                              <div className="text-xs text-green-600">Unlimited</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{formatPrice(plan.price)}</div>
                            <div className="text-xs text-muted-foreground">
                              +{formatPrice((plan.price * TAX_RATES.VAT) / 100)} tax
                            </div>
                            <div className="text-xs font-medium text-green-600">
                              Total: {formatPrice(calculateTotalPrice(plan))}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <div className="font-medium">{plan.customers}</div>
                            <div className="text-xs text-muted-foreground">subscribers</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={plan.active}
                              onCheckedChange={() => handleToggleStatus(plan.id, plan.active)}
                            />
                            <Badge variant={plan.active ? "default" : "secondary"}>
                              {plan.active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedPlan(plan)
                                setPricingModalOpen(true)
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/services/${plan.id}/edit`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeletePlan(plan.id)}
                              className="text-red-600 hover:text-red-700"
                            >
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
        </TabsContent>

        <TabsContent value="pricing">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Pricing Breakdown</CardTitle>
                <CardDescription>Detailed pricing with taxes and fees</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {servicePlans
                    .filter((p) => p.active)
                    .map((plan) => (
                      <div key={plan.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{plan.name}</h4>
                          <Badge className="capitalize">{plan.category}</Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Base Price:</span>
                            <span>{formatPrice(plan.price)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>VAT ({plan.tax_rate}%):</span>
                            <span>{formatPrice((plan.price * TAX_RATES.VAT) / 100)}</span>
                          </div>
                          {plan.setup_fee > 0 && (
                            <div className="flex justify-between">
                              <span>Setup Fee:</span>
                              <span>{formatPrice(plan.setup_fee)}</span>
                            </div>
                          )}
                          <div className="border-t pt-2 flex justify-between font-medium">
                            <span>Total Monthly:</span>
                            <span className="text-green-600">{formatPrice(calculateTotalPrice(plan))}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>FUP Policies</CardTitle>
                <CardDescription>Fair Usage Policy details by plan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {servicePlans
                    .filter((p) => p.active)
                    .map((plan) => (
                      <div key={plan.id} className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{plan.name}</h4>
                          {plan.fup_limit ? (
                            <Badge variant="outline" className="text-orange-600">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              FUP Applied
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-green-600">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Unlimited
                            </Badge>
                          )}
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Full Speed:</span>
                            <span className="font-medium">{plan.speed}</span>
                          </div>
                          {plan.fup_limit ? (
                            <>
                              <div className="flex justify-between">
                                <span>Data Allowance:</span>
                                <span>{plan.fup_limit}GB</span>
                              </div>
                              <div className="flex justify-between">
                                <span>After FUP:</span>
                                <span className="text-orange-600">{plan.fup_speed}</span>
                              </div>
                            </>
                          ) : (
                            <div className="flex justify-between">
                              <span>Data Allowance:</span>
                              <span className="text-green-600 font-medium">Unlimited</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Category</CardTitle>
                <CardDescription>Monthly revenue breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["residential", "business", "enterprise"].map((category) => {
                    const categoryPlans = servicePlans.filter((p) => p.category === category && p.active)
                    const revenue = categoryPlans.reduce(
                      (sum, plan) => sum + calculateTotalPrice(plan) * plan.customers,
                      0,
                    )
                    const customers = categoryPlans.reduce((sum, plan) => sum + plan.customers, 0)

                    return (
                      <div key={category} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium capitalize">{category}</p>
                          <p className="text-sm text-muted-foreground">{customers} customers</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatPrice(revenue)}</p>
                          <p className="text-sm text-muted-foreground">monthly</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Plan Performance</CardTitle>
                <CardDescription>Customer adoption and revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {servicePlans
                    .filter((p) => p.active)
                    .map((plan) => {
                      const totalCustomers = servicePlans.reduce((sum, p) => sum + p.customers, 0)
                      const percentage = ((plan.customers / totalCustomers) * 100).toFixed(1)

                      return (
                        <div key={plan.id} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="font-medium">{plan.name}</span>
                            <span className="text-sm text-muted-foreground">{percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                          </div>
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>{plan.customers} customers</span>
                            <span>{formatPrice(calculateTotalPrice(plan) * plan.customers)}/mo</span>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={pricingModalOpen} onOpenChange={setPricingModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedPlan ? `${selectedPlan.name} - Pricing Details` : "Pricing Calculator"}</DialogTitle>
            <DialogDescription>Detailed pricing breakdown including taxes, fees, and contract terms</DialogDescription>
          </DialogHeader>
          {selectedPlan && (
            <div className="grid gap-6 py-4">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Monthly Charges</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>Base Price:</span>
                      <span className="font-medium">{formatPrice(selectedPlan.price)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>VAT ({selectedPlan.tax_rate}%):</span>
                      <span>{formatPrice((selectedPlan.price * TAX_RATES.VAT) / 100)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between text-lg font-bold">
                      <span>Total Monthly:</span>
                      <span className="text-green-600">{formatPrice(calculateTotalPrice(selectedPlan))}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">One-time Fees</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>Setup Fee:</span>
                      <span className="font-medium">
                        {selectedPlan.setup_fee > 0 ? formatPrice(selectedPlan.setup_fee) : "Waived"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Installation:</span>
                      <span>{formatPrice(selectedPlan.installation_fee)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Equipment:</span>
                      <span>{formatPrice(selectedPlan.equipment_fee)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between text-lg font-bold">
                      <span>Total One-time:</span>
                      <span className="text-blue-600">
                        {formatPrice(
                          selectedPlan.setup_fee + selectedPlan.installation_fee + selectedPlan.equipment_fee,
                        )}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Service Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>Speed:</span>
                      <span className="font-medium">{selectedPlan.speed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Data Policy:</span>
                      <span>{selectedPlan.fup_limit ? `${selectedPlan.fup_limit}GB FUP` : "Unlimited"}</span>
                    </div>
                    {selectedPlan.fup_limit && (
                      <div className="flex justify-between">
                        <span>After FUP:</span>
                        <span className="text-orange-600">{selectedPlan.fup_speed}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Category:</span>
                      <span className="capitalize">{selectedPlan.category}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Contract Terms</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>Contract Period:</span>
                      <span className="font-medium">{selectedPlan.contract_period} months</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Early Termination:</span>
                      <span>{formatPrice(selectedPlan.early_termination_fee)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Current Subscribers:</span>
                      <span>{selectedPlan.customers}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Features Included</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-2">
                    {selectedPlan.features.map((feature: string, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPricingModalOpen(false)}>
              Close
            </Button>
            {selectedPlan && (
              <Button asChild>
                <Link href={`/services/${selectedPlan.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Plan
                </Link>
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
