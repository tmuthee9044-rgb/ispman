"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import {
  Plus,
  Package,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Users,
  Building,
  FileText,
  CreditCard,
  BarChart3,
  Router,
  Zap,
  Wifi,
  Server,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Search,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock data for ISP inventory management
const mockInventoryData = {
  totalItems: 263,
  lowStockItems: 1,
  outOfStock: 1,
  totalValue: 10007.37,
  categories: [
    { name: "Network Equipment", count: 33, value: 4500.0, icon: Router, color: "bg-blue-500" },
    { name: "Fiber Optic Equipment", count: 195, value: 3200.5, icon: Zap, color: "bg-green-500" },
    { name: "Wireless Equipment", count: 45, value: 1800.25, icon: Wifi, color: "bg-purple-500" },
    { name: "Server Equipment", count: 12, value: 2100.75, icon: Server, color: "bg-orange-500" },
    { name: "Testing Equipment", count: 8, value: 1500.0, icon: BarChart3, color: "bg-red-500" },
    { name: "Power Equipment", count: 35, value: 906.87, icon: Zap, color: "bg-yellow-500" },
    { name: "Installation Tools", count: 0, value: 0, icon: Package, color: "bg-gray-500" },
  ],
  recentMovements: [
    {
      id: 1,
      item: "Router TP-Link AC1750",
      type: "out",
      quantity: -2,
      date: "2024-01-20",
      reason: "Customer installation",
    },
    {
      id: 2,
      item: "Ethernet Cable Cat6 (100ft)",
      type: "out",
      quantity: -25,
      date: "2024-01-18",
      reason: "Field installation",
    },
    { id: 3, item: "Fiber Optic Modem", type: "out", quantity: -1, date: "2024-01-17", reason: "Customer upgrade" },
    {
      id: 4,
      item: "Network Switch 24-Port",
      type: "out",
      quantity: -1,
      date: "2024-01-16",
      reason: "Emergency replacement",
    },
  ],
  suppliers: [
    {
      id: 1,
      name: "Cisco Systems",
      contact: "John Doe",
      email: "john@cisco.com",
      phone: "+1-555-0101",
      category: "Network Equipment",
      rating: 4.8,
      totalOrders: 45,
      totalSpend: 125000,
      paymentTerms: "Net 30",
      creditLimit: 50000,
      currentBalance: 12500,
    },
    {
      id: 2,
      name: "Corning Inc",
      contact: "Sarah Johnson",
      email: "sarah@corning.com",
      phone: "+1-555-0102",
      category: "Fiber Optic Equipment",
      rating: 4.9,
      totalOrders: 32,
      totalSpend: 89000,
      paymentTerms: "Net 15",
      creditLimit: 30000,
      currentBalance: 8500,
    },
    {
      id: 3,
      name: "Ubiquiti Networks",
      contact: "Mike Chen",
      email: "mike@ubnt.com",
      phone: "+1-555-0103",
      category: "Wireless Equipment",
      rating: 4.7,
      totalOrders: 28,
      totalSpend: 67000,
      paymentTerms: "Net 30",
      creditLimit: 25000,
      currentBalance: 5200,
    },
    {
      id: 4,
      name: "Dell Technologies",
      contact: "Lisa Wang",
      email: "lisa@dell.com",
      phone: "+1-555-0104",
      category: "Server Equipment",
      rating: 4.6,
      totalOrders: 15,
      totalSpend: 95000,
      paymentTerms: "Net 45",
      creditLimit: 75000,
      currentBalance: 18000,
    },
    {
      id: 5,
      name: "EXFO Inc",
      contact: "Robert Kim",
      email: "robert@exfo.com",
      phone: "+1-555-0105",
      category: "Testing Equipment",
      rating: 4.5,
      totalOrders: 12,
      totalSpend: 45000,
      paymentTerms: "Net 30",
      creditLimit: 20000,
      currentBalance: 3500,
    },
  ],
  purchaseOrders: [
    {
      id: "PO-2024-001",
      supplier: "Cisco Systems",
      date: "2024-01-15",
      status: "pending",
      total: 15750.0,
      items: 3,
      expectedDelivery: "2024-01-25",
      description: "Network switches and routers",
    },
    {
      id: "PO-2024-002",
      supplier: "Corning Inc",
      date: "2024-01-12",
      status: "approved",
      total: 8900.5,
      items: 5,
      expectedDelivery: "2024-01-22",
      description: "Fiber optic cables and connectors",
    },
    {
      id: "PO-2024-003",
      supplier: "Ubiquiti Networks",
      date: "2024-01-10",
      status: "delivered",
      total: 5200.25,
      items: 2,
      expectedDelivery: "2024-01-20",
      description: "Wireless access points",
    },
  ],
  invoices: [
    {
      id: "INV-2024-001",
      supplier: "Cisco Systems",
      poNumber: "PO-2024-001",
      date: "2024-01-20",
      dueDate: "2024-02-19",
      amount: 15750.0,
      status: "pending",
      description: "Network equipment delivery",
    },
    {
      id: "INV-2024-002",
      supplier: "Corning Inc",
      poNumber: "PO-2024-002",
      date: "2024-01-18",
      dueDate: "2024-02-02",
      amount: 8900.5,
      status: "paid",
      description: "Fiber optic materials",
    },
    {
      id: "INV-2024-003",
      supplier: "Dell Technologies",
      poNumber: "PO-2023-045",
      date: "2024-01-15",
      dueDate: "2024-01-30",
      amount: 12500.0,
      status: "overdue",
      description: "Server hardware",
    },
  ],
  payments: [
    {
      id: "PAY-2024-001",
      supplier: "Corning Inc",
      invoiceNumber: "INV-2024-002",
      date: "2024-01-25",
      amount: 8900.5,
      method: "Bank Transfer",
      reference: "TXN-789456123",
      status: "completed",
    },
    {
      id: "PAY-2024-002",
      supplier: "Ubiquiti Networks",
      invoiceNumber: "INV-2023-089",
      date: "2024-01-22",
      amount: 5200.25,
      method: "ACH",
      reference: "ACH-456789012",
      status: "completed",
    },
    {
      id: "PAY-2024-003",
      supplier: "EXFO Inc",
      invoiceNumber: "INV-2024-005",
      date: "2024-01-20",
      amount: 3500.0,
      method: "Check",
      reference: "CHK-001234",
      status: "pending",
    },
  ],
  storageLocations: [
    { name: "Main Warehouse", items: 180, capacity: 250 },
    { name: "Data Center Storage", items: 45, capacity: 60 },
    { name: "Service Van 1", items: 15, capacity: 20 },
    { name: "Service Van 2", items: 12, capacity: 20 },
    { name: "Field Office", items: 11, capacity: 25 },
  ],
  reorderAlerts: [
    { item: "Fiber Optic Modem", currentStock: 2, reorderLevel: 5, supplier: "Corning Inc" },
    { item: "Network Switch 24-Port", currentStock: 1, reorderLevel: 3, supplier: "Cisco Systems" },
    { item: "Ethernet Cable Cat6", currentStock: 25, reorderLevel: 50, supplier: "Cable World" },
  ],
}

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null)
  const [selectedPO, setSelectedPO] = useState<any>(null)
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)
  const [newSupplierDialogOpen, setNewSupplierDialogOpen] = useState(false)
  const [newPODialogOpen, setNewPODialogOpen] = useState(false)
  const [processInvoiceDialogOpen, setProcessInvoiceDialogOpen] = useState(false)
  const [makePaymentDialogOpen, setMakePaymentDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { variant: "secondary" as const, icon: Clock },
      approved: { variant: "default" as const, icon: CheckCircle },
      delivered: { variant: "default" as const, icon: CheckCircle },
      cancelled: { variant: "destructive" as const, icon: XCircle },
      paid: { variant: "default" as const, icon: CheckCircle },
      overdue: { variant: "destructive" as const, icon: AlertCircle },
      completed: { variant: "default" as const, icon: CheckCircle },
    }

    const config = variants[status as keyof typeof variants] || { variant: "secondary" as const, icon: Clock }
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const handleAddSupplier = () => {
    toast({
      title: "Supplier Added",
      description: "New supplier has been added successfully",
    })
    setNewSupplierDialogOpen(false)
  }

  const handleCreatePO = () => {
    toast({
      title: "Purchase Order Created",
      description: "PO has been created and sent to supplier",
    })
    setNewPODialogOpen(false)
  }

  const handleProcessInvoice = () => {
    toast({
      title: "Invoice Processed",
      description: "Invoice has been processed successfully",
    })
    setProcessInvoiceDialogOpen(false)
  }

  const handleMakePayment = () => {
    toast({
      title: "Payment Processed",
      description: "Payment has been processed successfully",
    })
    setMakePaymentDialogOpen(false)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground">Comprehensive inventory and supplier management for ISP operations</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="purchase-orders">Purchase Orders</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockInventoryData.totalItems}</div>
                <p className="text-xs text-muted-foreground">Across 6 categories</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{mockInventoryData.lowStockItems}</div>
                <p className="text-xs text-muted-foreground">Need reordering</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
                <XCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{mockInventoryData.outOfStock}</div>
                <p className="text-xs text-muted-foreground">Immediate attention needed</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${mockInventoryData.totalValue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Cost: $6,902.5</p>
              </CardContent>
            </Card>
          </div>

          {/* Stock Levels by Category */}
          <Card>
            <CardHeader>
              <CardTitle>Stock Levels by Category</CardTitle>
              <CardDescription>Current inventory distribution across equipment categories</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockInventoryData.categories.map((category) => {
                const Icon = category.icon
                const percentage = (category.count / mockInventoryData.totalItems) * 100
                return (
                  <div key={category.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Icon className="h-4 w-4" />
                        <span className="text-sm font-medium">{category.name}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {category.count} items • ${category.value.toLocaleString()}
                      </div>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Movements */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Movements</CardTitle>
                <CardDescription>Latest inventory transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockInventoryData.recentMovements.map((movement) => (
                    <div key={movement.id} className="flex items-center space-x-3">
                      <div
                        className={`w-2 h-2 rounded-full ${movement.type === "out" ? "bg-red-500" : "bg-green-500"}`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{movement.item}</p>
                        <p className="text-xs text-muted-foreground">{movement.reason}</p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-sm font-medium ${movement.type === "out" ? "text-red-600" : "text-green-600"}`}
                        >
                          {movement.quantity}
                        </p>
                        <p className="text-xs text-muted-foreground">{movement.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Suppliers */}
            <Card>
              <CardHeader>
                <CardTitle>Top Suppliers</CardTitle>
                <CardDescription>By total spend this year</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockInventoryData.suppliers.slice(0, 5).map((supplier) => (
                    <div key={supplier.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{supplier.name}</p>
                        <p className="text-xs text-muted-foreground">{supplier.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">${supplier.totalSpend.toLocaleString()}</p>
                        <div className="flex items-center space-x-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className={`w-2 h-2 rounded-full ${
                                  i < Math.floor(supplier.rating) ? "bg-yellow-400" : "bg-gray-200"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">{supplier.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reorder Alerts */}
            <Card>
              <CardHeader>
                <CardTitle>Reorder Alerts</CardTitle>
                <CardDescription>Items requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockInventoryData.reorderAlerts.map((alert, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                    >
                      <div>
                        <p className="text-sm font-medium">{alert.item}</p>
                        <p className="text-xs text-muted-foreground">
                          Stock: {alert.currentStock} • Reorder at: {alert.reorderLevel}
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        <Plus className="h-3 w-3 mr-1" />
                        Order
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Items Tab */}
        <TabsContent value="items" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div>
                  <CardTitle>Inventory Items</CardTitle>
                  <CardDescription>Manage your ISP equipment and supplies</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-64"
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Unit Cost</TableHead>
                      <TableHead>Total Value</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Cisco ISR 4331 Router</TableCell>
                      <TableCell>Network Equipment</TableCell>
                      <TableCell>CSC-ISR4331</TableCell>
                      <TableCell>5</TableCell>
                      <TableCell>Main Warehouse</TableCell>
                      <TableCell>$1,299.00</TableCell>
                      <TableCell>$6,495.00</TableCell>
                      <TableCell>
                        <Badge variant="default">In Stock</Badge>
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
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Item
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Item
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Corning Fiber Optic Cable</TableCell>
                      <TableCell>Fiber Optic Equipment</TableCell>
                      <TableCell>COR-FOC-SM</TableCell>
                      <TableCell>2</TableCell>
                      <TableCell>Main Warehouse</TableCell>
                      <TableCell>$2.50</TableCell>
                      <TableCell>$5.00</TableCell>
                      <TableCell>
                        <Badge variant="destructive">Low Stock</Badge>
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
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Item
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Item
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Suppliers Tab */}
        <TabsContent value="suppliers" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div>
                  <CardTitle>Supplier Management</CardTitle>
                  <CardDescription>Manage your ISP equipment suppliers and vendor relationships</CardDescription>
                </div>
                <Button onClick={() => setNewSupplierDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Supplier
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Supplier Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Total Orders</TableHead>
                      <TableHead>Total Spend</TableHead>
                      <TableHead>Payment Terms</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockInventoryData.suppliers.map((supplier) => (
                      <TableRow key={supplier.id}>
                        <TableCell className="font-medium">{supplier.name}</TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">{supplier.contact}</p>
                            <p className="text-xs text-muted-foreground">{supplier.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>{supplier.category}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-2 h-2 rounded-full ${
                                    i < Math.floor(supplier.rating) ? "bg-yellow-400" : "bg-gray-200"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm">{supplier.rating}</span>
                          </div>
                        </TableCell>
                        <TableCell>{supplier.totalOrders}</TableCell>
                        <TableCell>${supplier.totalSpend.toLocaleString()}</TableCell>
                        <TableCell>{supplier.paymentTerms}</TableCell>
                        <TableCell>
                          <span className={supplier.currentBalance > 0 ? "text-red-600" : "text-green-600"}>
                            ${supplier.currentBalance.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setSelectedSupplier(supplier)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Supplier
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <FileText className="h-4 w-4 mr-2" />
                                View Statement
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remove Supplier
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Purchase Orders Tab */}
        <TabsContent value="purchase-orders" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div>
                  <CardTitle>Purchase Orders</CardTitle>
                  <CardDescription>Manage purchase orders for ISP equipment and supplies</CardDescription>
                </div>
                <Button onClick={() => setNewPODialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create PO
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>PO Number</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Expected Delivery</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockInventoryData.purchaseOrders.map((po) => (
                      <TableRow key={po.id}>
                        <TableCell className="font-medium">{po.id}</TableCell>
                        <TableCell>{po.supplier}</TableCell>
                        <TableCell>{po.date}</TableCell>
                        <TableCell>{getStatusBadge(po.status)}</TableCell>
                        <TableCell>{po.items}</TableCell>
                        <TableCell>${po.total.toLocaleString()}</TableCell>
                        <TableCell>{po.expectedDelivery}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setSelectedPO(po)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit PO
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="h-4 w-4 mr-2" />
                                Download PDF
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <XCircle className="h-4 w-4 mr-2" />
                                Cancel PO
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Invoices Tab */}
        <TabsContent value="invoices" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div>
                  <CardTitle>Supplier Invoices</CardTitle>
                  <CardDescription>Process and manage supplier invoices</CardDescription>
                </div>
                <Button onClick={() => setProcessInvoiceDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Process Invoice
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice Number</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>PO Number</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockInventoryData.invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.id}</TableCell>
                        <TableCell>{invoice.supplier}</TableCell>
                        <TableCell>{invoice.poNumber}</TableCell>
                        <TableCell>{invoice.date}</TableCell>
                        <TableCell>{invoice.dueDate}</TableCell>
                        <TableCell>${invoice.amount.toLocaleString()}</TableCell>
                        <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setSelectedInvoice(invoice)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Invoice
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <CreditCard className="h-4 w-4 mr-2" />
                                Make Payment
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="h-4 w-4 mr-2" />
                                Download PDF
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Invoice
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div>
                  <CardTitle>Supplier Payments</CardTitle>
                  <CardDescription>Track and manage payments to suppliers</CardDescription>
                </div>
                <Button onClick={() => setMakePaymentDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Make Payment
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payment ID</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Invoice Number</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockInventoryData.payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.id}</TableCell>
                        <TableCell>{payment.supplier}</TableCell>
                        <TableCell>{payment.invoiceNumber}</TableCell>
                        <TableCell>{payment.date}</TableCell>
                        <TableCell>${payment.amount.toLocaleString()}</TableCell>
                        <TableCell>{payment.method}</TableCell>
                        <TableCell>{payment.reference}</TableCell>
                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Receipt
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="h-4 w-4 mr-2" />
                                Download Receipt
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Payment
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inventory Turnover</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.2x</div>
                <p className="text-xs text-muted-foreground">+12% from last quarter</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Supplier Performance</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94.5%</div>
                <p className="text-xs text-muted-foreground">On-time delivery rate</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cost Savings</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$12,450</div>
                <p className="text-xs text-muted-foreground">This quarter</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Suppliers</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockInventoryData.suppliers.length}</div>
                <p className="text-xs text-muted-foreground">Across all categories</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Supplier Spend Analysis</CardTitle>
              <CardDescription>Top suppliers by total spend this year</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockInventoryData.suppliers.map((supplier) => {
                  const maxSpend = Math.max(...mockInventoryData.suppliers.map((s) => s.totalSpend))
                  const percentage = (supplier.totalSpend / maxSpend) * 100
                  return (
                    <div key={supplier.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{supplier.name}</p>
                          <p className="text-xs text-muted-foreground">{supplier.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">${supplier.totalSpend.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">{supplier.totalOrders} orders</p>
                        </div>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Supplier Dialog */}
      <Dialog open={newSupplierDialogOpen} onOpenChange={setNewSupplierDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Supplier</DialogTitle>
            <DialogDescription>Add a new supplier to your ISP inventory management system</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="supplier-name">Supplier Name</Label>
                <Input id="supplier-name" placeholder="Cisco Systems" />
              </div>
              <div>
                <Label htmlFor="contact-person">Contact Person</Label>
                <Input id="contact-person" placeholder="John Doe" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@cisco.com" />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="+1-555-0101" />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="network">Network Equipment</SelectItem>
                    <SelectItem value="fiber">Fiber Optic Equipment</SelectItem>
                    <SelectItem value="wireless">Wireless Equipment</SelectItem>
                    <SelectItem value="server">Server Equipment</SelectItem>
                    <SelectItem value="testing">Testing Equipment</SelectItem>
                    <SelectItem value="power">Power Equipment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="payment-terms">Payment Terms</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment terms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="net15">Net 15</SelectItem>
                    <SelectItem value="net30">Net 30</SelectItem>
                    <SelectItem value="net45">Net 45</SelectItem>
                    <SelectItem value="net60">Net 60</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="credit-limit">Credit Limit</Label>
                <Input id="credit-limit" type="number" placeholder="50000" />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" placeholder="Enter supplier address" rows={3} />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" placeholder="Additional notes about the supplier" rows={3} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewSupplierDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSupplier}>
              <Plus className="h-4 w-4 mr-2" />
              Add Supplier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create PO Dialog */}
      <Dialog open={newPODialogOpen} onOpenChange={setNewPODialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Create Purchase Order</DialogTitle>
            <DialogDescription>Create a new purchase order for ISP equipment and supplies</DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="po-supplier">Supplier</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockInventoryData.suppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.name}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="po-date">Order Date</Label>
                <Input id="po-date" type="date" />
              </div>
              <div>
                <Label htmlFor="expected-delivery">Expected Delivery</Label>
                <Input id="expected-delivery" type="date" />
              </div>
            </div>

            <div>
              <Label>Order Items</Label>
              <div className="border rounded-lg p-4 space-y-4">
                <div className="grid grid-cols-12 gap-2 text-sm font-medium">
                  <div className="col-span-4">Item Description</div>
                  <div className="col-span-2">Quantity</div>
                  <div className="col-span-2">Unit Price</div>
                  <div className="col-span-2">Total</div>
                  <div className="col-span-2">Actions</div>
                </div>
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-4">
                    <Input placeholder="Enter item description" />
                  </div>
                  <div className="col-span-2">
                    <Input type="number" placeholder="1" />
                  </div>
                  <div className="col-span-2">
                    <Input type="number" placeholder="0.00" />
                  </div>
                  <div className="col-span-2">
                    <Input placeholder="$0.00" disabled />
                  </div>
                  <div className="col-span-2">
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </div>

            <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
              <span className="font-medium">Total Amount:</span>
              <span className="text-xl font-bold">$0.00</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewPODialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreatePO}>
              <FileText className="h-4 w-4 mr-2" />
              Create Purchase Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Process Invoice Dialog */}
      <Dialog open={processInvoiceDialogOpen} onOpenChange={setProcessInvoiceDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Process Supplier Invoice</DialogTitle>
            <DialogDescription>Process and record a new invoice from a supplier</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="invoice-number">Invoice Number</Label>
                <Input id="invoice-number" placeholder="INV-2024-001" />
              </div>
              <div>
                <Label htmlFor="invoice-supplier">Supplier</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockInventoryData.suppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.name}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="po-reference">PO Reference</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select PO" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockInventoryData.purchaseOrders.map((po) => (
                      <SelectItem key={po.id} value={po.id}>
                        {po.id} - {po.supplier}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="invoice-date">Invoice Date</Label>
                <Input id="invoice-date" type="date" />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="due-date">Due Date</Label>
                <Input id="due-date" type="date" />
              </div>
              <div>
                <Label htmlFor="invoice-amount">Amount</Label>
                <Input id="invoice-amount" type="number" placeholder="0.00" />
              </div>
              <div>
                <Label htmlFor="invoice-description">Description</Label>
                <Textarea id="invoice-description" placeholder="Invoice description" rows={3} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProcessInvoiceDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleProcessInvoice}>
              <FileText className="h-4 w-4 mr-2" />
              Process Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Make Payment Dialog */}
      <Dialog open={makePaymentDialogOpen} onOpenChange={setMakePaymentDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Make Supplier Payment</DialogTitle>
            <DialogDescription>Process a payment to a supplier for outstanding invoices</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="payment-supplier">Supplier</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockInventoryData.suppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.name}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="payment-invoice">Invoice</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select invoice" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockInventoryData.invoices.map((invoice) => (
                      <SelectItem key={invoice.id} value={invoice.id}>
                        {invoice.id} - ${invoice.amount}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="payment-amount">Payment Amount</Label>
                <Input id="payment-amount" type="number" placeholder="0.00" />
              </div>
              <div>
                <Label htmlFor="payment-date">Payment Date</Label>
                <Input id="payment-date" type="date" />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="payment-method">Payment Method</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                    <SelectItem value="check">Check</SelectItem>
                    <SelectItem value="wire">Wire Transfer</SelectItem>
                    <SelectItem value="ach">ACH</SelectItem>
                    <SelectItem value="credit-card">Credit Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="payment-reference">Reference Number</Label>
                <Input id="payment-reference" placeholder="TXN-123456789" />
              </div>
              <div>
                <Label htmlFor="payment-notes">Notes</Label>
                <Textarea id="payment-notes" placeholder="Payment notes" rows={3} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMakePaymentDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleMakePayment}>
              <CreditCard className="h-4 w-4 mr-2" />
              Process Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
