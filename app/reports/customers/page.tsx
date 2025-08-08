"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Users, UserPlus, UserMinus, TrendingUp, Download, Calendar, Search } from "lucide-react"

export default function CustomerReportPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const customerGrowth = [
    { month: "Jan", acquired: 45, churned: 12, net: 33 },
    { month: "Feb", acquired: 52, churned: 8, net: 44 },
    { month: "Mar", acquired: 67, churned: 15, net: 52 },
    { month: "Apr", acquired: 38, churned: 22, net: 16 },
    { month: "May", acquired: 71, churned: 9, net: 62 },
    { month: "Jun", acquired: 58, churned: 11, net: 47 },
  ]

  const planDistribution = [
    { name: "Basic", value: 450, color: "#8884d8" },
    { name: "Standard", value: 1200, color: "#82ca9d" },
    { name: "Premium", value: 890, color: "#ffc658" },
    { name: "Business", value: 307, color: "#ff7300" },
  ]

  const customerSegments = [
    { segment: "Individual", customers: 1847, revenue: 92350, retention: 94.2 },
    { segment: "Business", customers: 756, revenue: 113400, retention: 97.8 },
    { segment: "Enterprise", segment: 189, revenue: 56700, retention: 98.9 },
    { segment: "Government", customers: 55, revenue: 16500, retention: 100.0 },
  ]

  const recentCustomers = [
    { name: "Alice Johnson", plan: "Premium", joinDate: "2024-01-15", revenue: 79.99, status: "active" },
    { name: "Bob Smith", plan: "Business", joinDate: "2024-01-14", revenue: 149.99, status: "active" },
    { name: "Carol Davis", plan: "Standard", joinDate: "2024-01-13", revenue: 49.99, status: "active" },
    { name: "David Wilson", plan: "Premium", joinDate: "2024-01-12", revenue: 79.99, status: "active" },
    { name: "Eva Brown", plan: "Basic", joinDate: "2024-01-11", revenue: 29.99, status: "active" },
  ]

  const filteredCustomers = recentCustomers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.plan.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight">Customer Report</h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <Select defaultValue="6months">
            <SelectTrigger className="w-full sm:w-40">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
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
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">+254 from last period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Acquisitions</CardTitle>
            <UserPlus className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">331</div>
            <p className="text-xs text-muted-foreground">Last 6 months</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Churned Customers</CardTitle>
            <UserMinus className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">77</div>
            <p className="text-xs text-muted-foreground">2.7% churn rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+9.8%</div>
            <p className="text-xs text-muted-foreground">Monthly average</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Customer Growth Trend</CardTitle>
            <CardDescription>Monthly acquisition, churn, and net growth</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                acquired: { label: "Acquired", color: "hsl(var(--chart-1))" },
                churned: { label: "Churned", color: "hsl(var(--chart-2))" },
                net: { label: "Net Growth", color: "hsl(var(--chart-3))" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={customerGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="acquired" stroke="var(--color-acquired)" strokeWidth={2} />
                  <Line type="monotone" dataKey="churned" stroke="var(--color-churned)" strokeWidth={2} />
                  <Line type="monotone" dataKey="net" stroke="var(--color-net)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Distribution</CardTitle>
            <CardDescription>Customers by service plans</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                customers: { label: "Customers", color: "hsl(var(--chart-1))" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={planDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {planDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Customer Segments</CardTitle>
            <CardDescription>Analysis by customer type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Segment</TableHead>
                    <TableHead>Customers</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Retention</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerSegments.map((segment, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{segment.segment}</TableCell>
                      <TableCell>{segment.customers}</TableCell>
                      <TableCell>${segment.revenue.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            segment.retention >= 98 ? "default" : segment.retention >= 95 ? "secondary" : "destructive"
                          }
                        >
                          {segment.retention}%
                        </Badge>
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
            <CardTitle>Recent Acquisitions</CardTitle>
            <CardDescription>Latest customers added to the system</CardDescription>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{customer.plan}</Badge>
                      </TableCell>
                      <TableCell>{customer.joinDate}</TableCell>
                      <TableCell>${customer.revenue}</TableCell>
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
