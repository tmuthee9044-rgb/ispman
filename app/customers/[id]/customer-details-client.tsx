"use client"

import { useState, useEffect } from "react"
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
        <h2 className="text-lg font-semibold mb-4">Add Service for {customerData?.name}</h2>

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

  const loadCustomerServices = async () => {
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

  const loadAvailableServicePlans = async () => {
    try {
      const response = await fetch("/api/service-plans")
      if (response.ok) {
        const data = await response.json()
        setAvailableServicePlans(data.plans || [])
      }
    } catch (error) {
      console.error("Failed to load service plans:", error)
    }
  }

  React.useEffect(() => {
    loadCustomerServices()
    loadAvailableServicePlans()
  }, [customer.id])

  const handleAddService = async () => {
    if (!selectedServicePlan) {
      toast.error("Please select a service plan")
      return
    }

    try {
      const selectedPlan = availableServicePlans.find((plan) => plan.id === selectedServicePlan)
      const response = await fetch(`/api/customers/${customer.id}/services`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_plan_id: selectedServicePlan,
          monthly_fee: selectedPlan?.price || 0,
        }),
      })

      if (response.ok) {
        toast.success("Service added successfully")
        loadCustomerServices() // Reload services
        setShowAddServiceModal(false)
        setSelectedServicePlan("")
      } else {
        toast.error("Failed to add service")
      }
    } catch (error) {
      toast.error("Error adding service")
    }
  }

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
        loadCustomerServices() // Reload services
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
                      Manage services for this customer. Total monthly cost:
                      {formatCurrency(customerServices.reduce((sum, service) => sum + (service.monthly_fee || 0), 0))}
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
                          value={editedCustomer.first_name || editedCustomer.name?.split(" ")[0] || ""}
                          onChange={(e) =>
                            setEditedCustomer({
                              ...editedCustomer,
                              first_name: e.target.value,
                              name: `${e.target.value} ${editedCustomer.last_name || editedCustomer.name?.split(" ")[1] || ""}`,
                            })
                          }
                        />
                      ) : (
                        <div className="font-medium">
                          {customer.first_name || customer.name?.split(" ")[0] || "N/A"}
                        </div>
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
                              name: `${editedCustomer.first_name || editedCustomer.name?.split(" ")[0] || ""} ${e.target.value}`,
                            })
                          }
                        />
                      ) : (
                        <div className="font-medium">{customer.last_name || customer.name?.split(" ")[1] || "N/A"}</div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
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
                      <Label>Alternate Email</Label>
                      {editingInfo ? (
                        <Input
                          type="email"
                          value={editedCustomer.alternate_email || ""}
                          onChange={(e) =>
                            setEditedCustomer({
                              ...editedCustomer,
                              alternate_email: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <div className="font-medium">{customer.alternate_email || "N/A"}</div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Primary Phone</Label>
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
                      <Label>Date of Birth</Label>
                      {editingInfo ? (
                        <Input
                          type="date"
                          value={editedCustomer.date_of_birth || ""}
                          onChange={(e) =>
                            setEditedCustomer({
                              ...editedCustomer,
                              date_of_birth: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <div className="font-medium">{customer.date_of_birth || "N/A"}</div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Gender</Label>
                      {editingInfo ? (
                        <select
                          className="w-full p-2 border rounded-md"
                          value={editedCustomer.gender || ""}
                          onChange={(e) =>
                            setEditedCustomer({
                              ...editedCustomer,
                              gender: e.target.value,
                            })
                          }
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                          <option value="prefer-not-to-say">Prefer not to say</option>
                        </select>
                      ) : (
                        <div className="font-medium capitalize">{customer.gender || "N/A"}</div>
                      )}
                    </div>
                    <div>
                      <Label>National ID/Passport</Label>
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
                  </div>

                  {customer.customer_type !== "individual" && (
                    <div>
                      <Label>Contact Person</Label>
                      {editingInfo ? (
                        <Input
                          value={editedCustomer.contact_person || ""}
                          onChange={(e) =>
                            setEditedCustomer({
                              ...editedCustomer,
                              contact_person: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <div className="font-medium">{customer.contact_person || "N/A"}</div>
                      )}
                    </div>
                  )}
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

                  <div className="grid grid-cols-2 gap-4">
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
                      <Label>Tax ID</Label>
                      {editingInfo ? (
                        <Input
                          value={editedCustomer.tax_id || ""}
                          onChange={(e) =>
                            setEditedCustomer({
                              ...editedCustomer,
                              tax_id: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <div className="font-medium">{customer.tax_id || "N/A"}</div>
                      )}
                    </div>
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

                  {customer.customer_type === "company" && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Business Type</Label>
                          <div className="font-medium">{customer.business_type || "N/A"}</div>
                        </div>
                        <div>
                          <Label>Industry</Label>
                          <div className="font-medium">{customer.industry || "N/A"}</div>
                        </div>
                      </div>
                      <div>
                        <Label>Company Size</Label>
                        <div className="font-medium">{customer.company_size || "N/A"}</div>
                      </div>
                    </>
                  )}

                  {customer.customer_type === "school" && (
                    <>
                      <div>
                        <Label>School Type</Label>
                        <div className="font-medium">{customer.school_type || "N/A"}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Number of Students</Label>
                          <div className="font-medium">{customer.student_count || "N/A"}</div>
                        </div>
                        <div>
                          <Label>Number of Staff</Label>
                          <div className="font-medium">{customer.staff_count || "N/A"}</div>
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <Label>Physical Address</Label>
                    {editingInfo ? (
                      <textarea
                        className="w-full p-2 border rounded-md"
                        rows={3}
                        value={editedCustomer.physical_address || ""}
                        onChange={(e) =>
                          setEditedCustomer({
                            ...editedCustomer,
                            physical_address: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <div className="font-medium">{customer.physical_address || customer.address || "N/A"}</div>
                    )}
                  </div>

                  {(customer.physical_gps_lat || customer.physical_gps_lng) && (
                    <div>
                      <Label>GPS Coordinates</Label>
                      <div className="font-medium">
                        {customer.physical_gps_lat}, {customer.physical_gps_lng}
                      </div>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Portal Access</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Portal Login ID</Label>
                        <div className="font-medium font-mono">{customer.portal_login_id || "N/A"}</div>
                      </div>
                      <div>
                        <Label>Portal Username</Label>
                        <div className="font-medium font-mono">{customer.portal_username || "N/A"}</div>
                      </div>
                    </div>
                  </div>

                  {customer.phone_numbers && customer.phone_numbers.length > 0 && (
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">Additional Phone Numbers</h4>
                      <div className="space-y-2">
                        {customer.phone_numbers.map((phone: any, index: number) => (
                          <div key={index} className="flex justify-between">
                            <span className="font-medium">{phone.number}</span>
                            <span className="text-sm text-muted-foreground capitalize">
                              {phone.type} {phone.isPrimary && "(Primary)"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {customer.emergency_contacts && customer.emergency_contacts.length > 0 && (
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">Emergency Contacts</h4>
                      <div className="space-y-2">
                        {customer.emergency_contacts.map((contact: any, index: number) => (
                          <div key={index} className="grid grid-cols-3 gap-2 text-sm">
                            <span className="font-medium">{contact.name}</span>
                            <span>{contact.phone}</span>
                            <span className="text-muted-foreground capitalize">{contact.relationship}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Service Preferences</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label>Auto Renewal</Label>
                        <div className="font-medium">{customer.auto_renewal ? "Enabled" : "Disabled"}</div>
                      </div>
                      <div>
                        <Label>Paperless Billing</Label>
                        <div className="font-medium">{customer.paperless_billing ? "Enabled" : "Disabled"}</div>
                      </div>
                      <div>
                        <Label>SMS Notifications</Label>
                        <div className="font-medium">{customer.sms_notifications ? "Enabled" : "Disabled"}</div>
                      </div>
                      <div>
                        <Label>Billing Cycle</Label>
                        <div className="font-medium capitalize">{customer.billing_cycle || "Monthly"}</div>
                      </div>
                    </div>
                  </div>

                  {(customer.referral_source ||
                    customer.special_requirements ||
                    customer.sales_rep ||
                    customer.account_manager) && (
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">Additional Information</h4>
                      <div className="space-y-2 text-sm">
                        {customer.referral_source && (
                          <div>
                            <Label>Referral Source</Label>
                            <div className="font-medium capitalize">{customer.referral_source}</div>
                          </div>
                        )}
                        {customer.sales_rep && (
                          <div>
                            <Label>Sales Representative</Label>
                            <div className="font-medium">{customer.sales_rep}</div>
                          </div>
                        )}
                        {customer.account_manager && (
                          <div>
                            <Label>Account Manager</Label>
                            <div className="font-medium">{customer.account_manager}</div>
                          </div>
                        )}
                        {customer.special_requirements && (
                          <div>
                            <Label>Special Requirements</Label>
                            <div className="font-medium">{customer.special_requirements}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
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
      {showAddServiceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Add Service</h3>

            <div className="space-y-4">
              <div>
                <Label>Select Service Plan</Label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={selectedServicePlan}
                  onChange={(e) => setSelectedServicePlan(e.target.value)}
                >
                  <option value="">Choose a service plan</option>
                  {availableServicePlans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} - {formatCurrency(plan.price)} - {plan.speed}
                    </option>
                  ))}
                </select>
              </div>

              {selectedServicePlan && (
                <div className="p-3 bg-gray-50 rounded-md">
                  {(() => {
                    const selectedPlan = availableServicePlans.find((plan) => plan.id === selectedServicePlan)
                    return selectedPlan ? (
                      <div>
                        <h4 className="font-medium">{selectedPlan.name}</h4>
                        <p className="text-sm text-gray-600">{selectedPlan.description}</p>
                        <p className="text-sm font-medium mt-1">
                          {formatCurrency(selectedPlan.price)}/month - {selectedPlan.speed}
                        </p>
                      </div>
                    ) : null
                  })()}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowAddServiceModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddService} disabled={!selectedServicePlan}>
                Add Service
              </Button>
            </div>
          </div>
        </div>
      )}

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
        onServiceAdded={loadCustomerServices}
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

              <div>
                <Label>Additional Notes</Label>
                <textarea
                  className="w-full p-2 border rounded-md"
                  rows={2}
                  value={suspensionNotes}
                  onChange={(e) => setSuspensionNotes(e.target.value)}
                  placeholder="Any additional notes..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowSuspendServiceModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleServiceSuspension}>Suspend Service</Button>
            </div>
          </div>
        </div>
      )}

      {showEditServiceModal && selectedServiceForEdit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Edit Service</h2>

            <div className="space-y-4">
              <div>
                <Label>Service Name</Label>
                <Input
                  value={selectedServiceForEdit.service_name || selectedServiceForEdit.name || ""}
                  onChange={(e) =>
                    setSelectedServiceForEdit({
                      ...selectedServiceForEdit,
                      service_name: e.target.value,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Monthly Fee (KES)</Label>
                  <Input
                    type="number"
                    value={selectedServiceForEdit.monthly_fee || ""}
                    onChange={(e) =>
                      setSelectedServiceForEdit({
                        ...selectedServiceForEdit,
                        monthly_fee: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Speed</Label>
                  <Input
                    value={selectedServiceForEdit.speed || ""}
                    onChange={(e) =>
                      setSelectedServiceForEdit({
                        ...selectedServiceForEdit,
                        speed: e.target.value,
                      })
                    }
                    placeholder="e.g., 10 Mbps"
                  />
                </div>
              </div>

              <div>
                <Label>Status</Label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={selectedServiceForEdit.status || "active"}
                  onChange={(e) =>
                    setSelectedServiceForEdit({
                      ...selectedServiceForEdit,
                      status: e.target.value,
                    })
                  }
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div>
                <Label>Next Billing Date</Label>
                <Input
                  type="date"
                  value={
                    selectedServiceForEdit.next_billing_date
                      ? new Date(selectedServiceForEdit.next_billing_date).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    setSelectedServiceForEdit({
                      ...selectedServiceForEdit,
                      next_billing_date: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowEditServiceModal(false)}>
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  try {
                    const response = await fetch(
                      `/api/customers/${customer.id}/services/${selectedServiceForEdit.id}`,
                      {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(selectedServiceForEdit),
                      },
                    )

                    if (response.ok) {
                      toast.success("Service updated successfully")
                      setShowEditServiceModal(false)
                      window.location.reload()
                    } else {
                      toast.error("Failed to update service")
                    }
                  } catch (error) {
                    toast.error("Error updating service")
                  }
                }}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
