"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  FileText,
  AlertCircle,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Send,
  TrendingUp,
  Calendar,
  Zap,
  MoreHorizontal,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  DollarSign,
  Users,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Printer,
  Edit,
  Trash2,
  RefreshCw,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { formatCurrency } from "@/lib/currency"

export default function BillingPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false)
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([])
  const [bulkActionDialogOpen, setBulkActionDialogOpen] = useState(false)
  const [bulkAction, setBulkAction] = useState("")
  const { toast } = useToast()

  const invoices = [
    {
      id: "INV-001",
      customer: "John Doe",
      email: "john@example.com",
      amount: 2500,
      status: "paid",
      date: "2024-01-15",
      dueDate: "2024-01-30",
      plan: "Premium 50Mbps",
      avatar: null,
      paymentDate: "2024-01-28",
      daysOverdue: 0,
    },
    {
      id: "INV-002",
      customer: "Jane Smith",
      email: "jane@example.com",
      amount: 1800,
      status: "overdue",
      date: "2024-01-10",
      dueDate: "2024-01-25",
      plan: "Standard 25Mbps",
      avatar: null,
      paymentDate: null,
      daysOverdue: 15,
    },
    {
      id: "INV-003",
      customer: "Bob Johnson",
      email: "bob@example.com",
      amount: 1200,
      status: "pending",
      date: "2024-01-20",
      dueDate: "2024-02-05",
      plan: "Basic 10Mbps",
      avatar: null,
      paymentDate: null,
      daysOverdue: 0,
    },
    {
      id: "INV-004",
      customer: "Alice Brown",
      email: "alice@example.com",
      amount: 5000,
      status: "paid",
      date: "2024-01-25",
      dueDate: "2024-02-10",
      plan: "Business 100Mbps",
      avatar: null,
      paymentDate: "2024-02-08",
      daysOverdue: 0,
    },
    {
      id: "INV-005",
      customer: "Charlie Wilson",
      email: "charlie@example.com",
      amount: 3200,
      status: "pending",
      date: "2024-01-28",
      dueDate: "2024-02-12",
      plan: "Premium 75Mbps",
      avatar: null,
      paymentDate: null,
      daysOverdue: 0,
    },
  ]

  const payments = [
    {
      id: "PAY-001",
      customer: "John Doe",
      amount: 2500,
      method: "M-Pesa",
      date: "2024-01-30",
      status: "completed",
      reference: "QA12B3C4D5",
      avatar: null,
      processingFee: 12.5,
    },
    {
      id: "PAY-002",
      customer: "Alice Brown",
      amount: 5000,
      method: "Bank Transfer",
      date: "2024-02-08",
      status: "completed",
      reference: "BT789456123",
      avatar: null,
      processingFee: 100.0,
    },
    {
      id: "PAY-003",
      customer: "Jane Smith",
      amount: 900,
      method: "Cash",
      date: "2024-02-01",
      status: "pending",
      reference: "CASH-001",
      avatar: null,
      processingFee: 0,
    },
    {
      id: "PAY-004",
      customer: "Charlie Wilson",
      amount: 3200,
      method: "Credit Card",
      date: "2024-02-05",
      status: "completed",
      reference: "CC4532****1234",
      avatar: null,
      processingFee: 80.0,
    },
  ]

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || invoice.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
      case "completed":
        return "text-green-700 bg-green-50 border-green-200"
      case "pending":
        return "text-yellow-700 bg-yellow-50 border-yellow-200"
      case "overdue":
        return "text-red-700 bg-red-50 border-red-200"
      case "failed":
        return "text-red-700 bg-red-50 border-red-200"
      default:
        return "text-gray-700 bg-gray-50 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "overdue":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "M-Pesa":
        return "📱"
      case "Bank Transfer":
        return "🏦"
      case "Credit Card":
        return "💳"
      case "Cash":
        return "💵"
      default:
        return "💳"
    }
  }

  const totalRevenue = invoices.filter((inv) => inv.status === "paid").reduce((sum, inv) => sum + inv.amount, 0)
  const outstandingAmount = invoices.filter((inv) => inv.status !== "paid").reduce((sum, inv) => sum + inv.amount, 0)
  const overdueAmount = invoices.filter((inv) => inv.status === "overdue").reduce((sum, inv) => sum + inv.amount, 0)
  const thisMonthRevenue = payments
    .filter((pay) => pay.status === "completed")
    .reduce((sum, pay) => sum + pay.amount, 0)
  const collectionRate = totalRevenue > 0 ? (totalRevenue / (totalRevenue + outstandingAmount)) * 100 : 0
  const totalProcessingFees = payments
    .filter((pay) => pay.status === "completed")
    .reduce((sum, pay) => sum + pay.processingFee, 0)

  const handleSelectInvoice = (invoiceId: string) => {
    setSelectedInvoices((prev) =>
      prev.includes(invoiceId) ? prev.filter((id) => id !== invoiceId) : [...prev, invoiceId],
    )
  }

  const handleSelectAll = () => {
    if (selectedInvoices.length === filteredInvoices.length) {
      setSelectedInvoices([])
    } else {
      setSelectedInvoices(filteredInvoices.map((inv) => inv.id))
    }
  }

  const handleBulkAction = () => {
    if (selectedInvoices.length === 0) {
      toast({
        title: "No invoices selected",
        description: "Please select invoices to perform bulk actions",
        variant: "destructive",
      })
      return
    }

    let actionMessage = ""
    switch (bulkAction) {
      case "send-reminders":
        actionMessage = `Payment reminders sent to ${selectedInvoices.length} customers`
        break
      case "mark-paid":
        actionMessage = `${selectedInvoices.length} invoices marked as paid`
        break
      case "export":
        actionMessage = `${selectedInvoices.length} invoices exported to CSV`
        break
      case "delete":
        actionMessage = `${selectedInvoices.length} invoices deleted`
        break
    }

    toast({
      title: "Bulk action completed",
      description: actionMessage,
    })

    setSelectedInvoices([])
    setBulkActionDialogOpen(false)
  }

  const handleGenerateInvoices = () => {
    toast({
      title: "Invoices Generated",
      description: "Monthly invoices have been generated for all active customers.",
    })
  }

  const handleCreateInvoice = () => {
    toast({
      title: "Invoice Created",
      description: "New invoice has been created successfully.",
    })
    setInvoiceDialogOpen(false)
  }

  const handleSendReminder = (invoiceId: string) => {
    toast({
      title: "Reminder Sent",
      description: `Payment reminder sent for invoice ${invoiceId}`,
    })
  }

  const handleExportReport = () => {
    toast({
      title: "Report Exported",
      description: "Billing report has been exported to CSV.",
    })
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Billing & Revenue Management</h1>
          <p className="text-muted-foreground">
            Manage invoices, track payments, and monitor your financial performance
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <Button onClick={handleGenerateInvoices} className="bg-blue-600 hover:bg-blue-700">
            <Zap className="mr-2 h-4 w-4" />
            Generate Invoices
          </Button>
          <Button variant="outline" onClick={handleExportReport} className="bg-white border-gray-200">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button variant="outline" asChild className="bg-white border-gray-200">
            <Link href="/billing/overdue">
              <AlertCircle className="mr-2 h-4 w-4" />
              View Overdue
            </Link>
          </Button>
        </div>
      </div>

      {/* Enhanced Financial Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</div>
            <div className="flex items-center mt-2">
              <Progress value={collectionRate} className="flex-1 h-2 mr-2" />
              <span className="text-xs text-green-600 font-medium">{collectionRate.toFixed(1)}% collected</span>
            </div>
            <div className="flex items-center mt-1 text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +12.5% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500 bg-gradient-to-r from-yellow-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Outstanding</CardTitle>
            <AlertCircle className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(outstandingAmount)}</div>
            <p className="text-xs text-yellow-600 mt-1">
              {invoices.filter((inv) => inv.status !== "paid").length} pending invoices
            </p>
            <div className="flex items-center mt-1 text-xs text-yellow-600">
              <ArrowDownRight className="h-3 w-3 mr-1" />
              -5.2% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">This Month</CardTitle>
            <Calendar className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(thisMonthRevenue)}</div>
            <p className="text-xs text-blue-600 mt-1">
              {payments.filter((p) => p.status === "completed").length} payments received
            </p>
            <div className="flex items-center mt-1 text-xs text-blue-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +8.3% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 bg-gradient-to-r from-red-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Overdue</CardTitle>
            <FileText className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(overdueAmount)}</div>
            <p className="text-xs text-red-600 mt-1">
              {invoices.filter((inv) => inv.status === "overdue").length} overdue invoices
            </p>
            <div className="flex items-center mt-1 text-xs text-red-600">
              <AlertCircle className="h-3 w-3 mr-1" />
              Requires attention
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Processing Fees</CardTitle>
            <CreditCard className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalProcessingFees)}</div>
            <p className="text-xs text-purple-600 mt-1">Transaction costs</p>
            <div className="flex items-center mt-1 text-xs text-purple-600">
              <DollarSign className="h-3 w-3 mr-1" />
              2.1% of revenue
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="invoices" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-gray-100">
          <TabsTrigger value="invoices" className="data-[state=active]:bg-white">
            Invoices
          </TabsTrigger>
          <TabsTrigger value="payments" className="data-[state=active]:bg-white">
            Payments
          </TabsTrigger>
          <TabsTrigger value="overdue" className="data-[state=active]:bg-white">
            Overdue
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-white">
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="space-y-4">
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900">Invoice Management</CardTitle>
                  <CardDescription className="text-gray-600">
                    Create, manage, and track customer invoices
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  {selectedInvoices.length > 0 && (
                    <>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {selectedInvoices.length} selected
                      </Badge>
                      <Dialog open={bulkActionDialogOpen} onOpenChange={setBulkActionDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            Bulk Actions
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Bulk Actions</DialogTitle>
                            <DialogDescription>
                              Perform actions on {selectedInvoices.length} selected invoices
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Select Action</Label>
                              <Select value={bulkAction} onValueChange={setBulkAction}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Choose an action" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="send-reminders">Send Payment Reminders</SelectItem>
                                  <SelectItem value="mark-paid">Mark as Paid</SelectItem>
                                  <SelectItem value="export">Export Selected</SelectItem>
                                  <SelectItem value="delete">Delete Invoices</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setBulkActionDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleBulkAction} disabled={!bulkAction}>
                              Execute Action
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </>
                  )}
                  <Dialog open={invoiceDialogOpen} onOpenChange={setInvoiceDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Invoice
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Create New Invoice</DialogTitle>
                        <DialogDescription>Generate a new invoice for a customer</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="customer">Customer</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select customer" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="john">John Doe</SelectItem>
                              <SelectItem value="jane">Jane Smith</SelectItem>
                              <SelectItem value="bob">Bob Johnson</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="amount">Amount (KES)</Label>
                            <Input id="amount" type="number" placeholder="0.00" />
                          </div>
                          <div>
                            <Label htmlFor="due-date">Due Date</Label>
                            <Input id="due-date" type="date" />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="service-plan">Service Plan</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select service plan" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="basic">Basic 10Mbps</SelectItem>
                              <SelectItem value="standard">Standard 25Mbps</SelectItem>
                              <SelectItem value="premium">Premium 50Mbps</SelectItem>
                              <SelectItem value="business">Business 100Mbps</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="notes">Notes (Optional)</Label>
                          <Textarea id="notes" placeholder="Additional notes for this invoice" rows={3} />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="send-email" />
                          <Label htmlFor="send-email" className="text-sm">
                            Send invoice via email immediately
                          </Label>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setInvoiceDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateInvoice} className="bg-blue-600 hover:bg-blue-700">
                          Create Invoice
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mt-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search invoices, customers, or emails..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white border-gray-200"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-40 bg-white border-gray-200">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 border-b border-gray-200">
                      <TableHead className="w-12 pl-6">
                        <Checkbox
                          checked={selectedInvoices.length === filteredInvoices.length && filteredInvoices.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">Invoice</TableHead>
                      <TableHead className="font-semibold text-gray-700">Customer</TableHead>
                      <TableHead className="font-semibold text-gray-700">Service Plan</TableHead>
                      <TableHead className="font-semibold text-gray-700">Amount</TableHead>
                      <TableHead className="font-semibold text-gray-700">Status</TableHead>
                      <TableHead className="font-semibold text-gray-700 hidden sm:table-cell">Due Date</TableHead>
                      <TableHead className="font-semibold text-gray-700 w-16">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.map((invoice, index) => (
                      <TableRow
                        key={invoice.id}
                        className={`hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-25"}`}
                      >
                        <TableCell className="pl-6">
                          <Checkbox
                            checked={selectedInvoices.includes(invoice.id)}
                            onCheckedChange={() => handleSelectInvoice(invoice.id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{invoice.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={invoice.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-semibold">
                                {invoice.customer
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-gray-900">{invoice.customer}</div>
                              <div className="text-sm text-gray-500">{invoice.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium text-gray-900">{invoice.plan}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold text-gray-900">{formatCurrency(invoice.amount)}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(invoice.status)}
                            <Badge className={`${getStatusColor(invoice.status)} border font-medium`}>
                              {invoice.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-gray-600">{invoice.dueDate}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Printer className="mr-2 h-4 w-4" />
                                Print Invoice
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Invoice
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {invoice.status === "overdue" && (
                                <>
                                  <DropdownMenuItem onClick={() => handleSendReminder(invoice.id)}>
                                    <Send className="mr-2 h-4 w-4" />
                                    Send Reminder
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Phone className="mr-2 h-4 w-4" />
                                    Call Customer
                                  </DropdownMenuItem>
                                </>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Invoice
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredInvoices.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
                  <p className="text-gray-500 mb-6">No invoices match your current search criteria.</p>
                  <Button onClick={() => setInvoiceDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Create First Invoice
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900">Payment History</CardTitle>
                  <CardDescription className="text-gray-600">
                    Track and manage customer payment transactions
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" asChild>
                    <Link href="/billing/payments">
                      <Eye className="mr-2 h-4 w-4" />
                      View All
                    </Link>
                  </Button>
                  <Button variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Sync Payments
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 border-b border-gray-200">
                      <TableHead className="font-semibold text-gray-700 pl-6">Payment ID</TableHead>
                      <TableHead className="font-semibold text-gray-700">Customer</TableHead>
                      <TableHead className="font-semibold text-gray-700">Amount</TableHead>
                      <TableHead className="font-semibold text-gray-700">Method</TableHead>
                      <TableHead className="font-semibold text-gray-700 hidden sm:table-cell">Reference</TableHead>
                      <TableHead className="font-semibold text-gray-700 hidden sm:table-cell">Date</TableHead>
                      <TableHead className="font-semibold text-gray-700">Status</TableHead>
                      <TableHead className="font-semibold text-gray-700 w-16">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment, index) => (
                      <TableRow
                        key={payment.id}
                        className={`hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-25"}`}
                      >
                        <TableCell className="font-medium pl-6">{payment.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={payment.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="bg-green-100 text-green-700 text-xs font-semibold">
                                {payment.customer
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="font-medium text-gray-900">{payment.customer}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-semibold text-gray-900">{formatCurrency(payment.amount)}</div>
                            {payment.processingFee > 0 && (
                              <div className="text-xs text-gray-500">Fee: {formatCurrency(payment.processingFee)}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{getPaymentMethodIcon(payment.method)}</span>
                            <span className="text-sm font-medium">{payment.method}</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">{payment.reference}</code>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-gray-600">{payment.date}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(payment.status)}
                            <Badge className={`${getStatusColor(payment.status)} border font-medium`}>
                              {payment.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Receipt
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" />
                                Download Receipt
                              </DropdownMenuItem>
                              {payment.status === "pending" && (
                                <DropdownMenuItem>
                                  <RefreshCw className="mr-2 h-4 w-4" />
                                  Check Status
                                </DropdownMenuItem>
                              )}
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

        <TabsContent value="overdue" className="space-y-4">
          <Card className="shadow-sm border-red-200 bg-red-50/30">
            <CardHeader className="bg-red-50 border-b border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-red-900 flex items-center">
                    <AlertCircle className="mr-2 h-5 w-5" />
                    Overdue Invoices - Immediate Action Required
                  </CardTitle>
                  <CardDescription className="text-red-700">
                    These invoices require immediate follow-up and collection efforts
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  asChild
                  className="border-red-200 text-red-700 hover:bg-red-50 bg-transparent"
                >
                  <Link href="/billing/overdue">
                    <Eye className="mr-2 h-4 w-4" />
                    View All Overdue
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-red-50 border-b border-red-200">
                      <TableHead className="font-semibold text-red-900 pl-6">Invoice ID</TableHead>
                      <TableHead className="font-semibold text-red-900">Customer</TableHead>
                      <TableHead className="font-semibold text-red-900">Amount</TableHead>
                      <TableHead className="font-semibold text-red-900">Days Overdue</TableHead>
                      <TableHead className="font-semibold text-red-900">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices
                      .filter((invoice) => invoice.status === "overdue")
                      .map((invoice, index) => (
                        <TableRow
                          key={invoice.id}
                          className={`hover:bg-red-50 ${index % 2 === 0 ? "bg-white" : "bg-red-25"}`}
                        >
                          <TableCell className="font-medium pl-6">{invoice.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={invoice.avatar || "/placeholder.svg"} />
                                <AvatarFallback className="bg-red-100 text-red-700 text-xs font-semibold">
                                  {invoice.customer
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-gray-900">{invoice.customer}</div>
                                <div className="text-sm text-gray-500">{invoice.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-semibold text-red-600">KES {invoice.amount.toLocaleString()}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="destructive" className="font-medium">
                              {invoice.daysOverdue} days
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSendReminder(invoice.id)}
                                className="border-red-200 text-red-700 hover:bg-red-50"
                              >
                                <Mail className="mr-1 h-3 w-3" />
                                Email
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-red-200 text-red-700 hover:bg-red-50 bg-transparent"
                              >
                                <Phone className="mr-1 h-3 w-3" />
                                Call
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

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Revenue Trends
                </CardTitle>
                <CardDescription>Monthly revenue and collection performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Collection Rate</span>
                    <span className="font-semibold">{collectionRate.toFixed(1)}%</span>
                  </div>
                  <Progress value={collectionRate} className="h-2" />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Collected</div>
                      <div className="font-semibold text-green-600">KES {totalRevenue.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Outstanding</div>
                      <div className="font-semibold text-yellow-600">KES {outstandingAmount.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Customer Payment Behavior
                </CardTitle>
                <CardDescription>Payment patterns and customer segments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">On-time Payments</span>
                    <span className="font-semibold text-green-600">85%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Late Payments</span>
                    <span className="font-semibold text-yellow-600">12%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Overdue</span>
                    <span className="font-semibold text-red-600">3%</span>
                  </div>
                  <Separator />
                  <div className="text-sm text-muted-foreground">
                    Average payment time: <span className="font-semibold text-gray-900">18 days</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Payment Method Analysis</CardTitle>
              <CardDescription>Breakdown of payment methods and their performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl mb-2">📱</div>
                  <div className="font-semibold">M-Pesa</div>
                  <div className="text-sm text-muted-foreground">65% of payments</div>
                  <div className="text-xs text-green-600 mt-1">Fastest processing</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl mb-2">🏦</div>
                  <div className="font-semibold">Bank Transfer</div>
                  <div className="text-sm text-muted-foreground">20% of payments</div>
                  <div className="text-xs text-blue-600 mt-1">Lowest fees</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl mb-2">💳</div>
                  <div className="font-semibold">Credit Card</div>
                  <div className="text-sm text-muted-foreground">10% of payments</div>
                  <div className="text-xs text-purple-600 mt-1">International</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl mb-2">💵</div>
                  <div className="font-semibold">Cash</div>
                  <div className="text-sm text-muted-foreground">5% of payments</div>
                  <div className="text-xs text-gray-600 mt-1">Office visits</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
