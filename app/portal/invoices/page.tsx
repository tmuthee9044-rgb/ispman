'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { Search, Download, Mail, Printer, CalendarIcon, CreditCard, AlertTriangle, FileText, DollarSign, Clock, CheckCircle } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from "@/lib/utils"

interface Invoice {
  id: string
  number: string
  date: string
  dueDate: string
  amount: number
  status: 'paid' | 'pending' | 'overdue'
  description: string
  items: {
    description: string
    quantity: number
    rate: number
    amount: number
  }[]
  vatAmount: number
  totalAmount: number
  paidDate?: string
  paymentMethod?: string
}

// Sample invoice data
const sampleInvoices: Invoice[] = [
  {
    id: '1',
    number: 'INV-2024-001',
    date: '2024-01-01',
    dueDate: '2024-01-31',
    amount: 5500,
    status: 'paid',
    description: 'Monthly Internet Service - January 2024',
    items: [
      { description: 'Fiber Internet 100Mbps', quantity: 1, rate: 4500, amount: 4500 },
      { description: 'Static IP Address', quantity: 1, rate: 500, amount: 500 },
      { description: 'Technical Support', quantity: 1, rate: 300, amount: 300 }
    ],
    vatAmount: 880,
    totalAmount: 6380,
    paidDate: '2024-01-15',
    paymentMethod: 'M-Pesa'
  },
  {
    id: '2',
    number: 'INV-2024-002',
    date: '2024-02-01',
    dueDate: '2024-02-29',
    amount: 5500,
    status: 'paid',
    description: 'Monthly Internet Service - February 2024',
    items: [
      { description: 'Fiber Internet 100Mbps', quantity: 1, rate: 4500, amount: 4500 },
      { description: 'Static IP Address', quantity: 1, rate: 500, amount: 500 },
      { description: 'Technical Support', quantity: 1, rate: 300, amount: 300 }
    ],
    vatAmount: 880,
    totalAmount: 6380,
    paidDate: '2024-02-20',
    paymentMethod: 'Bank Transfer'
  },
  {
    id: '3',
    number: 'INV-2024-003',
    date: '2024-03-01',
    dueDate: '2024-03-31',
    amount: 5500,
    status: 'pending',
    description: 'Monthly Internet Service - March 2024',
    items: [
      { description: 'Fiber Internet 100Mbps', quantity: 1, rate: 4500, amount: 4500 },
      { description: 'Static IP Address', quantity: 1, rate: 500, amount: 500 },
      { description: 'Technical Support', quantity: 1, rate: 300, amount: 300 }
    ],
    vatAmount: 880,
    totalAmount: 6380
  },
  {
    id: '4',
    number: 'INV-2024-004',
    date: '2024-04-01',
    dueDate: '2024-04-30',
    amount: 5500,
    status: 'overdue',
    description: 'Monthly Internet Service - April 2024',
    items: [
      { description: 'Fiber Internet 100Mbps', quantity: 1, rate: 4500, amount: 4500 },
      { description: 'Static IP Address', quantity: 1, rate: 500, amount: 500 },
      { description: 'Technical Support', quantity: 1, rate: 300, amount: 300 }
    ],
    vatAmount: 880,
    totalAmount: 6380
  }
]

