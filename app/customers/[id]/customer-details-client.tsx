"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { AddServiceModal } from "@/components/add-service-modal"
import { PaymentModal } from "@/components/payment-modal"
import { EditCustomerModal } from "@/components/edit-customer-modal"
import { SendMessageModal } from "@/components/send-message-modal"
import { CreateTicketModal } from "@/components/create-ticket-modal"
import { UsageChart } from "@/components/usage-chart"
import { FinanceSettingsModal } from "@/components/finance-settings-modal"
import { LiveSpeedMonitor } from "@/components/live-speed-monitor"
import { User, Mail, Phone, MapPin, Calendar, DollarSign, Wifi, Router, Shield, CreditCard, Plus, Settings, MessageSquare, HeadphonesIcon, Edit, Trash2, Pause, Globe, Activity, Send, FileText, Download, Eye, BarChart3, TrendingUp, Clock, CheckCircle, Filter, MoreHorizontal, Smartphone, AtSign, History, BookOpen, HelpCircle, Zap, Save, X, Building, Hash, Key, Network, Laptop, UserCheck, AlertCircle, Info, ExternalLink } from 'lucide-react'

interface Customer {
  id: number
  name: string
  email: string
  phone: string
  address: string
  status: "active" | "inactive" | "suspended"
  service_plan: string
  monthly_fee: number
  created_at: string
  updated_at: string
  connection_type: string
  router_ip: string
  mac_address: string
  installation_date: string
  last_payment: string
  balance: number
  notes: string
  portal_login_id: string
  portal_username: string
  portal_password: string
  router_allocated?: string
  ip_allocated?: string
  customer_type: "individual" | "business" | "government"
  payment_method: string
  auto_payment: boolean
}

interface CustomerDetailsClientProps {
  customer: Customer
}

