"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Receipt,
  FileText,
  Download,
  Plus,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  Wifi,
  Server,
  Shield,
  UserCheck,
  Banknote,
  Filter,
  Eye,
  Edit,
  MoreHorizontal,
  Send,
  Calculator,
  Trash2,
  Upload,
  RefreshCw,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [dateRange, setDateRange] = useState({ from: new Date(2024, 0, 1), to: new Date() })
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false)
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false)
  const [isTaxModalOpen, setIsTaxModalOpen] = useState(false)
  const [isExpenseEditModalOpen, setIsExpenseEditModalOpen] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState<any>(null)
  const [financialData, setFinancialData] = useState({
    totalRevenue: 0,
    totalExpenses: 389234, // Keep static for now
    netProfit: 0,
    profitMargin: 0,
    cashFlow: 0,
    accountsReceivable: 0,
    accountsPayable: 67890, // Keep static for now
    monthlyGrowth: 0,
    revenueStreams: [],
    topCustomers: [],
    monthlyRevenue: [],
  })
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchFinancialData = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/finance/dashboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dateFrom: dateRange.from.toISOString().split("T")[0],
          dateTo: dateRange.to.toISOString().split("T")[0],
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setFinancialData(data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch financial data",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching financial data:", error)
      toast({
        title: "Error",
        description: "Failed to connect to financial data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFinancialData()
  }, [dateRange])

  const financialMetrics = {
    totalRevenue: financialData.totalRevenue,
    totalExpenses: financialData.totalExpenses,
    netProfit: financialData.totalRevenue - financialData.totalExpenses,
    profitMargin:
      financialData.totalRevenue > 0
        ? ((financialData.totalRevenue - financialData.totalExpenses) / financialData.totalRevenue) * 100
        : 0,
    cashFlow: financialData.cashFlow || financialData.totalRevenue - financialData.totalExpenses,
    accountsReceivable: financialData.accountsReceivable,
    accountsPayable: financialData.accountsPayable,
    monthlyGrowth: financialData.monthlyGrowth,
  }

  const revenueStreams =
    financialData.revenueStreams.length > 0
      ? financialData.revenueStreams
      : [
          { name: "Internet Subscriptions", amount: financialData.totalRevenue * 0.728, percentage: 72.8, growth: 8.5 },
          { name: "Installation Fees", amount: financialData.totalRevenue * 0.1, percentage: 10.0, growth: 15.2 },
          { name: "Equipment Sales", amount: financialData.totalRevenue * 0.088, percentage: 8.8, growth: -3.1 },
          { name: "Support Services", amount: financialData.totalRevenue * 0.051, percentage: 5.1, growth: 22.4 },
          { name: "Business Solutions", amount: financialData.totalRevenue * 0.033, percentage: 3.3, growth: 18.7 },
        ]

  // Expense Categories Data with detailed records
  const expenseCategories = [
    { name: "Bandwidth & Connectivity", amount: 156000, percentage: 40.1, budget: 160000, variance: -2.5 },
    { name: "Infrastructure & Equipment", amount: 89500, percentage: 23.0, budget: 85000, variance: 5.3 },
    { name: "Personnel Costs", amount: 78200, percentage: 20.1, budget: 80000, variance: -2.3 },
    { name: "Regulatory & Compliance", amount: 35600, percentage: 9.1, budget: 32000, variance: 11.3 },
    { name: "Marketing & Sales", amount: 19934, percentage: 5.1, budget: 25000, variance: -20.3 },
    { name: "Other Operating Expenses", amount: 10000, percentage: 2.6, budget: 12000, variance: -16.7 },
  ]

  // Detailed Expense Records
  const expenseRecords = [
    {
      id: 1,
      date: "2024-01-20",
      description: "Bandwidth Purchase - Tier 1 Provider",
      category: "Bandwidth & Connectivity",
      vendor: "Global Connect Ltd",
      amount: 15000,
      paymentMethod: "Bank Transfer",
      status: "Paid",
      receiptUrl: "/receipts/exp-001.pdf",
    },
    {
      id: 2,
      date: "2024-01-19",
      description: "Router Equipment Purchase",
      category: "Infrastructure & Equipment",
      vendor: "Tech Solutions Inc",
      amount: 2500,
      paymentMethod: "Credit Card",
      status: "Pending",
      receiptUrl: null,
    },
    {
      id: 3,
      date: "2024-01-18",
      description: "Network Engineer Salary - January",
      category: "Personnel Costs",
      vendor: "Internal",
      amount: 4500,
      paymentMethod: "Bank Transfer",
      status: "Paid",
      receiptUrl: null,
    },
    {
      id: 4,
      date: "2024-01-17",
      description: "ISP Licensing Fee - Annual",
      category: "Regulatory & Compliance",
      vendor: "Communications Authority",
      amount: 8000,
      paymentMethod: "Bank Transfer",
      status: "Paid",
      receiptUrl: "/receipts/exp-004.pdf",
    },
    {
      id: 5,
      date: "2024-01-16",
      description: "Digital Marketing Campaign",
      category: "Marketing & Sales",
      vendor: "AdTech Agency",
      amount: 1200,
      paymentMethod: "M-Pesa",
      status: "Paid",
      receiptUrl: null,
    },
  ]

  // Outstanding Invoices Data
  const outstandingInvoices = [
    {
      id: "INV-2024-001",
      customer: "TechCorp Ltd",
      amount: 2500,
      dueDate: "2024-02-15",
      daysOverdue: 5,
      status: "overdue",
    },
    {
      id: "INV-2024-002",
      customer: "StartupHub Inc",
      amount: 1200,
      dueDate: "2024-02-20",
      daysOverdue: 0,
      status: "pending",
    },
    {
      id: "INV-2024-003",
      customer: "Global Solutions",
      amount: 3800,
      dueDate: "2024-02-25",
      daysOverdue: 0,
      status: "pending",
    },
    {
      id: "INV-2024-004",
      customer: "Local Business Co",
      amount: 850,
      dueDate: "2024-01-30",
      daysOverdue: 20,
      status: "overdue",
    },
  ]

  // Tax Information Data with detailed records
  const taxData = {
    vatCollected: 89234,
    vatPaid: 34567,
    netVatDue: 54667,
    corporateIncomeTax: 125000,
    serviceTax: 23400,
    regulatoryFees: 15600,
    nextFilingDate: "2024-03-15",
    complianceStatus: "current",
  }

  // Tax Records
  const taxRecords = [
    {
      id: 1,
      type: "VAT Return",
      period: "January 2024",
      amount: 54667,
      dueDate: "2024-02-20",
      status: "Filed",
      filedDate: "2024-02-15",
      penalty: 0,
    },
    {
      id: 2,
      type: "Corporate Income Tax",
      period: "Q4 2023",
      amount: 125000,
      dueDate: "2024-03-20",
      status: "Pending",
      filedDate: null,
      penalty: 0,
    },
    {
      id: 3,
      type: "Service Tax",
      period: "January 2024",
      amount: 23400,
      dueDate: "2024-02-10",
      status: "Overdue",
      filedDate: null,
      penalty: 1170,
    },
    {
      id: 4,
      type: "Regulatory Fees",
      period: "Annual 2024",
      amount: 15600,
      dueDate: "2024-01-31",
      status: "Paid",
      filedDate: "2024-01-28",
      penalty: 0,
    },
  ]

  // Budget Data
  const budgetData = [
    { category: "Revenue", budgeted: 900000, actual: 892847, variance: -0.8 },
    { category: "Bandwidth Costs", budgeted: 160000, actual: 156000, variance: -2.5 },
    { category: "Infrastructure", budgeted: 85000, actual: 89500, variance: 5.3 },
    { category: "Personnel", budgeted: 80000, actual: 78200, variance: -2.3 },
    { category: "Marketing", budgeted: 25000, actual: 19934, variance: -20.3 },
    { category: "Other Expenses", budgeted: 50000, actual: 45600, variance: -8.8 },
  ]

  // Customer Revenue Analysis
  const topCustomers = financialData.topCustomers.length > 0 ? financialData.topCustomers : []

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`
  }

  const getVarianceColor = (variance: number) => {
    if (variance > 5) return "text-red-600"
    if (variance < -5) return "text-green-600"
    return "text-yellow-600"
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "overdue":
        return <Badge variant="destructive">Overdue</Badge>
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "paid":
        return <Badge variant="default">Paid</Badge>
      case "filed":
        return <Badge variant="default">Filed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleCreateExpense = () => {
    setIsExpenseModalOpen(false)
    toast({
      title: "Expense Created",
      description: "New expense record has been added successfully.",
    })
  }

  const handleCreateTaxRecord = () => {
    setIsTaxModalOpen(false)
    toast({
      title: "Tax Record Created",
      description: "New tax obligation has been recorded successfully.",
    })
  }

  const handleEditExpense = (expense: any) => {
    setSelectedExpense(expense)
    setIsExpenseEditModalOpen(true)
  }

  const handleDeleteExpense = (expenseId: number) => {
    toast({
      title: "Expense Deleted",
      description: "Expense record has been removed successfully.",
    })
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Finance Management</h1>
          <p className="text-muted-foreground">Real-time financial management powered by customer payment data</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
          <Button variant="outline" onClick={fetchFinancialData} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh Data
          </Button>
          <Button onClick={() => setIsReportModalOpen(true)}>
            <FileText className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {loading && (
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Loading financial data...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && (
        <>
          {/* Financial Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">KES {financialMetrics.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <span
                    className={`inline-flex items-center ${financialData.monthlyGrowth >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {financialData.monthlyGrowth >= 0 ? "+" : ""}
                    {financialData.monthlyGrowth.toFixed(1)}%
                  </span>{" "}
                  from last period
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">KES {financialMetrics.totalExpenses.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-orange-600">+2.1%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${financialMetrics.netProfit >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  KES {financialMetrics.netProfit.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {financialMetrics.profitMargin.toFixed(1)}% profit margin
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cash Flow</CardTitle>
                <Banknote className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${financialData.cashFlow >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  KES {financialData.cashFlow.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Current cash position</p>
              </CardContent>
            </Card>
          </div>

          {/* Cash Flow Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cash Flow</CardTitle>
                <Banknote className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(financialMetrics.cashFlow)}</div>
                <p className="text-xs text-muted-foreground">Positive cash flow</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Accounts Receivable</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(financialMetrics.accountsReceivable)}</div>
                <p className="text-xs text-muted-foreground">Outstanding customer payments</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Accounts Payable</CardTitle>
                <Receipt className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(financialMetrics.accountsPayable)}</div>
                <p className="text-xs text-muted-foreground">Outstanding supplier payments</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="overflow-x-auto">
              <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-flex">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="revenue">Revenue</TabsTrigger>
                <TabsTrigger value="expenses">Expenses</TabsTrigger>
                <TabsTrigger value="invoicing">Invoicing</TabsTrigger>
                <TabsTrigger value="taxes">Taxes</TabsTrigger>
                <TabsTrigger value="budget">Budget</TabsTrigger>
              </TabsList>
            </div>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Breakdown</CardTitle>
                    <CardDescription>Revenue by service category</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {revenueStreams.map((stream, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{stream.name}</span>
                          <div className="text-right">
                            <div className="text-sm font-bold">{formatCurrency(stream.amount)}</div>
                            <div className={`text-xs ${stream.growth > 0 ? "text-green-600" : "text-red-600"}`}>
                              {formatPercentage(stream.growth)}
                            </div>
                          </div>
                        </div>
                        <Progress value={stream.percentage} className="h-2" />
                        <div className="text-xs text-muted-foreground">{stream.percentage}% of total revenue</div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Top Customers */}
                <Card>
                  <CardHeader>
                    <CardTitle>Top Revenue Customers</CardTitle>
                    <CardDescription>Highest revenue generating customers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {topCustomers.map((customer, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="space-y-1">
                            <div className="font-medium">{customer.name}</div>
                            <div className="text-sm text-muted-foreground">{customer.plan}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">{formatCurrency(customer.revenue)}</div>
                            <div className={`text-xs ${customer.growth > 0 ? "text-green-600" : "text-red-600"}`}>
                              {formatPercentage(customer.growth)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Financial Health Indicators */}
              <Card>
                <CardHeader>
                  <CardTitle>Financial Health Indicators</CardTitle>
                  <CardDescription>Key performance indicators for financial health</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">98.5%</div>
                      <div className="text-sm text-muted-foreground">Collection Rate</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">15 days</div>
                      <div className="text-sm text-muted-foreground">Avg Collection Period</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">2.3%</div>
                      <div className="text-sm text-muted-foreground">Churn Rate</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">$1,250</div>
                      <div className="text-sm text-muted-foreground">Customer LTV</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Revenue Tab */}
            <TabsContent value="revenue" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Growth Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Growth Metrics</CardTitle>
                    <CardDescription>Monthly recurring revenue and growth trends</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{formatCurrency(650000)}</div>
                        <div className="text-sm text-muted-foreground">Monthly Recurring Revenue</div>
                        <div className="text-xs text-green-600 mt-1">+8.5% MoM</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{formatCurrency(89500)}</div>
                        <div className="text-sm text-muted-foreground">One-time Revenue</div>
                        <div className="text-xs text-green-600 mt-1">+15.2% MoM</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Revenue Target</span>
                        <span className="text-sm font-medium">{formatCurrency(900000)}</span>
                      </div>
                      <Progress value={(financialMetrics.totalRevenue / 900000) * 100} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        {((financialMetrics.totalRevenue / 900000) * 100).toFixed(1)}% of monthly target achieved
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Revenue by Service Plan */}
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue by Service Plan</CardTitle>
                    <CardDescription>Breakdown by subscription tiers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { plan: "Enterprise", revenue: 285000, customers: 45, avgRevenue: 6333 },
                        { plan: "Business Pro", revenue: 198000, customers: 132, avgRevenue: 1500 },
                        { plan: "Premium", revenue: 156000, customers: 312, avgRevenue: 500 },
                        { plan: "Standard", revenue: 89000, customers: 445, avgRevenue: 200 },
                        { plan: "Basic", revenue: 45000, customers: 225, avgRevenue: 200 },
                      ].map((plan, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">{plan.plan}</div>
                            <div className="text-sm text-muted-foreground">{plan.customers} customers</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">{formatCurrency(plan.revenue)}</div>
                            <div className="text-sm text-muted-foreground">Avg: {formatCurrency(plan.avgRevenue)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Revenue Forecasting */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Forecasting</CardTitle>
                  <CardDescription>Projected revenue for the next 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-xl font-bold">{formatCurrency(920000)}</div>
                      <div className="text-sm text-muted-foreground">Next Month Forecast</div>
                      <div className="text-xs text-green-600">+3.1% growth</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-xl font-bold">{formatCurrency(5650000)}</div>
                      <div className="text-sm text-muted-foreground">6-Month Forecast</div>
                      <div className="text-xs text-green-600">+18.5% growth</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-xl font-bold">94.2%</div>
                      <div className="text-sm text-muted-foreground">Forecast Accuracy</div>
                      <div className="text-xs text-muted-foreground">Last 12 months</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Expenses Tab */}
            <TabsContent value="expenses" className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-lg font-semibold">Expense Management</h3>
                  <p className="text-sm text-muted-foreground">Track and manage all business expenses</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Import Expenses
                  </Button>
                  <Button onClick={() => setIsExpenseModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Expense
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Expense Categories */}
                <Card>
                  <CardHeader>
                    <CardTitle>Expense Categories</CardTitle>
                    <CardDescription>Breakdown of operational expenses</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {expenseCategories.map((category, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{category.name}</span>
                          <div className="text-right">
                            <div className="text-sm font-bold">{formatCurrency(category.amount)}</div>
                            <div className={`text-xs ${getVarianceColor(category.variance)}`}>
                              {formatPercentage(category.variance)} vs budget
                            </div>
                          </div>
                        </div>
                        <Progress value={category.percentage} className="h-2" />
                        <div className="text-xs text-muted-foreground">
                          {category.percentage}% of total expenses • Budget: {formatCurrency(category.budget)}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* ISP-Specific Cost Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle>ISP Infrastructure Costs</CardTitle>
                    <CardDescription>Detailed breakdown of ISP-specific expenses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Wifi className="h-4 w-4 text-blue-500" />
                          <span className="font-medium">Bandwidth & Connectivity</span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Tier 1 Provider Costs</span>
                            <span className="font-medium">{formatCurrency(89000)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Peering Agreements</span>
                            <span className="font-medium">{formatCurrency(45000)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>CDN Services</span>
                            <span className="font-medium">{formatCurrency(22000)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Server className="h-4 w-4 text-green-500" />
                          <span className="font-medium">Infrastructure</span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Data Center Costs</span>
                            <span className="font-medium">{formatCurrency(35000)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Network Equipment</span>
                            <span className="font-medium">{formatCurrency(28500)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Fiber Maintenance</span>
                            <span className="font-medium">{formatCurrency(26000)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <UserCheck className="h-4 w-4 text-purple-500" />
                          <span className="font-medium">Personnel</span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Network Engineers</span>
                            <span className="font-medium">{formatCurrency(45000)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Support Staff</span>
                            <span className="font-medium">{formatCurrency(23200)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Field Technicians</span>
                            <span className="font-medium">{formatCurrency(10000)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Shield className="h-4 w-4 text-red-500" />
                          <span className="font-medium">Regulatory & Compliance</span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>ISP Licensing Fees</span>
                            <span className="font-medium">{formatCurrency(18000)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Regulatory Compliance</span>
                            <span className="font-medium">{formatCurrency(12600)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Insurance & Legal</span>
                            <span className="font-medium">{formatCurrency(5000)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Expense Records Table */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Recent Expense Records</CardTitle>
                    <CardDescription>Detailed expense transactions and records</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Vendor</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {expenseRecords.map((expense) => (
                          <TableRow key={expense.id}>
                            <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <div className="font-medium">{expense.description}</div>
                              <div className="text-sm text-muted-foreground">{expense.paymentMethod}</div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{expense.category}</Badge>
                            </TableCell>
                            <TableCell>{expense.vendor}</TableCell>
                            <TableCell className="text-right font-medium">{formatCurrency(expense.amount)}</TableCell>
                            <TableCell>{getStatusBadge(expense.status)}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem onClick={() => handleEditExpense(expense)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Expense
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  {expense.receiptUrl && (
                                    <DropdownMenuItem>
                                      <Download className="h-4 w-4 mr-2" />
                                      Download Receipt
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() => handleDeleteExpense(expense.id)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Expense
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

            {/* Invoicing Tab */}
            <TabsContent value="invoicing" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Invoice Summary */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Outstanding Invoices</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">{formatCurrency(8350)}</div>
                    <p className="text-xs text-muted-foreground">4 invoices pending</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Overdue Amount</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">{formatCurrency(3350)}</div>
                    <p className="text-xs text-muted-foreground">2 invoices overdue</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">98.5%</div>
                    <p className="text-xs text-muted-foreground">Last 12 months</p>
                  </CardContent>
                </Card>
              </div>

              {/* Outstanding Invoices Table */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Outstanding Invoices</CardTitle>
                    <CardDescription>Manage pending and overdue customer invoices</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                    <Button onClick={() => setIsInvoiceModalOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Invoice
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Invoice ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {outstandingInvoices.map((invoice) => (
                          <TableRow key={invoice.id}>
                            <TableCell className="font-medium">{invoice.id}</TableCell>
                            <TableCell>{invoice.customer}</TableCell>
                            <TableCell className="text-right">{formatCurrency(invoice.amount)}</TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span>{invoice.dueDate}</span>
                                {invoice.daysOverdue > 0 && (
                                  <span className="text-xs text-red-600">{invoice.daysOverdue} days overdue</span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Invoice
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Download className="h-4 w-4 mr-2" />
                                    Download PDF
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Send className="h-4 w-4 mr-2" />
                                    Send Reminder
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

              {/* Automated Billing Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Automated Billing Settings</CardTitle>
                  <CardDescription>Configure automatic invoice generation and payment processing</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Invoice Generation</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Auto-generate monthly invoices</span>
                          <Badge variant="default">Enabled</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Invoice due date</span>
                          <span className="text-sm font-medium">15 days</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Late payment fee</span>
                          <span className="text-sm font-medium">5%</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-medium">Payment Processing</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Auto-charge credit cards</span>
                          <Badge variant="default">Enabled</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">M-Pesa integration</span>
                          <Badge variant="default">Active</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Payment reminders</span>
                          <Badge variant="default">Enabled</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Taxes Tab */}
            <TabsContent value="taxes" className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-lg font-semibold">Tax Management</h3>
                  <p className="text-sm text-muted-foreground">Manage tax obligations and compliance</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Calculator className="w-4 h-4 mr-2" />
                    Tax Calculator
                  </Button>
                  <Button onClick={() => setIsTaxModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Record Tax
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* VAT Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>VAT Summary</CardTitle>
                    <CardDescription>Value Added Tax calculations and status</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-xl font-bold text-blue-600">{formatCurrency(taxData.vatCollected)}</div>
                        <div className="text-sm text-muted-foreground">VAT Collected</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-xl font-bold text-green-600">{formatCurrency(taxData.vatPaid)}</div>
                        <div className="text-sm text-muted-foreground">VAT Paid</div>
                      </div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{formatCurrency(taxData.netVatDue)}</div>
                      <div className="text-sm text-muted-foreground">Net VAT Due</div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm font-medium">Next Filing Date</span>
                      <div className="text-right">
                        <div className="text-sm font-bold">{taxData.nextFilingDate}</div>
                        <Badge variant="default">15 days remaining</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Other Tax Obligations */}
                <Card>
                  <CardHeader>
                    <CardTitle>Tax Obligations</CardTitle>
                    <CardDescription>Corporate and regulatory tax requirements</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">Corporate Income Tax</div>
                          <div className="text-sm text-muted-foreground">Annual filing required</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{formatCurrency(taxData.corporateIncomeTax)}</div>
                          <Badge variant="secondary">Due Q1 2024</Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">Service Tax</div>
                          <div className="text-sm text-muted-foreground">Telecommunications service tax</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{formatCurrency(taxData.serviceTax)}</div>
                          <Badge variant="default">Current</Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">Regulatory Fees</div>
                          <div className="text-sm text-muted-foreground">ISP licensing and compliance</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{formatCurrency(taxData.regulatoryFees)}</div>
                          <Badge variant="default">Paid</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Tax Records Table */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Tax Filing Records</CardTitle>
                    <CardDescription>Track tax payments and filing status</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tax Type</TableHead>
                          <TableHead>Period</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Penalty</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {taxRecords.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell className="font-medium">{record.type}</TableCell>
                            <TableCell>{record.period}</TableCell>
                            <TableCell className="text-right font-medium">{formatCurrency(record.amount)}</TableCell>
                            <TableCell>{record.dueDate}</TableCell>
                            <TableCell>{getStatusBadge(record.status)}</TableCell>
                            <TableCell className="text-right">
                              {record.penalty > 0 ? (
                                <span className="text-red-600 font-medium">{formatCurrency(record.penalty)}</span>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Download className="h-4 w-4 mr-2" />
                                    Download Return
                                  </DropdownMenuItem>
                                  {record.status === "Pending" && (
                                    <DropdownMenuItem>
                                      <Send className="h-4 w-4 mr-2" />
                                      File Return
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Record
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

              {/* Tax Compliance Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Tax Compliance Status</CardTitle>
                  <CardDescription>Overview of tax filing status and upcoming deadlines</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <div className="font-medium">VAT Returns</div>
                      <div className="text-sm text-muted-foreground">Up to date</div>
                      <Badge variant="default" className="mt-2">
                        Current
                      </Badge>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                      <div className="font-medium">Income Tax</div>
                      <div className="text-sm text-muted-foreground">Due in 45 days</div>
                      <Badge variant="secondary" className="mt-2">
                        Pending
                      </Badge>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                      <div className="font-medium">Service Tax</div>
                      <div className="text-sm text-muted-foreground">10 days overdue</div>
                      <Badge variant="destructive" className="mt-2">
                        Overdue
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Budget Tab */}
            <TabsContent value="budget" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Budget Overview */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Budget Overview</CardTitle>
                      <CardDescription>Current year budget performance</CardDescription>
                    </div>
                    <Button variant="outline" onClick={() => setIsBudgetModalOpen(true)}>
                      <Settings className="w-4 h-4 mr-2" />
                      Manage Budget
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {budgetData.map((item, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{item.category}</span>
                            <div className="text-right">
                              <div className="text-sm font-bold">{formatCurrency(item.actual)}</div>
                              <div className={`text-xs ${getVarianceColor(item.variance)}`}>
                                {formatPercentage(item.variance)} vs budget
                              </div>
                            </div>
                          </div>
                          <Progress value={(item.actual / item.budgeted) * 100} className="h-2" />
                          <div className="text-xs text-muted-foreground">
                            Budget: {formatCurrency(item.budgeted)} • Variance:{" "}
                            {formatCurrency(item.actual - item.budgeted)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Budget Alerts */}
                <Card>
                  <CardHeader>
                    <CardTitle>Budget Alerts</CardTitle>
                    <CardDescription>Items requiring attention</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 p-3 border border-red-200 rounded-lg bg-red-50">
                        <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                        <div>
                          <div className="font-medium text-red-900">Marketing Budget Exceeded</div>
                          <div className="text-sm text-red-700">
                            Marketing expenses are 20.3% over budget. Review spending and adjust allocations.
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 border border-orange-200 rounded-lg bg-orange-50">
                        <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                        <div>
                          <div className="font-medium text-orange-900">Infrastructure Costs Rising</div>
                          <div className="text-sm text-orange-700">
                            Infrastructure expenses are 5.3% over budget due to equipment upgrades.
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 border border-green-200 rounded-lg bg-green-50">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <div className="font-medium text-green-900">Personnel Costs Under Budget</div>
                          <div className="text-sm text-green-700">
                            Personnel expenses are 2.3% under budget, providing cost savings opportunity.
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Budget Forecasting */}
              <Card>
                <CardHeader>
                  <CardTitle>Budget Forecasting</CardTitle>
                  <CardDescription>Projected budget performance for the remainder of the year</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-xl font-bold">{formatCurrency(2850000)}</div>
                      <div className="text-sm text-muted-foreground">Projected Annual Revenue</div>
                      <div className="text-xs text-green-600 mt-1">+5.2% vs budget</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-xl font-bold">{formatCurrency(1245000)}</div>
                      <div className="text-sm text-muted-foreground">Projected Annual Expenses</div>
                      <div className="text-xs text-red-600 mt-1">+3.8% vs budget</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-xl font-bold">{formatCurrency(1605000)}</div>
                      <div className="text-sm text-muted-foreground">Projected Net Profit</div>
                      <div className="text-xs text-green-600 mt-1">+6.1% vs budget</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-xl font-bold">94.2%</div>
                      <div className="text-sm text-muted-foreground">Forecast Accuracy</div>
                      <div className="text-xs text-muted-foreground">Historical average</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}

      {/* Create Expense Modal */}
      <Dialog open={isExpenseModalOpen} onOpenChange={setIsExpenseModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Expense</DialogTitle>
            <DialogDescription>Add a new expense record to track business costs</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Expense Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bandwidth">Bandwidth & Connectivity</SelectItem>
                    <SelectItem value="infrastructure">Infrastructure & Equipment</SelectItem>
                    <SelectItem value="personnel">Personnel Costs</SelectItem>
                    <SelectItem value="regulatory">Regulatory & Compliance</SelectItem>
                    <SelectItem value="marketing">Marketing & Sales</SelectItem>
                    <SelectItem value="other">Other Operating Expenses</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Amount</Label>
                <Input type="number" placeholder="0.00" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input placeholder="Brief description of the expense" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Vendor/Supplier</Label>
                <Input placeholder="Vendor name" />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                    <SelectItem value="mpesa">M-Pesa</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select defaultValue="paid">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea placeholder="Additional notes or comments" rows={3} />
            </div>
            <div className="space-y-2">
              <Label>Receipt/Document</Label>
              <div className="flex items-center gap-2">
                <Input type="file" accept=".pdf,.jpg,.jpeg,.png" />
                <Button type="button" variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExpenseModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateExpense}>Create Expense</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Tax Record Modal */}
      <Dialog open={isTaxModalOpen} onOpenChange={setIsTaxModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Record Tax Obligation</DialogTitle>
            <DialogDescription>Add a new tax payment or filing record</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tax Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tax type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vat">VAT Return</SelectItem>
                    <SelectItem value="income">Corporate Income Tax</SelectItem>
                    <SelectItem value="service">Service Tax</SelectItem>
                    <SelectItem value="regulatory">Regulatory Fees</SelectItem>
                    <SelectItem value="paye">PAYE</SelectItem>
                    <SelectItem value="other">Other Tax</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tax Period</Label>
                <Input placeholder="e.g., January 2024, Q1 2024" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Amount</Label>
                <Input type="number" placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input type="date" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="filed">Filed</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Penalty (if any)</Label>
                <Input type="number" placeholder="0.00" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Tax Authority</Label>
              <Input placeholder="e.g., Kenya Revenue Authority (KRA)" />
            </div>
            <div className="space-y-2">
              <Label>Reference Number</Label>
              <Input placeholder="Tax authority reference or receipt number" />
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea placeholder="Additional notes or details" rows={3} />
            </div>
            <div className="space-y-2">
              <Label>Supporting Documents</Label>
              <div className="flex items-center gap-2">
                <Input type="file" accept=".pdf,.jpg,.jpeg,.png" multiple />
                <Button type="button" variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTaxModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTaxRecord}>Record Tax</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Expense Modal */}
      <Dialog open={isExpenseEditModalOpen} onOpenChange={setIsExpenseEditModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
            <DialogDescription>Update expense record details</DialogDescription>
          </DialogHeader>
          {selectedExpense && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Expense Category</Label>
                  <Select defaultValue={selectedExpense.category}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bandwidth & Connectivity">Bandwidth & Connectivity</SelectItem>
                      <SelectItem value="Infrastructure & Equipment">Infrastructure & Equipment</SelectItem>
                      <SelectItem value="Personnel Costs">Personnel Costs</SelectItem>
                      <SelectItem value="Regulatory & Compliance">Regulatory & Compliance</SelectItem>
                      <SelectItem value="Marketing & Sales">Marketing & Sales</SelectItem>
                      <SelectItem value="Other Operating Expenses">Other Operating Expenses</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Amount</Label>
                  <Input type="number" defaultValue={selectedExpense.amount} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input defaultValue={selectedExpense.description} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Vendor/Supplier</Label>
                  <Input defaultValue={selectedExpense.vendor} />
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" defaultValue={selectedExpense.date} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <Select defaultValue={selectedExpense.paymentMethod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                      <SelectItem value="M-Pesa">M-Pesa</SelectItem>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Credit Card">Credit Card</SelectItem>
                      <SelectItem value="Cheque">Cheque</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select defaultValue={selectedExpense.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Paid">Paid</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExpenseEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsExpenseEditModalOpen(false)}>Update Expense</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Other existing modals (Invoice, Budget, Report) remain the same... */}
    </div>
  )
}
