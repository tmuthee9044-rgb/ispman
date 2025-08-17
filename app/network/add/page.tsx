"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
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
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function AddRouterPage() {
  const [currentStep, setCurrentStep] = useState(1)
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

  const { toast } = useToast()
  const router = useRouter()

  const totalSteps = 6

  const routerBrands = [
    {
      value: "mikrotik",
      label: "MikroTik",
      models: ["hEX S", "CCR1009", "CCR1036", "RB4011", "CRS328"],
      apiSupport: true,
      defaultPort: "8728",
    },
    {
      value: "ubiquiti",
      label: "Ubiquiti",
      models: ["EdgeRouter X", "EdgeRouter 4", "EdgeRouter 12", "UniFi Dream Machine"],
      apiSupport: true,
      defaultPort: "443",
    },
    {
      value: "cisco",
      label: "Cisco",
      models: ["ISR 4321", "ISR 4331", "ASR 1001-X", "Catalyst 9300"],
      apiSupport: false,
      defaultPort: "22",
    },
    {
      value: "juniper",
      label: "Juniper",
      models: ["SRX300", "SRX550", "MX204", "EX4300"],
      apiSupport: false,
      defaultPort: "22",
    },
    {
      value: "tplink",
      label: "TP-Link",
      models: ["Archer C7", "Archer AX6000", "Omada ER605"],
      apiSupport: false,
      defaultPort: "80",
    },
    {
      value: "netgear",
      label: "Netgear",
      models: ["Nighthawk Pro Gaming", "Orbi Pro", "ReadyNAS"],
      apiSupport: false,
      defaultPort: "80",
    },
  ]

  const ipSubnets = [
    { value: "192.168.1.0/24", label: "192.168.1.0/24 (Home Network)", available: 254 },
    { value: "192.168.10.0/24", label: "192.168.10.0/24 (Office Network)", available: 254 },
    { value: "10.0.0.0/16", label: "10.0.0.0/16 (Large Network)", available: 65534 },
    { value: "172.16.0.0/20", label: "172.16.0.0/20 (Medium Network)", available: 4094 },
    { value: "192.168.100.0/22", label: "192.168.100.0/22 (ISP Pool 1)", available: 1022 },
    { value: "192.168.200.0/22", label: "192.168.200.0/22 (ISP Pool 2)", available: 1022 },
  ]

  const selectedBrand = routerBrands.find((brand) => brand.value === formData.brand)

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    toast({
      title: "Router Configuration Complete",
      description: "Router has been successfully added and configured.",
    })
    router.push("/network")
  }

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const StepIndicator = () => (
    <div className="flex items-center justify-between mb-8">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`
            w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
            ${step <= currentStep ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}
          `}
          >
            {step < currentStep ? <Check className="h-4 w-4" /> : step}
          </div>
          {step < totalSteps && (
            <div
              className={`
              w-12 h-0.5 mx-2
              ${step < currentStep ? "bg-blue-600" : "bg-gray-200"}
            `}
            />
          )}
        </div>
      ))}
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
        </div>

        <StepIndicator />

        <Card>
          <CardContent className="p-6">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Router className="h-5 w-5 text-blue-600" />
                  <h2 className="text-xl font-semibold">Basic Information</h2>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="router-name">Router Name *</Label>
                    <Input
                      id="router-name"
                      placeholder="e.g., Main Gateway Router"
                      value={formData.routerName}
                      onChange={(e) => updateFormData("routerName", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand *</Label>
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
                      <SelectTrigger>
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="model">Model *</Label>
                    <Select
                      value={formData.model}
                      onValueChange={(value) => updateFormData("model", value)}
                      disabled={!formData.brand}
                    >
                      <SelectTrigger>
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Server Room A"
                      value={formData.location}
                      onChange={(e) => updateFormData("location", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max-bandwidth">Max Bandwidth (Mbps)</Label>
                    <Input
                      id="max-bandwidth"
                      type="number"
                      placeholder="e.g., 1000"
                      value={formData.maxBandwidth}
                      onChange={(e) => updateFormData("maxBandwidth", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Optional description of the router's purpose and configuration"
                    value={formData.description}
                    onChange={(e) => updateFormData("description", e.target.value)}
                  />
                </div>

                {selectedBrand && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Info className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-900">Brand Information</span>
                    </div>
                    <div className="text-sm text-blue-800">
                      <p>Selected: {selectedBrand.label}</p>
                      <p>
                        API Support: {selectedBrand.apiSupport ? "✅ Available" : "❌ Manual Configuration Required"}
                      </p>
                      <p>Default Management Port: {selectedBrand.defaultPort}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Connection Configuration */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Network className="h-5 w-5 text-blue-600" />
                  <h2 className="text-xl font-semibold">Connection Configuration</h2>
                </div>

                <div className="space-y-4">
                  <Label>Connection Type *</Label>
                  <RadioGroup
                    value={formData.connectionType}
                    onValueChange={(value) => updateFormData("connectionType", value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="public-ip" id="public-ip" />
                      <Label htmlFor="public-ip" className="flex items-center space-x-2">
                        <Globe className="h-4 w-4" />
                        <span>Public IP Address</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="openvpn" id="openvpn" />
                      <Label htmlFor="openvpn" className="flex items-center space-x-2">
                        <Lock className="h-4 w-4" />
                        <span>OpenVPN Connection</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="local" id="local" />
                      <Label htmlFor="local" className="flex items-center space-x-2">
                        <Network className="h-4 w-4" />
                        <span>Local Network</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="management-ip">
                      {formData.connectionType === "public-ip"
                        ? "Public IP Address"
                        : formData.connectionType === "openvpn"
                          ? "VPN IP Address"
                          : "Local IP Address"}{" "}
                      *
                    </Label>
                    <Input
                      id="management-ip"
                      placeholder={formData.connectionType === "public-ip" ? "203.0.113.1" : "192.168.1.1"}
                      value={formData.managementIP}
                      onChange={(e) => updateFormData("managementIP", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="management-port">Management Port</Label>
                    <Input
                      id="management-port"
                      placeholder="80"
                      value={formData.managementPort}
                      onChange={(e) => updateFormData("managementPort", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username">Username *</Label>
                    <Input
                      id="username"
                      placeholder="admin"
                      value={formData.username}
                      onChange={(e) => updateFormData("username", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => updateFormData("password", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ssh-port">SSH Port</Label>
                    <Input
                      id="ssh-port"
                      placeholder="22"
                      value={formData.sshPort}
                      onChange={(e) => updateFormData("sshPort", e.target.value)}
                    />
                  </div>
                </div>

                {formData.connectionType === "openvpn" && (
                  <div className="space-y-2">
                    <Label htmlFor="vpn-config">VPN Configuration File</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">Upload OpenVPN configuration file (.ovpn)</p>
                      <Input
                        type="file"
                        accept=".ovpn"
                        className="mt-2"
                        onChange={(e) => updateFormData("vpnConfig", e.target.files?.[0] || null)}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: IP Pool Configuration */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Network className="h-5 w-5 text-blue-600" />
                  <h2 className="text-xl font-semibold">IP Pool Configuration</h2>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subnet">Select IP Subnet *</Label>
                  <Select
                    value={formData.selectedSubnet}
                    onValueChange={(value) => {
                      updateFormData("selectedSubnet", value)
                      // Auto-populate gateway based on subnet
                      const subnet = ipSubnets.find((s) => s.value === value)
                      if (subnet) {
                        const baseIP = subnet.value.split("/")[0].split(".").slice(0, 3).join(".")
                        updateFormData("gateway", `${baseIP}.1`)
                        updateFormData("dhcpStart", `${baseIP}.100`)
                        updateFormData("dhcpEnd", `${baseIP}.200`)
                      }
                    }}
                  >
                    <SelectTrigger>
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
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="dhcp-enabled"
                    checked={formData.dhcpEnabled}
                    onCheckedChange={(checked) => updateFormData("dhcpEnabled", checked)}
                  />
                  <Label htmlFor="dhcp-enabled">Enable DHCP Server</Label>
                </div>

                {formData.dhcpEnabled && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="dhcp-start">DHCP Start IP</Label>
                      <Input
                        id="dhcp-start"
                        placeholder="192.168.1.100"
                        value={formData.dhcpStart}
                        onChange={(e) => updateFormData("dhcpStart", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dhcp-end">DHCP End IP</Label>
                      <Input
                        id="dhcp-end"
                        placeholder="192.168.1.200"
                        value={formData.dhcpEnd}
                        onChange={(e) => updateFormData("dhcpEnd", e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="gateway">Gateway IP *</Label>
                    <Input
                      id="gateway"
                      placeholder="192.168.1.1"
                      value={formData.gateway}
                      onChange={(e) => updateFormData("gateway", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dns-primary">Primary DNS</Label>
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dns-secondary">Secondary DNS</Label>
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
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: RADIUS Configuration */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <h2 className="text-xl font-semibold">RADIUS Server Configuration</h2>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="radius-enabled"
                    checked={formData.radiusEnabled}
                    onCheckedChange={(checked) => updateFormData("radiusEnabled", checked)}
                  />
                  <Label htmlFor="radius-enabled">Enable RADIUS Authentication & Accounting</Label>
                </div>

                {formData.radiusEnabled && (
                  <>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="radius-server">RADIUS Server IP *</Label>
                        <Input
                          id="radius-server"
                          placeholder="192.168.1.10"
                          value={formData.radiusServer}
                          onChange={(e) => updateFormData("radiusServer", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="radius-secret">RADIUS Secret *</Label>
                        <Input
                          id="radius-secret"
                          type="password"
                          placeholder="••••••••"
                          value={formData.radiusSecret}
                          onChange={(e) => updateFormData("radiusSecret", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="radius-auth-port">Authentication Port</Label>
                        <Input
                          id="radius-auth-port"
                          placeholder="1812"
                          value={formData.radiusAuthPort}
                          onChange={(e) => updateFormData("radiusAuthPort", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="radius-acct-port">Accounting Port</Label>
                        <Input
                          id="radius-acct-port"
                          placeholder="1813"
                          value={formData.radiusAcctPort}
                          onChange={(e) => updateFormData("radiusAcctPort", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="nas-identifier">NAS Identifier</Label>
                        <Input
                          id="nas-identifier"
                          placeholder="router-001"
                          value={formData.nasIdentifier}
                          onChange={(e) => updateFormData("nasIdentifier", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="interim-interval">Interim Interval (seconds)</Label>
                        <Input
                          id="interim-interval"
                          placeholder="300"
                          value={formData.interimInterval}
                          onChange={(e) => updateFormData("interimInterval", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-900">RADIUS Features</span>
                      </div>
                      <ul className="text-sm text-green-800 space-y-1">
                        <li>• Customer authentication and authorization</li>
                        <li>• Session accounting for billing integration</li>
                        <li>• Bandwidth control per customer</li>
                        <li>• Real-time session monitoring</li>
                        <li>• Automatic disconnection on payment issues</li>
                      </ul>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Step 5: API Configuration */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Settings className="h-5 w-5 text-blue-600" />
                  <h2 className="text-xl font-semibold">API Configuration</h2>
                </div>

                {selectedBrand?.apiSupport ? (
                  <>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="api-enabled"
                        checked={formData.apiEnabled}
                        onCheckedChange={(checked) => updateFormData("apiEnabled", checked)}
                      />
                      <Label htmlFor="api-enabled">Enable API Integration</Label>
                    </div>

                    {formData.apiEnabled && (
                      <>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="api-port">API Port</Label>
                            <Input
                              id="api-port"
                              placeholder={selectedBrand.defaultPort}
                              value={formData.apiPort}
                              onChange={(e) => updateFormData("apiPort", e.target.value)}
                            />
                          </div>

                          {formData.brand === "mikrotik" && (
                            <div className="space-y-2">
                              <Label htmlFor="api-version">RouterOS Version</Label>
                              <Select
                                value={formData.apiVersion}
                                onValueChange={(value) => updateFormData("apiVersion", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select RouterOS version" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="7.x">RouterOS 7.x (Latest)</SelectItem>
                                  <SelectItem value="6.x">RouterOS 6.x (Legacy)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="api-ssl"
                            checked={formData.apiSSL}
                            onCheckedChange={(checked) => updateFormData("apiSSL", checked)}
                          />
                          <Label htmlFor="api-ssl">Use SSL/TLS Encryption</Label>
                        </div>

                        <div className="p-4 bg-blue-50 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <Zap className="h-4 w-4 text-blue-600" />
                            <span className="font-medium text-blue-900">
                              {formData.brand === "mikrotik"
                                ? "MikroTik API Features"
                                : formData.brand === "ubiquiti"
                                  ? "Ubiquiti API Features"
                                  : "API Features"}
                            </span>
                          </div>
                          <ul className="text-sm text-blue-800 space-y-1">
                            {formData.brand === "mikrotik" && (
                              <>
                                <li>• RouterOS API for automated configuration</li>
                                <li>• Real-time bandwidth monitoring</li>
                                <li>• Customer queue management</li>
                                <li>• Firewall rule automation</li>
                                <li>• DHCP lease management</li>
                                <li>• PPPoE server configuration</li>
                              </>
                            )}
                            {formData.brand === "ubiquiti" && (
                              <>
                                <li>• EdgeOS API integration</li>
                                <li>• UniFi Controller management</li>
                                <li>• Traffic analysis and reporting</li>
                                <li>• Guest network automation</li>
                                <li>• QoS policy management</li>
                              </>
                            )}
                          </ul>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <span className="font-medium text-yellow-900">Manual Configuration Required</span>
                    </div>
                    <div className="text-sm text-yellow-800 space-y-2">
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
                  </div>
                )}
              </div>
            )}

            {/* Step 6: Customer Authorization & Hotspot */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Users className="h-5 w-5 text-blue-600" />
                  <h2 className="text-xl font-semibold">Customer Authorization & Hotspot</h2>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hotspot-enabled"
                    checked={formData.hotspotEnabled}
                    onCheckedChange={(checked) => updateFormData("hotspotEnabled", checked)}
                  />
                  <Label htmlFor="hotspot-enabled">Enable Captive Portal / Hotspot</Label>
                </div>

                {formData.hotspotEnabled && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="login-template">Login Page Template</Label>
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
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="session-timeout">Session Timeout (seconds)</Label>
                        <Input
                          id="session-timeout"
                          placeholder="3600"
                          value={formData.sessionTimeout}
                          onChange={(e) => updateFormData("sessionTimeout", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="idle-timeout">Idle Timeout (seconds)</Label>
                        <Input
                          id="idle-timeout"
                          placeholder="1800"
                          value={formData.idleTimeout}
                          onChange={(e) => updateFormData("idleTimeout", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Bandwidth Limits</h3>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label htmlFor="download-limit">Download Limit (Mbps)</Label>
                          <Input
                            id="download-limit"
                            placeholder="100"
                            value={formData.downloadLimit}
                            onChange={(e) => updateFormData("downloadLimit", e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="upload-limit">Upload Limit (Mbps)</Label>
                          <Input
                            id="upload-limit"
                            placeholder="50"
                            value={formData.uploadLimit}
                            onChange={(e) => updateFormData("uploadLimit", e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="data-limit">Data Limit (GB/month)</Label>
                          <Input
                            id="data-limit"
                            placeholder="500"
                            value={formData.dataLimit}
                            onChange={(e) => updateFormData("dataLimit", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Advanced Features</h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="firewall-enabled"
                        checked={formData.firewallEnabled}
                        onCheckedChange={(checked) => updateFormData("firewallEnabled", checked)}
                      />
                      <Label htmlFor="firewall-enabled">Enable Firewall Management</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="vpn-server-enabled"
                        checked={formData.vpnServerEnabled}
                        onCheckedChange={(checked) => updateFormData("vpnServerEnabled", checked)}
                      />
                      <Label htmlFor="vpn-server-enabled">Enable VPN Server</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="traffic-shaping"
                        checked={formData.trafficShaping}
                        onCheckedChange={(checked) => updateFormData("trafficShaping", checked)}
                      />
                      <Label htmlFor="traffic-shaping">Enable Traffic Shaping</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="content-filtering"
                        checked={formData.contentFiltering}
                        onCheckedChange={(checked) => updateFormData("contentFiltering", checked)}
                      />
                      <Label htmlFor="content-filtering">Enable Content Filtering</Label>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-900">ISP Management Features</span>
                  </div>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Automated customer onboarding and authentication</li>
                    <li>• Real-time bandwidth monitoring and enforcement</li>
                    <li>• Integration with billing systems for payment tracking</li>
                    <li>• Customer self-service portal access</li>
                    <li>• Automated service suspension for non-payment</li>
                    <li>• Traffic analysis and usage reporting</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t">
              <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <div className="flex space-x-2">
                {currentStep < totalSteps ? (
                  <Button onClick={handleNext}>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                    <Check className="h-4 w-4 mr-2" />
                    Deploy Router
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuration Summary */}
        {currentStep === totalSteps && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Configuration Summary</CardTitle>
              <CardDescription>Review your router configuration before deployment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">Basic Information</h4>
                  <div className="text-sm space-y-1 text-muted-foreground">
                    <p>Name: {formData.routerName}</p>
                    <p>Brand: {selectedBrand?.label}</p>
                    <p>Model: {formData.model}</p>
                    <p>Location: {formData.location}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Network Configuration</h4>
                  <div className="text-sm space-y-1 text-muted-foreground">
                    <p>Connection: {formData.connectionType}</p>
                    <p>Management IP: {formData.managementIP}</p>
                    <p>Subnet: {formData.selectedSubnet}</p>
                    <p>Gateway: {formData.gateway}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Services</h4>
                  <div className="text-sm space-y-1 text-muted-foreground">
                    <p>RADIUS: {formData.radiusEnabled ? "Enabled" : "Disabled"}</p>
                    <p>DHCP: {formData.dhcpEnabled ? "Enabled" : "Disabled"}</p>
                    <p>Hotspot: {formData.hotspotEnabled ? "Enabled" : "Disabled"}</p>
                    <p>API: {formData.apiEnabled ? "Enabled" : "Disabled"}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Security Features</h4>
                  <div className="text-sm space-y-1 text-muted-foreground">
                    <p>Firewall: {formData.firewallEnabled ? "Enabled" : "Disabled"}</p>
                    <p>VPN Server: {formData.vpnServerEnabled ? "Enabled" : "Disabled"}</p>
                    <p>Traffic Shaping: {formData.trafficShaping ? "Enabled" : "Disabled"}</p>
                    <p>Content Filtering: {formData.contentFiltering ? "Enabled" : "Disabled"}</p>
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
