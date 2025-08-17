"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrency } from "@/lib/currency"
import {
  User,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Edit,
  CreditCard,
  Plus,
  Wifi,
  Settings,
  Pause,
  Trash2,
  CheckCircle,
  BarChart3,
  HeadphonesIcon,
  Send,
  Globe,
  Smartphone,
  Wrench,
  MessageSquare,
  Activity,
  Download,
  Upload,
  AlertCircle,
  Clock,
  FileText,
  Receipt,
} from "lucide-react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"

interface Customer {
  id: number
  name: string
  email: string
  phone: string
  address: string
  status: "active" | "suspended" | "inactive"
  service_plan?: string
  monthly_fee?: number
  created_at: string
  updated_at: string
  connection_type?: string
  router_ip?: string
  mac_address?: string
  installation_date?: string
  last_payment?: string
  balance: number
  notes?: string
  portal_login_id?: string
  portal_username?: string
  portal_password?: string
  router_allocated?: string
  ip_allocated?: string
  customer_type?: string
  payment_method?: string
  auto_payment?: boolean
  national_id?: string
  vat_pin?: string
  business_reg_no?: string
  last_name?: string
}

interface CustomerDetailsClientProps {
  customer: Customer
}

function UsageChart({ customerId }: { customerId: number }) {
  return (
    <div className="h-64 flex items-center justify-center bg-muted/10 rounded-lg">
      <div className="text-center">
        <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
        <p className="text-muted-foreground">Usage analytics will be displayed here</p>
        <p className="text-sm text-muted-foreground">Customer ID: {customerId}</p>
      </div>
    </div>
  )
}

function AddServiceModal({ open, onOpenChange, customerId, customerData }: any) {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
        <h2 className="text-lg font-semibold mb-4">Add Service</h2>
        <p className="text-muted-foreground mb-4">Service management for customer {customerData?.name}</p>
        <Button onClick={() => onOpenChange(false)}>Close</Button>
      </div>
    </div>
  )
}

function PaymentModal({ open, onOpenChange, customerId, customerName, currentBalance }: any) {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
        <h2 className="text-lg font-semibold mb-4">Process Payment</h2>
        <p className="text-muted-foreground mb-4">Payment for {customerName}</p>
        <p className="text-sm mb-4">Current Balance: {formatCurrency(currentBalance)}</p>
        <Button onClick={() => onOpenChange(false)}>Close</Button>
      </div>
    </div>
  )
}

function EditCustomerModal({ open, onOpenChange, customer }: any) {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
        <h2 className="text-lg font-semibold mb-4">Edit Customer</h2>
        <p className="text-muted-foreground mb-4">Edit details for {customer?.name}</p>
        <Button onClick={() => onOpenChange(false)}>Close</Button>
      </div>
    </div>
  )
}

function SendMessageModal({ open, onOpenChange, customerId, customerName }: any) {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
        <h2 className="text-lg font-semibold mb-4">Send Message</h2>
        <p className="text-muted-foreground mb-4">Send message to {customerName}</p>
        <Button onClick={() => onOpenChange(false)}>Close</Button>
      </div>
    </div>
  )
}

function CreateTicketModal({ open, onOpenChange, customerId, customerName }: any) {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
        <h2 className="text-lg font-semibold mb-4">Create Support Ticket</h2>
        <p className="text-muted-foreground mb-4">Create ticket for {customerName}</p>
        <Button onClick={() => onOpenChange(false)}>Close</Button>
      </div>
    </div>
  )
}

function WelcomeModal({ open, onOpenChange, customer, handleSendWelcome, isLoading }: any) {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
        <h2 className="text-lg font-semibold mb-4">Send Welcome Message</h2>
        <p className="text-muted-foreground mb-4">Send a welcome message to {customer.name}</p>
        <div className="flex gap-3">
          <Button onClick={() => handleSendWelcome("email")} disabled={isLoading}>
            <Mail className="w-4 h-4 mr-2" />
            Send Email
          </Button>
          <Button onClick={() => handleSendWelcome("sms")} disabled={isLoading}>
            <MessageSquare className="w-4 h-4 mr-2" />
            Send SMS
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}

