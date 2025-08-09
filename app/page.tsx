import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Wifi, CreditCard, Settings, BarChart3, Headphones } from 'lucide-react'
import Link from "next/link"

export default function HomePage() {
  const features = [
    {
      title: "Customer Management",
      description: "Manage customer accounts, services, and billing",
      icon: Users,
      href: "/customers",
      color: "text-blue-600"
    },
    {
      title: "Network Monitoring",
      description: "Monitor network performance and equipment",
      icon: Wifi,
      href: "/network",
      color: "text-green-600"
    },
    {
      title: "Billing & Payments",
      description: "Automated billing with M-Pesa integration",
      icon: CreditCard,
      href: "/billing",
      color: "text-purple-600"
    },
    {
      title: "Support System",
      description: "Ticket management and customer support",
      icon: Headphones,
      href: "/support",
      color: "text-orange-600"
    },
    {
      title: "Reports & Analytics",
      description: "Business intelligence and reporting",
      icon: BarChart3,
      href: "/reports",
      color: "text-red-600"
    },
    {
      title: "System Settings",
      description: "Company settings and system management",
      icon: Settings,
      href: "/settings",
      color: "text-gray-600"
    }
  ]

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          ISP Management System
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Complete solution for managing your Internet Service Provider business with advanced features and analytics
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Customers</p>
                <p className="text-2xl font-bold">1,234</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
                <p className="text-2xl font-bold">KES 2.5M</p>
              </div>
              <CreditCard className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Network Uptime</p>
                <p className="text-2xl font-bold">99.9%</p>
              </div>
              <Wifi className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Support Tickets</p>
                <p className="text-2xl font-bold">23</p>
              </div>
              <Headphones className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Icon className={`h-6 w-6 ${feature.color}`} />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={feature.href}>
                  <Button variant="outline" className="w-full bg-transparent">
                    Access Module
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* System Information */}
      <div className="mt-8 p-6 bg-muted rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">System Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2">Sample Data Included</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 50+ customers with various profiles</li>
              <li>• 8 service plans from basic to enterprise</li>
              <li>• Payment history and billing data</li>
              <li>• Network equipment and monitoring</li>
              <li>• Support tickets and knowledge base</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">System Features</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Real-time dashboard and analytics</li>
              <li>• M-Pesa payment integration</li>
              <li>• Automated billing and invoicing</li>
              <li>• Network monitoring and alerts</li>
              <li>• Customer portal and self-service</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 flex space-x-4">
          <Link href="/customers">
            <Button>Get Started</Button>
          </Link>
          <Link href="/settings">
            <Button variant="outline">System Settings</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
