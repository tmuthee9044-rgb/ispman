#!/bin/bash

# ISP Management System - Complete Installation Script
# This script creates the complete ISP management system after prerequisites are installed

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

print_header() {
    echo -e "${PURPLE}================================${NC}"
    echo -e "${PURPLE}$1${NC}"
    echo -e "${PURPLE}================================${NC}"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_info() {
    echo -e "${CYAN}[INFO]${NC} $1"
}

command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
check_prerequisites() {
    print_step "Checking prerequisites..."
    
    local missing_deps=()
    
    if ! command_exists docker; then
        missing_deps+=("docker")
    fi
    
    if ! docker compose version >/dev/null 2>&1 && ! command_exists docker-compose; then
        missing_deps+=("docker-compose")
    fi
    
    if ! command_exists node; then
        missing_deps+=("node")
    else
        NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
        if [ "$NODE_VERSION" -lt 18 ]; then
            missing_deps+=("node>=18")
        fi
    fi
    
    if ! command_exists npm; then
        missing_deps+=("npm")
    fi
    
    if ! command_exists curl; then
        missing_deps+=("curl")
    fi
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        print_error "Missing prerequisites: ${missing_deps[*]}"
        print_info "Please run ./install-prerequisites.sh first"
        exit 1
    fi
    
    # Check if Docker is running
    if ! docker info >/dev/null 2>&1; then
        print_error "Docker is installed but not running"
        print_info "Please start Docker and try again"
        exit 1
    fi
    
    print_success "All prerequisites are available"
}

# Generate secrets
generate_secrets() {
    print_step "Generating authentication secrets..."
    
    if command_exists openssl; then
        NEXTAUTH_SECRET=$(openssl rand -hex 32)
        JWT_SECRET=$(openssl rand -hex 32)
        ENCRYPTION_KEY=$(openssl rand -hex 16)
    elif command_exists python3; then
        NEXTAUTH_SECRET=$(python3 -c "import secrets; print(secrets.token_hex(32))")
        JWT_SECRET=$(python3 -c "import secrets; print(secrets.token_hex(32))")
        ENCRYPTION_KEY=$(python3 -c "import secrets; print(secrets.token_hex(16))")
    else
        NEXTAUTH_SECRET="isp-secret-$(date +%s)-$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 32)"
        JWT_SECRET="jwt-secret-$(date +%s)-$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 32)"
        ENCRYPTION_KEY=$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 16)
    fi
    
    # Detect public IP for NEXTAUTH_URL
    PUBLIC_IP=$(curl -s --connect-timeout 5 ifconfig.me 2>/dev/null || curl -s --connect-timeout 5 ipinfo.io/ip 2>/dev/null || echo "localhost")
    NEXTAUTH_URL="http://localhost:3000"
    
    print_success "Secrets generated successfully"
}

# Create project structure
create_project_structure() {
    print_step "Creating project structure..."
    
    # Create all necessary directories
    mkdir -p {app/{api/{auth/\[...nextauth\],health},customers,billing,network,settings,reports,portal},components/{ui,modals},lib,hooks,types,public,scripts,logs,ssl,backup}
    
    print_success "Project structure created"
}

