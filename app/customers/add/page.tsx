"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPicker } from "@/components/ui/map-picker"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { User, Mail, Phone, MapPin, Building, CreditCard, Shield, CalendarIcon, Save, UserPlus, AlertCircle, CheckCircle, Key, Smartphone } from 'lucide-react'
import { toast } from "@/hooks/use-toast"

export default function AddCustomerPage() {
  const [activeTab, setActiveTab] = useState("personal")
  const [isLoading, setIsLoading] = useState(false)
  const [coordinates, setCoordinates] = useState({ lat: -1.2921, lng: 36.8219 })
  const [installationDate, setInstallationDate] = useState<Date>()
  const [autoGeneratePortalId, setAutoGeneratePortalId] = useState(true)
  const [portalLoginId, setPortalLoginId] = useState("")
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    alternatePhone: "",
    idNumber: "",
    dateOfBirth: "",
    
    // Address Information
    physicalAddress: "",
    postalAddress: "",
    city: "",
    postalCode: "",
    county: "",
    
    // Business Information (if applicable)
    isBusinessCustomer: false,
    companyName: "",
    businessRegistration: "",
    taxPin: "",
    contactPerson: "",
    
    // Service Information
    customerType: "individual",
    connectionType: "fiber",
    installationAddress: "",
    
    // Portal Account
    portalUsername: "",
    portalPassword: "",
    sendWelcomeEmail: true,
    
    // Payment Information
    preferredPaymentMethod: "mpesa",
    mpesaNumber: "",
    bankAccount: "",
    
    // Additional Information
    notes: "",
    referredBy: "",
    marketingConsent: false,
  })

  const generatePortalId = () => {
    const firstName = formData.firstName.toLowerCase()
    const lastName = formData.lastName.toLowerCase()
    const random = Math.floor(Math.random() * 999) + 1
    const id = `${firstName}${lastName}${random.toString().padStart(3, '0')}`
    setPortalLoginId(id)
    setFormData(prev => ({ ...prev, portalUsername: id }))
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Auto-generate portal ID when name changes
    if ((field === "firstName" || field === "lastName") && autoGeneratePortalId) {
      setTimeout(generatePortalId, 100)
    }
    
    // Auto-fill M-Pesa number with phone number
    if (field === "phone" && formData.preferredPaymentMethod === "mpesa") {
      setFormData(prev => ({ ...prev, mpesaNumber: value as string }))
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: "Customer added successfully",
        description: `${formData.firstName} ${formData.lastName} has been added with Portal ID: ${portalLoginId}`,
      })
      
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        alternatePhone: "",
        idNumber: "",
        dateOfBirth: "",
        physicalAddress: "",
        postalAddress: "",
        city: "",
        postalCode: "",
        county: "",
        isBusinessCustomer: false,
        companyName: "",
        businessRegistration: "",
        taxPin: "",
        contactPerson: "",
        customerType: "individual",
        connectionType: "fiber",
        installationAddress: "",
        portalUsername: "",
        portalPassword: "",
        sendWelcomeEmail: true,
        preferredPaymentMethod: "mpesa",
        mpesaNumber: "",
        bankAccount: "",
        notes: "",
        referredBy: "",
        marketingConsent: false,
      })
      setPortalLoginId("")
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add customer. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Add New Customer</h2>
          <p className="text-muted-foreground">Create a new customer account with portal access</p>
        </div>
        <Badge variant="outline" className="bg-green-50 text-green-700">
          <UserPlus className="mr-1 h-3 w-3" />
          New Customer
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="address">Address</TabsTrigger>
          <TabsTrigger value="service">Service Details</TabsTrigger>
          <TabsTrigger value="portal">Portal Account</TabsTrigger>
          <TabsTrigger value="payment">Payment Info</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Personal Information</span>
                </CardTitle>
                <CardDescription>Basic customer information and contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="john@example.com"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="+254712345678"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alternatePhone">Alternate Phone</Label>
                    <Input
                      id="alternatePhone"
                      value={formData.alternatePhone}
                      onChange={(e) => handleInputChange("alternatePhone", e.target.value)}
                      placeholder="+254712345679"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="idNumber">ID/Passport Number</Label>
                    <Input
                      id="idNumber"
                      value={formData.idNumber}
                      onChange={(e) => handleInputChange("idNumber", e.target.value)}
                      placeholder="12345678"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="h-5 w-5" />
                  <span>Business Information</span>
                </CardTitle>
                <CardDescription>Complete if this is a business customer</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isBusinessCustomer"
                    checked={formData.isBusinessCustomer}
                    onCheckedChange={(checked) => handleInputChange("isBusinessCustomer", checked as boolean)}
                  />
                  <Label htmlFor="isBusinessCustomer">This is a business customer</Label>
                </div>

                {formData.isBusinessCustomer && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name *</Label>
                      <Input
                        id="companyName"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange("companyName", e.target.value)}
                        placeholder="Acme Corporation"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="businessRegistration">Business Registration</Label>
                        <Input
                          id="businessRegistration"
                          value={formData.businessRegistration}
                          onChange={(e) => handleInputChange("businessRegistration", e.target.value)}
                          placeholder="PVT-123456"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="taxPin">Tax PIN</Label>
                        <Input
                          id="taxPin"
                          value={formData.taxPin}
                          onChange={(e) => handleInputChange("taxPin", e.target.value)}
                          placeholder="P123456789A"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactPerson">Contact Person</Label>
                      <Input
                        id="contactPerson"
                        value={formData.contactPerson}
                        onChange={(e) => handleInputChange("contactPerson", e.target.value)}
                        placeholder="John Doe (Manager)"
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="customerType">Customer Type</Label>
                  <Select
                    value={formData.customerType}
                    onValueChange={(value) => handleInputChange("customerType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="education">Educational Institution</SelectItem>
                      <SelectItem value="government">Government</SelectItem>
                      <SelectItem value="ngo">NGO/Non-Profit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="address" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Address Information</span>
                </CardTitle>
                <CardDescription>Customer's physical and postal address</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="physicalAddress">Physical Address *</Label>
                  <Textarea
                    id="physicalAddress"
                    value={formData.physicalAddress}
                    onChange={(e) => handleInputChange("physicalAddress", e.target.value)}
                    placeholder="123 Main Street, Apartment 4B"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalAddress">Postal Address</Label>
                  <Input
                    id="postalAddress"
                    value={formData.postalAddress}
                    onChange={(e) => handleInputChange("postalAddress", e.target.value)}
                    placeholder="P.O. Box 12345"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      placeholder="Nairobi"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      value={formData.postalCode}
                      onChange={(e) => handleInputChange("postalCode", e.target.value)}
                      placeholder="00100"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="county">County</Label>
                  <Select
                    value={formData.county}
                    onValueChange={(value) => handleInputChange("county", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select county" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nairobi">Nairobi</SelectItem>
                      <SelectItem value="mombasa">Mombasa</SelectItem>
                      <SelectItem value="kisumu">Kisumu</SelectItem>
                      <SelectItem value="nakuru">Nakuru</SelectItem>
                      <SelectItem value="eldoret">Eldoret</SelectItem>
                      <SelectItem value="thika">Thika</SelectItem>
                      <SelectItem value="malindi">Malindi</SelectItem>
                      <SelectItem value="kitale">Kitale</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Location Map</CardTitle>
                <CardDescription>Pin the exact location for installation</CardDescription>
              </CardHeader>
              <CardContent>
                <MapPicker
                  coordinates={coordinates}
                  onCoordinatesChange={setCoordinates}
                  height={300}
                />
                <div className="mt-4 text-sm text-muted-foreground">
                  <div>Latitude: {coordinates.lat.toFixed(6)}</div>
                  <div>Longitude: {coordinates.lng.toFixed(6)}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="service" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Service Configuration</CardTitle>
              <CardDescription>Configure the customer's internet service details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="connectionType">Connection Type</Label>
                    <Select
                      value={formData.connectionType}
                      onValueChange={(value) => handleInputChange("connectionType", value)}
                    >
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
                    <Label htmlFor="installationAddress">Installation Address</Label>
                    <Textarea
                      id="installationAddress"
                      value={formData.installationAddress}
                      onChange={(e) => handleInputChange("installationAddress", e.target.value)}
                      placeholder="Specific installation location (if different from physical address)"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Installation Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {installationDate ? format(installationDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={installationDate}
                          onSelect={setInstallationDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="referredBy">Referred By</Label>
                    <Input
                      id="referredBy"
                      value={formData.referredBy}
                      onChange={(e) => handleInputChange("referredBy", e.target.value)}
                      placeholder="Customer name or reference code"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      placeholder="Any additional information about the customer"
                      rows={4}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="marketingConsent"
                      checked={formData.marketingConsent}
                      onCheckedChange={(checked) => handleInputChange("marketingConsent", checked as boolean)}
                    />
                    <Label htmlFor="marketingConsent">Customer consents to marketing communications</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="portal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Key className="h-5 w-5" />
                <span>Portal Account Setup</span>
              </CardTitle>
              <CardDescription>
                Create customer portal account - the Portal Login ID will be used for all payments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div className="text-sm">
                    <div className="font-medium text-blue-900">Payment Account Number</div>
                    <div className="text-blue-700 mt-1">
                      The Portal Login ID will serve as the customer's account number for all payment platforms including M-Pesa, Airtel Money, and bank transfers.
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="portalUsername">Portal Login ID (Account Number) *</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="portalUsername"
                        value={portalLoginId || formData.portalUsername}
                        onChange={(e) => {
                          setPortalLoginId(e.target.value)
                          handleInputChange("portalUsername", e.target.value)
                        }}
                        placeholder="john001"
                        className="font-mono"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={generatePortalId}
                        disabled={!formData.firstName || !formData.lastName}
                      >
                        Generate
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      This will be used as the account number for payments
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="autoGeneratePortalId"
                      checked={autoGeneratePortalId}
                      onCheckedChange={(checked) => setAutoGeneratePortalId(checked as boolean)}
                    />
                    <Label htmlFor="autoGeneratePortalId">Auto-generate when name changes</Label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="portalPassword">Portal Password *</Label>
                    <Input
                      id="portalPassword"
                      type="password"
                      value={formData.portalPassword}
                      onChange={(e) => handleInputChange("portalPassword", e.target.value)}
                      placeholder="Enter secure password"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sendWelcomeEmail"
                      checked={formData.sendWelcomeEmail}
                      onCheckedChange={(checked) => handleInputChange("sendWelcomeEmail", checked as boolean)}
                    />
                    <Label htmlFor="sendWelcomeEmail">Send welcome email with login credentials</Label>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-green-50">
                    <div className="font-medium text-green-900 mb-2">Portal Access Features</div>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• View and pay bills online</li>
                      <li>• Monitor internet usage</li>
                      <li>• Submit support tickets</li>
                      <li>• Update account information</li>
                      <li>• Download invoices and receipts</li>
                      <li>• View payment history</li>
                    </ul>
                  </div>

                  <div className="p-4 border rounded-lg bg-yellow-50">
                    <div className="font-medium text-yellow-900 mb-2">Payment Integration</div>
                    <div className="text-sm text-yellow-700 space-y-1">
                      <div>• M-Pesa: Use Portal Login ID as account number</div>
                      <div>• Airtel Money: Reference Portal Login ID</div>
                      <div>• Bank Transfer: Include Portal Login ID in reference</div>
                      <div>• Cash Payments: Quote Portal Login ID</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Payment Information</span>
              </CardTitle>
              <CardDescription>Configure preferred payment methods and billing details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="preferredPaymentMethod">Preferred Payment Method</Label>
                    <Select
                      value={formData.preferredPaymentMethod}
                      onValueChange={(value) => handleInputChange("preferredPaymentMethod", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mpesa">
                          <div className="flex items-center space-x-2">
                            <Smartphone className="h-4 w-4" />
                            <span>M-Pesa</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="airtel">
                          <div className="flex items-center space-x-2">
                            <Smartphone className="h-4 w-4" />
                            <span>Airtel Money</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="bank">
                          <div className="flex items-center space-x-2">
                            <Building className="h-4 w-4" />
                            <span>Bank Transfer</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="cash">Cash Payment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.preferredPaymentMethod === "mpesa" && (
                    <div className="space-y-2">
                      <Label htmlFor="mpesaNumber">M-Pesa Number</Label>
                      <Input
                        id="mpesaNumber"
                        value={formData.mpesaNumber}
                        onChange={(e) => handleInputChange("mpesaNumber", e.target.value)}
                        placeholder="254712345678"
                      />
                    </div>
                  )}

                  {formData.preferredPaymentMethod === "bank" && (
                    <div className="space-y-2">
                      <Label htmlFor="bankAccount">Bank Account Details</Label>
                      <Textarea
                        id="bankAccount"
                        value={formData.bankAccount}
                        onChange={(e) => handleInputChange("bankAccount", e.target.value)}
                        placeholder="Bank name, account number, branch"
                        rows={3}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-blue-50">
                    <div className="font-medium text-blue-900 mb-2">Payment Account Setup</div>
                    <div className="text-sm text-blue-700 space-y-2">
                      <div>Portal Login ID: <span className="font-mono font-bold">{portalLoginId || "Not set"}</span></div>
                      <div className="text-xs">This ID will be used for all payment transactions</div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="font-medium mb-2">Payment Instructions</div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>• Always include Portal Login ID in payment reference</div>
                      <div>• Payments are processed within 24 hours</div>
                      <div>• SMS confirmation will be sent upon payment</div>
                      <div>• Contact support for payment issues</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex items-center justify-between pt-6 border-t">
        <div className="text-sm text-muted-foreground">
          * Required fields must be completed
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => window.history.back()}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading || !formData.firstName || !formData.lastName || !formData.email || !formData.phone || !portalLoginId}
          >
            {isLoading ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4 animate-spin" />
                Creating Customer...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Create Customer
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
