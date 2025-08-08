"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Zap,
  Play,
  Pause,
  Edit,
  Trash2,
  Plus,
  Clock,
  Target,
  Settings,
  RefreshCw,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AutomationPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    toast({
      title: "Settings saved",
      description: "Automation settings have been updated successfully.",
    })
  }

  const workflows = [
    {
      id: 1,
      name: "Payment Reminder Workflow",
      description: "Send payment reminders to customers with overdue bills",
      trigger: "Bill Overdue",
      status: "active",
      lastRun: "2024-01-15 10:30",
      executions: 45,
      successRate: 98,
    },
    {
      id: 2,
      name: "Service Activation",
      description: "Automatically activate service after payment confirmation",
      trigger: "Payment Received",
      status: "active",
      lastRun: "2024-01-15 09:15",
      executions: 23,
      successRate: 100,
    },
    {
      id: 3,
      name: "Welcome Email Sequence",
      description: "Send welcome emails to new customers",
      trigger: "Customer Registration",
      status: "active",
      lastRun: "2024-01-14 16:20",
      executions: 12,
      successRate: 95,
    },
    {
      id: 4,
      name: "Service Suspension",
      description: "Suspend service for customers with overdue payments",
      trigger: "Payment Overdue 30 Days",
      status: "paused",
      lastRun: "2024-01-10 08:00",
      executions: 8,
      successRate: 100,
    },
  ]

  const triggers = [
    { name: "Customer Registration", description: "When a new customer registers", category: "Customer" },
    { name: "Payment Received", description: "When payment is confirmed", category: "Billing" },
    { name: "Payment Failed", description: "When payment fails", category: "Billing" },
    { name: "Bill Generated", description: "When a new bill is generated", category: "Billing" },
    { name: "Service Activated", description: "When service is activated", category: "Service" },
    { name: "Support Ticket Created", description: "When a new ticket is created", category: "Support" },
    { name: "Network Alert", description: "When network issues are detected", category: "Network" },
    { name: "Scheduled Time", description: "At specific times/intervals", category: "Schedule" },
  ]

  const actions = [
    { name: "Send Email", description: "Send email to customer or staff", category: "Communication" },
    { name: "Send SMS", description: "Send SMS notification", category: "Communication" },
    { name: "Update Customer Status", description: "Change customer account status", category: "Customer" },
    { name: "Suspend Service", description: "Suspend customer service", category: "Service" },
    { name: "Activate Service", description: "Activate customer service", category: "Service" },
    { name: "Create Task", description: "Create a task for staff", category: "Task" },
    { name: "Generate Report", description: "Generate and send reports", category: "Reporting" },
    { name: "Update Billing", description: "Update billing information", category: "Billing" },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </Badge>
        )
      case "paused":
        return (
          <Badge variant="secondary">
            <Pause className="w-3 h-3 mr-1" />
            Paused
          </Badge>
        )
      case "error":
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Error
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
          <h2 className="text-3xl font-bold tracking-tight">Automation</h2>
          <p className="text-muted-foreground">Configure automated workflows and tasks for your ISP operations</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Workflow
          </Button>
        </div>
      </div>

      <Tabs defaultValue="workflows" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="triggers">Triggers</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
          <TabsTrigger value="schedules">Schedules</TabsTrigger>
        </TabsList>

        <TabsContent value="workflows" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <CardTitle>Active Workflows</CardTitle>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Workflow
                </Button>
              </div>
              <CardDescription>Manage your automated workflows and their execution status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Input placeholder="Search workflows..." className="max-w-sm" />
                  <Select>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Workflow</TableHead>
                      <TableHead>Trigger</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Run</TableHead>
                      <TableHead>Executions</TableHead>
                      <TableHead>Success Rate</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {workflows.map((workflow) => (
                      <TableRow key={workflow.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{workflow.name}</div>
                            <div className="text-sm text-muted-foreground">{workflow.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{workflow.trigger}</Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(workflow.status)}</TableCell>
                        <TableCell className="text-sm">{workflow.lastRun}</TableCell>
                        <TableCell>{workflow.executions}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-600 h-2 rounded-full"
                                style={{ width: `${workflow.successRate}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{workflow.successRate}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              {workflow.status === "active" ? (
                                <Pause className="h-4 w-4" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Workflow Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Workflows</span>
                    <span className="text-2xl font-bold">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active</span>
                    <span className="text-lg font-semibold text-green-600">9</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Paused</span>
                    <span className="text-lg font-semibold text-yellow-600">2</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Errors</span>
                    <span className="text-lg font-semibold text-red-600">1</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Execution Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Today</span>
                    <span className="text-2xl font-bold">156</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">This Week</span>
                    <span className="text-lg font-semibold">1,234</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">This Month</span>
                    <span className="text-lg font-semibold">5,678</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Success Rate</span>
                    <span className="text-lg font-semibold text-green-600">97.8%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Workflow
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Settings className="mr-2 h-4 w-4" />
                    Global Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Target className="mr-2 h-4 w-4" />
                    Test Workflow
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="triggers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Available Triggers</span>
              </CardTitle>
              <CardDescription>Events that can start automated workflows</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Input placeholder="Search triggers..." className="max-w-sm" />
                  <Select>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="customer">Customer</SelectItem>
                      <SelectItem value="billing">Billing</SelectItem>
                      <SelectItem value="service">Service</SelectItem>
                      <SelectItem value="support">Support</SelectItem>
                      <SelectItem value="network">Network</SelectItem>
                      <SelectItem value="schedule">Schedule</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {triggers.map((trigger, index) => (
                    <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <Label className="font-medium">{trigger.name}</Label>
                        <Badge variant="outline">{trigger.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{trigger.description}</p>
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        <Plus className="mr-2 h-4 w-4" />
                        Use Trigger
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Custom Triggers</CardTitle>
              <CardDescription>Create custom triggers for specific business needs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="trigger-name">Trigger Name</Label>
                    <Input id="trigger-name" placeholder="Enter trigger name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="trigger-category">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="custom">Custom</SelectItem>
                        <SelectItem value="customer">Customer</SelectItem>
                        <SelectItem value="billing">Billing</SelectItem>
                        <SelectItem value="service">Service</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="trigger-description">Description</Label>
                  <Textarea id="trigger-description" placeholder="Describe when this trigger should fire" rows={3} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="trigger-conditions">Conditions (JSON)</Label>
                  <Textarea
                    id="trigger-conditions"
                    placeholder='{"field": "value", "operator": "equals"}'
                    rows={4}
                    className="font-mono text-sm"
                  />
                </div>

                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Custom Trigger
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Available Actions</span>
              </CardTitle>
              <CardDescription>Actions that can be performed by automated workflows</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Input placeholder="Search actions..." className="max-w-sm" />
                  <Select>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="communication">Communication</SelectItem>
                      <SelectItem value="customer">Customer</SelectItem>
                      <SelectItem value="service">Service</SelectItem>
                      <SelectItem value="billing">Billing</SelectItem>
                      <SelectItem value="task">Task</SelectItem>
                      <SelectItem value="reporting">Reporting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {actions.map((action, index) => (
                    <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <Label className="font-medium">{action.name}</Label>
                        <Badge variant="outline">{action.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{action.description}</p>
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        <Plus className="mr-2 h-4 w-4" />
                        Use Action
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Action Configuration</CardTitle>
              <CardDescription>Configure default settings for actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">Email Action Settings</Label>
                  <p className="text-sm text-muted-foreground mb-3">Default settings for email actions</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="default-from-email">Default From Email</Label>
                    <Input
                      id="default-from-email"
                      placeholder="noreply@techconnect.co.ke"
                      defaultValue="noreply@techconnect.co.ke"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="default-from-name">Default From Name</Label>
                    <Input id="default-from-name" placeholder="TechConnect ISP" defaultValue="TechConnect ISP" />
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-base font-medium">SMS Action Settings</Label>
                  <p className="text-sm text-muted-foreground mb-3">Default settings for SMS actions</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="default-sender-id">Default Sender ID</Label>
                    <Input id="default-sender-id" placeholder="TECHCONNECT" defaultValue="TECHCONNECT" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sms-rate-limit">Rate Limit (per minute)</Label>
                    <Input id="sms-rate-limit" type="number" placeholder="10" defaultValue="10" />
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable Action Logging</Label>
                      <p className="text-sm text-muted-foreground">Log all action executions</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Retry Failed Actions</Label>
                      <p className="text-sm text-muted-foreground">Automatically retry failed actions</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Scheduled Tasks</span>
              </CardTitle>
              <CardDescription>Configure time-based automation schedules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4">
                  {[
                    {
                      name: "Daily Billing Report",
                      schedule: "Daily at 8:00 AM",
                      nextRun: "2024-01-16 08:00",
                      status: "active",
                      description: "Generate and email daily billing summary",
                    },
                    {
                      name: "Weekly Customer Report",
                      schedule: "Every Monday at 9:00 AM",
                      nextRun: "2024-01-22 09:00",
                      status: "active",
                      description: "Generate weekly customer activity report",
                    },
                    {
                      name: "Monthly Cleanup",
                      schedule: "1st of every month at 2:00 AM",
                      nextRun: "2024-02-01 02:00",
                      status: "active",
                      description: "Clean up old logs and temporary files",
                    },
                    {
                      name: "Backup Database",
                      schedule: "Daily at 2:00 AM",
                      nextRun: "2024-01-16 02:00",
                      status: "active",
                      description: "Create daily database backup",
                    },
                  ].map((task, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div>
                            <Label className="font-medium">{task.name}</Label>
                            <p className="text-sm text-muted-foreground">{task.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {getStatusBadge(task.status)}
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Schedule: {task.schedule}</span>
                        <span className="text-muted-foreground">Next run: {task.nextRun}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Scheduled Task
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Create Scheduled Task</CardTitle>
              <CardDescription>Set up a new time-based automation task</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="task-name">Task Name</Label>
                    <Input id="task-name" placeholder="Enter task name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="task-type">Task Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select task type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="report">Generate Report</SelectItem>
                        <SelectItem value="cleanup">Data Cleanup</SelectItem>
                        <SelectItem value="backup">Backup</SelectItem>
                        <SelectItem value="notification">Send Notification</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="task-description">Description</Label>
                  <Textarea id="task-description" placeholder="Describe what this task does" rows={2} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="schedule-type">Schedule Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="custom">Custom Cron</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="schedule-time">Time</Label>
                    <Input id="schedule-time" type="time" defaultValue="08:00" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select defaultValue="eat">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="eat">EAT (UTC+3)</SelectItem>
                        <SelectItem value="utc">UTC</SelectItem>
                        <SelectItem value="cat">CAT (UTC+2)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Task</Label>
                    <p className="text-sm text-muted-foreground">Start this task immediately after creation</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Scheduled Task
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