function InvoicesContent() {
  const searchParams = useSearchParams()
  const [invoices, setInvoices] = useState<Invoice[]>(sampleInvoices)
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>(sampleInvoices)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})

  // Calculate summary statistics
  const totalPaid = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.totalAmount, 0)
  const totalPending = invoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.totalAmount, 0)
  const totalOverdue = invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.totalAmount, 0)
  const totalAmount = totalPaid + totalPending + totalOverdue

  // Filter and sort invoices
  useEffect(() => {
    let filtered = invoices.filter(invoice => {
      const matchesSearch = invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           invoice.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter
      const matchesDateRange = !dateRange.from || !dateRange.to || 
                              (new Date(invoice.date) >= dateRange.from && new Date(invoice.date) <= dateRange.to)
      
      return matchesSearch && matchesStatus && matchesDateRange
    })

    // Sort invoices
    filtered.sort((a, b) => {
      let aValue: any, bValue: any
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.date)
          bValue = new Date(b.date)
          break
        case 'amount':
          aValue = a.totalAmount
          bValue = b.totalAmount
          break
        case 'status':
          aValue = a.status
          bValue = b.status
          break
        default:
          aValue = a.date
          bValue = b.date
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredInvoices(filtered)
  }, [invoices, searchTerm, statusFilter, sortBy, sortOrder, dateRange])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle className="w-3 h-3 mr-1" />Paid</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"><Clock className="w-3 h-3 mr-1" />Pending</Badge>
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100"><AlertTriangle className="w-3 h-3 mr-1" />Overdue</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handlePayment = (invoice: Invoice) => {
    // In a real app, this would integrate with payment processing
    console.log('Processing payment for invoice:', invoice.number)
    // For demo purposes, mark as paid
    setInvoices(prev => prev.map(inv => 
      inv.id === invoice.id 
        ? { ...inv, status: 'paid' as const, paidDate: new Date().toISOString().split('T')[0], paymentMethod: 'Online Payment' }
        : inv
    ))
  }

  const downloadInvoice = (invoice: Invoice) => {
    // In a real app, this would generate and download a PDF
    console.log('Downloading invoice:', invoice.number)
  }

  const emailInvoice = (invoice: Invoice) => {
    // In a real app, this would send the invoice via email
    console.log('Emailing invoice:', invoice.number)
  }

  const printInvoice = (invoice: Invoice) => {
    // In a real app, this would open print dialog
    console.log('Printing invoice:', invoice.number)
    window.print()
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Invoices</h1>
        <p className="text-muted-foreground">View and manage your billing invoices</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES {totalAmount.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">KES {totalPaid.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-600">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">KES {totalPending.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">KES {totalOverdue.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-40">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Date Range
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
              const [field, order] = value.split('-')
              setSortBy(field)
              setSortOrder(order as 'asc' | 'desc')
            }}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Date (New)</SelectItem>
                <SelectItem value="date-asc">Date (Old)</SelectItem>
                <SelectItem value="amount-desc">Amount (High)</SelectItem>
                <SelectItem value="amount-asc">Amount (Low)</SelectItem>
                <SelectItem value="status-asc">Status (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList>
          <TabsTrigger value="all">All ({invoices.length})</TabsTrigger>
          <TabsTrigger value="paid">Paid ({invoices.filter(i => i.status === 'paid').length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({invoices.filter(i => i.status === 'pending').length})</TabsTrigger>
          <TabsTrigger value="overdue">Overdue ({invoices.filter(i => i.status === 'overdue').length})</TabsTrigger>
        </TabsList>

        <TabsContent value={statusFilter} className="space-y-4">
          {filteredInvoices.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No invoices found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{invoice.number}</div>
                            <div className="text-sm text-muted-foreground">{invoice.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>{format(new Date(invoice.date), 'MMM dd, yyyy')}</TableCell>
                        <TableCell>
                          <div className={cn(
                            format(new Date(invoice.dueDate), 'MMM dd, yyyy'),
                            invoice.status === 'overdue' && 'text-red-600 font-medium'
                          )}>
                            {format(new Date(invoice.dueDate), 'MMM dd, yyyy')}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">KES {invoice.totalAmount.toLocaleString()}</TableCell>
                        <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setSelectedInvoice(invoice)}>
                                  View
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Invoice {selectedInvoice?.number}</DialogTitle>
                                </DialogHeader>
                                {selectedInvoice && (
                                  <div className="space-y-6">
                                    {/* Invoice Header */}
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <h2 className="text-2xl font-bold">TechConnect ISP</h2>
                                        <p className="text-muted-foreground">Enterprise Internet Solutions</p>
                                        <p className="text-sm text-muted-foreground mt-2">
                                          123 Business District<br />
                                          Nairobi, Kenya<br />
                                          +254 700 123 456
                                        </p>
                                      </div>
                                      <div className="text-right">
                                        <h3 className="text-xl font-semibold">INVOICE</h3>
                                        <p className="text-muted-foreground">{selectedInvoice.number}</p>
                                        <div className="mt-2">
                                          {getStatusBadge(selectedInvoice.status)}
                                        </div>
                                      </div>
                                    </div>

                                    <Separator />

                                    {/* Invoice Details */}
                                    <div className="grid grid-cols-2 gap-8">
                                      <div>
                                        <h4 className="font-semibold mb-2">Bill To:</h4>
                                        <p className="text-muted-foreground">
                                          John Doe<br />
                                          john.doe@example.com<br />
                                          +254 700 987 654<br />
                                          456 Customer Street<br />
                                          Nairobi, Kenya
                                        </p>
                                      </div>
                                      <div>
                                        <div className="space-y-2">
                                          <div className="flex justify-between">
                                            <span className="text-muted-foreground">Invoice Date:</span>
                                            <span>{format(new Date(selectedInvoice.date), 'MMM dd, yyyy')}</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-muted-foreground">Due Date:</span>
                                            <span>{format(new Date(selectedInvoice.dueDate), 'MMM dd, yyyy')}</span>
                                          </div>
                                          {selectedInvoice.paidDate && (
                                            <div className="flex justify-between">
                                              <span className="text-muted-foreground">Paid Date:</span>
                                              <span className="text-green-600">{format(new Date(selectedInvoice.paidDate), 'MMM dd, yyyy')}</span>
                                            </div>
                                          )}
                                          {selectedInvoice.paymentMethod && (
                                            <div className="flex justify-between">
                                              <span className="text-muted-foreground">Payment Method:</span>
                                              <span>{selectedInvoice.paymentMethod}</span>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>

                                    <Separator />

                                    {/* Invoice Items */}
                                    <div>
                                      <Table>
                                        <TableHeader>
                                          <TableRow>
                                            <TableHead>Description</TableHead>
                                            <TableHead className="text-center">Qty</TableHead>
                                            <TableHead className="text-right">Rate</TableHead>
                                            <TableHead className="text-right">Amount</TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {selectedInvoice.items.map((item, index) => (
                                            <TableRow key={index}>
                                              <TableCell>{item.description}</TableCell>
                                              <TableCell className="text-center">{item.quantity}</TableCell>
                                              <TableCell className="text-right">KES {item.rate.toLocaleString()}</TableCell>
                                              <TableCell className="text-right">KES {item.amount.toLocaleString()}</TableCell>
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                      </Table>
                                    </div>

                                    <Separator />

                                    {/* Invoice Totals */}
                                    <div className="flex justify-end">
                                      <div className="w-64 space-y-2">
                                        <div className="flex justify-between">
                                          <span>Subtotal:</span>
                                          <span>KES {selectedInvoice.amount.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>VAT (16%):</span>
                                          <span>KES {selectedInvoice.vatAmount.toLocaleString()}</span>
                                        </div>
                                        <Separator />
                                        <div className="flex justify-between font-semibold text-lg">
                                          <span>Total:</span>
                                          <span>KES {selectedInvoice.totalAmount.toLocaleString()}</span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex justify-between pt-4">
                                      <div className="flex gap-2">
                                        <Button variant="outline" onClick={() => downloadInvoice(selectedInvoice)}>
                                          <Download className="w-4 h-4 mr-2" />
                                          Download PDF
                                        </Button>
                                        <Button variant="outline" onClick={() => emailInvoice(selectedInvoice)}>
                                          <Mail className="w-4 h-4 mr-2" />
                                          Email
                                        </Button>
                                        <Button variant="outline" onClick={() => printInvoice(selectedInvoice)}>
                                          <Printer className="w-4 h-4 mr-2" />
                                          Print
                                        </Button>
                                      </div>
                                      {selectedInvoice.status !== 'paid' && (
                                        <Button onClick={() => handlePayment(selectedInvoice)}>
                                          <CreditCard className="w-4 h-4 mr-2" />
                                          Pay Now
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            {invoice.status !== 'paid' && (
                              <Button size="sm" onClick={() => handlePayment(invoice)}>
                                Pay Now
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Overdue Alert */}
      {totalOverdue > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <h4 className="font-semibold text-red-800">Overdue Payment Alert</h4>
                <p className="text-red-700">
                  You have KES {totalOverdue.toLocaleString()} in overdue payments. Please settle these invoices to avoid service interruption.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function InvoicesPage() {
  return (
    <Suspense fallback={<div>Loading invoices...</div>}>
      <InvoicesContent />
    </Suspense>
  )
}
