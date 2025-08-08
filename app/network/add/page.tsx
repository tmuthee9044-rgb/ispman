"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Router, Network, Shield, Settings, CheckCircle, AlertCircle, Info, Globe, Server } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

// Mock DHCP pools from IP configuration
const mockDhcpPools = [
  {
    id: 1,
    name: "Main Network DHCP",
    network: "192.168.1.0/24",
    gateway: "192.168.1.1",
    dhcp_start: "192.168.1.100",
    dhcp_end: "192.168.1.200",
    dns_primary: "8.8.8.8",
    dns_secondary: "8.8.4.4",
    lease_time: "24h",
    subnet_id: 1,
    status: "active",
    total_addresses: 101,
    used_addresses: 45,
    available_addresses: 56,
  },
  {
    id: 2,
    name: "Guest Network DHCP",
    network: "192.168.100.0/24",
    gateway: "192.168.100.1",
    dhcp_start: "192.168.100.50",
    dhcp_end: "192.168.100.150",
    dns_primary: "1.1.1.1",
    dns_secondary: "1.0.0.1",
    lease_time: "2h",
    subnet_id: 2,
    status: "active",
    total_addresses: 101,
    used_addresses: 12,
    available_addresses: 89,
  },
  {
    id: 3,
    name: "Business Network DHCP",
    network: "10.0.0.0/16",
    gateway: "10.0.0.1",
    dhcp_start: "10.0.1.100",
    dhcp_end: "10.0.1.200",
    dns_primary: "8.8.8.8",
    dns_secondary: "8.8.4.4",
    lease_time: "48h",
    subnet_id: 3,
    status: "active",
    total_addresses: 101,
    used_addresses: 23,
    available_addresses: 78,
  },
  {
    id: 4,
    name: "IoT Devices DHCP",
    network: "192.168.50.0/24",
    gateway: "192.168.50.1",
    dhcp_start: "192.168.50.10",
    dhcp_end: "192.168.50.100",
    dns_primary: "8.8.8.8",
    dns_secondary: "8.8.4.4",
    lease_time: "12h",
    subnet_id: 5,
    status: "active",
    total_addresses: 91,
    used_addresses: 8,
    available_addresses: 83,
  },
]