function MpesaModal({ open, onOpenChange, customer, handleMpesaRequest, isLoading }: any) {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
        <h2 className="text-lg font-semibold mb-4">M-Pesa Payment Request</h2>
        <p className="text-muted-foreground mb-4">
          Request payment from {customer.name} ({customer.phone})
        </p>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Amount (KES)</label>
            <Input type="number" placeholder="Enter amount" id="mpesa-amount" />
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => {
                const amount = (document.getElementById("mpesa-amount") as HTMLInputElement)?.value
                if (amount) handleMpesaRequest(Number.parseFloat(amount))
              }}
              disabled={isLoading}
            >
              <Smartphone className="w-4 h-4 mr-2" />
              Send Request
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function TroubleshootModal({ open, onOpenChange, customer, handleTroubleshoot, isLoading }: any) {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
        <h2 className="text-lg font-semibold mb-4">Connection Troubleshooting</h2>
        <p className="text-muted-foreground mb-4">Select troubleshooting action for {customer.name}</p>
        <div className="space-y-3">
          <Button className="w-full justify-start" onClick={() => handleTroubleshoot("ping_test")} disabled={isLoading}>
            <Activity className="w-4 h-4 mr-2" />
            Run Ping Test
          </Button>
          <Button
            className="w-full justify-start"
            onClick={() => handleTroubleshoot("speed_test")}
            disabled={isLoading}
          >
            <Wifi className="w-4 h-4 mr-2" />
            Run Speed Test
          </Button>
          <Button
            className="w-full justify-start"
            onClick={() => handleTroubleshoot("restart_router")}
            disabled={isLoading}
          >
            <Settings className="w-4 h-4 mr-2" />
            Restart Router
          </Button>
          <Button
            className="w-full justify-start"
            onClick={() => handleTroubleshoot("check_line")}
            disabled={isLoading}
          >
            <AlertCircle className="w-4 h-4 mr-2" />
            Check Line Status
          </Button>
          <Button variant="outline" className="w-full bg-transparent" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}

