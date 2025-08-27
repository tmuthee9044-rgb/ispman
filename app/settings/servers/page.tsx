"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Server,
  Shield,
  Network,
  Activity,
  CheckCircle,
  AlertCircle,
  Clock,
  Wifi,
  Router,
  Database,
} from "lucide-react"

export default function ServerConfigurationPage() {
  const [isPending, setIsPending] = useState(false)
  const [activeNetworkTab, setActiveNetworkTab] = useState("configuration")

  const handleSave = async () => {
    setIsPending(true)
    // Simulate save operation
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsPending(false)
  }

  const handleTestConnection = async (type: string) => {
    // Simulate connection test
    await new Promise((resolve) => setTimeout(resolve, 1500))
    alert(`${type} connection test successful!`)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Server Configuration</h2>
          <p className="text-muted-foreground">Configure RADIUS, OpenVPN, and network infrastructure settings</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
          <Button onClick={handleSave} disabled={isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="radius" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="radius" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>RADIUS Server</span>
          </TabsTrigger>
          <TabsTrigger value="openvpn" className="flex items-center space-x-2">
            <Server className="h-4 w-4" />
            <span>OpenVPN</span>
          </TabsTrigger>
          <TabsTrigger value="network" className="flex items-center space-x-2">
            <Network className="h-4 w-4" />
            <span>Network</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="radius" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>RADIUS Server Configuration</span>
              </CardTitle>
              <CardDescription>Configure RADIUS authentication and accounting settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Enable RADIUS Server</Label>
                  <div className="text-sm text-muted-foreground">
                    Enable RADIUS authentication for network access control
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="radius-host">RADIUS Server Host *</Label>
                  <Input id="radius-host" placeholder="Enter RADIUS server IP" defaultValue="" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="auth-port">Authentication Port</Label>
                  <Input id="auth-port" placeholder="1812" defaultValue="1812" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="acct-port">Accounting Port</Label>
                  <Input id="acct-port" placeholder="1813" defaultValue="1813" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeout">Timeout (seconds)</Label>
                  <Input id="timeout" placeholder="30" defaultValue="30" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shared-secret">Shared Secret *</Label>
                <Input id="shared-secret" type="password" placeholder="Enter RADIUS shared secret" />
              </div>

              <div className="space-y-4">
                <Label className="text-base">Authentication Methods</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="pap" defaultChecked />
                    <Label htmlFor="pap">PAP</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="chap" defaultChecked />
                    <Label htmlFor="chap">CHAP</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="mschap" />
                    <Label htmlFor="mschap">MS-CHAP</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="mschapv2" />
                    <Label htmlFor="mschapv2">MS-CHAPv2</Label>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => handleTestConnection("RADIUS")}
                className="flex items-center space-x-2"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Test Connection</span>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="openvpn" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Server className="h-5 w-5" />
                <span>OpenVPN Server Configuration</span>
              </CardTitle>
              <CardDescription>Configure OpenVPN server settings and client access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Enable OpenVPN Server</Label>
                  <div className="text-sm text-muted-foreground">Enable VPN server for remote access</div>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vpn-server-ip">Server IP Address</Label>
                  <Input id="vpn-server-ip" placeholder="Enter VPN server IP" defaultValue="" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vpn-port">Port</Label>
                  <Input id="vpn-port" placeholder="1194" defaultValue="1194" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vpn-protocol">Protocol</Label>
                  <Select defaultValue="udp">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="udp">UDP</SelectItem>
                      <SelectItem value="tcp">TCP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vpn-cipher">Cipher</Label>
                  <Select defaultValue="aes-256-cbc">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aes-256-cbc">AES-256-CBC</SelectItem>
                      <SelectItem value="aes-128-cbc">AES-128-CBC</SelectItem>
                      <SelectItem value="blowfish">Blowfish</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vpn-network">VPN Network</Label>
                <Input id="vpn-network" placeholder="10.8.0.0/24" defaultValue="10.8.0.0/24" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primary-dns">Primary DNS</Label>
                  <Input id="primary-dns" placeholder="8.8.8.8" defaultValue="8.8.8.8" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondary-dns">Secondary DNS</Label>
                  <Input id="secondary-dns" placeholder="8.8.4.4" defaultValue="8.8.4.4" />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-base">Security Options</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="tls-auth" defaultChecked />
                    <Label htmlFor="tls-auth">TLS Authentication</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="client-to-client" />
                    <Label htmlFor="client-to-client">Client-to-Client</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="duplicate-cn" />
                    <Label htmlFor="duplicate-cn">Duplicate CN</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="compression" defaultChecked />
                    <Label htmlFor="compression">Compression</Label>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => handleTestConnection("OpenVPN")}
                className="flex items-center space-x-2"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Test Configuration</span>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="network" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Network className="h-5 w-5" />
                <span>Network Management</span>
              </CardTitle>
              <CardDescription>Configure network infrastructure and monitoring settings</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeNetworkTab} onValueChange={setActiveNetworkTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="configuration" className="flex items-center space-x-2">
                    <Router className="h-4 w-4" />
                    <span>Network Configuration</span>
                  </TabsTrigger>
                  <TabsTrigger value="monitoring" className="flex items-center space-x-2">
                    <Activity className="h-4 w-4" />
                    <span>Monitoring</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="configuration" className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="gateway">Default Gateway</Label>
                      <Input id="gateway" placeholder="Enter gateway IP" defaultValue="" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subnet-mask">Subnet Mask</Label>
                      <Input id="subnet-mask" placeholder="255.255.255.0" defaultValue="255.255.255.0" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="management-vlan">Management VLAN</Label>
                      <Input id="management-vlan" placeholder="Enter VLAN ID" defaultValue="" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customer-vlan">Customer VLAN Range</Label>
                      <Input id="customer-vlan" placeholder="200-299" defaultValue="" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="snmp-community">SNMP Community</Label>
                    <Input id="snmp-community" placeholder="public" defaultValue="public" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ntp-server">NTP Server</Label>
                    <Input id="ntp-server" placeholder="pool.ntp.org" defaultValue="pool.ntp.org" />
                  </div>

                  <div className="space-y-4">
                    <Label className="text-base">Network Features</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch id="firewall" defaultChecked />
                        <Label htmlFor="firewall">Firewall</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="ddos-protection" defaultChecked />
                        <Label htmlFor="ddos-protection">DDoS Protection</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="port-scan" />
                        <Label htmlFor="port-scan">Port Scan Detection</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="intrusion-detection" />
                        <Label htmlFor="intrusion-detection">Intrusion Detection</Label>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="upload-limit">Default Upload Limit (Mbps)</Label>
                      <Input id="upload-limit" placeholder="10" defaultValue="10" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="download-limit">Default Download Limit (Mbps)</Label>
                      <Input id="download-limit" placeholder="50" defaultValue="50" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="burst-ratio">Burst Ratio</Label>
                      <Input id="burst-ratio" placeholder="1.5" defaultValue="1.5" />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="monitoring" className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Network Status</CardTitle>
                        <Wifi className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Online</span>
                        </div>
                        <p className="text-xs text-muted-foreground">All systems operational</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Connections</CardTitle>
                        <Database className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">1,234</div>
                        <p className="text-xs text-muted-foreground">+12% from last hour</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Bandwidth Usage</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">67%</div>
                        <p className="text-xs text-muted-foreground">of total capacity</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Alerts</CardTitle>
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">3</div>
                        <p className="text-xs text-muted-foreground">2 warnings, 1 critical</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-base">Monitoring Settings</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch id="snmp-monitoring" defaultChecked />
                        <Label htmlFor="snmp-monitoring">SNMP Monitoring</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="bandwidth-monitoring" defaultChecked />
                        <Label htmlFor="bandwidth-monitoring">Bandwidth Monitoring</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="uptime-monitoring" defaultChecked />
                        <Label htmlFor="uptime-monitoring">Uptime Monitoring</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="alert-notifications" defaultChecked />
                        <Label htmlFor="alert-notifications">Alert Notifications</Label>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="monitoring-interval">Monitoring Interval (minutes)</Label>
                      <Input id="monitoring-interval" placeholder="5" defaultValue="5" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="alert-threshold">Alert Threshold (%)</Label>
                      <Input id="alert-threshold" placeholder="80" defaultValue="80" />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