export function CustomerDetailsClient({ customer }: CustomerDetailsClientProps) {
  const [showAddServiceModal, setShowAddServiceModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showEditCustomerModal, setShowEditCustomerModal] = useState(false)
  const [showSendMessageModal, setShowSendMessageModal] = useState(false)
  const [showCreateTicketModal, setShowCreateTicketModal] = useState(false)
  const [showFinanceSettingsModal, setShowFinanceSettingsModal] = useState(false)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<Record<string, any>>({})

  // Mock data - in production this would come from the database
  const services = [
    {
      id: 1,
      name: "Premium Internet 100Mbps",
      type: "Internet",
      status: "active",
      monthly_fee: 79.99,
      start_date: "2024-01-01",
      end_date: "2024-02-01",
      next_billing: "2024-02-15",
      days_remaining: 15,
      auto_renew: true,
      speed_down: 100,
      speed_up: 25,
      data_usage: 450.5,
      data_limit: null,
      ip_address: "192.168.1.100",
      router: "Edge Router 1",
      connection_type: "Fiber",
    },
  ]

  const communications = [
    {
      id: 1,
      type: "email",
      subject: "Service Installation Confirmation",
      content: "Your internet service has been successfully installed.",
      sent_at: "2024-01-15 10:30:00",
      status: "delivered",
    },
    {
      id: 2,
      type: "sms",
      subject: "Payment Reminder",
      content: "Your monthly payment of $79.99 is due in 3 days.",
      sent_at: "2024-01-12 14:20:00",
      status: "delivered",
    },
  ]

  const payments = [
    {
      id: 1,
      amount: 79.99,
      method: "mpesa",
      reference: "MPX123456789",
      status: "completed",
      created_at: "2024-01-01",
      description: "Monthly service payment",
    },
    {
      id: 2,
      amount: 159.98,
      method: "bank",
      reference: "BNK987654321",
      status: "completed",
      created_at: "2023-12-01",
      description: "Advance payment (2 months)",
    },
  ]

  const invoices = [
    {
      id: 1,
      amount: 79.99,
      status: "paid",
      due_date: "2024-02-01",
      created_at: "2024-01-01",
      paid_at: "2024-01-01",
    },
    {
      id: 2,
      amount: 79.99,
      status: "pending",
      due_date: "2024-03-01",
      created_at: "2024-02-01",
      paid_at: null,
    },
  ]

  const supportTickets = [
    {
      id: 1,
      title: "Slow internet connection",
      status: "resolved",
      priority: "medium",
      created_at: "2024-01-10",
      updated_at: "2024-01-12",
      description: "Customer reporting slow speeds during peak hours",
    },
    {
      id: 2,
      title: "Router configuration help",
      status: "open",
      priority: "low",
      created_at: "2024-01-14",
      updated_at: "2024-01-14",
      description: "Customer needs help configuring WiFi settings",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "suspended":
        return "bg-yellow-500"
      case "inactive":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
      case "suspended":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Suspended</Badge>
      case "inactive":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Inactive</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
      case "low":
        return <Badge className="bg-blue-100 text-blue-800">Low</Badge>
      default:
        return <Badge variant="secondary">{priority}</Badge>
    }
  }

  const handleInlineEdit = (field: string, value: any) => {
    setEditingField(field)
    setEditValues({ ...editValues, [field]: value })
  }

  const handleSaveField = async (field: string) => {
    // In production, this would make an API call to update the customer
    console.log(`Updating ${field} to:`, editValues[field])

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    setEditingField(null)
    // Here you would update the customer data in state/context
  }

  const handleCancelEdit = () => {
    setEditingField(null)
    setEditValues({})
  }

  const InlineEditField = ({
    field,
    value,
    type = "text",
    options = [],
    multiline = false,
    icon: Icon,
  }: {
    field: string
    value: any
    type?: "text" | "email" | "tel" | "select" | "checkbox"
    options?: { value: string; label: string }[]
    multiline?: boolean
    icon?: any
  }) => {
    const isEditing = editingField === field
    const editValue = editValues[field] !== undefined ? editValues[field] : value

    if (isEditing) {
      return (
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
          <div className="flex-1">
            {type === "select" ? (
              <Select value={editValue} onValueChange={(val) => setEditValues({ ...editValues, [field]: val })}>
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : type === "checkbox" ? (
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={editValue}
                  onCheckedChange={(checked) => setEditValues({ ...editValues, [field]: checked })}
                />
                <span className="text-sm">{editValue ? "Enabled" : "Disabled"}</span>
              </div>
            ) : multiline ? (
              <Textarea
                value={editValue}
                onChange={(e) => setEditValues({ ...editValues, [field]: e.target.value })}
                className="min-h-[60px]"
              />
            ) : (
              <Input
                type={type}
                value={editValue}
                onChange={(e) => setEditValues({ ...editValues, [field]: e.target.value })}
                className="h-8"
              />
            )}
          </div>
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" onClick={() => handleSaveField(field)}>
              <Save className="w-3 h-3" />
            </Button>
            <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
      )
    }

    return (
      <div className="flex items-center justify-between group">
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
          <div>
            <div className="text-sm text-muted-foreground capitalize">{field.replace("_", " ")}</div>
            <div className="font-medium">
              {type === "checkbox" ? (
                <span className={value ? "text-green-600" : "text-gray-600"}>{value ? "Enabled" : "Disabled"}</span>
              ) : type === "select" ? (
                <span className="capitalize">{value}</span>
              ) : (
                value || "Not set"
              )}
            </div>
          </div>
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => handleInlineEdit(field, value)}
        >
          <Edit className="w-3 h-3" />
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        {/* Customer Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{customer.name}</h1>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <span>Customer ID: {customer.id}</span>
                <Separator orientation="vertical" className="h-4" />
                <Badge variant="outline" className="capitalize">
                  {customer.customer_type}
                </Badge>
                {getStatusBadge(customer.status)}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSendMessageModal(true)}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Send Message
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCreateTicketModal(true)}
            >
              <AlertCircle className="w-4 h-4 mr-2" />
              Create Ticket
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPaymentModal(true)}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Record Payment
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('/portal/login', '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Portal Access
            </Button>
            <Button onClick={() => setShowEditCustomerModal(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Customer
            </Button>
          </div>
        </div>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="flex items-center p-4">
              <Mail className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium text-sm">{customer.email}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-4">
              <Phone className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{customer.phone}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-4">
              <Calendar className="w-8 h-8 text-purple-500 mr-3" />
              <div>
                <p className="text-sm text-muted-foreground">Joined</p>
                <p className="font-medium">{new Date(customer.created_at).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-4">
              <DollarSign className="w-8 h-8 text-orange-500 mr-3" />
              <div>
                <p className="text-sm text-muted-foreground">Balance</p>
                <p className={`font-medium ${customer.balance < 0 ? "text-red-600" : "text-green-600"}`}>
                  ${customer.balance.toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="services" className="space-y-4">
          <TabsList>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="information">Information</TabsTrigger>
            <TabsTrigger value="communications">Communications</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
            <TabsTrigger value="finance">Finance</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Customer Services</CardTitle>
                    <CardDescription>
                      Manage services for this customer. Total monthly cost: $
                      {services.reduce((sum, service) => sum + service.monthly_fee, 0).toFixed(2)}
                    </CardDescription>
                  </div>
                  <Button onClick={() => setShowAddServiceModal(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Service
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {services.length > 0 ? (
                  <div className="space-y-4">
                    {services.map((service) => (
                      <Card key={service.id} className="border-l-4 border-l-primary">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <Wifi className="w-5 h-5 text-primary" />
                                <h3 className="font-semibold text-lg">{service.name}</h3>
                                {getStatusBadge(service.status)}
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <span className="text-muted-foreground">Monthly Fee:</span>
                                  <div className="font-medium">${service.monthly_fee}</div>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Next Billing:</span>
                                  <div className="font-medium">{service.next_billing}</div>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">IP Address:</span>
                                  <div className="font-medium">{service.ip_address}</div>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Router:</span>
                                  <div className="font-medium">{service.router}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                  <Router className="w-4 h-4 text-muted-foreground" />
                                  <span>{service.connection_type}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4 text-muted-foreground" />
                                  <span>{service.days_remaining} days remaining</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Activity className="w-4 h-4 text-muted-foreground" />
                                  <span>
                                    {service.speed_down}Mbps / {service.speed_up}Mbps
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Settings className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Pause className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Wifi className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Services</h3>
                    <p className="text-muted-foreground mb-4">This customer doesn't have any active services yet.</p>
                    <Button onClick={() => setShowAddServiceModal(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Service
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="information" className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold">Customer Information</h3>
                <p className="text-sm text-muted-foreground">
                  Complete customer details as entered during registration. Click any field to edit inline.
                </p>
              </div>
              <Button onClick={() => setShowEditCustomerModal(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit All Information
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>Basic customer details and contact information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <InlineEditField field="name" value={customer.name} icon={User} />
                  <InlineEditField field="email" value={customer.email} type="email" icon={Mail} />
                  <InlineEditField field="phone" value={customer.phone} type="tel" icon={Phone} />
                  <InlineEditField field="address" value={customer.address} multiline icon={MapPin} />
                  <InlineEditField
                    field="customer_type"
                    value={customer.customer_type}
                    type="select"
                    options={[
                      { value: "individual", label: "Individual" },
                      { value: "business", label: "Business" },
                      { value: "government", label: "Government" },
                    ]}
                    icon={Building}
                  />
                </CardContent>
              </Card>

              {/* Account Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="w-5 h-5" />
                    Account Information
                  </CardTitle>
                  <CardDescription>Account status and registration details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Hash className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Customer ID</div>
                      <div className="font-medium">{customer.id}</div>
                    </div>
                  </div>
                  <InlineEditField
                    field="status"
                    value={customer.status}
                    type="select"
                    options={[
                      { value: "active", label: "Active" },
                      { value: "inactive", label: "Inactive" },
                      { value: "suspended", label: "Suspended" },
                    ]}
                    icon={AlertCircle}
                  />
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Registration Date</div>
                      <div className="font-medium">{new Date(customer.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Installation Date</div>
                      <div className="font-medium">{customer.installation_date}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Last Updated</div>
                      <div className="font-medium">{new Date(customer.updated_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Information
                  </CardTitle>
                  <CardDescription>Payment preferences and billing details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <InlineEditField
                    field="payment_method"
                    value={customer.payment_method}
                    type="select"
                    options={[
                      { value: "mpesa", label: "M-Pesa" },
                      { value: "bank", label: "Bank Transfer" },
                      { value: "cash", label: "Cash" },
                      { value: "card", label: "Credit/Debit Card" },
                    ]}
                    icon={CreditCard}
                  />
                  <InlineEditField
                    field="auto_payment"
                    value={customer.auto_payment}
                    type="checkbox"
                    icon={CheckCircle}
                  />
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Current Balance</div>
                      <div className={`font-medium ${customer.balance < 0 ? "text-red-600" : "text-green-600"}`}>
                        ${customer.balance.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Last Payment</div>
                      <div className="font-medium">{customer.last_payment}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Technical Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Network className="w-5 h-5" />
                    Technical Information
                  </CardTitle>
                  <CardDescription>Network configuration and technical details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <InlineEditField
                    field="connection_type"
                    value={customer.connection_type}
                    type="select"
                    options={[
                      { value: "fiber", label: "Fiber" },
                      { value: "dsl", label: "DSL" },
                      { value: "cable", label: "Cable" },
                      { value: "wireless", label: "Wireless" },
                    ]}
                    icon={Globe}
                  />
                  <InlineEditField field="router_ip" value={customer.router_ip} icon={Router} />
                  <InlineEditField field="mac_address" value={customer.mac_address} icon={Laptop} />
                  <div className="flex items-center gap-3">
                    <Router className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Router Allocated</div>
                      <div className="font-medium">{customer.router_allocated || "Not assigned"}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Network className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">IP Allocated</div>
                      <div className="font-medium">{customer.ip_allocated || "Not assigned"}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Portal Access */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="w-5 h-5" />
                    Portal Access
                  </CardTitle>
                  <CardDescription>Customer portal login credentials</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Hash className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Portal Login ID</div>
                      <div className="font-medium">{customer.portal_login_id}</div>
                    </div>
                  </div>
                  <InlineEditField field="portal_username" value={customer.portal_username} icon={User} />
                  <InlineEditField field="portal_password" value="••••••••" icon={Key} />
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium">Portal Access Information</p>
                        <p className="mt-1">
                          Customer can use these credentials to access their account portal and manage services.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Notes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Additional Notes
                  </CardTitle>
                  <CardDescription>Internal notes and comments about this customer</CardDescription>
                </CardHeader>
                <CardContent>
                  <InlineEditField field="notes" value={customer.notes} multiline icon={FileText} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="communications" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Communication Center</h3>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowSendMessageModal(true)}>
                  <Smartphone className="w-4 h-4 mr-2" />
                  Send SMS
                </Button>
                <Button onClick={() => setShowSendMessageModal(true)}>
                  <AtSign className="w-4 h-4 mr-2" />
                  Send Email
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Communication History
                </CardTitle>
                <CardDescription>Recent communications with this customer</CardDescription>
              </CardHeader>
              <CardContent>
                {communications.length > 0 ? (
                  <div className="space-y-4">
                    {communications.map((comm) => (
                      <Card key={comm.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              {comm.type === "email" ? (
                                <AtSign className="w-5 h-5 text-blue-500 mt-1" />
                              ) : (
                                <Smartphone className="w-5 h-5 text-green-500 mt-1" />
                              )}
                              <div>
                                <h4 className="font-medium">{comm.subject}</h4>
                                <p className="text-sm text-muted-foreground mt-1">{comm.content}</p>
                                <p className="text-xs text-muted-foreground mt-2">
                                  {new Date(comm.sent_at).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <Badge
                              className={
                                comm.status === "delivered"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }
                            >
                              {comm.status}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Communications</h3>
                    <p className="text-muted-foreground mb-4">No communication history available for this customer.</p>
                    <Button onClick={() => setShowSendMessageModal(true)}>
                      <Send className="w-4 h-4 mr-2" />
                      Send First Message
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="statistics" className="space-y-4">
            <LiveSpeedMonitor customerId={customer.id} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <Activity className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">99.9%</div>
                  <div className="text-sm text-muted-foreground">Uptime</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Wifi className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">95.2</div>
                  <div className="text-sm text-muted-foreground">Avg Speed (Mbps)</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Globe className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">450</div>
                  <div className="text-sm text-muted-foreground">Data Usage (GB)</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Usage Analytics
                </CardTitle>
                <CardDescription>Real-time and historical usage patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <UsageChart customerId={customer.id} />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Average Latency</span>
                      <span className="font-medium">12ms</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Packet Loss</span>
                      <span className="font-medium">0.01%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Jitter</span>
                      <span className="font-medium">2ms</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Connection Quality</span>
                      <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Usage Patterns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Peak Usage Time</span>
                      <span className="font-medium">8:00 PM - 11:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Daily Average</span>
                      <span className="font-medium">15.2 GB</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Monthly Total</span>
                      <span className="font-medium">450.5 GB</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Data Allowance</span>
                      <span className="font-medium">Unlimited</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="finance" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Financial Management</h3>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowFinanceSettingsModal(true)}>
                  <Settings className="w-4 h-4 mr-2" />
                  Payment Settings
                </Button>
                <Button onClick={() => setShowPaymentModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Payment
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">${customer.balance.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">Current Balance</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{customer.last_payment}</div>
                  <div className="text-sm text-muted-foreground">Last Payment</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <CreditCard className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">
                    ${services.reduce((sum, service) => sum + service.monthly_fee, 0).toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">Monthly Total</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <CheckCircle className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{customer.auto_payment ? "ON" : "OFF"}</div>
                  <div className="text-sm text-muted-foreground">Auto Payment</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Payment History</CardTitle>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>{payment.created_at}</TableCell>
                          <TableCell>${payment.amount}</TableCell>
                          <TableCell className="capitalize">{payment.method}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                payment.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }
                            >
                              {payment.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Invoices</CardTitle>
                    <Button variant="outline" size="sm">
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Invoice
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice #</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell>INV-{invoice.id.toString().padStart(4, "0")}</TableCell>
                          <TableCell>${invoice.amount}</TableCell>
                          <TableCell>{invoice.due_date}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                invoice.status === "paid"
                                  ? "bg-green-100 text-green-800"
                                  : invoice.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }
                            >
                              {invoice.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="support" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Customer Support</h3>
              <div className="flex gap-2">
                <Button variant="outline">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Knowledge Base
                </Button>
                <Button onClick={() => setShowCreateTicketModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Ticket
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <HeadphonesIcon className="w-5 h-5" />
                    Support Tickets
                  </CardTitle>
                  <div className="flex gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {supportTickets.length > 0 ? (
                  <div className="space-y-4">
                    {supportTickets.map((ticket) => (
                      <Card key={ticket.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <h4 className="font-medium">
                                  #{ticket.id} - {ticket.title}
                                </h4>
                                <Badge
                                  className={
                                    ticket.status === "resolved"
                                      ? "bg-green-100 text-green-800"
                                      : ticket.status === "open"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-gray-100 text-gray-800"
                                  }
                                >
                                  {ticket.status}
                                </Badge>
                                {getPriorityBadge(ticket.priority)}
                              </div>
                              <p className="text-sm text-muted-foreground">{ticket.description}</p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span>Created: {ticket.created_at}</span>
                                <span>Updated: {ticket.updated_at}</span>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <HeadphonesIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Support Tickets</h3>
                    <p className="text-muted-foreground mb-4">No support history available for this customer.</p>
                    <Button onClick={() => setShowCreateTicketModal(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Ticket
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" />
                  Quick Help
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Common Issues</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Slow internet connection</li>
                      <li>• WiFi password reset</li>
                      <li>• Router configuration</li>
                      <li>• Service interruption</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Quick Actions</h4>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                        <Zap className="w-4 h-4 mr-2" />
                        Speed Test
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                        <Router className="w-4 h-4 mr-2" />
                        Router Reboot
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                        <Shield className="w-4 h-4 mr-2" />
                        Reset Password
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <AddServiceModal
        open={showAddServiceModal}
        onOpenChange={setShowAddServiceModal}
        customerId={customer.id}
        customerData={{
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          portal_username: customer.portal_username,
        }}
      />
      <PaymentModal
        open={showPaymentModal}
        onOpenChange={setShowPaymentModal}
        customerId={customer.id}
        customerName={customer.name}
        currentBalance={customer.balance}
      />
      <EditCustomerModal open={showEditCustomerModal} onOpenChange={setShowEditCustomerModal} customer={customer} />
      <SendMessageModal
        open={showSendMessageModal}
        onOpenChange={setShowSendMessageModal}
        customerId={customer.id}
        customerName={customer.name}
        customerEmail={customer.email}
        customerPhone={customer.phone}
      />
      <CreateTicketModal
        open={showCreateTicketModal}
        onOpenChange={setShowCreateTicketModal}
        customerId={customer.id}
        customerName={customer.name}
      />
      <FinanceSettingsModal
        open={showFinanceSettingsModal}
        onOpenChange={setShowFinanceSettingsModal}
        customerId={customer.id}
        currentSettings={{
          payment_method: customer.payment_method,
          auto_payment: customer.auto_payment,
        }}
      />
    </>
  )
}