export function CustomerDetailsClient({ customer }: CustomerDetailsClientProps) {
  const [editingInfo, setEditingInfo] = useState(false)
  const [editedCustomer, setEditedCustomer] = useState(customer)
  const [selectedServiceForSuspension, setSelectedServiceForSuspension] = useState<string>("")
  const [suspensionDuration, setSuspensionDuration] = useState<number>(30)
  const [suspensionReason, setSuspensionReason] = useState<string>("")
  const [showFinanceSettingsModal, setShowFinanceSettingsModal] = useState(false)
  const [showServiceExtensionModal, setShowServiceExtensionModal] = useState(false)
  const [showSuspendServiceModal, setShowSuspendServiceModal] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState(0)
  const [monthlyFee, setMonthlyFee] = useState(0)
  const [extensionDays, setExtensionDays] = useState(0)
  const [extensionAmount, setExtensionAmount] = useState(0)
  const [includeInInvoice, setIncludeInInvoice] = useState(true)
  const [financeSettings, setFinanceSettings] = useState({
    autoPayment: customer.auto_payment || false,
    proRatedBilling: true,
    emailStatements: true,
    paymentMethod: customer.payment_method || "mpesa",
  })
  const [paymentHistory] = useState([
    { amount: 2500, method: "M-Pesa", date: "2024-01-15", status: "completed", days_activated: 30 },
    { amount: 1250, method: "M-Pesa", date: "2024-01-01", status: "completed", days_activated: 15 },
    { amount: 2500, method: "Bank", date: "2023-12-15", status: "completed", days_activated: 30 },
  ])
  const [showAddServiceModal, setShowAddServiceModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showEditCustomerModal, setShowEditCustomerModal] = useState(false)
  const [showSendMessageModal, setShowSendMessageModal] = useState(false)
  const [showCreateTicketModal, setShowCreateTicketModal] = useState(false)
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)
  const [showMpesaModal, setShowMpesaModal] = useState(false)
  const [showTroubleshootModal, setShowTroubleshootModal] = useState(false)
  const [newMessage, setNewMessage] = useState("")
  const [messageType, setMessageType] = useState("email")
  const [isLoading, setIsLoading] = useState(false)
  const [suspensionNotes, setSuspensionNotes] = useState("")

  const communications = [
    {
      id: 1,
      type: "email",
      subject: "Service Installation Confirmation",
      content: "Your internet service has been successfully installed.",
      sent_at: "2024-01-15 10:30:00",
      status: "delivered",
      direction: "outbound",
    },
    {
      id: 2,
      type: "sms",
      subject: "Payment Reminder",
      content: "Your monthly payment of KES 7,500 is due in 3 days.",
      sent_at: "2024-01-12 14:20:00",
      status: "delivered",
      direction: "outbound",
    },
    {
      id: 3,
      type: "email",
      subject: "Connection Issue",
      content: "I'm experiencing slow speeds during evening hours.",
      sent_at: "2024-01-10 18:45:00",
      status: "read",
      direction: "inbound",
    },
  ]

  const liveUsage = {
    current_speed: {
      download: 85.2,
      upload: 23.1,
    },
    daily_usage: 2.4,
    monthly_usage: 45.8,
    monthly_limit: null,
    connection_status: "online",
    last_seen: "2024-01-15 14:30:00",
    device_count: 8,
    peak_usage_today: 3.2,
  }

  const services = [
    {
      id: 1,
      name: "Basic Plan",
      status: "active",
      monthly_fee: 5000,
      next_billing: "2024-02-15",
      ip_address: "192.168.1.1",
      router: "Router123",
      expires_at: "2024-03-15",
      days_remaining: 59,
      auto_renewal: true,
    },
    {
      id: 2,
      name: "Premium Plan",
      status: "active",
      monthly_fee: 10000,
      next_billing: "2024-02-15",
      ip_address: "192.168.1.2",
      router: "Router456",
      expires_at: "2024-03-15",
      days_remaining: 59,
      auto_renewal: false,
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

  const calculateActivationDays = (payment: number, monthly: number) => {
    if (!monthly || monthly === 0) return 0
    return Math.floor((payment / monthly) * 30)
  }

  const calculateExpiryDate = (payment: number, monthly: number) => {
    const days = calculateActivationDays(payment, monthly)
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + days)
    return expiryDate.toLocaleDateString()
  }

  const handleAddService = async (serviceData: any) => {
    try {
      const response = await fetch(`/api/customers/${customer.id}/services`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serviceData),
      })

      if (response.ok) {
        toast.success("Service added successfully")
        // Refresh services data
        window.location.reload()
      } else {
        toast.error("Failed to add service")
      }
    } catch (error) {
      toast.error("Error adding service")
    }
    setShowAddServiceModal(false)
  }

  const handleEditService = async (serviceId: string) => {
    // Implementation for editing service
    console.log("[v0] Editing service:", serviceId)
  }

  const handleSuspendService = async (serviceId: string) => {
    if (!selectedServiceForSuspension) {
      setSelectedServiceForSuspension(serviceId)
      setShowSuspendServiceModal(true)
      return
    }

    try {
      const response = await fetch(`/api/customers/${customer.id}/services/${serviceId}/suspend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          duration: suspensionDuration,
          reason: suspensionReason,
        }),
      })

      if (response.ok) {
        toast.success("Service suspended successfully")
        window.location.reload()
      } else {
        toast.error("Failed to suspend service")
      }
    } catch (error) {
      toast.error("Error suspending service")
    }
    setShowSuspendServiceModal(false)
  }

  const handleDeleteService = async (serviceId: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      try {
        const response = await fetch(`/api/customers/${customer.id}/services/${serviceId}`, {
          method: "DELETE",
        })

        if (response.ok) {
          toast.success("Service deleted successfully")
          window.location.reload()
        } else {
          toast.error("Failed to delete service")
        }
      } catch (error) {
        toast.error("Error deleting service")
      }
    }
  }

  const handleGenerateStatement = async () => {
    try {
      const response = await fetch(`/api/customers/${customer.id}/generate-statement`, {
        method: "POST",
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `statement-${customer.name}-${new Date().toISOString().split("T")[0]}.pdf`
        a.click()
        toast.success("Statement generated successfully")
      } else {
        toast.error("Failed to generate statement")
      }
    } catch (error) {
      toast.error("Error generating statement")
    }
  }

  const handleGenerateInvoice = async () => {
    try {
      const response = await fetch(`/api/customers/${customer.id}/generate-invoice`, {
        method: "POST",
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `invoice-${customer.name}-${new Date().toISOString().split("T")[0]}.pdf`
        a.click()
        toast.success("Invoice generated successfully")
      } else {
        toast.error("Failed to generate invoice")
      }
    } catch (error) {
      toast.error("Error generating invoice")
    }
  }

  const handleUpdateCustomerInfo = async () => {
    try {
      const response = await fetch(`/api/customers/${customer.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedCustomer),
      })

      if (response.ok) {
        toast.success("Customer information updated successfully")
        setEditingInfo(false)
        window.location.reload()
      } else {
        toast.error("Failed to update customer information")
      }
    } catch (error) {
      toast.error("Error updating customer information")
    }
  }

  const handleServiceExtension = async () => {
    console.log("[v0] Extending service:", { extensionDays, extensionAmount, includeInInvoice })
    try {
      const response = await fetch(`/api/customers/${customer.id}/extend-service`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          days: extensionDays,
          amount: extensionAmount,
          includeInInvoice,
        }),
      })
      if (response.ok) {
        toast({ title: "Service extended successfully" })
        setShowServiceExtensionModal(false)
        window.location.reload()
      }
    } catch (error) {
      toast({ title: "Error extending service", variant: "destructive" })
    }
  }

  const handleServiceSuspension = async () => {
    console.log("[v0] Suspending service:", { suspensionReason, suspensionNotes })
    try {
      const response = await fetch(`/api/customers/${customer.id}/suspend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason: suspensionReason,
          notes: suspensionNotes,
        }),
      })
      if (response.ok) {
        toast({ title: "Service suspended successfully" })
        setShowSuspendServiceModal(false)
        window.location.reload()
      }
    } catch (error) {
      toast({ title: "Error suspending service", variant: "destructive" })
    }
  }

  const handleSaveFinanceSettings = async () => {
    console.log("[v0] Saving finance settings:", financeSettings)
    try {
      const response = await fetch(`/api/customers/${customer.id}/finance-settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(financeSettings),
      })
      if (response.ok) {
        toast({ title: "Finance settings saved successfully" })
        setShowFinanceSettingsModal(false)
      }
    } catch (error) {
      toast({ title: "Error saving settings", variant: "destructive" })
    }
  }

  const handleSendWelcome = async (type: "email" | "sms") => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/send-welcome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: customer.id, type }),
      })
      if (response.ok) {
        alert(`Welcome ${type} sent successfully!`)
      }
    } catch (error) {
      alert(`Failed to send welcome ${type}`)
    }
    setIsLoading(false)
    setShowWelcomeModal(false)
  }

  const handleMpesaRequest = async (amount: number) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/mpesa-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: customer.id, amount, phone: customer.phone }),
      })
      if (response.ok) {
        alert("M-Pesa payment request sent successfully!")
      }
    } catch (error) {
      alert("Failed to send M-Pesa request")
    }
    setIsLoading(false)
    setShowMpesaModal(false)
  }

  const handleTroubleshoot = async (action: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/troubleshoot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: customer.id, action }),
      })
      if (response.ok) {
        alert(`Troubleshooting action "${action}" completed successfully!`)
      }
    } catch (error) {
      alert("Troubleshooting failed")
    }
    setIsLoading(false)
    setShowTroubleshootModal(false)
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: customer.id,
          type: messageType,
          content: newMessage,
          recipient: messageType === "email" ? customer.email : customer.phone,
        }),
      })
      if (response.ok) {
        alert(`${messageType.toUpperCase()} sent successfully!`)
        setNewMessage("")
      }
    } catch (error) {
      alert(`Failed to send ${messageType}`)
    }
    setIsLoading(false)
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
                  {customer.customer_type || "individual"}
                </Badge>
                {getStatusBadge(customer.status)}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => setShowEditCustomerModal(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Customer
            </Button>
            <Button onClick={() => setShowPaymentModal(true)}>
              <CreditCard className="w-4 h-4 mr-2" />
              Process Payment
            </Button>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Perform common customer service tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button variant="outline" onClick={() => setShowWelcomeModal(true)} className="h-auto p-4 flex-col">
                <Send className="w-6 h-6 mb-2 text-blue-500" />
                <span className="text-sm">Send Welcome</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open(`/portal/customer/${customer.id}`, "_blank")}
                className="h-auto p-4 flex-col"
              >
                <Globe className="w-6 h-6 mb-2 text-green-500" />
                <span className="text-sm">Client Portal</span>
              </Button>
              <Button variant="outline" onClick={() => setShowMpesaModal(true)} className="h-auto p-4 flex-col">
                <Smartphone className="w-6 h-6 mb-2 text-orange-500" />
                <span className="text-sm">M-Pesa Request</span>
              </Button>
              <Button variant="outline" onClick={() => setShowTroubleshootModal(true)} className="h-auto p-4 flex-col">
                <Wrench className="w-6 h-6 mb-2 text-purple-500" />
                <span className="text-sm">Troubleshoot</span>
              </Button>
            </div>
          </CardContent>
        </Card>

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
                  {formatCurrency(customer.balance)}
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
            <TabsTrigger value="finance">Finance</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
            <TabsTrigger value="communications">Communications</TabsTrigger>
            <TabsTrigger value="live-view">Live View</TabsTrigger>
          </TabsList>
          <TabsContent value="services" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Customer Services</CardTitle>
                    <CardDescription>
                      Manage services for this customer. Total monthly cost: {/* Updated to KES */}
                      {formatCurrency(services.reduce((sum, service) => sum + service.monthly_fee, 0))}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowServiceExtensionModal(true)}>
                      <Clock className="w-4 h-4 mr-2" />
                      Extend Service
                    </Button>
                    <Button variant="outline" onClick={() => setShowSuspendServiceModal(true)}>
                      <Pause className="w-4 h-4 mr-2" />
                      Suspend Service
                    </Button>
                    <Button onClick={() => setShowAddServiceModal(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Service
                    </Button>
                  </div>
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
                                  <div className="font-medium">{formatCurrency(service.monthly_fee)}</div>
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
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mt-2">
                                <div>
                                  <span className="text-muted-foreground">Service Expires:</span>
                                  <div className="font-medium">{service.expires_at || "N/A"}</div>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Days Remaining:</span>
                                  <div className="font-medium">{service.days_remaining || "N/A"}</div>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Auto Renewal:</span>
                                  <div className="font-medium">{service.auto_renewal ? "Yes" : "No"}</div>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleEditService(service.id)}>
                                <Settings className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleSuspendService(service.id)}>
                                <Pause className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleDeleteService(service.id)}>
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
          // Making information tab fully editable
          <TabsContent value="information" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Customer Information</h3>
              <div className="flex gap-2">
                {editingInfo ? (
                  <>
                    <Button variant="outline" onClick={() => setEditingInfo(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleUpdateCustomerInfo}>Save Changes</Button>
                  </>
                ) : (
                  <Button variant="outline" onClick={() => setEditingInfo(true)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Information
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>First Name</Label>
                      {editingInfo ? (
                        <Input
                          value={editedCustomer.name?.split(" ")[0] || ""}
                          onChange={(e) =>
                            setEditedCustomer({
                              ...editedCustomer,
                              name: `${e.target.value} ${editedCustomer.name?.split(" ")[1] || ""}`,
                            })
                          }
                        />
                      ) : (
                        <div className="font-medium">{customer.name?.split(" ")[0] || "N/A"}</div>
                      )}
                    </div>
                    <div>
                      <Label>Last Name</Label>
                      {editingInfo ? (
                        <Input
                          value={editedCustomer.last_name || editedCustomer.name?.split(" ")[1] || ""}
                          onChange={(e) =>
                            setEditedCustomer({
                              ...editedCustomer,
                              last_name: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <div className="font-medium">{customer.last_name || customer.name?.split(" ")[1] || "N/A"}</div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label>Email</Label>
                    {editingInfo ? (
                      <Input
                        type="email"
                        value={editedCustomer.email || ""}
                        onChange={(e) =>
                          setEditedCustomer({
                            ...editedCustomer,
                            email: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <div className="font-medium">{customer.email}</div>
                    )}
                  </div>

                  <div>
                    <Label>Phone</Label>
                    {editingInfo ? (
                      <Input
                        value={editedCustomer.phone || ""}
                        onChange={(e) =>
                          setEditedCustomer({
                            ...editedCustomer,
                            phone: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <div className="font-medium">{customer.phone}</div>
                    )}
                  </div>

                  <div>
                    <Label>National ID</Label>
                    {editingInfo ? (
                      <Input
                        value={editedCustomer.national_id || ""}
                        onChange={(e) =>
                          setEditedCustomer({
                            ...editedCustomer,
                            national_id: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <div className="font-medium">{customer.national_id || "N/A"}</div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Business Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Customer Type</Label>
                    {editingInfo ? (
                      <select
                        className="w-full p-2 border rounded-md"
                        value={editedCustomer.customer_type || "individual"}
                        onChange={(e) =>
                          setEditedCustomer({
                            ...editedCustomer,
                            customer_type: e.target.value,
                          })
                        }
                      >
                        <option value="individual">Individual</option>
                        <option value="company">Company</option>
                        <option value="school">School</option>
                      </select>
                    ) : (
                      <div className="font-medium capitalize">{customer.customer_type || "individual"}</div>
                    )}
                  </div>

                  <div>
                    <Label>VAT PIN</Label>
                    {editingInfo ? (
                      <Input
                        value={editedCustomer.vat_pin || ""}
                        onChange={(e) =>
                          setEditedCustomer({
                            ...editedCustomer,
                            vat_pin: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <div className="font-medium">{customer.vat_pin || "N/A"}</div>
                    )}
                  </div>

                  <div>
                    <Label>Business Registration No.</Label>
                    {editingInfo ? (
                      <Input
                        value={editedCustomer.business_reg_no || ""}
                        onChange={(e) =>
                          setEditedCustomer({
                            ...editedCustomer,
                            business_reg_no: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <div className="font-medium">{customer.business_reg_no || "N/A"}</div>
                    )}
                  </div>

                  <div>
                    <Label>Address</Label>
                    {editingInfo ? (
                      <textarea
                        className="w-full p-2 border rounded-md"
                        rows={3}
                        value={editedCustomer.address || ""}
                        onChange={(e) =>
                          setEditedCustomer({
                            ...editedCustomer,
                            address: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <div className="font-medium">{customer.address}</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="finance" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Financial Overview</h3>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowFinanceSettingsModal(true)}>
                  <Settings className="w-4 h-4 mr-2" />
                  Finance Settings
                </Button>
                <Button variant="outline" onClick={() => handleGenerateStatement()}>
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Statement
                </Button>
                <Button variant="outline" onClick={() => handleGenerateInvoice()}>
                  <Receipt className="w-4 h-4 mr-2" />
                  Generate Invoice
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{formatCurrency(customer.balance)}</div>
                  <div className="text-sm text-muted-foreground">Current Balance</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{customer.last_payment || "N/A"}</div>
                  <div className="text-sm text-muted-foreground">Last Payment</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <CreditCard className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">
                    {formatCurrency(services.reduce((sum, service) => sum + service.monthly_fee, 0))}
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

            <Card>
              <CardHeader>
                <CardTitle>Pro-rated Payment Calculator</CardTitle>
                <CardDescription>Calculate service activation duration based on payment amount</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="payment-amount">Payment Amount (KES)</Label>
                    <Input
                      id="payment-amount"
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(Number(e.target.value))}
                      placeholder="Enter payment amount"
                    />
                  </div>
                  <div>
                    <Label htmlFor="monthly-fee">Monthly Fee (KES)</Label>
                    <Input
                      id="monthly-fee"
                      type="number"
                      value={monthlyFee}
                      onChange={(e) => setMonthlyFee(Number(e.target.value))}
                      placeholder="Monthly subscription fee"
                    />
                  </div>
                  <div>
                    <Label>Activation Duration</Label>
                    <div className="p-2 bg-muted rounded-md">
                      <div className="text-lg font-semibold">
                        {calculateActivationDays(paymentAmount, monthlyFee)} days
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Service will be active until: {calculateExpiryDate(paymentAmount, monthlyFee)}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {paymentHistory.map((payment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${payment.status === "completed" ? "bg-green-500" : "bg-yellow-500"}`}
                        />
                        <div>
                          <div className="font-medium">{formatCurrency(payment.amount)}</div>
                          <div className="text-sm text-muted-foreground">
                            {payment.method} • {payment.date}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium capitalize">{payment.status}</div>
                        <div className="text-sm text-muted-foreground">{payment.days_activated} days activated</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="support" className="space-y-4">
            <div className="text-center py-8">
              <HeadphonesIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Support Center</h3>
              <p className="text-muted-foreground mb-4">Customer support features will be available here.</p>
              <Button onClick={() => setShowCreateTicketModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Support Ticket
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="communications" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Communications</CardTitle>
                    <CardDescription>All messages and emails with this customer</CardDescription>
                  </div>
                  <Button onClick={() => setShowSendMessageModal(true)}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    New Message
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Send Message Form */}
                <Card className="mb-6">
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <Select value={messageType} onValueChange={setMessageType}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="sms">SMS</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          placeholder={messageType === "email" ? customer.email : customer.phone}
                          disabled
                          className="flex-1"
                        />
                      </div>
                      <Textarea
                        placeholder={`Type your ${messageType} message here...`}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        rows={3}
                      />
                      <Button onClick={handleSendMessage} disabled={isLoading || !newMessage.trim()}>
                        <Send className="w-4 h-4 mr-2" />
                        Send {messageType.toUpperCase()}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Communications History */}
                <div className="space-y-4">
                  {communications.map((comm) => (
                    <Card
                      key={comm.id}
                      className={`border-l-4 ${comm.direction === "inbound" ? "border-l-blue-500" : "border-l-green-500"}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              {comm.type === "email" ? (
                                <Mail className="w-4 h-4" />
                              ) : (
                                <MessageSquare className="w-4 h-4" />
                              )}
                              <span className="font-medium">{comm.subject}</span>
                              <Badge variant={comm.direction === "inbound" ? "default" : "secondary"}>
                                {comm.direction}
                              </Badge>
                              <Badge variant="outline">{comm.status}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{comm.content}</p>
                          </div>
                          <div className="text-sm text-muted-foreground">{new Date(comm.sent_at).toLocaleString()}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="live-view" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-green-500" />
                    Current Speed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Download className="w-4 h-4 text-blue-500" />
                        <span>Download</span>
                      </div>
                      <span className="text-2xl font-bold text-blue-500">{liveUsage.current_speed.download} Mbps</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Upload className="w-4 h-4 text-green-500" />
                        <span>Upload</span>
                      </div>
                      <span className="text-2xl font-bold text-green-500">{liveUsage.current_speed.upload} Mbps</span>
                    </div>
                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Connection Status</span>
                        <Badge className="bg-green-100 text-green-800">{liveUsage.connection_status}</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-purple-500" />
                    Usage Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Today's Usage</span>
                      <span className="font-bold">{liveUsage.daily_usage} GB</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Monthly Usage</span>
                      <span className="font-bold">{liveUsage.monthly_usage} GB</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Peak Usage Today</span>
                      <span className="font-bold">{liveUsage.peak_usage_today} GB</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Connected Devices</span>
                      <span className="font-bold">{liveUsage.device_count}</span>
                    </div>
                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Last Seen</span>
                        <span>{new Date(liveUsage.last_seen).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Usage Chart</CardTitle>
                <CardDescription>24-hour usage pattern</CardDescription>
              </CardHeader>
              <CardContent>
                <UsageChart customerId={customer.id} />
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
      />
      <CreateTicketModal
        open={showCreateTicketModal}
        onOpenChange={setShowCreateTicketModal}
        customerId={customer.id}
        customerName={customer.name}
      />
      <WelcomeModal
        open={showWelcomeModal}
        onOpenChange={setShowWelcomeModal}
        customer={customer}
        handleSendWelcome={handleSendWelcome}
        isLoading={isLoading}
      />
      <MpesaModal
        open={showMpesaModal}
        onOpenChange={setShowMpesaModal}
        customer={customer}
        handleMpesaRequest={handleMpesaRequest}
        isLoading={isLoading}
      />
      <TroubleshootModal
        open={showTroubleshootModal}
        onOpenChange={setShowTroubleshootModal}
        customer={customer}
        handleTroubleshoot={handleTroubleshoot}
        isLoading={isLoading}
      />
      {showFinanceSettingsModal && (
        <Dialog open={showFinanceSettingsModal} onOpenChange={setShowFinanceSettingsModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Finance Settings</DialogTitle>
              <DialogDescription>Configure payment preferences and billing settings</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-payment">Auto Payment</Label>
                <Switch
                  id="auto-payment"
                  checked={financeSettings.autoPayment}
                  onCheckedChange={(checked) => setFinanceSettings((prev) => ({ ...prev, autoPayment: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="pro-rated">Pro-rated Billing</Label>
                <Switch
                  id="pro-rated"
                  checked={financeSettings.proRatedBilling}
                  onCheckedChange={(checked) => setFinanceSettings((prev) => ({ ...prev, proRatedBilling: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="email-statements">Email Statements</Label>
                <Switch
                  id="email-statements"
                  checked={financeSettings.emailStatements}
                  onCheckedChange={(checked) => setFinanceSettings((prev) => ({ ...prev, emailStatements: checked }))}
                />
              </div>
              <div>
                <Label htmlFor="payment-method">Preferred Payment Method</Label>
                <Select
                  value={financeSettings.paymentMethod}
                  onValueChange={(value) => setFinanceSettings((prev) => ({ ...prev, paymentMethod: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mpesa">M-Pesa</SelectItem>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowFinanceSettingsModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveFinanceSettings}>Save Settings</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {showServiceExtensionModal && (
        <Dialog open={showServiceExtensionModal} onOpenChange={setShowServiceExtensionModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Extend Service</DialogTitle>
              <DialogDescription>Add additional days to customer's service</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="extension-days">Additional Days</Label>
                <Input
                  id="extension-days"
                  type="number"
                  value={extensionDays}
                  onChange={(e) => setExtensionDays(Number(e.target.value))}
                  placeholder="Enter number of days"
                />
              </div>
              <div>
                <Label htmlFor="extension-amount">Extension Cost (KES)</Label>
                <Input
                  id="extension-amount"
                  type="number"
                  value={extensionAmount}
                  onChange={(e) => setExtensionAmount(Number(e.target.value))}
                  placeholder="Cost for extension"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="include-invoice">Include in Invoice</Label>
                <Switch id="include-invoice" checked={includeInInvoice} onCheckedChange={setIncludeInInvoice} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowServiceExtensionModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleServiceExtension}>Extend Service</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {showSuspendServiceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Suspend Service</h3>

            <div className="space-y-4">
              <div>
                <Label>Select Service to Suspend</Label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={selectedServiceForSuspension}
                  onChange={(e) => setSelectedServiceForSuspension(e.target.value)}
                >
                  <option value="">Select a service</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} - {formatCurrency(service.monthly_fee)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Suspension Duration (days)</Label>
                <Input
                  type="number"
                  value={suspensionDuration}
                  onChange={(e) => setSuspensionDuration(Number(e.target.value))}
                  min="1"
                  max="365"
                />
              </div>

              <div>
                <Label>Reason for Suspension</Label>
                <textarea
                  className="w-full p-2 border rounded-md"
                  rows={3}
                  value={suspensionReason}
                  onChange={(e) => setSuspensionReason(e.target.value)}
                  placeholder="Enter reason for suspension..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowSuspendServiceModal(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => handleSuspendService(selectedServiceForSuspension)}
                disabled={!selectedServiceForSuspension}
              >
                Suspend Service
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