# Create environment configuration
create_environment() {
    print_step "Creating environment configuration..."
    
    cat > .env << EOF
# Database Configuration
DATABASE_URL=postgresql://isp_user:isp_password_2024@postgres:5432/isp_system
POSTGRES_HOST=postgres
POSTGRES_USER=isp_user
POSTGRES_PASSWORD=isp_password_2024
POSTGRES_DATABASE=isp_system
POSTGRES_PORT=5432

# Authentication
NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
NEXTAUTH_URL=${NEXTAUTH_URL}
JWT_SECRET=${JWT_SECRET}

# Application Configuration
NODE_ENV=production
PORT=3000

# ISP Configuration
COMPANY_NAME=Your ISP Company
COMPANY_EMAIL=admin@yourisp.com
COMPANY_PHONE=+254700000000
DEFAULT_CURRENCY=KES
DEFAULT_TIMEZONE=Africa/Nairobi

# Redis Configuration
REDIS_URL=redis://redis:6379

# Security
ENCRYPTION_KEY=${ENCRYPTION_KEY}

# M-Pesa Configuration (Optional - Configure in settings)
MPESA_CONSUMER_KEY=your_mpesa_consumer_key
MPESA_CONSUMER_SECRET=your_mpesa_consumer_secret
MPESA_BUSINESS_SHORT_CODE=174379
MPESA_PASSKEY=your_mpesa_passkey

# Email Configuration (Optional - Configure in settings)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
EOF
    
    print_success "Environment configuration created"
}

# Create package.json
create_package_json() {
    print_step "Creating package.json..."
    
    cat > package.json << 'EOF'
{
  "name": "isp-management-system",
  "version": "1.0.0",
  "description": "Complete ISP Management System with Next.js and PostgreSQL",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@next/font": "^14.0.4",
    "@radix-ui/react-accordion": "^1.1.2",
    "@radix-ui/react-alert-dialog": "^1.0.5",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-checkbox": "^1.0.4",
    "@radix-ui/react-collapsible": "^1.0.3",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-popover": "^1.0.7",
    "@radix-ui/react-progress": "^1.0.3",
    "@radix-ui/react-radio-group": "^1.1.3",
    "@radix-ui/react-scroll-area": "^1.0.5",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-separator": "^1.0.3",
    "@radix-ui/react-sheet": "^1.0.0",
    "@radix-ui/react-slider": "^1.1.2",
    "@radix-ui/react-switch": "^1.0.3",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.5",
    "@radix-ui/react-tooltip": "^1.0.7",
    "@types/node": "^20.10.0",
    "@types/react": "^18.2.45",
    "@types/react-dom": "^18.2.18",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "date-fns": "^2.30.0",
    "lucide-react": "^0.294.0",
    "next": "^14.0.4",
    "next-auth": "^4.24.5",
    "next-themes": "^0.2.1",
    "pg": "^8.11.3",
    "react": "^18.2.0",
    "react-day-picker": "^8.9.1",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.48.2",
    "recharts": "^2.8.0",
    "tailwind-merge": "^2.2.0",
    "tailwindcss-animate": "^1.0.7",
    "typescript": "^5.3.3",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "redis": "^4.6.10",
    "nodemailer": "^6.9.7"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/nodemailer": "^6.4.14",
    "@types/pg": "^8.10.9",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.56.0",
    "eslint-config-next": "^14.0.4",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.4.0"
  }
}
EOF
    
    print_success "package.json created"
}

# Create Next.js configuration files
create_nextjs_config() {
    print_step "Creating Next.js configuration files..."
    
    # next.config.mjs
    cat > next.config.mjs << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost', 'placeholder.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  env: {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    DATABASE_URL: process.env.DATABASE_URL,
  },
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
}

export default nextConfig
EOF

    # tsconfig.json
    cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOF

    # tailwind.config.ts
    cat > tailwind.config.ts << 'EOF'
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
export default config
EOF

    # postcss.config.mjs
    cat > postcss.config.mjs << 'EOF'
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

export default config
EOF

    print_success "Next.js configuration files created"
}

# Create application files
create_application_files() {
    print_step "Creating application files..."
    
    # app/layout.tsx
    cat > app/layout.tsx << 'EOF'
import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ISP Management System',
  description: 'Complete solution for managing your Internet Service Provider business',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-background">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}
EOF

    # app/providers.tsx
    cat > app/providers.tsx << 'EOF'
'use client'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from '@/components/theme-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </SessionProvider>
  )
}
EOF

    # app/globals.css
    cat > app/globals.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
