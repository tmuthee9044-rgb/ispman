"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Download,
  Search,
  Filter,
  CreditCard,
  Smartphone,
  Building2,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

// Sample payments data
const payments = [
  {
    id: "PAY-001",
    customer: "John Doe",
    amount: 2500,
    method: "M-Pesa",
    reference: "QA12B3C4D5",
    status: "completed",
    date: "2024-02-15",
    time: "14:30",
    invoice: "INV-001",
    plan: "Premium 50Mbps",
  },
  {
    id: "PAY-002",
    customer: "Jane Smith",
    amount: 1800,
    method: "Bank Transfer",
    reference: "BT789456123",
    status: "completed",
    date: "2024-02-14",
    time: "09:15",
    invoice: "INV-002",
    plan: "Standard 25Mbps",
  },
  {
    id: "PAY-003",
    customer: "Tech Solutions Ltd",
    amount: 5000,
    method: "Credit Card",
    reference: "CC4532****1234",
    status: "pending",
    date: "2024-02-14",
    time: "16:45",
    invoice: "INV-003",
    plan: "Business 100Mbps",
  },
  {
    id: "PAY-004",
    customer: "Mary Johnson",
    amount: 1200,
    method: "M-Pesa",
    reference: "QA98Z7Y6X5",
    status: "failed",
    date: "2024-02-13",
    time: "11:20",
    invoice: "INV-004",
    plan: "Basic 10Mbps",
  },
  {
    id: "PAY-005",
    customer: "David Wilson",
    amount: 3200,
    method: "Bank Transfer",
    reference: "BT456789012",
    status: "completed",
    date: "2024-02-13",
    time: "08:30",
    invoice: "INV-005",
    plan: "Premium 75Mbps",
  },
  {
    id: "PAY-006",
    customer: "Sarah Brown",
    amount: 1500,
    method: "M-Pesa",
    reference: "QA55T4R3E2",
    status: "completed",
    date: "2024-02-12",
    time: "13:45",
    invoice: "INV-006",
    plan: "Standard 30Mbps",
  },
]

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterMethod, setFilterMethod] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const { toast } = useToast()

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesMethod = filterMethod === "all" || payment.method === filterMethod
    const matchesStatus = filterStatus === "all" || payment.status === filterStatus

    return matchesSearch && matchesMethod && matchesStatus
  })

  const totalPayments = payments.reduce(
    (sum, payment) => (payment.status === "completed" ? sum + payment.amount : sum),
    0,
  )
  const completedPayments = payments.filter((p) => p.status === "completed").length
  const pendingPayments = payments.filter((p) => p.status === "pending").length
  const failedPayments = payments.filter((p) => p.status === "failed").length

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case "M-Pesa":
        return <Smartphone className="h-4 w-4" />
      case "Credit Card":
        return <CreditCard className="h-4 w-4" />
      case "Bank Transfer":
        return <Building2 className="h-4 w-4" />
      default:
        return <CreditCard className="h-4 w-4" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Payments report is being generated...",
    })
  }

  const handleRetryPayment = (paymentId: string, customer: string) => {
    toast({
      title: "Payment Retry Initiated",
      description: `Retrying payment ${paymentId} for ${customer}`,
    })
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <Link href="/billing">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Billing
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Payment History</h2>
            <p className="text-muted-foreground">Track and manage all customer payments</p>
          </div>
        </div>
        <Button onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Received</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KSh {totalPayments.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{completedPayments} completed payments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingPayments}</div>
            <p className="text-xs text-muted-foreground">awaiting confirmation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{failedPayments}</div>
            <p className="text-xs text-muted-foreground">require attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round((completedPayments / payments.length) * 100)}%</div>
            <p className="text-xs text-muted-foreground">payment success rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers, references, or payment IDs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={filterMethod} onValueChange={setFilterMethod}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Payment method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Methods</SelectItem>
            <SelectItem value="M-Pesa">M-Pesa</SelectItem>
            <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
            <SelectItem value="Credit Card">Credit Card</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Transactions ({filteredPayments.length})</CardTitle>
          <CardDescription>Complete history of all payment transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="hidden md:table-cell">Reference</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Date & Time</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{payment.customer}</div>
                        <div className="text-sm text-muted-foreground">{payment.plan}</div>
                      </div>
                    </TableCell>
                    <TableCell>KSh {payment.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getPaymentIcon(payment.method)}
                        <span className="hidden sm:inline">{payment.method}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell font-mono text-sm">{payment.reference}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(payment.status)}
                        <Badge
                          variant={
                            payment.status === "completed"
                              ? "default"
                              : payment.status === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {payment.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div>
                        <div>{payment.date}</div>
                        <div className="text-sm text-muted-foreground">{payment.time}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {payment.status === "failed" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRetryPayment(payment.id, payment.customer)}
                        >
                          Retry
                        </Button>
                      )}
                      {payment.status === "completed" && (
                        <Button size="sm" variant="ghost">
                          Receipt
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
