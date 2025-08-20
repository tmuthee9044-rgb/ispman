"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Grid3X3 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { getCustomers } from "@/app/actions/customer-actions"
import { formatCurrency } from "@/lib/currency"
import { Slider } from "@/components/ui/slider"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Users,
  Search,
  Filter,
  Download,
  Upload,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  X,
  UserPlus,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  BookmarkPlus,
  SlidersHorizontal,
} from "lucide-react"

interface EnhancedFilters {
  status: string
  plan: string
  router: string
  ip: string
  customerType: string
  paymentMethod: string
  balanceRange: [number, number]
  monthlyFeeRange: [number, number]
  connectionQualityRange: [number, number]
  createdDateFrom: string
  createdDateTo: string
  lastPaymentFrom: string
  lastPaymentTo: string
  hasOverdueBalance: boolean
  hasActiveService: boolean
}

const FILTER_PRESETS = [
  {
    name: "Active Customers",
    filters: { status: "active", hasActiveService: true },
    description: "All active customers with services",
  },
  {
    name: "Overdue Accounts",
    filters: { hasOverdueBalance: true, status: "active" },
    description: "Customers with negative balances",
  },
  {
    name: "High Value Customers",
    filters: { monthlyFeeRange: [5000, 50000], status: "active" },
    description: "Customers paying KES 5,000+ monthly",
  },
  {
    name: "New Customers",
    filters: { createdDateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0] },
    description: "Customers added in last 30 days",
  },
  {
    name: "Poor Connection",
    filters: { connectionQualityRange: [0, 70], status: "active" },
    description: "Active customers with connection issues",
  },
]

