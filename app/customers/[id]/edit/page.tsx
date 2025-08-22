"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import {
  User,
  Building2,
  GraduationCap,
  Phone,
  MapPin,
  Settings,
  Users,
  Plus,
  Trash2,
  Shield,
  Key,
  RefreshCw,
  Package,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import MapPicker from "@/components/map-picker"

interface Customer {
  id: number
  first_name?: string
  last_name?: string
  name?: string
  email: string
  phone: string
  customer_type?: string
  status: string
  physical_address?: string
  address?: string
  date_of_birth?: string
  gender?: string
  national_id?: string
  alternate_email?: string
  vat_pin?: string
  tax_id?: string
  business_reg_no?: string
  business_type?: string
  industry?: string
  company_size?: string
  school_type?: string
  student_count?: string
  staff_count?: string
  contact_person?: string
  physical_city?: string
  physical_county?: string
  physical_postal_code?: string
  physical_country?: string
  physical_gps_lat?: string
  physical_gps_lng?: string
  billing_address?: string
  billing_city?: string
  billing_county?: string
  billing_postal_code?: string
  billing_country?: string
  billing_gps_lat?: string
  billing_gps_lng?: string
  connection_type?: string
  installation_date?: string
  billing_cycle?: string
  auto_renewal?: boolean
  paperless_billing?: boolean
  sms_notifications?: boolean
  referral_source?: string
  special_requirements?: string
  sales_rep?: string
  account_manager?: string
  portal_login_id?: string
  portal_username?: string
  portal_password?: string
  phone_numbers?: any[]
  emergency_contacts?: any[]
}

