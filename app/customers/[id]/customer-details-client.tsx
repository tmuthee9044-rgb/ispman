"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
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
  BarChart3,
  Send,
  Globe,
  Smartphone,
  Wrench,
  MessageSquare,
  Activity,
  AlertCircle,
  Clock,
} from "lucide-react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import React from "react"

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
  first_name?: string
  alternate_email?: string
  date_of_birth?: string
  gender?: string
  contact_person?: string
  tax_id?: string
  business_type?: string
  industry?: string
  company_size?: string
  school_type?: string
  student_count?: string
  staff_count?: string
  physical_address?: string
  physical_gps_lat?: string
  physical_gps_lng?: string
  phone_numbers?: any[]
  emergency_contacts?: any[]
  auto_renewal?: boolean
  paperless_billing?: boolean
  sms_notifications?: boolean
  billing_cycle?: string
  referral_source?: string
  special_requirements?: string
  sales_rep?: string
  account_manager?: string
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

function AddServiceModal({ open, onOpenChange, customerId, customerData, onServiceAdded }: any) {
  const [availableServices, setAvailableServices] = useState<any[]>([])
  const [selectedService, setSelectedService] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loadingServices, setLoadingServices] = useState(true)

  useEffect(() => {
    if (open) {
      fetchAvailableServices()
    }
  }, [open])

  const fetchAvailableServices = async () => {
    try {
      setLoadingServices(true)
      const response = await fetch("/api/service-plans")
      if (response.ok) {
        const services = await response.json()
        setAvailableServices(services)
      }
    } catch (error) {
      console.error("Failed to fetch services:", error)
    } finally {
      setLoadingServices(false)
    }
  }

  const handleAddService = async () => {
    if (!selectedService) {
      toast.error("Please select a service")
      return
    }

    try {
      setIsLoading(true)
      const response = await fetch(`/api/customers/${customerId}/services`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_plan_id: selectedService,
          status: "active",
          start_date: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        toast.success("Service added successfully")
        onServiceAdded?.()
        onOpenChange(false)
        window.location.reload()
      } else {
        const error = await response.json()
        toast.error(error.message || "Failed to add service")
      }
    } catch (error) {
      toast.error("Error adding service")
    } finally {
      setIsLoading(false)
    }
  }

  if (!open) return null

  const selectedServiceData = availableServices.find((s) => s.id === selectedService)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">
          Add Service for{" "}
          {customerData?.name ||
            `${customerData?.first_name || ""} ${customerData?.last_name || ""}`.trim() ||
            "Customer"}
        </h2>

        {loadingServices ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading available services...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label>Select Service Plan</Label>
              <select
                className="w-full p-2 border rounded-md"
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
              >
                <option value="">Choose a service plan...</option>
                {availableServices.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} - {formatCurrency(service.price)}/month
                  </option>
                ))}
              </select>
            </div>

            {selectedServiceData && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Service Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <div className="font-medium">{selectedServiceData.name}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Price:</span>
                    <div className="font-medium">{formatCurrency(selectedServiceData.price)}/month</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Speed:</span>
                    <div className="font-medium">{selectedServiceData.speed || "N/A"}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Type:</span>
                    <div className="font-medium capitalize">{selectedServiceData.service_type || "Standard"}</div>
                  </div>
                </div>
                {selectedServiceData.description && (
                  <div className="mt-2">
                    <span className="text-gray-600">Description:</span>
                    <p className="text-sm mt-1">{selectedServiceData.description}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleAddService} disabled={isLoading || !selectedService}>
            {isLoading ? "Adding..." : "Add Service"}
          </Button>
        </div>
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
  const [editedCustomer, setEditedCustomer] = useState(customer)
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/customers/${customer.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedCustomer),
      })

      if (response.ok) {
        toast.success("Customer updated successfully")
        onOpenChange(false)
        window.location.reload()
      } else {
        toast.error("Failed to update customer")
      }
    } catch (error) {
      toast.error("Error updating customer")
    } finally {
      setIsLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Edit Customer</h2>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>First Name</Label>
              <Input
                value={editedCustomer.first_name || editedCustomer.name?.split(" ")[0] || ""}
                onChange={(e) =>
                  setEditedCustomer({
                    ...editedCustomer,
                    first_name: e.target.value,
                    name: `${e.target.value} ${editedCustomer.last_name || editedCustomer.name?.split(" ")[1] || ""}`,
                  })
                }
              />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input
                value={editedCustomer.last_name || editedCustomer.name?.split(" ")[1] || ""}
                onChange={(e) =>
                  setEditedCustomer({
                    ...editedCustomer,
                    last_name: e.target.value,
                    name: `${editedCustomer.first_name || editedCustomer.name?.split(" ")[0] || ""} ${e.target.value}`,
                  })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={editedCustomer.email || ""}
                onChange={(e) => setEditedCustomer({ ...editedCustomer, email: e.target.value })}
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                value={editedCustomer.phone || ""}
                onChange={(e) => setEditedCustomer({ ...editedCustomer, phone: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label>Address</Label>
            <textarea
              className="w-full p-2 border rounded-md"
              rows={3}
              value={editedCustomer.physical_address || editedCustomer.address || ""}
              onChange={(e) =>
                setEditedCustomer({ ...editedCustomer, physical_address: e.target.value, address: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Customer Type</Label>
              <select
                className="w-full p-2 border rounded-md"
                value={editedCustomer.customer_type || "individual"}
                onChange={(e) => setEditedCustomer({ ...editedCustomer, customer_type: e.target.value })}
              >
                <option value="individual">Individual</option>
                <option value="company">Company</option>
                <option value="school">School</option>
              </select>
            </div>
            <div>
              <Label>Status</Label>
              <select
                className="w-full p-2 border rounded-md"
                value={editedCustomer.status || "active"}
                onChange={(e) => setEditedCustomer({ ...editedCustomer, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
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
  const [activeTab, setActiveTab] = useState("services")
  const [editingInfo, setEditingInfo] = useState(false)
  const [editedCustomer, setEditedCustomer] = useState(customer)

  useEffect(() => {
    setEditedCustomer(customer)
  }, [customer])

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
  const [customerServices, setCustomerServices] = useState([])
  const [availableServicePlans, setAvailableServicePlans] = useState([])
  const [selectedServicePlan, setSelectedServicePlan] = useState("")
  const [selectedServiceForEdit, setSelectedServiceForEdit] = useState<any>(null)
  const [showEditServiceModal, setShowEditServiceModal] = useState(false)

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

  const loadCustomerServicesData = async () => {
    try {
      const response = await fetch(`/api/customers/${customer.id}/services`)
      if (response.ok) {
        const data = await response.json()
        setCustomerServices(data.services || [])
      }
    } catch (error) {
      console.error("Failed to load customer services:", error)
    }
  }

  const handleAddService = async () => {
    if (!selectedServicePlan) {
      toast.error("Please select a service plan")
      return
    }

    try {
      setIsLoading(true)
      const selectedPlan = availableServicePlans.find((plan) => plan.id === selectedServicePlan)

      const response = await fetch(`/api/customers/${customer.id}/services`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_plan_id: selectedServicePlan,
          monthly_fee: selectedPlan?.price || 0,
          status: "active",
          start_date: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        toast.success("Service added successfully")
        loadCustomerServicesData()
        setShowAddServiceModal(false)
        setSelectedServicePlan("")
      } else {
        const error = await response.json()
        toast.error(error.message || "Failed to add service")
      }
    } catch (error) {
      toast.error("Error adding service")
    } finally {
      setIsLoading(false)
    }
  }

  const loadAvailableServicePlans = async () => {
    try {
      const response = await fetch("/api/service-plans")
      if (response.ok) {
        const plans = await response.json()
        setAvailableServicePlans(plans)
      } else {
        const fallbackPlans = [
          { id: 1, name: "Basic Home", price: 2999, speed: "10/5 Mbps" },
          { id: 2, name: "Standard Home", price: 4999, speed: "25/10 Mbps" },
          { id: 3, name: "Premium Home", price: 7999, speed: "50/25 Mbps" },
          { id: 4, name: "Business Starter", price: 14999, speed: "100/50 Mbps" },
        ]
        setAvailableServicePlans(fallbackPlans)
      }
    } catch (error) {
      const fallbackPlans = [
        { id: 1, name: "Basic Home", price: 2999, speed: "10/5 Mbps" },
        { id: 2, name: "Standard Home", price: 4999, speed: "25/10 Mbps" },
        { id: 3, name: "Premium Home", price: 7999, speed: "50/25 Mbps" },
        { id: 4, name: "Business Starter", price: 14999, speed: "100/50 Mbps" },
      ]
      setAvailableServicePlans(fallbackPlans)
    }
  }

  React.useEffect(() => {
    loadCustomerServicesData()
    loadAvailableServicePlans()
  }, [customer.id])

  const handleEditService = async (serviceId: string) => {
    const service = customerServices.find((s) => s.id === serviceId)
    if (!service) {
      toast.error("Service not found")
      return
    }

    // Set up edit service modal state
    setSelectedServiceForEdit(service)
    setShowEditServiceModal(true)
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
        body: JSON.stringify({
          ...editedCustomer,
          first_name: editedCustomer.first_name || editedCustomer.name?.split(" ")[0] || "",
          last_name: editedCustomer.last_name || editedCustomer.name?.split(" ")[1] || "",
        }),
      })

      if (response.ok) {
        toast.success("Customer information updated successfully")
        setEditingInfo(false)
        window.location.reload()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || "Failed to update customer information")
      }
    } catch (error) {
      console.error("Update error:", error)
      toast.error("Error updating customer information")
    }
  }

  const handleServiceExtension = async () => {
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
        toast.success("Service extended successfully")
        setShowServiceExtensionModal(false)
        loadCustomerServicesData() // Reload services
      } else {
        toast.error("Failed to extend service")
      }
    } catch (error) {
      toast.error("Error extending service")
    }
  }

  const handleServiceSuspension = async () => {
    try {
      const response = await fetch(`/api/customers/${customer.id}/suspend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason: suspensionReason,
          notes: suspensionNotes,
          duration: suspensionDuration,
        }),
      })
      if (response.ok) {
        toast.success("Service suspended successfully")
        setShowSuspendServiceModal(false)
        window.location.reload() // Reload page to show updated status
      } else {
        toast.error("Failed to suspend service")
      }
    } catch (error) {
      toast.error("Error suspending service")
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
              <h1 className="text-3xl font-bold">
                {customer.first_name && customer.last_name
                  ? `${customer.first_name} ${customer.last_name}`
                  : customer.name || "Unknown Customer"}
              </h1>
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => (window.location.href = `/customers/${customer.id}/edit`)}
            >
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
        <Tabs defaultValue="services" className="space-y-6">
          <div className="border-b">
            <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:grid-cols-none lg:flex">
              <TabsTrigger value="services" className="text-sm">
                Services
              </TabsTrigger>
              <TabsTrigger value="information" className="text-sm">
                Information
              </TabsTrigger>
              <TabsTrigger value="finance" className="text-sm">
                Finance
              </TabsTrigger>
              <TabsTrigger value="support" className="text-sm">
                Support
              </TabsTrigger>
              <TabsTrigger value="communications" className="text-sm">
                Communications
              </TabsTrigger>
              <TabsTrigger value="live-view" className="text-sm">
                Live View
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Customer Services</CardTitle>
                    <CardDescription>
                      Manage services for this customer. Total monthly cost:
                      {formatCurrency(customerServices.reduce((sum, service) => sum + (service.monthly_fee || 0), 0))}
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={() => setShowServiceExtensionModal(true)}>
                      <Clock className="w-4 h-4 mr-2" />
                      Extend Service
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setShowSuspendServiceModal(true)}>
                      <Pause className="w-4 h-4 mr-2" />
                      Suspend Service
                    </Button>
                    <Button size="sm" onClick={() => setShowAddServiceModal(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Service
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {customerServices.length > 0 ? (
                  <div className="space-y-4">
                    {customerServices.map((service) => (
                      <Card key={service.id} className="border-l-4 border-l-primary">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <Wifi className="w-5 h-5 text-primary" />
                                <h3 className="font-semibold text-lg">{service.service_name || service.name}</h3>
                                {getStatusBadge(service.status)}
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <span className="text-muted-foreground">Monthly Fee:</span>
                                  <div className="font-medium">{formatCurrency(service.monthly_fee || 0)}</div>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Next Billing:</span>
                                  <div className="font-medium">
                                    {service.next_billing_date
                                      ? new Date(service.next_billing_date).toLocaleDateString()
                                      : "N/A"}
                                  </div>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Speed:</span>
                                  <div className="font-medium">{service.speed || "N/A"}</div>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Status:</span>
                                  <div className="font-medium capitalize">{service.status}</div>
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

          {/* Information Tab */}
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
                  <Button onClick={() => setEditingInfo(true)}>Edit</Button>
                )}
              </div>
            </div>

            {editingInfo ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>First Name</Label>
                    <Input
                      value={editedCustomer.first_name || editedCustomer.name?.split(" ")[0] || ""}
                      onChange={(e) =>
                        setEditedCustomer({
                          ...editedCustomer,
                          first_name: e.target.value,
                          name: `${e.target.value} ${editedCustomer.last_name || editedCustomer.name?.split(" ")[1] || ""}`,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Last Name</Label>
                    <Input
                      value={editedCustomer.last_name || editedCustomer.name?.split(" ")[1] || ""}
                      onChange={(e) =>
                        setEditedCustomer({
                          ...editedCustomer,
                          last_name: e.target.value,
                          name: `${editedCustomer.first_name || editedCustomer.name?.split(" ")[0] || ""} ${e.target.value}`,
                        })
                      }
                    />
                  </div>
                </div>

                {/* ... existing form fields ... */}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">First Name</Label>
                    <p className="font-medium">
                      {customer.first_name || customer.name?.split(" ")[0] || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Last Name</Label>
                    <p className="font-medium">
                      {customer.last_name || customer.name?.split(" ")[1] || "Not provided"}
                    </p>
                  </div>
                </div>

                {/* ... existing display fields ... */}
              </div>
            )}
          </TabsContent>

          {/* Finance Tab */}
          <TabsContent value="finance" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Label>Auto Payment</Label>
                <Switch
                  checked={financeSettings.autoPayment}
                  onCheckedChange={(checked) => setFinanceSettings({ ...financeSettings, autoPayment: checked })}
                />
              </div>
              <div className="flex items-center gap-4">
                <Label>Pro-rated Billing</Label>
                <Switch
                  checked={financeSettings.proRatedBilling}
                  onCheckedChange={(checked) => setFinanceSettings({ ...financeSettings, proRatedBilling: checked })}
                />
              </div>
              <div className="flex items-center gap-4">
                <Label>Email Statements</Label>
                <Switch
                  checked={financeSettings.emailStatements}
                  onCheckedChange={(checked) => setFinanceSettings({ ...financeSettings, emailStatements: checked })}
                />
              </div>
              <div className="flex items-center gap-4">
                <Label>Payment Method</Label>
                <Select
                  className="w-full p-2 border rounded-md"
                  value={financeSettings.paymentMethod}
                  onChange={(e) => setFinanceSettings({ ...financeSettings, paymentMethod: e.target.value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mpesa">M-Pesa</SelectItem>
                    <SelectItem value="bank">Bank</SelectItem>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowFinanceSettingsModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveFinanceSettings}>Save Settings</Button>
            </div>
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label>Send Message</Label>
                <Input
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter message"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-4">
                <Label>Message Type</Label>
                <Select
                  className="w-full p-2 border rounded-md"
                  value={messageType}
                  onChange={(e) => setMessageType(e.target.value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select message type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowSendMessageModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendMessage}>Send Message</Button>
            </div>
          </TabsContent>

          {/* Communications Tab */}
          <TabsContent value="communications" className="space-y-4">
            <div className="space-y-4">
              {communications.map((comm) => (
                <Card key={comm.id}>
                  <CardContent className="flex items-center p-4">
                    <div className="flex items-center gap-4">
                      <Label>Type</Label>
                      <p className="font-medium capitalize">{comm.type}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Label>Subject</Label>
                      <p className="font-medium">{comm.subject}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Label>Content</Label>
                      <p className="font-medium">{comm.content}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Label>Sent At</Label>
                      <p className="font-medium">{comm.sent_at}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Label>Status</Label>
                      <p className="font-medium capitalize">{comm.status}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Label>Direction</Label>
                      <p className="font-medium capitalize">{comm.direction}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Live View Tab */}
          <TabsContent value="live-view" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Label>Current Speed</Label>
                <div className="flex items-center gap-2">
                  <p className="font-medium">Download: {liveUsage.current_speed.download} Mbps</p>
                  <p className="font-medium">Upload: {liveUsage.current_speed.upload} Mbps</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Label>Daily Usage</Label>
                <p className="font-medium">{liveUsage.daily_usage} GB</p>
              </div>
              <div className="flex items-center gap-4">
                <Label>Monthly Usage</Label>
                <p className="font-medium">{liveUsage.monthly_usage} GB</p>
              </div>
              <div className="flex items-center gap-4">
                <Label>Monthly Limit</Label>
                <p className="font-medium">{liveUsage.monthly_limit ? `${liveUsage.monthly_limit} GB` : "Unlimited"}</p>
              </div>
              <div className="flex items-center gap-4">
                <Label>Connection Status</Label>
                <p className="font-medium capitalize">{liveUsage.connection_status}</p>
              </div>
              <div className="flex items-center gap-4">
                <Label>Last Seen</Label>
                <p className="font-medium">{liveUsage.last_seen}</p>
              </div>
              <div className="flex items-center gap-4">
                <Label>Device Count</Label>
                <p className="font-medium">{liveUsage.device_count}</p>
              </div>
              <div className="flex items-center gap-4">
                <Label>Peak Usage Today</Label>
                <p className="font-medium">{liveUsage.peak_usage_today} GB</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <AddServiceModal
        open={showAddServiceModal}
        onOpenChange={setShowAddServiceModal}
        customerId={customer.id}
        customerData={customer}
        onServiceAdded={loadCustomerServicesData}
      />

      <PaymentModal
        open={showPaymentModal}
        onOpenChange={setShowPaymentModal}
        customerId={customer.id}
        customerName={customer.name}
        currentBalance={customer.balance}
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
    </>
  )
}