export default function CustomersPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCustomers, setSelectedCustomers] = useState<number[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showIspToolsModal, setShowIspToolsModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [filters, setFilters] = useState<EnhancedFilters>({
    status: "all",
    plan: "",
    router: "",
    ip: "",
    customerType: "all",
    paymentMethod: "all",
    balanceRange: [-10000, 10000],
    monthlyFeeRange: [0, 20000],
    connectionQualityRange: [0, 100],
    createdDateFrom: "",
    createdDateTo: "",
    lastPaymentFrom: "",
    lastPaymentTo: "",
    hasOverdueBalance: false,
    hasActiveService: false,
  })

  const [savedFilters, setSavedFilters] = useState<Array<{ name: string; filters: Partial<EnhancedFilters> }>>([])
  const [filterHistory, setFilterHistory] = useState<Array<{ timestamp: Date; filters: Partial<EnhancedFilters> }>>([])

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const data = await getCustomers()
        setCustomers(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load customers",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadCustomers()
  }, [toast])

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const matchesSearch =
        customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone?.includes(searchTerm)

      const matchesStatus = filters.status === "all" || customer.status === filters.status
      const matchesPlan = !filters.plan || customer.plan?.toLowerCase().includes(filters.plan.toLowerCase())
      const matchesRouter = !filters.router || customer.router_allocated?.includes(filters.router)
      const matchesIp = !filters.ip || customer.ip_allocated?.includes(filters.ip)
      const matchesCustomerType = filters.customerType === "all" || customer.customer_type === filters.customerType
      const matchesPaymentMethod = filters.paymentMethod === "all" || customer.payment_method === filters.paymentMethod

      // Balance range filter
      const balance = Number(customer.balance) || 0
      const matchesBalanceRange = balance >= filters.balanceRange[0] && balance <= filters.balanceRange[1]

      // Monthly fee range filter
      const monthlyFee = Number(customer.monthly_fee) || 0
      const matchesMonthlyFeeRange =
        monthlyFee >= filters.monthlyFeeRange[0] && monthlyFee <= filters.monthlyFeeRange[1]

      // Connection quality range filter
      const connectionQuality = Number(customer.connection_quality) || 0
      const matchesConnectionQuality =
        connectionQuality >= filters.connectionQualityRange[0] && connectionQuality <= filters.connectionQualityRange[1]

      // Date filters
      const createdDate = new Date(customer.created_at)
      const matchesCreatedDateFrom = !filters.createdDateFrom || createdDate >= new Date(filters.createdDateFrom)
      const matchesCreatedDateTo = !filters.createdDateTo || createdDate <= new Date(filters.createdDateTo)

      const lastPaymentDate = customer.last_payment_date ? new Date(customer.last_payment_date) : null
      const matchesLastPaymentFrom =
        !filters.lastPaymentFrom || (lastPaymentDate && lastPaymentDate >= new Date(filters.lastPaymentFrom))
      const matchesLastPaymentTo =
        !filters.lastPaymentTo || (lastPaymentDate && lastPaymentDate <= new Date(filters.lastPaymentTo))

      // Special filters
      const matchesOverdueBalance = !filters.hasOverdueBalance || balance < 0
      const matchesActiveService = !filters.hasActiveService || (customer.status === "active" && customer.plan)

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPlan &&
        matchesRouter &&
        matchesIp &&
        matchesCustomerType &&
        matchesPaymentMethod &&
        matchesBalanceRange &&
        matchesMonthlyFeeRange &&
        matchesConnectionQuality &&
        matchesCreatedDateFrom &&
        matchesCreatedDateTo &&
        matchesLastPaymentFrom &&
        matchesLastPaymentTo &&
        matchesOverdueBalance &&
        matchesActiveService
      )
    })
  }, [customers, searchTerm, filters])

  const handleSelectCustomer = (customerId: number) => {
    setSelectedCustomers((prev) =>
      prev.includes(customerId) ? prev.filter((id) => id !== customerId) : [...prev, customerId],
    )
  }

  const handleSelectAll = () => {
    if (selectedCustomers.length === filteredCustomers.length) {
      setSelectedCustomers([])
    } else {
      setSelectedCustomers(filteredCustomers.map((c) => c.id))
    }
  }

  const handleBulkExport = async (format: "csv" | "splynx" | "mikrotik" | "radius" = "csv") => {
    if (selectedCustomers.length === 0) {
      toast({
        title: "No customers selected",
        description: "Please select customers to export",
        variant: "destructive",
      })
      return
    }

    try {
      const selectedData = customers.filter((c) => selectedCustomers.includes(c.id))
      let content = ""
      let filename = ""
      let mimeType = "text/csv;charset=utf-8;"

      switch (format) {
        case "splynx":
          // Splynx CSV format
          const splynxHeaders = [
            "login",
            "password",
            "name",
            "email",
            "phone",
            "status",
            "tariff_name",
            "tariff_price",
            "billing_type",
            "partner_id",
            "location_id",
            "street_1",
            "city",
            "zip_code",
            "date_add",
            "billing_due",
            "deposit",
          ]
          const splynxRows = selectedData.map((customer) => [
            `"${customer.email || customer.phone}"`,
            `"${Math.random().toString(36).slice(-8)}"`, // Generate temp password
            `"${customer.name || ""}"`,
            `"${customer.email || ""}"`,
            `"${customer.phone || ""}"`,
            customer.status === "active" ? "active" : "blocked",
            `"${customer.plan || ""}"`,
            customer.monthly_fee || 0,
            "prepaid",
            1,
            1,
            `"${customer.physical_address || customer.address || ""}"`,
            `"${customer.physical_city || ""}"`,
            `"${customer.postal_code || ""}"`,
            `"${customer.created_at || ""}"`,
            1,
            customer.balance || 0,
          ])
          content = [splynxHeaders.join(","), ...splynxRows.map((row) => row.join(","))].join("\n")
          filename = `splynx_customers_${new Date().toISOString().split("T")[0]}.csv`
          break

        case "mikrotik":
          // MikroTik User Manager format
          const mikrotikData = selectedData.map((customer) => ({
            username: customer.email || customer.phone,
            password: Math.random().toString(36).slice(-8),
            "full-name": customer.name,
            email: customer.email,
            phone: customer.phone,
            address: customer.physical_address || customer.address,
            profile: customer.plan,
            "actual-profile": customer.plan,
            disabled: customer.status !== "active" ? "yes" : "no",
          }))
          content = JSON.stringify(mikrotikData, null, 2)
          filename = `mikrotik_users_${new Date().toISOString().split("T")[0]}.json`
          mimeType = "application/json;charset=utf-8;"
          break

        case "radius":
          // RADIUS users format
          const radiusUsers = selectedData
            .map(
              (customer) =>
                `${customer.email || customer.phone}\tCleartext-Password := "${Math.random().toString(36).slice(-8)}"\n\t\tMikrotik-Rate-Limit = "${customer.plan || "1M/1M"}",\n\t\tReply-Message = "Welcome ${customer.name}"`,
            )
            .join("\n\n")
          content = radiusUsers
          filename = `radius_users_${new Date().toISOString().split("T")[0]}.txt`
          mimeType = "text/plain;charset=utf-8;"
          break

        default:
          // Standard CSV format
          const headers = [
            "ID",
            "Name",
            "Last Name",
            "Email",
            "Phone",
            "Status",
            "Customer Type",
            "Plan",
            "Monthly Fee (KES)",
            "Balance (KES)",
            "Address",
            "City",
            "County",
            "Installation Date",
            "Last Payment",
            "Connection Quality (%)",
            "Created Date",
          ]
          const csvRows = selectedData.map((customer) => [
            customer.id,
            `"${customer.name || ""}"`,
            `"${customer.last_name || ""}"`,
            `"${customer.email || ""}"`,
            `"${customer.phone || ""}"`,
            `"${customer.status || ""}"`,
            `"${customer.customer_type || ""}"`,
            `"${customer.plan || ""}"`,
            customer.monthly_fee || 0,
            customer.balance || 0,
            `"${customer.physical_address || customer.address || ""}"`,
            `"${customer.physical_city || ""}"`,
            `"${customer.physical_county || ""}"`,
            `"${customer.installation_date || ""}"`,
            `"${customer.last_payment_date || ""}"`,
            customer.connection_quality || 0,
            `"${customer.created_at || ""}"`,
          ])
          content = [headers.join(","), ...csvRows.map((row) => row.join(","))].join("\n")
          filename = `customers_export_${new Date().toISOString().split("T")[0]}.csv`
      }

      const blob = new Blob([content], { type: mimeType })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast({
        title: "Export successful",
        description: `Exported ${selectedCustomers.length} customers in ${format.toUpperCase()} format`,
      })
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export customer data",
        variant: "destructive",
      })
    }
  }

  const handleBulkImport = async () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".csv,.json,.txt"
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      try {
        setIsLoading(true)
        const formData = new FormData()
        formData.append("file", file)

        toast({
          title: "Processing file",
          description: "Auto-detecting format and importing customers...",
        })

        const response = await fetch("/api/import-customers", {
          method: "POST",
          body: formData,
        })

        if (response.ok) {
          const result = await response.json()
          toast({
            title: "Import completed",
            description: `Successfully imported ${result.imported} customers. Format: ${result.format}`,
          })
          const data = await getCustomers()
          setCustomers(data)
        } else {
          const error = await response.json()
          throw new Error(error.message || "Import failed")
        }
      } catch (error) {
        console.error("[v0] Import error:", error)
        toast({
          title: "Import failed",
          description: error instanceof Error ? error.message : "Failed to import customers",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
    input.click()
  }

  const handleDeleteCustomer = async (customerId: number, customerName: string) => {
    if (!confirm(`Are you sure you want to delete customer "${customerName}"? This action cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/customers/${customerId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Customer deleted",
          description: `${customerName} has been removed from the system`,
        })
        setCustomers((prev) => prev.filter((c) => c.id !== customerId))
        setSelectedCustomers((prev) => prev.filter((id) => id !== customerId))
      } else {
        throw new Error("Delete failed")
      }
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "Failed to delete customer. Please try again.",
        variant: "destructive",
      })
    }
  }

  const applyFilterPreset = (preset: (typeof FILTER_PRESETS)[0]) => {
    const newFilters = { ...filters, ...preset.filters }
    setFilters(newFilters)

    // Add to filter history
    setFilterHistory((prev) => [
      { timestamp: new Date(), filters: preset.filters },
      ...prev.slice(0, 9), // Keep last 10
    ])

    toast({
      title: "Filter preset applied",
      description: preset.description,
    })
  }

  const saveCurrentFilters = () => {
    const name = prompt("Enter a name for this filter preset:")
    if (name) {
      const newSavedFilter = { name, filters }
      setSavedFilters((prev) => [...prev, newSavedFilter])
      toast({
        title: "Filter saved",
        description: `Filter preset "${name}" has been saved`,
      })
    }
  }

  const clearFilters = () => {
    const defaultFilters: EnhancedFilters = {
      status: "all",
      plan: "",
      router: "",
      ip: "",
      customerType: "all",
      paymentMethod: "all",
      balanceRange: [-10000, 10000],
      monthlyFeeRange: [0, 20000],
      connectionQualityRange: [0, 100],
      createdDateFrom: "",
      createdDateTo: "",
      lastPaymentFrom: "",
      lastPaymentTo: "",
      hasOverdueBalance: false,
      hasActiveService: false,
    }
    setFilters(defaultFilters)
  }

  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (filters.status !== "all") count++
    if (filters.plan) count++
    if (filters.router) count++
    if (filters.ip) count++
    if (filters.customerType !== "all") count++
    if (filters.paymentMethod !== "all") count++
    if (filters.balanceRange[0] !== -10000 || filters.balanceRange[1] !== 10000) count++
    if (filters.monthlyFeeRange[0] !== 0 || filters.monthlyFeeRange[1] !== 20000) count++
    if (filters.connectionQualityRange[0] !== 0 || filters.connectionQualityRange[1] !== 100) count++
    if (filters.createdDateFrom || filters.createdDateTo) count++
    if (filters.lastPaymentFrom || filters.lastPaymentTo) count++
    if (filters.hasOverdueBalance) count++
    if (filters.hasActiveService) count++
    return count
  }, [filters])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-700 bg-green-50 border-green-200"
      case "suspended":
        return "text-yellow-700 bg-yellow-50 border-yellow-200"
      case "inactive":
        return "text-red-700 bg-red-50 border-red-200"
      default:
        return "text-gray-700 bg-gray-50 border-gray-200"
    }
  }

  const getConnectionQualityColor = (quality: number) => {
    if (quality >= 95) return "text-green-600"
    if (quality >= 80) return "text-yellow-600"
    if (quality >= 60) return "text-orange-600"
    return "text-red-600"
  }

  const getBalanceColor = (balance: number) => {
    if (balance > 0) return "text-green-600 font-semibold"
    if (balance < 0) return "text-red-600 font-semibold"
    return "text-gray-600"
  }

  const handleBulkDelete = async () => {
    if (selectedCustomers.length === 0) {
      toast({
        title: "No customers selected",
        description: "Please select customers to delete",
        variant: "destructive",
      })
      return
    }

    if (
      !confirm(`Are you sure you want to delete ${selectedCustomers.length} customers? This action cannot be undone.`)
    ) {
      return
    }

    try {
      setIsLoading(true)
      const response = await fetch("/api/bulk-delete-customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerIds: selectedCustomers }),
      })

      if (response.ok) {
        toast({
          title: "Customers deleted",
          description: `${selectedCustomers.length} customers have been removed from the system`,
        })
        setCustomers((prev) => prev.filter((c) => !selectedCustomers.includes(c.id)))
        setSelectedCustomers([])
      } else {
        throw new Error("Bulk delete failed")
      }
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "Failed to delete customers. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading customers...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Customer Management</h1>
          <p className="text-muted-foreground">
            Manage your customers, track their services, and monitor their account status
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {selectedCustomers.length > 0 && (
            <>
              <Button
                variant="outline"
                onClick={handleBulkDelete}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Selected ({selectedCustomers.length})
              </Button>
              <Button variant="outline" onClick={() => handleBulkExport("csv")}>
                <Download className="mr-2 h-4 w-4" />
                Export Selected
              </Button>
              <Button variant="outline" onClick={handleBulkImport} disabled={isLoading}>
                <Upload className="mr-2 h-4 w-4" />
                {isLoading ? "Importing..." : "Import (Auto-Detect)"}
              </Button>
            </>
          )}
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/customers/add">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Customer
            </Link>
          </Button>
        </div>
      </div>

      {selectedCustomers.length === 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-blue-900">ISP System Integration</h3>
                <p className="text-blue-700 mt-1">Import customers in bulk</p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleBulkImport} disabled={isLoading}>
                <Upload className="mr-2 h-4 w-4" />
                {isLoading ? "Importing..." : "Import Customers"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, phone, or IP address..."
            className="pl-10 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center border rounded-lg p-1 bg-white">
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="h-8 px-3"
            >
              <Table className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="h-8 px-3"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="bg-white">
                <BookmarkPlus className="mr-2 h-4 w-4" />
                Presets
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Filter Presets</h4>
                  <div className="space-y-2">
                    {FILTER_PRESETS.map((preset, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
                        <div>
                          <div className="font-medium text-sm">{preset.name}</div>
                          <div className="text-xs text-muted-foreground">{preset.description}</div>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => applyFilterPreset(preset)}>
                          Apply
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {savedFilters.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Saved Filters</h4>
                    <div className="space-y-2">
                      {savedFilters.map((saved, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
                          <div className="font-medium text-sm">{saved.name}</div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setFilters({ ...filters, ...saved.filters })}
                          >
                            Apply
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button onClick={saveCurrentFilters} className="w-full">
                  <BookmarkPlus className="mr-2 h-4 w-4" />
                  Save Current Filters
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={`bg-white ${activeFiltersCount > 0 ? "border-blue-500 bg-blue-50 text-blue-700" : ""}`}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </Button>

          <Button variant="outline" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)} className="bg-white">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Advanced
          </Button>

          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-gray-500 hover:text-gray-700">
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Basic Filters</CardTitle>
            <CardDescription>Filter customers based on their basic details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Service Plan</label>
                <Input
                  placeholder="Filter by plan"
                  value={filters.plan}
                  onChange={(e) => setFilters((prev) => ({ ...prev, plan: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Customer Type</label>
                <Select
                  value={filters.customerType}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, customerType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="company">Company</SelectItem>
                    <SelectItem value="school">School</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Payment Method</label>
                <Select
                  value={filters.paymentMethod}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, paymentMethod: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All methods" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All methods</SelectItem>
                    <SelectItem value="mpesa">M-Pesa</SelectItem>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Credit Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Router IP</label>
                <Input
                  placeholder="Filter by router IP"
                  value={filters.router}
                  onChange={(e) => setFilters((prev) => ({ ...prev, router: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Allocated IP</label>
                <Input
                  placeholder="Filter by allocated IP"
                  value={filters.ip}
                  onChange={(e) => setFilters((prev) => ({ ...prev, ip: e.target.value }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {showAdvancedFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Advanced Filters</CardTitle>
            <CardDescription>Advanced filtering options with ranges and dates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Balance Range: {formatCurrency(filters.balanceRange[0])} - {formatCurrency(filters.balanceRange[1])}
                  </label>
                  <Slider
                    value={filters.balanceRange}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, balanceRange: value as [number, number] }))
                    }
                    min={-10000}
                    max={10000}
                    step={500}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Monthly Fee Range: {formatCurrency(filters.monthlyFeeRange[0])} -{" "}
                    {formatCurrency(filters.monthlyFeeRange[1])}
                  </label>
                  <Slider
                    value={filters.monthlyFeeRange}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, monthlyFeeRange: value as [number, number] }))
                    }
                    min={0}
                    max={20000}
                    step={500}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Connection Quality: {filters.connectionQualityRange[0]}% - {filters.connectionQualityRange[1]}%
                  </label>
                  <Slider
                    value={filters.connectionQualityRange}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, connectionQualityRange: value as [number, number] }))
                    }
                    min={0}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Created From</label>
                    <Input
                      type="date"
                      value={filters.createdDateFrom}
                      onChange={(e) => setFilters((prev) => ({ ...prev, createdDateFrom: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Created To</label>
                    <Input
                      type="date"
                      value={filters.createdDateTo}
                      onChange={(e) => setFilters((prev) => ({ ...prev, createdDateTo: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Last Payment From</label>
                    <Input
                      type="date"
                      value={filters.lastPaymentFrom}
                      onChange={(e) => setFilters((prev) => ({ ...prev, lastPaymentFrom: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Last Payment To</label>
                    <Input
                      type="date"
                      value={filters.lastPaymentTo}
                      onChange={(e) => setFilters((prev) => ({ ...prev, lastPaymentTo: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="overdue"
                      checked={filters.hasOverdueBalance}
                      onCheckedChange={(checked) => setFilters((prev) => ({ ...prev, hasOverdueBalance: !!checked }))}
                    />
                    <label htmlFor="overdue" className="text-sm font-medium">
                      Has overdue balance (negative balance)
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="active-service"
                      checked={filters.hasActiveService}
                      onCheckedChange={(checked) => setFilters((prev) => ({ ...prev, hasActiveService: !!checked }))}
                    />
                    <label htmlFor="active-service" className="text-sm font-medium">
                      Has active service
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeFiltersCount > 0 && (
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-muted-foreground">Active filters:</span>
              {filters.status !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Status: {filters.status}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setFilters((prev) => ({ ...prev, status: "all" }))}
                  />
                </Badge>
              )}
              {filters.customerType !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Type: {filters.customerType}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setFilters((prev) => ({ ...prev, customerType: "all" }))}
                  />
                </Badge>
              )}
              {filters.hasOverdueBalance && (
                <Badge variant="secondary" className="gap-1">
                  Overdue Balance
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setFilters((prev) => ({ ...prev, hasOverdueBalance: false }))}
                  />
                </Badge>
              )}
              {filters.hasActiveService && (
                <Badge variant="secondary" className="gap-1">
                  Active Service
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setFilters((prev) => ({ ...prev, hasActiveService: false }))}
                  />
                </Badge>
              )}
              {(filters.balanceRange[0] !== -10000 || filters.balanceRange[1] !== 10000) && (
                <Badge variant="secondary" className="gap-1">
                  Balance: {formatCurrency(filters.balanceRange[0])} - {formatCurrency(filters.balanceRange[1])}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setFilters((prev) => ({ ...prev, balanceRange: [-10000, 10000] }))}
                  />
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Customers</CardTitle>
            <Users className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{customers.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {filteredCustomers.length !== customers.length && `${filteredCustomers.length} filtered`}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Customers</CardTitle>
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {customers.filter((c) => c.status === "active").length}
            </div>
            <p className="text-xs text-green-600 mt-1">
              {customers.length > 0 &&
                ((customers.filter((c) => c.status === "active").length / customers.length) * 100).toFixed(1)}
              % of total
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500 bg-gradient-to-r from-yellow-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Suspended</CardTitle>
            <AlertCircle className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {customers.filter((c) => c.status === "suspended").length}
            </div>
            <p className="text-xs text-yellow-600 mt-1">Require attention</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Monthly Revenue</CardTitle>
            <TrendingUp className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {formatCurrency(
                customers.filter((c) => c.status === "active").reduce((sum, c) => sum + (c.monthly_fee || 0), 0),
              )}
            </div>
            <p className="text-xs text-purple-600 mt-1">From active customers</p>
          </CardContent>
        </Card>
      </div>

      {viewMode === "table" ? (
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900">Customer Directory</CardTitle>
                <CardDescription className="text-gray-600">
                  Comprehensive view of all customers with their service details and account status
                </CardDescription>
              </div>
              {selectedCustomers.length > 0 && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {selectedCustomers.length} selected
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 border-b border-gray-200">
                    <TableHead className="w-12 pl-6">
                      <Checkbox
                        checked={selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">Customer</TableHead>
                    <TableHead className="font-semibold text-gray-700">Contact</TableHead>
                    <TableHead className="font-semibold text-gray-700">Service Plan</TableHead>
                    <TableHead className="font-semibold text-gray-700">Network</TableHead>
                    <TableHead className="font-semibold text-gray-700">Status</TableHead>
                    <TableHead className="font-semibold text-gray-700">Balance</TableHead>
                    <TableHead className="font-semibold text-gray-700">Quality</TableHead>
                    <TableHead className="w-16"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer, index) => (
                    <TableRow
                      key={customer.id}
                      className={`hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-25"}`}
                    >
                      <TableCell className="pl-6">
                        <Checkbox
                          checked={selectedCustomers.includes(customer.id)}
                          onCheckedChange={() => handleSelectCustomer(customer.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src="/placeholder.svg" />
                            <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                              {customer.name
                                ?.split(" ")
                                .map((n: string) => n[0])
                                .join("")
                                .toUpperCase() || "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <Link
                              href={`/customers/${customer.id}`}
                              className="font-medium text-gray-900 hover:text-blue-600 hover:underline"
                            >
                              {customer.name}
                            </Link>
                            <div className="text-sm text-gray-500">
                              {customer.status} • {new Date(customer.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-900">{customer.email}</div>
                          <div className="text-sm text-gray-500">{customer.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-gray-900">{customer.plan || "No Plan"}</div>
                          <div className="text-sm text-gray-500">{formatCurrency(customer.monthly_fee || 0)}/month</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm font-mono text-gray-700">
                            {customer.ip_allocated || "Not Assigned"}
                          </div>
                          <div className="text-xs text-gray-500">{customer.router_allocated || "Not Assigned"}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(customer.status)} border`}>{customer.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className={`font-medium ${getBalanceColor(customer.balance || 0)}`}>
                          {formatCurrency(customer.balance || 0)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div
                            className={`text-sm font-medium ${getConnectionQualityColor(customer.connection_quality || 0)}`}
                          >
                            {customer.connection_quality || 0}%
                          </div>
                          <Progress value={customer.connection_quality || 0} className="h-1 w-16" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <Link href={`/customers/${customer.id}`} className="cursor-pointer">
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/customers/${customer.id}/edit`} className="cursor-pointer">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Customer
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600 cursor-pointer"
                              onClick={() => handleDeleteCustomer(customer.id, customer.name)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Customer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredCustomers.length === 0 && (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
                <p className="text-gray-500 mb-6">No customers match your current search and filter criteria.</p>
                <div className="flex justify-center space-x-3">
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                  <Button asChild>
                    <Link href="/customers/add">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add First Customer
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCustomers.map((customer) => (
            <Card key={customer.id} className="hover:shadow-lg transition-shadow duration-200 border-gray-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Checkbox
                    checked={selectedCustomers.includes(customer.id)}
                    onCheckedChange={() => handleSelectCustomer(customer.id)}
                  />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/customers/${customer.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/customers/${customer.id}/edit`} className="cursor-pointer">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Customer
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                      {customer.name
                        ?.split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/customers/${customer.id}`}
                      className="font-semibold text-gray-900 hover:text-blue-600 hover:underline block truncate"
                    >
                      {customer.name}
                    </Link>
                    <p className="text-sm text-gray-500 capitalize">{customer.customer_type}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Status</span>
                  <Badge className={`${getStatusColor(customer.status)} border text-xs`}>{customer.status}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Plan</span>
                  <span className="text-sm font-medium">{customer.plan || "No Plan"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Balance</span>
                  <span className={`text-sm font-medium ${getBalanceColor(customer.balance || 0)}`}>
                    {formatCurrency(customer.balance || 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Quality</span>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-sm font-medium ${getConnectionQualityColor(customer.connection_quality || 0)}`}
                    >
                      {customer.connection_quality || 0}%
                    </span>
                    <Progress value={customer.connection_quality || 0} className="h-1 w-12" />
                  </div>
                </div>
                <Separator />
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 truncate">{customer.email}</p>
                  <p className="text-xs text-gray-500">{customer.phone}</p>
                  <p className="text-xs text-gray-500 font-mono">{customer.ip_allocated || "Not Assigned"}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
          <p className="text-gray-500 mb-6">No customers match your current search and filter criteria.</p>
          <div className="flex justify-center space-x-3">
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
            <Button asChild>
              <Link href="/customers/add">
                <UserPlus className="mr-2 h-4 w-4" />
                Add First Customer
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