export default function EditCustomerPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [customerType, setCustomerType] = useState("individual")
  const [sameAsPhysical, setSameAsPhysical] = useState(true)
  const [phoneNumbers, setPhoneNumbers] = useState([{ id: 1, number: "", type: "mobile", isPrimary: true }])
  const [emergencyContacts, setEmergencyContacts] = useState([{ id: 1, name: "", phone: "", relationship: "" }])

  const [portalCredentials, setPortalCredentials] = useState({
    loginId: "",
    username: "",
    password: "",
    autoGeneratePassword: true,
  })
  const [physicalCoordinates, setPhysicalCoordinates] = useState({ lat: -1.2921, lng: 36.8219 })
  const [billingCoordinates, setBillingCoordinates] = useState({ lat: -1.2921, lng: 36.8219 })
  const [selectedItems, setSelectedItems] = useState<any[]>([])
  const [inventoryItems, setInventoryItems] = useState<any[]>([])
  const [loadingInventory, setLoadingInventory] = useState(false)
  const [servicePlans, setServicePlans] = useState<any[]>([])
  const [loadingPlans, setLoadingPlans] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [equipmentSearchTerm, setEquipmentSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showOnlyInStock, setShowOnlyInStock] = useState(false)

  useEffect(() => {
    const loadCustomer = async () => {
      try {
        const response = await fetch(`/api/customers/${params.id}`)
        if (response.ok) {
          const customerData = await response.json()
          setCustomer(customerData)
          setCustomerType(customerData.customer_type || "individual")

          setPortalCredentials({
            loginId: customerData.portal_login_id || "",
            username: customerData.portal_username || "",
            password: customerData.portal_password || "",
            autoGeneratePassword: false,
          })

          if (customerData.physical_lat && customerData.physical_lng) {
            setPhysicalCoordinates({
              lat: Number.parseFloat(customerData.physical_lat),
              lng: Number.parseFloat(customerData.physical_lng),
            })
          }
          if (customerData.billing_lat && customerData.billing_lng) {
            setBillingCoordinates({
              lat: Number.parseFloat(customerData.billing_lat),
              lng: Number.parseFloat(customerData.billing_lng),
            })
          }

          // Set phone numbers from customer data
          if (customerData.phone_numbers && customerData.phone_numbers.length > 0) {
            setPhoneNumbers(
              customerData.phone_numbers.map((phone: any, index: number) => ({
                id: index + 1,
                number: phone.number || phone.phone || "",
                type: phone.type || "mobile",
                isPrimary: phone.is_primary || index === 0,
              })),
            )
          } else if (customerData.phone) {
            setPhoneNumbers([{ id: 1, number: customerData.phone, type: "mobile", isPrimary: true }])
          }

          // Set emergency contacts from customer data
          if (customerData.emergency_contacts && customerData.emergency_contacts.length > 0) {
            setEmergencyContacts(
              customerData.emergency_contacts.map((contact: any, index: number) => ({
                id: index + 1,
                name: contact.name || "",
                phone: contact.phone || "",
                relationship: contact.relationship || "",
              })),
            )
          }

          // Check if billing address is different from physical
          const hasDifferentBilling =
            customerData.billing_address && customerData.billing_address !== customerData.physical_address
          setSameAsPhysical(!hasDifferentBilling)
        } else {
          toast.error("Failed to load customer data")
          router.push("/customers")
        }
      } catch (error) {
        console.error("Error loading customer:", error)
        toast.error("Error loading customer data")
        router.push("/customers")
      } finally {
        setLoading(false)
      }
    }

    const loadServicePlans = async () => {
      setLoadingPlans(true)
      try {
        const response = await fetch("/api/service-plans")
        if (response.ok) {
          const plans = await response.json()
          setServicePlans(plans)
        }
      } catch (error) {
        console.error("Error loading service plans:", error)
      } finally {
        setLoadingPlans(false)
      }
    }

    const loadInventory = async () => {
      setLoadingInventory(true)
      try {
        const response = await fetch("/api/inventory/available")
        if (response.ok) {
          const items = await response.json()
          setInventoryItems(items)
        }
      } catch (error) {
        console.error("Error loading inventory:", error)
      } finally {
        setLoadingInventory(false)
      }
    }

    loadCustomer()
    loadServicePlans()
    loadInventory()
  }, [params.id, router])

  const handlePortalCredentialChange = (field: string, value: any) => {
    setPortalCredentials((prev) => ({ ...prev, [field]: value }))
  }

  const generatePortalCredentials = () => {
    const loginId = `TW${Date.now().toString().slice(-9)}`
    const username = `customer_${Date.now().toString().slice(-6)}`
    setPortalCredentials((prev) => ({
      ...prev,
      loginId,
      username,
    }))
  }

  const generateRandomPassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
    let password = ""
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return password
  }

  const handlePhysicalLocationSelect = (lat: number, lng: number) => {
    setPhysicalCoordinates({ lat, lng })
    if (sameAsPhysical) {
      setBillingCoordinates({ lat, lng })
    }
  }

  const handleBillingLocationSelect = (lat: number, lng: number) => {
    setBillingCoordinates({ lat, lng })
  }

  const handlePlanSelection = (planId: string) => {
    const plan = servicePlans.find((p) => p.id.toString() === planId)
    setSelectedPlan(plan)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount / 100)
  }

  const addPhoneNumber = () => {
    const newId = Math.max(...phoneNumbers.map((p) => p.id)) + 1
    setPhoneNumbers([...phoneNumbers, { id: newId, number: "", type: "mobile", isPrimary: false }])
  }

  const removePhoneNumber = (id: number) => {
    if (phoneNumbers.length > 1) {
      setPhoneNumbers(phoneNumbers.filter((p) => p.id !== id))
    }
  }

  const updatePhoneNumber = (id: number, field: string, value: string) => {
    setPhoneNumbers(phoneNumbers.map((p) => (p.id === id ? { ...p, [field]: value } : p)))
  }

  const setPrimaryPhone = (id: number) => {
    setPhoneNumbers(phoneNumbers.map((p) => ({ ...p, isPrimary: p.id === id })))
  }

  const addEmergencyContact = () => {
    const newId = Math.max(...emergencyContacts.map((c) => c.id)) + 1
    setEmergencyContacts([...emergencyContacts, { id: newId, name: "", phone: "", relationship: "" }])
  }

  const removeEmergencyContact = (id: number) => {
    if (emergencyContacts.length > 1) {
      setEmergencyContacts(emergencyContacts.filter((c) => c.id !== id))
    }
  }

  const updateEmergencyContact = (id: number, field: string, value: string) => {
    setEmergencyContacts(emergencyContacts.map((c) => (c.id === id ? { ...c, [field]: value } : c)))
  }

  const handleSameAsPhysicalChange = (checked: boolean) => {
    setSameAsPhysical(checked)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)

      formData.append("portal_login_id", portalCredentials.loginId)
      formData.append("portal_username", portalCredentials.username)
      formData.append("portal_password", portalCredentials.password)
      formData.append("physical_lat", physicalCoordinates.lat.toString())
      formData.append("physical_lng", physicalCoordinates.lng.toString())
      formData.append("billing_lat", billingCoordinates.lat.toString())
      formData.append("billing_lng", billingCoordinates.lng.toString())
      formData.append("selected_equipment", JSON.stringify(selectedItems))

      // Add phone numbers and emergency contacts to form data
      formData.append("phone_numbers", JSON.stringify(phoneNumbers))
      formData.append("emergency_contacts", JSON.stringify(emergencyContacts))
      formData.append("customer_type", customerType)
      formData.append("same_as_physical", sameAsPhysical.toString())

      const response = await fetch(`/api/customers/${params.id}`, {
        method: "PUT",
        body: formData,
      })

      if (response.ok) {
        toast.success("Customer updated successfully!")
        router.push("/customers")
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || "Failed to update customer")
      }
    } catch (error) {
      console.error("Error updating customer:", error)
      toast.error("Error updating customer")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading customer data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        <div className="text-center">
          <p className="text-muted-foreground">Customer not found</p>
          <Button asChild className="mt-4">
            <Link href="/customers">Back to Customers</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Edit Customer</h2>
          <p className="text-muted-foreground">Update customer information and settings</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/customers">Back to Customers</Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Type Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Type
            </CardTitle>
            <CardDescription>Update the customer type if needed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  customerType === "individual" ? "border-blue-500 bg-blue-50 dark:bg-blue-950" : "border-gray-200"
                }`}
                onClick={() => setCustomerType("individual")}
              >
                <div className="flex items-center space-x-3">
                  <User className="h-6 w-6" />
                  <div>
                    <h3 className="font-medium">Individual</h3>
                    <p className="text-sm text-muted-foreground">Personal customer</p>
                  </div>
                </div>
              </div>
              <div
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  customerType === "company" ? "border-blue-500 bg-blue-50 dark:bg-blue-950" : "border-gray-200"
                }`}
                onClick={() => setCustomerType("company")}
              >
                <div className="flex items-center space-x-3">
                  <Building2 className="h-6 w-6" />
                  <div>
                    <h3 className="font-medium">Company</h3>
                    <p className="text-sm text-muted-foreground">Business customer</p>
                  </div>
                </div>
              </div>
              <div
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  customerType === "school" ? "border-blue-500 bg-blue-50 dark:bg-blue-950" : "border-gray-200"
                }`}
                onClick={() => setCustomerType("school")}
              >
                <div className="flex items-center space-x-3">
                  <GraduationCap className="h-6 w-6" />
                  <div>
                    <h3 className="font-medium">School</h3>
                    <p className="text-sm text-muted-foreground">Educational institution</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Portal Access Configuration
            </CardTitle>
            <CardDescription>
              Update customer portal login credentials for M-Pesa transactions and account management
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="portalLoginId">Portal Login ID</Label>
                <div className="flex gap-2">
                  <Input
                    id="portalLoginId"
                    value={portalCredentials.loginId}
                    onChange={(e) => handlePortalCredentialChange("loginId", e.target.value)}
                    placeholder="TW123456789"
                    className="font-mono"
                  />
                  <Button type="button" variant="outline" size="sm" onClick={generatePortalCredentials}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Used for M-Pesa transactions and payment processing</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="portalUsername">Portal Username</Label>
                <div className="flex gap-2">
                  <Input
                    id="portalUsername"
                    value={portalCredentials.username}
                    onChange={(e) => handlePortalCredentialChange("username", e.target.value)}
                    placeholder="customer_123456"
                    className="font-mono"
                  />
                  <Button type="button" variant="outline" size="sm" onClick={generatePortalCredentials}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Username for customer portal login</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-generate Password</Label>
                  <div className="text-sm text-muted-foreground">Automatically generate a secure password</div>
                </div>
                <Switch
                  checked={portalCredentials.autoGeneratePassword}
                  onCheckedChange={(checked) => handlePortalCredentialChange("autoGeneratePassword", checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="portalPassword">Portal Password</Label>
                <div className="flex gap-2">
                  <Input
                    id="portalPassword"
                    type={portalCredentials.autoGeneratePassword ? "text" : "password"}
                    value={portalCredentials.password}
                    onChange={(e) => handlePortalCredentialChange("password", e.target.value)}
                    placeholder="Enter password or auto-generate"
                    className="font-mono"
                    disabled={portalCredentials.autoGeneratePassword}
                  />
                  {portalCredentials.autoGeneratePassword && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handlePortalCredentialChange("password", generateRandomPassword())}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Customer will use this password to access the portal</p>
              </div>

              {/* Portal Credentials Preview */}
              <Card className="bg-muted/50 border-dashed">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    Portal Credentials Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Login ID:</span>
                    <code className="bg-background px-2 py-1 rounded text-xs">{portalCredentials.loginId}</code>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Username:</span>
                    <code className="bg-background px-2 py-1 rounded text-xs">{portalCredentials.username}</code>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Password:</span>
                    <code className="bg-background px-2 py-1 rounded text-xs">
                      {portalCredentials.password ? "••••••••••••" : "Not set"}
                    </code>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>Update the customer's basic details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  {customerType === "individual"
                    ? "First Name"
                    : customerType === "company"
                      ? "Company Name"
                      : "School Name"}
                </Label>
                <Input
                  id="firstName"
                  name="first_name"
                  defaultValue={customer.first_name || customer.name?.split(" ")[0] || ""}
                  placeholder={
                    customerType === "individual"
                      ? "John"
                      : customerType === "company"
                        ? "Acme Corporation Ltd"
                        : "Springfield Elementary School"
                  }
                  required
                />
              </div>
              {customerType === "individual" && (
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="last_name"
                    defaultValue={customer.last_name || customer.name?.split(" ")[1] || ""}
                    placeholder="Doe"
                    required
                  />
                </div>
              )}
              {customerType !== "individual" && (
                <div className="space-y-2">
                  <Label htmlFor="contactPerson">Primary Contact Person</Label>
                  <Input
                    id="contactPerson"
                    name="contact_person"
                    defaultValue={customer.contact_person || ""}
                    placeholder="John Doe"
                    required
                  />
                </div>
              )}
            </div>

            {customerType === "individual" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    name="date_of_birth"
                    type="date"
                    defaultValue={customer.date_of_birth || ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select name="gender" defaultValue={customer.gender || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nationalId">National ID/Passport</Label>
                  <Input
                    id="nationalId"
                    name="national_id"
                    defaultValue={customer.national_id || ""}
                    placeholder="12345678"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={customer.email || ""}
                placeholder="john@example.com"
                required
              />
            </div>

            {customerType !== "individual" && (
              <div className="space-y-2">
                <Label htmlFor="alternateEmail">Alternate Email</Label>
                <Input
                  id="alternateEmail"
                  name="alternate_email"
                  type="email"
                  defaultValue={customer.alternate_email || ""}
                  placeholder="billing@company.com"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="status">Customer Status</Label>
              <Select name="status" defaultValue={customer.status || "active"}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Business/Tax Information */}
        {customerType !== "individual" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Business & Tax Information
              </CardTitle>
              <CardDescription>Update business registration and tax details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vatPin">VAT PIN Number</Label>
                  <Input id="vatPin" name="vat_pin" defaultValue={customer.vat_pin || ""} placeholder="P051234567A" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxId">Tax Identification Number</Label>
                  <Input id="taxId" name="tax_id" defaultValue={customer.tax_id || ""} placeholder="123456789" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessRegNo">Business Registration Number</Label>
                  <Input
                    id="businessRegNo"
                    name="business_reg_no"
                    defaultValue={customer.business_reg_no || ""}
                    placeholder="BRN123456789"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type</Label>
                  <Select name="business_type" defaultValue={customer.business_type || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sole-proprietorship">Sole Proprietorship</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                      <SelectItem value="limited-company">Limited Company</SelectItem>
                      <SelectItem value="corporation">Corporation</SelectItem>
                      <SelectItem value="ngo">NGO/Non-Profit</SelectItem>
                      <SelectItem value="government">Government Entity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {customerType === "company" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Select name="industry" defaultValue={customer.industry || ""}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="construction">Construction</SelectItem>
                        <SelectItem value="hospitality">Hospitality</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companySize">Company Size</Label>
                    <Select name="company_size" defaultValue={customer.company_size || ""}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select company size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1-10 employees</SelectItem>
                        <SelectItem value="11-50">11-50 employees</SelectItem>
                        <SelectItem value="51-200">51-200 employees</SelectItem>
                        <SelectItem value="201-500">201-500 employees</SelectItem>
                        <SelectItem value="500+">500+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {customerType === "school" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="schoolType">School Type</Label>
                    <Select name="school_type" defaultValue={customer.school_type || ""}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select school type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="primary">Primary School</SelectItem>
                        <SelectItem value="secondary">Secondary School</SelectItem>
                        <SelectItem value="college">College</SelectItem>
                        <SelectItem value="university">University</SelectItem>
                        <SelectItem value="technical">Technical Institute</SelectItem>
                        <SelectItem value="private">Private School</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="studentCount">Number of Students</Label>
                    <Input
                      id="studentCount"
                      name="student_count"
                      type="number"
                      defaultValue={customer.student_count || ""}
                      placeholder="500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="staffCount">Number of Staff</Label>
                    <Input
                      id="staffCount"
                      name="staff_count"
                      type="number"
                      defaultValue={customer.staff_count || ""}
                      placeholder="50"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Contact Information
            </CardTitle>
            <CardDescription>Update phone numbers and contact details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Phone Numbers</Label>
                <Button type="button" variant="outline" size="sm" onClick={addPhoneNumber}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Phone
                </Button>
              </div>
              {phoneNumbers.map((phone, index) => (
                <div key={phone.id} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input
                      placeholder="+254712345678"
                      value={phone.number}
                      onChange={(e) => updatePhoneNumber(phone.id, "number", e.target.value)}
                      required={index === 0}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={phone.type} onValueChange={(value) => updatePhoneNumber(phone.id, "type", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mobile">Mobile</SelectItem>
                        <SelectItem value="office">Office</SelectItem>
                        <SelectItem value="home">Home</SelectItem>
                        <SelectItem value="fax">Fax</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant={phone.isPrimary ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPrimaryPhone(phone.id)}
                    >
                      {phone.isPrimary ? "Primary" : "Set Primary"}
                    </Button>
                    {phoneNumbers.length > 1 && (
                      <Button type="button" variant="outline" size="sm" onClick={() => removePhoneNumber(phone.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            {/* Emergency Contacts */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Emergency Contacts</Label>
                <Button type="button" variant="outline" size="sm" onClick={addEmergencyContact}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Contact
                </Button>
              </div>
              {emergencyContacts.map((contact, index) => (
                <div key={contact.id} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      placeholder="Jane Doe"
                      value={contact.name}
                      onChange={(e) => updateEmergencyContact(contact.id, "name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      placeholder="+254712345678"
                      value={contact.phone}
                      onChange={(e) => updateEmergencyContact(contact.id, "phone", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Relationship</Label>
                    <Select
                      value={contact.relationship}
                      onValueChange={(value) => updateEmergencyContact(contact.id, "relationship", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spouse">Spouse</SelectItem>
                        <SelectItem value="parent">Parent</SelectItem>
                        <SelectItem value="sibling">Sibling</SelectItem>
                        <SelectItem value="child">Child</SelectItem>
                        <SelectItem value="friend">Friend</SelectItem>
                        <SelectItem value="colleague">Colleague</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center">
                    {emergencyContacts.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeEmergencyContact(contact.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Address Information with GPS Coordinates
            </CardTitle>
            <CardDescription>Update physical and billing address details with precise GPS locations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Physical Address */}
            <div className="space-y-4">
              <h4 className="font-medium text-lg">Physical Address</h4>
              <div className="space-y-2">
                <Label htmlFor="physicalAddress">Street Address</Label>
                <Input
                  id="physicalAddress"
                  name="physical_address"
                  defaultValue={customer?.physical_address || customer?.address || ""}
                  placeholder="123 Main Street, Apartment 4B"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="physicalCity">City</Label>
                  <Input
                    id="physicalCity"
                    name="physical_city"
                    defaultValue={customer?.physical_city || ""}
                    placeholder="Nairobi"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="physicalCounty">County/State</Label>
                  <Input
                    id="physicalCounty"
                    name="physical_county"
                    defaultValue={customer?.physical_county || ""}
                    placeholder="Nairobi County"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="physicalPostalCode">Postal Code</Label>
                  <Input
                    id="physicalPostalCode"
                    name="physical_postal_code"
                    defaultValue={customer?.physical_postal_code || ""}
                    placeholder="00100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="physicalCountry">Country</Label>
                  <Select name="physical_country" defaultValue={customer?.physical_country || "kenya"}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kenya">Kenya</SelectItem>
                      <SelectItem value="uganda">Uganda</SelectItem>
                      <SelectItem value="tanzania">Tanzania</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Physical Address Map */}
              <MapPicker
                title="Physical Address Location"
                onLocationSelect={handlePhysicalLocationSelect}
                initialLat={physicalCoordinates.lat}
                initialLng={physicalCoordinates.lng}
                height="350px"
              />
            </div>

            <Separator />

            {/* Billing Address */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-lg">Billing Address</h4>
                <div className="flex items-center space-x-2">
                  <Switch id="sameAsPhysical" checked={sameAsPhysical} onCheckedChange={handleSameAsPhysicalChange} />
                  <Label htmlFor="sameAsPhysical">Same as physical address</Label>
                </div>
              </div>

              {!sameAsPhysical && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="billingAddress">Street Address</Label>
                    <Input
                      id="billingAddress"
                      name="billing_address"
                      defaultValue={customer?.billing_address || ""}
                      placeholder="123 Main Street, Apartment 4B"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="billingCity">City</Label>
                      <Input
                        id="billingCity"
                        name="billing_city"
                        defaultValue={customer?.billing_city || ""}
                        placeholder="Nairobi"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="billingCounty">County/State</Label>
                      <Input
                        id="billingCounty"
                        name="billing_county"
                        defaultValue={customer?.billing_county || ""}
                        placeholder="Nairobi County"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="billingPostalCode">Postal Code</Label>
                      <Input
                        id="billingPostalCode"
                        name="billing_postal_code"
                        defaultValue={customer?.billing_postal_code || ""}
                        placeholder="00100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="billingCountry">Country</Label>
                      <Select name="billing_country" defaultValue={customer?.billing_country || "kenya"}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kenya">Kenya</SelectItem>
                          <SelectItem value="uganda">Uganda</SelectItem>
                          <SelectItem value="tanzania">Tanzania</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Billing Address Map */}
                  <MapPicker
                    title="Billing Address Location"
                    onLocationSelect={handleBillingLocationSelect}
                    initialLat={billingCoordinates.lat}
                    initialLng={billingCoordinates.lng}
                    height="350px"
                  />
                </>
              )}

              {sameAsPhysical && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Billing address and GPS coordinates will be the same as physical address.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Service Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Service Configuration
            </CardTitle>
            <CardDescription>Update the customer's service settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="connectionType">Connection Type</Label>
                <Select name="connection_type" defaultValue={customer.connection_type || ""}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select connection type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fiber">Fiber Optic</SelectItem>
                    <SelectItem value="wireless">Wireless</SelectItem>
                    <SelectItem value="cable">Cable</SelectItem>
                    <SelectItem value="dsl">DSL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="billingCycle">Billing Cycle</Label>
                <Select name="billing_cycle" defaultValue={customer.billing_cycle || "monthly"}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="semi-annual">Semi-Annual</SelectItem>
                    <SelectItem value="annual">Annual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch id="autoRenewal" name="auto_renewal" defaultChecked={customer.auto_renewal || false} />
                <Label htmlFor="autoRenewal">Enable auto-renewal</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="paperlessBilling"
                  name="paperless_billing"
                  defaultChecked={customer.paperless_billing || false}
                />
                <Label htmlFor="paperlessBilling">Paperless billing (email invoices)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="smsNotifications"
                  name="sms_notifications"
                  defaultChecked={customer.sms_notifications || false}
                />
                <Label htmlFor="smsNotifications">SMS notifications</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Equipment & Inventory Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Equipment & Inventory Selection
            </CardTitle>
            <CardDescription>Update equipment and inventory items for this customer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {loadingInventory ? (
              <div className="flex items-center justify-center p-8">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm text-muted-foreground">Loading inventory items...</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Label className="text-base font-medium">Current Equipment Assignment</Label>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Equipment selection functionality available. Current assignments will be preserved unless modified.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Technical Requirements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Technical Requirements
            </CardTitle>
            <CardDescription>Update technical requirements and installation details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="connectionType">Connection Type</Label>
                <Select name="connection_type" defaultValue={customer?.connection_type || ""}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select connection type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fiber">Fiber Optic</SelectItem>
                    <SelectItem value="wireless">Wireless</SelectItem>
                    <SelectItem value="cable">Cable</SelectItem>
                    <SelectItem value="dsl">DSL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="equipmentNeeded">Equipment Needed</Label>
                <Select name="equipment_needed" defaultValue={customer?.equipment_needed || ""}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select equipment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="router-only">Router Only</SelectItem>
                    <SelectItem value="router-modem">Router + Modem</SelectItem>
                    <SelectItem value="full-package">Full Package (Router, Modem, Cables)</SelectItem>
                    <SelectItem value="customer-provided">Customer Provided</SelectItem>
                    <SelectItem value="custom-selection">Custom Selection</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="installationNotes">Installation Notes</Label>
              <Textarea
                id="installationNotes"
                name="installation_notes"
                defaultValue={customer?.installation_notes || ""}
                placeholder="Special installation requirements, access instructions, preferred time slots..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="technicalContact">Technical Contact Person</Label>
              <Input
                id="technicalContact"
                name="technical_contact"
                defaultValue={customer?.technical_contact || ""}
                placeholder="Name of person to contact for technical issues"
              />
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Additional Information
            </CardTitle>
            <CardDescription>Update additional notes and special requirements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="referralSource">How did you hear about us?</Label>
              <Select name="referral_source" defaultValue={customer.referral_source || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Select referral source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="google">Google Search</SelectItem>
                  <SelectItem value="social-media">Social Media</SelectItem>
                  <SelectItem value="referral">Friend/Family Referral</SelectItem>
                  <SelectItem value="advertisement">Advertisement</SelectItem>
                  <SelectItem value="existing-customer">Existing Customer</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialRequirements">Special Requirements</Label>
              <Textarea
                id="specialRequirements"
                name="special_requirements"
                defaultValue={customer.special_requirements || ""}
                placeholder="Any special requirements, accessibility needs, or important information about the customer..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salesRep">Sales Representative</Label>
                <Select name="sales_rep" defaultValue={customer.sales_rep || ""}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sales rep" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="john-doe">John Doe</SelectItem>
                    <SelectItem value="jane-smith">Jane Smith</SelectItem>
                    <SelectItem value="bob-johnson">Bob Johnson</SelectItem>
                    <SelectItem value="alice-brown">Alice Brown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountManager">Account Manager</Label>
                <Select name="account_manager" defaultValue={customer.account_manager || ""}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account manager" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sarah-wilson">Sarah Wilson</SelectItem>
                    <SelectItem value="mike-davis">Mike Davis</SelectItem>
                    <SelectItem value="lisa-garcia">Lisa Garcia</SelectItem>
                    <SelectItem value="tom-martinez">Tom Martinez</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end space-x-2">
          <Button type="button" variant="outline" asChild>
            <Link href="/customers">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating Customer..." : "Update Customer"}
          </Button>
        </div>
      </form>
    </div>
  )
}
