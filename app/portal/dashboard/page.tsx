'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Bell, Settings, Wifi, Download, CreditCard, CheckCircle, Zap, HelpCircle, TrendingUp, Phone, Mail, MessageSquare, MoveUpIcon as Upgrade, Activity, BarChart3, DollarSign, Calendar, Clock, User, Shield, Globe } from 'lucide-react'

export default function PortalDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [speedTestRunning, setSpeedTestRunning] = useState(false)
  const [speedTestResult, setSpeedTestResult] = useState<number | null>(null)
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Service Maintenance', message: 'Scheduled maintenance on Feb 15th', time: '2 hours ago', read: false },
    { id: 2, title: 'Payment Received', message: 'Your payment of KES 2,500 has been processed', time: '1 day ago', read: true },
    { id: 3, title: 'Speed Upgrade Available', message: 'Upgrade to 200 Mbps plan now available', time: '3 days ago', read: false }
  ])

  const runSpeedTest = async () => {
    setSpeedTestRunning(true)
    setSpeedTestResult(null)
    
    // Simulate speed test
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const result = Math.floor(Math.random() * 20) + 90 // 90-110 Mbps
    setSpeedTestResult(result)
    setSpeedTestRunning(false)
  }

  const markNotificationRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
              <Wifi className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, John Doe</h1>
              <p className="text-sm text-gray-500">Account: ACC-123456</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="relative">
                  <Bell className="w-4 h-4" />
                  {notifications.some(n => !n.read) && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                  )}
                  Notifications
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Notifications</DialogTitle>
                  <DialogDescription>Stay updated with your account activities</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        notification.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'
                      }`}
                      onClick={() => markNotificationRead(notification.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{notification.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        </div>
                        <span className="text-xs text-gray-500">{notification.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>

            {/* Settings */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4" />
                  Settings
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Account Settings</DialogTitle>
                  <DialogDescription>Manage your account preferences</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All notifications</SelectItem>
                        <SelectItem value="important">Important only</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="sw">Swahili</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full">Save Changes</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Service Status Alert */}
      <div className="px-6 py-4">
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Your internet service is running normally. Current speed: 98.5 Mbps
          </AlertDescription>
        </Alert>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Current Speed</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">98.5 Mbps</div>
                  <p className="text-xs text-muted-foreground">of 100 Mbps plan</p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" className="mt-2">Test Speed</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Speed Test</DialogTitle>
                        <DialogDescription>Test your current internet speed</DialogDescription>
                      </DialogHeader>
                      <div className="text-center py-8">
                        {speedTestRunning ? (
                          <div>
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p>Testing your connection speed...</p>
                          </div>
                        ) : speedTestResult ? (
                          <div>
                            <div className="text-4xl font-bold text-green-600 mb-2">{speedTestResult} Mbps</div>
                            <p className="text-gray-600">Your current download speed</p>
                            <Button onClick={runSpeedTest} className="mt-4">Test Again</Button>
                          </div>
                        ) : (
                          <div>
                            <Zap className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                            <p className="mb-4">Click to start speed test</p>
                            <Button onClick={runSpeedTest}>Start Test</Button>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Data Used</CardTitle>
                  <Download className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">450 GB</div>
                  <Progress value={45} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-2">550 GB remaining</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Account Balance</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">KES 0</div>
                  <p className="text-xs text-muted-foreground">Next bill: 2024-02-15</p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" className="mt-2">Pay Bill</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Make Payment</DialogTitle>
                        <DialogDescription>Choose your payment method</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <RadioGroup defaultValue="mpesa">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="mpesa" id="mpesa" />
                            <Label htmlFor="mpesa">M-Pesa</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="card" id="card" />
                            <Label htmlFor="card">Credit/Debit Card</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="bank" id="bank" />
                            <Label htmlFor="bank">Bank Transfer</Label>
                          </div>
                        </RadioGroup>
                        <div>
                          <Label htmlFor="amount">Amount (KES)</Label>
                          <Input id="amount" placeholder="2500" />
                        </div>
                        <Button className="w-full">Proceed to Payment</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Service Status</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">Active</div>
                  <p className="text-xs text-muted-foreground">Since 2023-06-15</p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" className="mt-2">Get Help</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Get Support</DialogTitle>
                        <DialogDescription>How can we help you today?</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="issue-type">Issue Type</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select issue type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="connection">Connection Issues</SelectItem>
                              <SelectItem value="billing">Billing Questions</SelectItem>
                              <SelectItem value="technical">Technical Support</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea id="description" placeholder="Describe your issue..." />
                        </div>
                        <Button className="w-full">Submit Ticket</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </div>

            {/* Usage Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Usage</CardTitle>
                <CardDescription>Download and upload activity over the last 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between space-x-2">
                  {Array.from({ length: 24 }, (_, i) => {
                    const downloadHeight = Math.random() * 100 + 20
                    const uploadHeight = Math.random() * 50 + 10
                    return (
                      <div key={i} className="flex flex-col items-center space-y-1 flex-1">
                        <div className="flex flex-col items-center space-y-1 w-full">
                          <div 
                            className="bg-blue-500 w-full rounded-t"
                            style={{ height: `${downloadHeight}px` }}
                            title={`Download: ${downloadHeight.toFixed(0)} Mbps`}
                          ></div>
                          <div 
                            className="bg-green-500 w-full rounded-b"
                            style={{ height: `${uploadHeight}px` }}
                            title={`Upload: ${uploadHeight.toFixed(0)} Mbps`}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">{i.toString().padStart(2, '0')}:00</span>
                      </div>
                    )
                  })}
                </div>
                <div className="flex items-center justify-center space-x-6 mt-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span className="text-sm">Download</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-sm">Upload</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="h-20 flex flex-col space-y-2">
                        <CreditCard className="h-6 w-6" />
                        <span>Pay Bill</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Pay Your Bill</DialogTitle>
                        <DialogDescription>Current balance: KES 2,500</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Payment Method</Label>
                          <RadioGroup defaultValue="mpesa" className="mt-2">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="mpesa" id="pay-mpesa" />
                              <Label htmlFor="pay-mpesa">M-Pesa (Instant)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="card" id="pay-card" />
                              <Label htmlFor="pay-card">Credit/Debit Card</Label>
                            </div>
                          </RadioGroup>
                        </div>
                        <div>
                          <Label htmlFor="pay-amount">Amount (KES)</Label>
                          <Input id="pay-amount" defaultValue="2500" />
                        </div>
                        <Button className="w-full">Pay Now</Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="h-20 flex flex-col space-y-2">
                        <HelpCircle className="h-6 w-6" />
                        <span>Get Support</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Contact Support</DialogTitle>
                        <DialogDescription>We're here to help 24/7</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <Button variant="outline" className="h-16 flex flex-col space-y-1">
                            <Phone className="h-5 w-5" />
                            <span className="text-sm">Call Us</span>
                            <span className="text-xs text-gray-500">+254 700 123456</span>
                          </Button>
                          <Button variant="outline" className="h-16 flex flex-col space-y-1">
                            <Mail className="h-5 w-5" />
                            <span className="text-sm">Email</span>
                            <span className="text-xs text-gray-500">support@techconnect.co.ke</span>
                          </Button>
                        </div>
                        <Button className="w-full">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Start Live Chat
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="h-20 flex flex-col space-y-2">
                        <TrendingUp className="h-6 w-6" />
                        <span>Upgrade Plan</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Upgrade Your Plan</DialogTitle>
                        <DialogDescription>Choose a plan that fits your needs</DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="border-2 border-blue-200">
                          <CardHeader>
                            <CardTitle className="text-lg">Basic</CardTitle>
                            <CardDescription>50 Mbps</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">KES 1,500</div>
                            <p className="text-sm text-gray-600">per month</p>
                            <ul className="mt-4 space-y-2 text-sm">
                              <li>• 50 Mbps speed</li>
                              <li>• 500 GB data</li>
                              <li>• Basic support</li>
                            </ul>
                            <Button className="w-full mt-4" variant="outline">Current Plan</Button>
                          </CardContent>
                        </Card>
                        <Card className="border-2 border-green-200">
                          <CardHeader>
                            <CardTitle className="text-lg">Premium</CardTitle>
                            <CardDescription>100 Mbps</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">KES 2,500</div>
                            <p className="text-sm text-gray-600">per month</p>
                            <ul className="mt-4 space-y-2 text-sm">
                              <li>• 100 Mbps speed</li>
                              <li>• 1 TB data</li>
                              <li>• Priority support</li>
                            </ul>
                            <Button className="w-full mt-4">Upgrade</Button>
                          </CardContent>
                        </Card>
                        <Card className="border-2 border-purple-200">
                          <CardHeader>
                            <CardTitle className="text-lg">Enterprise</CardTitle>
                            <CardDescription>200 Mbps</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">KES 4,000</div>
                            <p className="text-sm text-gray-600">per month</p>
                            <ul className="mt-4 space-y-2 text-sm">
                              <li>• 200 Mbps speed</li>
                              <li>• Unlimited data</li>
                              <li>• 24/7 support</li>
                            </ul>
                            <Button className="w-full mt-4">Upgrade</Button>
                          </CardContent>
                        </Card>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="usage" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Usage</CardTitle>
                  <CardDescription>Your data consumption this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Download</span>
                        <span>420 GB</span>
                      </div>
                      <Progress value={84} className="mt-1" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Upload</span>
                        <span>30 GB</span>
                      </div>
                      <Progress value={6} className="mt-1" />
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between font-medium">
                        <span>Total Used</span>
                        <span>450 GB of 1000 GB</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Peak Hours</CardTitle>
                  <CardDescription>When you use internet the most</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Evening (6PM - 10PM)</span>
                      <Badge>Peak</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Morning (8AM - 12PM)</span>
                      <Badge variant="secondary">High</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Afternoon (12PM - 6PM)</span>
                      <Badge variant="outline">Medium</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Night (10PM - 8AM)</span>
                      <Badge variant="outline">Low</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Current Bill</CardTitle>
                  <CardDescription>February 2024</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Monthly Plan (100 Mbps)</span>
                      <span>KES 2,500</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Additional Data</span>
                      <span>KES 0</span>
                    </div>
                    <div className="flex justify-between">
                      <span>VAT (16%)</span>
                      <span>KES 400</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>KES 2,900</span>
                      </div>
                    </div>
                    <Button className="w-full mt-4">Pay Now</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                  <CardDescription>Your recent payments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">January 2024</p>
                        <p className="text-sm text-gray-500">Paid on Jan 15</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Paid</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">December 2023</p>
                        <p className="text-sm text-gray-500">Paid on Dec 14</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Paid</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">November 2023</p>
                        <p className="text-sm text-gray-500">Paid on Nov 16</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Paid</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="support" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Support</CardTitle>
                  <CardDescription>Get help when you need it</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full justify-start" variant="outline">
                    <Phone className="mr-2 h-4 w-4" />
                    Call: +254 700 123456
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Mail className="mr-2 h-4 w-4" />
                    Email: support@techconnect.co.ke
                  </Button>
                  <Button className="w-full justify-start">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Start Live Chat
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>My Tickets</CardTitle>
                  <CardDescription>Track your support requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">Connection Issues</p>
                          <p className="text-sm text-gray-500">Ticket #12345</p>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
                      </div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">Billing Question</p>
                          <p className="text-sm text-gray-500">Ticket #12344</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Resolved</Badge>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline">Create New Ticket</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="account" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>Your account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Full Name</Label>
                    <Input defaultValue="John Doe" />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input defaultValue="john@example.com" />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input defaultValue="+254 700 123456" />
                  </div>
                  <div>
                    <Label>Address</Label>
                    <Textarea defaultValue="123 Main Street, Nairobi, Kenya" />
                  </div>
                  <Button>Update Information</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Service Details</CardTitle>
                  <CardDescription>Your current service plan</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Plan</span>
                    <span className="font-medium">Premium 100 Mbps</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Cost</span>
                    <span className="font-medium">KES 2,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Installation Date</span>
                    <span className="font-medium">June 15, 2023</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Next Billing Date</span>
                    <span className="font-medium">February 15, 2024</span>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Upgrade className="mr-2 h-4 w-4" />
                    Upgrade Plan
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
