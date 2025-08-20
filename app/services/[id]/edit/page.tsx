"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save, Info, Download, DollarSign, Zap } from "lucide-react"
import { toast } from "sonner"

interface EditServicePlanProps {
  params: {
    id: string
  }
}

export default function EditServicePlan({ params }: EditServicePlanProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("basic")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const [basicInfo, setBasicInfo] = useState({
    planName: "",
    description: "",
    serviceType: "",
    category: "",
    status: "active",
  })

  const [speedConfig, setSpeedConfig] = useState({
    downloadSpeed: [100],
    uploadSpeed: [50],
    guaranteedDownload: [80],
    guaranteedUpload: [40],
    burstDownload: [150],
    burstUpload: [75],
    burstDuration: [300],
    aggregationRatio: [4],
    priorityLevel: "standard",
  })

  const [pricingConfig, setPricingConfig] = useState({
    monthlyPrice: "",
    setupFee: "",
    billingCycle: "",
    contractLength: "",
    promoPrice: "",
    promoEnabled: false,
    promoDuration: "",
    currency: "KES",
    taxIncluded: false,
    taxRate: [16],
  })

  const [fupConfig, setFupConfig] = useState({
    enabled: false,
    dataLimit: "",
    limitType: "monthly",
    actionAfterLimit: "throttle",
    throttleSpeed: [10],
    resetDay: "1",
    exemptHours: [],
    exemptDays: [],
    warningThreshold: [80],
  })

  const [advancedFeatures, setAdvancedFeatures] = useState({
    staticIP: false,
    portForwarding: false,
    vpnAccess: false,
    prioritySupport: false,
    slaGuarantee: false,
    redundancy: false,
    monitoring: false,
    customDNS: false,
  })

  const [restrictions, setRestrictions] = useState({
    contentFiltering: false,
    timeRestrictions: false,
    bandwidthScheduling: false,
    deviceLimit: "",
    concurrentConnections: "",
    geographicRestrictions: false,
    protocolBlocking: false,
  })

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/services/${params.id}`)

        if (!response.ok) {
          throw new Error("Failed to fetch service data")
        }

        const serviceData = await response.json()

        setBasicInfo({
          planName: serviceData.name || "",
          description: serviceData.description || "",
          serviceType: serviceData.service_type || "",
          category: serviceData.category || "",
          status: serviceData.status || "active",
        })

        // Parse speed data from database
        const speedParts = serviceData.speed ? serviceData.speed.split("/") : ["100", "50"]
        setSpeedConfig({
          downloadSpeed: [Number.parseInt(speedParts[0]) || 100],
          uploadSpeed: [Number.parseInt(speedParts[1]) || 50],
          guaranteedDownload: [Math.floor((Number.parseInt(speedParts[0]) || 100) * 0.8)],
          guaranteedUpload: [Math.floor((Number.parseInt(speedParts[1]) || 50) * 0.8)],
          burstDownload: [Math.floor((Number.parseInt(speedParts[0]) || 100) * 1.5)],
          burstUpload: [Math.floor((Number.parseInt(speedParts[1]) || 50) * 1.5)],
          burstDuration: [300],
          aggregationRatio: [4],
          priorityLevel: serviceData.priority_level || "standard",
        })

        setPricingConfig({
          monthlyPrice: serviceData.price?.toString() || "",
          setupFee: serviceData.setup_fee?.toString() || "",
          billingCycle: serviceData.billing_cycle || "monthly",
          contractLength: serviceData.contract_length?.toString() || "",
          promoPrice: serviceData.promo_price?.toString() || "",
          promoEnabled: !!serviceData.promo_price,
          promoDuration: serviceData.promo_duration?.toString() || "",
          currency: serviceData.currency || "KES",
          taxIncluded: serviceData.tax_included || false,
          taxRate: [serviceData.tax_rate || 16],
        })

        // Parse JSON fields if they exist
        if (serviceData.fup_config) {
          const fup = JSON.parse(serviceData.fup_config)
          setFupConfig({
            enabled: fup.enabled || false,
            dataLimit: fup.dataLimit || "",
            limitType: fup.limitType || "monthly",
            actionAfterLimit: fup.actionAfterLimit || "throttle",
            throttleSpeed: [fup.throttleSpeed || 10],
            resetDay: fup.resetDay || "1",
            exemptHours: fup.exemptHours || [],
            exemptDays: fup.exemptDays || [],
            warningThreshold: [fup.warningThreshold || 80],
          })
        }

        if (serviceData.advanced_features) {
          const features = JSON.parse(serviceData.advanced_features)
          setAdvancedFeatures({
            staticIP: features.staticIP || false,
            portForwarding: features.portForwarding || false,
            vpnAccess: features.vpnAccess || false,
            prioritySupport: features.prioritySupport || false,
            slaGuarantee: features.slaGuarantee || false,
            redundancy: features.redundancy || false,
            monitoring: features.monitoring || false,
            customDNS: features.customDNS || false,
          })
        }

        if (serviceData.restrictions) {
          const rest = JSON.parse(serviceData.restrictions)
          setRestrictions({
            contentFiltering: rest.contentFiltering || false,
            timeRestrictions: rest.timeRestrictions || false,
            bandwidthScheduling: rest.bandwidthScheduling || false,
            deviceLimit: rest.deviceLimit || "",
            concurrentConnections: rest.concurrentConnections || "",
            geographicRestrictions: rest.geographicRestrictions || false,
            protocolBlocking: rest.protocolBlocking || false,
          })
        }
      } catch (error) {
        console.error("Error fetching service data:", error)
        toast.error("Failed to load service data")
        router.push("/services")
      } finally {
        setIsLoading(false)
      }
    }

    fetchServiceData()
  }, [params.id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!basicInfo.planName || !pricingConfig.monthlyPrice) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSaving(true)

    try {
      const formData = {
        name: basicInfo.planName,
        description: basicInfo.description,
        service_type: basicInfo.serviceType,
        category: basicInfo.category,
        status: basicInfo.status,
        price: Number.parseFloat(pricingConfig.monthlyPrice),
        setup_fee: Number.parseFloat(pricingConfig.setupFee) || 0,
        billing_cycle: pricingConfig.billingCycle,
        contract_length: Number.parseInt(pricingConfig.contractLength) || 0,
        currency: pricingConfig.currency,
        tax_included: pricingConfig.taxIncluded,
        tax_rate: pricingConfig.taxRate[0],
        promo_price: pricingConfig.promoEnabled ? Number.parseFloat(pricingConfig.promoPrice) || null : null,
        promo_duration: pricingConfig.promoEnabled ? Number.parseInt(pricingConfig.promoDuration) || null : null,
        speed: `${speedConfig.downloadSpeed[0]}/${speedConfig.uploadSpeed[0]}`,
        download_speed: speedConfig.downloadSpeed[0],
        upload_speed: speedConfig.uploadSpeed[0],
        priority_level: speedConfig.priorityLevel,
        fup_config: JSON.stringify(fupConfig),
        advanced_features: JSON.stringify(advancedFeatures),
        restrictions: JSON.stringify(restrictions),
      }

      const response = await fetch(`/api/services/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update service plan")
      }

      toast.success("Service plan updated successfully!")
      router.push("/services")
    } catch (error) {
      console.error("Error updating service plan:", error)
      toast.error(error instanceof Error ? error.message : "Failed to update service plan")
    } finally {
      setIsSaving(false)
    }
  }

  const serviceTypes = [
    { value: "fiber", label: "Fiber Optic", icon: Zap },
    { value: "wireless", label: "Wireless", icon: Zap },
    { value: "satellite", label: "Satellite", icon: Zap },
    { value: "dsl", label: "DSL", icon: Zap },
    { value: "cable", label: "Cable", icon: Zap },
  ]

  const exemptHours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, "0")}:00`)

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading service data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.push("/services")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Services
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Edit Service Plan</h1>
            <p className="text-muted-foreground">Update service plan configuration and pricing</p>
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Updating..." : "Update Service Plan"}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="speed">Speed & QoS</TabsTrigger>
            <TabsTrigger value="pricing">Pricing & Tax</TabsTrigger>
            <TabsTrigger value="fup">Fair Usage</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
            <TabsTrigger value="restrictions">Restrictions</TabsTrigger>
            <TabsTrigger value="review">Review</TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic" className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-600" />
                  Basic Service Information
                </CardTitle>
                <CardDescription>Update the core details of your service plan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="planName">Service Plan Name *</Label>
                    <Input
                      id="planName"
                      placeholder="e.g., Premium Fiber 100Mbps"
                      value={basicInfo.planName}
                      onChange={(e) => setBasicInfo({ ...basicInfo, planName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="serviceType">Service Type *</Label>
                    <Select
                      value={basicInfo.serviceType}
                      onValueChange={(value) => setBasicInfo({ ...basicInfo, serviceType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select service type" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <type.icon className="h-4 w-4" />
                              {type.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Service Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the service plan features, benefits, and target audience"
                    value={basicInfo.description}
                    onChange={(e) => setBasicInfo({ ...basicInfo, description: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category">Service Category</Label>
                    <Select
                      value={basicInfo.category}
                      onValueChange={(value) => setBasicInfo({ ...basicInfo, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic Plans</SelectItem>
                        <SelectItem value="standard">Standard Plans</SelectItem>
                        <SelectItem value="premium">Premium Plans</SelectItem>
                        <SelectItem value="enterprise">Enterprise Plans</SelectItem>
                        <SelectItem value="custom">Custom Solutions</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Service Status</Label>
                    <Select
                      value={basicInfo.status}
                      onValueChange={(value) => setBasicInfo({ ...basicInfo, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="deprecated">Deprecated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Speed & QoS Tab */}
          <TabsContent value="speed" className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5 text-green-600" />
                  Speed Configuration
                </CardTitle>
                <CardDescription>Configure download and upload speeds</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Download Speed: {speedConfig.downloadSpeed[0]} Mbps</Label>
                    <Slider
                      value={speedConfig.downloadSpeed}
                      onValueChange={(value) => setSpeedConfig({ ...speedConfig, downloadSpeed: value })}
                      max={1000}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Upload Speed: {speedConfig.uploadSpeed[0]} Mbps</Label>
                    <Slider
                      value={speedConfig.uploadSpeed}
                      onValueChange={(value) => setSpeedConfig({ ...speedConfig, uploadSpeed: value })}
                      max={500}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing & Tax Tab */}
          <TabsContent value="pricing" className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Pricing Structure
                </CardTitle>
                <CardDescription>Configure service pricing and billing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="monthlyPrice">Monthly Price *</Label>
                    <Input
                      id="monthlyPrice"
                      type="number"
                      step="0.01"
                      placeholder="99.99"
                      value={pricingConfig.monthlyPrice}
                      onChange={(e) => setPricingConfig({ ...pricingConfig, monthlyPrice: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="setupFee">Setup/Installation Fee</Label>
                    <Input
                      id="setupFee"
                      type="number"
                      step="0.01"
                      placeholder="50.00"
                      value={pricingConfig.setupFee}
                      onChange={(e) => setPricingConfig({ ...pricingConfig, setupFee: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="billingCycle">Billing Cycle</Label>
                    <Select
                      value={pricingConfig.billingCycle}
                      onValueChange={(value) => setPricingConfig({ ...pricingConfig, billingCycle: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select billing cycle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly (3 months)</SelectItem>
                        <SelectItem value="semi-annual">Semi-Annual (6 months)</SelectItem>
                        <SelectItem value="annual">Annual (12 months)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={pricingConfig.currency}
                      onValueChange={(value) => setPricingConfig({ ...pricingConfig, currency: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="KES">KES - Kenyan Shilling</SelectItem>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Review Tab */}
          <TabsContent value="review" className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Review Service Plan</CardTitle>
                <CardDescription>Review all settings before updating the service plan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h4 className="font-medium">Basic Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Plan Name:</span>
                        <span className="font-medium">{basicInfo.planName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Service Type:</span>
                        <span className="font-medium capitalize">{basicInfo.serviceType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Category:</span>
                        <span className="font-medium capitalize">{basicInfo.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <span className="font-medium capitalize">{basicInfo.status}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Pricing & Speed</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Monthly Price:</span>
                        <span className="font-medium">
                          {pricingConfig.currency} {pricingConfig.monthlyPrice}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Setup Fee:</span>
                        <span className="font-medium">
                          {pricingConfig.currency} {pricingConfig.setupFee || "0"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Download Speed:</span>
                        <span className="font-medium">{speedConfig.downloadSpeed[0]} Mbps</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Upload Speed:</span>
                        <span className="font-medium">{speedConfig.uploadSpeed[0]} Mbps</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  )
}
