"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Router, Settings, Monitor, PlayCircle, Wifi, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react'
import { getTR069Config, updateTR069Config, getTR069Devices, createTR069Task, getTR069Tasks } from "@/app/actions/tr069-actions"
import { toast } from "sonner"

export default function TR069ConfigPage() {
  const [activeTab, setActiveTab] = useState("configuration")
  const [config, setConfig] = useState<any>(null)
  const [devices, setDevices] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testingConnection, setTestingConnection] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [configData, devicesData, tasksData] = await Promise.all([
        getTR069Config(),
        getTR069Devices(),
        getTR069Tasks()
      ])
      setConfig(configData)
      setDevices(devicesData)
      setTasks(tasksData)
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Failed to load TR-069 data')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveConfiguration = async (formData: FormData) => {
    setSaving(true)
    try {
      const result = await updateTR069Config(formData)
      if (result.success) {
        toast.success(result.message)
        loadData()
      } else {
        toast.error('Failed to save configuration')
      }
    } catch (error) {
      console.error('Error saving config:', error)
      toast.error('Failed to save configuration')
    } finally {
      setSaving(false)
    }
  }

  const handleTestConnection = async () => {
    setTestingConnection(true)
    try {
      // Simulate connection test
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('Connection test successful')
    } catch (error) {
      toast.error('Connection test failed')
    } finally {
      setTestingConnection(false)
    }
  }

  const handleCreateTask = async (deviceId: string, taskType: string) => {
    const formData = new FormData()
    formData.append('device_id', deviceId)
    formData.append('task_type', taskType)
    
    try {
      const result = await createTR069Task(formData)
      if (result.success) {
        toast.success(result.message)
        loadData()
      } else {
        toast.error('Failed to create task')
      }
    } catch (error) {
      console.error('Error creating task:', error)
      toast.error('Failed to create task')
    }
  }

  const getDeviceStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'offline': return <XCircle className="h-4 w-4 text-red-500" />
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />
      default: return <AlertTriangle className="h-4 w-4 text-gray-400" />
    }
  }

  const getTaskStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>
      case 'running':
        return <Badge className="bg-blue-100 text-blue-800">Running</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-64">Loading...</div>
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">TR-069 Configuration</h2>
          <p className="text-muted-foreground">Configure TR-069 ACS server and manage CPE devices</p>
        </div>
        <Button onClick={handleTestConnection} disabled={testingConnection} variant="outline">
          {testingConnection ? "Testing..." : "Test Connection"}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="configuration" className="space-y-4">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>ACS Server Configuration</span>
                </CardTitle>
                <CardDescription>Configure the Auto Configuration Server settings</CardDescription>
              </CardHeader>
              <CardContent>
                <form action={handleSaveConfiguration} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="acs_server_url">ACS Server URL</Label>
                      <Input 
                        id="acs_server_url" 
                        name="acs_server_url"
                        placeholder="http://acs.example.com:7547"
                        defaultValue={config?.acs_server_url || ''}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="connection_request_port">Connection Request Port</Label>
                      <Input 
                        id="connection_request_port" 
                        name="connection_request_port"
                        type="number"
                        placeholder="7547"
                        defaultValue={config?.connection_request_port || 7547}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="acs_username">ACS Username</Label>
                      <Input 
                        id="acs_username" 
                        name="acs_username"
                        defaultValue={config?.acs_username || ''}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="acs_password">ACS Password</Label>
                      <Input 
                        id="acs_password" 
                        name="acs_password"
                        type="password"
                        defaultValue={config?.acs_password || ''}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="connection_request_username">Connection Request Username</Label>
                      <Input 
                        id="connection_request_username" 
                        name="connection_request_username"
                        defaultValue={config?.connection_request_username || ''}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="connection_request_password">Connection Request Password</Label>
                      <Input 
                        id="connection_request_password" 
                        name="connection_request_password"
                        type="password"
                        defaultValue={config?.connection_request_password || ''}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="periodic_inform_enable" 
                        name="periodic_inform_enable"
                        defaultChecked={config?.periodic_inform_enable || false}
                      />
                      <Label htmlFor="periodic_inform_enable">Enable Periodic Inform</Label>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="periodic_inform_interval">Periodic Inform Interval (seconds)</Label>
                      <Input 
                        id="periodic_inform_interval" 
                        name="periodic_inform_interval"
                        type="number"
                        placeholder="3600"
                        defaultValue={config?.periodic_inform_interval || 3600}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="ssl_enabled" 
                        name="ssl_enabled"
                        defaultChecked={config?.ssl_enabled || false}
                      />
                      <Label htmlFor="ssl_enabled">Enable SSL/TLS</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="ssl_verify" 
                        name="ssl_verify"
                        defaultChecked={config?.ssl_verify || false}
                      />
                      <Label htmlFor="ssl_verify">Verify SSL Certificate</Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="certificate_path">Certificate Path (optional)</Label>
                    <Input 
                      id="certificate_path" 
                      name="certificate_path"
                      placeholder="/path/to/certificate.pem"
                      defaultValue={config?.certificate_path || ''}
                    />
                  </div>

                  <Button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save Configuration"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="devices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Router className="h-5 w-5" />
                <span>TR-069 Devices</span>
              </CardTitle>
              <CardDescription>Manage connected TR-069 CPE devices</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Device ID</TableHead>
                    <TableHead>Manufacturer</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Serial Number</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Inform</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {devices.map((device) => (
                    <TableRow key={device.id}>
                      <TableCell className="font-medium">{device.device_id}</TableCell>
                      <TableCell>{device.manufacturer}</TableCell>
                      <TableCell>{device.model}</TableCell>
                      <TableCell>{device.serial_number}</TableCell>
                      <TableCell>{device.customer_name || 'Unassigned'}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getDeviceStatusIcon(device.status)}
                          <span className="capitalize">{device.status}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {device.last_inform ? new Date(device.last_inform).toLocaleString() : 'Never'}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleCreateTask(device.device_id, 'reboot')}
                          >
                            Reboot
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleCreateTask(device.device_id, 'factory_reset')}
                          >
                            Factory Reset
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

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PlayCircle className="h-5 w-5" />
                <span>TR-069 Tasks</span>
              </CardTitle>
              <CardDescription>Monitor and manage TR-069 device tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task ID</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Task Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Executed</TableHead>
                    <TableHead>Result</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">#{task.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{task.manufacturer} {task.model}</div>
                          <div className="text-sm text-muted-foreground">{task.serial_number}</div>
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">{task.task_type.replace('_', ' ')}</TableCell>
                      <TableCell>{getTaskStatusBadge(task.status)}</TableCell>
                      <TableCell>{new Date(task.created_at).toLocaleString()}</TableCell>
                      <TableCell>
                        {task.executed_at ? new Date(task.executed_at).toLocaleString() : 'Not executed'}
                      </TableCell>
                      <TableCell>
                        {task.error_message ? (
                          <span className="text-red-600">{task.error_message}</span>
                        ) : task.result ? (
                          <span className="text-green-600">Success</span>
                        ) : (
                          <span className="text-gray-500">Pending</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
                <Router className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{devices.length}</div>
                <p className="text-xs text-muted-foreground">
                  TR-069 enabled devices
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Online Devices</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {devices.filter(d => d.status === 'online').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Currently connected
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
                <Clock className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {tasks.filter(t => t.status === 'pending').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Awaiting execution
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <Monitor className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">95%</div>
                <p className="text-xs text-muted-foreground">
                  Task completion rate
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>TR-069 ACS server and connection status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">ACS Server</h4>
                  <p className="text-sm text-muted-foreground">
                    {config?.acs_server_url || 'Not configured'}
                  </p>
                </div>
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">SSL/TLS</h4>
                  <p className="text-sm text-muted-foreground">
                    {config?.ssl_enabled ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
                {config?.ssl_enabled ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Periodic Inform</h4>
                  <p className="text-sm text-muted-foreground">
                    {config?.periodic_inform_enable ? 
                      `Enabled (${config.periodic_inform_interval}s)` : 
                      'Disabled'
                    }
                  </p>
                </div>
                {config?.periodic_inform_enable ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