export default function AddRouterPage() {
  const [formData, setFormData] = useState({
    // Basic Information
    routerName: "",
    brand: "",
    model: "",
    location: "",
    maxBandwidth: "",
    description: "",

    // Network Configuration
    ipAddress: "",
    subnetMask: "255.255.255.0",
    gateway: "",
    managementPort: "80",
    snmpCommunity: "public",

    // Router Management Settings
    apiEnabled: false,
    apiPort: "8080",
    apiUsername: "",
    apiPassword: "",

    // Features & Security
    firewallEnabled: true,
    vpnSupport: false,
    qosEnabled: true,
    bandwidthControl: true,
    guestNetwork: false,

    // DHCP Settings
    dhcpEnabled: true,
    selectedDhcpPool: "",

    // RADIUS Configuration
    radiusEnabled: false,
    radiusServerIp: "",
    radiusSecret: "",
    radiusPort: "1812",
  })

  const { toast } = useToast()
  const router = useRouter()

  const routerBrands = [
    { value: "mikrotik", label: "MikroTik", apiSupport: true },
    { value: "ubiquiti", label: "Ubiquiti", apiSupport: true },
    { value: "cisco", label: "Cisco", apiSupport: false },
    { value: "tplink", label: "TP-Link", apiSupport: false },
    { value: "netgear", label: "Netgear", apiSupport: false },
    { value: "linksys", label: "Linksys", apiSupport: false },
  ]

  const selectedBrand = routerBrands.find((brand) => brand.value === formData.brand)
  const apiSupported = selectedBrand?.apiSupport || false
  const selectedPool = mockDhcpPools.find((pool) => pool.id.toString() === formData.selectedDhcpPool)

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!formData.routerName || !formData.brand || !formData.location || !formData.ipAddress) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // RADIUS validation
    if (formData.radiusEnabled && (!formData.radiusServerIp || !formData.radiusSecret)) {
      toast({
        title: "RADIUS Configuration Error",
        description: "Please provide RADIUS server IP and secret when RADIUS is enabled",
        variant: "destructive",
      })
      return
    }

    try {
      // Here you would typically make an API call to save the router
      console.log("Router configuration:", formData)

      toast({
        title: "Router Added Successfully",
        description: `${formData.routerName} has been added to your network`,
      })

      // Redirect to network page
      router.push('/network')
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add router. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/network">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Routers
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Add New Router</h2>
          <p className="text-muted-foreground">Configure and add a new router to your network</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Router className="h-5 w-5" />
              <span>Basic Information</span>
            </CardTitle>
            <CardDescription>Enter the basic details for the new router</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="routerName">Router Name *</Label>
                <Input
                  id="routerName"
                  placeholder="e.g., Main Gateway Router"
                  value={formData.routerName}
                  onChange={(e) => handleInputChange("routerName", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand">Brand *</Label>
                <Select value={formData.brand} onValueChange={(value) => handleInputChange("brand", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select router brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {routerBrands.map((brand) => (
                      <SelectItem key={brand.value} value={brand.value}>
                        <div className="flex items-center justify-between w-full">
                          <span>{brand.label}</span>
                          {brand.apiSupport && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              API
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  placeholder="e.g., hEX S"
                  value={formData.model}
                  onChange={(e) => handleInputChange("model", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxBandwidth">Max Bandwidth (Mbps)</Label>
                <Input
                  id="maxBandwidth"
                  type="number"
                  placeholder="e.g., 1000"
                  value={formData.maxBandwidth}
                  onChange={(e) => handleInputChange("maxBandwidth", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                placeholder="e.g., Server Room A"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Optional description of the router's purpose and configuration"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Network Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Network className="h-5 w-5" />
              <span>Network Configuration</span>
            </CardTitle>
            <CardDescription>Configure the network settings for this router</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ipAddress">IP Address *</Label>
                <Input
                  id="ipAddress"
                  placeholder="e.g., 192.168.1.1"
                  value={formData.ipAddress}
                  onChange={(e) => handleInputChange("ipAddress", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subnetMask">Subnet Mask</Label>
                <Input
                  id="subnetMask"
                  value={formData.subnetMask}
                  onChange={(e) => handleInputChange("subnetMask", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gateway">Gateway</Label>
                <Input
                  id="gateway"
                  placeholder="e.g., 192.168.1.254"
                  value={formData.gateway}
                  onChange={(e) => handleInputChange("gateway", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="managementPort">Management Port</Label>
                <Input
                  id="managementPort"
                  type="number"
                  value={formData.managementPort}
                  onChange={(e) => handleInputChange("managementPort", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="snmpCommunity">SNMP Community String</Label>
              <Input
                id="snmpCommunity"
                value={formData.snmpCommunity}
                onChange={(e) => handleInputChange("snmpCommunity", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Router Management Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Router Management Settings</span>
            </CardTitle>
            <CardDescription>Configure API access and management options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="apiEnabled">Enable API Access</Label>
                  {apiSupported ? (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Supported
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-gray-600 border-gray-600">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Not Supported
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {apiSupported
                    ? "Enable API access for remote management and monitoring"
                    : "This router brand does not support API management"}
                </p>
              </div>
              <Switch
                id="apiEnabled"
                checked={formData.apiEnabled && apiSupported}
                onCheckedChange={(checked) => handleInputChange("apiEnabled", checked)}
                disabled={!apiSupported}
              />
            </div>

            {formData.apiEnabled && apiSupported && (
              <div className="space-y-4 p-4 border rounded-lg bg-blue-50 border-blue-200">
                <div className="flex items-start space-x-2">
                  <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">API Configuration</p>
                    <p>Configure API access credentials for remote management</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="apiPort">API Port</Label>
                    <Input
                      id="apiPort"
                      type="number"
                      value={formData.apiPort}
                      onChange={(e) => handleInputChange("apiPort", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apiUsername">API Username</Label>
                    <Input
                      id="apiUsername"
                      placeholder="admin"
                      value={formData.apiUsername}
                      onChange={(e) => handleInputChange("apiUsername", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apiPassword">API Password</Label>
                    <Input
                      id="apiPassword"
                      type="password"
                      placeholder="Enter secure password"
                      value={formData.apiPassword}
                      onChange={(e) => handleInputChange("apiPassword", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Features & Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Features & Security</span>
            </CardTitle>
            <CardDescription>Enable or disable router features and security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <Label htmlFor="firewallEnabled">Firewall</Label>
                  <p className="text-sm text-muted-foreground">Enable built-in firewall protection</p>
                </div>
                <Switch
                  id="firewallEnabled"
                  checked={formData.firewallEnabled}
                  onCheckedChange={(checked) => handleInputChange("firewallEnabled", checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <Label htmlFor="vpnSupport">VPN Support</Label>
                  <p className="text-sm text-muted-foreground">Enable VPN server functionality</p>
                </div>
                <Switch
                  id="vpnSupport"
                  checked={formData.vpnSupport}
                  onCheckedChange={(checked) => handleInputChange("vpnSupport", checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <Label htmlFor="qosEnabled">Quality of Service (QoS)</Label>
                  <p className="text-sm text-muted-foreground">Enable traffic prioritization</p>
                </div>
                <Switch
                  id="qosEnabled"
                  checked={formData.qosEnabled}
                  onCheckedChange={(checked) => handleInputChange("qosEnabled", checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <Label htmlFor="bandwidthControl">Bandwidth Control</Label>
                  <p className="text-sm text-muted-foreground">Enable bandwidth limiting</p>
                </div>
                <Switch
                  id="bandwidthControl"
                  checked={formData.bandwidthControl}
                  onCheckedChange={(checked) => handleInputChange("bandwidthControl", checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <Label htmlFor="guestNetwork">Guest Network</Label>
                  <p className="text-sm text-muted-foreground">Enable guest network access</p>
                </div>
                <Switch
                  id="guestNetwork"
                  checked={formData.guestNetwork}
                  onCheckedChange={(checked) => handleInputChange("guestNetwork", checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <Label htmlFor="dhcpEnabled">DHCP Server</Label>
                  <p className="text-sm text-muted-foreground">Enable automatic IP assignment</p>
                </div>
                <Switch
                  id="dhcpEnabled"
                  checked={formData.dhcpEnabled}
                  onCheckedChange={(checked) => handleInputChange("dhcpEnabled", checked)}
                />
              </div>
            </div>

            {/* DHCP Pool Selection */}
            {formData.dhcpEnabled && (
              <div className="space-y-4 p-4 border rounded-lg bg-green-50 border-green-200">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-green-900 flex items-center space-x-2">
                    <Globe className="h-4 w-4" />
                    <span>DHCP Pool Configuration</span>
                  </h4>
                  <Link href="/network/ip-config" target="_blank">
                    <Button variant="outline" size="sm" className="text-xs bg-transparent">
                      Manage Pools
                    </Button>
                  </Link>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="selectedDhcpPool">Select DHCP Pool</Label>
                    <Select
                      value={formData.selectedDhcpPool}
                      onValueChange={(value) => handleInputChange("selectedDhcpPool", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose an existing DHCP pool" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockDhcpPools.map((pool) => (
                          <SelectItem key={pool.id} value={pool.id.toString()}>
                            <div className="flex flex-col">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">{pool.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {pool.network}
                                </Badge>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Range: {pool.dhcp_start} - {pool.dhcp_end} ({pool.available_addresses} available)
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedPool && (
                    <div className="p-3 bg-white border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium text-sm">Selected Pool Details</h5>
                        <Badge variant={selectedPool.status === "active" ? "default" : "secondary"}>
                          {selectedPool.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Network:</span>
                          <span className="ml-2 font-mono">{selectedPool.network}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Gateway:</span>
                          <span className="ml-2 font-mono">{selectedPool.gateway}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">DHCP Range:</span>
                          <span className="ml-2 font-mono">
                            {selectedPool.dhcp_start} - {selectedPool.dhcp_end}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Lease Time:</span>
                          <span className="ml-2">{selectedPool.lease_time}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Primary DNS:</span>
                          <span className="ml-2 font-mono">{selectedPool.dns_primary}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Secondary DNS:</span>
                          <span className="ml-2 font-mono">{selectedPool.dns_secondary}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t">
                        <span className="text-sm text-muted-foreground">Pool Utilization:</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">
                            {selectedPool.used_addresses}/{selectedPool.total_addresses}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {selectedPool.available_addresses} available
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )}

                  {mockDhcpPools.length === 0 && (
                    <div className="text-center p-4 text-muted-foreground">
                      <Globe className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No DHCP pools configured</p>
                      <Link href="/network/ip-config" target="_blank">
                        <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                          Configure DHCP Pools
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* RADIUS Configuration */}
            <div className="space-y-4 p-4 border rounded-lg bg-orange-50 border-orange-200">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-orange-900 flex items-center space-x-2">
                  <Server className="h-4 w-4" />
                  <span>RADIUS Authentication</span>
                </h4>
                <Switch
                  id="radiusEnabled"
                  checked={formData.radiusEnabled}
                  onCheckedChange={(checked) => handleInputChange("radiusEnabled", checked)}
                />
              </div>

              {formData.radiusEnabled && (
                <div className="space-y-4">
                  <div className="flex items-start space-x-2 mb-4">
                    <Info className="w-4 h-4 text-orange-600 mt-0.5" />
                    <div className="text-sm text-orange-800">
                      <p className="font-medium">RADIUS Server Configuration</p>
                      <p>Configure RADIUS server settings for centralized authentication</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="radiusServerIp">RADIUS Server IP *</Label>
                      <Input
                        id="radiusServerIp"
                        placeholder="e.g., 192.168.1.10"
                        value={formData.radiusServerIp}
                        onChange={(e) => handleInputChange("radiusServerIp", e.target.value)}
                        required={formData.radiusEnabled}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="radiusSecret">RADIUS Secret *</Label>
                      <Input
                        id="radiusSecret"
                        type="password"
                        placeholder="Enter shared secret"
                        value={formData.radiusSecret}
                        onChange={(e) => handleInputChange("radiusSecret", e.target.value)}
                        required={formData.radiusEnabled}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="radiusPort">RADIUS Port</Label>
                      <Input
                        id="radiusPort"
                        type="number"
                        value={formData.radiusPort}
                        onChange={(e) => handleInputChange("radiusPort", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-white border rounded-lg">
                    <div className="text-sm space-y-2">
                      <div className="font-medium text-orange-900">RADIUS Configuration Summary:</div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Server:</span>
                          <span className="ml-2 font-mono">{formData.radiusServerIp || "Not set"}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Port:</span>
                          <span className="ml-2">{formData.radiusPort}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Secret:</span>
                          <span className="ml-2">{formData.radiusSecret ? "••••••••" : "Not set"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Configuration Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Configuration Summary</CardTitle>
            <CardDescription>Review your router configuration before adding</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Basic Information</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span>{formData.routerName || "Not set"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Brand:</span>
                    <span>{selectedBrand?.label || "Not selected"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span>{formData.location || "Not set"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">API Access:</span>
                    <span>{formData.apiEnabled && apiSupported ? "Enabled" : "Disabled"}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Network Settings</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">IP Address:</span>
                    <span>{formData.ipAddress || "Not set"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subnet Mask:</span>
                    <span>{formData.subnetMask}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Management Port:</span>
                    <span>{formData.managementPort}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">DHCP:</span>
                    <span>{formData.dhcpEnabled ? "Enabled" : "Disabled"}</span>
                  </div>
                  {formData.dhcpEnabled && selectedPool && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">DHCP Pool:</span>
                      <span>{selectedPool.name}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">RADIUS:</span>
                    <span>{formData.radiusEnabled ? "Enabled" : "Disabled"}</span>
                  </div>
                  {formData.radiusEnabled && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">RADIUS Server:</span>
                      <span>{formData.radiusServerIp || "Not set"}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4">
          <Link href="/network">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button type="submit">
            <Router className="w-4 h-4 mr-2" />
            Add Router
          </Button>
        </div>
      </form>
    </div>
  )
}