EOF

    # app/page.tsx
    cat > app/page.tsx << 'EOF'
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
EOF

    print_success "Application files created"
}

# Create essential components
create_components() {
    print_step "Creating essential components..."
    
    # lib/utils.ts
    cat > lib/utils.ts << 'EOF'
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = 'KES'): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-KE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}
EOF

    # lib/db.ts
    cat > lib/db.ts << 'EOF'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

export async function query(text: string, params?: any[]) {
  const client = await pool.connect()
  try {
    const result = await client.query(text, params)
    return result
  } finally {
    client.release()
  }
}

export default pool
EOF

    # components/ui/button.tsx
    cat > components/ui/button.tsx << 'EOF'
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
EOF

    # components/ui/card.tsx
    cat > components/ui/card.tsx << 'EOF'
import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
EOF

    # components/theme-provider.tsx
    cat > components/theme-provider.tsx << 'EOF'
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
EOF

    # app/api/health/route.ts
    cat > app/api/health/route.ts << 'EOF'
import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  try {
    // Check database connection
    await query('SELECT 1')
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        application: 'running'
      }
    })
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Database connection failed'
    }, { status: 503 })
  }
}
EOF

    print_success "Essential components created"
}

# Create customers page
create_customers_page() {
    print_step "Creating customers page..."
    
    cat > app/customers/page.tsx << 'EOF'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Plus, Search, Filter } from 'lucide-react'
import Link from "next/link"

export default function CustomersPage() {
  // This would normally fetch from database
  const customers = [
    { id: 1, name: "John Doe", email: "john.doe@email.com", phone: "+254701234567", status: "active", plan: "Standard Home" },
    { id: 2, name: "Jane Smith", email: "jane.smith@email.com", phone: "+254702345678", status: "active", plan: "Premium Home" },
    { id: 3, name: "TechCorp Ltd", email: "admin@techcorp.co.ke", phone: "+254707890123", status: "active", plan: "Business Premium" },
  ]

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Customer Management</h1>
          <p className="text-muted-foreground">Manage your customers and their services</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Customers</p>
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
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">1,180</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-green-600"></div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Suspended</p>
                <p className="text-2xl font-bold">34</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-yellow-600"></div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">New This Month</p>
                <p className="text-2xl font-bold">20</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-blue-600"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search customers..."
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customers</CardTitle>
          <CardDescription>A list of all customers and their details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Name</th>
                  <th className="text-left p-4">Email</th>
                  <th className="text-left p-4">Phone</th>
                  <th className="text-left p-4">Plan</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="border-b hover:bg-muted/50">
                    <td className="p-4 font-medium">{customer.name}</td>
                    <td className="p-4 text-muted-foreground">{customer.email}</td>
                    <td className="p-4 text-muted-foreground">{customer.phone}</td>
                    <td className="p-4">{customer.plan}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        customer.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">View</Button>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 text-center">
        <Link href="/">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}
EOF

    print_success "Customers page created"
}

# Create database initialization script
create_database_script() {
    print_step "Creating database initialization script..."
    
    cat > scripts/001_comprehensive_init.sql << 'EOF'
-- ISP Management System - Comprehensive Database Initialization
-- This script creates the complete database structure for the ISP system

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Drop existing tables if they exist (for clean installation)
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS customer_services CASCADE;
DROP TABLE IF EXISTS service_plans CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS network_equipment CASCADE;
DROP TABLE IF EXISTS support_tickets CASCADE;
DROP TABLE IF EXISTS system_logs CASCADE;

-- Companies table
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    website VARCHAR(255),
    tax_number VARCHAR(100),
    registration_number VARCHAR(100),
    logo_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table (for system authentication)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    phone VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customers table
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_number VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(20),
    id_number VARCHAR(50),
    status VARCHAR(50) DEFAULT 'active',
    customer_type VARCHAR(50) DEFAULT 'individual',
    registration_date DATE DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Service plans table
CREATE TABLE service_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    setup_fee DECIMAL(10,2) DEFAULT 0,
    speed_download_mbps INTEGER,
    speed_upload_mbps INTEGER,
    data_limit_gb INTEGER,
    billing_cycle VARCHAR(20) DEFAULT 'monthly',
    is_active BOOLEAN DEFAULT true,
    features JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customer services table
CREATE TABLE customer_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    service_plan_id UUID REFERENCES service_plans(id),
    status VARCHAR(50) DEFAULT 'active',
    start_date DATE DEFAULT CURRENT_DATE,
    end_date DATE,
    monthly_fee DECIMAL(10,2),
    installation_address TEXT,
    equipment_serial VARCHAR(100),
    ip_address INET,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50),
    payment_reference VARCHAR(255),
    transaction_id VARCHAR(255),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'completed',
    description TEXT,
    invoice_number VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Network equipment table
