"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Mail,
  MessageSquare,
  Bell,
  FileText,
  Save,
  RefreshCw,
  TestTube,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Send,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function CommunicationsSettingsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showPasswords, setShowPasswords] = useState(false)
  const [emailStatus, setEmailStatus] = useState<"connected" | "disconnected" | "testing">("connected")
  const [smsStatus, setSmsStatus] = useState<"connected" | "disconnected" | "testing">("disconnected")

  const handleSave = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    toast({
      title: "Settings saved",
      description: "Communication settings have been updated successfully.",
    })
  }

  const testEmailConnection = async () => {
    setEmailStatus("testing")
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setEmailStatus("connected")
    toast({
      title: "Email test successful",
      description: "Test email sent successfully.",
    })
  }

  const testSmsConnection = async () => {
    setSmsStatus("testing")
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setSmsStatus("connected")
    toast({
      title: "SMS test successful",
      description: "Test SMS sent successfully.",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Connected
          </Badge>
        )
      case "disconnected":
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Disconnected
          </Badge>
        )
      case "testing":
        return (
          <Badge variant="secondary">
            <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
            Testing...
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Communications</h2>
          <p className="text-muted-foreground">Configure email and SMS services for customer communications</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="email" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="email">Email Settings</TabsTrigger>
          <TabsTrigger value="sms">SMS Gateway</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5" />
                  <CardTitle>Email Configuration</CardTitle>
                </div>
                {getStatusBadge(emailStatus)}
              </div>
              <CardDescription>Configure SMTP settings for sending emails to customers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtp-host">SMTP Host *</Label>
                  <Input id="smtp-host" placeholder="smtp.gmail.com" defaultValue="smtp.gmail.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-port">SMTP Port</Label>
                  <Select defaultValue="587">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="25">25 (Non-encrypted)</SelectItem>
                      <SelectItem value="587">587 (STARTTLS)</SelectItem>
                      <SelectItem value="465">465 (SSL/TLS)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-username">Username *</Label>
                  <Input
                    id="smtp-username"
                    placeholder="your-email@gmail.com"
                    defaultValue="noreply@techconnect.co.ke"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-password">Password *</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="smtp-password"
                      type={showPasswords ? "text" : "password"}
                      placeholder="Enter password"
                      defaultValue="app_password_123"
                      className="flex-1"
                    />
                    <Button variant="outline" size="icon" onClick={() => setShowPasswords(!showPasswords)}>
                      {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="from-name">From Name</Label>
                  <Input id="from-name" placeholder="TechConnect ISP" defaultValue="TechConnect ISP" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="from-email">From Email</Label>
                  <Input
                    id="from-email"
                    type="email"
                    placeholder="noreply@techconnect.co.ke"
                    defaultValue="noreply@techconnect.co.ke"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reply-to">Reply To Email</Label>
                  <Input
                    id="reply-to"
                    type="email"
                    placeholder="support@techconnect.co.ke"
                    defaultValue="support@techconnect.co.ke"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="encryption">Encryption</Label>
                  <Select defaultValue="tls">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="tls">TLS</SelectItem>
                      <SelectItem value="ssl">SSL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">Email Settings</Label>
                  <p className="text-sm text-muted-foreground">Configure email delivery and formatting options</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable HTML Emails</Label>
                      <p className="text-sm text-muted-foreground">Send formatted HTML emails</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Tracking</Label>
                      <p className="text-sm text-muted-foreground">Track email opens and clicks</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto-retry Failed Emails</Label>
                      <p className="text-sm text-muted-foreground">Retry failed email deliveries</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Queue</Label>
                      <p className="text-sm text-muted-foreground">Queue emails for batch sending</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="max-retries">Max Retries</Label>
                    <Input id="max-retries" type="number" placeholder="3" defaultValue="3" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="retry-delay">Retry Delay (minutes)</Label>
                    <Input id="retry-delay" type="number" placeholder="5" defaultValue="5" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="batch-size">Batch Size</Label>
                    <Input id="batch-size" type="number" placeholder="50" defaultValue="50" />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex space-x-2">
                <Button variant="outline" onClick={testEmailConnection} disabled={emailStatus === "testing"}>
                  <TestTube className="mr-2 h-4 w-4" />
                  Test Email
                </Button>
                <Button variant="outline">
                  <Mail className="mr-2 h-4 w-4" />
                  View Email Logs
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sms" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <CardTitle>SMS Gateway Configuration</CardTitle>
                </div>
                {getStatusBadge(smsStatus)}
              </div>
              <CardDescription>Configure SMS gateway for sending text messages to customers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sms-provider">SMS Provider</Label>
                <Select defaultValue="africastalking">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="africastalking">Africa's Talking</SelectItem>
                    <SelectItem value="twilio">Twilio</SelectItem>
                    <SelectItem value="textlocal">TextLocal</SelectItem>
                    <SelectItem value="custom">Custom API</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sms-username">Username/API Key *</Label>
                  <Input id="sms-username" placeholder="Enter username or API key" defaultValue="your_username" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sms-api-key">API Key/Token *</Label>
                  <Input
                    id="sms-api-key"
                    type={showPasswords ? "text" : "password"}
                    placeholder="Enter API key"
                    defaultValue="your_api_key_123"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sms-sender-id">Sender ID</Label>
                  <Input id="sms-sender-id" placeholder="TECHCONNECT" defaultValue="TECHCONNECT" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sms-endpoint">API Endpoint</Label>
                  <Input
                    id="sms-endpoint"
                    placeholder="https://api.africastalking.com/version1/messaging"
                    defaultValue="https://api.africastalking.com/version1/messaging"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">SMS Settings</Label>
                  <p className="text-sm text-muted-foreground">Configure SMS delivery and formatting options</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable Delivery Reports</Label>
                      <p className="text-sm text-muted-foreground">Track SMS delivery status</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Unicode Support</Label>
                      <p className="text-sm text-muted-foreground">Support special characters</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto-retry Failed SMS</Label>
                      <p className="text-sm text-muted-foreground">Retry failed SMS deliveries</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>SMS Queue</Label>
                      <p className="text-sm text-muted-foreground">Queue SMS for batch sending</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sms-max-retries">Max Retries</Label>
                    <Input id="sms-max-retries" type="number" placeholder="3" defaultValue="3" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sms-retry-delay">Retry Delay (minutes)</Label>
                    <Input id="sms-retry-delay" type="number" placeholder="2" defaultValue="2" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sms-batch-size">Batch Size</Label>
                    <Input id="sms-batch-size" type="number" placeholder="100" defaultValue="100" />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">Cost Management</Label>
                  <p className="text-sm text-muted-foreground">Configure SMS cost and usage limits</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sms-cost-per-message">Cost per SMS (KES)</Label>
                    <Input id="sms-cost-per-message" type="number" step="0.01" placeholder="2.50" defaultValue="2.50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="daily-sms-limit">Daily SMS Limit</Label>
                    <Input id="daily-sms-limit" type="number" placeholder="1000" defaultValue="1000" />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable SMS Budget Alerts</Label>
                    <p className="text-sm text-muted-foreground">Alert when approaching SMS limits</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <Separator />

              <div className="flex space-x-2">
                <Button variant="outline" onClick={testSmsConnection} disabled={smsStatus === "testing"}>
                  <TestTube className="mr-2 h-4 w-4" />
                  Test SMS
                </Button>
                <Button variant="outline">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  View SMS Logs
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Message Templates</span>
              </CardTitle>
              <CardDescription>Configure email and SMS templates for automated communications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Template Categories</Label>
                    <p className="text-sm text-muted-foreground">Manage templates for different communication types</p>
                  </div>
                  <Button>
                    <FileText className="mr-2 h-4 w-4" />
                    New Template
                  </Button>
                </div>

                <div className="grid gap-4">
                  {[
                    { name: "Welcome Email", type: "Email", status: "Active", lastModified: "2024-01-15" },
                    { name: "Payment Reminder", type: "SMS", status: "Active", lastModified: "2024-01-14" },
                    { name: "Service Activation", type: "Email", status: "Active", lastModified: "2024-01-13" },
                    { name: "Payment Confirmation", type: "SMS", status: "Active", lastModified: "2024-01-12" },
                    { name: "Service Suspension", type: "Email", status: "Draft", lastModified: "2024-01-11" },
                  ].map((template, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {template.type === "Email" ? (
                            <Mail className="h-4 w-4 text-blue-600" />
                          ) : (
                            <MessageSquare className="h-4 w-4 text-green-600" />
                          )}
                          <div>
                            <Label className="font-medium">{template.name}</Label>
                            <p className="text-sm text-muted-foreground">{template.type} Template</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge variant={template.status === "Active" ? "default" : "secondary"}>
                          {template.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">Modified: {template.lastModified}</span>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">Template Variables</Label>
                  <p className="text-sm text-muted-foreground">Available variables for use in templates</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { variable: "{{customer_name}}", description: "Customer's full name" },
                    { variable: "{{customer_email}}", description: "Customer's email address" },
                    { variable: "{{customer_phone}}", description: "Customer's phone number" },
                    { variable: "{{service_plan}}", description: "Customer's service plan" },
                    { variable: "{{amount_due}}", description: "Outstanding amount" },
                    { variable: "{{due_date}}", description: "Payment due date" },
                    { variable: "{{company_name}}", description: "Your company name" },
                    { variable: "{{support_email}}", description: "Support email address" },
                    { variable: "{{support_phone}}", description: "Support phone number" },
                  ].map((item, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{item.variable}</code>
                      <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notification Settings</span>
              </CardTitle>
              <CardDescription>Configure when and how notifications are sent to customers and staff</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">Customer Notifications</Label>
                  <p className="text-sm text-muted-foreground">Configure automatic notifications sent to customers</p>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      title: "Payment Reminders",
                      description: "Remind customers about upcoming payments",
                      email: true,
                      sms: true,
                      timing: "3 days before due date",
                    },
                    {
                      title: "Payment Confirmations",
                      description: "Confirm successful payments",
                      email: true,
                      sms: true,
                      timing: "Immediately after payment",
                    },
                    {
                      title: "Service Activation",
                      description: "Notify when service is activated",
                      email: true,
                      sms: false,
                      timing: "Upon activation",
                    },
                    {
                      title: "Service Suspension",
                      description: "Notify when service is suspended",
                      email: true,
                      sms: true,
                      timing: "Upon suspension",
                    },
                    {
                      title: "Maintenance Alerts",
                      description: "Notify about scheduled maintenance",
                      email: true,
                      sms: false,
                      timing: "24 hours before maintenance",
                    },
                  ].map((notification, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <Label className="font-medium">{notification.title}</Label>
                          <p className="text-sm text-muted-foreground">{notification.description}</p>
                        </div>
                        <Badge variant="outline">{notification.timing}</Badge>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                          <Switch defaultChecked={notification.email} />
                          <Label className="text-sm">Email</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch defaultChecked={notification.sms} />
                          <Label className="text-sm">SMS</Label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">Staff Notifications</Label>
                  <p className="text-sm text-muted-foreground">Configure notifications sent to staff members</p>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      title: "New Customer Registration",
                      description: "Notify when new customers register",
                      enabled: true,
                      recipients: "Sales Team",
                    },
                    {
                      title: "Payment Failures",
                      description: "Alert when payments fail",
                      enabled: true,
                      recipients: "Finance Team",
                    },
                    {
                      title: "Support Tickets",
                      description: "Notify about new support tickets",
                      enabled: true,
                      recipients: "Support Team",
                    },
                    {
                      title: "System Alerts",
                      description: "Critical system notifications",
                      enabled: true,
                      recipients: "IT Team",
                    },
                  ].map((notification, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Switch defaultChecked={notification.enabled} />
                        <div>
                          <Label className="font-medium">{notification.title}</Label>
                          <p className="text-sm text-muted-foreground">{notification.description}</p>
                        </div>
                      </div>
                      <Badge variant="outline">{notification.recipients}</Badge>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">Notification Timing</Label>
                  <p className="text-sm text-muted-foreground">Configure when notifications are sent</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reminder-days">Payment Reminder (days before due)</Label>
                    <Select defaultValue="3">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 day</SelectItem>
                        <SelectItem value="3">3 days</SelectItem>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="14">14 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="overdue-reminder">Overdue Reminder Frequency</Label>
                    <Select defaultValue="daily">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maintenance-notice">Maintenance Notice (hours before)</Label>
                    <Select defaultValue="24">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2 hours</SelectItem>
                        <SelectItem value="6">6 hours</SelectItem>
                        <SelectItem value="24">24 hours</SelectItem>
                        <SelectItem value="48">48 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quiet-hours">Quiet Hours (no SMS)</Label>
                    <Select defaultValue="22-06">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No quiet hours</SelectItem>
                        <SelectItem value="22-06">10 PM - 6 AM</SelectItem>
                        <SelectItem value="23-07">11 PM - 7 AM</SelectItem>
                        <SelectItem value="21-08">9 PM - 8 AM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
