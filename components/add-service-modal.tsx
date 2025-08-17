"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { addCustomerService } from "@/app/actions/customer-service-actions"
import { Wifi, Globe, Zap, Clock, CheckCircle, Plus } from "lucide-react"

interface AddServiceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customerId: number
  customerData: {
    name: string
    email: string
    phone: string
    portal_username: string
  }
}

export function AddServiceModal({ open, onOpenChange, customerId, customerData }: AddServiceModalProps) {
  const [selectedPlan, setSelectedPlan] = useState("")
  const [connectionType, setConnectionType] = useState("")
  const [ipAssignment, setIpAssignment] = useState("dhcp")
  const [staticIp, setStaticIp] = useState("")
  const [gateway, setGateway] = useState("")
  const [dns1, setDns1] = useState("8.8.8.8")
  const [dns2, setDns2] = useState("8.8.4.4")
  const [selectedRouter, setSelectedRouter] = useState("")
  const [autoRenew, setAutoRenew] = useState(true)
  const [pppoeEnabled, setPppoeEnabled] = useState(false)
  const [pppoeUsername, setPppoeUsername] = useState(customerData.portal_username)
  const [pppoePassword, setPppoePassword] = useState(customerData.phone.slice(-6))
  const [pppoeIpType, setPppoeIpType] = useState("dhcp")
  const [pppoeStaticIp, setPppoeStaticIp] = useState("")
  const [pppoeGateway, setPppoeGateway] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const servicePlans = [
    {
      id: 1,
      name: "Basic Plan",
      price: 29.99,
      description: "Perfect for light internet usage, email, and basic browsing",
      speed_down: 10,
      speed_up: 5,
      data_limit: null,
      features: ["Email & Web Browsing", "Basic Streaming", "24/7 Support"],
      popular: false,
    },
    {
      id: 2,
      name: "Standard Plan",
      price: 49.99,
      description: "Great for streaming, video calls, and moderate usage",
      speed_down: 50,
      speed_up: 25,
      data_limit: null,
      features: ["HD Streaming", "Video Calls", "Multiple Devices", "24/7 Support"],
      popular: true,
    },
    {
      id: 3,
      name: "Premium Plan",
      price: 79.99,
      description: "High-speed internet for heavy usage, gaming, and 4K streaming",
      speed_down: 100,
      speed_up: 50,
      data_limit: null,
      features: ["4K Streaming", "Gaming", "Smart Home", "Priority Support"],
      popular: false,
    },
    {
      id: 4,
      name: "Business Basic",
      price: 99.99,
      description: "Reliable internet solution for small businesses",
      speed_down: 150,
      speed_up: 75,
      data_limit: null,
      features: ["Business Grade", "Static IP", "SLA Guarantee", "Priority Support"],
      popular: false,
    },
  ]

  const connectionTypes = [
    { value: "fiber", label: "Fiber Optic", icon: Zap, description: "High-speed fiber connection" },
    { value: "wireless", label: "Wireless", icon: Wifi, description: "Wireless radio connection" },
    { value: "cable", label: "Cable", icon: Globe, description: "Cable internet connection" },
  ]

  const routers = [
    { id: 1, name: "Edge Router 1", ip: "192.168.1.1", status: "online", load: 45, location: "Tower A" },
    { id: 2, name: "Edge Router 2", ip: "192.168.1.2", status: "online", load: 62, location: "Tower B" },
    { id: 3, name: "Edge Router 3", ip: "192.168.1.3", status: "online", load: 38, location: "Tower C" },
    { id: 4, name: "Edge Router 4", ip: "192.168.1.4", status: "maintenance", load: 0, location: "Tower D" },
  ]

  const selectedPlanData = servicePlans.find((plan) => plan.id === Number.parseInt(selectedPlan))

  const handleSubmit = async () => {
    if (!selectedPlan || !connectionType || !selectedRouter) return

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append("customer_id", customerId.toString())
      formData.append("service_plan_id", selectedPlan)
      formData.append("connection_type", connectionType)
      formData.append("router_id", selectedRouter)
      formData.append("ip_assignment", ipAssignment)
      formData.append("auto_renew", autoRenew ? "on" : "off")

      if (ipAssignment === "static") {
        formData.append("static_ip", staticIp)
        formData.append("gateway", gateway)
        formData.append("dns1", dns1)
        formData.append("dns2", dns2)
      }

      if (pppoeEnabled) {
        formData.append("pppoe_enabled", "true")
        formData.append("pppoe_username", pppoeUsername)
        formData.append("pppoe_password", pppoePassword)
        formData.append("pppoe_ip_type", pppoeIpType)
        if (pppoeIpType === "static") {
          formData.append("pppoe_static_ip", pppoeStaticIp)
          formData.append("pppoe_gateway", pppoeGateway)
        }
      }

      const result = await addCustomerService(formData)

      if (result.success) {
        onOpenChange(false)
        // Reset form
        setSelectedPlan("")
        setConnectionType("")
        setIpAssignment("dhcp")
        setSelectedRouter("")
        setPppoeEnabled(false)
      }
    } catch (error) {
      console.error("Error adding service:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Service for {customerData.name}</DialogTitle>
          <DialogDescription>Configure a new internet service for this customer</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="plans" className="space-y-4">
          <TabsList>
            <TabsTrigger value="plans">Service Plans</TabsTrigger>
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="plans" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {servicePlans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`cursor-pointer transition-all ${
                    selectedPlan === plan.id.toString() ? "ring-2 ring-primary border-primary" : "hover:shadow-md"
                  } ${plan.popular ? "border-primary" : ""}`}
                  onClick={() => setSelectedPlan(plan.id.toString())}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                      {plan.popular && <Badge>Most Popular</Badge>}
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold">${plan.price}</div>
                        <div className="text-sm text-muted-foreground">per month</div>
                      </div>
                      <div className="flex items-center justify-center gap-4 text-sm">
                        <div className="text-center">
                          <div className="font-semibold">{plan.speed_down} Mbps</div>
                          <div className="text-muted-foreground">Download</div>
                        </div>
                        <Separator orientation="vertical" className="h-8" />
                        <div className="text-center">
                          <div className="font-semibold">{plan.speed_up} Mbps</div>
                          <div className="text-muted-foreground">Upload</div>
                        </div>
                      </div>
                      <ul className="space-y-1 text-sm">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="configuration" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Connection Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Connection Type</Label>
                    <RadioGroup value={connectionType} onValueChange={setConnectionType}>
                      {connectionTypes.map((type) => (
                        <div key={type.value} className="flex items-center space-x-2">
                          <RadioGroupItem value={type.value} id={type.value} />
                          <Label htmlFor={type.value} className="flex items-center gap-2 cursor-pointer">
                            <type.icon className="w-4 h-4" />
                            <div>
                              <div className="font-medium">{type.label}</div>
                              <div className="text-sm text-muted-foreground">{type.description}</div>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <Separator />

                  <div>
                    <Label>IP Assignment</Label>
                    <RadioGroup value={ipAssignment} onValueChange={setIpAssignment}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="dhcp" id="dhcp" />
                        <Label htmlFor="dhcp">DHCP (Automatic)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="static" id="static" />
                        <Label htmlFor="static">Static IP</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {ipAssignment === "static" && (
                    <div className="space-y-3 p-3 border rounded-lg bg-muted/20">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="static-ip">IP Address</Label>
                          <Input
                            id="static-ip"
                            value={staticIp}
                            onChange={(e) => setStaticIp(e.target.value)}
                            placeholder="192.168.1.100"
                          />
                        </div>
                        <div>
                          <Label htmlFor="gateway">Gateway</Label>
                          <Input
                            id="gateway"
                            value={gateway}
                            onChange={(e) => setGateway(e.target.value)}
                            placeholder="192.168.1.1"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="dns1">Primary DNS</Label>
                          <Input
                            id="dns1"
                            value={dns1}
                            onChange={(e) => setDns1(e.target.value)}
                            placeholder="8.8.8.8"
                          />
                        </div>
                        <div>
                          <Label htmlFor="dns2">Secondary DNS</Label>
                          <Input
                            id="dns2"
                            value={dns2}
                            onChange={(e) => setDns2(e.target.value)}
                            placeholder="8.8.4.4"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="pppoe"
                        checked={pppoeEnabled}
                        onCheckedChange={(checked) => setPppoeEnabled(checked as boolean)}
                      />
                      <Label htmlFor="pppoe" className="font-medium">
                        Enable PPPoE Authentication
                      </Label>
                    </div>

                    {pppoeEnabled && (
                      <div className="space-y-3 p-3 border rounded-lg bg-blue-50/50">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor="pppoe-username">PPPoE Username</Label>
                            <Input
                              id="pppoe-username"
                              value={pppoeUsername}
                              onChange={(e) => setPppoeUsername(e.target.value)}
                              placeholder="customer@isp.com"
                            />
                          </div>
                          <div>
                            <Label htmlFor="pppoe-password">PPPoE Password</Label>
                            <Input
                              id="pppoe-password"
                              type="password"
                              value={pppoePassword}
                              onChange={(e) => setPppoePassword(e.target.value)}
                              placeholder="Enter password"
                            />
                          </div>
                        </div>

                        <div>
                          <Label>PPPoE IP Assignment</Label>
                          <RadioGroup value={pppoeIpType} onValueChange={setPppoeIpType}>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="dhcp" id="pppoe-dhcp" />
                              <Label htmlFor="pppoe-dhcp">DHCP (Server Assigned)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="static" id="pppoe-static" />
                              <Label htmlFor="pppoe-static">Static IP within PPPoE</Label>
                            </div>
                          </RadioGroup>
                        </div>

                        {pppoeIpType === "static" && (
                          <div className="space-y-3 p-3 border rounded-lg bg-muted/20">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label htmlFor="pppoe-static-ip">PPPoE Static IP</Label>
                                <Input
                                  id="pppoe-static-ip"
                                  value={pppoeStaticIp}
                                  onChange={(e) => setPppoeStaticIp(e.target.value)}
                                  placeholder="10.0.0.100"
                                />
                              </div>
                              <div>
                                <Label htmlFor="pppoe-gateway">PPPoE Gateway</Label>
                                <Input
                                  id="pppoe-gateway"
                                  value={pppoeGateway}
                                  onChange={(e) => setPppoeGateway(e.target.value)}
                                  placeholder="10.0.0.1"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Router Selection</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {routers.map((router) => (
                      <Card
                        key={router.id}
                        className={`cursor-pointer transition-all ${
                          selectedRouter === router.id.toString()
                            ? "ring-2 ring-primary border-primary"
                            : "hover:shadow-sm"
                        } ${router.status === "maintenance" ? "opacity-50" : ""}`}
                        onClick={() => router.status !== "maintenance" && setSelectedRouter(router.id.toString())}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">{router.name}</div>
                              <div className="text-sm text-muted-foreground">{router.ip}</div>
                              <div className="text-sm text-muted-foreground">{router.location}</div>
                            </div>
                            <div className="text-right">
                              <Badge
                                className={
                                  router.status === "online" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                }
                              >
                                {router.status}
                              </Badge>
                              <div className="text-sm text-muted-foreground mt-1">Load: {router.load}%</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Service Options</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="auto-renew"
                    checked={autoRenew}
                    onCheckedChange={(checked) => setAutoRenew(checked as boolean)}
                  />
                  <Label htmlFor="auto-renew">Enable automatic renewal</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="summary" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Service Configuration Summary</CardTitle>
                <CardDescription>Review the service configuration before adding</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedPlanData && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-medium">Service Plan</h4>
                      <div className="p-3 border rounded-lg">
                        <div className="font-medium">{selectedPlanData.name}</div>
                        <div className="text-sm text-muted-foreground">{selectedPlanData.description}</div>
                        <div className="text-lg font-bold mt-2">${selectedPlanData.price}/month</div>
                        <div className="text-sm text-muted-foreground">
                          {selectedPlanData.speed_down}Mbps / {selectedPlanData.speed_up}Mbps
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium">Configuration</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Connection Type:</span>
                          <span className="capitalize">{connectionType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">IP Assignment:</span>
                          <span className="capitalize">{ipAssignment}</span>
                        </div>
                        {ipAssignment === "static" && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Static IP:</span>
                            <span>{staticIp}</span>
                          </div>
                        )}
                        {pppoeEnabled && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">PPPoE:</span>
                              <span>Enabled</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">PPPoE Username:</span>
                              <span>{pppoeUsername}</span>
                            </div>
                          </>
                        )}
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Auto Renew:</span>
                          <span>{autoRenew ? "Yes" : "No"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-4">
                  <Button
                    onClick={handleSubmit}
                    disabled={!selectedPlan || !connectionType || !selectedRouter || isLoading}
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                        Adding Service...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Service
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