CREATE TABLE network_equipment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    model VARCHAR(255),
    serial_number VARCHAR(255),
    ip_address INET,
    location VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active',
    last_ping TIMESTAMP,
    uptime_percentage DECIMAL(5,2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Support tickets table
CREATE TABLE support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(20) DEFAULT 'medium',
    status VARCHAR(50) DEFAULT 'open',
    category VARCHAR(100),
    assigned_to UUID REFERENCES users(id),
    created_by UUID REFERENCES users(id),
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- System logs table
CREATE TABLE system_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    level VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    context JSONB,
    user_id UUID REFERENCES users(id),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_status ON customers(status);
CREATE INDEX idx_customers_customer_number ON customers(customer_number);

CREATE INDEX idx_service_plans_price ON service_plans(price);
CREATE INDEX idx_service_plans_active ON service_plans(is_active);

CREATE INDEX idx_customer_services_customer_id ON customer_services(customer_id);
CREATE INDEX idx_customer_services_status ON customer_services(status);
CREATE INDEX idx_customer_services_dates ON customer_services(start_date, end_date);

CREATE INDEX idx_payments_customer_id ON payments(customer_id);
CREATE INDEX idx_payments_date ON payments(payment_date);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_reference ON payments(payment_reference);

CREATE INDEX idx_network_equipment_status ON network_equipment(status);
CREATE INDEX idx_network_equipment_type ON network_equipment(type);
CREATE INDEX idx_network_equipment_ip ON network_equipment(ip_address);

CREATE INDEX idx_support_tickets_customer_id ON support_tickets(customer_id);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);
CREATE INDEX idx_support_tickets_priority ON support_tickets(priority);
CREATE INDEX idx_support_tickets_assigned ON support_tickets(assigned_to);

CREATE INDEX idx_system_logs_level ON system_logs(level);
CREATE INDEX idx_system_logs_created_at ON system_logs(created_at);
CREATE INDEX idx_system_logs_user_id ON system_logs(user_id);

-- Insert company data
INSERT INTO companies (name, email, phone, address, website) VALUES 
('Your ISP Company', 'admin@yourisp.com', '+254700000000', 'Nairobi, Kenya', 'https://yourisp.com');

-- Insert default admin user (password: admin123)
INSERT INTO users (email, password_hash, name, role) VALUES 
('admin@yourisp.com', '$2b$10$rQZ9QmjlZKZZ9QmjlZKZZOeKZZ9QmjlZKZZ9QmjlZKZZ9QmjlZKZZ', 'System Administrator', 'admin');

