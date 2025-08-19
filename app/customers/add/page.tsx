"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { MapPicker } from "@/components/ui/map-picker"
import {
  ArrowLeft,
  Plus,
  Trash2,
  User,
  Building2,
  GraduationCap,
  Phone,
  MapPin,
  CreditCard,
  Settings,
  Users,
  Shield,
  Key,
  RefreshCw,
  Package,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function AddCustomerPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [servicePlans, setServicePlans] = useState<any[]>([])
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [loadingPlans, setLoadingPlans] = useState(true)
  const [inventoryItems, setInventoryItems] = useState<any[]>([])
  const [itemsByCategory, setItemsByCategory] = useState<Record<string, any[]>>({})
  const [selectedItems, setSelectedItems] = useState<Array<{ id: number; quantity: number; item: any }>>([])
  const [loadingInventory, setLoadingInventory] = useState(true)
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [customerType, setCustomerType] = useState("individual")
  const [phoneNumbers, setPhoneNumbers] = useState([{ id: 1, number: "", type: "mobile", isPrimary: true }])
  const [emergencyContacts, setEmergencyContacts] = useState([{ id: 1, name: "", phone: "", relationship: "" }])
  const [physicalCoordinates, setPhysicalCoordinates] = useState({ lat: -1.2921, lng: 36.8219 })
  const [billingCoordinates, setBillingCoordinates] = useState({ lat: -1.2921, lng: 36.8219 })
  const [sameAsPhysical, setSameAsPhysical] = useState(true)
  const [isClient, setIsClient] = useState(false)

  // Portal credentials state
  const [portalCredentials, setPortalCredentials] = useState({
    loginId: "",
    username: "",
    password: "",
    autoGeneratePassword: true,
  })

  useEffect(() => {
    setIsClient(true)

    // Auto-generate initial portal credentials
    generatePortalCredentials()

    // Load Leaflet CSS
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
    document.head.appendChild(link)

    // Load Leaflet JS
    const script = document.createElement("script")
    script.src = "https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(link)
      document.head.removeChild(script)
    }
  }, [])

  useEffect(() => {
    const fetchServicePlans = async () => {
      try {
        const response = await fetch("/api/service-plans")
        const data = await response.json()

        if (data.success) {
          setServicePlans(data.plans)
        } else {
          toast({
            title: "Warning",
            description: "Could not load service plans. Using default options.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error fetching service plans:", error)
        toast({
          title: "Warning",
          description: "Could not load service plans. Using default options.",
          variant: "destructive",
        })
      } finally {
        setLoadingPlans(false)
      }
    }

    const fetchInventoryItems = async () => {
      try {
        const response = await fetch("/api/inventory/available")
        const data = await response.json()

        if (data.success) {
          setInventoryItems(data.items)
          setItemsByCategory(data.itemsByCategory)
        } else {
          toast({
            title: "Warning",
            description: "Could not load inventory items.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error fetching inventory items:", error)
        toast({
          title: "Warning",
          description: "Could not load inventory items.",
          variant: "destructive",
        })
      } finally {
        setLoadingInventory(false)
      }
    }

    fetchServicePlans()
    fetchInventoryItems()
  }, [])

  const generatePortalCredentials = () => {
    const timestamp = Date.now()
    const randomNum = Math.floor(Math.random() * 1000)

    setPortalCredentials((prev) => ({
      ...prev,
      loginId: `TW${timestamp.toString().slice(-6)}${randomNum.toString().padStart(3, "0")}`,
      username: `customer_${timestamp.toString().slice(-6)}`,
      password: prev.autoGeneratePassword ? generateRandomPassword() : prev.password,
    }))
  }

  const generateRandomPassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
    let password = ""
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return password
  }

  const handlePortalCredentialChange = (field: string, value: string | boolean) => {
    setPortalCredentials((prev) => {
      const updated = { ...prev, [field]: value }

      // Auto-generate password if toggle is on and we're changing the toggle
      if (field === "autoGeneratePassword" && value === true) {
        updated.password = generateRandomPassword()
      }

      return updated
    })
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

  const handlePhysicalLocationSelect = (lat: number, lng: number, address?: string) => {
    setPhysicalCoordinates({ lat, lng })
    if (sameAsPhysical) {
      setBillingCoordinates({ lat, lng })
    }
  }

  const handleBillingLocationSelect = (lat: number, lng: number, address?: string) => {
    setBillingCoordinates({ lat, lng })
  }

  const handleSameAsPhysicalChange = (checked: boolean) => {
    setSameAsPhysical(checked)
    if (checked) {
      setBillingCoordinates(physicalCoordinates)
    }
  }

  const handlePlanSelection = (planId: string) => {
    const plan = servicePlans.find((p) => p.id.toString() === planId)
    setSelectedPlan(plan)
  }

  const addInventoryItem = (item: any) => {
    const existingItem = selectedItems.find((selected) => selected.id === item.id)
    if (existingItem) {
      setSelectedItems(
        selectedItems.map((selected) =>
          selected.id === item.id ? { ...selected, quantity: selected.quantity + 1 } : selected,
        ),
      )
    } else {
      setSelectedItems([...selectedItems, { id: item.id, quantity: 1, item }])
    }
  }

  const removeInventoryItem = (itemId: number) => {
    setSelectedItems(selectedItems.filter((selected) => selected.id !== itemId))
  }

  const updateItemQuantity = (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeInventoryItem(itemId)
    } else {
      setSelectedItems(selectedItems.map((selected) => (selected.id === itemId ? { ...selected, quantity } : selected)))
    }
  }

  const getTotalInventoryCost = () => {
    return selectedItems.reduce((total, selected) => total + selected.item.unitCost * selected.quantity, 0)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount / 100) // Convert from cents
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(event.currentTarget)

      if (selectedPlan) {
        formData.set("plan_name", selectedPlan.name)
        formData.set("plan_price", selectedPlan.price.toString())
        formData.set("plan_speed", selectedPlan.speed)
      }

      if (selectedItems.length > 0) {
        formData.set("selected_inventory", JSON.stringify(selectedItems))
        formData.set("inventory_total_cost", getTotalInventoryCost().toString())
      }

      const response = await fetch("/api/customers", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Customer has been added successfully.",
        })
        // Reset form or redirect
        event.currentTarget.reset()
        setSelectedPlan(null)
        setSelectedItems([])
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "Failed to add customer. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isClient) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/customers">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Customers
          </Link>
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Add New Customer</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Type Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Type
            </CardTitle>
            <CardDescription>Select the type of customer you're adding</CardDescription>
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

        {/* Portal Access Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Portal Access Configuration
            </CardTitle>
            <CardDescription>
              Set up customer portal login credentials for M-Pesa transactions and account management
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
            <CardDescription>Enter the customer's basic details</CardDescription>
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
                  <Input id="lastName" name="last_name" placeholder="Doe" required />
                </div>
              )}
              {customerType !== "individual" && (
                <div className="space-y-2">
                  <Label htmlFor="contactPerson">Primary Contact Person</Label>
                  <Input id="contactPerson" name="contact_person" placeholder="John Doe" required />
                </div>
              )}
            </div>

            {customerType === "individual" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input id="dateOfBirth" name="date_of_birth" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select name="gender">
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
                  <Input id="nationalId" name="national_id" placeholder="12345678" />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" type="email" placeholder="john@example.com" required />
            </div>

            {customerType !== "individual" && (
              <div className="space-y-2">
                <Label htmlFor="alternateEmail">Alternate Email</Label>
                <Input id="alternateEmail" name="alternate_email" type="email" placeholder="billing@company.com" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Business/Tax Information */}
        {customerType !== "individual" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Business & Tax Information
              </CardTitle>
              <CardDescription>Enter business registration and tax details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vatPin">VAT PIN Number</Label>
                  <Input id="vatPin" name="vat_pin" placeholder="P051234567A" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxId">Tax Identification Number</Label>
                  <Input id="taxId" name="tax_id" placeholder="123456789" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessRegNo">Business Registration Number</Label>
                  <Input id="businessRegNo" name="business_reg_no" placeholder="BRN123456789" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type</Label>
                  <Select name="business_type">
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
                    <Select>
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
                    <Select>
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
                    <Select>
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
                    <Input id="studentCount" name="student_count" type="number" placeholder="500" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="staffCount">Number of Staff</Label>
                    <Input id="staffCount" name="staff_count" type="number" placeholder="50" />
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
            <CardDescription>Manage phone numbers and contact details</CardDescription>
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

        {/* Address Information with Maps */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Address Information with GPS Coordinates
            </CardTitle>
            <CardDescription>Enter physical and billing address details with precise GPS locations</CardDescription>
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
                  placeholder="123 Main Street, Apartment 4B"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="physicalCity">City</Label>
                  <Input id="physicalCity" name="physical_city" placeholder="Nairobi" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="physicalCounty">County/State</Label>
                  <Input id="physicalCounty" name="physical_county" placeholder="Nairobi County" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="physicalPostalCode">Postal Code</Label>
                  <Input id="physicalPostalCode" name="physical_postal_code" placeholder="00100" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="physicalCountry">Country</Label>
                  <Select defaultValue="kenya" name="physical_country">
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
                    <Input id="billingAddress" name="billing_address" placeholder="123 Main Street, Apartment 4B" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="billingCity">City</Label>
                      <Input id="billingCity" name="billing_city" placeholder="Nairobi" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="billingCounty">County/State</Label>
                      <Input id="billingCounty" name="billing_county" placeholder="Nairobi County" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="billingPostalCode">Postal Code</Label>
                      <Input id="billingPostalCode" name="billing_postal_code" placeholder="00100" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="billingCountry">Country</Label>
                      <Select defaultValue="kenya" name="billing_country">
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
            <CardDescription>Configure the customer's initial service settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="servicePlan">Initial Service Plan</Label>
                {loadingPlans ? (
                  <div className="flex items-center space-x-2 p-3 border rounded-md">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-sm text-muted-foreground">Loading service plans...</span>
                  </div>
                ) : (
                  <Select name="service_plan" onValueChange={handlePlanSelection}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a plan" />
                    </SelectTrigger>
                    <SelectContent>
                      {servicePlans.map((plan) => (
                        <SelectItem key={plan.id} value={plan.id.toString()}>
                          <div className="flex flex-col">
                            <span className="font-medium">{plan.name}</span>
                            <span className="text-sm text-muted-foreground">
                              {formatCurrency(plan.price * 100)}/month - {plan.speed}
                              {plan.fupLimit && ` (${plan.fupLimit}GB FUP)`}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Initial Status</Label>
                <Select defaultValue="pending" name="status">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending Installation</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {selectedPlan && (
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-900">Selected Plan Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Plan:</span> {selectedPlan.name}
                    </div>
                    <div>
                      <span className="font-medium">Category:</span> {selectedPlan.category}
                    </div>
                    <div>
                      <span className="font-medium">Speed:</span> {selectedPlan.speed}
                    </div>
                    <div>
                      <span className="font-medium">Monthly Price:</span> {formatCurrency(selectedPlan.price * 100)}
                    </div>
                    {selectedPlan.fupLimit && (
                      <>
                        <div>
                          <span className="font-medium">FUP Limit:</span> {selectedPlan.fupLimit}GB
                        </div>
                        <div>
                          <span className="font-medium">After FUP:</span> {selectedPlan.fupSpeed}
                        </div>
                      </>
                    )}
                    {selectedPlan.setupFee > 0 && (
                      <div>
                        <span className="font-medium">Setup Fee:</span> {formatCurrency(selectedPlan.setupFee * 100)}
                      </div>
                    )}
                    <div>
                      <span className="font-medium">Installation:</span>{" "}
                      {formatCurrency(selectedPlan.installationFee * 100)}
                    </div>
                  </div>
                  <div className="pt-2 border-t border-blue-300">
                    <p className="text-sm text-blue-800">{selectedPlan.description}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="installationDate">Preferred Installation Date</Label>
                <Input id="installationDate" name="installation_date" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billingCycle">Billing Cycle</Label>
                <Select defaultValue="monthly" name="billing_cycle">
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
                <Switch id="autoRenewal" defaultChecked name="auto_renewal" />
                <Label htmlFor="autoRenewal">Enable auto-renewal</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="paperlessBilling" defaultChecked name="paperless_billing" />
                <Label htmlFor="paperlessBilling">Paperless billing (email invoices)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="smsNotifications" defaultChecked name="sms_notifications" />
                <Label htmlFor="smsNotifications">SMS notifications</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Equipment & Inventory Selection section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Equipment & Inventory Selection
            </CardTitle>
            <CardDescription>Select equipment and inventory items needed for installation</CardDescription>
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
              <>
                {/* Available Inventory by Category */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">Available Equipment</Label>
                  {Object.entries(itemsByCategory).map(([category, items]) => (
                    <div key={category} className="space-y-3">
                      <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">{category}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {items.map((item) => (
                          <Card key={item.id} className="p-4 hover:shadow-md transition-shadow">
                            <div className="space-y-2">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h5 className="font-medium text-sm">{item.name}</h5>
                                  <p className="text-xs text-muted-foreground">{item.sku}</p>
                                </div>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => addInventoryItem(item)}
                                  disabled={item.stockQuantity <= 0}
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  Add
                                </Button>
                              </div>
                              <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span>Price:</span>
                                  <span className="font-medium">{formatCurrency(item.unitCost)}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                  <span>Stock:</span>
                                  <span className={item.stockQuantity <= 5 ? "text-orange-600" : "text-green-600"}>
                                    {item.stockQuantity} available
                                  </span>
                                </div>
                                {item.description && (
                                  <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                                )}
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Selected Items Summary */}
                {selectedItems.length > 0 && (
                  <Card className="bg-green-50 border-green-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-green-900 flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Selected Equipment ({selectedItems.length} items)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {selectedItems.map((selected) => (
                        <div
                          key={selected.id}
                          className="flex items-center justify-between p-3 bg-white rounded-lg border"
                        >
                          <div className="flex-1">
                            <div className="font-medium text-sm">{selected.item.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {selected.item.sku} • {formatCurrency(selected.item.unitCost)} each
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => updateItemQuantity(selected.id, selected.quantity - 1)}
                            >
                              -
                            </Button>
                            <span className="w-8 text-center text-sm font-medium">{selected.quantity}</span>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => updateItemQuantity(selected.id, selected.quantity + 1)}
                              disabled={selected.quantity >= selected.item.stockQuantity}
                            >
                              +
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => removeInventoryItem(selected.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="text-right ml-4">
                            <div className="font-medium text-sm">
                              {formatCurrency(selected.item.unitCost * selected.quantity)}
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="border-t pt-3 flex justify-between items-center">
                        <span className="font-medium">Total Equipment Cost:</span>
                        <span className="text-lg font-bold text-green-700">
                          {formatCurrency(getTotalInventoryCost())}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
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
            <CardDescription>Specify technical requirements and installation details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="connectionType">Connection Type</Label>
                <Select name="connection_type">
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
                <Select name="equipment_needed">
                  <SelectTrigger>
                    <SelectValue placeholder="Select equipment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="router-only">Router Only</SelectItem>
                    <SelectItem value="router-modem">Router + Modem</SelectItem>
                    <SelectItem value="full-package">Full Package (Router, Modem, Cables)</SelectItem>
                    <SelectItem value="customer-provided">Customer Provided</SelectItem>
                    <SelectItem value="custom-selection">Custom Selection (see above)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="installationNotes">Installation Notes</Label>
              <Textarea
                id="installationNotes"
                name="installation_notes"
                placeholder="Special installation requirements, access instructions, preferred time slots, GPS coordinates will help technicians locate the property easily..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="technicalContact">Technical Contact Person</Label>
              <Input
                id="technicalContact"
                name="technical_contact"
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
            <CardDescription>Any additional notes or special requirements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="referralSource">How did you hear about us?</Label>
              <Select name="referral_source">
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
                placeholder="Any special requirements, accessibility needs, or important information about the customer..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="internalNotes">Internal Notes</Label>
              <Textarea
                id="internalNotes"
                name="internal_notes"
                placeholder={`Internal notes for staff (not visible to customer). Portal Login ID: ${portalCredentials.loginId}, GPS coordinates: Physical (${physicalCoordinates.lat.toFixed(6)}, ${physicalCoordinates.lng.toFixed(6)}), Billing (${billingCoordinates.lat.toFixed(6)}, ${billingCoordinates.lng.toFixed(6)})`}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salesRep">Sales Representative</Label>
                <Select name="sales_rep">
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
                <Select name="account_manager">
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
            {isSubmitting ? "Adding Customer..." : "Add Customer"}
          </Button>
        </div>
      </form>
    </div>
  )
}
