"use client"

import * as React from "react"
import { AudioWaveform, BookOpen, Bot, Command, Frame, GalleryVerticalEnd, Map, PieChart, Settings2, SquareTerminal, Users, CreditCard, Network, HeadphonesIcon, BarChart3, MessageSquare, Briefcase, Car, UserCheck, ClipboardList, Building, Cog, Activity, FileText, Router, Wifi, Shield, Globe, Smartphone, Server, Database, Zap, Cable, MonitorSpeaker, HardDrive } from 'lucide-react'

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

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
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
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
        {
          title: "Import/Export",
          url: "/customers/import-export",
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
      icon: Network,
      items: [
        {
          title: "Network Overview",
          url: "/network",
        },
        {
          title: "Add Router",
          url: "/network/add",
        },
        {
          title: "Routers",
          url: "/network/routers",
        },
        {
          title: "IP Configuration",
          url: "/network/ip-config",
        },
        {
          title: "Monitoring",
          url: "/network/monitoring",
        },
        {
          title: "SmartOLT",
          url: "/network/smartolt",
        },
        {
          title: "Third Party ONUs",
          url: "/network/third-party-onus",
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
          title: "Add Service Plan",
          url: "/services/add",
        },
        {
          title: "Compare Plans",
          url: "/services/compare",
        },
      ],
    },
    {
      title: "Operations",
      url: "#",
      icon: Briefcase,
      items: [
        {
          title: "Inventory",
          url: "/inventory",
        },
        {
          title: "Vehicles",
          url: "/vehicles",
        },
        {
          title: "HR Management",
          url: "/hr",
        },
        {
          title: "Task Management",
          url: "/tasks",
        },
        {
          title: "My Tasks",
          url: "/tasks/my-tasks",
        },
        {
          title: "Performance",
          url: "/tasks/performance",
        },
      ],
    },
    {
      title: "Reports & Analytics",
      url: "#",
      icon: BarChart3,
      items: [
        {
          title: "Reports Dashboard",
          url: "/reports",
        },
        {
          title: "Customer Reports",
          url: "/reports/customers",
        },
        {
          title: "Usage Reports",
          url: "/reports/usage",
        },
        {
          title: "Revenue Reports",
          url: "/reports/revenue",
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
          title: "Company Profile",
          url: "/settings/company",
        },
        {
          title: "Server Configuration",
          url: "/settings/servers",
        },
        {
          title: "Payment Gateway",
          url: "/settings/payments",
        },
        {
          title: "Communications",
          url: "/settings/communications",
        },
        {
          title: "User Management",
          url: "/settings/users",
        },
        {
          title: "Portal Settings",
          url: "/settings/portal",
        },
        {
          title: "Automation",
          url: "/settings/automation",
        },
        {
          title: "System Backup",
          url: "/settings/backup",
        },
        {
          title: "System Logs",
          url: "/logs",
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