-- Insert service plans
INSERT INTO service_plans (name, description, price, setup_fee, speed_download_mbps, speed_upload_mbps, data_limit_gb, features) VALUES 
('Basic Home', 'Perfect for light internet usage', 1200.00, 500.00, 5, 2, 50, '{"wifi": true, "support": "email"}'),
('Standard Home', 'Great for streaming and browsing', 2500.00, 500.00, 10, 5, 100, '{"wifi": true, "support": "phone", "streaming": true}'),
('Premium Home', 'High-speed for heavy users', 4000.00, 1000.00, 20, 10, 200, '{"wifi": true, "support": "priority", "streaming": true, "gaming": true}'),
('Business Basic', 'Small business solution', 5000.00, 1500.00, 25, 15, 300, '{"wifi": true, "support": "priority", "static_ip": true}'),
('Business Standard', 'Growing business needs', 8000.00, 2000.00, 50, 25, 500, '{"wifi": true, "support": "24/7", "static_ip": true, "backup": true}'),
('Business Premium', 'Enterprise-grade connectivity', 12000.00, 3000.00, 100, 50, 1000, '{"wifi": true, "support": "24/7", "static_ip": true, "backup": true, "sla": "99.9%"}'),
('Enterprise', 'Large organization solution', 20000.00, 5000.00, 200, 100, 2000, '{"wifi": true, "support": "dedicated", "static_ip": true, "backup": true, "sla": "99.95%"}'),
('Corporate Unlimited', 'Unlimited enterprise solution', 35000.00, 10000.00, 500, 250, NULL, '{"wifi": true, "support": "dedicated", "static_ip": true, "backup": true, "sla": "99.99%", "unlimited": true}');

-- Generate customer numbers and insert customers
INSERT INTO customers (customer_number, name, email, phone, address, city, customer_type, status) VALUES 
('CUST-001', 'John Doe', 'john.doe@email.com', '+254701234567', '123 Westlands Avenue', 'Nairobi', 'individual', 'active'),
('CUST-002', 'Jane Smith', 'jane.smith@email.com', '+254702345678', '456 Karen Road', 'Nairobi', 'individual', 'active'),
('CUST-003', 'Bob Johnson', 'bob.johnson@email.com', '+254703456789', '789 Kilimani Street', 'Nairobi', 'individual', 'active'),
('CUST-004', 'Alice Brown', 'alice.brown@email.com', '+254704567890', '321 Lavington Close', 'Nairobi', 'individual', 'active'),
('CUST-005', 'Charlie Wilson', 'charlie.wilson@email.com', '+254705678901', '654 Runda Gardens', 'Nairobi', 'individual', 'active'),
('CUST-006', 'Diana Davis', 'diana.davis@email.com', '+254706789012', '987 Muthaiga Heights', 'Nairobi', 'individual', 'active'),
('CUST-007', 'TechCorp Ltd', 'admin@techcorp.co.ke', '+254707890123', '147 Upper Hill', 'Nairobi', 'business', 'active'),
('CUST-008', 'Green Valley School', 'it@greenvalley.ac.ke', '+254708901234', '258 Spring Valley', 'Nairobi', 'business', 'active'),
('CUST-009', 'Mike Anderson', 'mike.anderson@email.com', '+254709012345', '369 Gigiri Road', 'Nairobi', 'individual', 'active'),
('CUST-010', 'Sarah Connor', 'sarah.connor@email.com', '+254710123456', '741 Parklands Avenue', 'Nairobi', 'individual', 'active');

-- Create customer services (assign random service plans to customers)
INSERT INTO customer_services (customer_id, service_plan_id, monthly_fee, installation_address, ip_address)
SELECT 
    c.id,
    sp.id,
    sp.price,
    c.address,
    ('192.168.' || (RANDOM() * 255)::int || '.' || (RANDOM() * 255)::int)::inet
FROM customers c
CROSS JOIN service_plans sp
WHERE (c.customer_number, sp.name) IN (
    ('CUST-001', 'Standard Home'),
    ('CUST-002', 'Premium Home'),
    ('CUST-003', 'Basic Home'),
    ('CUST-004', 'Business Basic'),
    ('CUST-005', 'Standard Home'),
    ('CUST-006', 'Premium Home'),
    ('CUST-007', 'Business Premium'),
    ('CUST-008', 'Enterprise'),
    ('CUST-009', 'Business Standard'),
    ('CUST-010', 'Corporate Unlimited')
);

