"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Server, CreditCard, MessageSquare, Users, Globe, Zap, FileText, Settings, CheckCircle, AlertCircle, Clock, Database, Router, Wifi } from 'lucide-react'
import Link from "next/link"

const settingsCategories = [
  {
    id: "company",
    title: "Company Profile",
    description: "Manage company information, branding, and contact details",
    icon: Building2,
    href: "/settings/company",
    status: "configured",
    items: ["Company Info", "Logo & Branding", "Contact Details", "Localization"],
  },
  {
    id: "servers",
    title: "Server Configuration",
    description: "Configure RADIUS, OpenVPN, and network infrastructure",
    icon: Server,
    href: "/settings/servers",
    status: "pending",
    items: ["RADIUS Server", "OpenVPN Server", "Network Settings", "Monitoring"],
  },
  {
    id: "payments",
    title: "Payment Gateway",
    description: "Set up M-Pesa and other payment processing systems",
    icon: CreditCard,
    href: "/settings/payments",
    status: "configured",
    items: ["M-Pesa Configuration", "Bank Integration", "Payment Methods", "Webhooks"],
  },
  {
    id: "communications",
    title: "Communications",
    description: "Configure email, SMS, and notification systems",
    icon: MessageSquare,
    href: "/settings/communications",
    status: "partial",
    items: ["Email Settings", "SMS Gateway", "Templates", "Notifications"],
  },
  {
    id: "users",
    title: "User Management",
    description: "Manage user accounts, roles, and permissions",
    icon: Users,
    href: "/settings/users",
    status: "configured",
    items: ["User Accounts", "Roles & Permissions", "Access Control", "2FA Settings"],
  },
  {
    id: "portal",
    title: "Portal Settings",
    description: "Configure customer and admin portal settings",
    icon: Globe,
    href: "/settings/portal",
    status: "configured",
    items: ["Admin Portal", "Customer Portal", "Themes", "Features"],
  },
  {
    id: "tr069",
    title: "TR-069 Configuration",
    description: "Configure TR-069 ACS server and CPE device management",
    icon: Router,
    href: "/settings/tr069",
    status: "partial",
    items: ["ACS Server", "Device Management", "Tasks", "Monitoring"],
  },
  {
    id: "smartolt",
    title: "SmartOLT Integration",
    description: "Configure SmartOLT API connection and synchronization",
    icon: Wifi,
    href: "/settings/smartolt",
    status: "pending",
    items: ["API Connection", "Data Sync", "Auto Provisioning", "Monitoring"],
  },
  {
    id: "automation",
    title: "Automation",
    description: "Set up automated workflows and scheduled tasks",
    icon: Zap,
    href: "/settings/automation",
    status: "partial",
    items: ["Workflows", "Scheduled Tasks", "Triggers", "Actions"],
  },
  {
    id: "backup",
    title: "System Backup",
    description: "Configure automated backups and data protection",
    icon: Database,
    href: "/settings/backup",
    status: "configured",
    items: ["Backup Settings", "Schedule", "Storage", "History"],
  },
  {
    id: "logs",
    title: "System Logs",
    description: "View and manage system logs and audit trails",
    icon: FileText,
    href: "/logs",
    status: "configured",
    items: ["Application Logs", "Audit Logs", "Error Logs", "Access Logs"],
  },
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case "configured":
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case "partial":
      return <Clock className="h-4 w-4 text-yellow-500" />
    case "pending":
      return <AlertCircle className="h-4 w-4 text-red-500" />
    default:
      return <AlertCircle className="h-4 w-4 text-gray-400" />
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "configured":
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          Configured
        </Badge>
      )
    case "partial":
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          Partial
        </Badge>
      )
    case "pending":
      return (
        <Badge variant="destructive" className="bg-red-100 text-red-800">
          Pending
        </Badge>
      )
    default:
      return <Badge variant="outline">Unknown</Badge>
  }
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">Manage your ISP system configuration and preferences</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="quick-setup">Quick Setup</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {settingsCategories.map((category) => {
              const Icon = category.icon
              return (
                <Card key={category.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center space-x-2">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <CardTitle className="text-sm font-medium">{category.title}</CardTitle>
                    </div>
                    {getStatusIcon(category.status)}
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-xs mb-3">{category.description}</CardDescription>
                    <div className="flex items-center justify-between">
                      {getStatusBadge(category.status)}
                      <Button asChild size="sm" variant="outline">
                        <Link href={category.href}>Configure</Link>
                      </Button>
                    </div>
                    <div className="mt-3 pt-3 border-t">
                      <div className="text-xs text-muted-foreground">
                        <div className="grid grid-cols-2 gap-1">
                          {category.items.map((item, index) => (
                            <div key={index} className="truncate">
                              • {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="quick-setup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Quick Setup Wizard</span>
              </CardTitle>
              <CardDescription>
                Get your ISP system up and running quickly with our guided setup process
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Essential Setup</CardTitle>
                    <CardDescription>Configure the minimum required settings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Company Profile</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Payment Gateway</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <span>Server Configuration</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-yellow-500" />
                        <span>Communications</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>System Backup</span>
                      </div>
                    </div>
                    <Button className="w-full mt-4" size="sm">
                      Start Essential Setup
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Advanced Setup</CardTitle>
                    <CardDescription>Configure advanced features and automation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>User Management</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Portal Settings</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-yellow-500" />
                        <span>TR-069 Configuration</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <span>SmartOLT Integration</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-yellow-500" />
                        <span>Automation</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>System Logs</span>
                      </div>
                    </div>
                    <Button className="w-full mt-4 bg-transparent" size="sm" variant="outline">
                      Start Advanced Setup
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">System Status</h4>
                    <p className="text-sm text-muted-foreground">Overall configuration progress</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">75%</div>
                    <div className="text-xs text-muted-foreground">Complete</div>
                  </div>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: "75%" }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
