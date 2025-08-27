"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Router,
  Network,
  Shield,
  Settings,
  Globe,
  Lock,
  Upload,
  Users,
  Zap,
  AlertCircle,
  CheckCircle,
  Info,
  HelpCircle,
  Eye,
  EyeOff,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function AddRouterPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showRadiusSecret, setShowRadiusSecret] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    routerName: "",
    brand: "",
    model: "",
    location: "",
    maxBandwidth: "",
    description: "",

    // Step 2: Connection Configuration
    connectionType: "public-ip",
    managementIP: "",
    managementPort: "80",
    username: "",
    password: "",
    sshPort: "22",
    vpnConfig: null as File | null,

    // Step 3: IP Pool Configuration
    selectedSubnet: "",
    dhcpEnabled: true,
    dhcpStart: "",
    dhcpEnd: "",
    dnsServers: ["8.8.8.8", "8.8.4.4"],
    gateway: "",

    // Step 4: RADIUS Configuration
    radiusEnabled: true,
    radiusServer: "",
    radiusSecret: "",
    radiusAuthPort: "1812",
    radiusAcctPort: "1813",
    nasIdentifier: "",
    interimInterval: "300",

    // Step 5: API Configuration
    apiEnabled: true,
    apiPort: "",
    apiSSL: true,
    apiVersion: "",

    // Step 6: Customer Authorization
    hotspotEnabled: true,
    loginTemplate: "default",
    sessionTimeout: "3600",
    idleTimeout: "1800",
    downloadLimit: "",
    uploadLimit: "",
    dataLimit: "",
    firewallEnabled: true,
    vpnServerEnabled: false,
    trafficShaping: true,
    contentFiltering: false,
  })

  const [serverConfigs, setServerConfigs] = useState<any>(null)

  const { toast } = useToast()
  const router = useRouter()

  const totalSteps = 6

  const routerBrands = [
    {
      value: "mikrotik",
      label: "MikroTik",
      apiSupport: true,
      defaultPort: "8728",
      models: ["RB4011iGS+", "RB5009UG+S+", "CCR1009-7G-1C-1S+", "hEX S", "RB2011UiAS-2HnD-IN"],
    },
    {
      value: "ubiquiti",
      label: "Ubiquiti",
      apiSupport: true,
      defaultPort: "443",
      models: ["EdgeRouter X", "EdgeRouter 4", "EdgeRouter 12", "UniFi Dream Machine", "EdgeRouter Pro"],
    },
    {
      value: "cisco",
      label: "Cisco",
      apiSupport: false,
      defaultPort: "443",
      models: ["ISR 4331", "ISR 4321", "ASR 1001-X", "Catalyst 9300", "ISR 1100"],
    },
    {
      value: "tplink",
      label: "TP-Link",
      apiSupport: false,
      defaultPort: "80",
      models: ["Archer C7", "Archer AX73", "Omada ER605", "TL-R600VPN", "Archer C80"],
    },
  ]

  const ipSubnets = [
    { value: "192.168.1.0/24", label: "192.168.1.0/24 - Main Network", available: 200 },
    { value: "192.168.100.0/24", label: "192.168.100.0/24 - Guest Network", available: 150 },
    { value: "10.0.0.0/24", label: "10.0.0.0/24 - Private Network", available: 250 },
    { value: "172.16.0.0/24", label: "172.16.0.0/24 - Business Network", available: 180 },
  ]

  const selectedBrand = routerBrands.find((brand) => brand.value === formData.brand)

  useEffect(() => {
    const fetchServerConfigs = async () => {
      try {
        const response = await fetch("/api/server-configs")
        if (response.ok) {
          const configs = await response.json()
          setServerConfigs(configs)
        }
      } catch (error) {
        console.error("Failed to fetch server configs:", error)
      }
    }

    fetchServerConfigs()
  }, [])

  const updateFormData = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
    if (validationErrors[key]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[key]
        return newErrors
      })
    }
  }

  const validateCurrentStep = () => {
    const errors: Record<string, string> = {}

    switch (currentStep) {
      case 1:
        if (!formData.routerName.trim()) errors.routerName = "Router name is required"
        if (!formData.brand) errors.brand = "Please select a router brand"
        if (!formData.model) errors.model = "Please select a router model"
        if (!formData.location.trim()) errors.location = "Location is required"
        if (formData.maxBandwidth && isNaN(Number(formData.maxBandwidth))) {
          errors.maxBandwidth = "Bandwidth must be a valid number"
        }
        break

      case 2:
        if (!formData.managementIP.trim()) errors.managementIP = "Management IP is required"
        if (!formData.username.trim()) errors.username = "Username is required"
        if (!formData.password.trim()) errors.password = "Password is required"

        const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
        if (formData.managementIP && !ipRegex.test(formData.managementIP)) {
          errors.managementIP = "Please enter a valid IP address"
        }

        if (
          formData.managementPort &&
          (isNaN(Number(formData.managementPort)) ||
            Number(formData.managementPort) < 1 ||
            Number(formData.managementPort) > 65535)
        ) {
          errors.managementPort = "Port must be between 1 and 65535"
        }
        break

      case 3:
        if (!formData.selectedSubnet) errors.selectedSubnet = "Please select an IP subnet"
        if (!formData.gateway.trim()) errors.gateway = "Gateway IP is required"
        if (formData.gateway && !ipRegex.test(formData.gateway)) {
          errors.gateway = "Please enter a valid gateway IP address"
        }
        if (formData.dhcpEnabled) {
          if (!formData.dhcpStart.trim()) errors.dhcpStart = "DHCP start IP is required when DHCP is enabled"
          if (!formData.dhcpEnd.trim()) errors.dhcpEnd = "DHCP end IP is required when DHCP is enabled"
        }
        break

      case 4:
        if (formData.radiusEnabled) {
          if (!formData.radiusServer.trim()) errors.radiusServer = "RADIUS server IP is required"
          if (!formData.radiusSecret.trim()) errors.radiusSecret = "RADIUS secret is required"
          if (formData.radiusServer && !ipRegex.test(formData.radiusServer)) {
            errors.radiusServer = "Please enter a valid RADIUS server IP address"
          }
        }
        break

      case 5:
        if (formData.apiEnabled && selectedBrand?.apiSupport) {
          if (!formData.apiPort.trim()) errors.apiPort = "API port is required when API is enabled"
          if (formData.brand === "mikrotik" && !formData.apiVersion) {
            errors.apiVersion = "Please select RouterOS version"
          }
        }
        break

      case 6:
        if (formData.hotspotEnabled) {
          if (!formData.sessionTimeout.trim()) errors.sessionTimeout = "Session timeout is required"
          if (!formData.idleTimeout.trim()) errors.idleTimeout = "Idle timeout is required"
        }
        break
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
    } else {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before proceeding to the next step.",
        variant: "destructive",
      })
    }
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateCurrentStep()) {
      toast({
        title: "Validation Error",
        description: "Please fix all errors before submitting.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Router Deployed Successfully",
        description: `${formData.routerName} has been configured and deployed to your network.`,
      })

      router.push("/network")
    } catch (error) {
      toast({
        title: "Deployment Failed",
        description: "Failed to deploy router. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const StepIndicator = () => (
    <div className="flex items-center justify-between mb-8">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`
            w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200
            ${
              step < currentStep
                ? "bg-green-600 text-white shadow-lg"
                : step === currentStep
                  ? "bg-blue-600 text-white shadow-lg ring-4 ring-blue-100"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }
          `}
          >
            {step < currentStep ? <Check className="h-5 w-5" /> : step}
          </div>
          {step < totalSteps && (
            <div
              className={`
              w-12 h-1 mx-2 rounded-full transition-all duration-200
              ${step < currentStep ? "bg-green-600" : "bg-gray-200"}
            `}
            />
          )}
        </div>
      ))}
    </div>
  )

  const FormField = ({
    label,
    id,
    error,
    required = false,
    helpText,
    children,
  }: {
    label: string
    id: string
    error?: string
    required?: boolean
    helpText?: string
    children: React.ReactNode
  }) => (
    <div className="space-y-2">
      <Label htmlFor={id} className="flex items-center space-x-1">
        <span>{label}</span>
        {required && <span className="text-red-500">*</span>}
        {helpText && (
          <div className="group relative">
            <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
              {helpText}
            </div>
          </div>
        )}
      </Label>
      {children}
      {error && (
        <div className="flex items-center space-x-1 text-red-600 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center space-x-2 mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.push("/network")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Network
        </Button>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Add New Router</h1>
          <p className="text-muted-foreground mt-2">Configure and deploy a new router to your network infrastructure</p>
          <div className="mt-4 text-sm text-gray-600">
            Step {currentStep} of {totalSteps}:{" "}
            {currentStep === 1
              ? "Basic Information"
              : currentStep === 2
                ? "Connection Configuration"
                : currentStep === 3
                  ? "IP Pool Configuration"
                  : currentStep === 4
                    ? "RADIUS Configuration"
                    : currentStep === 5
                      ? "API Configuration"
                      : "Customer Authorization & Hotspot"}
          </div>
        </div>

        <StepIndicator />

        <Card className="shadow-lg border-0">
          <CardContent className="p-8">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Router className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Basic Information</h2>
                    <p className="text-sm text-muted-foreground">Enter the basic details for your router</p>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <FormField label="Router Name" id="router-name" error={validationErrors.routerName} required>
                    <Input
                      id="router-name"
                      placeholder="e.g., Main Gateway Router"
                      value={formData.routerName}
                      onChange={(e) => updateFormData("routerName", e.target.value)}
                      className={validationErrors.routerName ? "border-red-500 focus:border-red-500" : ""}
                    />
                  </FormField>

                  <FormField label="Brand" id="brand" error={validationErrors.brand} required>
                    <Select
                      value={formData.brand}
                      onValueChange={(value) => {
                        updateFormData("brand", value)
                        updateFormData("model", "")
                        const brand = routerBrands.find((b) => b.value === value)
                        if (brand) {
                          updateFormData("apiPort", brand.defaultPort)
                        }
                      }}
                    >
                      <SelectTrigger className={validationErrors.brand ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select router brand" />
                      </SelectTrigger>
                      <SelectContent>
                        {routerBrands.map((brand) => (
                          <SelectItem key={brand.value} value={brand.value}>
                            <div className="flex items-center justify-between w-full">
                              <span>{brand.label}</span>
                              {brand.apiSupport && (
                                <Badge variant="secondary" className="ml-2 text-xs">
                                  API
                                </Badge>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>

                  <FormField label="Model" id="model" error={validationErrors.model} required>
                    <Select
                      value={formData.model}
                      onValueChange={(value) => updateFormData("model", value)}
                      disabled={!formData.brand}
                    >
                      <SelectTrigger className={validationErrors.model ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select router model" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedBrand?.models.map((model) => (
                          <SelectItem key={model} value={model}>
                            {model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>

                  <FormField
                    label="Location"
                    id="location"
                    error={validationErrors.location}
                    required
                    helpText="Physical location where the router will be installed"
                  >
                    <Input
                      id="location"
                      placeholder="e.g., Server Room A"
                      value={formData.location}
                      onChange={(e) => updateFormData("location", e.target.value)}
                      className={validationErrors.location ? "border-red-500 focus:border-red-500" : ""}
                    />
                  </FormField>

                  <FormField
                    label="Max Bandwidth (Mbps)"
                    id="max-bandwidth"
                    error={validationErrors.maxBandwidth}
                    helpText="Maximum bandwidth capacity of this router"
                  >
                    <Input
                      id="max-bandwidth"
                      type="number"
                      placeholder="e.g., 1000"
                      value={formData.maxBandwidth}
                      onChange={(e) => updateFormData("maxBandwidth", e.target.value)}
                      className={validationErrors.maxBandwidth ? "border-red-500 focus:border-red-500" : ""}
                    />
                  </FormField>
                </div>

                <FormField label="Description" id="description">
                  <Textarea
                    id="description"
                    placeholder="Optional description of the router's purpose and configuration"
                    value={formData.description}
                    onChange={(e) => updateFormData("description", e.target.value)}
                    rows={3}
                  />
                </FormField>

                {selectedBrand && (
                  <Alert className="border-blue-200 bg-blue-50">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      <div className="space-y-1">
                        <p>
                          <strong>Selected:</strong> {selectedBrand.label}
                        </p>
                        <p>
                          <strong>API Support:</strong>{" "}
                          {selectedBrand.apiSupport ? "✅ Available" : "❌ Manual Configuration Required"}
                        </p>
                        <p>
                          <strong>Default Management Port:</strong> {selectedBrand.defaultPort}
                        </p>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            {/* Step 2: Connection Configuration */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Network className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Connection Configuration</h2>
                    <p className="text-sm text-muted-foreground">Configure how to connect to your router</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Connection Type *</Label>
                  <RadioGroup
                    value={formData.connectionType}
                    onValueChange={(value) => updateFormData("connectionType", value)}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  >
                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value="public-ip" id="public-ip" />
                      <Label htmlFor="public-ip" className="flex items-center space-x-2 cursor-pointer">
                        <Globe className="h-5 w-5 text-blue-600" />
                        <div>
                          <div className="font-medium">Public IP Address</div>
                          <div className="text-xs text-muted-foreground">Direct internet connection</div>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value="openvpn" id="openvpn" />
                      <Label htmlFor="openvpn" className="flex items-center space-x-2 cursor-pointer">
                        <Lock className="h-5 w-5 text-green-600" />
                        <div>
                          <div className="font-medium">OpenVPN Connection</div>
                          <div className="text-xs text-muted-foreground">Secure VPN tunnel</div>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value="local" id="local" />
                      <Label htmlFor="local" className="flex items-center space-x-2 cursor-pointer">
                        <Network className="h-5 w-5 text-purple-600" />
                        <div>
                          <div className="font-medium">Local Network</div>
                          <div className="text-xs text-muted-foreground">Same network access</div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    label={
                      formData.connectionType === "public-ip"
                        ? "Public IP Address"
                        : formData.connectionType === "openvpn"
                          ? "VPN IP Address"
                          : "Local IP Address"
                    }
                    id="management-ip"
                    error={validationErrors.managementIP}
                    required
                  >
                    <Input
                      id="management-ip"
                      placeholder={formData.connectionType === "public-ip" ? "203.0.113.1" : "192.168.1.1"}
                      value={formData.managementIP}
                      onChange={(e) => updateFormData("managementIP", e.target.value)}
                      className={validationErrors.managementIP ? "border-red-500 focus:border-red-500" : ""}
                    />
                  </FormField>

                  <FormField
                    label="Management Port"
                    id="management-port"
                    error={validationErrors.managementPort}
                    helpText="Port for web management interface"
                  >
                    <Input
                      id="management-port"
                      placeholder="80"
                      value={formData.managementPort}
                      onChange={(e) => updateFormData("managementPort", e.target.value)}
                      className={validationErrors.managementPort ? "border-red-500 focus:border-red-500" : ""}
                    />
                  </FormField>

                  <FormField label="Username" id="username" error={validationErrors.username} required>
                    <Input
                      id="username"
                      placeholder="admin"
                      value={formData.username}
                      onChange={(e) => updateFormData("username", e.target.value)}
                      className={validationErrors.username ? "border-red-500 focus:border-red-500" : ""}
                    />
                  </FormField>

                  <FormField label="Password" id="password" error={validationErrors.password} required>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => updateFormData("password", e.target.value)}
                        className={validationErrors.password ? "border-red-500 focus:border-red-500 pr-10" : "pr-10"}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </FormField>

                  <FormField label="SSH Port" id="ssh-port" helpText="Port for SSH access (optional)">
                    <Input
                      id="ssh-port"
                      placeholder="22"
                      value={formData.sshPort}
                      onChange={(e) => updateFormData("sshPort", e.target.value)}
                    />
                  </FormField>
                </div>

                {formData.connectionType === "openvpn" && (
                  <div className="space-y-4">
                    {serverConfigs?.openvpn.enabled && (
                      <Alert className="border-blue-200 bg-blue-50">
                        <Info className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-blue-800">
                          <h4 className="font-medium mb-2">OpenVPN Server Configuration</h4>
                          <div className="space-y-1 text-sm">
                            <p>
                              Server: {serverConfigs.openvpn.serverIp}:{serverConfigs.openvpn.port}
                            </p>
                            <p>Protocol: {serverConfigs.openvpn.protocol.toUpperCase()}</p>
                            <p>Network: {serverConfigs.openvpn.network}</p>
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}

                    <FormField label="VPN Configuration File" id="vpn-config">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                        <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600 mb-2">Upload OpenVPN configuration file (.ovpn)</p>
                        <Input
                          type="file"
                          accept=".ovpn"
                          className="max-w-xs mx-auto"
                          onChange={(e) => updateFormData("vpnConfig", e.target.files?.[0] || null)}
                        />
                      </div>
                    </FormField>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: IP Pool Configuration */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Network className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">IP Pool Configuration</h2>
                    <p className="text-sm text-muted-foreground">Configure the IP address pool for your network</p>
                  </div>
                </div>

                <FormField label="Select IP Subnet" id="subnet" error={validationErrors.selectedSubnet} required>
                  <Select
                    value={formData.selectedSubnet}
                    onValueChange={(value) => {
                      updateFormData("selectedSubnet", value)
                      const subnet = ipSubnets.find((s) => s.value === value)
                      if (subnet) {
                        const baseIP = subnet.value.split("/")[0].split(".").slice(0, 3).join(".")
                        updateFormData("gateway", `${baseIP}.1`)
                        updateFormData("dhcpStart", `${baseIP}.100`)
                        updateFormData("dhcpEnd", `${baseIP}.200`)
                      }
                    }}
                  >
                    <SelectTrigger className={validationErrors.selectedSubnet ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select IP subnet from configuration" />
                    </SelectTrigger>
                    <SelectContent>
                      {ipSubnets.map((subnet) => (
                        <SelectItem key={subnet.value} value={subnet.value}>
                          <div className="flex items-center justify-between w-full">
                            <span>{subnet.label}</span>
                            <Badge variant="outline" className="ml-2 text-xs">
                              {subnet.available} IPs
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="dhcp-enabled"
                    checked={formData.dhcpEnabled}
                    onCheckedChange={(checked) => updateFormData("dhcpEnabled", checked)}
                  />
                  <Label htmlFor="dhcp-enabled" className="cursor-pointer">
                    Enable DHCP Server
                  </Label>
                </div>

                {formData.dhcpEnabled && (
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      label="DHCP Start IP"
                      id="dhcp-start"
                      error={validationErrors.dhcpStart}
                      required={formData.dhcpEnabled}
                    >
                      <Input
                        id="dhcp-start"
                        placeholder="192.168.1.100"
                        value={formData.dhcpStart}
                        onChange={(e) => updateFormData("dhcpStart", e.target.value)}
                        className={validationErrors.dhcpStart ? "border-red-500 focus:border-red-500" : ""}
                        disabled={!formData.dhcpEnabled}
                      />
                    </FormField>

                    <FormField
                      label="DHCP End IP"
                      id="dhcp-end"
                      error={validationErrors.dhcpEnd}
                      required={formData.dhcpEnabled}
                    >
                      <Input
                        id="dhcp-end"
                        placeholder="192.168.1.200"
                        value={formData.dhcpEnd}
                        onChange={(e) => updateFormData("dhcpEnd", e.target.value)}
                        className={validationErrors.dhcpEnd ? "border-red-500 focus:border-red-500" : ""}
                        disabled={!formData.dhcpEnabled}
                      />
                    </FormField>
                  </div>
                )}

                <div className="grid gap-6 md:grid-cols-2">
                  <FormField label="Gateway IP" id="gateway" error={validationErrors.gateway} required>
                    <Input
                      id="gateway"
                      placeholder="192.168.1.1"
                      value={formData.gateway}
                      onChange={(e) => updateFormData("gateway", e.target.value)}
                      className={validationErrors.gateway ? "border-red-500 focus:border-red-500" : ""}
                    />
                  </FormField>

                  <FormField label="Primary DNS" id="dns-primary">
                    <Input
                      id="dns-primary"
                      placeholder="8.8.8.8"
                      value={formData.dnsServers[0]}
                      onChange={(e) => {
                        const newDNS = [...formData.dnsServers]
                        newDNS[0] = e.target.value
                        updateFormData("dnsServers", newDNS)
                      }}
                    />
                  </FormField>

                  <FormField label="Secondary DNS" id="dns-secondary">
                    <Input
                      id="dns-secondary"
                      placeholder="8.8.4.4"
                      value={formData.dnsServers[1]}
                      onChange={(e) => {
                        const newDNS = [...formData.dnsServers]
                        newDNS[1] = e.target.value
                        updateFormData("dnsServers", newDNS)
                      }}
                    />
                  </FormField>
                </div>
              </div>
            )}

            {/* Step 4: RADIUS Configuration */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">RADIUS Server Configuration</h2>
                    <p className="text-sm text-muted-foreground">
                      Configure RADIUS authentication for enhanced security
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="radius-enabled"
                    checked={formData.radiusEnabled}
                    onCheckedChange={(checked) => updateFormData("radiusEnabled", checked)}
                  />
                  <Label htmlFor="radius-enabled" className="cursor-pointer">
                    Enable RADIUS Authentication & Accounting
                  </Label>
                </div>

                {formData.radiusEnabled && (
                  <>
                    {serverConfigs?.radius.enabled && (
                      <Alert className="border-green-200 bg-green-50">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                          <h4 className="font-medium mb-2">RADIUS Server Configuration</h4>
                          <div className="space-y-1 text-sm">
                            <p>Server: {serverConfigs.radius.host}</p>
                            <p>Auth Port: {serverConfigs.radius.authPort}</p>
                            <p>Acct Port: {serverConfigs.radius.acctPort}</p>
                            <p>Timeout: {serverConfigs.radius.timeout}s</p>
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="grid gap-6 md:grid-cols-2">
                      <FormField
                        label="RADIUS Server IP"
                        id="radius-server"
                        error={validationErrors.radiusServer}
                        required={formData.radiusEnabled}
                      >
                        <Input
                          id="radius-server"
                          placeholder="192.168.1.10"
                          value={formData.radiusServer}
                          onChange={(e) => updateFormData("radiusServer", e.target.value)}
                          className={validationErrors.radiusServer ? "border-red-500 focus:border-red-500" : ""}
                        />
                      </FormField>

                      <FormField
                        label="RADIUS Secret"
                        id="radius-secret"
                        error={validationErrors.radiusSecret}
                        required={formData.radiusEnabled}
                      >
                        <div className="relative">
                          <Input
                            id="radius-secret"
                            type={showRadiusSecret ? "text" : "password"}
                            placeholder="••••••••"
                            value={formData.radiusSecret}
                            onChange={(e) => updateFormData("radiusSecret", e.target.value)}
                            className={
                              validationErrors.radiusSecret ? "border-red-500 focus:border-red-500 pr-10" : "pr-10"
                            }
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowRadiusSecret(!showRadiusSecret)}
                          >
                            {showRadiusSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </FormField>

                      <FormField label="Authentication Port" id="radius-auth-port">
                        <Input
                          id="radius-auth-port"
                          placeholder="1812"
                          value={formData.radiusAuthPort}
                          onChange={(e) => updateFormData("radiusAuthPort", e.target.value)}
                        />
                      </FormField>

                      <FormField label="Accounting Port" id="radius-acct-port">
                        <Input
                          id="radius-acct-port"
                          placeholder="1813"
                          value={formData.radiusAcctPort}
                          onChange={(e) => updateFormData("radiusAcctPort", e.target.value)}
                        />
                      </FormField>

                      <FormField
                        label="NAS Identifier"
                        id="nas-identifier"
                        helpText="Network Access Server identifier (optional)"
                      >
                        <Input
                          id="nas-identifier"
                          placeholder="router-001"
                          value={formData.nasIdentifier}
                          onChange={(e) => updateFormData("nasIdentifier", e.target.value)}
                        />
                      </FormField>

                      <FormField
                        label="Interim Interval (seconds)"
                        id="interim-interval"
                        helpText="Interim accounting interval (optional)"
                      >
                        <Input
                          id="interim-interval"
                          placeholder="300"
                          value={formData.interimInterval}
                          onChange={(e) => updateFormData("interimInterval", e.target.value)}
                        />
                      </FormField>
                    </div>

                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        <div className="space-y-1">
                          <p>
                            <strong>RADIUS Features:</strong>
                          </p>
                          <ul className="list-disc list-inside space-y-1">
                            <li>Customer authentication and authorization</li>
                            <li>Session accounting for billing integration</li>
                            <li>Bandwidth control per customer</li>
                            <li>Real-time session monitoring</li>
                            <li>Automatic disconnection on payment issues</li>
                          </ul>
                        </div>
                      </AlertDescription>
                    </Alert>
                  </>
                )}
              </div>
            )}

            {/* Step 5: API Configuration */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Settings className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">API Configuration</h2>
                    <p className="text-sm text-muted-foreground">Configure API access for automated management</p>
                  </div>
                </div>

                {selectedBrand?.apiSupport ? (
                  <>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="api-enabled"
                        checked={formData.apiEnabled}
                        onCheckedChange={(checked) => updateFormData("apiEnabled", checked)}
                      />
                      <Label htmlFor="api-enabled" className="cursor-pointer">
                        Enable API Integration
                      </Label>
                    </div>

                    {formData.apiEnabled && (
                      <>
                        <div className="grid gap-6 md:grid-cols-2">
                          <FormField
                            label="API Port"
                            id="api-port"
                            error={validationErrors.apiPort}
                            required={formData.apiEnabled}
                          >
                            <Input
                              id="api-port"
                              placeholder={selectedBrand.defaultPort}
                              value={formData.apiPort}
                              onChange={(e) => updateFormData("apiPort", e.target.value)}
                              className={validationErrors.apiPort ? "border-red-500 focus:border-red-500" : ""}
                            />
                          </FormField>

                          {formData.brand === "mikrotik" && (
                            <FormField
                              label="RouterOS Version"
                              id="api-version"
                              error={validationErrors.apiVersion}
                              required={formData.apiEnabled && formData.brand === "mikrotik"}
                            >
                              <Select
                                value={formData.apiVersion}
                                onValueChange={(value) => updateFormData("apiVersion", value)}
                              >
                                <SelectTrigger className={validationErrors.apiVersion ? "border-red-500" : ""}>
                                  <SelectValue placeholder="Select RouterOS version" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="7.x">RouterOS 7.x (Latest)</SelectItem>
                                  <SelectItem value="6.x">RouterOS 6.x (Legacy)</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormField>
                          )}
                        </div>

                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id="api-ssl"
                            checked={formData.apiSSL}
                            onCheckedChange={(checked) => updateFormData("apiSSL", checked)}
                          />
                          <Label htmlFor="api-ssl" className="cursor-pointer">
                            Use SSL/TLS Encryption
                          </Label>
                        </div>

                        <Alert className="border-blue-200 bg-blue-50">
                          <Zap className="h-4 w-4 text-blue-600" />
                          <AlertDescription className="text-blue-800">
                            <div className="space-y-1">
                              <p>
                                <strong>
                                  {formData.brand === "mikrotik"
                                    ? "MikroTik API Features"
                                    : formData.brand === "ubiquiti"
                                      ? "Ubiquiti API Features"
                                      : "API Features"}
                                </strong>
                              </p>
                              <ul className="list-disc list-inside space-y-1">
                                {formData.brand === "mikrotik" && (
                                  <>
                                    <li>RouterOS API for automated configuration</li>
                                    <li>Real-time bandwidth monitoring</li>
                                    <li>Customer queue management</li>
                                    <li>Firewall rule automation</li>
                                    <li>DHCP lease management</li>
                                    <li>PPPoE server configuration</li>
                                  </>
                                )}
                                {formData.brand === "ubiquiti" && (
                                  <>
                                    <li>EdgeOS API integration</li>
                                    <li>UniFi Controller management</li>
                                    <li>Traffic analysis and reporting</li>
                                    <li>Guest network automation</li>
                                    <li>QoS policy management</li>
                                  </>
                                )}
                              </ul>
                            </div>
                          </AlertDescription>
                        </Alert>
                      </>
                    )}
                  </>
                ) : (
                  <Alert className="border-yellow-200 bg-yellow-50">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-800">
                      <div className="space-y-2">
                        <p>
                          <strong>Manual Configuration Required</strong>
                        </p>
                        <p>
                          {selectedBrand?.label} routers require manual configuration. Please configure the following
                          settings directly on the router:
                        </p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>RADIUS client configuration</li>
                          <li>DHCP server settings</li>
                          <li>Firewall rules for customer access</li>
                          <li>QoS policies for bandwidth management</li>
                          <li>SNMP for monitoring (optional)</li>
                        </ul>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            {/* Step 6: Customer Authorization & Hotspot */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Customer Authorization & Hotspot</h2>
                    <p className="text-sm text-muted-foreground">Configure customer access and hotspot settings</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="hotspot-enabled"
                    checked={formData.hotspotEnabled}
                    onCheckedChange={(checked) => updateFormData("hotspotEnabled", checked)}
                  />
                  <Label htmlFor="hotspot-enabled" className="cursor-pointer">
                    Enable Captive Portal / Hotspot
                  </Label>
                </div>

                {formData.hotspotEnabled && (
                  <>
                    <FormField label="Login Page Template" id="login-template">
                      <Select
                        value={formData.loginTemplate}
                        onValueChange={(value) => updateFormData("loginTemplate", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select login template" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">Default ISP Template</SelectItem>
                          <SelectItem value="modern">Modern Blue Theme</SelectItem>
                          <SelectItem value="corporate">Corporate Theme</SelectItem>
                          <SelectItem value="custom">Custom Template</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormField>

                    <div className="grid gap-6 md:grid-cols-2">
                      <FormField
                        label="Session Timeout (seconds)"
                        id="session-timeout"
                        error={validationErrors.sessionTimeout}
                        required={formData.hotspotEnabled}
                      >
                        <Input
                          id="session-timeout"
                          placeholder="3600"
                          value={formData.sessionTimeout}
                          onChange={(e) => updateFormData("sessionTimeout", e.target.value)}
                          className={validationErrors.sessionTimeout ? "border-red-500 focus:border-red-500" : ""}
                        />
                      </FormField>

                      <FormField
                        label="Idle Timeout (seconds)"
                        id="idle-timeout"
                        error={validationErrors.idleTimeout}
                        required={formData.hotspotEnabled}
                      >
                        <Input
                          id="idle-timeout"
                          placeholder="1800"
                          value={formData.idleTimeout}
                          onChange={(e) => updateFormData("idleTimeout", e.target.value)}
                          className={validationErrors.idleTimeout ? "border-red-500 focus:border-red-500" : ""}
                        />
                      </FormField>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Bandwidth Limits</h3>
                      <div className="grid gap-6 md:grid-cols-3">
                        <FormField label="Download Limit (Mbps)" id="download-limit">
                          <Input
                            id="download-limit"
                            placeholder="100"
                            value={formData.downloadLimit}
                            onChange={(e) => updateFormData("downloadLimit", e.target.value)}
                          />
                        </FormField>

                        <FormField label="Upload Limit (Mbps)" id="upload-limit">
                          <Input
                            id="upload-limit"
                            placeholder="50"
                            value={formData.uploadLimit}
                            onChange={(e) => updateFormData("uploadLimit", e.target.value)}
                          />
                        </FormField>

                        <FormField label="Data Limit (GB/month)" id="data-limit">
                          <Input
                            id="data-limit"
                            placeholder="500"
                            value={formData.dataLimit}
                            onChange={(e) => updateFormData("dataLimit", e.target.value)}
                          />
                        </FormField>
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Advanced Features</h3>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="firewall-enabled"
                        checked={formData.firewallEnabled}
                        onCheckedChange={(checked) => updateFormData("firewallEnabled", checked)}
                      />
                      <Label htmlFor="firewall-enabled" className="cursor-pointer">
                        Enable Firewall Management
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="vpn-server-enabled"
                        checked={formData.vpnServerEnabled}
                        onCheckedChange={(checked) => updateFormData("vpnServerEnabled", checked)}
                      />
                      <Label htmlFor="vpn-server-enabled" className="cursor-pointer">
                        Enable VPN Server
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="traffic-shaping"
                        checked={formData.trafficShaping}
                        onCheckedChange={(checked) => updateFormData("trafficShaping", checked)}
                      />
                      <Label htmlFor="traffic-shaping" className="cursor-pointer">
                        Enable Traffic Shaping
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="content-filtering"
                        checked={formData.contentFiltering}
                        onCheckedChange={(checked) => updateFormData("contentFiltering", checked)}
                      />
                      <Label htmlFor="content-filtering" className="cursor-pointer">
                        Enable Content Filtering
                      </Label>
                    </div>
                  </div>
                </div>

                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <div className="space-y-1">
                      <p>
                        <strong>ISP Management Features:</strong>
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Automated customer onboarding and authentication</li>
                        <li>Real-time bandwidth monitoring and enforcement</li>
                        <li>Integration with billing systems for payment tracking</li>
                        <li>Customer self-service portal access</li>
                        <li>Automated service suspension for non-payment</li>
                        <li>Traffic analysis and usage reporting</li>
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-8 border-t mt-8">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="px-6 bg-transparent"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <div className="flex space-x-3">
                {currentStep < totalSteps ? (
                  <Button onClick={handleNext} className="px-6">
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-green-600 hover:bg-green-700 px-6"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Deploying...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Deploy Router
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuration Summary */}
        {currentStep === totalSteps && (
          <Card className="mt-6 shadow-lg border-0">
            <CardHeader className="bg-gray-50">
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Configuration Summary</span>
              </CardTitle>
              <CardDescription>Review your router configuration before deployment</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                    <Router className="h-4 w-4" />
                    <span>Basic Information</span>
                  </h4>
                  <div className="text-sm space-y-2 text-muted-foreground bg-gray-50 p-4 rounded-lg">
                    <p>
                      <span className="font-medium">Name:</span> {formData.routerName}
                    </p>
                    <p>
                      <span className="font-medium">Brand:</span> {selectedBrand?.label}
                    </p>
                    <p>
                      <span className="font-medium">Model:</span> {formData.model}
                    </p>
                    <p>
                      <span className="font-medium">Location:</span> {formData.location}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                    <Network className="h-4 w-4" />
                    <span>Network Configuration</span>
                  </h4>
                  <div className="text-sm space-y-2 text-muted-foreground bg-gray-50 p-4 rounded-lg">
                    <p>
                      <span className="font-medium">Connection:</span> {formData.connectionType}
                    </p>
                    <p>
                      <span className="font-medium">Management IP:</span> {formData.managementIP}
                    </p>
                    <p>
                      <span className="font-medium">Subnet:</span> {formData.selectedSubnet}
                    </p>
                    <p>
                      <span className="font-medium">Gateway:</span> {formData.gateway}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                    <Settings className="h-4 w-4" />
                    <span>Services</span>
                  </h4>
                  <div className="text-sm space-y-2 text-muted-foreground bg-gray-50 p-4 rounded-lg">
                    <p>
                      <span className="font-medium">RADIUS:</span>{" "}
                      {formData.radiusEnabled ? "✅ Enabled" : "❌ Disabled"}
                    </p>
                    <p>
                      <span className="font-medium">DHCP:</span> {formData.dhcpEnabled ? "✅ Enabled" : "❌ Disabled"}
                    </p>
                    <p>
                      <span className="font-medium">Hotspot:</span>{" "}
                      {formData.hotspotEnabled ? "✅ Enabled" : "❌ Disabled"}
                    </p>
                    <p>
                      <span className="font-medium">API:</span> {formData.apiEnabled ? "✅ Enabled" : "❌ Disabled"}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span>Security Features</span>
                  </h4>
                  <div className="text-sm space-y-2 text-muted-foreground bg-gray-50 p-4 rounded-lg">
                    <p>
                      <span className="font-medium">Firewall:</span>{" "}
                      {formData.firewallEnabled ? "✅ Enabled" : "❌ Disabled"}
                    </p>
                    <p>
                      <span className="font-medium">VPN Server:</span>{" "}
                      {formData.vpnServerEnabled ? "✅ Enabled" : "❌ Disabled"}
                    </p>
                    <p>
                      <span className="font-medium">Traffic Shaping:</span>{" "}
                      {formData.trafficShaping ? "✅ Enabled" : "❌ Disabled"}
                    </p>
                    <p>
                      <span className="font-medium">Content Filtering:</span>{" "}
                      {formData.contentFiltering ? "✅ Enabled" : "❌ Disabled"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