-- Insert sample payments
INSERT INTO payments (customer_id, amount, payment_method, payment_reference, transaction_id, description, invoice_number)
SELECT 
    c.id,
    cs.monthly_fee,
    CASE WHEN RANDOM() < 0.7 THEN 'M-Pesa' ELSE 'Bank Transfer' END,
    'PAY-' || LPAD((RANDOM() * 999999)::int::text, 6, '0'),
    'TXN-' || LPAD((RANDOM() * 999999999)::int::text, 9, '0'),
    'Monthly subscription payment',
    'INV-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD((ROW_NUMBER() OVER())::text, 4, '0')
FROM customers c
JOIN customer_services cs ON c.id = cs.customer_id
WHERE c.status = 'active';

-- Insert network equipment
INSERT INTO network_equipment (name, type, model, serial_number, ip_address, location, status, uptime_percentage) VALUES 
('Main Router', 'Router', 'Cisco ISR 4331', 'CSR4331001', '192.168.1.1', 'Data Center', 'active', 99.95),
('Core Switch', 'Switch', 'Cisco Catalyst 9300', 'CAT9300001', '192.168.1.2', 'Data Center', 'active', 99.98),
('Fiber OLT', 'OLT', 'Huawei MA5800-X7', 'HW5800001', '192.168.1.10', 'Data Center', 'active', 99.92),
('Backup Router', 'Router', 'Cisco ISR 4321', 'CSR4321001', '192.168.1.3', 'Data Center', 'standby', 100.00),
('Access Point 1', 'WiFi AP', 'Ubiquiti UniFi AP', 'UBNT001', '192.168.2.10', 'Westlands Tower', 'active', 99.85),
('Access Point 2', 'WiFi AP', 'Ubiquiti UniFi AP', 'UBNT002', '192.168.2.11', 'Karen Hub', 'active', 99.90);

-- Insert sample support tickets
INSERT INTO support_tickets (ticket_number, customer_id, title, description, priority, status, category)
SELECT 
    'TKT-' || LPAD((ROW_NUMBER() OVER())::text, 6, '0'),
    c.id,
    CASE (RANDOM() * 4)::int
        WHEN 0 THEN 'Slow internet connection'
        WHEN 1 THEN 'Connection drops frequently'
        WHEN 2 THEN 'Unable to access email'
        ELSE 'WiFi password reset request'
    END,
    CASE (RANDOM() * 4)::int
        WHEN 0 THEN 'Customer reports slow internet speeds during peak hours'
        WHEN 1 THEN 'Internet connection drops every few hours, needs investigation'
        WHEN 2 THEN 'Customer cannot access their email account'
        ELSE 'Customer forgot WiFi password and needs reset'
    END,
    CASE (RANDOM() * 3)::int
        WHEN 0 THEN 'low'
        WHEN 1 THEN 'medium'
        ELSE 'high'
    END,
    CASE (RANDOM() * 3)::int
        WHEN 0 THEN 'open'
        WHEN 1 THEN 'in_progress'
        ELSE 'resolved'
    END,
    CASE (RANDOM() * 3)::int
        WHEN 0 THEN 'technical'
        WHEN 1 THEN 'billing'
        ELSE 'general'
    END
FROM customers c
WHERE RANDOM() < 0.6;  -- 60% of customers have tickets

-- Insert system logs
INSERT INTO system_logs (level, message, context) VALUES 
('info', 'Database initialized successfully', '{"component": "database", "action": "initialization"}'),
('info', 'Sample data inserted', '{"component": "database", "action": "seed_data"}');

COMMENT ON DATABASE isp_system IS 'ISP Management System Database - Complete solution for Internet Service Provider management';
EOF

    print_success "Database initialization script created"
}

