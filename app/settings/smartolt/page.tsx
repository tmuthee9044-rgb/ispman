"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Wifi, Settings, Database, Monitor, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react'
import { getSmartOLTConfig, updateSmartOLTConfig, testSmartOLTConnection, syncSmartOLTData } from "@/app/actions/smartolt-actions"
import { toast } from "sonner"

export default function SmartOLTConfigPage() {
  const [activeTab, setActiveTab] = useState("configuration")
  const [config, setConfig] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    try {
      const configData = await getSmartOLTConfig()
      setConfig(configData)
    } catch (error) {
      console.error('Error loading config:', error)
      toast.error('Failed to load SmartOLT configuration')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveConfiguration = async (formData: FormData) => {
    setSaving(true)
    try {
      const result = await updateSmartOLTConfig(formData)
      if (result.success) {
        toast.success(result.message)
        loadConfig()
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
    setTesting(true)
    try {
      const result = await testSmartOLTConnection()
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.error('Error testing connection:', error)
      toast.error('Connection test failed')
    } finally {
      setTesting(false)
    }
  }

  const handleSyncData = async () => {
    setSyncing(true)
    try {
      const result = await syncSmartOLTData()
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.error('Error syncing data:', error)
      toast.error('Data synchronization failed')
    } finally {
      setSyncing(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-64">Loading...</div>
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">SmartOLT Integration</h2>
          <p className="text-muted-foreground">Configure SmartOLT API connection and synchronization settings</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleTestConnection} disabled={testing} variant="outline">
            {testing ? "Testing..." : "Test Connection"}
          </Button>
          <Button onClick={handleSyncData} disabled={syncing}>
            {syncing ? "Syncing..." : "Sync Now"}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="synchronization">Synchronization</TabsTrigger>
          <TabsTrigger value="provisioning">Provisioning</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="configuration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>API Connection Settings</span>
              </CardTitle>
              <CardDescription>Configure the connection to your SmartOLT management system</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={handleSaveConfiguration} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api_base_url">API Base URL</Label>
                  <Input 
                    id="api_base_url" 
                    name="api_base_url"
                    placeholder="https://smartolt.example.com/api"
                    defaultValue={config?.api_base_url || ''}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="api_username">API Username</Label>
                    <Input 
                      id="api_username" 
                      name="api_username"
                      defaultValue={config?.api_username || ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="api_password">API Password</Label>
                    <Input 
                      id="api_password" 
                      name="api_password"
                      type="password"
                      defaultValue={config?.api_password || ''}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="api_token">API Token (if using token authentication)</Label>
                  <Input 
                    id="api_token" 
                    name="api_token"
                    type="password"
                    placeholder="Bearer token or API key"
                    defaultValue={config?.api_token || ''}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="connection_timeout">Connection Timeout (seconds)</Label>
                    <Input 
                      id="connection_timeout" 
                      name="connection_timeout"
                      type="number"
                      placeholder="30"
                      defaultValue={config?.connection_timeout || 30}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max_connections">Max Connections</Label>
                    <Input 
                      id="max_connections" 
                      name="max_connections"
                      type="number"
                      placeholder="10"
                      defaultValue={config?.max_connections || 10}
                    />
                  </div>
                </div>

                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Configuration"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="synchronization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Data Synchronization</span>
              </CardTitle>
              <CardDescription>Configure automatic data synchronization with SmartOLT</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={handleSaveConfiguration} className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="sync_enabled" 
                    name="sync_enabled"
                    defaultChecked={config?.sync_enabled || false}
                  />
                  <Label htmlFor="sync_enabled">Enable Automatic Synchronization</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sync_interval">Sync Interval (seconds)</Label>
                  <Input 
                    id="sync_interval" 
                    name="sync_interval"
                    type="number"
                    placeholder="300"
                    defaultValue={config?.sync_interval || 300}
                  />
                  <p className="text-sm text-muted-foreground">
                    How often to sync data with SmartOLT (minimum 60 seconds)
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Last Synchronization</h4>
                      <p className="text-sm text-muted-foreground">
                        {config?.last_sync 
                          ? new Date(config.last_sync).toLocaleString() 
                          : 'Never synchronized'
                        }
                      </p>
                    </div>
                    <Button onClick={handleSyncData} disabled={syncing} variant="outline">
                      {syncing ? "Syncing..." : "Sync Now"}
                    </Button>
                  </div>
                </div>

                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Settings"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="provisioning" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Wifi className="h-5 w-5" />
                <span>Auto Provisioning</span>
              </CardTitle>
              <CardDescription>Configure automatic ONU provisioning and WiFi settings</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={handleSaveConfiguration} className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="auto_provision" 
                    name="auto_provision"
                    defaultChecked={config?.auto_provision || false}
                  />
                  <Label htmlFor="auto_provision">Enable Automatic ONU Provisioning</Label>
                </div>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Auto provisioning will automatically configure new ONUs when they come online.
                    Ensure your service profiles are properly configured before enabling.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <h4 className="font-medium">WiFi Auto Configuration</h4>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="wifi_auto_config" 
                      name="wifi_auto_config"
                      defaultChecked={config?.wifi_auto_config || false}
                    />
                    <Label htmlFor="wifi_auto_config">Enable WiFi Auto Configuration</Label>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="wifi_ssid_template">WiFi SSID Template</Label>
                      <Input 
                        id="wifi_ssid_template" 
                        name="wifi_ssid_template"
                        placeholder="TrustWaves_{serial}"
                        defaultValue={config?.wifi_ssid_template || 'TrustWaves_{serial}'}
                      />
                      <p className="text-xs text-muted-foreground">
                        Use {'{serial}'} as placeholder for ONU serial number
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="wifi_password_template">WiFi Password Template</Label>
                      <Input 
                        id="wifi_password_template" 
                        name="wifi_password_template"
                        placeholder="{serial}_wifi"
                        defaultValue={config?.wifi_password_template || '{serial}_wifi'}
                      />
                      <p className="text-xs text-muted-foreground">
                        Use {'{serial}'} as placeholder for ONU serial number
                      </p>
                    </div>
                  </div>
                </div>

                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Provisioning Settings"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Connection Status</CardTitle>
                <Wifi className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  {config ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className="text-sm font-medium">
                    {config ? "Connected" : "Not Configured"}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Auto Sync</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  {config?.sync_enabled ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className="text-sm font-medium">
                    {config?.sync_enabled ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Auto Provisioning</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  {config?.auto_provision ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className="text-sm font-medium">
                    {config?.auto_provision ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">WiFi Auto Config</CardTitle>
                <Wifi className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  {config?.wifi_auto_config ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className="text-sm font-medium">
                    {config?.wifi_auto_config ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Integration Status</CardTitle>
              <CardDescription>Current status of SmartOLT integration components</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">API Connection</h4>
                  <p className="text-sm text-muted-foreground">
                    {config?.api_base_url || 'Not configured'}
                  </p>
                </div>
                {config?.api_base_url ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Data Synchronization</h4>
                  <p className="text-sm text-muted-foreground">
                    {config?.sync_enabled 
                      ? `Every ${config.sync_interval} seconds`
                      : 'Manual sync only'
                    }
                  </p>
                </div>
                {config?.sync_enabled ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <Clock className="h-5 w-5 text-yellow-500" />
                )}
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Last Sync</h4>
                  <p className="text-sm text-muted-foreground">
                    {config?.last_sync 
                      ? new Date(config.last_sync).toLocaleString()
                      : 'Never synchronized'
                    }
                  </p>
                </div>
                {config?.last_sync ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
