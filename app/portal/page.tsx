"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Activity, Settings, Eye, MessageSquare, LogOut, Smartphone, Monitor, Tablet, Globe, Clock, TrendingUp, BarChart3 } from 'lucide-react'

const activeSessions = [
  {
    id: 1,
    customerName: "John Doe",
    email: "john@example.com",
    device: "Desktop",
    browser: "Chrome",
    location: "Nairobi, Kenya",
    loginTime: "2024-01-15 09:30:00",
    lastActivity: "2 minutes ago",
    ipAddress: "192.168.1.100"
  },
  {
    id: 2,
    customerName: "Jane Smith",
    email: "jane@example.com",
    device: "Mobile",
    browser: "Safari",
    location: "Mombasa, Kenya",
    loginTime: "2024-01-15 08:45:00",
    lastActivity: "5 minutes ago",
    ipAddress: "192.168.1.101"
  },
  {
    id: 3,
    customerName: "Bob Johnson",
    email: "bob@example.com",
    device: "Tablet",
    browser: "Firefox",
    location: "Kisumu, Kenya",
    loginTime: "2024-01-15 10:15:00",
    lastActivity: "1 minute ago",
    ipAddress: "192.168.1.102"
  }
]

const portalFeatures = [
  {
    id: 1,
    name: "Account Management",
    description: "View and edit account information",
    enabled: true,
    usage: 89
  },
  {
    id: 2,
    name: "Billing & Invoices",
    description: "Access billing history and invoices",
    enabled: true,
    usage: 76
  },
  {
    id: 3,
    name: "Service Plans",
    description: "View and upgrade service plans",
    enabled: true,
    usage: 45
  },
  {
    id: 4,
    name: "Support Tickets",
    description: "Create and track support requests",
    enabled: true,
    usage: 32
  },
  {
    id: 5,
    name: "Usage Analytics",
    description: "View data usage and statistics",
    enabled: false,
    usage: 0
  },
  {
    id: 6,
    name: "Payment Methods",
    description: "Manage payment methods and autopay",
    enabled: true,
    usage: 67
  }
]

export default function PortalPage() {
  const [selectedTab, setSelectedTab] = useState("overview")
  const [features, setFeatures] = useState(portalFeatures)
  const router = useRouter()

  useEffect(() => {
    if (selectedTab === "redirect") {
      router.replace("/settings/portal")
    }
  }, [selectedTab, router])

  const toggleFeature = (featureId: number) => {
    setFeatures(features.map(feature => 
      feature.id === featureId 
        ? { ...feature, enabled: !feature.enabled }
        : feature
    ))
  }

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'mobile':
        return <Smartphone className="h-4 w-4" />
      case 'tablet':
        return <Tablet className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  const totalUsers = 1247
  const activeUsers = activeSessions.length
  const dailyLogins = 89
  const portalStatus = "operational"

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Customer Portal</h2>
          <p className="text-muted-foreground">
            Manage customer portal access and features
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => setSelectedTab("redirect")}>
            <Settings className="mr-2 h-4 w-4" />
            Portal Settings
          </Button>
          <Button>
            <Globe className="mr-2 h-4 w-4" />
            Visit Portal
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portal Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Registered portal users
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              Currently logged in
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Logins</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dailyLogins}</div>
            <p className="text-xs text-muted-foreground">
              Today's login count
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portal Status</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Online</div>
            <p className="text-xs text-muted-foreground">
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sessions">Active Sessions</TabsTrigger>
          <TabsTrigger value="features">Portal Features</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="redirect">Redirect</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Portal Activity</CardTitle>
                <CardDescription>Latest customer portal interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-blue-100">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New user registration</p>
                      <p className="text-xs text-muted-foreground">Alice Cooper registered 5 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-green-100">
                      <Activity className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Payment processed</p>
                      <p className="text-xs text-muted-foreground">John Doe paid invoice #1234 - $89.99</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-yellow-100">
                      <MessageSquare className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Support ticket created</p>
                      <p className="text-xs text-muted-foreground">Jane Smith opened ticket #5678</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-purple-100">
                      <Settings className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Plan upgrade</p>
                      <p className="text-xs text-muted-foreground">Bob Johnson upgraded to Premium plan</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Device Distribution</CardTitle>
                <CardDescription>Portal access by device type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <div className="flex items-center space-x-2">
                        <Monitor className="h-4 w-4" />
                        <span>Desktop</span>
                      </div>
                      <span>45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <div className="flex items-center space-x-2">
                        <Smartphone className="h-4 w-4" />
                        <span>Mobile</span>
                      </div>
                      <span>35%</span>
                    </div>
                    <Progress value={35} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <div className="flex items-center space-x-2">
                        <Tablet className="h-4 w-4" />
                        <span>Tablet</span>
                      </div>
                      <span>20%</span>
                    </div>
                    <Progress value={20} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active User Sessions</CardTitle>
              <CardDescription>Currently logged in portal users</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Browser</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Login Time</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeSessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{session.customerName}</div>
                          <div className="text-sm text-muted-foreground">{session.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getDeviceIcon(session.device)}
                          <span>{session.device}</span>
                        </div>
                      </TableCell>
                      <TableCell>{session.browser}</TableCell>
                      <TableCell>{session.location}</TableCell>
                      <TableCell className="text-sm">
                        {new Date(session.loginTime).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {session.lastActivity}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <LogOut className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Portal Features Management</CardTitle>
              <CardDescription>Enable or disable customer portal features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {features.map((feature) => (
                  <div key={feature.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-medium">{feature.name}</h4>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                        <Switch
                          checked={feature.enabled}
                          onCheckedChange={() => toggleFeature(feature.id)}
                        />
                      </div>
                      {feature.enabled && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>Usage</span>
                            <span>{feature.usage}%</span>
                          </div>
                          <Progress value={feature.usage} className="h-2" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Portal Usage Metrics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Session Duration</span>
                    <span className="font-medium">12 minutes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Page Views per Session</span>
                    <span className="font-medium">4.2</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Bounce Rate</span>
                    <span className="font-medium">15%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Customer Satisfaction</span>
                    <span className="font-medium">4.6/5</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Popular Features</CardTitle>
                <CardDescription>Most used portal features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Account Management</span>
                      <span>89%</span>
                    </div>
                    <Progress value={89} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Billing & Invoices</span>
                      <span>76%</span>
                    </div>
                    <Progress value={76} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Payment Methods</span>
                      <span>67%</span>
                    </div>
                    <Progress value={67} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Service Plans</span>
                      <span>45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="redirect" className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-lg font-semibold">Redirecting to Portal Settings...</h2>
            <p className="text-muted-foreground">Please wait while we redirect you.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
