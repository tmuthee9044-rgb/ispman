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
  TrendingUp,
  Search,
  Reply,
  Forward,
  MoreHorizontal,
  FileText,
  X,
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
  customerServices?: any[] // Add customerServices as optional prop
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
        setAvailableServices(services || [])
      } else {
        console.error("Failed to fetch services:", response.statusText)
        setAvailableServices([])
      }
    } catch (error) {
      console.error("Failed to fetch services:", error)
      setAvailableServices([])
    } finally {
      setLoadingServices(false)
    }
  }

  const handleAddService = async () => {
    if (!selectedService) {
      alert("Please select a service")
      return
    }

    try {
      setIsLoading(true)
      const selectedServiceData = availableServices.find((s) => s.id === selectedService)

      if (!selectedServiceData) {
        alert("Selected service not found")
        return
      }

      // Calculate next billing date (30 days from now)
      const installationDate = new Date()
      const nextBillingDate = new Date(installationDate)
      nextBillingDate.setDate(nextBillingDate.getDate() + 30)

      const requestData = {
        service_plan_id: Number.parseInt(selectedService),
        status: "active",
        monthly_fee: Number.parseFloat(selectedServiceData.price || selectedServiceData.monthly_fee || 0),
        installation_date: installationDate.toISOString().split("T")[0], // YYYY-MM-DD format
        next_billing_date: nextBillingDate.toISOString().split("T")[0], // YYYY-MM-DD format
        auto_renewal: true,
        ip_address: null,
        router_id: null,
        notes: `Service added for ${customerData?.first_name || "Customer"} ${customerData?.last_name || ""}`,
      }

      console.log("[v0] Sending add service request:", requestData)

      const response = await fetch(`/api/customers/${customerId}/services`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      })

      if (response.ok) {
        const result = await response.json()
        console.log("[v0] Service added successfully:", result)
        alert("Service added successfully")
        onServiceAdded?.()
        onOpenChange(false)
        setSelectedService("")
      } else {
        const errorData = await response.text()
        console.error("[v0] API Error:", errorData)
        alert(`Failed to add service: ${response.status} ${response.statusText}`)
      }
    } catch (error) {
      console.error("[v0] Error adding service:", error)
      alert("Error adding service. Please check your connection and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!open) return null

  const selectedServiceData = availableServices.find((s) => s.id === selectedService)

  const customerName =
    customerData?.first_name && customerData?.last_name
      ? `${customerData.first_name} ${customerData.last_name}`.trim()
      : customerData?.name || "Customer"

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Add Service for {customerName}</h2>

        {loadingServices ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading available services...</p>
          </div>
        ) : availableServices.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No services available. Please create service plans first.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Select Service Plan</label>
              <select
                className="w-full p-2 border rounded-md"
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
              >
                <option value="">Choose a service plan...</option>
                {availableServices.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} - KSh {service.price || service.monthly_fee || 0}/month
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
                    <div className="font-medium">
                      KSh {selectedServiceData.price || selectedServiceData.monthly_fee || 0}/month
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Download Speed:</span>
                    <div className="font-medium">{selectedServiceData.download_speed || "N/A"} Mbps</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Upload Speed:</span>
                    <div className="font-medium">{selectedServiceData.upload_speed || "N/A"} Mbps</div>
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
          <button
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            onClick={handleAddService}
            disabled={isLoading || !selectedService}
          >
            {isLoading ? "Adding..." : "Add Service"}
          </button>
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

export function CustomerDetailsClient({
  customer,
  customerServices = [], // Default to empty array if not provided
}: CustomerDetailsClientProps) {
  const [activeTab, setActiveTab] = useState("services")
  const [editingInfo, setEditingInfo] = useState(false)
  const [editedCustomer, setEditedCustomer] = useState(customer)
  const [isLoading, setIsLoading] = useState(false)
  const [availableServicePlans, setAvailableServicePlans] = useState([])
  const [selectedServicePlan, setSelectedServicePlan] = useState("")
  const [customerServicesData, setCustomerServices] = useState<any[]>(customerServices)

  useEffect(() => {
    if (customer) {
      setEditedCustomer(customer)
    }
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
  const [suspensionNotes, setSuspensionNotes] = useState("")
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
      if (!customer?.id) {
        console.error("[v0] Customer ID is missing")
        return
      }

      const response = await fetch(`/api/customers/${customer.id}/services`)
      if (response.ok) {
        const services = await response.json()
        setCustomerServices(services || [])
      } else {
        console.error("[v0] Failed to load customer services:", response.statusText)
      }
    } catch (error) {
      console.error("[v0] Failed to load customer services:", error)
      setCustomerServices([])
    }
  }

  const loadAvailableServicePlans = async () => {
    try {
      const response = await fetch("/api/service-plans")
      if (response.ok) {
        const plans = await response.json()
        setAvailableServicePlans(plans || [])
      } else {
        console.error("Failed to load available service plans:", response.statusText)
      }
    } catch (error) {
      console.error("Failed to load available service plans:", error)
    }
  }

  const handleAddService = async () => {
    if (!selectedServicePlan) {
      toast.error("Please select a service plan")
      return
    }

    if (!customer?.id) {
      toast.error("Customer ID is missing")
      return
    }

    try {
      setIsLoading(true)
      const selectedPlan = availableServicePlans.find((plan) => plan.id === selectedServicePlan)

      if (!selectedPlan) {
        toast.error("Selected service plan not found")
        return
      }

      // Calculate next billing date (30 days from now)
      const installationDate = new Date()
      const nextBillingDate = new Date(installationDate)
      nextBillingDate.setDate(nextBillingDate.getDate() + 30)

      const requestData = {
        service_plan_id: Number.parseInt(selectedServicePlan),
        status: "active",
        monthly_fee: Number.parseFloat(selectedPlan.price || selectedPlan.monthly_fee || 0),
        installation_date: installationDate.toISOString().split("T")[0],
        next_billing_date: nextBillingDate.toISOString().split("T")[0],
        auto_renewal: true,
        ip_address: null,
        router_id: null,
        notes: `Service added for ${customer?.first_name || "Customer"} ${customer?.last_name || ""}`,
      }

      console.log("[v0] Sending add service request:", requestData)

      const response = await fetch(`/api/customers/${customer.id}/services`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      })

      if (response.ok) {
        const result = await response.json()
        console.log("[v0] Service added successfully:", result)
        toast.success("Service added successfully")
        await loadCustomerServicesData()
        setShowAddServiceModal(false)
        setSelectedServicePlan("")
      } else {
        const errorText = await response.text()
        console.error("[v0] API Error:", errorText)
        toast.error(`Failed to add service: ${response.status} ${response.statusText}`)
      }
    } catch (error) {
      console.error("[v0] Error adding service:", error)
      toast.error("Error adding service. Please check your connection and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    if (customer?.id) {
      loadCustomerServicesData()
      loadAvailableServicePlans()
    }
  }, [customer?.id])

  const handleEditService = async (serviceId: string) => {
    try {
      const service = customerServices.find((s) => s.id === serviceId)
      if (!service) {
        toast.error("Service not found")
        return
      }

      // Set up edit service modal state
      setSelectedServiceForEdit(service)
      setShowEditServiceModal(true)
    } catch (error) {
      console.error("[v0] Error in handleEditService:", error)
      toast.error("Error loading service details")
    }
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

  if (!customer) {
    console.error("[v0] Customer data is null or undefined")
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="text-center text-red-500">Error: Customer data not found. Please try refreshing the page.</div>
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
            <TabsList className="h-auto p-1 bg-muted/50 w-full justify-start">
              <div className="flex overflow-x-auto gap-1 min-w-full">
                <TabsTrigger value="services" className="text-sm px-4 py-2 whitespace-nowrap">
                  Services
                </TabsTrigger>
                <TabsTrigger value="information" className="text-sm px-4 py-2 whitespace-nowrap">
                  Information
                </TabsTrigger>
                <TabsTrigger value="finance" className="text-sm px-4 py-2 whitespace-nowrap">
                  Finance
                </TabsTrigger>
                <TabsTrigger value="support" className="text-sm px-4 py-2 whitespace-nowrap">
                  Support
                </TabsTrigger>
                <TabsTrigger value="communications" className="text-sm px-4 py-2 whitespace-nowrap">
                  Communications
                </TabsTrigger>
                <TabsTrigger value="live-view" className="text-sm px-4 py-2 whitespace-nowrap">
                  Live View
                </TabsTrigger>
              </div>
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
                      {formatCurrency(
                        (customerServices || []).reduce((sum, service) => sum + (service.monthly_fee || 0), 0),
                      )}
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
                  <Button onClick={() => setEditingInfo(true)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Information
                  </Button>
                )}
              </div>
            </div>

            {editingInfo ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
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

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Date of Birth</Label>
                        <Input
                          type="date"
                          value={editedCustomer.date_of_birth || ""}
                          onChange={(e) => setEditedCustomer({ ...editedCustomer, date_of_birth: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Gender</Label>
                        <Select
                          value={editedCustomer.gender || ""}
                          onValueChange={(value) => setEditedCustomer({ ...editedCustomer, gender: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label>National ID</Label>
                      <Input
                        value={editedCustomer.national_id || ""}
                        onChange={(e) => setEditedCustomer({ ...editedCustomer, national_id: e.target.value })}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Physical Address</Label>
                      <textarea
                        className="w-full p-2 border rounded-md"
                        rows={3}
                        value={editedCustomer.physical_address || editedCustomer.address || ""}
                        onChange={(e) =>
                          setEditedCustomer({
                            ...editedCustomer,
                            physical_address: e.target.value,
                            address: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>GPS Latitude</Label>
                        <Input
                          value={editedCustomer.physical_gps_lat || ""}
                          onChange={(e) => setEditedCustomer({ ...editedCustomer, physical_gps_lat: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>GPS Longitude</Label>
                        <Input
                          value={editedCustomer.physical_gps_lng || ""}
                          onChange={(e) => setEditedCustomer({ ...editedCustomer, physical_gps_lng: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Alternate Email</Label>
                      <Input
                        type="email"
                        value={editedCustomer.alternate_email || ""}
                        onChange={(e) => setEditedCustomer({ ...editedCustomer, alternate_email: e.target.value })}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Customer Type</Label>
                        <Select
                          value={editedCustomer.customer_type || "individual"}
                          onValueChange={(value) => setEditedCustomer({ ...editedCustomer, customer_type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select customer type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="individual">Individual</SelectItem>
                            <SelectItem value="company">Company</SelectItem>
                            <SelectItem value="school">School</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Status</Label>
                        <Select
                          value={editedCustomer.status || "active"}
                          onValueChange={(value) => setEditedCustomer({ ...editedCustomer, status: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="suspended">Suspended</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Payment Method</Label>
                        <Select
                          value={editedCustomer.payment_method || "mpesa"}
                          onValueChange={(value) => setEditedCustomer({ ...editedCustomer, payment_method: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mpesa">M-Pesa</SelectItem>
                            <SelectItem value="bank">Bank Transfer</SelectItem>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="credit_card">Credit Card</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Billing Cycle</Label>
                        <Select
                          value={editedCustomer.billing_cycle || "monthly"}
                          onValueChange={(value) => setEditedCustomer({ ...editedCustomer, billing_cycle: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select billing cycle" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                            <SelectItem value="annually">Annually</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="auto-payment"
                          checked={editedCustomer.auto_payment || false}
                          onCheckedChange={(checked) => setEditedCustomer({ ...editedCustomer, auto_payment: checked })}
                        />
                        <Label htmlFor="auto-payment">Enable Auto Payment</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="paperless-billing"
                          checked={editedCustomer.paperless_billing || false}
                          onCheckedChange={(checked) =>
                            setEditedCustomer({ ...editedCustomer, paperless_billing: checked })
                          }
                        />
                        <Label htmlFor="paperless-billing">Paperless Billing</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="sms-notifications"
                          checked={editedCustomer.sms_notifications || false}
                          onCheckedChange={(checked) =>
                            setEditedCustomer({ ...editedCustomer, sms_notifications: checked })
                          }
                        />
                        <Label htmlFor="sms-notifications">SMS Notifications</Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Full Name</Label>
                        <p className="font-medium">
                          {customer.first_name && customer.last_name
                            ? `${customer.first_name} ${customer.last_name}`
                            : customer.name || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Customer ID</Label>
                        <p className="font-medium">{customer.id}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Customer Type</Label>
                        <Badge variant="outline" className="capitalize">
                          {customer.customer_type || "Individual"}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Date of Birth</Label>
                        <p className="font-medium">
                          {customer.date_of_birth
                            ? new Date(customer.date_of_birth).toLocaleDateString()
                            : "Not provided"}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Gender</Label>
                        <p className="font-medium capitalize">{customer.gender || "Not specified"}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">National ID</Label>
                        <p className="font-medium">{customer.national_id || "Not provided"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="w-5 h-5" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Primary Email</Label>
                        <p className="font-medium">{customer.email || "Not provided"}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Alternate Email</Label>
                        <p className="font-medium">{customer.alternate_email || "Not provided"}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Phone Number</Label>
                        <p className="font-medium">{customer.phone || "Not provided"}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Contact Person</Label>
                        <p className="font-medium">{customer.contact_person || "Not provided"}</p>
                      </div>
                      <div className="md:col-span-2">
                        <Label className="text-sm font-medium text-muted-foreground">Physical Address</Label>
                        <p className="font-medium">{customer.physical_address || customer.address || "Not provided"}</p>
                      </div>
                      {(customer.physical_gps_lat || customer.physical_gps_lng) && (
                        <div className="md:col-span-2">
                          <Label className="text-sm font-medium text-muted-foreground">GPS Coordinates</Label>
                          <p className="font-medium">
                            Lat: {customer.physical_gps_lat || "N/A"}, Lng: {customer.physical_gps_lng || "N/A"}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Account Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Account Status</Label>
                        {getStatusBadge(customer.status)}
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Account Balance</Label>
                        <p className={`font-medium ${customer.balance < 0 ? "text-red-600" : "text-green-600"}`}>
                          {formatCurrency(customer.balance)}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Payment Method</Label>
                        <p className="font-medium capitalize">{customer.payment_method || "Not set"}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Billing Cycle</Label>
                        <p className="font-medium capitalize">{customer.billing_cycle || "Monthly"}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Auto Payment</Label>
                        <Badge variant={customer.auto_payment ? "default" : "secondary"}>
                          {customer.auto_payment ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Paperless Billing</Label>
                        <Badge variant={customer.paperless_billing ? "default" : "secondary"}>
                          {customer.paperless_billing ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Account Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Account Created</Label>
                        <p className="font-medium">{new Date(customer.created_at).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Last Updated</Label>
                        <p className="font-medium">{new Date(customer.updated_at).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Installation Date</Label>
                        <p className="font-medium">
                          {customer.installation_date
                            ? new Date(customer.installation_date).toLocaleDateString()
                            : "Not set"}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Last Payment</Label>
                        <p className="font-medium">
                          {customer.last_payment ? new Date(customer.last_payment).toLocaleDateString() : "No payments"}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Referral Source</Label>
                        <p className="font-medium">{customer.referral_source || "Not specified"}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Sales Rep</Label>
                        <p className="font-medium">{customer.sales_rep || "Not assigned"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {customer.customer_type === "company" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Business Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Business Type</Label>
                          <p className="font-medium capitalize">{customer.business_type || "Not specified"}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Industry</Label>
                          <p className="font-medium">{customer.industry || "Not specified"}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Company Size</Label>
                          <p className="font-medium">{customer.company_size || "Not specified"}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">VAT PIN</Label>
                          <p className="font-medium">{customer.vat_pin || "Not provided"}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Business Reg No</Label>
                          <p className="font-medium">{customer.business_reg_no || "Not provided"}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Tax ID</Label>
                          <p className="font-medium">{customer.tax_id || "Not provided"}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {customer.customer_type === "school" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        School Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">School Type</Label>
                          <p className="font-medium capitalize">{customer.school_type || "Not specified"}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Student Count</Label>
                          <p className="font-medium">{customer.student_count || "Not specified"}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Staff Count</Label>
                          <p className="font-medium">{customer.staff_count || "Not specified"}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {customer.notes && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{customer.notes}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>

          {/* Finance Tab */}
          <TabsContent value="finance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="flex items-center p-4">
                  <DollarSign className="w-8 h-8 text-green-500 mr-3" />
                  <div>
                    <p className="text-sm text-muted-foreground">Current Balance</p>
                    <p className={`font-bold text-lg ${customer.balance < 0 ? "text-red-600" : "text-green-600"}`}>
                      {formatCurrency(customer.balance)}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center p-4">
                  <CreditCard className="w-8 h-8 text-blue-500 mr-3" />
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly Fee</p>
                    <p className="font-bold text-lg">
                      {formatCurrency(
                        (customerServices || []).reduce((sum, service) => sum + (service.monthly_fee || 0), 0),
                      )}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center p-4">
                  <Calendar className="w-8 h-8 text-orange-500 mr-3" />
                  <div>
                    <p className="text-sm text-muted-foreground">Last Payment</p>
                    <p className="font-medium">
                      {customer.last_payment ? new Date(customer.last_payment).toLocaleDateString() : "No payments"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Financial Actions</CardTitle>
                <CardDescription>Manage payments, invoices, and billing for this customer</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button onClick={() => setShowPaymentModal(true)} className="h-auto p-4 flex-col">
                    <Plus className="w-6 h-6 mb-2" />
                    <span className="text-sm">Add Payment</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleGenerateInvoice}
                    className="h-auto p-4 flex-col bg-transparent"
                  >
                    <CreditCard className="w-6 h-6 mb-2 text-blue-500" />
                    <span className="text-sm">Generate Invoice</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleGenerateStatement}
                    className="h-auto p-4 flex-col bg-transparent"
                  >
                    <BarChart3 className="w-6 h-6 mb-2 text-green-500" />
                    <span className="text-sm">Generate Statement</span>
                  </Button>
                  <Button variant="outline" onClick={() => setShowMpesaModal(true)} className="h-auto p-4 flex-col">
                    <Smartphone className="w-6 h-6 mb-2 text-orange-500" />
                    <span className="text-sm">M-Pesa Request</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Payment History */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Payment History</CardTitle>
                    <CardDescription>Recent payments and transactions</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Payment
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentHistory.map((payment, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
                          <DollarSign className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">{formatCurrency(payment.amount)}</p>
                          <p className="text-sm text-muted-foreground">
                            {payment.method} • {new Date(payment.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{payment.status}</Badge>
                        <p className="text-sm text-muted-foreground mt-1">{payment.days_activated} days activated</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Billing Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Billing Settings</CardTitle>
                <CardDescription>Configure payment and billing preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Auto Payment</Label>
                        <p className="text-sm text-muted-foreground">Automatically charge for monthly fees</p>
                      </div>
                      <Switch
                        checked={financeSettings.autoPayment}
                        onCheckedChange={(checked) => setFinanceSettings({ ...financeSettings, autoPayment: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Pro-rated Billing</Label>
                        <p className="text-sm text-muted-foreground">Calculate partial month charges</p>
                      </div>
                      <Switch
                        checked={financeSettings.proRatedBilling}
                        onCheckedChange={(checked) =>
                          setFinanceSettings({ ...financeSettings, proRatedBilling: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Email Statements</Label>
                        <p className="text-sm text-muted-foreground">Send monthly statements via email</p>
                      </div>
                      <Switch
                        checked={financeSettings.emailStatements}
                        onCheckedChange={(checked) =>
                          setFinanceSettings({ ...financeSettings, emailStatements: checked })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-base font-medium">Payment Method</Label>
                      <p className="text-sm text-muted-foreground mb-2">Default payment method for this customer</p>
                      <Select
                        value={financeSettings.paymentMethod}
                        onValueChange={(value) => setFinanceSettings({ ...financeSettings, paymentMethod: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mpesa">M-Pesa</SelectItem>
                          <SelectItem value="bank">Bank Transfer</SelectItem>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="credit_card">Credit Card</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-base font-medium">Billing Cycle</Label>
                      <p className="text-sm text-muted-foreground mb-2">How often to bill this customer</p>
                      <Select
                        value={customer.billing_cycle || "monthly"}
                        onValueChange={(value) => setEditedCustomer({ ...editedCustomer, billing_cycle: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select billing cycle" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="annually">Annually</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => setShowFinanceSettingsModal(false)}>
                    Reset
                  </Button>
                  <Button onClick={handleSaveFinanceSettings}>
                    <Settings className="w-4 h-4 mr-2" />
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Invoice History */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Invoice History</CardTitle>
                    <CardDescription>Generated invoices and billing documents</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleGenerateInvoice}>
                    <Plus className="w-4 h-4 mr-2" />
                    Generate Invoice
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { id: "INV-001", amount: 7500, date: "2024-01-15", status: "paid", dueDate: "2024-01-30" },
                    { id: "INV-002", amount: 7500, date: "2023-12-15", status: "paid", dueDate: "2023-12-30" },
                    { id: "INV-003", amount: 7500, date: "2023-11-15", status: "overdue", dueDate: "2023-11-30" },
                  ].map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                          <CreditCard className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{invoice.id}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(invoice.amount)} • Due: {new Date(invoice.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          className={
                            invoice.status === "paid"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : invoice.status === "overdue"
                                ? "bg-red-100 text-red-800 hover:bg-red-100"
                                : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                          }
                        >
                          {invoice.status}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">
                          {new Date(invoice.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Payment Calculator */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Calculator</CardTitle>
                <CardDescription>Calculate service activation days based on payment amount</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Payment Amount (KSh)</Label>
                    <Input
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(Number(e.target.value))}
                      placeholder="Enter payment amount"
                    />
                  </div>
                  <div>
                    <Label>Monthly Fee (KSh)</Label>
                    <Input
                      type="number"
                      value={
                        monthlyFee ||
                        (customerServices || []).reduce((sum, service) => sum + (service.monthly_fee || 0), 0)
                      }
                      onChange={(e) => setMonthlyFee(Number(e.target.value))}
                      placeholder="Monthly service fee"
                    />
                  </div>
                  <div>
                    <Label>Activation Days</Label>
                    <div className="p-2 border rounded-md bg-muted">
                      <span className="font-medium">
                        {calculateActivationDays(
                          paymentAmount,
                          monthlyFee ||
                            (customerServices || []).reduce((sum, service) => sum + (service.monthly_fee || 0), 0),
                        )}{" "}
                        days
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm">
                    <strong>Service expires on:</strong>{" "}
                    {calculateExpiryDate(
                      paymentAmount,
                      monthlyFee ||
                        (customerServices || []).reduce((sum, service) => sum + (service.monthly_fee || 0), 0),
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support" className="space-y-6">
            {/* Support Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="flex items-center p-4">
                  <AlertCircle className="w-8 h-8 text-red-500 mr-3" />
                  <div>
                    <p className="text-sm text-muted-foreground">Open Tickets</p>
                    <p className="font-bold text-lg">2</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center p-4">
                  <Clock className="w-8 h-8 text-yellow-500 mr-3" />
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Response</p>
                    <p className="font-bold text-lg">2.5h</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center p-4">
                  <MessageSquare className="w-8 h-8 text-blue-500 mr-3" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Tickets</p>
                    <p className="font-bold text-lg">15</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center p-4">
                  <Activity className="w-8 h-8 text-green-500 mr-3" />
                  <div>
                    <p className="text-sm text-muted-foreground">Satisfaction</p>
                    <p className="font-bold text-lg">4.8/5</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Support Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Support Actions</CardTitle>
                <CardDescription>Common support tasks and troubleshooting tools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button onClick={() => setShowCreateTicketModal(true)} className="h-auto p-4 flex-col">
                    <Plus className="w-6 h-6 mb-2" />
                    <span className="text-sm">Create Ticket</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowTroubleshootModal(true)}
                    className="h-auto p-4 flex-col"
                  >
                    <Wrench className="w-6 h-6 mb-2 text-orange-500" />
                    <span className="text-sm">Troubleshoot</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowSendMessageModal(true)}
                    className="h-auto p-4 flex-col"
                  >
                    <Send className="w-6 h-6 mb-2 text-blue-500" />
                    <span className="text-sm">Send Message</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open(`/portal/customer/${customer.id}`, "_blank")}
                    className="h-auto p-4 flex-col"
                  >
                    <Globe className="w-6 h-6 mb-2 text-green-500" />
                    <span className="text-sm">Customer Portal</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Active Support Tickets */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Active Support Tickets</CardTitle>
                    <CardDescription>Current open tickets for this customer</CardDescription>
                  </div>
                  <Button onClick={() => setShowCreateTicketModal(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Ticket
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      id: "TKT-001",
                      subject: "Slow internet speeds during evening hours",
                      priority: "high",
                      status: "open",
                      created: "2024-01-15 14:30:00",
                      lastUpdate: "2024-01-15 16:45:00",
                      assignedTo: "John Doe",
                      category: "Technical",
                    },
                    {
                      id: "TKT-002",
                      subject: "Billing inquiry about monthly charges",
                      priority: "medium",
                      status: "in-progress",
                      created: "2024-01-14 09:15:00",
                      lastUpdate: "2024-01-14 11:30:00",
                      assignedTo: "Jane Smith",
                      category: "Billing",
                    },
                  ].map((ticket) => (
                    <Card key={ticket.id} className="border-l-4 border-l-primary">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-3">
                              <h4 className="font-semibold">{ticket.id}</h4>
                              {getPriorityBadge(ticket.priority)}
                              <Badge variant={ticket.status === "open" ? "destructive" : "default"}>
                                {ticket.status}
                              </Badge>
                            </div>
                            <p className="text-sm font-medium">{ticket.subject}</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-muted-foreground">
                              <div>
                                <span>Category:</span>
                                <div className="font-medium">{ticket.category}</div>
                              </div>
                              <div>
                                <span>Assigned to:</span>
                                <div className="font-medium">{ticket.assignedTo}</div>
                              </div>
                              <div>
                                <span>Created:</span>
                                <div className="font-medium">{new Date(ticket.created).toLocaleDateString()}</div>
                              </div>
                              <div>
                                <span>Last Update:</span>
                                <div className="font-medium">{new Date(ticket.lastUpdate).toLocaleDateString()}</div>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button variant="outline" size="sm">
                              <MessageSquare className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Settings className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Support History */}
            <Card>
              <CardHeader>
                <CardTitle>Support History</CardTitle>
                <CardDescription>Previous support interactions and resolved tickets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      id: "TKT-003",
                      subject: "Router configuration assistance",
                      priority: "low",
                      status: "resolved",
                      created: "2024-01-10 10:00:00",
                      resolved: "2024-01-10 14:30:00",
                      category: "Technical",
                      resolution: "Provided step-by-step router configuration guide",
                    },
                    {
                      id: "TKT-004",
                      subject: "Payment method update request",
                      priority: "medium",
                      status: "closed",
                      created: "2024-01-08 16:20:00",
                      resolved: "2024-01-08 16:45:00",
                      category: "Account",
                      resolution: "Updated payment method to M-Pesa",
                    },
                    {
                      id: "TKT-005",
                      subject: "Service installation scheduling",
                      priority: "high",
                      status: "resolved",
                      created: "2024-01-05 08:30:00",
                      resolved: "2024-01-06 15:00:00",
                      category: "Installation",
                      resolution: "Installation completed successfully",
                    },
                  ].map((ticket) => (
                    <div key={ticket.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
                        <MessageSquare className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <h4 className="font-medium">{ticket.id}</h4>
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{ticket.status}</Badge>
                          <Badge variant="outline">{ticket.category}</Badge>
                        </div>
                        <p className="text-sm">{ticket.subject}</p>
                        <p className="text-xs text-muted-foreground">{ticket.resolution}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Created: {new Date(ticket.created).toLocaleDateString()}</span>
                          <span>Resolved: {new Date(ticket.resolved).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Knowledge Base & Resources */}
            <Card>
              <CardHeader>
                <CardTitle>Knowledge Base & Resources</CardTitle>
                <CardDescription>Quick access to common solutions and documentation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-medium">Common Issues</h4>
                    <div className="space-y-2">
                      {[
                        "Slow internet speeds",
                        "Connection drops frequently",
                        "Unable to access certain websites",
                        "Router not responding",
                        "WiFi password reset",
                      ].map((issue, index) => (
                        <Button key={index} variant="ghost" className="justify-start h-auto p-2 text-left">
                          <MessageSquare className="w-4 h-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">{issue}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium">Quick Actions</h4>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full justify-start bg-transparent"
                        onClick={() => setShowTroubleshootModal(true)}
                      >
                        <Activity className="w-4 h-4 mr-2" />
                        Run Network Diagnostics
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Settings className="w-4 h-4 mr-2" />
                        Reset Router Remotely
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Wifi className="w-4 h-4 mr-2" />
                        Check Service Status
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Phone className="w-4 h-4 mr-2" />
                        Schedule Technician Visit
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Feedback */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Feedback</CardTitle>
                <CardDescription>Recent feedback and satisfaction ratings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      rating: 5,
                      comment: "Excellent support! Issue was resolved quickly and professionally.",
                      date: "2024-01-10",
                      ticket: "TKT-003",
                    },
                    {
                      rating: 4,
                      comment: "Good service, but took a bit longer than expected.",
                      date: "2024-01-08",
                      ticket: "TKT-004",
                    },
                  ].map((feedback, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={`text-sm ${i < feedback.rating ? "text-yellow-400" : "text-gray-300"}`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">({feedback.rating}/5)</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {feedback.ticket} • {new Date(feedback.date).toLocaleDateString()}
                        </div>
                      </div>
                      <p className="text-sm">{feedback.comment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Send Message Interface */}
            <Card>
              <CardHeader>
                <CardTitle>Send Message to Customer</CardTitle>
                <CardDescription>Send direct communication to the customer</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Message Type</Label>
                    <Select value={messageType} onValueChange={setMessageType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select message type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Priority</Label>
                    <Select defaultValue="normal">
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Subject</Label>
                  <Input placeholder="Enter message subject" />
                </div>
                <div>
                  <Label>Message</Label>
                  <textarea
                    className="w-full p-3 border rounded-md min-h-[120px]"
                    placeholder="Enter your message here..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="send-copy" />
                  <Label htmlFor="send-copy" className="text-sm">
                    Send copy to my email
                  </Label>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">
                    <Clock className="w-4 h-4 mr-2" />
                    Schedule Send
                  </Button>
                  <Button onClick={handleSendMessage} disabled={isLoading}>
                    <Send className="w-4 h-4 mr-2" />
                    {isLoading ? "Sending..." : "Send Message"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Communications Tab */}
          <TabsContent value="communications" className="space-y-6">
            {/* Communications Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Messages</p>
                      <p className="text-2xl font-bold">{communications.length}</p>
                    </div>
                    <MessageSquare className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Unread</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {communications.filter((c) => c.status === "sent").length}
                      </p>
                    </div>
                    <Mail className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Last Contact</p>
                      <p className="text-sm font-bold">2 days ago</p>
                    </div>
                    <Clock className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Response Rate</p>
                      <p className="text-2xl font-bold text-green-600">85%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Communication Actions */}
            <div className="flex flex-wrap gap-4">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Message
              </Button>
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <Mail className="h-4 w-4" />
                Send Email
              </Button>
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <MessageSquare className="h-4 w-4" />
                Send SMS
              </Button>
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <Phone className="h-4 w-4" />
                Schedule Call
              </Button>
            </div>

            {/* Filters and Search */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search communications..." className="w-64" />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="call">Call</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Direction" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="inbound">Inbound</SelectItem>
                      <SelectItem value="outbound">Outbound</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="read">Read</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Communication Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Communication Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {communications.map((comm, index) => (
                  <div key={comm.id} className="flex gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-shrink-0">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          comm.direction === "inbound" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"
                        }`}
                      >
                        {comm.type === "email" ? (
                          <Mail className="h-5 w-5" />
                        ) : comm.type === "sms" ? (
                          <MessageSquare className="h-5 w-5" />
                        ) : (
                          <Phone className="h-5 w-5" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{comm.subject}</h4>
                          <Badge variant={comm.direction === "inbound" ? "secondary" : "default"}>
                            {comm.direction}
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            {comm.type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {new Date(comm.sent_at).toLocaleDateString()} {new Date(comm.sent_at).toLocaleTimeString()}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{comm.content}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              comm.status === "delivered" ? "default" : comm.status === "read" ? "secondary" : "outline"
                            }
                          >
                            {comm.status}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Reply className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Forward className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Templates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Quick Message Templates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-auto p-4 text-left justify-start bg-transparent">
                    <div>
                      <p className="font-medium">Service Update</p>
                      <p className="text-sm text-muted-foreground">Notify about service changes</p>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 text-left justify-start bg-transparent">
                    <div>
                      <p className="font-medium">Payment Reminder</p>
                      <p className="text-sm text-muted-foreground">Send payment due notice</p>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 text-left justify-start bg-transparent">
                    <div>
                      <p className="font-medium">Technical Support</p>
                      <p className="text-sm text-muted-foreground">Troubleshooting assistance</p>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 text-left justify-start bg-transparent">
                    <div>
                      <p className="font-medium">Welcome Message</p>
                      <p className="text-sm text-muted-foreground">New customer onboarding</p>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 text-left justify-start bg-transparent">
                    <div>
                      <p className="font-medium">Service Confirmation</p>
                      <p className="text-sm text-muted-foreground">Confirm service installation</p>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 text-left justify-start bg-transparent">
                    <div>
                      <p className="font-medium">Follow-up</p>
                      <p className="text-sm text-muted-foreground">Check customer satisfaction</p>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Communication Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Communication Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Email Communications</span>
                    <span className="font-medium">{communications.filter((c) => c.type === "email").length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">SMS Communications</span>
                    <span className="font-medium">{communications.filter((c) => c.type === "sms").length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Response Time</span>
                    <span className="font-medium">2.5 hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Customer Satisfaction</span>
                    <span className="font-medium text-green-600">4.8/5</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Scheduled Communications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Payment Reminder</p>
                      <p className="text-xs text-muted-foreground">Tomorrow at 10:00 AM</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Service Follow-up</p>
                      <p className="text-xs text-muted-foreground">Next week</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule New
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Live View Tab */}
          <TabsContent value="live-view" className="space-y-6">
            {/* Connection Status Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Connection Status</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            liveUsage.connection_status === "online" ? "bg-green-500" : "bg-red-500"
                          }`}
                        ></div>
                        <p className="font-bold capitalize">{liveUsage.connection_status}</p>
                      </div>
                    </div>
                    <Activity
                      className={`h-8 w-8 ${
                        liveUsage.connection_status === "online" ? "text-green-500" : "text-red-500"
                      }`}
                    />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Current Speed</p>
                      <p className="font-bold">
                        {liveUsage.current_speed.download}↓ / {liveUsage.current_speed.upload}↑ Mbps
                      </p>
                    </div>
                    <Wifi className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Connected Devices</p>
                      <p className="font-bold text-2xl">{liveUsage.device_count}</p>
                    </div>
                    <Smartphone className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Data Usage Today</p>
                      <p className="font-bold">{liveUsage.daily_usage} GB</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Real-time Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Live Monitoring Actions
                </CardTitle>
                <CardDescription>Real-time network monitoring and control tools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button className="h-auto p-4 flex-col">
                    <Activity className="w-6 h-6 mb-2" />
                    <span className="text-sm">Run Speed Test</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex-col bg-transparent">
                    <Wifi className="w-6 h-6 mb-2 text-blue-500" />
                    <span className="text-sm">Ping Test</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex-col bg-transparent">
                    <Settings className="w-6 h-6 mb-2 text-green-500" />
                    <span className="text-sm">Restart Router</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex-col bg-transparent">
                    <AlertCircle className="w-6 h-6 mb-2 text-orange-500" />
                    <span className="text-sm">Check Line Status</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Live Usage Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Real-time Usage Monitor
                </CardTitle>
                <CardDescription>Live bandwidth usage and performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg border-2 border-dashed border-blue-200">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-4">
                      <div className="relative">
                        <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
                        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-blue-700 mb-2">Live Usage Chart</h3>
                    <p className="text-blue-600 mb-4">Real-time bandwidth monitoring</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-white/50 p-3 rounded-lg">
                        <p className="font-medium text-blue-700">Download</p>
                        <p className="text-2xl font-bold text-blue-600">{liveUsage.current_speed.download}</p>
                        <p className="text-blue-500">Mbps</p>
                      </div>
                      <div className="bg-white/50 p-3 rounded-lg">
                        <p className="font-medium text-green-700">Upload</p>
                        <p className="text-2xl font-bold text-green-600">{liveUsage.current_speed.upload}</p>
                        <p className="text-green-500">Mbps</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Connected Devices */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Connected Devices ({liveUsage.device_count})
                </CardTitle>
                <CardDescription>Real-time device monitoring and management</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      name: "iPhone 13",
                      ip: "192.168.1.101",
                      mac: "AA:BB:CC:DD:EE:01",
                      status: "active",
                      usage: "2.3 GB",
                      type: "mobile",
                    },
                    {
                      name: "MacBook Pro",
                      ip: "192.168.1.102",
                      mac: "AA:BB:CC:DD:EE:02",
                      status: "active",
                      usage: "5.7 GB",
                      type: "laptop",
                    },
                    {
                      name: "Smart TV",
                      ip: "192.168.1.103",
                      mac: "AA:BB:CC:DD:EE:03",
                      status: "idle",
                      usage: "1.2 GB",
                      type: "tv",
                    },
                    {
                      name: "Android Phone",
                      ip: "192.168.1.104",
                      mac: "AA:BB:CC:DD:EE:04",
                      status: "active",
                      usage: "0.8 GB",
                      type: "mobile",
                    },
                    {
                      name: "Gaming Console",
                      ip: "192.168.1.105",
                      mac: "AA:BB:CC:DD:EE:05",
                      status: "active",
                      usage: "8.4 GB",
                      type: "gaming",
                    },
                  ].map((device, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            device.status === "active" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {device.type === "mobile" ? (
                            <Smartphone className="w-5 h-5" />
                          ) : device.type === "laptop" ? (
                            <User className="w-5 h-5" />
                          ) : device.type === "tv" ? (
                            <Activity className="w-5 h-5" />
                          ) : device.type === "gaming" ? (
                            <Settings className="w-5 h-5" />
                          ) : (
                            <Globe className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">{device.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {device.ip} • {device.mac}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium">{device.usage}</p>
                          <Badge variant={device.status === "active" ? "default" : "secondary"}>{device.status}</Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Settings className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Pause className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Network Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Network Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Latency</span>
                    <span className="font-medium text-green-600">12ms</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Packet Loss</span>
                    <span className="font-medium text-green-600">0%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Jitter</span>
                    <span className="font-medium text-green-600">2ms</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Signal Strength</span>
                    <span className="font-medium text-green-600">-45 dBm</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Connection Quality</span>
                    <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Usage Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Today's Usage</span>
                    <span className="font-medium">{liveUsage.daily_usage} GB</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">This Month</span>
                    <span className="font-medium">{liveUsage.monthly_usage} GB</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Peak Usage Today</span>
                    <span className="font-medium">{liveUsage.peak_usage_today} GB</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Monthly Limit</span>
                    <span className="font-medium">{liveUsage.monthly_limit || "Unlimited"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Last Activity</span>
                    <span className="font-medium">{new Date(liveUsage.last_seen).toLocaleTimeString()}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Live Alerts and Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Live Alerts & Notifications
                </CardTitle>
                <CardDescription>Real-time system alerts and status updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <p className="font-medium text-green-800">Connection Stable</p>
                      <p className="text-sm text-green-600">All systems operating normally</p>
                    </div>
                    <span className="text-xs text-green-500">Live</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium text-blue-800">Speed Test Completed</p>
                      <p className="text-sm text-blue-600">Download: 85.2 Mbps, Upload: 23.1 Mbps</p>
                    </div>
                    <span className="text-xs text-blue-500">2 min ago</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium text-yellow-800">High Usage Detected</p>
                      <p className="text-sm text-yellow-600">Gaming Console using 8.4 GB today</p>
                    </div>
                    <span className="text-xs text-yellow-500">5 min ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Router Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Router Information
                </CardTitle>
                <CardDescription>Current router status and configuration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Router Model</span>
                      <span className="font-medium">TP-Link Archer C7</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Firmware Version</span>
                      <span className="font-medium">3.15.3 Build 20201120</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">IP Address</span>
                      <span className="font-medium">{customer.router_ip || "192.168.1.1"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">MAC Address</span>
                      <span className="font-medium">{customer.mac_address || "AA:BB:CC:DD:EE:FF"}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Uptime</span>
                      <span className="font-medium">7 days, 14 hours</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Temperature</span>
                      <span className="font-medium text-green-600">42°C</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">CPU Usage</span>
                      <span className="font-medium text-green-600">15%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Memory Usage</span>
                      <span className="font-medium text-green-600">68%</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-6 pt-4 border-t">
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Configure Router
                  </Button>
                  <Button variant="outline" size="sm">
                    <Activity className="w-4 h-4 mr-2" />
                    Restart Router
                  </Button>
                  <Button variant="outline" size="sm">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Logs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

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
        </Tabs>
      </div>
    </>
  )
}

export default CustomerDetailsClient
