"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wifi, CreditCard, Router } from "lucide-react"

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address?: string
  city?: string
  county?: string
  postal_code?: string
  connection_type?: string
  router_ip?: string
  mac_address?: string
  installation_date?: string
  last_payment?: string
  balance: number
  status: string
  portal_username?: string
  customer_type?: string
  payment_method?: string
  auto_payment?: boolean
  business_name?: string
  business_type?: string
  physical_gps_lat?: string
  physical_gps_lng?: string
  created_at: string
}

interface Service {
  id: string
  plan_name: string
  price: number
  speed_download: string
  speed_upload: string
  status: string
  start_date: string
}

interface Payment {
  id: string
  amount: number
  payment_date: string
  payment_method: string
  status: string
  reference?: string
}

interface CustomerPortalClientProps {
  customer: Customer
  services: Service[]
  payments: Payment[]
}

export function CustomerPortalClient({ customer, services, payments }: CustomerPortalClientProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-500"
      case "suspended":
        return "bg-red-500"
      case "pending":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Customer Portal</h1>
              <p className="text-gray-600">Welcome back, {customer.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className={getStatusColor(customer.status)}>{customer.status}</Badge>
              <div className="text-right">
                <p className="text-sm text-gray-600">Account Balance</p>
                <p className={`font-bold ${customer.balance < 0 ? "text-red-600" : "text-green-600"}`}>
                  KES {customer.balance.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Services</CardTitle>
                  <Wifi className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{services.filter((s) => s.status === "active").length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Last Payment</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {customer.last_payment ? new Date(customer.last_payment).toLocaleDateString() : "N/A"}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Connection Type</CardTitle>
                  <Router className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{customer.connection_type || "N/A"}</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Payments</CardTitle>
              </CardHeader>
              <CardContent>
                {payments.length > 0 ? (
                  <div className="space-y-4">
                    {payments.slice(0, 5).map((payment) => (
                      <div key={payment.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">KES {payment.amount.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">{new Date(payment.payment_date).toLocaleDateString()}</p>
                        </div>
                        <Badge variant={payment.status === "completed" ? "default" : "secondary"}>
                          {payment.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No payment history available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Services</CardTitle>
              </CardHeader>
              <CardContent>
                {services.length > 0 ? (
                  <div className="space-y-4">
                    {services.map((service) => (
                      <div key={service.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{service.plan_name}</h3>
                          <Badge className={getStatusColor(service.status)}>{service.status}</Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Price</p>
                            <p className="font-medium">KES {service.price.toLocaleString()}/month</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Download Speed</p>
                            <p className="font-medium">{service.speed_download}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Upload Speed</p>
                            <p className="font-medium">{service.speed_upload}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Start Date</p>
                            <p className="font-medium">{new Date(service.start_date).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No active services</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Billing Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Account Balance</h3>
                    <p className={`text-2xl font-bold ${customer.balance < 0 ? "text-red-600" : "text-green-600"}`}>
                      KES {customer.balance.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Payment Method</h3>
                    <p>{customer.payment_method || "Not set"}</p>
                    <p className="text-sm text-gray-600">
                      Auto-payment: {customer.auto_payment ? "Enabled" : "Disabled"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                {payments.length > 0 ? (
                  <div className="space-y-3">
                    {payments.map((payment) => (
                      <div key={payment.id} className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">KES {payment.amount.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(payment.payment_date).toLocaleDateString()} • {payment.payment_method}
                          </p>
                          {payment.reference && <p className="text-xs text-gray-500">Ref: {payment.reference}</p>}
                        </div>
                        <Badge variant={payment.status === "completed" ? "default" : "secondary"}>
                          {payment.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No payment history available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Name</label>
                      <p className="font-medium">{customer.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Email</label>
                      <p className="font-medium">{customer.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Phone</label>
                      <p className="font-medium">{customer.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Customer Type</label>
                      <p className="font-medium">{customer.customer_type || "Individual"}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Address</label>
                      <p className="font-medium">
                        {customer.address && customer.city
                          ? `${customer.address}, ${customer.city}${customer.county ? `, ${customer.county}` : ""}`
                          : "Not provided"}
                      </p>
                    </div>
                    {customer.business_name && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Business Name</label>
                        <p className="font-medium">{customer.business_name}</p>
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-medium text-gray-600">Installation Date</label>
                      <p className="font-medium">
                        {customer.installation_date
                          ? new Date(customer.installation_date).toLocaleDateString()
                          : "Not set"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Technical Information */}
            <Card>
              <CardHeader>
                <CardTitle>Technical Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Router IP</label>
                      <p className="font-medium font-mono">{customer.router_ip || "Not assigned"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">MAC Address</label>
                      <p className="font-medium font-mono">{customer.mac_address || "Not recorded"}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Connection Type</label>
                      <p className="font-medium">{customer.connection_type || "Not specified"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Portal Username</label>
                      <p className="font-medium font-mono">{customer.portal_username || "Not set"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