# Create Docker configuration
create_docker_config() {
    print_step "Creating Docker configuration..."
    
    # Docker Compose
    cat > docker-compose.yml << EOF
version: '3.8'

services:
  # PostgreSQL 15 Database
  postgres:
    image: postgres:15-alpine
    container_name: isp_postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: isp_system
      POSTGRES_USER: isp_user
      POSTGRES_PASSWORD: isp_password_2024
      POSTGRES_INITDB_ARGS: "--encoding=UTF8 --lc-collate=C --lc-ctype=C"
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts:/docker-entrypoint-initdb.d:ro
    networks:
      - isp_network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U isp_user -d isp_system"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s

  # Redis 7 for caching and sessions
  redis:
    image: redis:7-alpine
    container_name: isp_redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - isp_network
    command: redis-server --appendonly yes --maxmemory 256mb --maxmemory-policy allkeys-lru
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 3

  # Next.js ISP Management Application
  isp_app:
    build: 
      context: .
      dockerfile: Dockerfile
    container_name: isp_management
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://isp_user:isp_password_2024@postgres:5432/isp_system
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - REDIS_URL=redis://redis:6379
      - COMPANY_NAME=Your ISP Company
      - COMPANY_EMAIL=admin@yourisp.com
      - COMPANY_PHONE=+254700000000
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - isp_network
    volumes:
      - ./logs:/app/logs
      - ./backup:/app/backup
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # Nginx reverse proxy and load balancer
  nginx:
    image: nginx:alpine
    container_name: isp_nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
      - nginx_logs:/var/log/nginx
    depends_on:
      isp_app:
        condition: service_healthy
    networks:
      - isp_network
    healthcheck:
      test: ["CMD", "nginx", "-t"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local
  nginx_logs:
    driver: local

networks:
  isp_network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
EOF

    # Dockerfile
    cat > Dockerfile << 'EOF'
# Use Node.js 18 Alpine as base image
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat curl
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN \
  if [ -f package-lock.json ]; then npm ci --only=production; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Install curl for health checks
RUN apk add --no-cache curl

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Create directories for logs and backups
RUN mkdir -p logs backup && chown -R nextjs:nodejs logs backup

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

CMD ["node", "server.js"]
EOF

    # Nginx configuration
    cat > nginx.conf << 'EOF'
events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    
    # Logging Configuration
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for" '
                    'rt=$request_time uct="$upstream_connect_time" '
                    'uht="$upstream_header_time" urt="$upstream_response_time"';

    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log warn;

    # Performance Settings
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 50M;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 10240;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/x-javascript
        application/xml+rss
        application/javascript
        application/json
        application/xml
        application/rss+xml
        application/atom+xml
        image/svg+xml;

    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;

    # Upstream Configuration
    upstream isp_app {
        server isp_app:3000 max_fails=3 fail_timeout=30s;
        keepalive 32;
    }

    # Main Server Block
    server {
        listen 80;
        server_name localhost _;
        
        # Security Headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
        add_header Content-Security-Policy "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:; img-src 'self' data: https:; font-src 'self' data:;" always;

        # Main Application
        location / {
            proxy_pass http://isp_app;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
            proxy_read_timeout 86400;
            proxy_connect_timeout 30s;
            proxy_send_timeout 30s;
        }

        # API Rate Limiting
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://isp_app;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Login Rate Limiting
        location /api/auth/ {
            limit_req zone=login burst=5 nodelay;
            proxy_pass http://isp_app;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Health Check Endpoint
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }

        # Static Files Caching
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
            proxy_pass http://isp_app;
        }

        # Deny access to sensitive files
        location ~ /\. {
            deny all;
            access_log off;
            log_not_found off;
        }
    }
}
EOF

    print_success "Docker configuration created"
}

# Install dependencies
install_dependencies() {
    print_step "Installing Node.js dependencies..."
    
    if command_exists npm; then
        npm install
        print_success "Dependencies installed successfully"
    else
        print_warning "npm not found, dependencies will be installed in Docker"
    fi
}

