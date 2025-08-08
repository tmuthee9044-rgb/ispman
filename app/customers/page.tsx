"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Plus, Search, Filter, Download, Upload, MoreHorizontal, Eye, Edit, Trash2, X, ExternalLink } from 'lucide-react'
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

export default function CustomersPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCustomers, setSelectedCustomers] = useState<number[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    status: "all",
    plan: "",
    router: "",
    ip: "",
    customerType: "all",
    paymentMethod: "all",
  })

  // Mock customer data with additional fields for filtering
  const customers = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "+1234567890",
      status: "active",
      plan: "Premium",
      balance: "$0.00",
      router_allocated: "192.168.1.1",
      ip_allocated: "10.0.0.15",
      customer_type: "individual",
      payment_method: "mpesa",
      location: "Nairobi",
      created_at: "2023-01-15",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+1234567891",
      status: "active",
      plan: "Standard",
      balance: "-$49.99",
      router_allocated: "192.168.1.2",
      ip_allocated: "10.0.0.16",
      customer_type: "individual",
      payment_method: "bank",
      location: "Mombasa",
      created_at: "2023-02-20",
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@example.com",
      phone: "+1234567892",
      status: "suspended",
      plan: "Basic",
      balance: "-$29.99",
      router_allocated: "192.168.1.3",
      ip_allocated: "10.0.0.17",
      customer_type: "individual",
      payment_method: "cash",
      location: "Kisumu",
      created_at: "2023-03-10",
    },
    {
      id: 4,
      name: "Acme Corporation",
      email: "admin@acme.com",
      phone: "+1234567893",
      status: "active",
      plan: "Business Premium",
      balance: "$150.00",
      router_allocated: "192.168.1.4",
      ip_allocated: "10.0.0.18",
      customer_type: "business",
      payment_method: "mpesa",
      location: "Nairobi",
      created_at: "2023-04-05",
    },
    {
      id: 5,
      name: "Springfield School",
      email: "it@springfield.edu",
      phone: "+1234567894",
      status: "active",
      plan: "Basic",
      balance: "-$15.50",
      router_allocated: "192.168.1.5",
      ip_allocated: "10.0.0.19",
      customer_type: "education",
      payment_method: "bank",
      location: "Nakuru",
      created_at: "2023-05-12",
    },
  ]

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.router_allocated.includes(searchTerm) ||
      customer.ip_allocated.includes(searchTerm)

    const matchesStatus = filters.status === "all" || customer.status === filters.status
    const matchesPlan = !filters.plan || customer.plan.toLowerCase().includes(filters.plan.toLowerCase())
    const matchesRouter = !filters.router || customer.router_allocated.includes(filters.router)
    const matchesIp = !filters.ip || customer.ip_allocated.includes(filters.ip)
    const matchesCustomerType = filters.customerType === "all" || customer.customer_type === filters.customerType
    const matchesPaymentMethod = filters.paymentMethod === "all" || customer.payment_method === filters.paymentMethod

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPlan &&
      matchesRouter &&
      matchesIp &&
      matchesCustomerType &&
      matchesPaymentMethod
    )
  })

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

  const handleBulkExport = () => {
    if (selectedCustomers.length === 0) {
      toast({
        title: "No customers selected",
        description: "Please select customers to export",
        variant: "destructive",
      })
      return
    }

    const selectedData = customers.filter((c) => selectedCustomers.includes(c.id))
    const csvContent = [
      "ID,Name,Email,Phone,Status,Plan,Balance,Router IP,Allocated IP,Customer Type,Payment Method,Location,Created Date",
      ...selectedData.map(
        (c) =>
          `${c.id},"${c.name}","${c.email}","${c.phone}","${c.status}","${c.plan}","${c.balance}","${c.router_allocated}","${c.ip_allocated}","${c.customer_type}","${c.payment_method}","${c.location}","${c.created_at}"`,
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `customers_export_${new Date().toISOString().split("T")[0]}.csv`
    link.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: "Export successful",
      description: `Exported ${selectedCustomers.length} customers`,
    })
  }

  const handleBulkImport = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".csv"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        toast({
          title: "Import started",
          description: `Processing ${file.name}...`,
        })
        // Simulate import process
        setTimeout(() => {
          toast({
            title: "Import completed",
            description: "Customer data has been imported successfully",
          })
        }, 2000)
      }
    }
    input.click()
  }

  const clearFilters = () => {
    setFilters({
      status: "all",
      plan: "",
      router: "",
      ip: "",
      customerType: "all",
      paymentMethod: "all",
    })
  }

  const activeFiltersCount = Object.values(filters).filter((value) => value !== "all" && value !== "").length

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" asChild>
            <Link href="/portal">
              <ExternalLink className="mr-2 h-4 w-4" />
              Customer Portal
            </Link>
          </Button>
          {selectedCustomers.length > 0 && (
            <>
              <Button variant="outline" onClick={handleBulkExport}>
                <Download className="mr-2 h-4 w-4" />
                Export ({selectedCustomers.length})
              </Button>
              <Button variant="outline" onClick={handleBulkImport}>
                <Upload className="mr-2 h-4 w-4" />
                Import
              </Button>
            </>
          )}
          <Button asChild>
            <Link href="/customers/add">
              <Plus className="mr-2 h-4 w-4" />
              Add Customer
            </Link>
          </Button>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers, IPs, routers..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className={activeFiltersCount > 0 ? "border-blue-500 bg-blue-50" : ""}
        >
          <Filter className="mr-2 h-4 w-4" />
          Filter {activeFiltersCount > 0 && `(${activeFiltersCount})`}
        </Button>
        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Advanced Filters</CardTitle>
            <CardDescription>Filter customers based on their details and allocations</CardDescription>
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
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
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
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
            <p className="text-xs text-muted-foreground">
              {filteredCustomers.length !== customers.length && `${filteredCustomers.length} filtered`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.filter((c) => c.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">
              {((customers.filter((c) => c.status === "active").length / customers.length) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suspended</CardTitle>
            <Users className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.filter((c) => c.status === "suspended").length}</div>
            <p className="text-xs text-muted-foreground">
              {((customers.filter((c) => c.status === "suspended").length / customers.length) * 100).toFixed(1)}% of
              total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Selected</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{selectedCustomers.length}</div>
            <p className="text-xs text-muted-foreground">For bulk operations</p>
          </CardContent>
        </Card>
      </div>

      {/* Customer Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
          <CardDescription>Manage your customers and their accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Router IP</TableHead>
                <TableHead>Allocated IP</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedCustomers.includes(customer.id)}
                      onCheckedChange={() => handleSelectCustomer(customer.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <Link
                      href={`/customers/${customer.id}`}
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {customer.name}
                    </Link>
                  </TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        customer.status === "active"
                          ? "default"
                          : customer.status === "suspended"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {customer.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{customer.plan}</TableCell>
                  <TableCell className="font-mono text-sm">{customer.router_allocated}</TableCell>
                  <TableCell className="font-mono text-sm">{customer.ip_allocated}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {customer.customer_type}
                    </Badge>
                  </TableCell>
                  <TableCell className={customer.balance.includes("-") ? "text-red-600" : "text-green-600"}>
                    {customer.balance}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/customers/${customer.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Customer
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
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

          {filteredCustomers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No customers found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
