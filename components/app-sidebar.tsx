"use client"

import type * as React from "react"
import {
  AudioWaveform,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Users,
  CreditCard,
  Wifi,
  HeadphonesIcon,
  Package,
  BarChart3,
  MessageSquare,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "ISP Admin",
    email: "admin@techconnect.co.ke",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "TechConnect ISP",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Network Operations",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Customer Support",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Platform",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Dashboard",
          url: "/",
        },
        {
          title: "Overview",
          url: "/overview",
        },
      ],
    },
    {
      title: "Customer Management",
      url: "#",
      icon: Users,
      items: [
        {
          title: "All Customers",
          url: "/customers",
        },
        {
          title: "Add Customer",
          url: "/customers/add",
        },
      ],
    },
    {
      title: "Billing & Finance",
      url: "#",
      icon: CreditCard,
      items: [
        {
          title: "Billing Overview",
          url: "/billing",
        },
        {
          title: "Payments",
          url: "/billing/payments",
        },
        {
          title: "Overdue Accounts",
          url: "/billing/overdue",
        },
        {
          title: "Finance Management",
          url: "/finance",
        },
      ],
    },
    {
      title: "Network Management",
      url: "#",
      icon: Wifi,
      items: [
        {
          title: "Network Overview",
          url: "/network",
        },
        {
          title: "Add Network Device",
          url: "/network/add",
        },
        {
          title: "Router Management",
          url: "/network/routers",
        },
        {
          title: "IP Configuration",
          url: "/network/ip-config",
        },
      ],
    },
    {
      title: "Support & Services",
      url: "#",
      icon: HeadphonesIcon,
      items: [
        {
          title: "Support Tickets",
          url: "/support",
        },
        {
          title: "Knowledge Base",
          url: "/support/kb",
        },
        {
          title: "Service Plans",
          url: "/services",
        },
        {
          title: "Add Service",
          url: "/services/add",
        },
      ],
    },
    {
      title: "Operations",
      url: "#",
      icon: Package,
      items: [
        {
          title: "Inventory",
          url: "/inventory",
        },
        {
          title: "Human Resources",
          url: "/hr",
        },
        {
          title: "Vehicle Management",
          url: "/vehicles",
        },
        {
          title: "Task Management",
          url: "/tasks",
        },
      ],
    },
    {
      title: "Reports & Analytics",
      url: "#",
      icon: BarChart3,
      items: [
        {
          title: "Reports Overview",
          url: "/reports",
        },
        {
          title: "Customer Reports",
          url: "/reports/customers",
        },
        {
          title: "Revenue Reports",
          url: "/reports/revenue",
        },
        {
          title: "Usage Analytics",
          url: "/reports/usage",
        },
      ],
    },
    {
      title: "Communication",
      url: "#",
      icon: MessageSquare,
      items: [
        {
          title: "Messages",
          url: "/messages",
        },
        {
          title: "Message History",
          url: "/messages/history",
        },
        {
          title: "Automation",
          url: "/automation",
        },
      ],
    },
    {
      title: "System",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Settings",
          url: "/settings",
        },
        {
          title: "System Logs",
          url: "/logs",
        },
        {
          title: "Customer Portal",
          url: "/portal",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Network Monitoring",
      url: "#",
      icon: Frame,
    },
    {
      name: "Security Center",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Router Management",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
