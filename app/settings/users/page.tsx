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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UserCog, Shield, Users, Key, Save, RefreshCw, Plus, Edit, Trash2, CheckCircle, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function UserManagementPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showPasswords, setShowPasswords] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    toast({
      title: "Settings saved",
      description: "User management settings have been updated successfully.",
    })
  }

  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john@techconnect.co.ke",
      role: "Administrator",
      department: "IT",
      status: "active",
      lastLogin: "2024-01-15 10:30",
      employeeId: "EMP001",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@techconnect.co.ke",
      role: "Manager",
      department: "Customer Service",
      status: "active",
      lastLogin: "2024-01-15 09:15",
      employeeId: "EMP002",
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@techconnect.co.ke",
      role: "Technician",
      department: "Network Operations",
      status: "inactive",
      lastLogin: "2024-01-10 14:20",
      employeeId: "EMP003",
    },
    {
      id: 4,
      name: "Sarah Wilson",
      email: "sarah@techconnect.co.ke",
      role: "Accountant",
      department: "Finance",
      status: "active",
      lastLogin: "2024-01-15 08:45",
      employeeId: "EMP004",
    },
  ]

  const roles = [
    {
      name: "Administrator",
      description: "Full system access and management",
      permissions: ["All Permissions"],
      userCount: 2,
    },
    {
      name: "Manager",
      description: "Department management and reporting",
      permissions: ["View Reports", "Manage Team", "Customer Management"],
      userCount: 3,
    },
    {
      name: "Technician",
      description: "Network and technical operations",
      permissions: ["Network Management", "Customer Support", "Equipment Management"],
      userCount: 5,
    },
    {
      name: "Accountant",
      description: "Financial management and billing",
      permissions: ["Billing Management", "Financial Reports", "Payment Processing"],
      userCount: 2,
    },
    {
      name: "Support Agent",
      description: "Customer support and ticket management",
      permissions: ["Customer Support", "Ticket Management", "Knowledge Base"],
      userCount: 4,
    },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
          <p className="text-muted-foreground">Manage user accounts, roles, and permissions</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Sync Employees
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">User Accounts</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="access">Access Control</TabsTrigger>
          <TabsTrigger value="integration">Employee Integration</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <CardTitle>User Accounts</CardTitle>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </div>
              <CardDescription>Manage system user accounts and their basic information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Input placeholder="Search users..." className="max-w-sm" />
                  <Select>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="administrator">Administrator</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="technician">Technician</SelectItem>
                      <SelectItem value="accountant">Accountant</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div>{user.name}</div>
                            <div className="text-sm text-muted-foreground">ID: {user.employeeId}</div>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.role}</Badge>
                        </TableCell>
                        <TableCell>{user.department}</TableCell>
                        <TableCell>
                          <Badge variant={user.status === "active" ? "default" : "secondary"}>
                            {user.status === "active" ? (
                              <CheckCircle className="w-3 h-3 mr-1" />
                            ) : (
                              <XCircle className="w-3 h-3 mr-1" />
                            )}
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{user.lastLogin}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Key className="h-4 w-4" />
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

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common user management tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex-col bg-transparent">
                  <Plus className="h-6 w-6 mb-2" />
                  <span>Add New User</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col bg-transparent">
                  <Key className="h-6 w-6 mb-2" />
                  <span>Reset Passwords</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col bg-transparent">
                  <Users className="h-6 w-6 mb-2" />
                  <span>Bulk Import</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <CardTitle>Roles & Permissions</CardTitle>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Role
                </Button>
              </div>
              <CardDescription>Define user roles and their associated permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {roles.map((role, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div>
                          <Label className="font-medium text-base">{role.name}</Label>
                          <p className="text-sm text-muted-foreground">{role.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline">{role.userCount} users</Badge>
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
                    <div className="flex flex-wrap gap-2">
                      {role.permissions.map((permission, permIndex) => (
                        <Badge key={permIndex} variant="secondary" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Permission Categories</CardTitle>
              <CardDescription>Available permission categories in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    category: "Customer Management",
                    permissions: ["View Customers", "Add Customers", "Edit Customers", "Delete Customers"],
                  },
                  {
                    category: "Billing & Finance",
                    permissions: ["View Billing", "Process Payments", "Generate Invoices", "Financial Reports"],
                  },
                  {
                    category: "Network Operations",
                    permissions: ["View Network", "Manage Routers", "IP Configuration", "Network Monitoring"],
                  },
                  {
                    category: "Support & Tickets",
                    permissions: ["View Tickets", "Create Tickets", "Assign Tickets", "Close Tickets"],
                  },
                  {
                    category: "Reports & Analytics",
                    permissions: ["View Reports", "Generate Reports", "Export Data", "Analytics Dashboard"],
                  },
                  {
                    category: "System Administration",
                    permissions: ["User Management", "System Settings", "Backup & Restore", "Audit Logs"],
                  },
                ].map((category, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <Label className="font-medium">{category.category}</Label>
                    <div className="mt-2 space-y-1">
                      {category.permissions.map((permission, permIndex) => (
                        <div key={permIndex} className="text-sm text-muted-foreground">
                          • {permission}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Key className="h-5 w-5" />
                <span>Access Control Settings</span>
              </CardTitle>
              <CardDescription>Configure security and access control policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">Password Policy</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Configure password requirements for user accounts
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="min-password-length">Minimum Password Length</Label>
                    <Select defaultValue="8">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6">6 characters</SelectItem>
                        <SelectItem value="8">8 characters</SelectItem>
                        <SelectItem value="10">10 characters</SelectItem>
                        <SelectItem value="12">12 characters</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-expiry">Password Expiry (days)</Label>
                    <Select defaultValue="90">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="60">60 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="never">Never expires</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Require Uppercase Letters</Label>
                      <p className="text-sm text-muted-foreground">At least one uppercase letter</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Require Numbers</Label>
                      <p className="text-sm text-muted-foreground">At least one number</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Require Special Characters</Label>
                      <p className="text-sm text-muted-foreground">At least one special character</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Prevent Password Reuse</Label>
                      <p className="text-sm text-muted-foreground">Last 5 passwords</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">Session Management</Label>
                  <p className="text-sm text-muted-foreground mb-3">Configure user session and login policies</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                    <Select defaultValue="60">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                        <SelectItem value="480">8 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-login-attempts">Max Login Attempts</Label>
                    <Select defaultValue="5">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 attempts</SelectItem>
                        <SelectItem value="5">5 attempts</SelectItem>
                        <SelectItem value="10">10 attempts</SelectItem>
                        <SelectItem value="unlimited">Unlimited</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lockout-duration">Account Lockout Duration (minutes)</Label>
                    <Select defaultValue="30">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="1440">24 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="concurrent-sessions">Max Concurrent Sessions</Label>
                    <Select defaultValue="3">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 session</SelectItem>
                        <SelectItem value="3">3 sessions</SelectItem>
                        <SelectItem value="5">5 sessions</SelectItem>
                        <SelectItem value="unlimited">Unlimited</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Force Password Change on First Login</Label>
                      <p className="text-sm text-muted-foreground">New users must change password</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Remember Login Sessions</Label>
                      <p className="text-sm text-muted-foreground">Allow "Remember Me" option</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground mb-3">Configure 2FA settings for enhanced security</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable 2FA for Administrators</Label>
                      <p className="text-sm text-muted-foreground">Mandatory for admin accounts</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Optional 2FA for Other Users</Label>
                      <p className="text-sm text-muted-foreground">Users can enable voluntarily</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="2fa-methods">Allowed 2FA Methods</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch defaultChecked />
                      <Label>SMS</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch defaultChecked />
                      <Label>Email</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch />
                      <Label>Authenticator App</Label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserCog className="h-5 w-5" />
                <span>Employee Integration</span>
              </CardTitle>
              <CardDescription>Configure how user accounts integrate with employee records</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">Auto-Sync Settings</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Configure automatic synchronization between HR and user systems
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto-create User Accounts</Label>
                      <p className="text-sm text-muted-foreground">Create accounts for new employees</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto-disable Terminated Employees</Label>
                      <p className="text-sm text-muted-foreground">Disable accounts when employees leave</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Sync Department Changes</Label>
                      <p className="text-sm text-muted-foreground">Update roles when departments change</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Sync Contact Information</Label>
                      <p className="text-sm text-muted-foreground">Update email and phone from HR</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">Role Assignment Rules</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Configure how employee positions map to system roles
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    { position: "IT Manager", department: "IT", defaultRole: "Administrator", autoAssign: true },
                    {
                      position: "Customer Service Manager",
                      department: "Customer Service",
                      defaultRole: "Manager",
                      autoAssign: true,
                    },
                    {
                      position: "Network Technician",
                      department: "Network Operations",
                      defaultRole: "Technician",
                      autoAssign: true,
                    },
                    { position: "Accountant", department: "Finance", defaultRole: "Accountant", autoAssign: true },
                    {
                      position: "Support Agent",
                      department: "Customer Service",
                      defaultRole: "Support Agent",
                      autoAssign: true,
                    },
                  ].map((rule, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <Label className="font-medium">{rule.position}</Label>
                          <p className="text-sm text-muted-foreground">{rule.department} Department</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <Label className="text-sm">Default Role:</Label>
                          <p className="text-sm font-medium">{rule.defaultRole}</p>
                        </div>
                        <Switch defaultChecked={rule.autoAssign} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">Account Provisioning</Label>
                  <p className="text-sm text-muted-foreground mb-3">Configure how new user accounts are set up</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username-format">Username Format</Label>
                    <Select defaultValue="firstname.lastname">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="firstname.lastname">firstname.lastname</SelectItem>
                        <SelectItem value="firstnamelastname">firstnamelastname</SelectItem>
                        <SelectItem value="employee-id">Employee ID</SelectItem>
                        <SelectItem value="email">Email Address</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-domain">Email Domain</Label>
                    <Input id="email-domain" placeholder="@techconnect.co.ke" defaultValue="@techconnect.co.ke" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="default-password">Default Password Policy</Label>
                    <Select defaultValue="temporary">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="temporary">Temporary Password</SelectItem>
                        <SelectItem value="employee-id">Employee ID</SelectItem>
                        <SelectItem value="random">Random Generated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notification-method">Account Creation Notification</Label>
                    <Select defaultValue="email">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                        <SelectItem value="both">Email & SMS</SelectItem>
                        <SelectItem value="none">No Notification</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex space-x-2">
                <Button variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Sync Now
                </Button>
                <Button variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  View Sync Log
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