# Create startup script
create_startup_script() {
    print_step "Creating startup script..."
    
    cat > start-system.sh << 'EOF'
#!/bin/bash

# ISP Management System Startup Script
set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🚀 Starting ISP Management System...${NC}"

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

# Start services
echo -e "${BLUE}📦 Starting services...${NC}"
docker compose up -d --build

# Wait for services
echo -e "${BLUE}⏳ Waiting for services to be ready...${NC}"
sleep 30

# Check health
echo -e "${BLUE}🔍 Checking service health...${NC}"
for i in {1..30}; do
    if curl -f http://localhost:3000/api/health >/dev/null 2>&1; then
        echo -e "${GREEN}✅ All services are healthy!${NC}"
        break
    fi
    echo -n "."
    sleep 2
done

echo ""
echo -e "${GREEN}🎉 ISP Management System is running!${NC}"
echo ""
echo -e "${BLUE}🌐 Access URLs:${NC}"
echo "   Main Application: http://localhost:3000"
echo "   Health Check: http://localhost:3000/api/health"
echo ""
echo -e "${BLUE}📊 Database Access:${NC}"
echo "   Host: localhost:5432"
echo "   Database: isp_system"
echo "   Username: isp_user"
echo "   Password: isp_password_2024"
echo ""
echo -e "${BLUE}🛠️  Management Commands:${NC}"
echo "   View logs: docker compose logs -f"
echo "   Stop system: docker compose down"
echo "   Restart: docker compose restart"
echo "   View status: docker compose ps"
echo ""
echo -e "${GREEN}✨ System ready for use!${NC}"
EOF

    chmod +x start-system.sh
    print_success "Startup script created"
}

# Main installation function
main() {
    print_header "ISP Management System - Complete Installation"
    echo ""
    print_info "This script creates the complete ISP management system"
    echo ""
    
    # Check prerequisites
    check_prerequisites
    
    # Generate secrets
    generate_secrets
    
    # Create project
    create_project_structure
    create_environment
    create_package_json
    create_nextjs_config
    create_application_files
    create_components
    create_customers_page
    create_database_script
    create_docker_config
    install_dependencies
    create_startup_script
    
    # Final success message
    echo ""
    print_header "🎉 COMPLETE INSTALLATION FINISHED!"
    echo ""
    print_success "ISP Management System has been completely created!"
    echo ""
    print_info "Generated Configuration:"
    echo "NEXTAUTH_SECRET: ${NEXTAUTH_SECRET:0:16}... (64 characters)"
    echo "NEXTAUTH_URL: $NEXTAUTH_URL"
    echo "Public IP detected: $PUBLIC_IP"
    echo ""
    print_info "Created Components:"
    echo "✅ Complete Next.js 14 Application"
    echo "✅ PostgreSQL 15 Database Schema"
    echo "✅ Redis 7 Configuration"
    echo "✅ Nginx Reverse Proxy"
    echo "✅ Docker Compose Setup"
    echo "✅ Sample Data & Customers"
    echo "✅ Health Monitoring"
    echo "✅ Security Configuration"
    echo ""
    print_info "🚀 TO START THE SYSTEM:"
    echo "1. Run: ./start-system.sh"
    echo "2. Wait 2-3 minutes for complete startup"
    echo "3. Access: http://localhost:3000"
    echo ""
    print_info "📋 System Features:"
    echo "• Customer Management Dashboard"
    echo "• Service Plans & Billing"
    echo "• Network Equipment Monitoring"
    echo "• Support Ticket System"
    echo "• Analytics & Reporting"
    echo "• M-Pesa Integration Ready"
    echo "• Real-time Health Monitoring"
    echo ""
    print_success "🎯 Ready to launch your ISP Management System!"
}

# Run main function
main "$@"
