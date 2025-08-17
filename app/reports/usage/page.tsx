"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Activity, Users, HardDrive, Download, Calendar, Wifi } from "lucide-react"

export default function UsageReportPage() {
  const hourlyUsage = [
    { hour: "00:00", bandwidth: 45, users: 120 },
    { hour: "02:00", bandwidth: 32, users: 89 },
    { hour: "04:00", bandwidth: 28, users: 67 },
    { hour: "06:00", bandwidth: 52, users: 145 },
    { hour: "08:00", bandwidth: 78, users: 234 },
    { hour: "10:00", bandwidth: 85, users: 267 },
    { hour: "12:00", bandwidth: 92, users: 298 },
    { hour: "14:00", bandwidth: 88, users: 276 },
    { hour: "16:00", bandwidth: 95, users: 312 },
    { hour: "18:00", bandwidth: 98, users: 345 },
    { hour: "20:00", bandwidth: 89, users: 289 },
    { hour: "22:00", bandwidth: 67, users: 198 },
  ]

  const topUsageCustomers = [
    { name: "TechCorp Solutions", usage: 2.4, plan: "Business", status: "normal" },
    { name: "Downtown Mall", usage: 1.8, plan: "Premium", status: "high" },
    { name: "City Hospital", usage: 3.2, plan: "Business", status: "critical" },
    { name: "Green Valley School", usage: 1.2, plan: "Standard", status: "normal" },
    { name: "Metro Restaurant", usage: 0.9, plan: "Premium", status: "low" },
  ]

  const planUsage = [
    { plan: "Basic", totalData: 450, avgUsage: 45, customers: 450 },
    { plan: "Standard", totalData: 2400, avgUsage: 67, customers: 1200 },
    { plan: "Premium", totalData: 3560, avgUsage: 78, customers: 890 },
    { plan: "Business", totalData: 4920, avgUsage: 89, customers: 307 },
  ]

  const getUsageStatusColor = (status: string) => {
    switch (status) {
      case "low":
        return "secondary"
      case "normal":
        return "default"
      case "high":
        return "secondary"
      case "critical":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight">Usage Report</h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <Select defaultValue="today">
            <SelectTrigger className="w-full sm:w-40">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
            </SelectContent>
          </Select>
          <Button className="w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peak Bandwidth</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98%</div>
            <p className="text-xs text-muted-foreground">At 6:00 PM today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Usage</CardTitle>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67%</div>
            <p className="text-xs text-muted-foreground">Network utilization</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peak Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">345</div>
            <p className="text-xs text-muted-foreground">Concurrent connections</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Transferred</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">11.3 TB</div>
            <p className="text-xs text-muted-foreground">Today's total</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Bandwidth Usage Trend</CardTitle>
            <CardDescription>Hourly bandwidth utilization</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                bandwidth: { label: "Bandwidth %", color: "hsl(var(--chart-1))" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourlyUsage}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="bandwidth"
                    stroke="var(--color-bandwidth)"
                    fill="var(--color-bandwidth)"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Concurrent Users</CardTitle>
            <CardDescription>Active connections throughout the day</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                users: { label: "Users", color: "hsl(var(--chart-2))" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hourlyUsage}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="users" stroke="var(--color-users)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Usage Customers</CardTitle>
            <CardDescription>Customers with highest bandwidth consumption</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topUsageCustomers.map((customer, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium">{customer.name}</p>
                      <Badge variant={getUsageStatusColor(customer.status)}>{customer.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{customer.plan} Plan</p>
                    <Progress value={customer.usage * 10} className="mt-2" />
                  </div>
                  <div className="ml-4 text-right">
                    <p className="font-medium">{customer.usage} TB</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usage by Plan</CardTitle>
            <CardDescription>Data consumption breakdown by service plans</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plan</TableHead>
                    <TableHead>Total Data</TableHead>
                    <TableHead>Avg Usage</TableHead>
                    <TableHead>Customers</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {planUsage.map((plan, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{plan.plan}</TableCell>
                      <TableCell>{plan.totalData} GB</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={plan.avgUsage} className="flex-1" />
                          <span className="text-sm">{plan.avgUsage}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{plan.customers}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
